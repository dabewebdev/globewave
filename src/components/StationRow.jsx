import { I } from "./Icons.jsx";
import { iconBtn } from "./ui.jsx";

export default function StationRow({
  s,
  n,
  isSelected,
  isActive,
  playState,
  isFav,
  onFocus,
  onPlay,
  onFav,
}) {
  const playing = isActive && (playState === "playing" || playState === "buffering" || playState === "connecting");
  return (
    <div
      onClick={onFocus}
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr auto auto",
        gap: 14,
        alignItems: "center",
        padding: "14px 18px",
        borderBottom: "1px solid var(--hairline)",
        background: isSelected ? "var(--accent-faint)" : "transparent",
        borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
        cursor: "pointer",
        transition: "background 120ms",
      }}
    >
      <div className="t-mono" style={{ color: isSelected ? "var(--accent)" : "var(--fg-dim)" }}>
        {String(n).padStart(2, "0")}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            color: "var(--fg)",
            letterSpacing: "-.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {s.name}
        </div>
        <div className="t-mono" style={{ color: "var(--fg-dim)", marginTop: 2 }}>
          {(s.city || "").toUpperCase()} · {(s.country || "").toUpperCase()}
          {s.proto === "http" && <span style={{ color: "var(--warn)" }}> · HTTP</span>}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFav();
        }}
        style={{
          ...iconBtn,
          color: isFav ? "var(--accent)" : "var(--fg-faint)",
          background: "transparent",
          border: "none",
          width: 28,
          height: 28,
        }}
        aria-label={isFav ? "Remove favorite" : "Add favorite"}
      >
        {isFav ? <I.HeartFill size={13} /> : <I.Heart size={13} />}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        style={{
          ...iconBtn,
          background: playing ? "var(--accent)" : "var(--bg-card)",
          color: playing ? "var(--accent-fg)" : "var(--fg)",
          borderColor: playing ? "var(--accent)" : "var(--line-strong)",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <I.Pause size={12} /> : <I.Play size={11} />}
      </button>
    </div>
  );
}
