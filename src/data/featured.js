// Curated public-broadcaster picks looked up in radio-browser at fetch time.
// We don't hardcode their stream URLs — we pair a name with a country code and
// trust radio-browser's verified result. URL changes are absorbed automatically.
//
// Each entry: { name: search term, code: ISO country code }

export const FEATURED_PATTERNS = [
  // United Kingdom
  { name: "BBC World Service", code: "GB" },
  { name: "BBC Radio 6 Music", code: "GB" },

  // Italy
  { name: "Rai Radio1", code: "IT" },
  { name: "Rai Radio2", code: "IT" },
  { name: "Rai Radio3", code: "IT" },

  // Spain
  { name: "Radio Nacional de España", code: "ES" },
  { name: "Catalunya Música", code: "ES" },

  // Netherlands
  { name: "NPO Radio 1", code: "NL" },
  { name: "NPO Radio 4", code: "NL" },
  { name: "3FM", code: "NL" },

  // Belgium
  { name: "Klara", code: "BE" },
  { name: "VRT MNM", code: "BE" },

  // Switzerland
  { name: "SRF 1", code: "CH" },
  { name: "SRF 2 Kultur", code: "CH" },

  // Austria
  { name: "Ö1", code: "AT" },
  { name: "FM4", code: "AT" },

  // Denmark
  { name: "DR P1", code: "DK" },
  { name: "DR P3", code: "DK" },
  { name: "DR P6 Beat", code: "DK" },

  // Sweden
  { name: "Sveriges Radio P1", code: "SE" },
  { name: "Sveriges Radio P3", code: "SE" },

  // Norway
  { name: "NRK P1", code: "NO" },
  { name: "NRK P3", code: "NO" },

  // Finland
  { name: "Yle Radio 1", code: "FI" },
  { name: "YleX", code: "FI" },

  // Czech Republic
  { name: "Český rozhlas Radiožurnál", code: "CZ" },
  { name: "Vltava", code: "CZ" },

  // Poland
  { name: "Polskie Radio Trójka", code: "PL" },

  // Portugal
  { name: "Antena 1", code: "PT" },
  { name: "Antena 3", code: "PT" },

  // Australia
  { name: "Triple J", code: "AU" },
  { name: "ABC Classic", code: "AU" },
  { name: "ABC Radio National", code: "AU" },

  // New Zealand
  { name: "RNZ National", code: "NZ" },
  { name: "RNZ Concert", code: "NZ" },

  // Japan
  { name: "NHK Radio 1", code: "JP" },
  { name: "NHK FM", code: "JP" },

  // Korea
  { name: "KBS Cool FM", code: "KR" },

  // Canada
  { name: "CBC Radio One", code: "CA" },
  { name: "ICI Musique", code: "CA" },

  // United States — adjacent to SomaFM/Radio Paradise
  { name: "KEXP", code: "US" },
  { name: "KCRW", code: "US" },
  { name: "WFMU", code: "US" },
  { name: "WWOZ", code: "US" },
  { name: "WBGO", code: "US" },
  { name: "WBEZ", code: "US" },
];

// Subset shown on Worldwide queries — keep this conservative so we don't
// fire 40 parallel radio-browser requests on the default landing view.
export const WORLDWIDE_FEATURED_NAMES = new Set([
  "BBC World Service",
  "FIP",
  "France Inter",
  "Deutschlandfunk",
  "NHK Radio 1",
  "Triple J",
  "RNZ National",
  "Sveriges Radio P1",
  "DR P1",
  "Rai Radio3",
  "NPO Radio 4",
  "KEXP",
  "WFMU",
]);
