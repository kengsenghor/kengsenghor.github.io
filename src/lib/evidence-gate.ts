export type Status = 'PASS' | 'FAIL' | 'PARTIAL' | 'BLOCKED';
export type Outcome = 'advance' | 'refuse' | 'retry' | 'person' | 'halt';
export type Handoff = { status: Status; evidence: string[]; attempts: number; safetyViolation: boolean };

const MAX_RETRIES = 2;

/** Safety rules run first, then the evidence gate decides what happens to a stage handoff. */
export function evaluateGate(h: Handoff): { outcome: Outcome; message: string } {
  if (h.safetyViolation) {
    return { outcome: 'halt', message: 'Halted. Safety rules run before the gate is even checked, and a violation stops everything.' };
  }
  const evidence = h.evidence.map((e) => e.trim()).filter(Boolean);
  const attempts = Number.isFinite(h.attempts) && h.attempts > 0 ? Math.floor(h.attempts) : 0;
  switch (h.status) {
    case 'PASS':
      return evidence.length > 0
        ? { outcome: 'advance', message: `Advances. The status is PASS and there are ${evidence.length} piece(s) of evidence.` }
        : { outcome: 'refuse', message: 'Refused. A PASS with no evidence is a claim, not a result.' };
    case 'FAIL':
      return attempts < MAX_RETRIES
        ? { outcome: 'retry', message: `Retry. Attempt ${attempts + 1} of ${MAX_RETRIES}; after that the stage is blocked and sent to a person.` }
        : { outcome: 'person', message: 'Blocked and sent to a person. The bounded retries are used up.' };
    case 'BLOCKED':
      return { outcome: 'person', message: 'Surfaced to a person. A blocked stage is never continued silently.' };
    case 'PARTIAL':
      return { outcome: 'person', message: 'Surfaced to a person. A partial result is routed by classification and never silently continued.' };
  }
}
