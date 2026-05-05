import { useCallback, useEffect, useRef, useState } from "react";

// State machine: idle | connecting | buffering | playing | paused | blocked | error
// Wired to real HTML5 audio events.

const VOL_KEY = "radiome:volume";
const MUTE_KEY = "radiome:muted";

function pageIsHttps() {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:";
}

function loadInt(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function loadBool(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return raw === "1" || raw === "true";
  } catch {
    return fallback;
  }
}

export default function usePlayer() {
  const audioRef = useRef(null);
  const generationRef = useRef(0);

  const [active, setActive] = useState(null); // station object
  const [playState, setPlayState] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [volume, setVolumeState] = useState(() => loadInt(VOL_KEY, 70));
  const [muted, setMutedState] = useState(() => loadBool(MUTE_KEY, false));
  const [elapsedSec, setElapsedSec] = useState(0);

  // Init audio element once
  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    audioRef.current = a;
    a.volume = volume / 100;
    a.muted = muted;

    const onPlaying = () => setPlayState("playing");
    const onWaiting = () => setPlayState((s) => (s === "playing" ? "buffering" : s));
    const onPause = () => setPlayState((s) => (s === "playing" || s === "buffering" ? "paused" : s));
    const onStalled = () => setPlayState((s) => (s === "playing" ? "buffering" : s));
    const onError = () => {
      setPlayState("error");
      setErrorMsg("Stream error. The station may be down.");
    };
    const onEnded = () => setPlayState("idle");

    a.addEventListener("playing", onPlaying);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("pause", onPause);
    a.addEventListener("stalled", onStalled);
    a.addEventListener("error", onError);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("stalled", onStalled);
      a.removeEventListener("error", onError);
      a.removeEventListener("ended", onEnded);
      a.pause();
      a.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Volume / mute side effects + persistence
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
    try { localStorage.setItem(VOL_KEY, String(volume)); } catch { /* ignore */ }
  }, [volume]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ignore */ }
  }, [muted]);

  // Elapsed timer
  useEffect(() => {
    if (playState !== "playing") return;
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [playState]);

  const play = useCallback((station) => {
    if (!station || !audioRef.current) return;
    const a = audioRef.current;
    const gen = ++generationRef.current;
    setActive(station);
    setElapsedSec(0);
    setErrorMsg("");

    if (station.proto === "http" && pageIsHttps()) {
      setPlayState("blocked");
      setErrorMsg("Browser blocked this HTTP stream on a secure page.");
      return;
    }
    if (!station.streamUrl) {
      setPlayState("error");
      setErrorMsg("No stream URL provided.");
      return;
    }

    setPlayState("connecting");
    try {
      a.pause();
      a.src = station.streamUrl;
      a.load();
    } catch (err) {
      setPlayState("error");
      setErrorMsg(err?.message || "Failed to prepare stream.");
      return;
    }

    a.play()
      .then(() => {
        if (gen !== generationRef.current) return; // stale request
        // 'playing' event will land too; this handles the case where it doesn't fire fast.
        setPlayState((s) => (s === "connecting" ? "buffering" : s));
      })
      .catch((err) => {
        if (gen !== generationRef.current) return;
        setPlayState("error");
        setErrorMsg(err?.message || "Couldn't start stream.");
      });
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playState === "playing" || playState === "buffering" || playState === "connecting") {
      a.pause();
      setPlayState("paused");
    } else if (playState === "paused" && active) {
      play(active);
    }
  }, [playState, active, play]);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = "";
    }
    generationRef.current++;
    setActive(null);
    setPlayState("idle");
    setElapsedSec(0);
    setErrorMsg("");
  }, []);

  const retry = useCallback(() => {
    if (active) play(active);
  }, [active, play]);

  const setVolume = useCallback((v) => setVolumeState(Math.max(0, Math.min(100, v))), []);
  const setMuted = useCallback((m) => setMutedState(!!m), []);
  const toggleMute = useCallback(() => setMutedState((m) => !m), []);

  return {
    active,
    playState,
    errorMsg,
    elapsedSec,
    volume,
    muted,
    play,
    pause,
    stop,
    retry,
    setVolume,
    setMuted,
    toggleMute,
  };
}

export function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(mm)}:${pad(sec)}` : `${pad(mm)}:${pad(sec)}`;
}
