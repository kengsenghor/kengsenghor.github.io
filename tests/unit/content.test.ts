import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { workSchema } from '../../src/lib/work-schema';

const dir = join(process.cwd(), 'src/content/work');

describe('case study frontmatter', () => {
  it('has the ten case studies', () => {
    expect(readdirSync(dir).filter((f) => f.endsWith('.md')).sort()).toEqual([
      'agentic-testing-pipeline.md',
      'autopilot-visual-ui-and-e2e.md',
      'designing-test-automation-frameworks.md',
      'engineering-metrics-that-drive-decisions.md',
      'forecasting-with-points-per-person-day.md',
      'manual-to-automation.md',
      'playwright-typescript-standard.md',
      'rescuing-legacy-selenium-suite.md',
      'scrum-to-kanban.md',
      'visual-ui-test-suite.md',
    ]);
  });
  it.each(['agentic-testing-pipeline', 'autopilot-visual-ui-and-e2e', 'designing-test-automation-frameworks', 'engineering-metrics-that-drive-decisions', 'forecasting-with-points-per-person-day', 'manual-to-automation', 'playwright-typescript-standard', 'rescuing-legacy-selenium-suite', 'scrum-to-kanban', 'visual-ui-test-suite'])(
    '%s parses against the schema',
    (slug) => {
      const { data } = matter(readFileSync(join(dir, `${slug}.md`), 'utf8'));
      expect(workSchema.safeParse(data).success).toBe(true);
    },
  );
  it('every study has Problem and What I did sections', () => {
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const { content } = matter(readFileSync(join(dir, f), 'utf8'));
      expect(content, f).toMatch(/^## Problem$/m);
      expect(content, f).toMatch(/^## What I did/m);
    }
  });
  it('accepts the optional forecast widget and rejects unknown widgets', () => {
    const base = { title: 'T', role: 'R', period: 'P', summary: 'a long enough summary here', tags: ['x'] };
    expect(workSchema.safeParse({ ...base, widget: 'forecast' }).success).toBe(true);
    expect(workSchema.safeParse(base).success).toBe(true);
    expect(workSchema.safeParse({ ...base, widget: 'nope' }).success).toBe(false);
  });
  it('the forecasting study declares the forecast widget', () => {
    const { data } = matter(readFileSync(join(dir, 'forecasting-with-points-per-person-day.md'), 'utf8'));
    expect(data.widget).toBe('forecast');
  });
  it('rejects an empty summary', () => {
    const r = workSchema.safeParse({ title: 'T', role: 'R', period: 'P', summary: '', tags: ['x'] });
    expect(r.success).toBe(false);
  });
  it('rejects empty tags', () => {
    const r = workSchema.safeParse({ title: 'T', role: 'R', period: 'P', summary: 'a long enough summary here', tags: [] });
    expect(r.success).toBe(false);
  });
  it('rejects a missing title', () => {
    const r = workSchema.safeParse({ role: 'R', period: 'P', summary: 'a long enough summary here', tags: ['x'] });
    expect(r.success).toBe(false);
  });
});
