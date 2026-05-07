import { F } from "../../lib/typography";
import { CRED_CLIENTS } from "../../data/credClients";

// ─────────────────────────────────────────────────────────────
// CREDIBILITY STRIP v3.0 — improved label + spacing
// ─────────────────────────────────────────────────────────────
export function CredStrip() {
  const items = [...CRED_CLIENTS, ...CRED_CLIENTS];
  return (
    <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", overflow: "hidden", padding: "20px 0" }}>
      <div style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.22em", color: "var(--text-3)", textTransform: "uppercase", textAlign: "center", marginBottom: "14px" }}>Work that's been trusted by</div>
      <div style={{ overflow: "hidden" }} aria-label="Client logos marquee">
        <div className="mq" style={{ display: "flex", width: "max-content", gap: "0" }}>
          {items.map((c, i) => (
            <div key={i} className="cred-tag" style={{ ...F.mono, fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", padding: "0 32px", borderRight: "1px solid var(--line-faint)", whiteSpace: "nowrap", transition: "all 0.25s" }}>{c}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OFFERINGS v3.0 — NEW. Three-door segmenter (Performances / Workshops / Brand)
// ─────────────────────────────────────────────────────────────
function Offerings() {
  return (
    <section id="offerings" style={{ padding: "var(--section-y) var(--section-x)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px", maxWidth: "760px" }}>
          <ODLabel>Work With Me</ODLabel>
          <SectionHeading style={{ marginBottom: "18px" }}>Three ways<br /><em style={{ color: "var(--gold)" }}>we can work together.</em></SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "16px", lineHeight: 1.75, marginBottom: "14px", maxWidth: "620px" }}>
            Pick the door that fits your event, team, or brand. Or just write to me — we'll figure it out together.
          </p>
          <MW3BAside style={{ maxWidth: "440px" }}>No deck required. An honest brief is worth more.</MW3BAside>
        </div>

        <div className="offer-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "var(--line-faint)" }}>
          {OFFERINGS.map((o, i) => (
            <a
              key={o.id}
              href="#book"
              className={`offer-tile reveal reveal-d${i + 1}`}
              style={{ textDecoration: "none" }}
              aria-label={`Enquire about ${o.label}`}
            >
              <div className="offer-tile-icon" aria-hidden="true">{o.icon}</div>
              <div style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{o.label}</div>
              <h3 style={{ ...F.serif, fontSize: "clamp(22px,2.6vw,28px)", fontWeight: 500, lineHeight: 1.2, color: "var(--text)" }}>{o.title}</h3>
              <p style={{ fontSize: "14.5px", color: "var(--text-2)", lineHeight: 1.8, flex: 1 }}>{o.desc}</p>
              <div style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "16px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.14em", fontStyle: "italic" }}>{o.note}</span>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Enquire →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
