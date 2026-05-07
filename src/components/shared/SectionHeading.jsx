import { F } from "../../lib/typography";

// ─────────────────────────────────────────────────────────────
// SectionHeading — large serif H2 used at the top of every section
// ─────────────────────────────────────────────────────────────

export function SectionHeading({ children, style = {} }) {
  return (
    <h2 style={{ ...F.serif, fontSize: "clamp(36px, 5.8vw, 66px)", fontWeight: 400, lineHeight: 1.05, color: "var(--text)", ...style }}>
      {children}
    </h2>
  );
}
