import { F } from "../../lib/typography";
import { NAV, navHref } from "../../data/nav";
import { SOCIALS } from "../../data/socials";

// ─────────────────────────────────────────────────────────────
// FOOTER — uses navHref() so "Story" routes to #timeline
// ─────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "clamp(44px,7vw,72px) clamp(20px,6vw,80px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-cols" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "40px", marginBottom: "48px" }}>
          <div>
            <div style={{ ...F.serif, fontSize: "36px", fontWeight: 300, color: "var(--gold)", lineHeight: 1, marginBottom: "12px" }}>Omkar <em style={{ color: "var(--text-3)" }}>×</em> MW3B</div>
            <MW3BAside style={{ maxWidth: "280px" }}>Two names. One person. Infinite excuses to make things.</MW3BAside>
          </div>

          <div style={{ display: "flex", gap: "56px", flexWrap: "wrap" }}>
            <div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "18px" }}>Navigate</div>
              {NAV.map((l) => (
                <a key={l} href={navHref(l)} style={{ display: "block", ...F.mono, fontSize: "10px", color: "var(--text-3)", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}>{l}</a>
              ))}
            </div>
            <div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "18px" }}>Find me</div>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ display: "block", ...F.mono, fontSize: "12px", color: "var(--text-3)", textDecoration: "none", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold)")} onMouseLeave={(e) => (e.target.style.color = "var(--text-3)")}>{s.label}</a>
              ))}
            </div>
          </div>
        </div>

        <hr className="rule" style={{ marginBottom: "28px", opacity: 0.3 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-4)", letterSpacing: "0.12em" }}>© {new Date().getFullYear()} Omkar Dhareshwar aka ManWith3Balls — All rights reserved</span>
          <a href="mailto:omkar.dhara@gmail.com" style={{ ...F.mono, fontSize: "12px", color: "var(--gold)", letterSpacing: "0.14em", textDecoration: "none", transition: "color 0.25s" }} onMouseEnter={(e) => (e.target.style.color = "var(--gold-light)")} onMouseLeave={(e) => (e.target.style.color = "var(--gold)")}>omkar.dhara@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
