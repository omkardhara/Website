import { F } from "../../lib/typography";

// ─────────────────────────────────────────────────────────────
// ODLabel — small section eyebrow with O-mark
// Used at the top of every section header in the OD voice.
// ─────────────────────────────────────────────────────────────

export function ODLabel({ children, style = {} }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px", ...style }}>
      <span style={{ ...F.serif, fontSize: "11px", fontWeight: 600, color: "var(--bg)", background: "var(--gold)", width: "22px", height: "22px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: 0, lineHeight: 1 }}>O</span>
      <span style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>{children}</span>
    </div>
  );
}
