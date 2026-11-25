// Motion tokens, copied from the Lab (projects-web apps/web/src/lib/motion.ts).
// globals.css mirrors them as --t-*, --ease, --ease-in and --spring.
// Rules: animate transform and opacity only. Leaving is shorter than entering.
// Reduced motion gets a short fade and nothing that moves. No loops except the orb.
export const T = { fast: 150, base: 220, slow: 300, overlay: 320, entry: 420, stagger: 45 } as const;
export const EASE = "cubic-bezier(.2,.8,.2,1)";
export const EASE_IN = "cubic-bezier(.4,0,1,1)";

/** A damped spring sampled into a CSS linear() easing. */
export function spring(stiff = 170, damp = 14, mass = 1, n = 48): string {
  let x = 0;
  let v = 0;
  const dt = 1 / 120;
  const total = 1.1;
  const pts: number[] = [];
  for (let i = 0; i <= total / dt; i++) {
    const a = (-stiff * (x - 1) - damp * v) / mass;
    v += a * dt;
    x += v * dt;
    if (i % Math.round(total / dt / n) === 0) pts.push(+x.toFixed(3));
  }
  pts[pts.length - 1] = 1;
  return `linear(${pts.join(",")})`;
}

export const SPRING = spring();

export function reducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
