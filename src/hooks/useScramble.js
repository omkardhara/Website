import { useState, useRef, useCallback, useEffect } from "react";
import { CHARS } from "../lib/typography";

// ─────────────────────────────────────────────────────────────
// useScramble — text scramble/glitch effect on demand
// Usage:
//   const { display, scramble } = useScramble("ManWith3Balls");
//   <span onMouseEnter={scramble}>{display}</span>
// ─────────────────────────────────────────────────────────────

export function useScramble(target) {
  const [display, setDisplay] = useState(target);
  const frameRef = useRef(null);

  const scramble = useCallback(() => {
    let iter = 0;
    cancelAnimationFrame(frameRef.current);
    const run = () => {
      setDisplay(
        target
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < iter) return target[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      iter += 0.35;
      if (iter < target.length + 1) {
        frameRef.current = requestAnimationFrame(run);
      } else {
        setDisplay(target);
      }
    };
    frameRef.current = requestAnimationFrame(run);
  }, [target]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  return { display, scramble };
}
