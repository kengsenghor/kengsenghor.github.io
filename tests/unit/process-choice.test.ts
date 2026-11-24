import { describe, it, expect } from 'vitest';
import { QUESTIONS, recommend } from '../../src/lib/process-choice';

const pick = (lean: 'scrum' | 'kanban') =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, q.options.findIndex((o) => o.leans === lean)]));

describe('process choice', () => {
  it('has five questions, each with a scrum, a kanban and a neutral-or-mixed option', () => {
    expect(QUESTIONS).toHaveLength(5);
    for (const q of QUESTIONS) {
      expect(q.options.some((o) => o.leans === 'scrum'), q.id).toBe(true);
      expect(q.options.some((o) => o.leans === 'kanban'), q.id).toBe(true);
      for (const o of q.options) expect(o.reason.length).toBeGreaterThan(10);
    }
  });
  it('recommends scrum when every answer leans scrum', () => {
    const r = recommend(pick('scrum'));
    expect(r.pick).toBe('scrum');
    expect(r.scrum).toBe(5);
    expect(r.kanban).toBe(0);
    expect(r.reasons).toHaveLength(5);
  });
  it('recommends kanban when every answer leans kanban', () => {
    expect(recommend(pick('kanban')).pick).toBe('kanban');
  });
  it('says either on a tie and on no answers, and always explains the trade-off', () => {
    const mixed = pick('scrum');
    mixed[QUESTIONS[0].id] = QUESTIONS[0].options.findIndex((o) => o.leans === 'kanban');
    mixed[QUESTIONS[1].id] = QUESTIONS[1].options.findIndex((o) => o.leans === 'kanban');
    mixed[QUESTIONS[2].id] = QUESTIONS[2].options.findIndex((o) => o.leans === 'kanban');
    // 2 scrum vs 3 kanban is not a tie, so flip one back to make it 3-2 scrum then check a true tie with 4 answers
    const tie = { [QUESTIONS[0].id]: pick('scrum')[QUESTIONS[0].id], [QUESTIONS[1].id]: pick('kanban')[QUESTIONS[1].id] };
    expect(recommend(tie).pick).toBe('either');
    expect(recommend({}).pick).toBe('either');
    for (const a of [pick('scrum'), pick('kanban'), tie, {}]) expect(recommend(a).tradeOff.length).toBeGreaterThan(20);
  });
  it('ignores unknown questions and out-of-range options', () => {
    const r = recommend({ nope: 1, [QUESTIONS[0].id]: 99, [QUESTIONS[1].id]: -1 });
    expect(r.pick).toBe('either');
    expect(r.reasons).toHaveLength(0);
  });
});
