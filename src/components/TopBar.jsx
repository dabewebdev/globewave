import { I } from "./Icons.jsx";
import { Logomark, iconBtn } from "./ui.jsx";

export default function TopBar({ route, onRoute, country, countries, onFavoritesOnly }) {
  const countryLabel =
    country === "WW"
      ? "WORLDWIDE"
      : (countries.find((c) => c.code === country)?.name || country).toUpperCase();

  const items = [
    ["browse", "Browse"],
    ["favorites", "Favorites"],
    ["settings", "Settings"],
  ];

  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid var(--line)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Logomark />
        <div className="t-mono" style={{ color: "var(--fg-dim)" }}>
          PLATE 04 · {countryLabel}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <nav style={{ display: "flex", gap: 4 }}>
          {items.map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                if (k === "favorites") {
                  onFavoritesOnly(true);
                  onRoute("browse");
                } else {
                  onRoute(k);
                }
              }}
              style={{
                height: 32,
                padding: "0 12px",
                background: "transparent",
                border: "1px solid transparent",
                color: route === k ? "var(--fg)" : "var(--fg-muted)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                cursor: "pointer",
                borderBottom: route === k ? "1px solid var(--accent)" : "1px solid transparent",
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div style={{ width: 1, height: 18, background: "var(--line-strong)" }} />
        <button
          style={iconBtn}
          onClick={() => onRoute("settings")}
          aria-label="Settings"
        >
          <I.Settings size={14} />
        </button>
      </div>
    </header>
  );
}
