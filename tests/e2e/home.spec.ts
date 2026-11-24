import { test, expect } from '@playwright/test';

test('h1 contains the profile name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Keng Seng Hor');
});

test('one details element per role, all readable with JS disabled', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('details.stage')).toHaveCount(7);
  const text = await page.locator('details.stage').first().innerText();
  expect(text).toContain('Senior Software Engineering Manager');
  const html = await page.content();
  expect(html).toContain('Moved a resource-constrained shared team from Scrum to Kanban');
  await ctx.close();
});

test('stage summary toggles open from the keyboard', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('details.stage').first();
  await expect(first).not.toHaveAttribute('open', '');
  await first.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
});

test('build-log hero lines are plain text and carry no animation under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const lines = page.locator('.build-log li');
  expect(await lines.count()).toBeGreaterThanOrEqual(5);
  await expect(lines.last()).toContainText(/quality gate/i);
  const anim = await lines.first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('none');
});

test('headshot has meaningful alt text', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('img.headshot');
  await expect(img).toHaveAttribute('alt', /Keng Seng Hor/);
});

test('has LinkedIn and email links and no tel: link', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main a[href="https://www.linkedin.com/in/horkengseng"]').first()).toBeVisible();
  await expect(page.locator('main a[href="mailto:kengseng.hor@outlook.com"]').first()).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
});

test('shows certifications and a work section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ISTQB Certified Tester Foundation Level (CTFL)')).toBeVisible();
  await expect(page.getByRole('heading', { name: /selected work/i })).toBeVisible();
});
