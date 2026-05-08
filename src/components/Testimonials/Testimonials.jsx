import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { TESTIMONIALS } from "../../data/testimonials";

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export function Testimonials() {
  return (
    <div style={{ padding: "clamp(60px,9vw,100px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "40px" }}><ODLabel>What People Say</ODLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "2px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="reveal" style={{ background: "var(--surface)", border: "1px solid var(--line-faint)", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
              <div>
                <div style={{ ...F.serif, fontSize: "48px", color: "var(--gold)", lineHeight: 0.8, marginBottom: "16px", opacity: 0.4 }}>"</div>
                <p style={{ ...F.serif, fontSize: "clamp(16px,2vw,20px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.6, color: "var(--text)" }}>{t.quote}</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "20px" }}>
                <div style={{ ...F.sans, fontSize: "13px", color: "var(--gold-light)", fontWeight: 500, marginBottom: "4px" }}>{t.name}</div>
                <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.12em" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
