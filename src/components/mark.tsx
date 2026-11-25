/**
 * The pixel VS mark: V in ink, S in orange, on a 7 × 5 grid. It plots in square by square on
 * page load and again on hover of the enclosing `.group` (CSS in globals.css, `.mark-px`).
 */
const V = ["X.X", "X.X", "X.X", "X.X", ".X."];
const S = ["XXX", "X..", "XXX", "..X", "XXX"];

export const MARK_CELLS = V.flatMap((v, r) =>
  (v + "." + S[r]).split("").map((ch, c) => ({ r, c, on: ch === "X", s: c > 3 })),
);

export function Mark({
  cell = 3,
  gap = 1,
  className,
  introTarget = false,
}: {
  cell?: number;
  gap?: number;
  className?: string;
  /** The homepage intro flies its big mark onto this one when it ends. */
  introTarget?: boolean;
}) {
  return (
    <span
      className={`grid shrink-0 ${className ?? ""}`}
      {...(introTarget ? { "data-intro-target": "", "data-cell": cell, "data-gap": gap } : {})}
      style={{ gridTemplateColumns: `repeat(7, ${cell}px)`, gridAutoRows: `${cell}px`, gap }}
      aria-hidden="true"
    >
      {MARK_CELLS.map(({ r, c, on, s }) =>
        on ? (
          <span
            key={`${r}-${c}`}
            className={`mark-px ${s ? "bg-accent" : "bg-ink"}`}
            style={{ animationDelay: `${(c * 0.06 + r * 0.03).toFixed(2)}s` }}
          />
        ) : (
          <span key={`${r}-${c}`} />
        ),
      )}
    </span>
  );
}
