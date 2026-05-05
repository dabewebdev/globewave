import { useEffect, useMemo, useState } from "react";
import TopBar from "./components/TopBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import GlobePanel from "./components/GlobePanel.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import NowPlayingSheet from "./components/NowPlayingSheet.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import usePlayer from "./hooks/usePlayer.js";
import {
  FALLBACK_COUNTRIES,
  getCountries,
  getStationsByCountry,
  getTopStations,
} from "./services/radioApi.js";

const FAV_KEY = "radiome:favorites";
const COUNTRY_KEY = "radiome:country";
const SELECTED_KEY = "radiome:selected";
const SETTINGS_KEY = "radiome:settings";

const DEFAULT_SETTINGS = {
  reduceMotion: false,
  highContrast: false,
  autoNext: true,
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [route, setRoute] = useState("browse");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(() => loadJSON(COUNTRY_KEY, "WW"));
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => loadJSON(FAV_KEY, []));
  const [selectedId, setSelectedId] = useState(() => loadJSON(SELECTED_KEY, null));
  const [showSheet, setShowSheet] = useState(false);
  const [settings, setSettings] = useState(() => ({
    ...DEFAULT_SETTINGS,
    ...loadJSON(SETTINGS_KEY, {}),
  }));

  const [countries, setCountries] = useState(FALLBACK_COUNTRIES);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const player = usePlayer();
  const {
    active,
    playState,
    errorMsg,
    elapsedSec,
    volume,
    muted,
    play: playerPlay,
    pause: playerPause,
    stop: playerStop,
    retry,
    setVolume,
    toggleMute,
  } = player;

  // Persist favorites/country/selected/settings
  useEffect(() => saveJSON(FAV_KEY, favorites), [favorites]);
  useEffect(() => saveJSON(COUNTRY_KEY, country), [country]);
  useEffect(() => saveJSON(SELECTED_KEY, selectedId), [selectedId]);
  useEffect(() => saveJSON(SETTINGS_KEY, settings), [settings]);

  // Load countries once
  useEffect(() => {
    let cancelled = false;
    getCountries()
      .then((list) => {
        if (!cancelled && list.length > 1) setCountries(list);
      })
      .catch(() => {
        /* fallback already in state */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load stations when country changes (or on mount). Search is local-only;
  // a separate "Search Worldwide" button widens scope.
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setLoadError("");
    const fetcher = country === "WW" ? getTopStations() : getStationsByCountry(country);
    fetcher
      .then((list) => {
        if (cancelled) return;
        setStations(list);
        if (list.length === 0) setLoadError("No stations available for this region.");
      })
      .catch(() => {
        if (cancelled) return;
        setStations([]);
        setLoadError("Couldn't reach the radio directory. Try again or pick another country.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [country]);

  // Local + tag filter
  const filtered = useMemo(() => {
    let arr = stations;
    if (favoritesOnly) arr = arr.filter((s) => favorites.includes(s.id));
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((s) => {
        const blob = `${s.name} ${s.city} ${s.country} ${(s.tags || []).join(" ")}`.toLowerCase();
        return blob.includes(q);
      });
    }
    return arr;
  }, [stations, favoritesOnly, favorites, query]);

  const selectedStation = useMemo(
    () => stations.find((s) => s.id === selectedId) || null,
    [stations, selectedId]
  );

  const select = (id) => {
    setSelectedId(id);
  };

  const play = (id) => {
    const s = stations.find((x) => x.id === id);
    if (!s) return;
    if (active && active.id === id && playState === "playing") {
      playerPause();
      return;
    }
    setSelectedId(id);
    playerPlay(s);
  };

  const toggleFav = (id) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const stepStation = (delta) => {
    if (filtered.length === 0) return;
    const baseList = filtered;
    const currentIdx = baseList.findIndex((s) => s.id === (active?.id ?? selectedId));
    const safeIdx = currentIdx === -1 ? 0 : currentIdx;
    const next = baseList[(safeIdx + delta + baseList.length) % baseList.length];
    play(next.id);
  };

  // Auto-play next on error if setting enabled
  useEffect(() => {
    if (!settings.autoNext) return;
    if (playState !== "error") return;
    const t = setTimeout(() => stepStation(1), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playState, settings.autoNext]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " && active) {
        e.preventDefault();
        playerPause();
      } else if (e.key === "Escape") {
        setShowSheet(false);
      } else if (e.key.toLowerCase() === "f" && selectedStation) {
        toggleFav(selectedStation.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, selectedStation]);

  // MediaSession (lock-screen / Bluetooth controls on mobile)
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    if (!active) {
      navigator.mediaSession.metadata = null;
      return;
    }
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: active.name,
      artist: `${active.city || ""} · ${active.country || ""}`.trim(),
      album: "RadioMe",
    });
    const handlers = [
      ["play", () => active && playerPlay(active)],
      ["pause", () => playerPause()],
      ["stop", () => playerStop()],
      ["previoustrack", () => stepStation(-1)],
      ["nexttrack", () => stepStation(1)],
    ];
    handlers.forEach(([k, fn]) => {
      try {
        navigator.mediaSession.setActionHandler(k, fn);
      } catch { /* unsupported action */ }
    });
    try {
      navigator.mediaSession.playbackState =
        playState === "playing" ? "playing" : playState === "paused" ? "paused" : "none";
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playState]);

  const updateSetting = (key, value) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const isFav = active ? favorites.includes(active.id) : false;

  return (
    <div
      data-theme="meridian"
      className="frame"
      style={{
        width: "100%",
        height: "100vh",
        background: "var(--bg)",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, oklch(96% 0.02 70) 0%, transparent 60%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar
        route={route}
        onRoute={setRoute}
        country={country}
        countries={countries}
        onFavoritesOnly={setFavoritesOnly}
      />

      {route === "settings" ? (
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          <SettingsPage
            settings={settings}
            onChange={updateSetting}
            onBack={() => setRoute("browse")}
          />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "380px 1fr",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <div style={{ minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <Sidebar
              query={query}
              onQuery={setQuery}
              country={country}
              countries={countries}
              onCountry={setCountry}
              favoritesOnly={favoritesOnly}
              onFavoritesOnly={setFavoritesOnly}
              favorites={favorites}
              filtered={filtered}
              selectedId={selectedId}
              activeId={active?.id}
              playState={playState}
              loading={loading}
              loadError={loadError}
              onSelect={select}
              onPlay={play}
              onToggleFav={toggleFav}
            />
          </div>
          <main style={{ position: "relative", overflow: "hidden", minHeight: 0, minWidth: 0 }}>
            <GlobePanel
              stations={filtered}
              activeId={active?.id}
              selectedId={selectedId}
              selectedStation={selectedStation}
              activeStation={active}
              playState={playState}
              onSelectStation={select}
              onPlay={play}
            />
          </main>
        </div>
      )}

      <PlayerBar
        active={active}
        playState={playState}
        elapsedSec={elapsedSec}
        volume={volume}
        muted={muted}
        onVolume={setVolume}
        onToggleMute={toggleMute}
        onPause={playerPause}
        onRetry={retry}
        onPrev={() => stepStation(-1)}
        onNext={() => stepStation(1)}
        onExpand={() => setShowSheet(true)}
      />

      <NowPlayingSheet
        open={showSheet}
        active={active}
        playState={playState}
        errorMsg={errorMsg}
        elapsedSec={elapsedSec}
        isFav={isFav}
        onClose={() => setShowSheet(false)}
        onToggleFav={() => active && toggleFav(active.id)}
        onPause={playerPause}
        onRetry={retry}
        onStop={() => {
          playerStop();
          setShowSheet(false);
        }}
        onPrev={() => stepStation(-1)}
        onNext={() => stepStation(1)}
      />
    </div>
  );
}
