import { describe, it, expect } from 'vitest';
import { normalize, pyramidReport, DEFAULT_MIX } from '../../src/lib/pyramid';

describe('normalize', () => {
  it('scales shares to 100 and keeps proportions', () => {
    expect(normalize({ unit: 50, api: 30, e2e: 20 })).toEqual({ unit: 50, api: 30, e2e: 20 });
    expect(normalize({ unit: 1, api: 1, e2e: 2 })).toEqual({ unit: 25, api: 25, e2e: 50 });
  });
  it('falls back to the starting split for empty, negative or invalid input', () => {
    expect(normalize({ unit: 0, api: 0, e2e: 0 })).toEqual(DEFAULT_MIX);
    expect(normalize({ unit: NaN, api: -1, e2e: Infinity })).toEqual(DEFAULT_MIX);
  });
});

describe('pyramidReport', () => {
  it('the starting 50/30/20 split is a pyramid with an upkeep index of 100', () => {
    const r = pyramidReport(DEFAULT_MIX);
    expect(r.shape).toBe('pyramid');
    expect(r.upkeepIndex).toBe(100);
    expect(r.runMinutes).toBeCloseTo(69.6, 1);
  });
  it('an end-to-end heavy mix is an ice-cream cone: slower and costlier', () => {
    const r = pyramidReport({ unit: 10, api: 10, e2e: 80 });
    expect(r.shape).toBe('ice-cream cone');
    expect(r.runMinutes).toBeGreaterThan(pyramidReport(DEFAULT_MIX).runMinutes);
    expect(r.upkeepIndex).toBeGreaterThan(100);
  });
  it('an API heavy mix is a diamond, and a unit-only mix is the cheapest', () => {
    expect(pyramidReport({ unit: 20, api: 60, e2e: 20 }).shape).toBe('diamond');
    expect(pyramidReport({ unit: 100, api: 0, e2e: 0 }).upkeepIndex).toBeLessThan(100);
  });
  it('always explains itself in a sentence', () => {
    for (const m of [DEFAULT_MIX, { unit: 0, api: 0, e2e: 100 }, { unit: 33, api: 34, e2e: 33 }]) {
      expect(pyramidReport(m).verdict.length).toBeGreaterThan(30);
    }
  });
});
