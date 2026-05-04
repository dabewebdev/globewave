import { useEffect, useMemo, useRef } from "react";
import Globe from "react-globe.gl";

export default function GlobeScene({ stations, currentStation, onSelect }) {
  const globeRef = useRef(null);

  const points = useMemo(() => {
    return stations.map((station) => ({
      ...station,
      size: station.id === currentStation.id ? 0.45 : 0.22,
      color: station.id === currentStation.id ? "#34d399" : "#00ff88"
    }));
  }, [stations, currentStation]);

  useEffect(() => {
    if (!globeRef.current || !currentStation) return;

    globeRef.current.pointOfView(
      {
        lat: currentStation.lat,
        lng: currentStation.lng,
        altitude: 1.6
      },
      1200
    );
  }, [currentStation]);

  return (
    <div className="globe-scene">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        pointsData={points}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lng}
        pointRadius={(d) => d.size}
        pointAltitude={0.015}
        pointColor={(d) => d.color}
        pointsMerge={false}
        onPointClick={(station) => onSelect(station)}
        labelsData={[currentStation]}
        labelLat={(d) => d.lat}
        labelLng={(d) => d.lng}
        labelText={(d) => d.city}
        labelSize={1.2}
        labelDotRadius={0.45}
        labelColor={() => "#34d399"}
        labelResolution={2}
        atmosphereColor="#34d399"
        atmosphereAltitude={0.12}
      />
    </div>
  );
}