import { F } from "../../lib/typography";
import { useScramble } from "../../hooks/useScramble";
import { useScrollParallax } from "../../hooks/useScrollParallax";
import { MW3BAside } from "../shared/MW3BAside";

// ─────────────────────────────────────────────────────────────
// HERO v3.1 — value-led headline + 3-tier CTA + scroll parallax
//   Three orbs drift at different speeds for depth illusion.
//   Headline lifts + fades on scroll. Cue fades fastest.
//   Honors prefers-reduced-motion (parallax → 0).
// ─────────────────────────────────────────────────────────────
export function Hero() {
  const { display, scramble } = useScramble("ManWith3Balls");
  const p = useScrollParallax(); // 0 → 1 over first viewport scroll

  // Parallax transforms (in px / opacity)
  const orbAY = p * -120; // big green orb — slowest, drifts up
  const orbBY = p * -220; // ember orb — fastest
  const orbCY = p * -60;  // small orb — slow
  const orbAOpacity = 1 - p * 0.4;
  const orbBOpacity = 1 - p * 0.6;

  const contentY = p * -40;       // subtle headline lift
  const contentOpacity = 1 - p * 0.3;
  const cueOpacity = Math.max(0, 1 - p * 3); // cue disappears in first 33% of scroll

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px clamp(20px,6vw,80px) 80px", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs — parallaxed */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
        <div className="orb-a" style={{ position: "absolute", top: "8%", right: "5%", width: "clamp(240px,38vw,560px)", height: "clamp(240px,38vw,560px)", borderRadius: "50%", background: "radial-gradient(circle at 36% 36%, rgba(46,107,79,0.1), rgba(46,107,79,0.03) 50%, transparent 72%)", border: "1px solid rgba(46,107,79,0.07)", transform: `translate3d(0, ${orbAY}px, 0)`, opacity: orbAOpacity, willChange: "transform, opacity" }} />
        <div className="orb-b" style={{ position: "absolute", top: "55%", right: "16%", width: "clamp(120px,18vw,260px)", height: "clamp(120px,18vw,260px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,98,29,0.09), transparent 70%)", border: "1px solid rgba(196,98,29,0.06)", transform: `translate3d(0, ${orbBY}px, 0)`, opacity: orbBOpacity, willChange: "transform, opacity" }} />
        <div className="orb-c" style={{ position: "absolute", top: "28%", right: "2%", width: "clamp(56px,7vw,96px)", height: "clamp(56px,7vw,96px)", borderRadius: "50%", background: "rgba(46,107,79,0.05)", border: "1px solid rgba(46,107,79,0.12)", transform: `translate3d(0, ${orbCY}px, 0)`, willChange: "transform" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(46,107,79,0.06) 30%, rgba(46,107,79,0.06) 70%, transparent)" }} />
      </div>

      <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", width: "100%", transform: `translate3d(0, ${contentY}px, 0)`, opacity: contentOpacity, willChange: "transform, opacity" }}>

        {/* Eyebrow */}
        <div className="h-1" style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px", flexWrap: "wrap" }}>
          <span style={{ ...F.serif, fontSize: "14px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.04em" }}>Omkar Dhareshwar</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.1em" }}>×</span>
          <span className="glitch-wrap" data-text={display} onMouseEnter={scramble} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ember)", paddingBottom: "2px", borderBottom: "1px solid var(--ember)", opacity: 0.9 }}>{display}</span>
          <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", marginLeft: "auto", paddingLeft: "12px" }}>Mumbai · IN</span>
        </div>

        {/* Headline */}
        <h1 className="h-2" style={{ ...F.serif, fontSize: "clamp(44px, 8vw, 108px)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em", marginBottom: "26px", maxWidth: "1000px" }}>
          Fire, flow, and stories that<br />
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>actually mean something.</em>
        </h1>

        {/* Subhead */}
        <p className="h-3" style={{ ...F.sans, fontSize: "clamp(16px,1.55vw,19px)", lineHeight: 1.6, color: "var(--text-2)", maxWidth: "720px", marginBottom: "22px", fontWeight: 400 }}>
          I perform, run flow workshops, and direct culture-led brand work — for festivals, companies, and brands that want something memorable, not forgettable.
        </p>

        {/* MW3B aside */}
        <div className="h-3" style={{ marginBottom: "32px" }}>
          <MW3BAside style={{ maxWidth: "560px" }}>Mechanical engineer by degree. Everything else by choice.</MW3BAside>
        </div>

        {/* CTAs */}
        <div className="h-4" style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "40px" }}>
          <a href="#offerings" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "16px 36px", display: "inline-block", fontWeight: 500 }}>Book a performance →</a>
          <a href="#work" className="btn-ghost" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "16px 32px", display: "inline-block" }}>See the work</a>
          <a href="#timeline" style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", marginLeft: "6px", paddingBottom: "2px", borderBottom: "1px solid var(--line-faint)", transition: "color 0.25s, border-color 0.25s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderBottomColor = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-3)"; e.currentTarget.style.borderBottomColor = "var(--line-faint)"; }}>or read the story →</a>
        </div>

        {/* Stats — single horizontal row */}
        <div className="h-5" style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "22px" }}>
          <div className="hero-stats" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3.5vw,48px)", alignItems: "baseline" }}>
            {[
              ["10+", "years", "#timeline"],
              ["500+", "murals", "#work"],
              ["12+", "press features", "#press"],
              ["3,000km", "rickshaw run", "#adventures"],
            ].map(([n, l, href]) => (
              <a key={l} href={href} className="hero-stat-link" style={{ display: "flex", alignItems: "baseline", gap: "8px", textDecoration: "none", paddingBottom: "2px", borderBottom: "1px solid transparent", transition: "border-color 0.25s, transform 0.25s" }}>
                <span style={{ ...F.serif, fontSize: "clamp(22px,2.6vw,30px)", color: "var(--gold)", fontWeight: 400, lineHeight: 1 }}>{n}</span>
                <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{l}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="drip h-5" style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: cueOpacity, willChange: "opacity", transition: "opacity 0.1s linear" }} aria-hidden="true">
        <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</span>
        <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, var(--gold-dim), transparent)" }} />
      </div>
    </section>
  );
}
