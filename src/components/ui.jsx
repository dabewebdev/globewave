/* eslint-disable react-refresh/only-export-components */
// Shared UI primitives used across the Meridian frame.

export const iconBtn = {
  appearance: "none",
  border: "1px solid var(--line-strong)",
  background: "var(--bg-card)",
  color: "var(--fg)",
  width: 32,
  height: 32,
  borderRadius: "var(--r-control)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  transition: "background 120ms, color 120ms",
};

export const Eyebrow = ({ children, style }) => (
  <div className="t-eyebrow" style={{ color: "var(--fg-dim)", ...style }}>
    {children}
  </div>
);

export const HR = ({ style }) => (
  <div style={{ height: 1, background: "var(--line)", ...style }} />
);

export const Chip = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className="t-mono"
    style={{
      appearance: "none",
      border: `1px solid ${active ? "var(--accent)" : "var(--line-strong)"}`,
      background: active ? "var(--accent-soft)" : "transparent",
      color: active ? "var(--accent-strong)" : "var(--fg-muted)",
      padding: "4px 10px",
      borderRadius: "var(--r-control)",
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

export const Spinner = ({ size = 14, color = "var(--accent-fg)" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,.4)",
      borderTopColor: color,
      animation: "spin .7s linear infinite",
    }}
  />
);

export const Logomark = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="none" stroke="var(--fg)" strokeWidth=".75" />
      <ellipse cx="11" cy="11" rx="10" ry="3.5" fill="none" stroke="var(--fg)" strokeWidth=".5" />
      <line x1="11" y1="1" x2="11" y2="21" stroke="var(--fg)" strokeWidth=".5" />
      <circle cx="11" cy="11" r="2" fill="var(--accent)" />
    </svg>
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontSize: 18,
        color: "var(--fg)",
        fontWeight: 500,
        letterSpacing: ".01em",
      }}
    >
      GlobeWave
    </span>
  </div>
);
