const round1 = (n: number) => Math.round(n * 10) / 10;

/** Working days available to a team: each person's sprint days minus shared holidays and their own leave. */
export function personDays(sprintDays: number, holidays: number, leaves: number[]): number {
  if (!Number.isFinite(sprintDays) || sprintDays <= 0) return 0;
  const h = Math.min(sprintDays, Math.max(0, Number.isFinite(holidays) ? holidays : 0));
  const total = leaves.reduce((sum, l) => {
    const leave = Number.isFinite(l) ? Math.max(0, l) : 0;
    return sum + Math.max(0, sprintDays - h - leave);
  }, 0);
  return round1(total);
}
