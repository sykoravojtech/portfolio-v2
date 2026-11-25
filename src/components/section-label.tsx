import { Reveal } from "./reveal";

export function SectionLabel({ children }: { no?: string; children: React.ReactNode }) {
  return (
    <Reveal className="kicker flex items-center gap-3 text-muted reveal-rule">
      {children}
      <span className="h-px flex-1 bg-line origin-left" aria-hidden="true" />
    </Reveal>
  );
}
