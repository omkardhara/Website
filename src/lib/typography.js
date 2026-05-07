// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY SYSTEM
// Used as inline-style spreads: <span style={{ ...F.serif, fontSize: "13px" }}>
// ─────────────────────────────────────────────────────────────

export const F = {
  serif: { fontFamily: "'Cormorant Garamond', serif" },
  mono:  { fontFamily: "'DM Mono', monospace" },
  sans:  { fontFamily: "'DM Sans', sans-serif" },
};

// Character set for the text-scramble effect (used by useScramble)
export const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
