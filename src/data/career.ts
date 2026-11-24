export type Stage = 'firmware' | 'telecom' | 'qa-leadership' | 'engineering-management';

export type Role = {
  id: string;
  title: string;
  start: string;
  end: string | 'present';
  stage: Stage;
  summary: string;
  bullets: string[];
};

export const profile = {
  name: 'Keng Seng Hor',
  title: 'Senior Software Engineering Manager',
  summary:
    'Software engineering leader with 20+ years in the field, 15+ of them focused on quality engineering. I lead four teams across three cloud-hosted SaaS products and a shared platform, accountable for delivery, hiring, coaching and engineering standards, and hands-on in automation and CI/CD. I architected and govern an agentic AI testing pipeline built on observability and governance, and I use AI daily in how my teams build.',
  email: 'kengseng.hor@outlook.com',
  linkedin: 'https://www.linkedin.com/in/horkengseng',
};

export const roles: Role[] = [
  {
    id: 'sem-senior',
    title: 'Senior Software Engineering Manager',
    start: '2025-06',
    end: 'present',
    stage: 'engineering-management',
    summary:
      'Lead four teams (two managers, eighteen engineers and testers) delivering three cloud-hosted SaaS products and a shared component platform.',
    bullets: [
      'Accountable for delivery, capacity and quality across the teams; own people management end to end, including hiring, coaching and career development. Promoted two people in 16 months.',
      'Moved a resource-constrained shared team from Scrum to Kanban and directed one manager to shorten sprints from four weeks to two.',
      'Architected and govern an agentic AI testing pipeline with governed stages, copilot and autopilot modes, and halt rules, built on observability because AI agents are probabilistic.',
      'Set engineering standards and quality gates: a shared component library with a visual test suite of 1,800+ automated tests run per browser in CI, test-management traceability and a cross-product dashboard.',
      'Built security into delivery: static-analysis reports published in CI and surfaced in code review, with follow-up on stale scans.',
      'Report to leadership in business terms: monthly test metrics and quarterly engineering metrics (North Star, DORA).',
    ],
  },
  {
    id: 'sem',
    title: 'Software Engineering Manager',
    start: '2024-07',
    end: '2025-06',
    stage: 'engineering-management',
    summary:
      'Led engineering and quality engineering for a compliance software product line, directing a 20-person team across four agile Scrum teams.',
    bullets: ['Directed a 20-person organisation across four Scrum teams within the product R&D division.'],
  },
  {
    id: 'test-lead',
    title: 'Software Test Team Leader',
    start: '2019-07',
    end: '2024-07',
    stage: 'qa-leadership',
    summary:
      'Led test leadership for the audit and risk and the compliance business lines in regulated software, supporting ISO 9001:2015 external audit readiness.',
    bullets: [
      'Led up to 10 testers (junior to principal; permanent and contract) across Malaysia, the UK, the US and India, recruiting, coaching and growing them into automation practitioners.',
      'Rolled out a centralized CI/CD framework for API and UI automation (C#, Java, Python) with performance test automation.',
      'Delivered Rapid Software Testing training that lifted risk-based testing maturity.',
      'Stayed hands-on across end-to-end, API and performance frameworks (Selenium C#, API test tooling, JMeter) and CI pipelines.',
    ],
  },
  {
    id: 'team-lead-web',
    title: 'Team Lead (Web)',
    start: '2018-01',
    end: '2019-06',
    stage: 'qa-leadership',
    summary:
      'As unit head, directed four test engineers across web and mobile and built the automation function from zero.',
    bullets: ['Set roadmaps, KPIs and metrics, and moved the unit from manual QA to automation engineering.'],
  },
  {
    id: 'solution-assurance-lead',
    title: 'Solution Assurance Lead',
    start: '2013-09',
    end: '2017-10',
    stage: 'telecom',
    summary:
      'Single point of contact for the APAC solution assurance review cycle, owning performance testing and integration assurance for high-throughput telecom switching software.',
    bullets: ['Delivered reviews within SLA across the region.'],
  },
  {
    id: 'senior-engineer-l3',
    title: 'Senior Software Engineer, Level 3',
    start: '2011-03',
    end: '2013-08',
    stage: 'telecom',
    summary: 'Grew a production engineering team from two to ten engineers in two years.',
    bullets: ['Recognised as Top Performer 2011 and Outstanding Performer 2012.'],
  },
  {
    id: 'embedded-engineer',
    title: 'Software Engineer (Embedded and Firmware)',
    start: '2005',
    end: '2011',
    stage: 'firmware',
    summary: 'Embedded and firmware engineering for Bluetooth headset and car-kit products and for multimedia gateway products.',
    bullets: ['Built firmware for wireless audio devices and DLNA/UPnP multimedia gateways.'],
  },
];

export const education = {
  school: 'Universiti Malaysia Sarawak',
  degree: "Bachelor's Degree (Honours), Computer Science, Software Engineering",
  years: '2002-2005',
};

export const certifications = [
  'ISTQB Certified Tester Foundation Level (CTFL)',
  'ISTQB Certified Tester AI Testing (CT-AI), training completed',
];

export const skills = [
  'Engineering leadership and delivery',
  'Hiring, coaching and performance management',
  'Agile delivery (Scrum, Kanban) and roadmaps',
  'AI engineering and agentic pipelines',
  'Cloud-hosted SaaS (Vue.js, Node.js, Rails, PostgreSQL)',
  'CI/CD and DevOps partnership',
  'Security in delivery (SAST, DAST)',
  'Test automation architecture (Playwright, Selenium)',
  'Engineering metrics (DORA, North Star)',
];
