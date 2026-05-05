import { Eyebrow } from "./ui.jsx";

function Row({ label, valueText, on, onToggle }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="t-body" style={{ color: "var(--fg)" }}>{label}</div>
      {valueText !== undefined ? (
        <span className="t-mono" style={{ color: "var(--fg-muted)" }}>{valueText}</span>
      ) : (
        <button
          onClick={onToggle}
          aria-pressed={!!on}
          style={{
            width: 36,
            height: 20,
            borderRadius: 999,
            padding: 2,
            border: "none",
            background: on ? "var(--accent)" : "var(--line-strong)",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              transform: on ? "translateX(16px)" : "translateX(0)",
              transition: "transform var(--motion-base)",
            }}
          />
        </button>
      )}
    </div>
  );
}

export default function SettingsPage({ settings, onChange, onBack }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "auto", padding: 40 }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Eyebrow>SETTINGS</Eyebrow>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            color: "var(--fg)",
            letterSpacing: "-.02em",
            marginTop: 8,
          }}
        >
          Tune to taste.
        </div>
        <div style={{ marginTop: 32 }}>
          <Row label="Theme" valueText="Meridian (light)" />
          <Row
            label="Reduce motion on globe"
            on={settings.reduceMotion}
            onToggle={() => onChange("reduceMotion", !settings.reduceMotion)}
          />
          <Row
            label="High-contrast text"
            on={settings.highContrast}
            onToggle={() => onChange("highContrast", !settings.highContrast)}
          />
          <Row
            label="Auto-play next station on error"
            on={settings.autoNext}
            onToggle={() => onChange("autoNext", !settings.autoNext)}
          />
          <Row label="Stream quality" valueText="Highest available" />
        </div>
        <Eyebrow style={{ marginTop: 36 }}>ABOUT</Eyebrow>
        <div
          style={{
            marginTop: 14,
            padding: 18,
            background: "var(--bg-card)",
            border: "1px solid var(--line)",
          }}
        >
          <div className="t-body" style={{ color: "var(--fg-muted)" }}>
            Stations come from{" "}
            <a
              href="https://www.radio-browser.info"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              radio-browser.info
            </a>
            , a community-edited public database. If a station is wrong or down, try another — the catalog is large.
          </div>
          <div className="t-mono" style={{ marginTop: 12, color: "var(--fg-dim)" }}>
            v0.4.0
          </div>
        </div>
        <button
          onClick={onBack}
          style={{
            marginTop: 24,
            height: 40,
            padding: "0 18px",
            background: "var(--accent)",
            color: "var(--accent-fg)",
            border: "none",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ← Back to browse
        </button>
      </div>
    </div>
  );
}
