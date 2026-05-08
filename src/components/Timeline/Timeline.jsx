import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { TIMELINE } from "../../data/timeline";

// ─────────────────────────────────────────────────────────────
// TIMELINE — reverse chronology, alternating spine
// ─────────────────────────────────────────────────────────────
export function TimelineCard({ item }) {
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

export function Timeline() {
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
