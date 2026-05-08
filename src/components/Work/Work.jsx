import { useState, useEffect } from "react";
import { F } from "../../lib/typography";
import { useTilt } from "../../hooks/useTilt";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { WORK, WORK_FILTERS } from "../../data/work";

// ─────────────────────────────────────────────────────────────
// PROJECT MODAL
// ─────────────────────────────────────────────────────────────
export function ProjectModal({ item, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  useEffect(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);

  const images    = item.images || [];
  const paragraphs = item.article ? item.article.split("\n\n").map((p) => p.trim()).filter(Boolean) : [];
  const blocks = [];
  const len = Math.max(paragraphs.length, images.length);
  for (let i = 0; i < len; i++) {
    if (paragraphs[i]) blocks.push({ type: "text",  value: paragraphs[i] });
    if (images[i])     blocks.push({ type: "image", value: images[i], idx: i });
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 800, background: "rgba(10,10,8,0.88)", backdropFilter: "blur(10px)", overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "clamp(16px,4vw,48px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", width: "100%", maxWidth: "680px", border: "1px solid var(--line-faint)", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(248,246,241,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line-faint)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ ...F.mono, fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>{item.tag}</span>
          <button onClick={onClose} style={{ background: "none", border: "1px solid var(--line)", padding: "6px 14px", cursor: "pointer", ...F.mono, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", transition: "border-color 0.2s, color 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.color = "var(--text-3)"; }}>Close ✕</button>
        </div>
        <div style={{ padding: "clamp(36px,5vw,56px) clamp(28px,5vw,52px) 32px" }}>
          <h2 style={{ ...F.serif, fontSize: "clamp(30px,5vw,48px)", fontWeight: 400, lineHeight: 1.08, color: "var(--text)", marginBottom: "10px" }}>{item.title}</h2>
          <div style={{ ...F.mono, fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.16em", marginBottom: "28px" }}>{item.stat}</div>
          <hr style={{ height: "1px", border: "none", background: "var(--line)", opacity: 0.6 }} />
        </div>
        <div style={{ paddingBottom: "clamp(48px,6vw,72px)" }}>
          {blocks.map((block, i) => {
            if (block.type === "text") {
              const isFirst = i === 0;
              return <p key={i} style={{ fontSize: isFirst ? "16px" : "14.5px", fontWeight: isFirst ? 400 : 300, lineHeight: 1.9, color: isFirst ? "var(--text)" : "var(--text-2)", padding: "0 clamp(28px,5vw,52px)", marginBottom: "0", marginTop: isFirst ? "0" : "clamp(28px,4vw,44px)" }}>{block.value}</p>;
            }
            if (block.type === "image") {
              const isInset = block.idx % 2 === 1;
              return (
                <div key={i} style={{ margin: isInset ? "clamp(28px,4vw,44px) clamp(28px,5vw,52px)" : "clamp(28px,4vw,44px) 0", background: "var(--surface-3)", overflow: "hidden", border: "1px solid var(--line-faint)" }}>
                  <img src={block.value} alt={`${item.title} — image ${block.idx + 1}`} loading="lazy" style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover", objectPosition: "center" }} />
                  <div style={{ padding: "8px 14px", borderTop: "1px solid var(--line-faint)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <span style={{ ...F.mono, fontSize: "11px", color: "var(--text-4)", letterSpacing: "0.18em", flexShrink: 0 }}>{String(block.idx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
                    {item.captions?.[block.idx] && <span style={{ ...F.mono, fontSize: "11px", fontStyle: "italic", color: "var(--text-3)", letterSpacing: "0.12em", textAlign: "right" }}>{item.captions[block.idx]}</span>}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WORK
// ─────────────────────────────────────────────────────────────
export function WorkCard({ item, delay, onOpen }) {
  const tilt = useTilt();
  return (
    <div {...tilt} onClick={onOpen} className="work-card" style={{ background: "var(--surface)", border: "1px solid var(--line-faint)", cursor: "pointer", overflow: "hidden" }}>
      <div style={{ height: "220px", background: "var(--surface-3)", position: "relative", overflow: "hidden" }}>
        {item.image ? (
          <img src={item.image} alt={item.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.55s cubic-bezier(0.16,1,0.3,1)" }} />
        ) : (
          <>
            <div style={{ position: "absolute", inset: 0, background: item.gradient }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "52px", opacity: 0.7 }}>{item.glyph}</div>
          </>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(15,15,13,0.35), transparent)" }} />
        <div style={{ position: "absolute", top: "12px", right: "12px", ...F.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", background: "var(--surface)", padding: "5px 10px", border: "1px solid var(--border)" }}>{item.stat}</div>
      </div>
      <div style={{ padding: "28px 26px 30px" }}>
        <div style={{ ...F.mono, fontSize: "9px", color: "var(--text-3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "10px" }}>{item.tag}</div>
        <h3 style={{ ...F.serif, fontSize: "23px", fontWeight: 500, lineHeight: 1.2, marginBottom: "12px", color: "var(--text)" }}>{item.title}</h3>
        <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.85 }}>{item.desc}</p>
        <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid var(--line-faint)", paddingTop: "18px", cursor: "pointer" }}>
          <span style={{ ...F.mono, fontSize: "10px", color: "var(--gold)", letterSpacing: "0.14em", textTransform: "uppercase" }}>View project</span>
          <span style={{ color: "var(--gold)", fontSize: "13px" }}>→</span>
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const [active, setActive] = useState("all");
  const [openProject, setOpenProject] = useState(null);
  const filtered = active === "all" ? WORK : WORK.filter((w) => w.cat === active);

  return (
    <>
      <section id="work" style={{ padding: "clamp(90px,13vw,160px) clamp(20px,6vw,80px)", background: "var(--bg-warm)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "56px" }}>
            <ODLabel>The Work</ODLabel>
            <SectionHeading style={{ marginBottom: "12px" }}>Things I've made,<br /><em style={{ color: "var(--gold)" }}>done, and survived.</em></SectionHeading>
            <MW3BAside style={{ marginBottom: "32px", maxWidth: "380px" }}>No vague "creative solutions" here. Real projects, real briefs, real outcomes.</MW3BAside>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {WORK_FILTERS.map((f) => (
                <button key={f.id} onClick={() => setActive(f.id)} style={{ ...F.mono, fontSize: "9px", letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 18px", border: "1px solid", borderColor: active === f.id ? "var(--gold)" : "var(--line-faint)", background: active === f.id ? "var(--gold)" : "transparent", color: active === f.id ? "var(--bg)" : "var(--text-3)", transition: "all 0.25s", fontFamily: "inherit" }}>{f.label}</button>
              ))}
            </div>
          </div>
          <div className="work-cols" style={{ display: "grid", gap: "2px", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filtered.map((item, i) => <WorkCard key={item.id} item={item} delay={(i % 4) + 1} onOpen={() => setOpenProject(item)} />)}
          </div>
        </div>
      </section>
      {openProject && <ProjectModal item={openProject} onClose={() => setOpenProject(null)} />}
    </>
  );
}
