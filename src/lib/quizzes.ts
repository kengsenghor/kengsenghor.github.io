import type { QuizItem } from './quiz';

export const LAYER_CHOICES = ['Test', 'Helper', 'Page object', 'Control'] as const;
export const LAYER_ITEMS: QuizItem[] = [
  {
    id: 'selector-field',
    prompt: 'Where does the line `By email = By.Id("email");` belong?',
    correct: 'Page object',
    rule: 'Page objects own every selector.',
    why: 'A renamed control then changes one file, and tests never contain locators.',
  },
  {
    id: 'assert-confirmed',
    prompt: 'Where should `Assert.True(confirmationPage.IsOrderConfirmed());` live?',
    correct: 'Test',
    rule: 'Pages act. Tests decide.',
    why: 'A page object reports what it sees; the test states what must be true, so the test body reads almost like the scenario.',
  },
  {
    id: 'raw-click',
    prompt: 'Where does the low-level call `driver.FindElement(by).Click()` belong?',
    correct: 'Control',
    rule: 'Control objects hold the browser primitives.',
    why: 'Keeping primitives in a tiny control layer means the browser library can be swapped in one place.',
  },
  {
    id: 'login-flow',
    prompt: 'A routine signs in, opens the basket and adds two items. Many tests reuse it. Where does it belong?',
    correct: 'Helper',
    rule: 'Helpers hold reusable task flows.',
    why: 'A flow that strings several page actions together is shared by many tests, so it sits above the page objects and below the tests.',
  },
  {
    id: 'assert-in-page',
    prompt: 'A page object method calls `Assert.AreEqual(title, expected)`. Which layer should own that assertion instead?',
    correct: 'Test',
    rule: 'No assertions inside page objects.',
    why: 'If pages assert, the same page cannot serve tests with different expectations, and the intent of the test is buried.',
  },
  {
    id: 'waiting',
    prompt: 'A test must wait for a table to load. Where should the waiting logic live, instead of a fixed sleep?',
    correct: 'Control',
    rule: 'Waits are shared primitives behind one facade. Never use a fixed sleep.',
    why: 'Shared wait helpers wait for a condition, so tests stay fast on a good day and reliable on a slow one.',
  },
  {
    id: 'driver-lookup',
    prompt: 'Something must work out which browser the current test uses, by test ID, so parallel fixtures never collide. Where does it belong?',
    correct: 'Control',
    rule: 'One door to the driver.',
    why: 'Resolving the driver per test in one place is what lets fixtures run side by side without stealing each other\'s browser.',
  },
];

export const TRIAGE_CHOICES = ['Regression', 'Intentional change', 'Flake'] as const;
export const TRIAGE_ITEMS: QuizItem[] = [
  {
    id: 'colour-ticket',
    prompt: 'A button\'s colour differs in the screenshot diff. A design ticket that changed the primary colour was merged the same day.',
    correct: 'Intentional change',
    rule: 'Confirm against the ticket, then update the baseline in CI.',
    why: 'The change matches a known, approved cause. The baseline should move, rendered in CI, never on a laptop.',
  },
  {
    id: 'font-late',
    prompt: 'Text sits one pixel lower in a single browser. A rerun passes, and the fonts were still loading when the screenshot was taken.',
    correct: 'Flake',
    rule: 'Make the capture repeatable before touching a baseline.',
    why: 'Force fonts to load instead of awaiting them. A diff that comes and goes on rerun is not a product change.',
  },
  {
    id: 'arrow-missing',
    prompt: 'A dropdown arrow is missing in all four browsers since the last merge. No design ticket mentions it.',
    correct: 'Regression',
    rule: 'Report it; never update the baseline to match.',
    why: 'It is consistent across browsers, tied to a merge, and nobody asked for it. That is a product defect.',
  },
  {
    id: 'tooltip',
    prompt: 'A tooltip appears in the screenshot in about one run in ten and otherwise does not.',
    correct: 'Flake',
    rule: 'Clear transient UI before capture.',
    why: 'Intermittent, state-dependent output is a capture problem. Clear tooltips before the screenshot so every run sees the same thing.',
  },
  {
    id: 'spacing-scale',
    prompt: 'Spacing grew by four pixels across every browser. The ticket for the sprint introduces a new spacing scale.',
    correct: 'Intentional change',
    rule: 'Confirm against the ticket, then update the baseline in CI.',
    why: 'The change is consistent and documented. Eyeball the new baseline before anything ships.',
  },
  {
    id: 'dependency-upgrade',
    prompt: 'A test fails three runs in a row on the same assertion. It passed before a dependency upgrade, and there is a new console error.',
    correct: 'Regression',
    rule: 'Three consistent failures with a new cause is a regression until proven otherwise.',
    why: 'A repeatable failure that starts with a known change, and comes with an error, points at the product or the upgrade, not at timing.',
  },
  {
    id: 'cold-start',
    prompt: 'A test fails only on the first run after a cold start and passes on every rerun.',
    correct: 'Flake',
    rule: 'Look for a timing or warm-up dependency, not a baseline change.',
    why: 'It passes on rerun and depends on start-up state. Fix the wait or the setup, and do not weaken the test.',
  },
];

