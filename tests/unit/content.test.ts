import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { workSchema } from '../../src/lib/work-schema';

const dir = join(process.cwd(), 'src/content/work');

describe('case study frontmatter', () => {
  it('has the six case studies', () => {
    expect(readdirSync(dir).filter((f) => f.endsWith('.md')).sort()).toEqual([
      'agentic-testing-pipeline.md',
      'manual-to-automation.md',
      'playwright-typescript-standard.md',
      'rescuing-legacy-selenium-suite.md',
      'scrum-to-kanban.md',
      'visual-ui-test-suite.md',
    ]);
  });
  it.each(['agentic-testing-pipeline', 'manual-to-automation', 'playwright-typescript-standard', 'rescuing-legacy-selenium-suite', 'scrum-to-kanban', 'visual-ui-test-suite'])(
    '%s parses against the schema',
    (slug) => {
      const { data } = matter(readFileSync(join(dir, `${slug}.md`), 'utf8'));
      expect(workSchema.safeParse(data).success).toBe(true);
    },
  );
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
