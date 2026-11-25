/**
 * The homepage intro, drawn on a 2D canvas: grid paper spreads out from the centre, a pen plots the
 * pixel VS mark square by square, types the name, then the mark shrinks onto the logo in the nav.
 * Pure drawing code: `IntroOverlay` owns the canvas, the clock and the DOM.
 */
import { MARK_CELLS } from "@/components/mark";

export const NAME = "Vojtěch Sýkora";

export interface Palette {
  paper: string;
  ink: string;
  accent: string;
}

/** Where the nav logo sits on screen: its top-left corner and one cell's size and gap. */
export interface Dock {
  left: number;
  top: number;
  cell: number;
  gap: number;
}

// Timings in ms.
const GRID_MS = 450;
const PLOT_START = 480;
const STEP_MS = 60;
const LIFT_MS = 140;
const FILL_MS = 150;
const TO_NAME_MS = 230;
const CHAR_MS = 40;
const BLINK_MS = 450;
export const DOCK_MS = 750;

// The pen draws the V top-left down and back up, lifts, then the S the way a hand writes it.
const PEN: Array<[number, number] | null> = [
  [0, 0], [0, 1], [0, 2], [0, 3], [1, 4], [2, 3], [2, 2], [2, 1], [2, 0],
  null,
  [6, 0], [5, 0], [4, 0], [4, 1], [4, 2], [5, 2], [6, 2], [6, 3], [6, 4], [5, 4], [4, 4],
];
const STOPS: Array<{ c: number; r: number; t: number; lifted: boolean }> = [];
let plotEnd = PLOT_START;
{
  let lifted = false;
  for (const p of PEN) {
    if (!p) {
      plotEnd += LIFT_MS;
      lifted = true;
      continue;
    }
    STOPS.push({ c: p[0], r: p[1], t: plotEnd, lifted });
    plotEnd += STEP_MS;
    lifted = false;
  }
}
const TYPE_START = plotEnd + TO_NAME_MS;
/** When the name is typed and the cursor has blinked: the dock starts here unless skipped earlier. */
export const PLAY_MS = TYPE_START + NAME.length * CHAR_MS + BLINK_MS;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const easeOut = (u: number) => 1 - Math.pow(1 - u, 3);

export interface Geometry {
  w: number;
  h: number;
  p: number;
  side: number;
  left: number;
  top: number;
  fs: number;
  font: string;
  nameX: number;
  nameY: number;
  nameW: number;
  xs: number[];
}

export function geometry(ctx: CanvasRenderingContext2D, w: number, h: number, family: string): Geometry {
  const size = Math.min(0.16 * Math.min(w, h), 140);
  const p = size / 5;
  const left = w / 2 - 3.5 * p;
  const top = h * 0.4 - 2.5 * p;
  const fs = clamp(0.072 * Math.min(w, h), 22, 56);
  const font = `500 ${fs}px ${family}`;
  ctx.font = font;
  const nameW = ctx.measureText(NAME).width;
  const nameX = w / 2 - nameW / 2;
  const xs = [...NAME].map((_, i) => nameX + ctx.measureText(NAME.slice(0, i)).width);
  return { w, h, p, side: p * 0.84, left, top, fs, font, nameX, nameY: top + 5 * p + Math.max(14, p * 0.9) + fs * 0.8, nameW, xs };
}

const at = (g: Geometry, c: number, r: number) => [g.left + (c + 0.5) * g.p, g.top + (r + 0.5) * g.p] as const;

function gridPaper(ctx: CanvasRenderingContext2D, g: Geometry, pal: Palette, alpha: number) {
  if (alpha <= 0) return;
  const ox = g.left - (g.p - g.side) / 2;
  const oy = g.top - (g.p - g.side) / 2;
  ctx.save();
  ctx.globalAlpha = 0.07 * alpha;
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = ox - Math.ceil(ox / g.p) * g.p; x <= g.w; x += g.p) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, g.h);
  }
  for (let y = oy - Math.ceil(oy / g.p) * g.p; y <= g.h; y += g.p) {
    ctx.moveTo(0, y);
    ctx.lineTo(g.w, y);
  }
  ctx.stroke();
  ctx.restore();
}

