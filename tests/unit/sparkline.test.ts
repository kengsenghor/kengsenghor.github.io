import { describe, it, expect } from 'vitest';
import { sparklinePoints, describeSeries } from '../../src/lib/sparkline';

describe('sparklinePoints', () => {
  it('maps the first and last values to the left and right edges', () => {
    const pts = sparklinePoints([0, 5, 10], 100, 20).split(' ');
    expect(pts).toHaveLength(3);
    expect(pts[0].startsWith('0,')).toBe(true);
    expect(pts[2].startsWith('100,')).toBe(true);
  });
  it('puts higher values higher up (smaller y)', () => {
    const [a, , c] = sparklinePoints([0, 5, 10], 100, 20).split(' ').map((p) => Number(p.split(',')[1]));
    expect(c).toBeLessThan(a);
  });
  it('draws a flat line for a constant series and nothing for empty input', () => {
    const ys = new Set(sparklinePoints([4, 4, 4], 100, 20).split(' ').map((p) => p.split(',')[1]));
    expect(ys.size).toBe(1);
    expect(sparklinePoints([], 100, 20)).toBe('');
    expect(sparklinePoints([NaN, 3], 100, 20)).not.toMatch(/NaN/);
  });
});

describe('describeSeries', () => {
  it('describes the trend in words for screen readers', () => {
    expect(describeSeries([72, 73, 88], '%')).toBe('72%, 73%, 88%. Rising.');
    expect(describeSeries([95, 92], '%')).toBe('95%, 92%. Falling.');
    expect(describeSeries([5, 5], '')).toBe('5, 5. Flat.');
  });
});
