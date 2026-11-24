import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

describe('photo stays out of git', () => {
  it('no image file is tracked anywhere except the favicon-style svg monogram assets', () => {
    const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
    const images = files.filter((f) => /\.(jpe?g|png|webp|avif|heic)$/i.test(f));
    expect(images).toEqual([]);
  });
  it('the local photo path is git-ignored', () => {
    const out = execFileSync('git', ['check-ignore', 'src/assets/headshot.jpg'], { encoding: 'utf8' }).trim();
    expect(out).toBe('src/assets/headshot.jpg');
  });
});
