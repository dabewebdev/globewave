import { I } from "./Icons.jsx";

export default function MobileTabs({ value, onChange }) {
  const tabBtn = (key, label, icon) => {
    const active = value === key;
    return (
      <button
        key={key}
        onClick={() => onChange(key)}
        style={{
          flex: 1,
          height: 40,
          borderRadius: "var(--r-control)",
          border: "none",
          background: active ? "var(--bg-card)" : "transparent",
          color: active ? "var(--fg)" : "var(--fg-muted)",
          fontFamily: "var(--font-body)",
          fontSize: 13,
          fontWeight: active ? 600 : 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          cursor: "pointer",
          boxShadow: active ? "var(--elev-1)" : "none",
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        margin: "12px 16px 0",
        padding: 4,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        flexShrink: 0,
      }}
    >
      {tabBtn("list", "List", <I.Search size={14} />)}
      {tabBtn("globe", "Globe", <I.Globe size={14} />)}
    </div>
  );
}
