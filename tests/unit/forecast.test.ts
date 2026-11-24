import { describe, it, expect } from 'vitest';
import { velocity, baseline, forecast } from '../../src/lib/forecast';

describe('velocity', () => {
  it('is points per person-day, comparing like with like', () => {
    expect(velocity(64, 80)).toBeCloseTo(0.8);
    expect(velocity(32, 40)).toBeCloseTo(0.8);
  });
  it('is 0 when person-days is not a positive finite number', () => {
    expect(velocity(10, 0)).toBe(0);
    expect(velocity(10, -5)).toBe(0);
    expect(velocity(10, NaN)).toBe(0);
    expect(velocity(NaN, 10)).toBe(0);
    expect(velocity(10, Infinity)).toBe(0);
  });
});

describe('baseline', () => {
  it('averages velocity over the last four sprints only', () => {
    const sprints = [
      { points: 100, personDays: 10 }, // old outlier, 10 per day
      { points: 8, personDays: 10 },
      { points: 8, personDays: 10 },
      { points: 8, personDays: 10 },
      { points: 8, personDays: 10 },
    ];
    expect(baseline(sprints)).toBeCloseTo(0.8);
  });
  it('skips sprints with no person-days and returns 0 when none count', () => {
    expect(baseline([{ points: 5, personDays: 0 }, { points: 8, personDays: 10 }])).toBeCloseTo(0.8);
    expect(baseline([])).toBe(0);
    expect(baseline([{ points: 5, personDays: 0 }])).toBe(0);
  });
});

describe('forecast', () => {
  it('capacity is person-days times baseline, and anything above is a stretch', () => {
    expect(forecast(1.0, 40, 45)).toEqual({ capacity: 40, stretch: 5, withinCapacity: false });
    expect(forecast(1.0, 40, 40)).toEqual({ capacity: 40, stretch: 0, withinCapacity: true });
    expect(forecast(0.8, 40, 20)).toEqual({ capacity: 32, stretch: 0, withinCapacity: true });
  });
  it('rounds to one decimal', () => {
    expect(forecast(0.333, 10, 5).capacity).toBe(3.3);
  });
  it('treats invalid inputs as zero, never NaN or Infinity', () => {
    const r = forecast(NaN, Infinity, NaN);
    expect(r).toEqual({ capacity: 0, stretch: 0, withinCapacity: true });
  });
});
