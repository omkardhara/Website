import { useState } from "react";
import { F } from "../../lib/typography";
import { NAV, navHref } from "../../data/nav";

// ─────────────────────────────────────────────────────────────
// NAVBAR — uses navHref() so "Story" routes to #timeline
// v3.0: now receives activeSection for active-state underline
// ─────────────────────────────────────────────────────────────
export function Navbar({ scrolled, activeSection }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, height: "62px", padding: "0 clamp(20px,5vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(248,246,241,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none", borderBottom: scrolled ? "1px solid var(--line-faint)" : "none", transition: "all 0.6s ease" }} role="navigation" aria-label="Primary">
        <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }} aria-label="Home">
          <span style={{ ...F.serif, fontSize: "20px", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.05em" }}>Omkar</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.08em" }}>×</span>
          <span style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.1em" }}>MW3B</span>
        </a>

        <div className="d-nav" style={{ display: "flex", alignItems: "center", gap: "38px" }}>
          {NAV.map((l) => {
            const id = navHref(l).slice(1);
            const isActive = activeSection === id;
            return (
              <a key={l} href={navHref(l)} className={`nav-item${isActive ? " active" : ""}`} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: isActive ? "var(--gold)" : "var(--text-3)", textDecoration: "none", transition: "color 0.25s" }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text)"; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-3)"; }}>{l}</a>
            );
          })}
          <a href="#book" className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "9px 22px", fontWeight: 400 }}>Let's work</a>
        </div>

        <button className="ham" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} style={{ display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none", padding: "6px" }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ display: "block", width: "20px", height: "1px", background: "var(--text-3)", transform: open ? i === 0 ? "rotate(45deg) translate(4px,5.5px)" : i === 2 ? "rotate(-45deg) translate(4px,-5.5px)" : "scaleX(0)" : "none", transition: "all 0.28s" }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu — light cream theme ── */}
      {open && (
        <div className="mob-menu" style={{ position: "fixed", top: "62px", left: 0, right: 0, zIndex: 499, background: "rgba(248,246,241,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)", padding: "36px clamp(20px,5vw,56px)", display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV.map((l) => (
            <a key={l} href={navHref(l)} onClick={() => setOpen(false)} style={{ ...F.mono, fontSize: "13px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid var(--line-faint)", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}>{l}</a>
          ))}
          <a href="#book" onClick={() => setOpen(false)} className="btn-primary" style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", padding: "13px 28px", display: "inline-block", alignSelf: "flex-start", marginTop: "20px" }}>Let's work together</a>
        </div>
      )}
    </>
  );
}
