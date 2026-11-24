import { describe, it, expect } from 'vitest';
import { scoreQuiz } from '../../src/lib/quiz';
import { LAYER_CHOICES, LAYER_ITEMS, TRIAGE_CHOICES, TRIAGE_ITEMS, METRIC_CHOICES, METRIC_ITEMS, ROUTER_CHOICES, ROUTER_ITEMS } from '../../src/lib/quizzes';

describe.each([
  ['layers', LAYER_ITEMS, LAYER_CHOICES, 7],
  ['triage', TRIAGE_ITEMS, TRIAGE_CHOICES, 7],
  ['metrics', METRIC_ITEMS, METRIC_CHOICES, 5],
  ['router', ROUTER_ITEMS, ROUTER_CHOICES, 7],
])('%s quiz data', (_name, items, choices, n) => {
  it('has the expected number of items with unique ids', () => {
    expect(items).toHaveLength(n);
    expect(new Set(items.map((i) => i.id)).size).toBe(n);
  });
  it('every correct answer is one of the choices, and every field is filled in', () => {
    for (const i of items) {
      expect(choices as readonly string[]).toContain(i.correct);
      for (const k of ['prompt', 'rule', 'why'] as const) expect(i[k].length, `${i.id}.${k}`).toBeGreaterThan(10);
    }
  });
  it('uses every choice at least once, so no single answer wins', () => {
    for (const c of choices) expect(items.some((i) => i.correct === c), c).toBe(true);
  });
});

describe('scoreQuiz', () => {
  it('counts correct answers out of the item total', () => {
    const all = Object.fromEntries(LAYER_ITEMS.map((i) => [i.id, i.correct]));
    expect(scoreQuiz(LAYER_ITEMS, all)).toEqual({ correct: 7, total: 7 });
  });
  it('counts unanswered as wrong and ignores unknown ids', () => {
    expect(scoreQuiz(LAYER_ITEMS, {})).toEqual({ correct: 0, total: 7 });
    expect(scoreQuiz(LAYER_ITEMS, { nope: 'Test' })).toEqual({ correct: 0, total: 7 });
  });
  it('picking the same answer for everything is not a perfect score', () => {
    const same = Object.fromEntries(TRIAGE_ITEMS.map((i) => [i.id, 'Flake']));
    expect(scoreQuiz(TRIAGE_ITEMS, same).correct).toBeLessThan(7);
  });
});
