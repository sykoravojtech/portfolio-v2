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
