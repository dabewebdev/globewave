// Vercel edge function — proxies OpenStreetMap Nominatim for city → lat/lng.
// CDN-cached 24h so repeated lookups for common cities are free.
// Used by GlobeWave to place radio-browser stations that arrive without geo
// (or with bogus 0,0 geo) in the right place on the globe.

export const config = { runtime: "edge" };

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const UA = "globewave/0.1 (https://globewave.vercel.app)";

function ok(body) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      // 24h on Vercel's CDN, then serve stale for a week while revalidating.
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "access-control-allow-origin": "*",
    },
  });
}

function bad(status, msg) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}

export default async function handler(req) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const country = url.searchParams.get("country") || "";

  if (!q || q.length < 2) return bad(400, "missing q");
  if (q.length > 100) return bad(400, "q too long");

  const params = new URLSearchParams({
    q,
    format: "json",
    limit: "1",
    "accept-language": "en",
  });
  if (country) params.set("countrycodes", country.toLowerCase());

  let res;
  try {
    res = await fetch(`${NOMINATIM}?${params}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
  } catch {
    return bad(502, "geocoder unreachable");
  }

  if (!res.ok) {
    if (res.status === 429) return bad(429, "rate limited");
    return bad(502, `geocoder ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return bad(502, "bad geocoder response");
  }

  if (!Array.isArray(data) || data.length === 0) {
    return ok({ found: false });
  }

  const top = data[0];
  const lat = Number(top.lat);
  const lng = Number(top.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return ok({ found: false });
  }

  return ok({
    found: true,
    lat,
    lng,
    name: top.display_name || "",
  });
}
