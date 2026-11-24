import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { findBannedTerms, loadBannedTerms, parseTerms } from '../../src/lib/banned';

describe('findBannedTerms', () => {
  it('returns matched terms case-insensitively', () => {
    expect(findBannedTerms('an Acme build', ['acme'])).toEqual(['acme']);
  });
  it('returns [] for clean text', () => {
    expect(findBannedTerms('a generic build', ['acme'])).toEqual([]);
  });
});

describe('parseTerms / loadBannedTerms', () => {
  it('ignores blank lines and # comments', () => {
    expect(parseTerms('# note\n\nacme\n  \nfoo bar\n')).toEqual(['acme', 'foo bar']);
  });
  it('throws when the file has no terms (a guard with no terms is a silent pass)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'bt-'));
    const f = join(dir, 'banned-terms.txt');
    writeFileSync(f, '# only a comment\n');
    expect(() => loadBannedTerms(f)).toThrow(/no terms/i);
  });
});

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', '.astro', '.git', '.superpowers'].includes(name)) continue;
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

describe('repository content', () => {
  it('contains no banned term in src/, public/, docs/, tests/, scripts/, root config or README.md', () => {
    const root = process.cwd();
    const terms = loadBannedTerms(join(root, 'banned-terms.txt'));
    const rootFiles = readdirSync(root).filter((n) => /\.(ts|mjs|json|md)$/.test(n) && n !== 'package-lock.json').map((n) => join(root, n));
    const files = ['src', 'public', 'docs', 'tests', 'scripts'].flatMap((d) => { try { return walk(join(root, d)); } catch { return []; } }).concat(rootFiles);
    const hits: string[] = [];
    for (const f of files) {
      if (f.endsWith('banned-terms.test.ts')) continue;
      if (findBannedTerms(readFileSync(f, 'utf8'), terms).length) hits.push(relative(root, f));
    }
    expect(hits).toEqual([]);
  });
});
