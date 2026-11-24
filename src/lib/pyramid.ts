export type Mix = { unit: number; api: number; e2e: number };
export type Shape = 'pyramid' | 'ice-cream cone' | 'diamond' | 'mixed';

export const DEFAULT_MIX: Mix = { unit: 50, api: 30, e2e: 20 };

// An illustrative model, not measured data: seconds to run one test, and relative upkeep effort per test.
const SECONDS = { unit: 0.05, api: 0.5, e2e: 20 };
const UPKEEP = { unit: 1, api: 3, e2e: 10 };
const TESTS = 1000;
const DEFAULT_UPKEEP = DEFAULT_MIX.unit * UPKEEP.unit + DEFAULT_MIX.api * UPKEEP.api + DEFAULT_MIX.e2e * UPKEEP.e2e;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function normalize(m: Mix): Mix {
  const vals = [m.unit, m.api, m.e2e];
  const sum = vals.reduce((a, b) => a + b, 0);
  if (vals.some((v) => !Number.isFinite(v) || v < 0) || sum <= 0) return { ...DEFAULT_MIX };
  const k = 100 / sum;
  return { unit: round1(m.unit * k), api: round1(m.api * k), e2e: round1(m.e2e * k) };
}

const VERDICTS: Record<Shape, string> = {
  pyramid: 'A pyramid: most checks are fast unit tests, fewer sit at the API layer and only the key journeys run end to end. This is the shape that stays quick and stable.',
  'ice-cream cone': 'An ice-cream cone: most of the weight is in slow, costly end-to-end tests. Runs are long and flaky tests are likely, so push checks down to the API and unit layers.',
  diamond: 'A diamond: the API layer carries most of the weight. That can work, but check that unit tests cover the logic cheaply and that end-to-end tests still cover the journeys customers cannot live without.',
  mixed: 'A mixed shape with no clear pyramid. Compare it with a 50/30/20 starting split and ask which layer is carrying more than it should.',
};

export function pyramidReport(input: Mix) {
  const shares = normalize(input);
  const seconds = (shares.unit * SECONDS.unit + shares.api * SECONDS.api + shares.e2e * SECONDS.e2e) * (TESTS / 100);
  const upkeepRaw = shares.unit * UPKEEP.unit + shares.api * UPKEEP.api + shares.e2e * UPKEEP.e2e;
  const { unit: u, api: a, e2e: e } = shares;
  const shape: Shape = u > a && a > e ? 'pyramid' : e > u && e >= a ? 'ice-cream cone' : a > u && a > e ? 'diamond' : 'mixed';
  return {
    shares,
    shape,
    runMinutes: round1(seconds / 60),
    upkeepIndex: Math.round((upkeepRaw / DEFAULT_UPKEEP) * 100),
    verdict: VERDICTS[shape],
  };
}
