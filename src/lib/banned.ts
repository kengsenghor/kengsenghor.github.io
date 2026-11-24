import { readFileSync } from 'node:fs';

export function parseTerms(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

export function loadBannedTerms(path = 'banned-terms.txt'): string[] {
  const terms = parseTerms(readFileSync(path, 'utf8'));
  if (terms.length === 0) throw new Error(`${path} has no terms; a guard with no terms always passes`);
  return terms;
}

export function findBannedTerms(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t.toLowerCase()));
}
