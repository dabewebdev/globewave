// ISO-3166-1 alpha-2 country code → capital city coordinates.
// Used as a fallback when a station has no geo and no resolvable city.
// Coverage targets the countries with the most radio-browser stations.

export const COUNTRY_CAPITALS = {
  US: { lat: 38.8951, lng: -77.0364 },   // Washington, D.C.
  GB: { lat: 51.5074, lng: -0.1278 },    // London
  DE: { lat: 52.52,   lng: 13.405 },     // Berlin
  FR: { lat: 48.8566, lng: 2.3522 },     // Paris
  IT: { lat: 41.9028, lng: 12.4964 },    // Rome
  ES: { lat: 40.4168, lng: -3.7038 },    // Madrid
  NL: { lat: 52.3676, lng: 4.9041 },     // Amsterdam
  BE: { lat: 50.8503, lng: 4.3517 },     // Brussels
  PT: { lat: 38.7223, lng: -9.1393 },    // Lisbon
  IE: { lat: 53.3498, lng: -6.2603 },    // Dublin
  AT: { lat: 48.2082, lng: 16.3738 },    // Vienna
  CH: { lat: 46.948,  lng: 7.4474 },     // Bern
  PL: { lat: 52.2297, lng: 21.0122 },    // Warsaw
  CZ: { lat: 50.0755, lng: 14.4378 },    // Prague
  HU: { lat: 47.4979, lng: 19.0402 },    // Budapest
  GR: { lat: 37.9838, lng: 23.7275 },    // Athens
  RO: { lat: 44.4268, lng: 26.1025 },    // Bucharest
  BG: { lat: 42.6977, lng: 23.3219 },    // Sofia
  HR: { lat: 45.815,  lng: 15.9819 },    // Zagreb
  RS: { lat: 44.7866, lng: 20.4489 },    // Belgrade
  UA: { lat: 50.4501, lng: 30.5234 },    // Kyiv
  RU: { lat: 55.7558, lng: 37.6173 },    // Moscow
  TR: { lat: 39.9334, lng: 32.8597 },    // Ankara
  IS: { lat: 64.1466, lng: -21.9426 },   // Reykjavik
  NO: { lat: 59.9139, lng: 10.7522 },    // Oslo
  SE: { lat: 59.3293, lng: 18.0686 },    // Stockholm
  FI: { lat: 60.1699, lng: 24.9384 },    // Helsinki
  DK: { lat: 55.6761, lng: 12.5683 },    // Copenhagen
  EE: { lat: 59.437,  lng: 24.7536 },    // Tallinn
  LV: { lat: 56.9496, lng: 24.1052 },    // Riga
  LT: { lat: 54.6872, lng: 25.2797 },    // Vilnius
  CA: { lat: 45.4215, lng: -75.6972 },   // Ottawa
  MX: { lat: 19.4326, lng: -99.1332 },   // Mexico City
  BR: { lat: -15.7942, lng: -47.8825 },  // Brasília
  AR: { lat: -34.6037, lng: -58.3816 },  // Buenos Aires
  CL: { lat: -33.4489, lng: -70.6693 },  // Santiago
  CO: { lat: 4.711,   lng: -74.0721 },   // Bogotá
  PE: { lat: -12.0464, lng: -77.0428 },  // Lima
  VE: { lat: 10.4806, lng: -66.9036 },   // Caracas
  UY: { lat: -34.9011, lng: -56.1645 },  // Montevideo
  EC: { lat: -0.1807, lng: -78.4678 },   // Quito
  BO: { lat: -16.5,   lng: -68.15 },     // La Paz
  PY: { lat: -25.2637, lng: -57.5759 },  // Asunción
  CR: { lat: 9.9281,  lng: -84.0907 },   // San José
  PA: { lat: 8.9824,  lng: -79.5199 },   // Panama City
  CU: { lat: 23.1136, lng: -82.3666 },   // Havana
  DO: { lat: 18.4861, lng: -69.9312 },   // Santo Domingo
  PR: { lat: 18.4655, lng: -66.1057 },   // San Juan
  JP: { lat: 35.6762, lng: 139.6503 },   // Tokyo
  CN: { lat: 39.9042, lng: 116.4074 },   // Beijing
  TW: { lat: 25.033,  lng: 121.5654 },   // Taipei
  KR: { lat: 37.5665, lng: 126.978 },    // Seoul
  HK: { lat: 22.3193, lng: 114.1694 },   // Hong Kong
  SG: { lat: 1.3521,  lng: 103.8198 },   // Singapore
  MY: { lat: 3.139,   lng: 101.6869 },   // Kuala Lumpur
  TH: { lat: 13.7563, lng: 100.5018 },   // Bangkok
  VN: { lat: 21.0285, lng: 105.8542 },   // Hanoi
  ID: { lat: -6.2088, lng: 106.8456 },   // Jakarta
  PH: { lat: 14.5995, lng: 120.9842 },   // Manila
  IN: { lat: 28.6139, lng: 77.209 },     // New Delhi
  PK: { lat: 33.6844, lng: 73.0479 },    // Islamabad
  BD: { lat: 23.8103, lng: 90.4125 },    // Dhaka
  LK: { lat: 6.9271,  lng: 79.8612 },    // Colombo
  AU: { lat: -35.2809, lng: 149.13 },    // Canberra
  NZ: { lat: -41.2865, lng: 174.7762 },  // Wellington
  ZA: { lat: -25.7479, lng: 28.2293 },   // Pretoria
  EG: { lat: 30.0444, lng: 31.2357 },    // Cairo
  MA: { lat: 33.9716, lng: -6.8498 },    // Rabat
  DZ: { lat: 36.7538, lng: 3.0588 },     // Algiers
  TN: { lat: 36.8065, lng: 10.1815 },    // Tunis
  NG: { lat: 9.0765,  lng: 7.3986 },     // Abuja
  KE: { lat: -1.2864, lng: 36.8172 },    // Nairobi
  ET: { lat: 9.03,    lng: 38.74 },      // Addis Ababa
  GH: { lat: 5.6037,  lng: -0.187 },     // Accra
  SN: { lat: 14.6928, lng: -17.4467 },   // Dakar
  IL: { lat: 31.7683, lng: 35.2137 },    // Jerusalem
  AE: { lat: 24.4539, lng: 54.3773 },    // Abu Dhabi
  SA: { lat: 24.7136, lng: 46.6753 },    // Riyadh
  IR: { lat: 35.6892, lng: 51.389 },     // Tehran
  IQ: { lat: 33.3152, lng: 44.3661 },    // Baghdad
  JO: { lat: 31.9454, lng: 35.9284 },    // Amman
  LB: { lat: 33.8938, lng: 35.5018 },    // Beirut
  QA: { lat: 25.2854, lng: 51.531 },     // Doha
  KW: { lat: 29.3759, lng: 47.9774 },    // Kuwait City
  BH: { lat: 26.2235, lng: 50.5876 },    // Manama
  OM: { lat: 23.588,  lng: 58.3829 },    // Muscat
  YE: { lat: 15.3694, lng: 44.191 },     // Sana'a
  SY: { lat: 33.5138, lng: 36.2765 },    // Damascus
};

export function capitalFor(countryCode) {
  if (!countryCode) return null;
  return COUNTRY_CAPITALS[countryCode.toUpperCase()] || null;
}
