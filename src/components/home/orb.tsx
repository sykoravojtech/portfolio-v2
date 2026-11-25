"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * A dark glass sphere lit from below. It breathes, a band of light turns around it,
 * and it drifts a little toward the pointer (a shift, never a tilt: it stays a perfect circle).
 * Reduced motion: still.
 */
export function Orb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || !matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        // Shift only: a 3D tilt would squash the circle into an ellipse
        el.style.transform = `translate3d(${dx * 24}px, ${dy * 24}px, 0)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ref} className="transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]">
        <div className="orb w-[200px] sm:w-[260px]" />
      </div>
    </div>
  );
}