export const METRIC_CHOICES = [
  'Trend or one-off?',
  'What changed?',
  'Right thing measured?',
  'Smallest fix, biggest effect?',
  'Who owns it, and by when?',
] as const;
export const METRIC_ITEMS: QuizItem[] = [
  {
    id: 'coverage-jump',
    prompt: 'New-code coverage jumped fifteen points in one sprint. The same week, a rule started excluding generated code from the count. Which question do you ask first?',
    series: [72, 73, 72, 74, 73, 88],
    unit: '%',
    correct: 'Right thing measured?',
    rule: 'Check the metric before celebrating it.',
    why: 'A sudden jump that lines up with a change to the counting rules is more likely a measurement change than a better team.',
  },
  {
    id: 'pass-dip',
    prompt: 'End-to-end pass rate dipped three points for one sprint and is back where it was. Which question do you ask first?',
    series: [95, 95, 94, 95, 92, 95],
    unit: '%',
    correct: 'Trend or one-off?',
    rule: 'Watch trends, not snapshots.',
    why: 'One dip that recovers by itself may be noise. Decide whether it is a pattern before spending effort.',
  },
  {
    id: 'reactive-climb',
    prompt: 'The share of reactive work has climbed every sprint for four sprints, starting the month two engineers moved to another team. Which question do you ask first?',
    series: [10, 14, 18, 25],
    unit: '%',
    correct: 'What changed?',
    rule: 'Look at people, process and code.',
    why: 'A steady climb with a clear event behind it points to a change in the team, so start with what changed.',
  },
  {
    id: 'escape-fixes',
    prompt: 'The defect escape rate is creeping up, and the team has listed ten possible improvements. Which question do you ask first?',
    series: [6, 7, 6, 8, 9],
    unit: '%',
    correct: 'Smallest fix, biggest effect?',
    rule: 'Pick the smallest change with the biggest effect.',
    why: 'Ten ideas is a backlog, not a plan. Choose the one fix that moves the metric most for the least effort.',
  },
  {
    id: 'forecast-owner',
    prompt: 'Forecast accuracy has sat below its target for a quarter. Everyone agrees it matters and nothing moves. Which question do you ask first?',
    series: [70, 68, 71, 69, 70],
    unit: '%',
    correct: 'Who owns it, and by when?',
    rule: 'Every metric has a target, a direction and an owner.',
    why: 'Agreement without an owner and a date produces no action. Name the person and the deadline.',
  },
];

export const ROUTER_CHOICES = ['Cheap tier', 'Standard tier', 'Capable tier'] as const;
export const ROUTER_ITEMS: QuizItem[] = [
  {
    id: 'generate-code',
    prompt: 'Generate test code from an approved plan that lists every file to create or modify.',
    correct: 'Cheap tier',
    rule: 'High-volume work from an approved plan goes to the cheap tier.',
    why: 'The plan has already done the thinking, so the work is mostly transcription at scale. Escalate only if it is blocked or fails the same way twice.',
  },
  {
    id: 'boilerplate',
    prompt: 'Write forty near-identical step methods that follow one existing pattern.',
    correct: 'Cheap tier',
    rule: 'Repetitive work from a clear pattern goes to the cheap tier.',
    why: 'A proven pattern removes ambiguity. The tier is bounded, and it never overrides halt rules, gates or the triple-green check.',
  },
  {
    id: 'intake',
    prompt: 'Read a ticket and its linked cases into a structured requirements summary, using a repeatable template.',
    correct: 'Standard tier',
    rule: 'Structured work from a repeatable template goes to the standard tier.',
    why: 'It needs reading comprehension and structure, but not open-ended judgement.',
  },
  {
    id: 'run',
    prompt: 'Run a test three times in a row and collect the results as evidence.',
    correct: 'Standard tier',
    rule: 'Structured, repeatable execution goes to the standard tier.',
    why: 'The procedure is fixed and the output is evidence. Judgement is not the bottleneck here.',
  },
  {
    id: 'plan-explore',
    prompt: 'Explore the live app and design the scenarios and file table for a feature nobody has tested before.',
    correct: 'Capable tier',
    rule: 'Open-ended analysis goes to the most capable tier.',
    why: 'Deciding what matters to test is judgement work, and a weak plan is costly because everything downstream follows it.',
  },
  {
    id: 'review',
    prompt: 'Audit new test code for layering, naming, reuse and security problems.',
    correct: 'Capable tier',
    rule: 'Review and judgement go to the most capable tier.',
    why: 'Catching subtle violations is where a stronger model earns its cost. A stage never grades itself.',
  },
  {
    id: 'heal',
    prompt: 'Diagnose why a test fails and propose a minimal, evidence-backed fix that does not touch assertions.',
    correct: 'Capable tier',
    rule: 'Diagnosis goes to the most capable tier.',
    why: 'Finding the real cause, and resisting the shortcut of weakening the test, takes the most reasoning.',
  },
];
