// Scans every file under dist/ for banned terms. Prints file:line only, never the term list.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

let raw;
try { raw = readFileSync('banned-terms.txt', 'utf8'); } catch {
  console.error('banned-terms.txt is missing. It is kept local and never committed: copy banned-terms.example.txt to banned-terms.txt and add the terms.');
  process.exit(1);
}
const terms = raw
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
if (terms.length === 0) { console.error('banned-terms.txt has no terms'); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const phone = /\+?\d{2}[-\s]?\d{2}[-\s]?\d{6,}|\d{3}[-\s]\d{3,4}[-\s]\d{4}/;
const pdfText = (f) => {
  try { return execFileSync('pdftotext', [f, '-'], { encoding: 'utf8' }); }
  catch { console.error(`cannot read ${f}: pdftotext is required to scan PDFs`); process.exit(1); }
};

let bad = 0;
for (const f of walk('dist')) {
  let text;
  if (/\.pdf$/i.test(f)) text = pdfText(f);
  else if (/\.(html|js|css|txt|xml|json|svg|webmanifest|md)$/i.test(f)) text = readFileSync(f, 'utf8');
  else continue;
  text.split('\n').forEach((line, i) => {
    const l = line.toLowerCase();
    if (terms.some((t) => l.includes(t.toLowerCase()))) { console.error(`banned term: ${f}:${i + 1}`); bad++; }
    if (phone.test(line)) { console.error(`phone-like number: ${f}:${i + 1}`); bad++; }
  });
}
if (bad) process.exit(1);
console.log('scan-dist: clean');
