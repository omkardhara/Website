import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";

// ─────────────────────────────────────────────────────────────
// ADVENTURES
// ─────────────────────────────────────────────────────────────
export function Adventures() {
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
