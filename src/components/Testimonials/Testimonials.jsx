import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { TESTIMONIALS } from "../../data/testimonials";

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
export function Testimonials() {
  return (
    <div style={{ padding: "clamp(60px,9vw,100px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "40px" }}><ODLabel>What People Say</ODLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "2px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="reveal" style={{ background: "var(--surface)", border: "1px solid var(--line-faint)", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
              <div>
                <div style={{ ...F.serif, fontSize: "48px", color: "var(--gold)", lineHeight: 0.8, marginBottom: "16px", opacity: 0.4 }}>"</div>
                <p style={{ ...F.serif, fontSize: "clamp(16px,2vw,20px)", fontStyle: "italic", fontWeight: 300, lineHeight: 1.6, color: "var(--text)" }}>{t.quote}</p>
              </div>
              <div style={{ borderTop: "1px solid var(--line-faint)", paddingTop: "20px" }}>
                <div style={{ ...F.sans, fontSize: "13px", color: "var(--gold-light)", fontWeight: 500, marginBottom: "4px" }}>{t.name}</div>
                <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.12em" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONTACT — replaces BookMe. No form. Just email + socials.
// ─────────────────────────────────────────────────────────────
function Contact() {
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

// ─────────────────────────────────────────────────────────────
// MARQUEE STRIP
// ─────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const words = ["✦ Flow Arts", "— Performance", "✦ Activism", "— Installations", "✦ Brand Work", "— Storytelling", "✦ Workshops", "— Writing"];
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div style={{ overflow: "hidden", background: "var(--surface)", borderTop: "1px solid var(--line-faint)", borderBottom: "1px solid var(--line-faint)", padding: "13px 0" }}>
      <div className="mq" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
        {doubled.map((w, i) => (
          <span key={i} style={{ ...F.mono, fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", color: i % 2 === 0 ? "var(--text-3)" : "var(--gold-dim)", padding: "0 28px" }}>{w}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER — uses navHref() so "Story" routes to #timeline
// ─────────────────────────────────────────────────────────────
function Footer() {
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

// ─────────────────────────────────────────────────────────────
// ROOT v3.0
//   + SEO + ScrollProgress + SideRail + BackToTop
//   + New page order: Hero → CredStrip → Offerings → Work
//                    → Press → Testimonials → Timeline → Field Notes
//                    → Adventures → Media → Contact
//   + MarqueeStrip kept in code (function below) but no longer rendered
// ─────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(SECTIONS.map((s) => s.id));
  useSEO();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.07, rootMargin: "0px 0px -32px 0px" }
    );
    const observe = () => document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    const t = setTimeout(observe, 150);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <SideRail activeSection={activeSection} sections={SECTIONS} />
      <main>
        <Hero />
        <CredStrip />
        <Offerings />        {/* v3.0: NEW — three-door segmenter */}
        <Work />
        <Press />
        <Testimonials />
        <Timeline />
        <FieldNotes />
        <Adventures />
        <Media />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
