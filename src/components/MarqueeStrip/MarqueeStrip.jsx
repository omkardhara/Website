import { F } from "../../lib/typography";

// ─────────────────────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────────────────────
export function MarqueeStrip() {
  const words = ["✦ Flow Arts", "— Performance", "✦ Activism", "— Installations", "✦ Brand Work", "— Storytelling", "✦ Workshops", "— Writing"];
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div style={{ overflow: "hidden", background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", padding: "13px 0" }}>
      <div className="mq" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
        {doubled.map((w, i) => (
          <span key={i} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: i % 2 === 0 ? "var(--text-3)" : "var(--gold-dim)", padding: "0 28px" }}>{w}</span>
        ))}
      </div>
    </div>
  );
}
