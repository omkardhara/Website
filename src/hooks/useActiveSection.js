import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// useActiveSection — IntersectionObserver-based scroll spy
// Returns the id of the section currently in the middle viewport band.
// Used by Navbar (active link) and SideRail (active dot).
// ─────────────────────────────────────────────────────────────

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || "");

  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds.join(",")]);

  return active;
}
