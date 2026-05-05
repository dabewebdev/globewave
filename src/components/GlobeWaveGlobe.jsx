import { useEffect, useMemo, useRef } from "react";
import Globe from "react-globe.gl";

// GlobeWave's photoreal Earth (three.js). Click a station pin to focus +
// rotate to it (matches the Meridian behaviour). Continent click is not
// supported here — continents are baked into the texture, not separate
// hit-targets. Theme-aware textures: night Earth for dark mode,
// day Earth for light mode.

const TEX_NIGHT = "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const TEX_DAY = "https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg";
const TEX_BUMP = "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png";

export default function GlobeWaveGlobe({
  size = 560,
  stations,
  activeId,
  selectedId,
  onSelectStation,
  mode = "dark",
}) {
  const globeRef = useRef(null);

  const points = useMemo(() => {
    return stations.map((s) => ({
      ...s,
      size: s.id === activeId ? 0.5 : s.id === selectedId ? 0.4 : 0.22,
    }));
  }, [stations, activeId, selectedId]);

  // Animate POV to selected station
  useEffect(() => {
    if (!globeRef.current || !selectedId) return;
    const s = stations.find((x) => x.id === selectedId);
    if (!s) return;
    globeRef.current.pointOfView(
      { lat: s.lat, lng: s.lng, altitude: 1.6 },
      1200
    );
  }, [selectedId, stations]);

  const accent = mode === "light" ? "#0d9968" : "#10b981";
  const accentBright = mode === "light" ? "#10b981" : "#34d399";

  return (
    <Globe
      ref={globeRef}
      width={size}
      height={size}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={mode === "light" ? TEX_DAY : TEX_NIGHT}
      bumpImageUrl={TEX_BUMP}
      pointsData={points}
      pointLat={(d) => d.lat}
      pointLng={(d) => d.lng}
      pointRadius={(d) => d.size}
      pointAltitude={0.015}
      pointColor={(d) => (d.id === activeId ? accentBright : accent)}
      pointsMerge={false}
      onPointClick={(s) => onSelectStation?.(s.id)}
      atmosphereColor={accentBright}
      atmosphereAltitude={0.14}
    />
  );
}
