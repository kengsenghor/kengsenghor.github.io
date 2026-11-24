import { describe, it, expect } from 'vitest';
import { SCENARIOS, scoreAnswers } from '../../src/lib/scenarios';

describe('scenarios', () => {
  it('has seven scenarios with unique ids', () => {
    expect(SCENARIOS).toHaveLength(7);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(7);
  });
  it('has exactly two legitimate fixes, so halting everything does not win', () => {
    expect(SCENARIOS.filter((s) => s.correct === 'allow')).toHaveLength(2);
  });
  it('gives every scenario a proposal, evidence, rule and explanation', () => {
    for (const s of SCENARIOS) {
      for (const k of ['proposal', 'evidence', 'rule', 'why'] as const) expect(s[k].length, `${s.id}.${k}`).toBeGreaterThan(10);
    }
  });
});

describe('scoreAnswers', () => {
  it('counts correct answers out of the total', () => {
    const all = Object.fromEntries(SCENARIOS.map((s) => [s.id, s.correct]));
    expect(scoreAnswers(all)).toEqual({ correct: 7, total: 7 });
  });
  it('halting everything is not a perfect score', () => {
    const halts = Object.fromEntries(SCENARIOS.map((s) => [s.id, 'halt' as const]));
    expect(scoreAnswers(halts)).toEqual({ correct: 5, total: 7 });
  });
  it('counts unanswered as wrong and ignores unknown ids', () => {
    expect(scoreAnswers({})).toEqual({ correct: 0, total: 7 });
    expect(scoreAnswers({ nope: 'allow' })).toEqual({ correct: 0, total: 7 });
  });
});
