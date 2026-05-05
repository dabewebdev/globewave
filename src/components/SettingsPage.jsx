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

function SegmentRow({ label, value, options, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "16px 0",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="t-body" style={{ color: "var(--fg)" }}>{label}</div>
      <div
        style={{
          display: "flex",
          padding: 3,
          background: "var(--bg-elev)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-control)",
          gap: 2,
        }}
      >
        {options.map(({ value: v, label: l }) => {
          const active = v === value;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              aria-pressed={active}
              style={{
                padding: "6px 14px",
                background: active ? "var(--bg-card)" : "transparent",
                color: active ? "var(--fg)" : "var(--fg-muted)",
                border: "none",
                borderRadius: "var(--r-control)",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                boxShadow: active ? "var(--elev-1)" : "none",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPage({
  settings,
  onChange,
  onBack,
  theme,
  onTheme,
  mode,
  onMode,
}) {
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

        <Eyebrow style={{ marginTop: 32 }}>APPEARANCE</Eyebrow>
        <div style={{ marginTop: 12 }}>
          <SegmentRow
            label="Theme"
            value={theme}
            onChange={onTheme}
            options={[
              { value: "meridian", label: "Meridian" },
              { value: "globewave", label: "GlobeWave" },
            ]}
          />
          <SegmentRow
            label="Mode"
            value={mode}
            onChange={onMode}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </div>

        <Eyebrow style={{ marginTop: 32 }}>PLAYBACK</Eyebrow>
        <div style={{ marginTop: 12 }}>
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
            borderRadius: "var(--r-card)",
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
            </a>{" "}
            (community-edited) plus a curated set from{" "}
            <a
              href="https://somafm.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              SomaFM
            </a>
            . Stations without coordinates are placed by city name via{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              OpenStreetMap Nominatim
            </a>
            .
          </div>
          <div className="t-mono" style={{ marginTop: 12, color: "var(--fg-dim)" }}>
            v0.6.0
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
            borderRadius: "var(--r-control)",
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
