import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { LABS } from '../../src/lib/labs';

describe('labs registry', () => {
  it('has unique slugs and non-empty titles and blurbs', () => {
    expect(new Set(LABS.map((l) => l.slug)).size).toBe(LABS.length);
    for (const l of LABS) {
      expect(l.title.length).toBeGreaterThan(3);
      expect(l.blurb.length).toBeGreaterThan(20);
    }
  });
  it('has a page for every lab that claims one', () => {
    for (const l of LABS.filter((x) => x.page)) expect(existsSync(`src/pages/lab/${l.slug}.astro`), l.slug).toBe(true);
  });
});
