import { capitalFor } from "../data/countryCapitals.js";
import { usStateCapital } from "../data/usStateCapitals.js";
import { SOMAFM } from "../data/somafm.js";

const MIRRORS = [
  "https://de1.api.radio-browser.info/json",
  "https://nl1.api.radio-browser.info/json",
  "https://at1.api.radio-browser.info/json",
];

export const FALLBACK_COUNTRIES = [
  { code: "WW", name: "Worldwide", count: 0 },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "JP", name: "Japan" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "PH", name: "Philippines" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "MX", name: "Mexico" },
];

// Fallback world center if a station has no usable country either.
const NULL_ISLAND_FALLBACK = { lat: 12, lng: 0 };

function detectProto(url) {
  if (!url) return "https";
  return url.startsWith("http://") ? "http" : "https";
}

function parseTags(raw) {
  if (!raw) return ["radio"];
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 4);
}

// Reject known-bogus geo: literal Null Island, NaN, way out of bounds.
function geoIsValid(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  // (0, 0) is Null Island — almost always means "I had no real value".
  if (Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01) return false;
  return true;
}

function pickFallbackGeo(station) {
  // 1) US state capital if we have one
  if (
    (station.countryCode === "US" || station.country === "United States") &&
    station.state
  ) {
    const s = usStateCapital(station.state);
    if (s) return { lat: s.lat, lng: s.lng, geoConfidence: "state" };
  }
  // 2) Country capital
  const cap = capitalFor(station.countryCode || "");
  if (cap) return { lat: cap.lat, lng: cap.lng, geoConfidence: "capital" };
  // 3) Last resort
  return { ...NULL_ISLAND_FALLBACK, geoConfidence: "unknown" };
}

function normalize(rawStation) {
  const url = rawStation.url_resolved || rawStation.url;
  const lat = rawStation.geo_lat != null && rawStation.geo_lat !== "" ? Number(rawStation.geo_lat) : NaN;
  const lng = rawStation.geo_long != null && rawStation.geo_long !== "" ? Number(rawStation.geo_long) : NaN;
  const valid = geoIsValid(lat, lng);

  const partial = {
    id: rawStation.stationuuid,
    name: (rawStation.name || "Unknown").trim(),
    state: (rawStation.state || "").trim(),
    city: (rawStation.state || rawStation.country || "").trim() || "—",
    country: (rawStation.country || "").trim() || "Unknown",
    countryCode: rawStation.countrycode || "",
    tags: parseTags(rawStation.tags),
    codec: (rawStation.codec || "MP3").toUpperCase(),
    kbps: Number(rawStation.bitrate) || 128,
    proto: detectProto(url),
    streamUrl: url,
    listeners: rawStation.clickcount ?? null,
    source: "radio-browser",
  };

  if (valid) {
    return { ...partial, lat, lng, geoConfidence: "exact" };
  }
  const fb = pickFallbackGeo(partial);
  return { ...partial, ...fb, needsGeocode: !!partial.state || !!partial.country };
}

