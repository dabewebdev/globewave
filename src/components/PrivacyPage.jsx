import { Eyebrow } from "./ui.jsx";

export default function PrivacyPage({ onBack }) {
  return (
    <main style={{ position: "absolute", inset: 0, overflow: "auto", padding: 40 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Eyebrow>PRIVACY</Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            lineHeight: 1.05,
            color: "var(--fg)",
            letterSpacing: "-.02em",
            margin: "8px 0 0",
          }}
        >
          Privacy Policy
        </h1>
        <div className="t-mono" style={{ color: "var(--fg-dim)", marginTop: 10 }}>
          LAST UPDATED: MAY 6, 2026
        </div>

        <section
          style={{
            marginTop: 28,
            padding: 22,
            background: "var(--bg-card)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-card)",
          }}
        >
          <PolicyBlock title="Overview">
            GlobeWave is a simple radio discovery app. It does not require login and does not
            collect personal information from users.
          </PolicyBlock>
          <PolicyBlock title="User data">
            GlobeWave does not sell user data. The app may store preferences such as theme,
            favorites, and selected station locally on your device so the app can remember your
            choices.
          </PolicyBlock>
          <PolicyBlock title="Radio streams">
            GlobeWave only provides access to third-party radio streams. Those streams may be
            operated by external providers, and playback requests may connect your device directly
            to those providers.
          </PolicyBlock>
          <PolicyBlock title="Third-party providers">
            Third-party radio stream providers may have their own privacy practices. Review the
            relevant provider policies if you need more information about how a specific stream is
            operated.
          </PolicyBlock>
          <PolicyBlock title="Contact">
            For privacy questions about GlobeWave, contact the app publisher through the listing or
            support channel where you downloaded the app.
          </PolicyBlock>
        </section>

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
          Back to browse
        </button>
      </div>
    </main>
  );
}

function PolicyBlock({ title, children }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: 24,
          lineHeight: 1.15,
          color: "var(--fg)",
          letterSpacing: "-.01em",
        }}
      >
        {title}
      </h2>
      <p className="t-body" style={{ margin: "8px 0 0", color: "var(--fg-muted)" }}>
        {children}
      </p>
    </div>
  );
}
