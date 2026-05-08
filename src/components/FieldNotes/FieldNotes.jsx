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
