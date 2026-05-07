import { F } from "../../lib/typography";

// ─────────────────────────────────────────────────────────────
// MW3BAside — italic mono callout in the MW3B voice
// The raw, opinionated counterweight to the OD serif voice.
// ─────────────────────────────────────────────────────────────

export function MW3BAside({ children, style = {} }) {
  return (
    <div style={{ ...F.mono, fontSize: "12px", fontStyle: "italic", color: "var(--text-3)", lineHeight: 1.8, borderLeft: "2px solid var(--ember)", padding: "8px 14px", background: "rgba(196,98,29,0.04)", borderRadius: "0 4px 4px 0", ...style }}>
      <span style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ember)", marginRight: "8px", fontStyle: "normal" }}>MW3B ▸</span>
      {children}
    </div>
  );
}
