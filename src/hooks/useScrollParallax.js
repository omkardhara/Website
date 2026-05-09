import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// useScrollParallax — returns progress (0 → 1) as user scrolls
// from page top to one viewport-height down.
// 0 = hero fully visible, 1 = scrolled past hero.
// Honors prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────

export function useScrollParallax() {
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onPref = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onPref);

    if (mq.matches) return () => mq.removeEventListener("change", onPref);

    const onScroll = () => {
      const max = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onPref);
    };
  }, []);

  return reducedMotion ? 0 : progress;
}
