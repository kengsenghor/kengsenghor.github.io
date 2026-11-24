import { describe, it, expect } from 'vitest';
import { personDays } from '../../src/lib/capacity';

describe('personDays', () => {
  it('sums each person working days after holidays and personal leave', () => {
    expect(personDays(10, 1, [0, 0, 0])).toBe(27); // 3 people x 9 days
    expect(personDays(10, 1, [2, 0, 5])).toBe(7 + 9 + 4);
  });
  it('never goes negative for one person, and ignores blank or invalid leave', () => {
    expect(personDays(10, 0, [15, NaN, -3])).toBe(0 + 10 + 10);
    expect(personDays(10, 12, [0, 0])).toBe(0);
  });
  it('is 0 for an empty team or an invalid sprint length', () => {
    expect(personDays(10, 0, [])).toBe(0);
    expect(personDays(NaN, 0, [0])).toBe(0);
    expect(personDays(-5, 0, [0])).toBe(0);
  });
  it('allows half days', () => {
    expect(personDays(10, 0.5, [1.5])).toBe(8);
  });
});