async function tryMirrors(path, init) {
  let lastErr;
  for (const base of MIRRORS) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) {
        lastErr = new Error(`${base} → ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("All mirrors failed");
}

function mergeWithSomaFM(stations, countryCode) {
  // Surface SomaFM only on US and Worldwide queries; dedupe against
  // radio-browser entries that point at the same stream URLs.
  if (countryCode && countryCode !== "WW" && countryCode !== "US") return stations;
  const existingUrls = new Set(stations.map((s) => s.streamUrl));
  const additions = SOMAFM.filter((s) => !existingUrls.has(s.streamUrl));
  // Put SomaFM near the top — they're high-quality curated picks.
  return [...additions, ...stations];
}

export async function getStationsByCountry(countryCode) {
  if (!countryCode || countryCode === "WW") return getTopStations();
  const params = new URLSearchParams({
    countrycode: countryCode,
    limit: "150",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  const data = await tryMirrors(`/stations/search?${params}`);
  const list = data
    .filter((s) => s.url_resolved || s.url)
    .map((s) => normalize(s));
  return mergeWithSomaFM(list, countryCode);
}

export async function getTopStations() {
  const params = new URLSearchParams({
    limit: "200",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  const data = await tryMirrors(`/stations/search?${params}`);
  const list = data
    .filter((s) => s.url_resolved || s.url)
    .map((s) => normalize(s));
  return mergeWithSomaFM(list, "WW");
}

export async function searchStations(query, countryCode) {
  const params = new URLSearchParams({
    name: query.trim(),
    limit: "150",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  if (countryCode && countryCode !== "WW") params.set("countrycode", countryCode);
  const data = await tryMirrors(`/stations/search?${params}`);
  return data
    .filter((s) => s.url_resolved || s.url)
    .map((s) => normalize(s));
}

export async function getCountries() {
  const data = await tryMirrors(`/countries`);
  const list = data
    .filter((c) => c.iso_3166_1 && c.stationcount > 0)
    .map((c) => ({
      code: c.iso_3166_1,
      name: c.name,
      count: c.stationcount,
    }))
    .sort((a, b) => b.count - a.count);
  return [{ code: "WW", name: "Worldwide", count: list.reduce((n, c) => n + c.count, 0) }, ...list];
}

// ── Geocoding ───────────────────────────────────────────────────────────────
// Resolves stations whose only geo info is a city/state/country string by
// asking the Vercel edge function which proxies Nominatim. CDN-cached on the
// server side; localStorage-cached on the client for instant rehydration.

const GEOCACHE_KEY = "globewave:geocache";

function loadGeoCache() {
  try {
    const raw = localStorage.getItem(GEOCACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveGeoCache(cache) {
  try {
    localStorage.setItem(GEOCACHE_KEY, JSON.stringify(cache));
  } catch {
    /* quota — drop oldest entries next time */
  }
}

function geocodeKey(station) {
  const parts = [];
  if (station.state) parts.push(station.state);
  if (station.country) parts.push(station.country);
  return parts.join(", ").toLowerCase();
}

let geocodeQueue = Promise.resolve();
function enqueueGeocode(fn) {
  geocodeQueue = geocodeQueue.then(fn).catch(() => {});
  return geocodeQueue;
}

async function fetchGeocode(query, countryCode) {
  const params = new URLSearchParams({ q: query });
  if (countryCode) params.set("country", countryCode);
  try {
    const res = await fetch(`/api/geocode?${params}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.found ? { lat: json.lat, lng: json.lng } : null;
  } catch {
    return null;
  }
}

// Async-resolves geo for stations that arrived without exact coords.
// Calls onUpdate(updatedStation) for each successful resolution so the
// caller can patch the rendering list incrementally.
export function geocodeMissingStations(stations, onUpdate) {
  const cache = loadGeoCache();
  let cacheDirty = false;
  let cancelled = false;

  for (const s of stations) {
    if (s.geoConfidence === "exact") continue;
    if (!s.needsGeocode) continue;
    const key = geocodeKey(s);
    if (!key) continue;

    if (cache[key]) {
      const { lat, lng } = cache[key];
      onUpdate({ ...s, lat, lng, geoConfidence: "geocoded" });
      continue;
    }

    enqueueGeocode(async () => {
      if (cancelled) return;
      // Polite spacing: 1 req/sec to respect Nominatim policy.
      // CDN cache on the proxy side returns instantly for repeats anyway.
      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled) return;
      const result = await fetchGeocode(key, s.countryCode);
      if (!result) return;
      cache[key] = result;
      cacheDirty = true;
      saveGeoCache(cache);
      cacheDirty = false;
      onUpdate({ ...s, lat: result.lat, lng: result.lng, geoConfidence: "geocoded" });
    });
  }

  // Flush cache if any inline cache hits dirtied it (none currently).
  if (cacheDirty) saveGeoCache(cache);

  return () => {
    cancelled = true;
  };
}
