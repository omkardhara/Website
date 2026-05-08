import { useState } from "react";
import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { SOCIALS } from "../../data/socials";
import { OFFERINGS } from "../../data/offerings";

// ─────────────────────────────────────────────────────────────
// CONTACT — replaces BookMe. No form. Just email + socials.
// ─────────────────────────────────────────────────────────────
export function Contact() {
  const [emailHovered, setEmailHovered] = useState(false);

  return (
    <section id="book" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "72px" }}>
          <ODLabel>Work With Me</ODLabel>
          <SectionHeading style={{ marginBottom: "16px" }}>Got something worth<br /><em style={{ color: "var(--gold)" }}>building together?</em></SectionHeading>
          <p style={{ color: "var(--text-2)", fontSize: "15px", lineHeight: 1.85, maxWidth: "560px", marginBottom: "16px" }}>Brands, agencies, curators, festival programmers — if you've made it this far, you probably already know what you want. Get in touch.</p>
          <MW3BAside>No deck required. An honest brief is worth more.</MW3BAside>
        </div>

        {/* Two columns */}
        <div className="book-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,7vw,100px)", alignItems: "start" }}>

          {/* Left — offerings */}
          <div>
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>What I offer</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {OFFERINGS.map((o) => (
                <div key={o.id} className="offer-card" style={{ background: "var(--bg-warm)", border: "1px solid var(--line-faint)", padding: "28px 26px" }}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "28px", marginTop: "2px" }}>{o.icon}</span>
                    <div>
                      <div style={{ ...F.mono, fontSize: "9px", color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px" }}>{o.label}</div>
                      <div style={{ ...F.serif, fontSize: "19px", fontWeight: 500, marginBottom: "10px", color: "var(--text)" }}>{o.title}</div>
                      <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.75, marginBottom: "10px" }}>{o.desc}</p>
                      <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.12em", borderTop: "1px solid var(--line-faint)", paddingTop: "10px" }}>{o.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — contact details */}
          <div className="reveal">
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: "24px" }}>Get in touch</div>

            {/* Email — large and prominent */}
            <a
              href="mailto:omkar.dhara@gmail.com"
              style={{ display: "block", textDecoration: "none", paddingBottom: "32px", borderBottom: "1px solid var(--line-faint)", marginBottom: "32px" }}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
            >
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "14px" }}>Email</div>
              <div style={{ ...F.serif, fontSize: "clamp(18px,3vw,32px)", fontWeight: 400, lineHeight: 1.25, color: emailHovered ? "var(--gold)" : "var(--text)", transition: "color 0.25s", wordBreak: "break-all" }}>
                omkar.dhara@gmail.com
              </div>
              <div style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.14em", marginTop: "12px", display: "flex", alignItems: "center", gap: "6px", opacity: emailHovered ? 1 : 0.7, transition: "opacity 0.25s" }}>
                Write to me <span>→</span>
              </div>
            </a>

            {/* Social links */}
            <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px" }}>Find me here</div>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-row"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid var(--line-faint)", textDecoration: "none" }}
              >
                <span style={{ ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ ...F.mono, fontSize: "11px", color: "var(--gold)" }}>{s.handle}</span>
                  <span style={{ color: "var(--gold)", fontSize: "11px" }}>→</span>
                </div>
              </a>
            ))}

            <MW3BAside style={{ marginTop: "36px" }}>
              I read every message personally. Usually respond within 48 hours.
            </MW3BAside>
          </div>
        </div>
      </div>
    </section>
  );
}
