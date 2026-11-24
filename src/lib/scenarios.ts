export type Choice = 'allow' | 'halt';
export type Scenario = { id: string; proposal: string; evidence: string; correct: Choice; rule: string; why: string };

export const SCENARIOS: Scenario[] = [
  {
    id: 'delete-assertion',
    proposal: 'A checkout test fails because the confirmation message is missing. The agent proposes deleting the assertion so the test passes.',
    evidence: 'The test goes green. The confirmation message is still missing in the live app.',
    correct: 'halt',
    rule: 'Never edit an assertion.',
    why: 'The assertion is the reason the test exists. If it needs to pass, halt and report a probable product bug instead of making the test agree with it.',
  },
  {
    id: 'fixed-sleep',
    proposal: 'A test fails intermittently on a slow page. The agent adds a fixed five-second sleep before the click.',
    evidence: 'Three runs pass, but each run is now five seconds slower.',
    correct: 'halt',
    rule: 'No arbitrary sleeps.',
    why: 'A fixed wait hides the timing issue you need to see and fails again on a slower day. Wait for a specific condition instead.',
  },
  {
    id: 'hardcode-data',
    proposal: 'A test fails because a generated order ID collides with an earlier run. The agent replaces it with the literal ID 1001.',
    evidence: 'The collision disappears on the first run.',
    correct: 'halt',
    rule: 'Never swap generated data for a literal.',
    why: 'Generated identifiers are what isolate one run from the last. A literal brings the collision back as soon as the suite runs in parallel.',
  },
  {
    id: 'empty-evidence',
    proposal: 'An agent finishes the generation stage and reports PASS, with no file paths, selectors or output attached.',
    evidence: 'Status: PASS. Evidence: empty.',
    correct: 'halt',
    rule: 'A pass with no evidence is a claim, not a result.',
    why: 'The gate refuses a PASS without evidence, and work is graded by a different context from the one that produced it.',
  },
  {
    id: 'laptop-baseline',
    proposal: 'A visual test fails on a one-pixel font difference. The agent regenerates the screenshot baseline on a laptop and commits it.',
    evidence: 'The visual test now passes locally.',
    correct: 'halt',
    rule: 'Baselines are rendered in CI, and existing ones are never overwritten.',
    why: 'A baseline from another machine bakes in that machine\'s rendering. A diff must first be triaged as regression, intentional change or flake.',
  },
  {
    id: 'renamed-locator',
    proposal: 'A button was renamed from "Submit" to "Place order". The agent updates the selector in the one page object that owns it.',
    evidence: 'The diff touches one page object and no assertion. The test passes three times in a row.',
    correct: 'allow',
    rule: 'Fixes inside the page object layer, with evidence, are in scope.',
    why: 'Selectors live in page objects so that a renamed control changes one file. The assertion is untouched and the evidence is complete.',
  },
  {
    id: 'explicit-wait',
    proposal: 'A test clicks before a table has loaded. The agent adds an explicit wait for the table to become visible.',
    evidence: 'No assertion changed. Three consecutive green runs, including one on a throttled network.',
    correct: 'allow',
    rule: 'Wait for a condition, not for time.',
    why: 'An explicit wait for a visible element fixes the cause, keeps the assertion intact and is backed by repeated passes.',
  },
];

/** Counts each scenario once; unanswered or unknown answers are wrong. Total is always the number of scenarios. */
export function scoreAnswers(answers: Record<string, Choice>): { correct: number; total: number } {
  const correct = SCENARIOS.filter((s) => answers[s.id] === s.correct).length;
  return { correct, total: SCENARIOS.length };
}
