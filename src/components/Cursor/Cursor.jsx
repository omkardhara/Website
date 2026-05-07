import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────────────────
export function Cursor() {
  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);
  const ball3Ref = useRef(null);
  const wrapRef  = useRef(null);
  const posRef   = useRef({ x: -100, y: -100 });
  const b1 = useRef({ x: -100, y: -100 });
  const b2 = useRef({ x: -100, y: -100 });
  const b3 = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lerp = (a, b, t) => a + (b - a) * t;
    const onMove = (e) => { posRef.current = { x: e.clientX, y: e.clientY }; };
    const SELECTOR = "a, button, .work-card, .note-card, .offer-card, .vid-card, .cred-tag, .press-card, .timeline-row";
    const onOver = (e) => { if (e.target.closest(SELECTOR)) wrapRef.current?.classList.add("cursor-hovered"); };
    const onOut  = (e) => { if (e.target.closest(SELECTOR)) wrapRef.current?.classList.remove("cursor-hovered"); };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    const loop = () => {
      b1.current.x = lerp(b1.current.x, posRef.current.x, 0.35);
      b1.current.y = lerp(b1.current.y, posRef.current.y, 0.35);
      b2.current.x = lerp(b2.current.x, b1.current.x, 0.22);
      b2.current.y = lerp(b2.current.y, b1.current.y, 0.22);
      b3.current.x = lerp(b3.current.x, b2.current.x, 0.14);
      b3.current.y = lerp(b3.current.y, b2.current.y, 0.14);
      if (ball1Ref.current) { ball1Ref.current.style.left = b1.current.x + "px"; ball1Ref.current.style.top = b1.current.y + "px"; }
      if (ball2Ref.current) { ball2Ref.current.style.left = b2.current.x + "px"; ball2Ref.current.style.top = b2.current.y + "px"; }
      if (ball3Ref.current) { ball3Ref.current.style.left = b3.current.x + "px"; ball3Ref.current.style.top = b3.current.y + "px"; }
      rafRef.current = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} id="cursor-wrap">
      <div id="ball-1" className="cursor-ball" ref={ball1Ref} />
      <div id="ball-2" className="cursor-ball" ref={ball2Ref} />
      <div id="ball-3" className="cursor-ball" ref={ball3Ref} />
    </div>
  );
}
