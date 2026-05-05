import { I } from "./Icons.jsx";
import { Chip, Eyebrow, iconBtn } from "./ui.jsx";
import CountryPicker from "./CountryPicker.jsx";
import StationRow from "./StationRow.jsx";

export default function Sidebar({
  query,
  onQuery,
  country,
  countries,
  onCountry,
  favoritesOnly,
  onFavoritesOnly,
  favorites,
  filtered,
  selectedId,
  activeId,
  playState,
  loading,
  loadError,
  onSelect,
  onPlay,
  onToggleFav,
  compact = false,
}) {
  const localCount = filtered.length;
  const headlineCountry =
    country === "WW"
      ? "Worldwide"
      : countries.find((c) => c.code === country)?.name || country;

  const padX = compact ? 16 : 22;

  return (
    <aside
      style={{
        borderRight: compact ? "none" : "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        flex: 1,
      }}
    >
      <div
        style={{
          padding: compact ? `14px ${padX}px 12px` : "20px 22px 18px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <Eyebrow>INDEX</Eyebrow>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: compact ? 24 : 28,
            color: "var(--fg)",
            letterSpacing: "-.02em",
            marginTop: 6,
            lineHeight: 1.05,
          }}
        >
          {headlineCountry}
        </div>
        <div className="t-mono" style={{ color: "var(--fg-dim)", marginTop: 6 }}>
          {loading
            ? "LOADING…"
            : `${localCount} STATION${localCount === 1 ? "" : "S"}${activeId && playState === "playing" ? " · LIVE" : ""}`}
        </div>
      </div>

      <div
        style={{
          padding: compact ? `12px ${padX}px 10px` : "14px 22px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ position: "relative" }}>
          <I.Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--fg-dim)",
              pointerEvents: "none",
            }}
          />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search anywhere…"
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 36,
              paddingRight: 36,
              background: "var(--bg-input)",
              border: "1px solid var(--line-strong)",
              borderRadius: 0,
              color: "var(--fg)",
              outline: "none",
              fontFamily: "var(--font-body)",
              fontSize: 14,
            }}
          />
          {query && (
            <button
              onClick={() => onQuery("")}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                ...iconBtn,
                width: 24,
                height: 24,
                border: "none",
                background: "transparent",
              }}
              aria-label="Clear search"
            >
              <I.Close size={11} />
            </button>
          )}
        </div>

        <CountryPicker countries={countries} value={country} onChange={onCountry} />

        <div style={{ display: "flex", gap: 6 }}>
          <Chip active={!favoritesOnly} onClick={() => onFavoritesOnly(false)}>
            All
          </Chip>
          <Chip active={favoritesOnly} onClick={() => onFavoritesOnly(true)}>
            Favorites · {favorites.length}
          </Chip>
        </div>

        {loadError && (
          <div
            className="t-mono"
            style={{
              padding: "8px 10px",
              background: "var(--bg-card)",
              borderLeft: "3px solid var(--err)",
              color: "var(--err)",
            }}
          >
            {loadError}
          </div>
        )}
      </div>

      <div style={{ overflow: "auto", flex: 1, borderTop: "1px solid var(--line)" }}>
        {loading && filtered.length === 0 ? (
          <div style={{ padding: 28, textAlign: "center", color: "var(--fg-muted)" }}>
            <div className="t-mono">FETCHING STATIONS…</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyList
            query={query}
            country={country}
            favoritesOnly={favoritesOnly}
            favoritesCount={favorites.length}
            onClearQuery={() => onQuery("")}
            onWiden={() => onCountry("WW")}
            onShowAll={() => onFavoritesOnly(false)}
          />
        ) : (
          filtered.map((s, i) => (
            <StationRow
              key={s.id}
              s={s}
              n={i + 1}
              isSelected={selectedId === s.id}
              isActive={activeId === s.id}
              playState={playState}
              isFav={favorites.includes(s.id)}
              onFocus={() => onSelect(s.id)}
              onPlay={() => onPlay(s.id)}
              onFav={() => onToggleFav(s.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function EmptyList({ query, country, favoritesOnly, favoritesCount, onClearQuery, onWiden, onShowAll }) {
  if (favoritesOnly && favoritesCount === 0) {
    return (
      <div style={{ padding: 28, textAlign: "center" }}>
        <I.Heart size={20} style={{ color: "var(--fg-faint)" }} />
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--fg)",
            marginTop: 12,
            letterSpacing: "-.01em",
          }}
        >
          Nothing saved yet.
        </div>
        <div className="t-body" style={{ color: "var(--fg-muted)", marginTop: 6 }}>
          Tap the heart on any station to keep it close.
        </div>
        <button
          onClick={onShowAll}
          style={{
            marginTop: 18,
            height: 32,
            padding: "0 14px",
            background: "transparent",
            border: "1px solid var(--line-strong)",
            color: "var(--fg)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          SHOW ALL STATIONS
        </button>
      </div>
    );
  }
  if (query) {
    return (
      <div style={{ padding: 28, textAlign: "center" }}>
        <div className="t-mono" style={{ color: "var(--fg-dim)" }}>"{query}"</div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--fg)",
            marginTop: 8,
            letterSpacing: "-.01em",
          }}
        >
          0 stations found.
        </div>
        <div className="t-body" style={{ color: "var(--fg-muted)", marginTop: 6 }}>
          Try a single tag, or broaden to neighbours.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button
            onClick={onClearQuery}
            style={{
              height: 32,
              padding: "0 12px",
              background: "transparent",
              border: "1px solid var(--line-strong)",
              color: "var(--fg)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            CLEAR
          </button>
          {country !== "WW" && (
            <button
              onClick={onWiden}
              style={{
                height: 32,
                padding: "0 12px",
                background: "var(--accent)",
                color: "var(--accent-fg)",
                border: "none",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              SEARCH WORLDWIDE
            </button>
          )}
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: 28, textAlign: "center" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          color: "var(--fg)",
          letterSpacing: "-.01em",
        }}
      >
        No stations here.
      </div>
      <div className="t-body" style={{ color: "var(--fg-muted)", marginTop: 6 }}>
        Pick a different country, or go worldwide.
      </div>
    </div>
  );
}
