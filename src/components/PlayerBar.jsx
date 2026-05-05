import { I } from "./Icons.jsx";
import { iconBtn, Spinner } from "./ui.jsx";
import Artwork from "./Artwork.jsx";
import { fmtTime } from "../hooks/usePlayer.js";

export default function PlayerBar({
  active,
  playState,
  elapsedSec,
  volume,
  muted,
  onVolume,
  onToggleMute,
  onPause,
  onRetry,
  onPrev,
  onNext,
  onExpand,
  compact = false,
}) {
  if (!active) {
    return (
      <footer
        style={{
          height: compact ? 64 : 76,
          flexShrink: 0,
          borderTop: "1px solid var(--line-strong)",
          background: "var(--bg-elev)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: compact ? "0 14px" : "0 24px",
        }}
      >
        <I.Headphones size={16} style={{ color: "var(--fg-dim)" }} />
        <div
          className="t-mono"
          style={{
            color: "var(--fg-dim)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {compact ? "PRESS PLAY ON ANY STATION" : "NOTHING TUNED IN · PRESS PLAY ON ANY STATION"}
        </div>
      </footer>
    );
  }

  const label =
    playState === "connecting" ? "CONNECTING…" :
    playState === "buffering"  ? "BUFFERING…" :
    playState === "blocked"    ? "BLOCKED · MIXED CONTENT" :
    playState === "error"      ? "STREAM ERROR" :
    playState === "paused"     ? "PAUSED" :
    `${(active.city || "").toUpperCase()} · ${(active.country || "").toUpperCase()} · ${active.kbps} KBPS`;

  const labelColor =
    playState === "blocked" || playState === "error" ? "var(--err)" :
    playState === "connecting" || playState === "buffering" ? "var(--warn)" :
    "var(--fg-dim)";

  const isPlaying = playState === "playing";
  const isLoading = playState === "connecting" || playState === "buffering";
  const isError = playState === "blocked" || playState === "error";

  const volIcon = muted || volume === 0 ? <I.VolumeMute size={14} /> : <I.Volume size={14} />;

  if (compact) {
    return (
      <footer
        style={{
          height: 64,
          flexShrink: 0,
          borderTop: "1px solid var(--line-strong)",
          background: "var(--bg-elev)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 12px",
        }}
      >
        <div
          onClick={onExpand}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minWidth: 0, flex: 1 }}
        >
          <Artwork s={active} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                color: "var(--fg)",
                letterSpacing: "-.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {active.name}
            </div>
            <div
              className="t-mono"
              style={{
                color: labelColor,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: 10,
              }}
            >
              {label}
            </div>
          </div>
        </div>
        <button
          onClick={() => (isError ? onRetry() : onPause())}
          style={{
            ...iconBtn,
            width: 44,
            height: 44,
            background: isError ? "var(--err)" : "var(--accent)",
            color: "var(--accent-fg)",
            borderColor: isError ? "var(--err)" : "var(--accent)",
          }}
          aria-label={isError ? "Retry" : isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? <Spinner /> : isError ? <I.Refresh size={16} /> : isPlaying ? <I.Pause size={16} /> : <I.Play size={14} />}
        </button>
        <button style={iconBtn} onClick={onExpand} aria-label="Expand player">
          <I.ChevronUp size={14} />
        </button>
      </footer>
    );
  }

  return (
    <footer
      style={{
        height: 76,
        flexShrink: 0,
        borderTop: "1px solid var(--line-strong)",
        background: "var(--bg-elev)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
        alignItems: "center",
        padding: "0 24px",
        gap: 24,
      }}
    >
      <div
        onClick={onExpand}
        style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", minWidth: 0 }}
      >
        <Artwork s={active} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              color: "var(--fg)",
              letterSpacing: "-.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {active.name}
          </div>
          <div
            className="t-mono"
            style={{ color: labelColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {label}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={iconBtn} onClick={onPrev} aria-label="Previous">
          <I.Prev size={13} />
        </button>
        <button
          onClick={() => (isError ? onRetry() : onPause())}
          style={{
            ...iconBtn,
            width: 44,
            height: 44,
            background: isError ? "var(--err)" : "var(--accent)",
            color: "var(--accent-fg)",
            borderColor: isError ? "var(--err)" : "var(--accent)",
          }}
          aria-label={isError ? "Retry" : isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? <Spinner /> : isError ? <I.Refresh size={15} /> : isPlaying ? <I.Pause size={16} /> : <I.Play size={14} />}
        </button>
        <button style={iconBtn} onClick={onNext} aria-label="Next">
          <I.Next size={13} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
        <span className="t-mono t-num" style={{ color: "var(--fg-dim)" }}>{fmtTime(elapsedSec)}</span>
        <button
          onClick={onToggleMute}
          style={{ ...iconBtn, border: "none", background: "transparent", width: 28, height: 28, color: "var(--fg-dim)" }}
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {volIcon}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          aria-label="Volume"
          style={{ width: 100, accentColor: "var(--accent)" }}
        />
        <button style={iconBtn} onClick={onExpand} aria-label="Expand player">
          <I.ChevronUp size={13} />
        </button>
      </div>
    </footer>
  );
}
