export function parseStart(value: string): Date {
  if (/^\d{4}$/.test(value)) {
    return new Date(`${value}-01-01T00:00:00Z`);
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Date(`${value}-01T00:00:00Z`);
  }
  return new Date(value);
}

export function compareByStartDesc<T extends { start: string }>(
  a: T,
  b: T
): number {
  return parseStart(b.start).getTime() - parseStart(a.start).getTime();
}

export function compareByEndDescThenStartAsc<
  T extends { start: string; end: string }
>(a: T, b: T): number {
  const endDiff = parseStart(b.end).getTime() - parseStart(a.end).getTime();
  if (endDiff !== 0) return endDiff;
  return parseStart(a.start).getTime() - parseStart(b.start).getTime();
}
