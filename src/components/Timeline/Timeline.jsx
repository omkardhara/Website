import { useState, useEffect } from "react";
import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { TIMELINE } from "../../data/timeline";

// ─────────────────────────────────────────────────────────────
// TIMELINE v4.0 — Interactive Node Graph
//
// Architecture:
//   Desktop — 5 chapter circles sit on a horizontal spine.
//             Click chapter → event nodes stagger in below.
//             Click event   → detail card slides in beneath.
//             Click active  → collapses. Click new → switches.
//
//   Mobile  — Nested accordion: chapter row → event rows →
//             inline detail panel.
//
// All CSS variables verified against globals.css.
// `rise` keyframe used from globals.css line 123.
// `cursor: none` on buttons is intentional (site-wide custom cursor).
// No changes required in any other file.
// ─────────────────────────────────────────────────────────────

// ─── CHAPTER CONFIGURATION ──────────────────────────────────
//
// ⚠️  The `tags` array must match the `tag` field in data/timeline.js
//     exactly (case-sensitive). Open timeline.js and verify each
//     item's `tag` value maps to the right chapter below.
//
// ─────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id:     "genesis",
    roman:  "I",
    label:  "Genesis",
    period: "2014–15",
    desc:   "Engineering to art.",
    tags:   ["Genesis", "Foundation", "Cinema"],
  },
  {
    id:     "marol",
    roman:  "II",
    label:  "Marol",
    period: "2015–22",
    desc:   "One wall, one district.",
    tags:   ["Origin", "Expansion", "Inflection", "Community"],
  },
  {
    id:     "activism",
    roman:  "III",
    label:  "Activism",
    period: "2016–17",
    desc:   "Graffiti as civic language.",
    tags:   ["Activism", "International"],
  },
  {
    id:     "recognition",
    roman:  "IV",
    label:  "Recognition",
    period: "2019–20",
    desc:   "Nat Geo. Red Bull. The world looks.",
    tags:   ["Recognition"],
  },
  {
    id:     "mw3b",
    roman:  "V",
    label:  "MW3B",
    period: "2020–Now",
    desc:   "The artist steps forward.",
    tags:   ["Reinvention", "Adventure", "Installation · Activism", "Present"],
  },
];

/** Filter TIMELINE entries that belong to a given chapter */
function getEvents(chapter) {
  return TIMELINE.filter((item) => chapter.tags.includes(item.tag));
}

