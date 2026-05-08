import { useState, useEffect, useRef } from "react";
import { F } from "../../lib/typography";
import { CRED_CLIENTS } from "../../data/credClients";

// ─────────────────────────────────────────────────────────────
// CREDIBILITY STRIP — "Featured & trusted by" ticker
//
//   - Logo placeholder tile (40px tall) + brand name pair
//   - Auto-scrolls horizontally (CSS @keyframes mq)
//   - Pause on hover (desktop) and on tap (mobile)
//   - Clickable when client.link is set
// ─────────────────────────────────────────────────────────────

export function CredStrip() {
  const [paused, setPaused] = useState(false);
  const items = [...CRED_CLIENTS, ...CRED_CLIENTS]; // duplicate for seamless loop

  // Mobile tap-to-pause: reset after 4s of no tap
  const timeoutRef = useRef(null);
  const togglePause = () => {
    setPaused((p) => !p);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setPaused(false), 4000);
  };
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--line-faint)",
        borderBottom: "1px solid var(--line-faint)",
        overflow: "hidden",
        padding: "26px 0",
      }}
    >
      <div
        style={{
          ...F.mono,
          fontSize: "11px",
          letterSpacing: "0.22em",
          color: "var(--text-3)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: "18px",
        }}
      >
        Featured &amp; trusted by
      </div>

      <div
        style={{ overflow: "hidden", cursor: "none" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={togglePause}
        aria-label="Featured publications and clients"
      >
        <div
          className="mq"
          style={{
            display: "flex",
            width: "max-content",
            gap: "0",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {items.map((c, i) => {
            const inner = (
              <>
                {/* Logo tile (placeholder or real image) */}
                <div
                  className="cred-logo-box"
                  style={{
                    width: "104px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: c.logo ? "transparent" : "var(--surface-2)",
                    border: c.logo ? "none" : "1px dashed var(--line)",
                    borderRadius: "2px",
                    flexShrink: 0,
                    transition: "filter 0.25s, opacity 0.25s",
                    filter: c.logo ? "grayscale(1)" : "none",
                    opacity: c.logo ? 0.7 : 1,
                  }}
                  aria-hidden={c.logo ? "false" : "true"}
                >
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={`${c.name} logo`}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span
                      style={{
                        ...F.mono,
                        fontSize: "9px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--text-4)",
                      }}
                    >
                      logo
                    </span>
                  )}
                </div>

                {/* Brand name */}
                <span
                  style={{
                    ...F.mono,
                    fontSize: "13px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </span>
              </>
            );

            const baseStyle = {
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "0 28px",
              borderRight: "1px solid var(--line-faint)",
              textDecoration: "none",
              transition: "background 0.25s",
            };

            return c.link ? (
              <a
                key={i}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cred-tag-link"
                style={baseStyle}
                aria-label={`Visit ${c.name}`}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className="cred-tag" style={baseStyle}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
