import { test, expect } from '@playwright/test';

const url = '/work/forecasting-with-points-per-person-day';

test('calculator shows baseline, capacity and stretch', async ({ page }) => {
  await page.goto(url);
  const calc = page.getByRole('group', { name: 'Sprint forecast calculator' });
  await expect(calc).toBeVisible();
  await page.getByLabel('Sprint 1 points').fill('64');
  await page.getByLabel('Sprint 1 person-days').fill('80');
  await page.getByLabel('Sprint 2 points').fill('32');
  await page.getByLabel('Sprint 2 person-days').fill('40');
  await page.getByLabel('Upcoming person-days').fill('40');
  await page.getByLabel('Planned points').fill('45');
  const out = page.locator('#forecast-result');
  await expect(out).toContainText('Baseline: 0.8 points per person-day');
  await expect(out).toContainText('Capacity: 32 points');
  await expect(out).toContainText('a stretch of 13 points');
  await expect(out).toHaveAttribute('role', 'status');
});

test('says within capacity when the plan fits', async ({ page }) => {
  await page.goto(url);
  await page.getByLabel('Sprint 1 points').fill('40');
  await page.getByLabel('Sprint 1 person-days').fill('40');
  await page.getByLabel('Upcoming person-days').fill('40');
  await page.getByLabel('Planned points').fill('30');
  await expect(page.locator('#forecast-result')).toContainText('within capacity');
});

test('blank, negative or odd input never shows NaN or Infinity', async ({ page }) => {
  await page.goto(url);
  const out = page.locator('#forecast-result');
  await expect(out).toContainText('Enter points and person-days');
  await page.getByLabel('Sprint 1 points').fill('10');
  await page.getByLabel('Sprint 1 person-days').fill('0');
  await page.getByLabel('Upcoming person-days').fill('-5');
  await page.getByLabel('Planned points').fill('abc');
  const text = await out.innerText();
  expect(text).not.toMatch(/NaN|Infinity/);
  await expect(out).toContainText('Enter points and person-days');
});

test('every input has an associated label', async ({ page }) => {
  await page.goto(url);
  const unlabeled = await page.locator('#forecast-calc input').evaluateAll((els) =>
    els.filter((el) => !(el as HTMLInputElement).labels?.length).length);
  expect(unlabeled).toBe(0);
});

test('without JavaScript the study is still readable and the calculator is hidden', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url);
  await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Sprint forecast calculator' })).toBeHidden();
  await ctx.close();
});

test('other studies have no calculator', async ({ page }) => {
  await page.goto('/work/scrum-to-kanban');
  await expect(page.locator('#forecast-calc')).toHaveCount(0);
});
