import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { NOTES } from "../../data/notes";

// ─────────────────────────────────────────────────────────────
// FIELD NOTES — featured-note class added for mobile fix
// ─────────────────────────────────────────────────────────────
export function FieldNotes() {
  const [featured, ...rest] = NOTES;
  return (
    <section id="writing" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Writing</ODLabel>
          <SectionHeading style={{ marginBottom: "20px" }}>Thoughts that<br /><em style={{ color: "var(--gold)" }}>wouldn't fit in a caption.</em></SectionHeading>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
            <MW3BAside style={{ maxWidth: "380px" }}>I write when something refuses to leave me alone.</MW3BAside>
            <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap", alignSelf: "center", fontStyle: "italic" }}>More writing coming soon</span>
          </div>
        </div>

        {/* Featured note — "featured-note" class enables mobile stack via CSS */}
        <div className={`reveal note-card featured-note`} style={{ border: "1px solid var(--line-faint)", background: "var(--surface)", marginBottom: "2px", cursor: "pointer", display: "grid", gridTemplateColumns: featured.image ? "1fr 380px" : "1fr", overflow: "hidden" }}>
          <div style={{ padding: "clamp(36px,5vw,60px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ ...F.mono, fontSize: "9px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", padding: "4px 10px", border: "1px solid var(--border)", background: "var(--gold-faint)" }}>{featured.tag}</span>
                <span style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.12em" }}>✦ Featured</span>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{featured.date}</span>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{featured.read} read</span>
              </div>
            </div>
            <h3 style={{ ...F.serif, fontSize: "clamp(26px,4vw,44px)", fontWeight: 400, lineHeight: 1.15, marginBottom: "18px", color: "var(--text)", maxWidth: "680px" }}>{featured.title}</h3>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, maxWidth: "600px", marginBottom: "36px" }}>{featured.excerpt}</p>
            <span style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.16em", textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: "2px" }}>Read the piece →</span>
          </div>
          {/* Cover image — stacks on mobile via .featured-note CSS rule */}
          {featured.image && (
            <div className="featured-note-img" style={{ position: "relative", background: "var(--surface-3)", overflow: "hidden", minHeight: "240px" }}>
              <img src={featured.image} alt={featured.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
            </div>
          )}
        </div>

        <div className="notes-cols" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
          {rest.map((note, i) => (
            <div key={note.id} className={`note-card reveal reveal-d${i + 1}`} style={{ border: "1px solid var(--line-faint)", background: "var(--surface)", cursor: "pointer", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {note.image && <div style={{ height: "160px", overflow: "hidden", flexShrink: 0, background: "var(--surface-3)" }}><img src={note.image} alt={note.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} /></div>}
              <div style={{ padding: "28px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{note.tag}</span>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)" }}>{note.read}</span>
                </div>
                <h4 style={{ ...F.serif, fontSize: "20px", fontWeight: 400, lineHeight: 1.3, marginBottom: "12px", color: "var(--text)" }}>{note.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.85, flex: 1 }}>{note.excerpt}</p>
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--line-faint)", ...F.mono, fontSize: "12px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>Read →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// ADVENTURES
// ─────────────────────────────────────────────────────────────
function Adventures() {
  return (
    <section id="adventures" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Adventures</ODLabel>
          <SectionHeading>Occasionally, I go<br /><em style={{ color: "var(--gold)" }}>completely off-script.</em></SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "400px" }}>The Rickshaw Run was not a safe decision. It was the right one.</MW3BAside>
        </div>

        <div className="adv-cols reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--line)", overflow: "hidden" }}>
          {(() => {
            const ADVENTURE_PHOTO = "images/Rikshaw Run-Gangtok to Kochi-Omkar Dhareshwar.jpg";
            return (
              <div style={{ position: "relative", minHeight: "clamp(360px,55vw,620px)", background: "var(--surface-3)", overflow: "hidden" }}>
                {ADVENTURE_PHOTO ? (
                  <>
                    <img src={ADVENTURE_PHOTO} alt="The Rickshaw Run" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(15,15,13,0.38)" }} />
                  </>
                ) : (
                  <>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 55%, rgba(196,98,29,0.18), rgba(46,107,79,0.07) 50%, transparent 75%)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, gap: "14px" }}>
                      <div style={{ fontSize: "clamp(64px,13vw,108px)", lineHeight: 1 }}>🛺</div>
                    </div>
                  </>
                )}
                <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: ADVENTURE_PHOTO ? 0.5 : 0.2, zIndex: 2 }} viewBox="0 0 400 500" preserveAspectRatio="none">
                  <path d="M 80 80 Q 200 120 160 200 Q 120 280 220 340 Q 300 380 280 440" stroke={ADVENTURE_PHOTO ? "#ffffff" : "var(--gold)"} strokeWidth="1.5" fill="none" strokeDasharray="6 4" />
                  <circle cx="80" cy="80" r="5" fill={ADVENTURE_PHOTO ? "#ffffff" : "var(--gold)"} />
                  <circle cx="280" cy="440" r="5" fill="var(--ember)" />
                </svg>
                <div style={{ position: "absolute", bottom: "24px", left: "24px", zIndex: 3, ...F.mono, fontSize: "11px", color: ADVENTURE_PHOTO ? "rgba(255,255,255,0.9)" : "var(--ember)", letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 12px", border: "1px solid rgba(196,98,29,0.35)", background: ADVENTURE_PHOTO ? "rgba(15,15,13,0.55)" : "var(--surface)" }}>Gangtok → Kochi · 3,000 km</div>
              </div>
            );
          })()}

          <div style={{ padding: "clamp(44px,7vw,80px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ ...F.mono, fontSize: "11px", color: "var(--ember)", letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: "22px" }}>The Rickshaw Run · January 2024</div>
            <h3 style={{ ...F.serif, fontSize: "clamp(36px,5.5vw,56px)", fontWeight: 300, lineHeight: 1.02, marginBottom: "28px" }}>Gangtok to<br />Kochi.<br /><em style={{ color: "var(--gold)" }}>3,000 km.</em></h3>
            <hr className="rule" style={{ marginBottom: "26px", opacity: 0.35 }} />
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, marginBottom: "18px" }}>A mechanical nightmare dressed as an adventure. We took a three-wheeled rickshaw — a vehicle designed for flat city roads — across mountain passes, river crossings, and highways that showed up only on paper.</p>
            <p style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.9, marginBottom: "16px" }}>The engine died six times. We pushed it uphill twice. We ran out of diesel once and out of patience never.</p>
            <MW3BAside style={{ marginBottom: "36px" }}>Hardest thing I've done. Would do it again tomorrow.</MW3BAside>
            <div style={{ display: "flex", gap: "36px", marginBottom: "36px", flexWrap: "wrap" }}>
              {[["3,000+", "km covered"], ["14", "days on road"], ["6", "engine deaths"], ["∞", "chai stops"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ ...F.serif, fontSize: "clamp(28px,4.5vw,40px)", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{n}</div>
                  <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.12em", marginTop: "7px" }}>{l}</div>
                </div>
              ))}
            </div>
            <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", fontStyle: "italic" }}>Full dispatch coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
