import { useEffect, useMemo, useState } from "react";
import GlobeScene from "./components/GlobeScene";
import stations from "./data/stations";
import usePlayer from "./hooks/usePlayer";
import {
  COUNTRIES,
  getRadioCountries,
  getStationsByCountry,
  searchRadioStations
} from "./services/radioApi";

export default function App() {
  const [query, setQuery] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryList, setCountryList] = useState(COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState("PH");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("globeradio_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [liveStations, setLiveStations] = useState(stations);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    currentStation,
    selectStation,
    playing,
    togglePlay,
    volume,
    setVolume,
    muted,
    toggleMute,
    status
  } = usePlayer(stations[0]);

  const loadLiveStations = async () => {
    try {
      setLoading(true);
      setError("");

      const results = query.trim()
        ? await searchRadioStations(query, selectedCountry)
        : await getStationsByCountry(selectedCountry);

      if (results.length === 0) {
        setError("No stations found.");
        return;
      }

      setLiveStations(results);
      selectStation(results[0]);
    } catch {
      setError("Could not load live stations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  useEffect(() => {
    async function loadCountries() {
      try {
        const countries = await getRadioCountries();
        setCountryList(countries);
      } catch {
        console.log("Using fallback countries");
      }
    }

    loadCountries();
  }, []);

  useEffect(() => {
    localStorage.setItem("globeradio_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredCountries = useMemo(() => {
    return countryList.filter((country) =>
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countryList, countrySearch]);

  const filteredStations = useMemo(() => {
    return liveStations.filter((station) => {
      const text = `${station.name} ${station.city} ${station.country} ${station.genre}`;
      const matchesSearch = text.toLowerCase().includes(query.toLowerCase());
      const matchesFavorite =
        !showFavoritesOnly || favorites.includes(station.id);

      return matchesSearch && matchesFavorite;
    });
  }, [query, favorites, showFavoritesOnly, liveStations]);

  const toggleFavorite = (stationId) => {
    setFavorites((prev) =>
      prev.includes(stationId)
        ? prev.filter((id) => id !== stationId)
        : [...prev, stationId]
    );
  };

  const playNext = () => {
    if (liveStations.length === 0) return;

    const currentIndex = liveStations.findIndex(
      (station) => station.id === currentStation.id
    );

    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const next = liveStations[(safeIndex + 1) % liveStations.length];

    selectStation(next);
  };

  const playPrev = () => {
    if (liveStations.length === 0) return;

    const currentIndex = liveStations.findIndex(
      (station) => station.id === currentStation.id
    );

    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const prev =
      liveStations[
        (safeIndex - 1 + liveStations.length) % liveStations.length
      ];

    selectStation(prev);
  };

  const isFavorite = favorites.includes(currentStation.id);

  return (
    <main className="app">
      <section className="sidebar">
        <div className="brand">🌍 GlobeWave</div>
        <p className="tagline">Premium world radio experience</p>

        <input
          className="search-input"
          placeholder="Search country..."
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
        />

        <select
          className="search-input"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setQuery("");
          }}
        >
          {filteredCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>

        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search station, city, country..."
        />

        <button
          className={
            showFavoritesOnly ? "filter-toggle active" : "filter-toggle"
          }
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
        >
          ♥ Favorites Only
        </button>

        <button className="filter-toggle" onClick={loadLiveStations}>
          {loading ? "Loading stations..." : "Load Country Stations"}
        </button>

        {error && <p className="error-text">{error}</p>}

        <div className="station-list">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className={
                currentStation.id === station.id
                  ? "station-card active"
                  : "station-card"
              }
            >
              <button
                className="station-main"
                onClick={() => selectStation(station)}
              >
                <strong>{station.name}</strong>
                <span>
                  {station.city}, {station.country}
                </span>
              </button>

              <button
                className={
                  favorites.includes(station.id)
                    ? "favorite-button active"
                    : "favorite-button"
                }
                onClick={() => toggleFavorite(station.id)}
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="stage">
        <div className="glow" />

        <GlobeScene
          stations={liveStations}
          currentStation={currentStation}
          onSelect={selectStation}
        />

        <div className="now-playing">
          <p className="eyebrow">Now Playing</p>

          <button
            className={isFavorite ? "big-favorite active" : "big-favorite"}
            onClick={() => toggleFavorite(currentStation.id)}
          >
            ♥
          </button>

          <h1>{currentStation.name}</h1>

          <p>
            {currentStation.city}, {currentStation.country}
          </p>

          <p className="genre">{currentStation.genre}</p>

          <div className="player-controls">
            <button onClick={playPrev}>⏮</button>

            <button
              onClick={togglePlay}
              className={playing ? "play-button pause" : "play-button"}
            >
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>

            <button onClick={playNext}>⏭</button>
          </div>
        </div>

        <div className="mini-player">
          <div className="mini-info">
            <strong>{currentStation.name}</strong>
            <span>
              {currentStation.city}, {currentStation.country}
            </span>

            <small className={`stream-status ${status}`}>
              {status === "loading" && "Connecting..."}
              {status === "playing" && "Live now"}
              {status === "paused" && "Paused"}
              {status === "error" && "Stream unavailable"}
              {status === "idle" && "Ready"}
            </small>
          </div>

          <button className="mute-button" onClick={toggleMute}>
            {muted || volume === 0 ? "🔇" : volume < 40 ? "🔉" : "🔊"}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-slider"
          />

          <div className="player-controls mini-controls">
            <button onClick={playPrev}>⏮</button>

            <button
              onClick={togglePlay}
              className={playing ? "mini-play pause" : "mini-play"}
            >
              {status === "loading" ? "…" : playing ? "❚❚" : "▶"}
            </button>

            <button onClick={playNext}>⏭</button>
          </div>
        </div>
      </section>
    </main>
  );
}