import { describe, it, expect } from 'vitest';
import { roles, education, certifications, profile } from '../../src/data/career';

describe('career data', () => {
  it('has seven roles, newest first, with the expected titles and dates', () => {
    expect(roles.map((r) => [r.title, r.start, r.end])).toEqual([
      ['Senior Software Engineering Manager', '2025-06', 'present'],
      ['Software Engineering Manager', '2024-07', '2025-06'],
      ['Software Test Team Leader', '2019-07', '2024-07'],
      ['Team Lead (Web)', '2018-01', '2019-06'],
      ['Solution Assurance Lead', '2013-09', '2017-10'],
      ['Senior Software Engineer, Level 3', '2011-03', '2013-08'],
      ['Software Engineer (Embedded and Firmware)', '2005', '2011'],
    ]);
  });
  it('gives every role a stage, a non-empty summary and at least one bullet', () => {
    for (const r of roles) {
      expect(r.summary.length).toBeGreaterThan(20);
      expect(r.bullets.length).toBeGreaterThan(0);
      expect(['firmware', 'telecom', 'qa-leadership', 'engineering-management']).toContain(r.stage);
    }
  });
  it('uses the public contact details only', () => {
    expect(profile.name).toBe('Keng Seng Hor');
    expect(profile.email).toBe('kengseng.hor@outlook.com');
    expect(profile.linkedin).toBe('https://www.linkedin.com/in/horkengseng');
  });
  it('contains no phone-number-shaped digits', () => {
    const all = JSON.stringify({ roles, education, certifications, profile });
    expect(all).not.toMatch(/\+?\d{2}[-\s]?\d{2}[-\s]?\d{6,}/);
    expect(all).not.toMatch(/\d{3}[-\s]\d{3,4}[-\s]\d{4}/);
  });
  it('lists the education and certifications from the resume', () => {
    expect(education.school).toBe('Universiti Malaysia Sarawak');
    expect(certifications).toEqual([
      'ISTQB Certified Tester Foundation Level (CTFL)',
      'ISTQB Certified Tester AI Testing (CT-AI), training completed',
    ]);
  });
});

describe('resume fidelity', () => {
  it('states the two role moves as larger responsibility, not promotions', () => {
    const all = roles.flatMap((r) => r.bullets).join(' ');
    expect(all).toContain('Took on two roles with larger responsibility in 11 months, moving from Software Test Team Leader to Software Engineering Manager, then Senior Software Engineering Manager.');
    expect(all).not.toContain('Promoted');
    const people = roles[0].bullets.find((b) => b.includes('people management'))!;
    expect(people).not.toContain('larger responsibility');
  });
});
