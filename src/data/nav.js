// ─────────────────────────────────────────────────────────────
// NAVIGATION DATA
// "About" replaced with "Story" — links to #timeline
// ─────────────────────────────────────────────────────────────

export const NAV = ["Story", "Work", "Writing", "Adventures", "Media", "Press"];

// helper: nav label → anchor id
export const navHref = (label) =>
  label === "Story" ? "#timeline" : `#${label.toLowerCase()}`;

// Section map — used by SideRail + active section detection
export const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "offerings", label: "Work With Me" },
  { id: "work", label: "Work" },
  { id: "press", label: "Press" },
  { id: "timeline", label: "Story" },
  { id: "writing", label: "Writing" },
  { id: "adventures", label: "Adventures" },
  { id: "media", label: "Media" },
  { id: "book", label: "Contact" },
];