// ─── Responsive breakpoint hook ─────────────────────────────
function useIsMobile(bp = 900) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= bp : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [bp]);
  return isMobile;
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════
export function Timeline() {
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [activeEventIdx,  setActiveEventIdx]  = useState(null);
  const isMobile = useIsMobile(900);

  const activeChapter    = CHAPTERS.find((c) => c.id === activeChapterId) ?? null;
  const events           = activeChapter ? getEvents(activeChapter) : [];
  const activeEvent      = activeEventIdx != null ? events[activeEventIdx] : null;
  const activeChapterIdx = CHAPTERS.findIndex((c) => c.id === activeChapterId);

  // With justify-content:space-around over 5 items, node centres
  // land at 10 / 30 / 50 / 70 / 90 % — so connector follows precisely.
  const connectorLeftPct = activeChapterIdx >= 0 ? activeChapterIdx * 20 + 10 : 50;

  function handleSelectChapter(id) {
    if (id === activeChapterId) {
      setActiveChapterId(null);
      setActiveEventIdx(null);
    } else {
      // Reset event first so stale detail card doesn't flash
      setActiveEventIdx(null);
      setActiveChapterId(id);
    }
  }

  function handleSelectEvent(idx) {
    setActiveEventIdx((prev) => (prev === idx ? null : idx));
  }

  return (
    <section
      id="timeline"
      style={{ padding: "var(--section-y) var(--section-x)", background: "var(--bg)" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── Section heading ─────────────────────────────── */}
        <div className="reveal" style={{ marginBottom: "clamp(48px,7vw,72px)", maxWidth: "720px" }}>
          <ODLabel>The Story</ODLabel>
          <SectionHeading style={{ marginBottom: "16px" }}>
            A decade of <em style={{ color: "var(--gold)" }}>building things</em><br />
            that didn't exist before.
          </SectionHeading>
          <MW3BAside style={{ marginTop: "16px", maxWidth: "520px" }}>
            {isMobile
              ? "Tap a chapter to explore its stories."
              : "Select a chapter. Explore the stories inside it."}
          </MW3BAside>
        </div>

        {isMobile ? (
          <MobileAccordion />
        ) : (
          <DesktopGraph
            activeChapterId={activeChapterId}
            activeChapterIdx={activeChapterIdx}
            activeEventIdx={activeEventIdx}
            events={events}
            activeEvent={activeEvent}
            connectorLeftPct={connectorLeftPct}
            onSelectChapter={handleSelectChapter}
            onSelectEvent={handleSelectEvent}
          />
        )}

      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// DESKTOP — NODE GRAPH
// ═══════════════════════════════════════════════════════════════
function DesktopGraph({
  activeChapterId,
  activeChapterIdx,
  activeEventIdx,
  events,
  activeEvent,
  connectorLeftPct,
  onSelectChapter,
  onSelectEvent,
}) {
  const hasActiveChapter = activeChapterId !== null;
  const hasActiveEvent   = activeEventIdx  !== null;

  return (
    <div>

      {/* ── CHAPTER RAIL ────────────────────────────────────
          1px spine behind 5 nodes.
          justify-content:space-around → centres at 10/30/50/70/90%
          ─────────────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <div aria-hidden="true" style={{
          position:      "absolute",
          top:           "50%",
          left:          "10%",
          right:         "10%",
          height:        "1px",
          background:    "var(--line)",
          transform:     "translateY(-50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          display:        "flex",
          justifyContent: "space-around",
          alignItems:     "center",
          position:       "relative",
          zIndex:         1,
        }}>
          {CHAPTERS.map((ch) => (
            <ChapterNode
              key={ch.id}
              chapter={ch}
              isActive={ch.id === activeChapterId}
              isDimmed={hasActiveChapter && ch.id !== activeChapterId}
              onClick={() => onSelectChapter(ch.id)}
            />
          ))}
        </div>
      </div>

      {/* ── CONNECTOR: chapter → event row ──────────────────
          Gold line tracks the active chapter's horizontal position.
          ─────────────────────────────────────────────────── */}
      <div style={{
        position:   "relative",
        height:     hasActiveChapter ? "52px" : "0px",
        overflow:   "hidden",
        transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div aria-hidden="true" style={{
          position:   "absolute",
          left:       `${connectorLeftPct}%`,
          transform:  "translateX(-50%)",
          top:        0,
          bottom:     0,
          width:      "1px",
          background: "linear-gradient(to bottom, var(--gold), var(--gold-light))",
          opacity:    hasActiveChapter ? 0.5 : 0,
          transition: "left 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
        }} />
      </div>

      {/* ── EVENT NODE ROW ───────────────────────────────────
          Key on activeChapterId forces remount on chapter change,
          which replays the stagger animation cleanly.
          ─────────────────────────────────────────────────── */}
      <div style={{
        overflow:   "hidden",
        maxHeight:  hasActiveChapter ? "320px" : "0px",
        transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div style={{
          display:        "flex",
          justifyContent: "center",
          flexWrap:       "wrap",
          gap:            "clamp(20px,4vw,64px)",
          padding:        "4px 0 32px",
        }}>
          {events.map((ev, i) => (
            <EventNode
              key={`${activeChapterId}-${i}`}
              event={ev}
              index={i}
              isActive={activeEventIdx === i}
              isDimmed={hasActiveEvent && activeEventIdx !== i}
              onClick={() => onSelectEvent(i)}
            />
          ))}
          {events.length === 0 && (
            <p style={{
              ...F.mono,
              fontSize:      "10px",
              letterSpacing: "0.2em",
              color:         "var(--text-4)",
              textTransform: "uppercase",
              padding:       "24px 0",
            }}>
              no events mapped — check tag names in CHAPTERS config
            </p>
          )}
        </div>
      </div>

      {/* ── CONNECTOR: event row → detail card ──────────────
          Ember line drops when an event is active.
          ─────────────────────────────────────────────────── */}
      <div style={{
        position:   "relative",
        height:     activeEvent ? "40px" : "0px",
        overflow:   "hidden",
        transition: "height 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div aria-hidden="true" style={{
          position:   "absolute",
          left:       "50%",
          transform:  "translateX(-50%)",
          top:        0,
          bottom:     0,
          width:      "1px",
          background: "linear-gradient(to bottom, var(--ember-text), var(--ember))",
          opacity:    activeEvent ? 0.45 : 0,
          transition: "opacity 0.3s ease",
        }} />
      </div>

      {/* ── DETAIL CARD ──────────────────────────────────────
          maxHeight gives the smooth slide-in feel.
          ─────────────────────────────────────────────────── */}
      <div style={{
        overflow:   "hidden",
        maxHeight:  activeEvent ? "700px" : "0px",
        transition: "max-height 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {activeEvent && <DetailCard event={activeEvent} />}
      </div>

      {/* ── Empty state hint ─────────────────────────────── */}
      {!hasActiveChapter && (
        <p aria-hidden="true" style={{
          ...F.mono,
          fontSize:      "10px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color:         "var(--text-4)",
          textAlign:     "center",
          marginTop:     "10px",
          opacity:       0.7,
        }}>
          ↑ select a chapter
        </p>
      )}

    </div>
  );
}

// ─── Chapter Node ────────────────────────────────────────────
function ChapterNode({ chapter, isActive, isDimmed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Chapter ${chapter.roman}: ${chapter.label}, ${chapter.period}`}
      style={{
        position:      "relative",
        zIndex:        2,
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        gap:           "14px",
        background:    "none",
        border:        "none",
        padding:       "28px 0",
        cursor:        "none",   // Site-wide custom cursor — intentional
        opacity:       isDimmed ? 0.28 : 1,
        transition:    "opacity 0.4s ease",
      }}
    >
      <span style={{
        ...F.mono,
        fontSize:      "9px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color:         isActive ? "var(--gold)" : "var(--text-4)",
        transition:    "color 0.3s ease",
        whiteSpace:    "nowrap",
      }}>
        {chapter.period}
      </span>

      <div style={{
        width:          isActive ? "52px"  : "44px",
        height:         isActive ? "52px"  : "44px",
        borderRadius:   "50%",
        background:     isActive ? "var(--gold)" : "var(--bg)",
        border:         `1.5px solid ${isActive ? "var(--gold)" : "var(--line)"}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        transition:     "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        boxShadow:      isActive
          ? "0 0 0 5px var(--bg), 0 0 0 6.5px var(--gold)"
          : "none",
      }}>
        <span style={{
          ...F.serif,
          fontSize:   isActive ? "20px" : "17px",
          fontWeight: 400,
          fontStyle:  "italic",
          color:      isActive ? "var(--bg)" : "var(--text-3)",
          transition: "all 0.3s ease",
          lineHeight: 1,
        }}>
          {chapter.roman}
        </span>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{
          ...F.sans,
          fontSize:      "12px",
          fontWeight:    500,
          letterSpacing: "0.04em",
          color:         isActive ? "var(--text)" : "var(--text-2)",
          transition:    "color 0.3s ease",
          marginBottom:  "4px",
          whiteSpace:    "nowrap",
        }}>
          {chapter.label}
        </p>
        <p style={{
          ...F.mono,
          fontSize:      "9px",
          color:         "var(--text-4)",
          letterSpacing: "0.04em",
          maxWidth:      "13ch",
          lineHeight:    1.45,
        }}>
          {chapter.desc}
        </p>
      </div>
    </button>
  );
}

// ─── Event Node ──────────────────────────────────────────────
function EventNode({ event, index, isActive, isDimmed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`${event.year}: ${event.title}`}
      style={{
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        gap:             "10px",
        background:      "none",
        border:          "none",
        cursor:          "none",  // Site-wide custom cursor — intentional
        padding:         0,
        maxWidth:        "110px",
        opacity:         isDimmed ? 0.22 : 1,
        transition:      "opacity 0.3s ease",
        // `rise` keyframe — globals.css line 123. 70ms stagger per node.
        animation:       `rise 0.45s cubic-bezier(0.16,1,0.3,1) ${index * 70}ms both`,
      }}
    >
      <div style={{
        width:          "34px",
        height:         "34px",
        borderRadius:   "50%",
        background:     isActive ? "var(--ember)"  : "var(--surface)",
        border:         `1.5px solid ${isActive ? "var(--ember)" : "var(--line)"}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        transition:     "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        boxShadow:      isActive
          ? "0 0 0 4px var(--bg), 0 0 0 5.5px var(--ember)"
          : "none",
      }}>
        <span style={{
          ...F.mono,
          fontSize:   "9px",
          color:      isActive ? "var(--bg)" : "var(--text-4)",
          transition: "color 0.3s ease",
          lineHeight: 1,
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <span style={{
        ...F.mono,
        fontSize:      "9px",
        letterSpacing: "0.14em",
        color:         isActive ? "var(--ember)" : "var(--text-4)",
        transition:    "color 0.3s ease",
        whiteSpace:    "nowrap",
      }}>
        {event.year}
      </span>

      <span style={{
        ...F.sans,
        fontSize:          "11px",
        lineHeight:        1.35,
        color:             isActive ? "var(--text)" : "var(--text-3)",
        textAlign:         "center",
        transition:        "color 0.3s ease",
        display:           "-webkit-box",
        WebkitBoxOrient:   "vertical",
        WebkitLineClamp:   2,
        overflow:          "hidden",
      }}>
        {event.title.split("·")[0].trim()}
      </span>
    </button>
  );
}

// ─── Detail Card ─────────────────────────────────────────────
function DetailCard({ event }) {
  return (
    <div style={{
      display:             "grid",
      gridTemplateColumns: event.image ? "1fr 1.15fr" : "1fr",
      background:          "var(--surface)",
      border:              "1px solid var(--line-faint)",
      overflow:            "hidden",
      minHeight:           "280px",
    }}>

      {event.image && (
        <div style={{
          background: "linear-gradient(135deg, rgba(46,107,79,0.07), rgba(196,98,29,0.05))",
          overflow:   "hidden",
          position:   "relative",
          minHeight:  "260px",
        }}>
          <img
            src={event.image}
            alt={event.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      <div style={{
        padding:        "clamp(32px,4vw,52px)",
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "center",
        gap:            "18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <span style={{
            ...F.mono,
            fontSize:      "9px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color:         "var(--gold)",
            padding:       "4px 10px",
            border:        "1px solid var(--line)",
            background:    "var(--bg-warm)",
          }}>
            {event.tag}
          </span>
          <span style={{
            ...F.mono,
            fontSize:      "10px",
            letterSpacing: "0.12em",
            color:         "var(--text-4)",
          }}>
            {event.year}
          </span>
        </div>

        <h3 style={{
          ...F.serif,
          fontSize:   "clamp(21px,2.4vw,30px)",
          fontWeight: 400,
          lineHeight: 1.2,
          color:      "var(--text)",
        }}>
          {event.title}
        </h3>

        <p style={{
          ...F.sans,
          fontSize:   "15px",
          lineHeight: 1.8,
          color:      "var(--text-2)",
          maxWidth:   "var(--measure-prose)",
        }}>
          {event.desc}
        </p>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE — NESTED ACCORDION
// ═══════════════════════════════════════════════════════════════
function MobileAccordion() {
  const [openChapterId, setOpenChapterId] = useState(null);
  const [openEventIdx,  setOpenEventIdx]  = useState(null);

  function toggleChapter(id) {
    if (id === openChapterId) {
      setOpenChapterId(null);
      setOpenEventIdx(null);
    } else {
      setOpenEventIdx(null);
      setOpenChapterId(id);
    }
  }

  function toggleEvent(idx) {
    setOpenEventIdx((prev) => (prev === idx ? null : idx));
  }

  return (
    <div>
      {CHAPTERS.map((ch) => {
        const isChapterOpen = ch.id === openChapterId;
        const chEvents      = getEvents(ch);

        return (
          <div key={ch.id} style={{ borderTop: "1px solid var(--line-faint)" }}>

            {/* Chapter row */}
            <button
              type="button"
              onClick={() => toggleChapter(ch.id)}
              aria-expanded={isChapterOpen}
              aria-label={`Chapter ${ch.roman}: ${ch.label}, ${ch.period}`}
              style={{
                width:      "100%",
                display:    "flex",
                alignItems: "center",
                gap:        "18px",
                padding:    "22px 0",
                background: "none",
                border:     "none",
                cursor:     "none",
                textAlign:  "left",
              }}
            >
              <div style={{
                width:          "42px",
                height:         "42px",
                borderRadius:   "50%",
                flexShrink:     0,
                background:     isChapterOpen ? "var(--gold)" : "transparent",
                border:         `1.5px solid ${isChapterOpen ? "var(--gold)" : "var(--line)"}`,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                transition:     "all 0.35s ease",
              }}>
                <span style={{
                  ...F.serif,
                  fontSize:   "17px",
                  fontStyle:  "italic",
                  color:      isChapterOpen ? "var(--bg)" : "var(--text-3)",
                  transition: "color 0.3s ease",
                  lineHeight: 1,
                }}>
                  {ch.roman}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{
                    ...F.sans,
                    fontSize:   "15px",
                    fontWeight: 500,
                    color:      isChapterOpen ? "var(--text)" : "var(--text-2)",
                    transition: "color 0.3s ease",
                  }}>
                    {ch.label}
                  </span>
                  <span style={{
                    ...F.mono,
                    fontSize:      "9px",
                    letterSpacing: "0.14em",
                    color:         "var(--text-4)",
                  }}>
                    {ch.period}
                  </span>
                </div>
                <p style={{
                  ...F.sans,
                  fontSize:  "13px",
                  color:     "var(--text-3)",
                  marginTop: "2px",
                }}>
                  {ch.desc}
                </p>
              </div>

              <PlusMinusIcon isOpen={isChapterOpen} />
            </button>

            {/* Events panel */}
            <div style={{
              overflow:   "hidden",
              maxHeight:  isChapterOpen ? `${chEvents.length * 600 + 48}px` : "0px",
              transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <div style={{ paddingBottom: "24px", paddingLeft: "60px" }}>
                {chEvents.map((ev, ei) => {
                  const isEventOpen = isChapterOpen && openEventIdx === ei;
                  return (
                    <div key={ei} style={{ borderTop: "1px solid var(--line-faint)" }}>

                      {/* Event row */}
                      <button
                        type="button"
                        onClick={() => toggleEvent(ei)}
                        aria-expanded={isEventOpen}
                        aria-label={`${ev.year}: ${ev.title}`}
                        style={{
                          width:      "100%",
                          display:    "flex",
                          alignItems: "center",
                          gap:        "14px",
                          padding:    "16px 0",
                          background: "none",
                          border:     "none",
                          cursor:     "none",
                          textAlign:  "left",
                        }}
                      >
                        <div style={{
                          width:          "28px",
                          height:         "28px",
                          borderRadius:   "50%",
                          flexShrink:     0,
                          background:     isEventOpen ? "var(--ember)"  : "var(--surface)",
                          border:         `1px solid ${isEventOpen ? "var(--ember)" : "var(--line)"}`,
                          display:        "flex",
                          alignItems:     "center",
                          justifyContent: "center",
                          transition:     "all 0.3s ease",
                        }}>
                          <span style={{
                            ...F.mono,
                            fontSize:   "8px",
                            color:      isEventOpen ? "var(--bg)" : "var(--text-4)",
                            lineHeight: 1,
                          }}>
                            {String(ei + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div style={{ flex: 1 }}>
                          <span style={{
                            ...F.mono,
                            fontSize:      "9px",
                            color:         "var(--text-4)",
                            letterSpacing: "0.14em",
                            display:       "block",
                            marginBottom:  "3px",
                          }}>
                            {ev.year}
                          </span>
                          <span style={{
                            ...F.sans,
                            fontSize:   "14px",
                            lineHeight:  1.35,
                            color:       isEventOpen ? "var(--text)" : "var(--text-2)",
                            transition:  "color 0.3s ease",
                          }}>
                            {ev.title}
                          </span>
                        </div>

                        <PlusMinusIcon isOpen={isEventOpen} small />
                      </button>

                      {/* Inline detail panel */}
                      <div style={{
                        overflow:   "hidden",
                        maxHeight:  isEventOpen ? "560px" : "0px",
                        transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
                      }}>
                        <div style={{ paddingBottom: "20px" }}>
                          {ev.image && (
                            <div style={{
                              width:        "100%",
                              aspectRatio:  "16/9",
                              overflow:     "hidden",
                              marginBottom: "16px",
                              background:   "linear-gradient(135deg, rgba(46,107,79,0.07), rgba(196,98,29,0.05))",
                            }}>
                              <img
                                src={ev.image}
                                alt={ev.title}
                                loading="lazy"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          )}
                          <span style={{
                            ...F.mono,
                            fontSize:      "9px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color:         "var(--gold)",
                            display:       "inline-block",
                            padding:       "3px 8px",
                            border:        "1px solid var(--line)",
                            background:    "var(--bg-warm)",
                            marginBottom:  "12px",
                          }}>
                            {ev.tag}
                          </span>
                          <p style={{
                            ...F.sans,
                            fontSize:   "14px",
                            lineHeight: 1.75,
                            color:      "var(--text-2)",
                          }}>
                            {ev.desc}
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {chEvents.length === 0 && (
                  <p style={{
                    ...F.mono,
                    fontSize:      "10px",
                    letterSpacing: "0.2em",
                    color:         "var(--text-4)",
                    textTransform: "uppercase",
                    padding:       "16px 0",
                  }}>
                    no events — check tag names in CHAPTERS config
                  </p>
                )}
              </div>
            </div>

          </div>
        );
      })}
      <div style={{ borderTop: "1px solid var(--line-faint)" }} />
    </div>
  );
}

// ─── Plus / Minus toggle icon ────────────────────────────────
// Vertical bar animates to scaleY(0) when open — becomes a minus.
function PlusMinusIcon({ isOpen, small = false }) {
  const size = small ? 10 : 12;
  return (
    <div
      aria-hidden="true"
      style={{ width: small ? "18px" : "22px", height: small ? "18px" : "22px", position: "relative", flexShrink: 0 }}
    >
      <div style={{
        position:   "absolute",
        top:        "50%",
        left:       "50%",
        transform:  "translate(-50%, -50%)",
        width:      `${size}px`,
        height:     "1px",
        background: "var(--text-3)",
      }} />
      <div style={{
        position:   "absolute",
        top:        "50%",
        left:       "50%",
        transform:  `translate(-50%, -50%) scaleY(${isOpen ? 0 : 1})`,
        width:      "1px",
        height:     `${size}px`,
        background: "var(--text-3)",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}
