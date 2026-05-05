import { I } from "./Icons.jsx";
import { Chip, Eyebrow, HR, iconBtn } from "./ui.jsx";
import Artwork from "./Artwork.jsx";
import { fmtTime } from "../hooks/usePlayer.js";

export default function NowPlayingSheet({
  open,
  active,
  playState,
  errorMsg,
  elapsedSec,
  isFav,
  onClose,
  onToggleFav,
  onPause,
  onRetry,
  onStop,
  onPrev,
  onNext,
  compact = false,
}) {
  if (!open || !active) return null;
  const isPlaying = playState === "playing";
  const isError = playState === "blocked" || playState === "error";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: compact ? "var(--bg)" : "rgba(29,24,19,.4)",
        backdropFilter: compact ? undefined : "blur(2px)",
        zIndex: 30,
        display: compact ? "block" : "grid",
        placeItems: compact ? undefined : "center",
        padding: compact ? 0 : 32,
        overflow: "auto",
      }}
      onClick={compact ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={
          compact
            ? {
                width: "100%",
                minHeight: "100%",
                background: "var(--bg)",
                padding: "20px 18px 32px",
                position: "relative",
              }
            : {
                width: 560,
                maxWidth: "100%",
                background: "var(--bg)",
                border: "1px solid var(--line-strong)",
                boxShadow: "var(--elev-3)",
                padding: 32,
                position: "relative",
              }
        }
      >
        <button
          onClick={onClose}
          style={{ ...iconBtn, position: "absolute", top: 16, right: 16 }}
          aria-label="Close"
        >
          <I.Close size={13} />
        </button>

        <Eyebrow>NOW PLAYING · PLATE CAPTION</Eyebrow>

        <div
          style={{
            display: "flex",
            gap: compact ? 16 : 24,
            marginTop: 18,
            flexDirection: compact ? "column" : "row",
            alignItems: compact ? "center" : "flex-start",
          }}
        >
          <Artwork s={active} big />
          <div style={{ minWidth: 0, flex: 1, width: "100%" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: compact ? 32 : 44,
                color: "var(--fg)",
                letterSpacing: "-.02em",
                lineHeight: 1.0,
                wordBreak: "break-word",
                textAlign: compact ? "center" : "left",
              }}
            >
              {active.name}
            </div>
            <div
              className="t-body"
              style={{
                color: "var(--fg-muted)",
                marginTop: 8,
                textAlign: compact ? "center" : "left",
              }}
            >
              {active.city} · {active.country}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 14,
                flexWrap: "wrap",
                justifyContent: compact ? "center" : "flex-start",
              }}
            >
              {(active.tags || []).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <HR style={{ marginTop: 20, marginBottom: 18 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Telem label="Bitrate" value={active.kbps} unit="kbps" />
              <Telem label="Codec" value={active.codec} />
              <Telem label="Listening" value={fmtTime(elapsedSec)} mono />
            </div>
          </div>
        </div>

        {isError && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--err)",
              borderLeft: "3px solid var(--err)",
            }}
          >
            <div className="t-eyebrow" style={{ color: "var(--err)" }}>
              {playState === "blocked" ? "BLOCKED" : "STREAM ERROR"}
            </div>
            <div className="t-body" style={{ color: "var(--fg)", marginTop: 6 }}>
              {errorMsg}
            </div>
          </div>
        )}

        {compact ? (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
              <button style={iconBtn} onClick={onPrev} aria-label="Previous">
                <I.Prev size={16} />
              </button>
              <button
                onClick={() => (isError ? onRetry() : onPause())}
                style={{
                  ...iconBtn,
                  width: 64,
                  height: 64,
                  background: isError ? "var(--err)" : "var(--accent)",
                  color: "var(--accent-fg)",
                  borderColor: isError ? "var(--err)" : "var(--accent)",
                }}
                aria-label={isError ? "Retry" : isPlaying ? "Pause" : "Play"}
              >
                {isError ? <I.Refresh size={22} /> : isPlaying ? <I.Pause size={24} /> : <I.Play size={20} />}
              </button>
              <button style={iconBtn} onClick={onNext} aria-label="Next">
                <I.Next size={16} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <button
                onClick={onToggleFav}
                style={{
                  ...iconBtn,
                  width: "100%",
                  padding: "0 14px",
                  height: 44,
                  gap: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isFav ? "var(--accent)" : "var(--fg)",
                }}
              >
                {isFav ? <I.HeartFill size={14} /> : <I.Heart size={14} />}
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
                  {isFav ? "Saved" : "Save"}
                </span>
              </button>
              <button
                onClick={onStop}
                style={{
                  ...iconBtn,
                  width: "100%",
                  padding: "0 14px",
                  height: 44,
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                }}
              >
                Stop
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={onToggleFav}
              style={{
                ...iconBtn,
                width: "auto",
                padding: "0 14px",
                height: 40,
                gap: 8,
                display: "flex",
                alignItems: "center",
                color: isFav ? "var(--accent)" : "var(--fg)",
              }}
            >
              {isFav ? <I.HeartFill size={14} /> : <I.Heart size={14} />}
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
                {isFav ? "Saved" : "Save"}
              </span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button style={iconBtn} onClick={onPrev} aria-label="Previous">
                <I.Prev size={14} />
              </button>
              <button
                onClick={() => (isError ? onRetry() : onPause())}
                style={{
                  ...iconBtn,
                  width: 56,
                  height: 56,
                  background: isError ? "var(--err)" : "var(--accent)",
                  color: "var(--accent-fg)",
                  borderColor: isError ? "var(--err)" : "var(--accent)",
                }}
                aria-label={isError ? "Retry" : isPlaying ? "Pause" : "Play"}
              >
                {isError ? <I.Refresh size={20} /> : isPlaying ? <I.Pause size={22} /> : <I.Play size={18} />}
              </button>
              <button style={iconBtn} onClick={onNext} aria-label="Next">
                <I.Next size={14} />
              </button>
            </div>
            <button
              onClick={onStop}
              style={{
                ...iconBtn,
                width: "auto",
                padding: "0 14px",
                height: 40,
                fontFamily: "var(--font-body)",
                fontSize: 13,
              }}
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Telem({ label, value, unit, mono }) {
  return (
    <div>
      <div className="t-eyebrow" style={{ color: "var(--fg-dim)" }}>
        {label}
      </div>
      <div style={{ marginTop: 6, color: "var(--fg)" }}>
        <span
          style={{
            fontFamily: mono ? "var(--font-mono)" : "var(--font-display)",
            fontSize: mono ? 16 : 22,
            letterSpacing: "-.01em",
          }}
        >
          {value}
        </span>
        {unit && (
          <span className="t-mono" style={{ color: "var(--fg-dim)", marginLeft: 4 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
