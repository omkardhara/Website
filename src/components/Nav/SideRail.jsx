// ─────────────────────────────────────────────────────────────
// SideRail v3.0 — desktop dot navigation (right side, vertical)
// ─────────────────────────────────────────────────────────────
export function SideRail({ activeSection, sections }) {
  return (
    <nav className="side-rail" aria-label="Section navigation">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`side-rail-item${activeSection === s.id ? " active" : ""}`}
          aria-label={`Jump to ${s.label}`}
          aria-current={activeSection === s.id ? "true" : undefined}
        >
          <span className="side-rail-label">{s.label}</span>
          <span className="side-rail-dot" />
        </a>
      ))}
    </nav>
  );
}
