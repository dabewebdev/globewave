// US state capitals + DC. Keyed by full state name (case-insensitive on read)
// since radio-browser typically returns "California" rather than "CA".

const RAW = {
  Alabama: { lat: 32.3792, lng: -86.3077 },         // Montgomery
  Alaska: { lat: 58.3019, lng: -134.4197 },         // Juneau
  Arizona: { lat: 33.4484, lng: -112.074 },         // Phoenix
  Arkansas: { lat: 34.7465, lng: -92.2896 },        // Little Rock
  California: { lat: 38.5816, lng: -121.4944 },     // Sacramento
  Colorado: { lat: 39.7392, lng: -104.9903 },       // Denver
  Connecticut: { lat: 41.7637, lng: -72.6851 },     // Hartford
  Delaware: { lat: 39.1582, lng: -75.5244 },        // Dover
  Florida: { lat: 30.4383, lng: -84.2807 },         // Tallahassee
  Georgia: { lat: 33.749, lng: -84.388 },           // Atlanta
  Hawaii: { lat: 21.3069, lng: -157.8583 },         // Honolulu
  Idaho: { lat: 43.615, lng: -116.2023 },           // Boise
  Illinois: { lat: 39.7817, lng: -89.6501 },        // Springfield
  Indiana: { lat: 39.7684, lng: -86.1581 },         // Indianapolis
  Iowa: { lat: 41.5868, lng: -93.625 },             // Des Moines
  Kansas: { lat: 39.0473, lng: -95.6752 },          // Topeka
  Kentucky: { lat: 38.2009, lng: -84.8733 },        // Frankfort
  Louisiana: { lat: 30.4515, lng: -91.1871 },       // Baton Rouge
  Maine: { lat: 44.3106, lng: -69.7795 },           // Augusta
  Maryland: { lat: 38.9784, lng: -76.4922 },        // Annapolis
  Massachusetts: { lat: 42.3601, lng: -71.0589 },   // Boston
  Michigan: { lat: 42.7325, lng: -84.5555 },        // Lansing
  Minnesota: { lat: 44.9537, lng: -93.09 },         // Saint Paul
  Mississippi: { lat: 32.2988, lng: -90.1848 },     // Jackson
  Missouri: { lat: 38.5767, lng: -92.1735 },        // Jefferson City
  Montana: { lat: 46.5891, lng: -112.0391 },        // Helena
  Nebraska: { lat: 40.8136, lng: -96.7026 },        // Lincoln
  Nevada: { lat: 39.1638, lng: -119.7674 },         // Carson City
  "New Hampshire": { lat: 43.2081, lng: -71.5376 }, // Concord
  "New Jersey": { lat: 40.2206, lng: -74.7597 },    // Trenton
  "New Mexico": { lat: 35.6869, lng: -105.9378 },   // Santa Fe
  "New York": { lat: 42.6526, lng: -73.7562 },      // Albany
  "North Carolina": { lat: 35.7796, lng: -78.6382 },// Raleigh
  "North Dakota": { lat: 46.8083, lng: -100.7837 }, // Bismarck
  Ohio: { lat: 39.9612, lng: -82.9988 },            // Columbus
  Oklahoma: { lat: 35.4676, lng: -97.5164 },        // Oklahoma City
  Oregon: { lat: 44.9429, lng: -123.0351 },         // Salem
  Pennsylvania: { lat: 40.2732, lng: -76.8867 },    // Harrisburg
  "Rhode Island": { lat: 41.824, lng: -71.4128 },   // Providence
  "South Carolina": { lat: 34.0007, lng: -81.0348 },// Columbia
  "South Dakota": { lat: 44.3683, lng: -100.351 },  // Pierre
  Tennessee: { lat: 36.1627, lng: -86.7816 },       // Nashville
  Texas: { lat: 30.2672, lng: -97.7431 },           // Austin
  Utah: { lat: 40.7608, lng: -111.891 },            // Salt Lake City
  Vermont: { lat: 44.2624, lng: -72.5806 },         // Montpelier
  Virginia: { lat: 37.5407, lng: -77.436 },         // Richmond
  Washington: { lat: 47.0379, lng: -122.9007 },     // Olympia
  "West Virginia": { lat: 38.3498, lng: -81.6326 }, // Charleston
  Wisconsin: { lat: 43.0731, lng: -89.4012 },       // Madison
  Wyoming: { lat: 41.14, lng: -104.8202 },          // Cheyenne
  "District of Columbia": { lat: 38.8951, lng: -77.0364 },
};

const NORMALIZED = Object.fromEntries(
  Object.entries(RAW).map(([k, v]) => [k.toLowerCase(), v])
);

export function usStateCapital(stateName) {
  if (!stateName) return null;
  return NORMALIZED[stateName.trim().toLowerCase()] || null;
}
