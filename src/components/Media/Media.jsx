import { F } from "../../lib/typography";
import { ODLabel } from "../shared/ODLabel";
import { MW3BAside } from "../shared/MW3BAside";
import { SectionHeading } from "../shared/SectionHeading";
import { VIDEOS } from "../../data/videos";

// ─────────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────────
export function Media() {
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
