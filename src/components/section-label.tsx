export function SectionLabel({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <div className="kicker flex items-center gap-3 text-muted">
      <span className="text-accent-text">{no}</span>
      {children}
      <span className="h-px flex-1 bg-line rule-in" aria-hidden="true" />
    </div>
  );
}
