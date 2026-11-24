import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';

const studies = readdirSync('src/content/work').filter((f) => f.endsWith('.md')).map((f) => `/work/${f.replace(/\.md$/, '')}`);
const routes = ['/', '/work', '/cv', '/contact', ...studies];

for (const theme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`axe WCAG 2.1 AA: ${route} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
      await page.goto(route);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      // open every stage so expanded content is audited too
      await page.evaluate(() => document.querySelectorAll('details').forEach((d) => d.setAttribute('open', '')));
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    });
  }
}
