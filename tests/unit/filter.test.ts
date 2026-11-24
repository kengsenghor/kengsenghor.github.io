import { describe, it, expect } from 'vitest';
import { matches, parseHash, buildHash } from '../../src/lib/filter';

const e = { title: 'Forecasting sprints', summary: 'Compares like with like', tags: ['Agile delivery', 'Metrics'] };

describe('matches', () => {
  it('matches everything with no query and no tags', () => {
    expect(matches(e, '', [])).toBe(true);
  });
  it('matches query case-insensitively in title, summary or tags', () => {
    expect(matches(e, 'FORECAST', [])).toBe(true);
    expect(matches(e, 'like with like', [])).toBe(true);
    expect(matches(e, 'metrics', [])).toBe(true);
    expect(matches(e, 'kanban', [])).toBe(false);
  });
  it('requires every active tag (AND), case-insensitively', () => {
    expect(matches(e, '', ['metrics'])).toBe(true);
    expect(matches(e, '', ['Metrics', 'Agile delivery'])).toBe(true);
    expect(matches(e, '', ['Metrics', 'Kanban'])).toBe(false);
  });
  it('combines query and tags', () => {
    expect(matches(e, 'sprints', ['Metrics'])).toBe(true);
    expect(matches(e, 'kanban', ['Metrics'])).toBe(false);
  });
});

describe('hash', () => {
  it('round-trips query and tags with spaces and unicode', () => {
    const s = { q: 'page object', tags: ['Agile delivery', 'Café'] };
    expect(parseHash(buildHash(s))).toEqual(s);
  });
  it('builds an empty hash for an empty state', () => {
    expect(buildHash({ q: '', tags: [] })).toBe('');
  });
  it('is tolerant of junk', () => {
    expect(parseHash('')).toEqual({ q: '', tags: [] });
    expect(parseHash('#%E0%A4%A')).toEqual({ q: '', tags: [] });
    expect(parseHash('#tag=&q=')).toEqual({ q: '', tags: [] });
    expect(parseHash('#nonsense')).toEqual({ q: '', tags: [] });
  });
});
