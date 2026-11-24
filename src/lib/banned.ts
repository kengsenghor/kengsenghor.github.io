import { readFileSync } from 'node:fs';

export function parseTerms(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

export function loadBannedTerms(path = 'banned-terms.txt'): string[] {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    throw new Error(`${path} is missing. It is kept local and never committed: copy banned-terms.example.txt to banned-terms.txt and add the terms.`);
  }
  const terms = parseTerms(raw);
  if (terms.length === 0) throw new Error(`${path} has no terms; a guard with no terms always passes`);
  return terms;
}

export function findBannedTerms(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t.toLowerCase()));
}
