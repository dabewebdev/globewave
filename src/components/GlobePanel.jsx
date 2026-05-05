import { useEffect, useRef, useState } from "react";
import InteractiveGlobe from "./InteractiveGlobe.jsx";
import { Chip, Eyebrow, Spinner } from "./ui.jsx";
import { I } from "./Icons.jsx";

export default function GlobePanel({
  stations,
  activeId,
  selectedId,
  selectedStation,
  activeStation,
  playState,
  onSelectStation,
  onPlay,
}) {
  const wrapRef = useRef(null);
  const globeRef = useRef(null);
  const [size, setSize] = useState(560);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const s = Math.max(360, Math.min(width - 80, height - 200));
      setSize(s);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && globeRef.current) globeRef.current.resetView();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const globeStations = stations.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    label: s.name,
    country: s.country,
  }));

  const activePlayLabel =
    selectedStation && activeId === selectedStation.id
      ? playState === "playing"
        ? <><I.Pause size={11} /> NOW PLAYING</>
        : playState === "connecting"
        ? <><Spinner size={11} color="var(--accent-fg)" /> CONNECTING</>
        : playState === "buffering"
        ? <><Spinner size={11} color="var(--accent-fg)" /> BUFFERING</>
        : playState === "blocked"
        ? <span style={{ color: "var(--accent-fg)" }}>● BLOCKED</span>
        : playState === "error"
        ? <span style={{ color: "var(--accent-fg)" }}>● RETRY</span>
        : <><I.Play size={10} /> PLAY</>
      : <><I.Play size={10} /> PLAY</>;

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        viewBox="0 0 920 668"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="334" x2="920" y2="334" stroke="var(--line)" strokeWidth=".5" strokeDasharray="2 4" />
        <line x1="460" y1="0" x2="460" y2="668" stroke="var(--line)" strokeWidth=".5" strokeDasharray="2 4" />
      </svg>

      {selectedStation && (
        <div
          className="t-mono"
          style={{ position: "absolute", top: 16, left: 24, color: "var(--fg-dim)" }}
        >
          {selectedStation.lat.toFixed(2)}° {selectedStation.lat >= 0 ? "N" : "S"} ·{" "}
          {selectedStation.lng.toFixed(2)}° {selectedStation.lng >= 0 ? "E" : "W"}
        </div>
      )}

      <div
        className="t-mono"
        style={{
          position: "absolute",
          top: 16,
          right: 24,
          color: activeStation ? "var(--accent)" : "var(--fg-faint)",
        }}
      >
        {activeStation ? "◆ ON AIR" : "◇ NOT TUNED"}
      </div>

      <div
        className="t-mono"
        style={{ position: "absolute", bottom: 16, right: 24, color: "var(--fg-faint)" }}
      >
        DRAG TO ROTATE · CLICK CONTINENT TO ZOOM · ESC TO RESET
      </div>

      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <InteractiveGlobe
          ref={globeRef}
          size={size}
          stations={globeStations}
          activeId={activeId}
          selectedId={selectedId}
          onSelectStation={onSelectStation}
        />
      </div>

      {selectedStation && (
        <div
          style={{
            position: "absolute",
            right: 32,
            bottom: 48,
            width: 280,
            background: "var(--bg-card)",
            border: "1px solid var(--line-strong)",
            padding: 20,
            boxShadow: "var(--elev-2)",
          }}
        >
          <Eyebrow>PLATE CAPTION</Eyebrow>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              color: "var(--fg)",
              letterSpacing: "-.02em",
              marginTop: 6,
              lineHeight: 1.05,
              wordBreak: "break-word",
            }}
          >
            {selectedStation.name}
          </div>
          <div className="t-body" style={{ color: "var(--fg-muted)", marginTop: 4 }}>
            {selectedStation.city} · {selectedStation.country}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            {(selectedStation.tags || []).map((t) => (
              <Chip key={t} active={activeStation?.id === selectedStation.id}>
                {t}
              </Chip>
            ))}
          </div>
          <button
            onClick={() => onPlay(selectedStation.id)}
            style={{
              marginTop: 14,
              width: "100%",
              height: 36,
              border: "1px solid var(--accent)",
              background:
                activeId === selectedStation.id && playState === "playing"
                  ? "var(--bg-card)"
                  : "var(--accent)",
              color:
                activeId === selectedStation.id && playState === "playing"
                  ? "var(--accent)"
                  : "var(--accent-fg)",
              borderRadius: 0,
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            {activePlayLabel}
          </button>
        </div>
      )}
    </div>
  );
}
