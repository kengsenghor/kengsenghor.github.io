export type Sprint = { points: number; personDays: number };

const num = (n: number) => (Number.isFinite(n) ? n : 0);
const round1 = (n: number) => Math.round(n * 10) / 10;

/** Points per available person-day; 0 when person-days is not a positive finite number. */
export function velocity(points: number, personDays: number): number {
  if (!Number.isFinite(points) || !Number.isFinite(personDays) || personDays <= 0) return 0;
  return points / personDays;
}

/** Mean velocity of the last `window` sprints that have person-days; 0 when none count. */
export function baseline(sprints: Sprint[], window = 4): number {
  const usable = sprints.filter((s) => Number.isFinite(s.personDays) && s.personDays > 0 && Number.isFinite(s.points));
  const recent = usable.slice(-window);
  if (recent.length === 0) return 0;
  return recent.reduce((sum, s) => sum + velocity(s.points, s.personDays), 0) / recent.length;
}

/** Capacity is person-days times the baseline; anything planned above it is a stretch. */
export function forecast(baselineVelocity: number, personDays: number, planned: number) {
  const capacity = round1(Math.max(0, num(baselineVelocity)) * Math.max(0, num(personDays)));
  const stretch = round1(Math.max(0, num(planned) - capacity));
  return { capacity, stretch, withinCapacity: stretch === 0 };
}
