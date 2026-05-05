import { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { WORLD, shapeCentroid } from "../data/worldShapes.js";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const InteractiveGlobe = forwardRef(function InteractiveGlobe(
  {
    size = 560,
    stations = [],
    activeId,
    selectedId,
    onSelectStation,
    autoSpin = true,
    speed = 190,
  },
  ref
) {
  const r = size / 2;
  const baseInner = r * 0.96;

  const lamRef = useRef(20);
  const phiRef = useRef(-10);
  const zoomRef = useRef(1);
  const targetRef = useRef(null); // { lam, phi, zoom }
  const velRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const lastPtRef = useRef(null);
  const startPtRef = useRef(null);
  const wrapRef = useRef(null);

  const [, setTick] = useState(0);
  const [hover, setHover] = useState(null);
  const [hoverStation, setHoverStation] = useState(null);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      targetRef.current = { lam: 20, phi: -10, zoom: 1 };
    },
  }));

  // Animation loop
  useEffect(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - last);
      last = now;
      const dragging = draggingRef.current;

      if (dragging) {
        targetRef.current = null;
      } else if (targetRef.current) {
        const t = targetRef.current;
        const wrap = (a) => {
          while (a > 180) a -= 360;
          while (a < -180) a += 360;
          return a;
        };
        const dl = wrap(t.lam - lamRef.current);
        const dp = t.phi - phiRef.current;
        const dz = (t.zoom ?? 1) - zoomRef.current;
        lamRef.current += dl * 0.12;
        phiRef.current += dp * 0.12;
        zoomRef.current += dz * 0.14;
        if (Math.abs(dl) < 0.3 && Math.abs(dp) < 0.3 && Math.abs(dz) < 0.005) {
          lamRef.current = t.lam;
          phiRef.current = t.phi;
          zoomRef.current = t.zoom ?? 1;
          targetRef.current = null;
        }
        velRef.current = { x: 0, y: 0 };
      } else {
        velRef.current.x *= 0.94;
        velRef.current.y *= 0.94;
        if (Math.abs(velRef.current.x) < 0.005) velRef.current.x = 0;
        if (Math.abs(velRef.current.y) < 0.005) velRef.current.y = 0;
        if (autoSpin && Math.abs(velRef.current.x) < 0.01 && Math.abs(velRef.current.y) < 0.01) {
          lamRef.current += (360 / speed) * (dt / 1000);
        } else {
          lamRef.current += velRef.current.x * dt;
          phiRef.current += velRef.current.y * dt;
        }
      }

      phiRef.current = clamp(phiRef.current, -80, 80);
      if (lamRef.current > 360) lamRef.current -= 360;
      if (lamRef.current < -360) lamRef.current += 360;
      setTick((t) => (t + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, speed]);

  // Animate to selected station: rotate to it AND reset zoom to 1.0
  useEffect(() => {
    if (!selectedId) return;
    const s = stations.find((x) => x.id === selectedId);
    if (!s) return;
    targetRef.current = {
      lam: -s.lng,
      phi: clamp(s.lat, -55, 55),
      zoom: 1,
    };
  }, [selectedId, stations]);

  // Pointer handlers.
  // Pointer capture is needed so the drag keeps tracking when the cursor leaves
  // the SVG. But capture also retargets the synthesized 'click' event in some
  // browsers, which silently breaks `onClick` on continent paths and station
  // groups. So we don't rely on click events: in pointerup, if no meaningful
  // drag happened, we look up the element under the pointer and dispatch the
  // intended action ourselves.
  const DRAG_THRESHOLD = 8;

  const onPointerDown = (e) => {
    draggingRef.current = true;
    dragMovedRef.current = false;
    startPtRef.current = { x: e.clientX, y: e.clientY };
    lastPtRef.current = { x: e.clientX, y: e.clientY };
    velRef.current = { x: 0, y: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const totalDx = e.clientX - startPtRef.current.x;
    const totalDy = e.clientY - startPtRef.current.y;
    const td = Math.hypot(totalDx, totalDy);
    // Below threshold, suppress rotation entirely so a click with normal
    // jitter doesn't rotate the globe a tiny amount AND get classified as drag.
    if (td <= DRAG_THRESHOLD) return;
    if (!dragMovedRef.current) {
      dragMovedRef.current = true;
      lastPtRef.current = { x: e.clientX, y: e.clientY };
      return;
    }
    const dx = e.clientX - lastPtRef.current.x;
    const dy = e.clientY - lastPtRef.current.y;
    lastPtRef.current = { x: e.clientX, y: e.clientY };
    const sens = 0.4 / zoomRef.current;
    lamRef.current += dx * sens;
    phiRef.current += dy * sens;
    velRef.current = { x: (dx * sens) / 16, y: (dy * sens) / 16 };
  };
  const onPointerUp = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (dragMovedRef.current) return;
    // Tap with no drag — find what was under the pointer and act on it.
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const stationEl = el.closest("[data-station-id]");
    if (stationEl) {
      handleStationClick(stationEl.getAttribute("data-station-id"));
      return;
    }
    const countryEl = el.closest("[data-country-code]");
    if (countryEl) {
      const code = countryEl.getAttribute("data-country-code");
      const country = WORLD.find((c) => c.code === code);
      if (country) handleContinentClick(country);
    }
  };

  // Projection state
  const lam = (lamRef.current * Math.PI) / 180;
  const phi = (phiRef.current * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  function project(lng, lat) {
    const lo = (lng * Math.PI) / 180 + lam;
    const la = (lat * Math.PI) / 180;
    const cosLat = Math.cos(la);
    const sinLat = Math.sin(la);
    const x = cosLat * Math.sin(lo);
    const y = cosPhi * sinLat - sinPhi * cosLat * Math.cos(lo);
    const z = sinPhi * sinLat + cosPhi * cosLat * Math.cos(lo);
    return { x: r + x * baseInner, y: r - y * baseInner, z };
  }

  function polygonToPath(poly) {
    if (poly.length < 2) return "";
    const pts = poly.map(([lng, lat]) => project(lng, lat));
    let d = "";
    let started = false;
    for (let i = 0; i < pts.length; i++) {
      const cur = pts[i];
      const next = pts[(i + 1) % pts.length];
      const curVis = cur.z >= 0;
      const nextVis = next.z >= 0;

      if (curVis) {
        if (!started) {
          d += `M${cur.x.toFixed(1)},${cur.y.toFixed(1)}`;
          started = true;
        } else {
          d += `L${cur.x.toFixed(1)},${cur.y.toFixed(1)}`;
        }
      }
      if (curVis !== nextVis) {
        const t = cur.z / (cur.z - next.z);
        const ix = cur.x + (next.x - cur.x) * t;
        const iy = cur.y + (next.y - cur.y) * t;
        const dx = ix - r;
        const dy = iy - r;
        const len = Math.hypot(dx, dy) || 1;
        const cx = r + (dx / len) * baseInner;
        const cy = r + (dy / len) * baseInner;
        if (curVis) {
          d += `L${cx.toFixed(1)},${cy.toFixed(1)}`;
        } else {
          if (!started) {
            d += `M${cx.toFixed(1)},${cy.toFixed(1)}`;
            started = true;
          } else {
            d += `L${cx.toFixed(1)},${cy.toFixed(1)}`;
          }
        }
      }
    }
    if (started) d += "Z";
    return d;
  }

  // Project stations, sort by z so front renders last
  const projectedStations = useMemo(() => {
    return stations
      .map((s) => {
        const p = project(s.lng, s.lat);
        return { ...s, sx: p.x, sy: p.y, sz: p.z };
      })
      .sort((a, b) => a.sz - b.sz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, lamRef.current, phiRef.current]);

  // Graticule
  const graticule = [];
  for (let lng = -180; lng < 180; lng += 30) {
    const pts = [];
    for (let lat = -85; lat <= 85; lat += 5) {
      const p = project(lng, lat);
      if (p.z >= 0) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      else if (pts.length) {
        graticule.push(pts.join(" "));
        pts.length = 0;
      }
    }
    if (pts.length) graticule.push(pts.join(" "));
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = [];
    for (let lng = -180; lng <= 180; lng += 5) {
      const p = project(lng, lat);
      if (p.z >= 0) pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      else if (pts.length) {
        graticule.push(pts.join(" "));
        pts.length = 0;
      }
    }
    if (pts.length) graticule.push(pts.join(" "));
  }

  const equatorPts = [];
  for (let lng = -180; lng <= 180; lng += 5) {
    const p = project(lng, 0);
    if (p.z >= 0) equatorPts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }

  const handleContinentClick = (country) => {
    if (dragMovedRef.current) return;
    const c = shapeCentroid(country);
    targetRef.current = {
      lam: -c.lng,
      phi: clamp(c.lat, -55, 55),
      zoom: 1.85,
    };
  };

  const handleStationClick = (id) => {
    if (dragMovedRef.current) return;
    onSelectStation?.(id);
  };

  const zoom = zoomRef.current;
  const transform = `translate(${r} ${r}) scale(${zoom.toFixed(3)}) translate(${-r} ${-r})`;

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", width: size, height: size, userSelect: "none" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          display: "block",
          cursor: draggingRef.current ? "grabbing" : "grab",
          touchAction: "none",
          overflow: "visible",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <radialGradient id="globe-fill" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="var(--bg-card)" />
            <stop offset="70%" stopColor="var(--bg)" />
            <stop offset="100%" stopColor="var(--bg-elev)" />
          </radialGradient>
          <radialGradient id="globe-shade" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="var(--globe-shade)" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx={r} cy={r} r={baseInner} />
          </clipPath>
        </defs>

        <g transform={transform}>
          <circle cx={r} cy={r} r={baseInner} fill="url(#globe-fill)" stroke="var(--line-strong)" strokeWidth="1" />

          <g clipPath="url(#globe-clip)">
            <g fill="none" stroke="var(--line)" strokeWidth="0.5">
              {graticule.map((pts, i) => (
                <polyline key={i} points={pts} />
              ))}
            </g>
            <g fill="none" stroke="var(--line-strong)" strokeWidth="0.6" opacity="0.6">
              {equatorPts.length > 0 && <polyline points={equatorPts.join(" ")} />}
            </g>

            <g strokeLinejoin="round" strokeLinecap="round">
              {WORLD.map((country) =>
                country.polygons.map((poly, i) => {
                  const d = polygonToPath(poly);
                  if (!d) return null;
                  const isHover = hover?.code === country.code;
                  return (
                    <path
                      key={`${country.code}-${i}`}
                      d={d}
                      data-country-code={country.code}
                      fill={isHover ? "var(--accent-soft)" : "var(--globe-land)"}
                      stroke={isHover ? "var(--accent-strong)" : "var(--globe-land-stroke)"}
                      strokeWidth={isHover ? 1.2 : 0.7}
                      onMouseEnter={(e) => {
                        const rect = wrapRef.current.getBoundingClientRect();
                        setHover({ code: country.code, name: country.name, x: e.clientX - rect.left, y: e.clientY - rect.top });
                      }}
                      onMouseMove={(e) => {
                        const rect = wrapRef.current.getBoundingClientRect();
                        setHover((h) => (h ? { ...h, x: e.clientX - rect.left, y: e.clientY - rect.top } : h));
                      }}
                      onMouseLeave={() => setHover(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinentClick(country);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  );
                })
              )}
            </g>
          </g>

          <circle cx={r} cy={r} r={baseInner} fill="url(#globe-shade)" pointerEvents="none" />
          <circle cx={r} cy={r} r={baseInner} fill="none" stroke="var(--line-strong)" strokeWidth="1" pointerEvents="none" />

          <g>
            {projectedStations.map((s) => {
              if (s.sz < -0.05) return null;
              const visible = s.sz >= 0;
              const isActive = s.id === activeId;
              const isSelected = s.id === selectedId;
              const opacity = visible ? 1 : 0.25;
              return (
                <g
                  key={s.id}
                  data-station-id={s.id}
                  opacity={opacity}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStationClick(s.id);
                  }}
                  onMouseEnter={(e) => {
                    const rect = wrapRef.current.getBoundingClientRect();
                    setHoverStation({ id: s.id, label: s.label, country: s.country, x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }}
                  onMouseMove={(e) => {
                    const rect = wrapRef.current.getBoundingClientRect();
                    setHoverStation((h) => (h && h.id === s.id ? { ...h, x: e.clientX - rect.left, y: e.clientY - rect.top } : h));
                  }}
                  onMouseLeave={() => setHoverStation(null)}
                >
                  {isActive && (
                    <circle cx={s.sx} cy={s.sy} r="14" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.5">
                      <animate attributeName="r" from="6" to="22" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={s.sx} cy={s.sy} r={isSelected || isActive ? 5.5 : 4} fill="var(--bg)" stroke="var(--accent)" strokeWidth="2" />
                  {isActive && <circle cx={s.sx} cy={s.sy} r="2.5" fill="var(--accent)" />}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {hover && !hoverStation && (
        <div
          className="t-mono"
          style={{
            position: "absolute",
            left: hover.x + 12,
            top: hover.y - 8,
            pointerEvents: "none",
            background: "var(--bg-card)",
            border: "1px solid var(--line-strong)",
            padding: "4px 8px",
            color: "var(--fg)",
            whiteSpace: "nowrap",
            zIndex: 5,
          }}
        >
          {hover.name.toUpperCase()} · CLICK TO ZOOM
        </div>
      )}

      {hoverStation && (
        <div
          style={{
            position: "absolute",
            left: hoverStation.x + 12,
            top: hoverStation.y + 12,
            pointerEvents: "none",
            background: "var(--bg-card)",
            border: "1px solid var(--accent)",
            borderLeft: "3px solid var(--accent)",
            padding: "8px 12px",
            minWidth: 160,
            zIndex: 6,
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--fg)", letterSpacing: "-.01em" }}>
            {hoverStation.label}
          </div>
          <div className="t-mono" style={{ color: "var(--fg-dim)", marginTop: 2 }}>
            {(hoverStation.country || "").toUpperCase()} · CLICK TO FOCUS
          </div>
        </div>
      )}
    </div>
  );
});

export default InteractiveGlobe;
