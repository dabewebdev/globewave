// Procedural plate artwork (no per-station files): striped accent over card with
// the first word of the station name overlaid in display type.

export default function Artwork({ s, big = false }) {
  if (!s) return null;
  const stripe = big ? 6 : 2;
  const gap = big ? 16 : 6;
  const word = (s.name || "RADIO").split(" ")[0];
  return (
    <div
      style={{
        width: big ? 240 : 48,
        height: big ? 240 : 48,
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--line-strong)",
        flexShrink: 0,
        background: `repeating-linear-gradient(45deg, var(--accent) 0 ${stripe}px, transparent ${stripe}px ${gap}px), var(--bg-card)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: big ? 18 : 6,
          bottom: big ? 16 : 4,
          fontFamily: "var(--font-display)",
          color: "var(--fg)",
          fontSize: big ? 36 : 14,
          fontWeight: 500,
          letterSpacing: "-.01em",
          background: "var(--bg-card)",
          padding: big ? "4px 10px" : "0 4px",
          maxWidth: big ? 200 : 40,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {word}
      </div>
    </div>
  );
}
