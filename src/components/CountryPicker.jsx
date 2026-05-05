import { useEffect, useRef, useState } from "react";
import { I } from "./Icons.jsx";

export default function CountryPicker({ countries, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const cur = countries.find((c) => c.code === value);
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 40,
          width: "100%",
          padding: "0 14px",
          background: "var(--bg-card)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--r-control)",
          color: "var(--fg)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <I.Pin size={13} style={{ color: "var(--fg-dim)" }} />
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {cur?.name || "Worldwide"}
        </span>
        {cur?.count != null && (
          <span className="t-mono" style={{ color: "var(--fg-dim)" }}>
            {cur.count}
          </span>
        )}
        <I.ChevronDown size={12} style={{ color: "var(--fg-dim)", marginLeft: 4 }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: 280,
            zIndex: 20,
            background: "var(--bg-card)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--r-card)",
            boxShadow: "var(--elev-2)",
            maxHeight: 360,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: 10, borderBottom: "1px solid var(--line)" }}>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter countries…"
              style={{
                width: "100%",
                height: 32,
                padding: "0 10px",
                background: "var(--bg-input)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-control)",
                color: "var(--fg)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <div style={{ overflow: "auto", flex: 1 }}>
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQ("");
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  border: "none",
                  background: c.code === value ? "var(--accent-faint)" : "transparent",
                  color: "var(--fg)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <span>{c.name}</span>
                {c.count != null && (
                  <span className="t-mono" style={{ color: "var(--fg-dim)" }}>
                    {c.count}
                  </span>
                )}
              </button>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: 14,
                  color: "var(--fg-muted)",
                  textAlign: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
              >
                No country matches "{q}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
