import { useState, useEffect } from "react";
import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { PRESS } from "../../data/press";

// ─────────────────────────────────────────────────────────────
// PRESS MODAL — lightbox for articles and PDFs
// ─────────────────────────────────────────────────────────────
export function PressModal({ item, onClose }) {
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
export function PressCard({ item, variant, onClick }) {
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
export function Press() {
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
