const BASE_URL = "https://de1.api.radio-browser.info/json";

export const COUNTRIES = [
  { label: "Philippines", code: "PH", lat: 12.8797, lng: 121.774 },
  { label: "United States", code: "US", lat: 39.8283, lng: -98.5795 },
  { label: "Japan", code: "JP", lat: 36.2048, lng: 138.2529 },
  { label: "United Kingdom", code: "GB", lat: 55.3781, lng: -3.436 },
  { label: "Canada", code: "CA", lat: 56.1304, lng: -106.3468 },
  { label: "Australia", code: "AU", lat: -25.2744, lng: 133.7751 },
  { label: "Brazil", code: "BR", lat: -14.235, lng: -51.9253 },
  { label: "France", code: "FR", lat: 46.2276, lng: 2.2137 }
];

function getCountryCenter(countryCode) {
  return COUNTRIES.find((country) => country.code === countryCode) || COUNTRIES[0];
}

function randomNear(center, spread = 8) {
  return center + (Math.random() - 0.5) * spread;
}

function cleanStation(station, fallbackCountryCode = "PH") {
  const center = getCountryCenter(fallbackCountryCode);

  return {
    id: station.stationuuid,
    name: station.name || "Unknown Station",
    city: station.state || station.country || "Unknown",
    country: station.country || "Unknown",
    genre: station.tags ? station.tags.split(",")[0] : "Radio",
    listeners: station.clickcount ? `${station.clickcount}` : "Live",
    lat: station.geo_lat ? Number(station.geo_lat) : randomNear(center.lat),
    lng: station.geo_long ? Number(station.geo_long) : randomNear(center.lng),
    featured: false,
    quality: station.codec || "LIVE",
    streamUrl: station.url_resolved || station.url
  };
}

export async function getStationsByCountry(countryCode = "PH") {
  const url =
    `${BASE_URL}/stations/search?` +
    new URLSearchParams({
      countrycode: countryCode,
      limit: "100",
      hidebroken: "true",
      order: "clickcount",
      reverse: "true"
    });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch stations by country");
  }

  const data = await response.json();

  return data
    .filter((station) => station.url_resolved || station.url)
    .map((station) => cleanStation(station, countryCode));
}

export async function searchRadioStations(query, fallbackCountryCode = "PH") {
  const searchTerm = query.trim() || "rock";

  const url =
    `${BASE_URL}/stations/search?` +
    new URLSearchParams({
      name: searchTerm,
      limit: "100",
      hidebroken: "true",
      order: "clickcount",
      reverse: "true"
    });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch radio stations");
  }

  const data = await response.json();

  return data
    .filter((station) => station.url_resolved || station.url)
    .map((station) => cleanStation(station, fallbackCountryCode));
}

export async function getRadioCountries() {
  const response = await fetch(`${BASE_URL}/countries`);

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  const data = await response.json();

  return data
    .filter((country) => country.iso_3166_1 && country.stationcount > 0)
    .map((country) => ({
      label: country.name,
      code: country.iso_3166_1
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}