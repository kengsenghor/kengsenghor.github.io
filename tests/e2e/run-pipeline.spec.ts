import { test, expect } from '@playwright/test';

const visible = 'ol.build-log li:not([data-pending])';

test('Run pipeline plays the log line by line and ends at the quality gate', async ({ page }) => {
  await page.goto('/');
  const run = page.getByRole('button', { name: 'Run pipeline' });
  await expect(run).toBeVisible();
  const total = await page.locator('ol.build-log li').count();
  expect(total).toBe(6);
  await run.click();
  expect(await page.locator(visible).count()).toBeLessThan(total); // intermediate state
  await expect(page.locator('ol.build-log li[data-gate]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator(visible)).toHaveCount(total);
  await expect(page.getByRole('status').filter({ hasText: 'Pipeline run complete' })).toBeVisible();
});

test('with reduced motion every line is there immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Run pipeline' }).click();
  await expect(page.locator(visible)).toHaveCount(6);
  await expect(page.locator('ol.build-log li[data-gate]')).toBeVisible();
});

test('clicking Run twice never duplicates lines', async ({ page }) => {
  await page.goto('/');
  const run = page.getByRole('button', { name: 'Run pipeline' });
  await run.click();
  await run.click();
  await expect(page.locator('ol.build-log li[data-gate]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('ol.build-log li')).toHaveCount(6);
  await expect(page.locator(visible)).toHaveCount(6);
});

test('Reset restores the static log', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Run pipeline' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator(visible)).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Run pipeline' })).toBeVisible();
});

test('a stage line opens that stage and moves focus to it', async ({ page }) => {
  await page.goto('/');
  await page.locator('a.stage-link[data-stage="engineering-management"]').click();
  const target = page.locator('details.stage[data-stage="engineering-management"]').first();
  await expect(target).toHaveAttribute('open', '');
  await expect(target.locator('summary')).toBeFocused();
});

test('a stage line also works from the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.locator('a.stage-link[data-stage="firmware"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details.stage[data-stage="firmware"]').first()).toHaveAttribute('open', '');
});

test('without JavaScript the log is complete and the buttons are hidden', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator(visible)).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Run pipeline' })).toBeHidden();
  await ctx.close();
});
