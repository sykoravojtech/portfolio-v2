/** The VS bracket mark: a sibling of the Lab's Reactor mark. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M8 3H3v20h5M18 3h5v20h-5" strokeLinecap="square" />
      <circle cx="13" cy="13" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