function crosshair(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    ctx.moveTo(x + dx * r * 1.2, y + dy * r * 1.2);
    ctx.lineTo(x + dx * r * 1.7, y + dy * r * 1.7);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * One frame at time `t`. `dockAt` is when the dock began (the natural end, or a skip);
 * `dock` is the nav logo's position, or null if it is not on screen (then the mark just fades).
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  g: Geometry,
  pal: Palette,
  t: number,
  dockAt: number,
  dock: Dock | null,
) {
  const k = ease(clamp((t - dockAt) / DOCK_MS));
  const docking = t >= dockAt;
  // After a skip, everything jumps to its finished state and only the dock plays.
  const pt = docking ? Math.max(t, PLAY_MS) : t;

  ctx.clearRect(0, 0, g.w, g.h);
  ctx.save();
  ctx.globalAlpha = 1 - k;
  ctx.fillStyle = pal.paper;
  ctx.fillRect(0, 0, g.w, g.h);
  ctx.restore();

  // Grid paper spreads out from the centre.
  const spread = easeOut(clamp(pt / GRID_MS));
  ctx.save();
  ctx.beginPath();
  ctx.arc(g.w / 2, g.h * 0.4, spread * Math.hypot(g.w, g.h) * 0.6, 0, Math.PI * 2);
  ctx.clip();
  gridPaper(ctx, g, pal, spread * (1 - k));
  ctx.restore();

  // The pen's line, fading once the mark is done.
  let pen: [number, number] | null = null;
  const traceA = 1 - clamp((pt - plotEnd - 80) / 260);
  ctx.save();
  ctx.strokeStyle = pal.accent;
  ctx.globalAlpha = 0.55 * traceA;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < STOPS.length; i++) {
    const a = STOPS[i];
    if (pt < a.t) break;
    const [ax, ay] = at(g, a.c, a.r);
    if (i === 0 || a.lifted) ctx.moveTo(ax, ay);
    else ctx.lineTo(ax, ay);
    const b = STOPS[i + 1];
    if (b && pt < b.t) {
      const [bx, by] = at(g, b.c, b.r);
      const u = ease(clamp((pt - a.t) / (b.t - a.t)));
      pen = [ax + (bx - ax) * u, ay + (by - ay) * u];
      if (!b.lifted) ctx.lineTo(pen[0], pen[1]);
    } else if (!b) pen = [ax, ay];
  }
  if (traceA > 0) ctx.stroke();
  ctx.restore();
  if (pt < STOPS[0].t) {
    const [x0, y0] = at(g, 0, 0);
    const u = easeOut(clamp((pt - 150) / 330));
    pen = [g.w / 2 + (x0 - g.w / 2) * u, g.h * 0.95 + (y0 - g.h * 0.95) * u];
  }

  // The squares: an outline, then the fill grows from the centre. While docking they fly to the nav.
  for (const { r, c, on, s } of MARK_CELLS) {
    if (!on) continue;
    const stop = STOPS.find((x) => x.c === c && x.r === r)!;
    const u = clamp((pt - stop.t) / FILL_MS);
    if (u <= 0) continue;
    const color = s ? pal.accent : pal.ink;
    let [x, y] = at(g, c, r);
    let side = g.side * (0.3 + 0.7 * easeOut(u));
    let alpha = 1;
    if (docking) {
      if (dock) {
        const pitch = dock.cell + dock.gap;
        x += (dock.left + c * pitch + dock.cell / 2 - x) * k;
        y += (dock.top + r * pitch + dock.cell / 2 - y) * k;
        side += (dock.cell - side) * k;
      } else alpha = 1 - k;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    if (u < 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x - g.side / 2, y - g.side / 2, g.side, g.side);
    }
    ctx.fillStyle = color;
    ctx.fillRect(x - side / 2, y - side / 2, side, side);
    ctx.restore();
  }

  // The pen moves down to the name line and types it, with a block cursor.
  if (pt >= plotEnd && pt < TYPE_START) {
    const [lx, ly] = at(g, 4, 4);
    const u = ease(clamp((pt - plotEnd) / TO_NAME_MS));
    pen = [lx + (g.nameX - lx) * u, ly + (g.nameY - g.fs * 0.35 - ly) * u];
  }
  if (pt >= TYPE_START) {
    const n = Math.floor(clamp((pt - TYPE_START) / (CHAR_MS * NAME.length)) * NAME.length);
    ctx.save();
    ctx.globalAlpha = 1 - clamp(k * 2.5);
    ctx.font = g.font;
    ctx.fillStyle = pal.ink;
    ctx.fillText(NAME.slice(0, n), g.nameX, g.nameY);
    const blink = pt - TYPE_START - CHAR_MS * NAME.length;
    if (!docking && (blink < 0 || Math.floor(blink / 150) % 2 === 0)) {
      const x = n >= NAME.length ? g.nameX + g.nameW + 3 : g.xs[n];
      ctx.fillStyle = pal.accent;
      ctx.fillRect(x, g.nameY - g.fs * 0.78, g.fs * 0.5, g.fs * 0.92);
    }
    ctx.restore();
  }
  if (pen && pt < TYPE_START) crosshair(ctx, pen[0], pen[1], Math.max(4, g.p * 0.3), pal.accent);
}
