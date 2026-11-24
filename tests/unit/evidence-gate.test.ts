import { describe, it, expect } from 'vitest';
import { evaluateGate } from '../../src/lib/evidence-gate';

const base = { status: 'PASS' as const, evidence: ['pages/checkout.page.ts'], attempts: 0, safetyViolation: false };

describe('evaluateGate', () => {
  it('advances a PASS that carries evidence', () => {
    expect(evaluateGate(base).outcome).toBe('advance');
  });
  it('refuses a PASS with empty or blank evidence: a claim, not a result', () => {
    expect(evaluateGate({ ...base, evidence: [] }).outcome).toBe('refuse');
    expect(evaluateGate({ ...base, evidence: ['  ', ''] }).outcome).toBe('refuse');
    expect(evaluateGate({ ...base, evidence: [] }).message).toMatch(/claim/i);
  });
  it('retries a FAIL up to two times, then sends it to a person', () => {
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: 0 }).outcome).toBe('retry');
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: 1 }).outcome).toBe('retry');
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: 2 }).outcome).toBe('person');
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: 5 }).outcome).toBe('person');
  });
  it('always surfaces BLOCKED and PARTIAL to a person, even with evidence', () => {
    expect(evaluateGate({ ...base, status: 'BLOCKED' }).outcome).toBe('person');
    expect(evaluateGate({ ...base, status: 'PARTIAL' }).outcome).toBe('person');
  });
  it('safety rules run before the gate and halt everything', () => {
    expect(evaluateGate({ ...base, safetyViolation: true }).outcome).toBe('halt');
    expect(evaluateGate({ ...base, status: 'FAIL', safetyViolation: true }).outcome).toBe('halt');
  });
  it('treats invalid attempt counts as zero', () => {
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: NaN }).outcome).toBe('retry');
    expect(evaluateGate({ ...base, status: 'FAIL', attempts: -3 }).outcome).toBe('retry');
  });
});
