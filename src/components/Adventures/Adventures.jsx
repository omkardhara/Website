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

// ─────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────
function Media() {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section id="media" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)" }}>
      {activeVideo && (
        <div onClick={() => setActiveVideo(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,8,0.92)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "900px", aspectRatio: "16/9", position: "relative" }}>
            <iframe src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`} title="Video" allow="autoplay; encrypted-media; fullscreen" allowFullScreen style={{ width: "100%", height: "100%", border: "none" }} />
            <button onClick={() => setActiveVideo(null)} style={{ position: "absolute", top: "-44px", right: 0, background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer" }}>Close ✕</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: "56px" }}>
          <ODLabel>Media</ODLabel>
          <SectionHeading>Don't take my word<br /><em style={{ color: "var(--gold)" }}>for it.</em></SectionHeading>
          <MW3BAside style={{ marginTop: "14px", maxWidth: "360px" }}>Some things only make sense when they're moving.</MW3BAside>
        </div>

        <div className="vid-cols" style={{ display: "grid", gap: "2px", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {VIDEOS.map((v, i) => (
            <div key={i} className={`vid-card reveal reveal-d${i + 1}`} style={{ cursor: "pointer" }} onClick={() => setActiveVideo(v.yt)} role="button" aria-label={`Watch: ${v.title}`}>
              <div className="vid-thumb" style={{ aspectRatio: "16/9", background: "var(--surface-3)", position: "relative", border: "1px solid var(--line-faint)", marginBottom: "14px", overflow: "hidden" }}>
                {v.thumb ? <img src={v.thumb} alt={v.title} className="vid-thumb-inner" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="vid-thumb-inner" style={{ position: "absolute", inset: 0, background: v.bg }} />}
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,15,13,0.18)", transition: "background 0.3s" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                  <div className="play-btn" style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1px solid rgba(46,107,79,0.7)", background: "rgba(248,246,241,0.12)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ marginLeft: "4px", width: 0, height: 0, borderStyle: "solid", borderWidth: "9px 0 9px 15px", borderColor: "transparent transparent transparent var(--gold)" }} />
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "10px", left: "12px", zIndex: 1, ...F.mono, fontSize: "8px", color: "rgba(248,246,241,0.7)", letterSpacing: "0.2em" }}>{String(i + 1).padStart(2, "0")} / {String(VIDEOS.length).padStart(2, "0")}</div>
              </div>
              <div style={{ ...F.serif, fontSize: "15px", fontWeight: 400, color: "var(--text)", marginBottom: "6px", lineHeight: 1.3 }}>{v.title}</div>
              <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.14em", textTransform: "uppercase" }}>{v.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS MODAL — lightbox for articles and PDFs
// ─────────────────────────────────────────────────────────────
function PressModal({ item, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(10,10,8,0.94)", backdropFilter: "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,48px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: item.type === "pdf" ? "900px" : "720px", width: "100%" }}>

        {/* Top bar — publication name + close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ ...F.serif, fontSize: "clamp(16px,2.5vw,22px)", color: "rgba(255,255,255,0.9)", fontWeight: 400 }}>{item.publication}</span>
            <span style={{ ...F.mono, fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.16em", marginLeft: "12px" }}>{item.year}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", ...F.mono, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 16px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s", flexShrink: 0, marginLeft: "16px" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}>Close ✕</button>
        </div>

        {/* Content — image or PDF */}
        {item.type === "pdf" ? (
          <iframe src={item.src} title={item.publication} style={{ width: "100%", height: "82vh", border: "none", display: "block", background: "white" }} />
        ) : (
          <img src={item.src} alt={`${item.publication} feature`} style={{ width: "100%", maxHeight: "82vh", objectFit: "contain", display: "block" }} />
        )}

        {/* Tap to close hint */}
        <div style={{ textAlign: "center", marginTop: "14px", ...F.mono, fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Tap outside to close</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS CARD — reusable for featured + carousel variants
// ─────────────────────────────────────────────────────────────
function PressCard({ item, variant, onClick }) {
  const isFeatured = variant === "featured";
  return (
    <div onClick={onClick} className="press-card" style={{ position: "relative", cursor: "pointer", overflow: "hidden", flexShrink: isFeatured ? undefined : 0, width: isFeatured ? undefined : "clamp(200px,26vw,300px)", aspectRatio: isFeatured ? "4/3" : "2/3", background: "var(--surface-3)", scrollSnapAlign: "start" }}>
      <img src={item.src} alt={item.publication} className="press-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: isFeatured ? "linear-gradient(to top, rgba(15,15,13,0.8) 0%, rgba(15,15,13,0.15) 50%, transparent 100%)" : "linear-gradient(to top, rgba(15,15,13,0.85) 0%, transparent 55%)", pointerEvents: "none" }} />

      {/* Featured badge */}
      {isFeatured && (
        <div style={{ position: "absolute", top: "16px", left: "16px", ...F.mono, fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)", border: "1px solid rgba(46,107,79,0.5)", background: "rgba(15,15,13,0.55)", padding: "5px 12px", backdropFilter: "blur(6px)" }}>✦ Featured</div>
      )}

      {/* PDF badge */}
      {item.type === "pdf" && (
        <div style={{ position: "absolute", top: isFeatured ? "16px" : "12px", right: "16px", ...F.mono, fontSize: "8px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(248,246,241,0.75)", border: "1px solid rgba(248,246,241,0.2)", background: "rgba(15,15,13,0.5)", padding: "4px 9px", backdropFilter: "blur(4px)" }}>PDF</div>
      )}

      {/* Publication name */}
      <div style={{ position: "absolute", bottom: isFeatured ? "24px" : "16px", left: isFeatured ? "24px" : "14px", right: "14px" }}>
        <div style={{ ...F.serif, fontSize: isFeatured ? "clamp(18px,2.5vw,30px)" : "15px", fontWeight: 400, color: "var(--bg)", lineHeight: 1.15, marginBottom: "5px" }}>{item.publication}</div>
        <div style={{ ...F.mono, fontSize: "9px", color: "rgba(248,246,241,0.5)", letterSpacing: "0.16em" }}>{item.year} · {isFeatured ? "Tap to view" : "View →"}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PRESS SECTION — featured row + horizontal carousel
// ─────────────────────────────────────────────────────────────
function Press() {
  const [activePress, setActivePress] = useState(null);
  const featured = PRESS.filter((p) => p.featured);
  const regular  = PRESS.filter((p) => !p.featured);

  return (
    <>
      <section id="press" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Header */}
          <div className="reveal" style={{ marginBottom: "56px" }}>
            <ODLabel>Press & Features</ODLabel>
            <SectionHeading>As seen in.</SectionHeading>
            <MW3BAside style={{ marginTop: "14px", maxWidth: "420px" }}>Apparently juggling in public is newsworthy. Twelve publications in.</MW3BAside>
          </div>

          {/* Featured — NatGeo + German Graffiti in large side-by-side cards */}
          {featured.length > 0 && (
            <div className="reveal press-featured" style={{ display: "grid", gridTemplateColumns: `repeat(${featured.length}, 1fr)`, gap: "2px", marginBottom: "2px" }}>
              {featured.map((item) => (
                <PressCard key={item.id} item={item} variant="featured" onClick={() => setActivePress(item)} />
              ))}
            </div>
          )}

          {/* Carousel — regular articles */}
          {regular.length > 0 && (
            <>
              {/* Right-side fade cue — hints at scrollability */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "80px", zIndex: 2, pointerEvents: "none", background: "linear-gradient(to left, var(--bg-warm), transparent)" }} />
                <div className="press-scroll" style={{ display: "flex", gap: "2px", overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: "2px" }}>
                  {regular.map((item) => (
                    <PressCard key={item.id} item={item} variant="regular" onClick={() => setActivePress(item)} />
                  ))}
                </div>
              </div>

              {/* Scroll hint */}
              <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px", ...F.mono, fontSize: "9px", color: "var(--text-4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                <span>Drag to explore</span>
                <span style={{ color: "var(--gold)" }}>→</span>
              </div>
            </>
          )}
        </div>
      </section>

      {activePress && <PressModal item={activePress} onClose={() => setActivePress(null)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────
function Testimonials() {
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
