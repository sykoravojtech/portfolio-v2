"use client";

import { useEffect, useRef, useState } from "react";
import { PLAY_MS, dockMs, drawFrame, geometry, dockFlights, type Dock, type Geometry, type Palette } from "./plotter";

/**
 * The homepage intro. A script in the layout's <head> sets `data-intro` on <html> before first paint
 * when it should play (the homepage, once per browser session, not with reduced motion); CSS then
 * shows this overlay and hides the nav logo, so the page never flashes underneath. A click, any key
 * or Skip jumps straight to the end, where the mark flies onto the nav logo.
 */
export function IntroOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (!root.hasAttribute("data-intro") || !canvas) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    const css = getComputedStyle(root);
    const pal: Palette = {
      paper: css.getPropertyValue("--paper").trim() || "#F6F5F0",
      ink: css.getPropertyValue("--ink").trim() || "#15171A",
      accent: css.getPropertyValue("--accent").trim() || "#E4572E",
    };
    const family = getComputedStyle(document.body).fontFamily;
    let ctx: CanvasRenderingContext2D | null = null;
    let g: Geometry | null = null;
    let frame = 0;
    let start = 0;
    let dockAt = PLAY_MS;
    const flights = dockFlights();
    let finished = false;

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ctx) g = geometry(ctx, window.innerWidth, window.innerHeight, family);
    };
    const dock = (): Dock | null => {
      const el = document.querySelector<HTMLElement>("[data-intro-target]");
      const r = el?.getBoundingClientRect();
      if (!el || !r || r.width === 0 || r.bottom < 0) return null;
      return { left: r.left, top: r.top, cell: Number(el.dataset.cell) || 3, gap: Number(el.dataset.gap) || 1 };
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(frame);
      root.removeAttribute("data-intro");
      setDone(true);
    };
    const tick = (now: number) => {
      if (!start) {
        start = now;
        // The canvas paints the paper from here on, so it can fade out to show the page.
        canvas.parentElement?.classList.add("drawing");
      }
      const t = now - start;
      if (ctx && g) drawFrame(ctx, g, pal, t, dockAt, t >= dockAt ? dock() : null, flights);
      if (t >= dockAt + dockMs(flights)) finish();
      else frame = requestAnimationFrame(tick);
    };
    skipRef.current = () => {
      if (!start) return finish();
      const t = performance.now() - start;
      if (t < dockAt) dockAt = t;
    };
    const onKey = () => skipRef.current();

    size();
    window.addEventListener("resize", size);
    window.addEventListener("keydown", onKey);
    // The name is measured on the canvas, so wait briefly for the web font.
    const fonts = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 700))]);
    fonts.then(() => {
      if (finished) return;
      size();
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (done) return null;
  return (
    <div className="intro-overlay" role="presentation" onClick={() => skipRef.current()}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <button
        type="button"
        className="intro-skip"
        onClick={(e) => {
          e.stopPropagation();
          skipRef.current();
        }}
      >
        Skip intro
      </button>
    </div>
  );
}
