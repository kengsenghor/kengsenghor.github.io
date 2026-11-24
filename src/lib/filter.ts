export type Entry = { title: string; summary: string; tags: string[] };
export type FilterState = { q: string; tags: string[] };

const lower = (s: string) => s.toLowerCase();

/** Every active tag must be present (AND); the query must appear in title, summary or tags. */
export function matches(e: Entry, query: string, activeTags: string[]): boolean {
  const tags = e.tags.map(lower);
  if (!activeTags.every((t) => tags.includes(lower(t)))) return false;
  const q = lower(query.trim());
  if (!q) return true;
  return [e.title, e.summary, ...e.tags].some((f) => lower(f).includes(q));
}

export function buildHash(s: FilterState): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set('q', s.q.trim());
  for (const t of s.tags) p.append('tag', t);
  const out = p.toString();
  return out ? `#${out}` : '';
}

export function parseHash(hash: string): FilterState {
  try {
    const p = new URLSearchParams(hash.replace(/^#/, ''));
    return { q: (p.get('q') ?? '').trim(), tags: p.getAll('tag').filter((t) => t.trim() !== '') };
  } catch {
    return { q: '', tags: [] };
  }
}
