import { useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// useTilt — 3D perspective tilt on hover (used by WorkCard)
// Returns ref + mouse handlers to spread onto the target element:
//   const tilt = useTilt();
//   <div {...tilt}>...</div>
// ─────────────────────────────────────────────────────────────

export function useTilt() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(6px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      ref.current.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    if (ref.current) ref.current.style.transition = "transform 0.1s linear";
  }, []);

  return { ref, onMouseMove, onMouseLeave, onMouseEnter };
}
