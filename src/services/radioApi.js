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

const COUNTRY_CENTERS = {
  US: { lat: 39.8, lng: -98.6 },
  GB: { lat: 55.4, lng: -3.4 },
  FR: { lat: 46.2, lng: 2.2 },
  DE: { lat: 51.2, lng: 10.4 },
  JP: { lat: 36.2, lng: 138.3 },
  CA: { lat: 56.1, lng: -106.3 },
  AU: { lat: -25.3, lng: 133.8 },
  BR: { lat: -14.2, lng: -51.9 },
  PH: { lat: 12.9, lng: 121.8 },
  ES: { lat: 40.5, lng: -3.7 },
  IT: { lat: 41.9, lng: 12.6 },
  NL: { lat: 52.1, lng: 5.3 },
  SE: { lat: 60.1, lng: 18.6 },
  NO: { lat: 60.5, lng: 8.5 },
  MX: { lat: 23.6, lng: -102.6 },
};

// Simple stable hash → [-1, 1) so missing-geo stations land deterministically
// near the country center instead of jittering each refresh.
function hash01(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return ((h >>> 0) / 0xffffffff) * 2 - 1;
}

function deterministicNear(seed, center, spread = 6) {
  return center + hash01(seed) * spread;
}

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

function normalize(s, fallbackCode) {
  const url = s.url_resolved || s.url;
  const center = COUNTRY_CENTERS[fallbackCode] || { lat: 0, lng: 0 };
  const seedLat = `${s.stationuuid}-lat`;
  const seedLng = `${s.stationuuid}-lng`;
  return {
    id: s.stationuuid,
    name: (s.name || "Unknown").trim(),
    city: (s.state || s.country || "").trim() || "—",
    country: (s.country || "").trim() || "Unknown",
    countryCode: s.countrycode || fallbackCode || "",
    tags: parseTags(s.tags),
    codec: (s.codec || "MP3").toUpperCase(),
    kbps: Number(s.bitrate) || 128,
    lat:
      s.geo_lat != null && s.geo_lat !== "" && Number.isFinite(Number(s.geo_lat))
        ? Number(s.geo_lat)
        : deterministicNear(seedLat, center.lat),
    lng:
      s.geo_long != null && s.geo_long !== "" && Number.isFinite(Number(s.geo_long))
        ? Number(s.geo_long)
        : deterministicNear(seedLng, center.lng),
    proto: detectProto(url),
    streamUrl: url,
    listeners: s.clickcount ?? null,
  };
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
  return data
    .filter((s) => s.url_resolved || s.url)
    .map((s) => normalize(s, countryCode));
}

export async function getTopStations() {
  const params = new URLSearchParams({
    limit: "200",
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });
  const data = await tryMirrors(`/stations/search?${params}`);
  return data
    .filter((s) => s.url_resolved || s.url)
    .map((s) => normalize(s, s.countrycode || ""));
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
    .map((s) => normalize(s, countryCode || s.countrycode || ""));
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
