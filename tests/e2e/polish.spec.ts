import { test, expect } from '@playwright/test';

test('has a favicon link', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(href).toBeTruthy();
  const res = await page.request.get(href!);
  expect(res.status()).toBe(200);
});

test('404 page renders helpfully (served directly as a file)', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Not found');
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible();
});

test('theme toggle exposes its state', async ({ page }) => {
  await page.goto('/');
  const t = page.locator('#theme-toggle');
  const before = await t.getAttribute('aria-pressed');
  expect(['true', 'false']).toContain(before);
  await t.click();
  expect(await t.getAttribute('aria-pressed')).not.toBe(before);
});
