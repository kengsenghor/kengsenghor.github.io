export type Lab = { slug: string; title: string; blurb: string; href: string; page: boolean };

export const LABS: Lab[] = [
  { slug: 'ship-or-halt', title: 'Ship or halt', blurb: 'An AI agent proposes a fix to a failing test. Allow it, or halt? Two of the seven are legitimate fixes.', href: '/lab/ship-or-halt', page: true },
  { slug: 'which-layer', title: 'Which layer?', blurb: 'Sort code snippets into test, helper, page object or control layer.', href: '/lab/which-layer', page: true },
  { slug: 'regression-change-or-flake', title: 'Regression, change or flake?', blurb: 'Triage failing visual diffs and test histories before anyone touches a baseline.', href: '/lab/regression-change-or-flake', page: true },
  { slug: 'scrum-or-kanban', title: 'Scrum or Kanban?', blurb: 'Five questions about a team lead to a recommendation, with the trade-off spelled out.', href: '/lab/scrum-or-kanban', page: true },
  { slug: 'evidence-gate', title: 'Evidence gate', blurb: 'Build a stage handoff and see whether the gate advances it, retries it or sends it to a person.', href: '/lab/evidence-gate', page: true },
  { slug: 'pyramid-balancer', title: 'Test pyramid balancer', blurb: 'Slide the mix of unit, API and end-to-end tests and watch run time and upkeep change.', href: '/lab/pyramid-balancer', page: true },
  { slug: 'metric-detective', title: 'Metric detective', blurb: 'Read a trend and choose the right first question to ask when a metric moves.', href: '/lab/metric-detective', page: true },
  { slug: 'model-tier-router', title: 'Model tier router', blurb: 'Route pipeline tasks to the cheap, standard or capable tier, and learn when to escalate.', href: '/lab/model-tier-router', page: true },
  { slug: 'capacity-planner', title: 'Capacity planner', blurb: 'Turn leave and holidays into real person-days, then send them to the forecast calculator.', href: '/lab/capacity-planner', page: true },
  { slug: 'sprint-forecast-calculator', title: 'Sprint forecast calculator', blurb: 'Enter recent sprints and the coming one to see velocity per person-day, capacity and any stretch.', href: '/work/forecasting-with-points-per-person-day#forecast-calc', page: false },
];
