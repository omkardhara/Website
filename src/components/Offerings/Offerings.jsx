import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { OFFERINGS } from "../../data/offerings";

// ─────────────────────────────────────────────────────────────
// OFFERINGS v3.0 — NEW. Three-door segmenter (Performances / Workshops / Brand)
// ─────────────────────────────────────────────────────────────
export function Offerings() {
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

// ─────────────────────────────────────────────────────────────
// TIMELINE — reverse chronology, alternating spine
// ─────────────────────────────────────────────────────────────
function TimelineCard({ item }) {
  const fallback = item.year === "Now" ? "✦" : item.year.replace(/[^0-9]/g, "").slice(-2);
  return (
    <div className="tl-card-inner">
      <div className="tl-head">
        <div className="tl-img">
          {item.image
            ? <img src={item.image} alt={item.title} loading="lazy" />
            : <div className="tl-img-fallback">{fallback}</div>}
        </div>
        <span className="tl-tag">{item.tag}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
    </div>
  );
}

function Timeline() {
  return (
    <section id="timeline" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "72px", maxWidth: "640px" }}>
          <ODLabel>The Story</ODLabel>
          <SectionHeading style={{ marginBottom: "20px" }}>
            A decade of<br />
            <em style={{ color: "var(--gold)" }}>shape-shifting.</em>
          </SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: 1.85, marginBottom: "16px" }}>
            Most résumés are about job titles. Mine is about questions I couldn't stop asking. What follows is a reverse-chronology map — how an engineering student became the keeper of an autonomous street art district, with a few useful detours along the way.
          </p>
          <MW3BAside>Read top-down to see the present pulling forward. Read bottom-up to see how it grew.</MW3BAside>
        </div>

        {/* Spine */}
        <div className="timeline-spine">
          <div className="spine-line" />

          {TIMELINE.map((item, i) => (
            <div key={i} className={`timeline-row reveal ${i % 2 === 0 ? "" : "row-flip"}`}>
              <div className="tl-spacer" />
              <div className="tl-node">
                <span className="tl-node-year">{item.year}</span>
                <span className="tl-node-dot" />
              </div>
              <div className="tl-card">
                <TimelineCard item={item} />
              </div>
            </div>
          ))}

          {/* Origin marker */}
          <div className="tl-origin">
            <span className="tl-origin-dot" />
            <div className="tl-origin-label">Origin</div>
          </div>
        </div>
      </div>
    </section>
  );
}
