import { useState } from "react";
import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { TIMELINE } from "../../data/timeline";

// ─────────────────────────────────────────────────────────────
// TIMELINE v3.1 — Featured card (top) + compact expandable list
//
// Featured highlights (defined by year+title match against TIMELINE).
// Click row in list to expand inline. Click featured nav dot to swap.
// Accessible: role=button, aria-expanded, keyboard support.
// ─────────────────────────────────────────────────────────────

const HIGHLIGHT_KEYS = [
  { year: "2014", titleStartsWith: "Graduated Mech Eng" },
  { year: "2015", titleStartsWith: "Brazilian artists at Ecopark" },
  { year: "2019-20", titleStartsWith: "Nat Geo" },
  { year: "2024", titleStartsWith: "Rickshaw Run" },
  { year: "2025", titleStartsWith: "Flow Simulator" },
];

function getHighlights() {
  return HIGHLIGHT_KEYS
    .map((k) => TIMELINE.find((t) => t.year === k.year && t.title.startsWith(k.titleStartsWith)))
    .filter(Boolean);
}

// ─── Featured card ──────────────────────────────────────────
function FeaturedCard({ items, activeIdx, onSelect }) {
  const item = items[activeIdx];
  if (!item) return null;

  return (
    <div className="reveal" style={{ marginBottom: "56px" }}>
      <div className="featured-tl-card" style={{
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        gap: 0,
        background: "var(--surface)",
        border: "1px solid var(--line-faint)",
        borderRadius: "4px",
        overflow: "hidden",
        minHeight: "360px",
      }}>
        {/* Image side */}
        <div className="featured-tl-img" style={{
          background: "var(--surface-2)",
          position: "relative",
          minHeight: "280px",
          overflow: "hidden",
        }}>
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              ...F.mono, fontSize: "11px", letterSpacing: "0.22em",
              textTransform: "uppercase", color: "var(--text-4)",
            }}>
              image coming soon
            </div>
          )}
          {/* Year badge — overlay top-left */}
          <div style={{
            position: "absolute", top: "20px", left: "20px",
            ...F.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--bg)", background: "rgba(15,15,13,0.78)",
            padding: "8px 14px", borderRadius: "2px", backdropFilter: "blur(8px)",
          }}>
            {item.year}
          </div>
        </div>

        {/* Text side */}
        <div className="featured-tl-text" style={{
          padding: "clamp(28px,3.5vw,44px)",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px",
        }}>
          <div style={{
            ...F.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--gold)",
          }}>
            {item.tag}
          </div>
          <h3 style={{
            ...F.serif, fontSize: "clamp(22px,2.6vw,32px)", fontWeight: 400,
            lineHeight: 1.18, color: "var(--text)",
          }}>
            {item.title}
          </h3>
          <p style={{
            ...F.sans, fontSize: "15px", lineHeight: 1.75,
            color: "var(--text-2)",
          }}>
            {item.desc}
          </p>
        </div>
      </div>

      {/* Navigation dots */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        gap: "10px", marginTop: "20px", flexWrap: "wrap",
      }}>
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show highlight: ${it.year} ${it.title}`}
            aria-current={i === activeIdx ? "true" : undefined}
            style={{
              ...F.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "8px 14px",
              background: i === activeIdx ? "var(--gold)" : "transparent",
              color: i === activeIdx ? "var(--bg)" : "var(--text-3)",
              border: `1px solid ${i === activeIdx ? "var(--gold)" : "var(--line)"}`,
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.25s",
              minHeight: "36px",
            }}
            onMouseEnter={(e) => {
              if (i !== activeIdx) {
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.color = "var(--gold)";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== activeIdx) {
                e.currentTarget.style.borderColor = "var(--line)";
                e.currentTarget.style.color = "var(--text-3)";
              }
            }}
          >
            {it.year}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Compact list row ──────────────────────────────────────
function TimelineRow({ item, isOpen, onToggle, isHighlighted }) {
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div style={{ borderBottom: "1px solid var(--line-faint)" }}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`${item.year}: ${item.title}. ${isOpen ? "Collapse" : "Expand"} details.`}
        onClick={onToggle}
        onKeyDown={onKey}
        className="tl-row"
        style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr auto",
          gap: "20px",
          alignItems: "center",
          padding: "18px 4px",
          minHeight: "64px",
          cursor: "pointer",
          transition: "background 0.2s",
          outline: "none",
        }}
        onFocus={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}
        onBlur={(e) => { e.currentTarget.style.background = "transparent"; }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{
          ...F.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase",
          color: isHighlighted ? "var(--gold)" : "var(--text-3)",
          fontWeight: isHighlighted ? 500 : 400,
        }}>
          {item.year}
        </div>

        <div style={{
          ...F.serif, fontSize: "clamp(15px,1.6vw,18px)", fontWeight: 400,
          lineHeight: 1.35, color: "var(--text)",
        }}>
          {item.title}
        </div>

        <div aria-hidden="true" style={{
          ...F.mono, fontSize: "14px", color: "var(--text-3)",
          width: "20px", textAlign: "center",
          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
        }}>
          ›
        </div>
      </div>

      {/* Expanded panel */}
      <div style={{
        maxHeight: isOpen ? "600px" : "0",
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s ease, opacity 0.25s ease, padding 0.4s ease",
        padding: isOpen ? "8px 0 28px 120px" : "0 0 0 120px",
      }}>
        {isOpen && (
          <div style={{
            display: "grid",
            gridTemplateColumns: item.image ? "180px 1fr" : "1fr",
            gap: "24px",
            alignItems: "start",
          }} className="tl-expand">
            {item.image && (
              <div style={{
                width: "100%", aspectRatio: "4/3",
                background: "var(--surface-2)",
                overflow: "hidden", borderRadius: "2px",
              }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
              </div>
            )}
            <div>
              <div style={{
                ...F.mono, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
                color: "var(--gold)", marginBottom: "10px",
              }}>
                {item.tag}
              </div>
              <p style={{
                ...F.sans, fontSize: "14.5px", lineHeight: 1.75,
                color: "var(--text-2)", maxWidth: "640px",
              }}>
                {item.desc}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Timeline section ─────────────────────────────────
export function Timeline() {
  const highlights = getHighlights();
  const [activeFeatured, setActiveFeatured] = useState(0);
  const [openRowIdx, setOpenRowIdx] = useState(null);

  // Highlight set for marking rows in the list
  const highlightTitles = new Set(highlights.map((h) => h.title));

  return (
    <section id="timeline" style={{
      padding: "var(--section-y) var(--section-x)",
      background: "var(--bg)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "44px", maxWidth: "720px" }}>
          <ODLabel>The Story</ODLabel>
          <SectionHeading style={{ marginBottom: "16px" }}>
            A decade of <em style={{ color: "var(--gold)" }}>building things</em><br />
            that didn't exist before.
          </SectionHeading>
          <MW3BAside style={{ marginTop: "16px", maxWidth: "520px" }}>
            Five turning points up top. Click any year below to read the rest.
          </MW3BAside>
        </div>

        {/* Featured highlight card */}
        <FeaturedCard
          items={highlights}
          activeIdx={activeFeatured}
          onSelect={setActiveFeatured}
        />

        {/* Compact list — full timeline */}
        <div className="reveal" style={{
          borderTop: "1px solid var(--line)",
          marginTop: "8px",
        }}>
          <div style={{
            ...F.mono, fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--text-3)", padding: "20px 4px 12px",
          }}>
            Full timeline
          </div>
          {TIMELINE.map((item, i) => (
            <TimelineRow
              key={`${item.year}-${i}`}
              item={item}
              isOpen={openRowIdx === i}
              onToggle={() => setOpenRowIdx(openRowIdx === i ? null : i)}
              isHighlighted={highlightTitles.has(item.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
