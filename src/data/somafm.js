// SomaFM curated channels — listener-supported, commercial-free, San Francisco.
// Hand-maintained list; the catalog rarely changes. All located at SomaFM HQ.
// Channel slugs and stream URLs from somafm.com.

const SF = { lat: 37.7749, lng: -122.4194 };

function ch(slug, name, tags = []) {
  return {
    id: `soma-${slug}`,
    name: `SomaFM · ${name}`,
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    tags: tags.length ? tags : ["eclectic"],
    codec: "MP3",
    kbps: 128,
    lat: SF.lat,
    lng: SF.lng,
    proto: "https",
    streamUrl: `https://ice4.somafm.com/${slug}-128-mp3`,
    listeners: null,
    source: "somafm",
    geoConfidence: "exact",
  };
}

export const SOMAFM_STATIONS = [
  ch("groovesalad",  "Groove Salad",          ["downtempo", "ambient"]),
  ch("u80s",         "Underground 80s",       ["80s", "new-wave"]),
  ch("indiepop",     "Indie Pop Rocks!",      ["indie", "pop"]),
  ch("dronezone",    "Drone Zone",            ["ambient", "atmospheric"]),
  ch("defcon",       "DEF CON Radio",         ["electronic", "hacker"]),
  ch("lush",         "Lush",                  ["downtempo", "vocals"]),
  ch("missioncontrol","Mission Control",      ["ambient", "space"]),
  ch("secretagent",  "Secret Agent",          ["lounge", "spy"]),
  ch("bagel",        "BAGeL Radio",           ["indie", "rock"]),
  ch("sf1033",       "SF 10-33",              ["scanner", "ambient"]),
  ch("sonicuniverse","Sonic Universe",        ["jazz", "experimental"]),
  ch("brfm",         "Black Rock FM",         ["festival", "eclectic"]),
  ch("specials",     "Specials",              ["holiday"]),
  ch("seventies",    "Left Coast 70s",        ["70s", "rock"]),
  ch("thetrip",      "The Trip",              ["psy-trance", "progressive"]),
  ch("deepspaceone", "Deep Space One",        ["ambient", "electronic"]),
  ch("digitalis",    "Digitalis",             ["indie", "electronic"]),
  ch("dubstep",      "Dub Step Beyond",       ["dubstep", "bass"]),
  ch("seventies",    "Left Coast 70s",        ["70s", "rock"]),
  ch("folkfwd",      "Folk Forward",          ["folk", "indie"]),
  ch("poptron",      "PopTron",               ["electropop", "indie"]),
  ch("cliqhop",      "Cliq Hop",              ["idm", "electronic"]),
  ch("thistle",      "ThistleRadio",          ["celtic", "folk"]),
  ch("suburbsofgoa", "Suburbs of Goa",        ["world", "fusion"]),
  ch("metal",        "Metal Detector",        ["metal"]),
];

// Dedupe (the array literal above accidentally repeats 'seventies'; use the slug
// as identity so even if a careless edit duplicates a row we only keep one).
const seen = new Set();
export const SOMAFM = SOMAFM_STATIONS.filter((s) => {
  if (seen.has(s.id)) return false;
  seen.add(s.id);
  return true;
});
