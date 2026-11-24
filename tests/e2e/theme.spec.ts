import { test, expect } from '@playwright/test';

test.describe('theme', () => {
  test.use({ colorScheme: 'dark' });
  test('starts dark when the system prefers dark and nothing is stored', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test('toggle flips data-theme and the choice persists after reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: /theme/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('page still renders when storage access throws', async ({ page }) => {
  await page.addInitScript(() => {
    const boom = () => { throw new Error('blocked'); };
    Storage.prototype.getItem = boom;
    Storage.prototype.setItem = boom;
  });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.getByRole('button', { name: /theme/i }).click();
  await expect(page.locator('h1')).toBeVisible();
});

test('nav links are keyboard reachable and show a visible focus ring', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // skip link
  await page.keyboard.press('Tab'); // first nav link
  const outline = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const s = getComputedStyle(el);
    return { tag: el.tagName, style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
  });
  expect(outline.tag).toBe('A');
  expect(outline.style).not.toBe('none');
  expect(outline.width).toBeGreaterThan(0);
  for (const name of ['Home', 'Work', 'Lab', 'CV', 'Contact']) {
    await expect(page.getByRole('navigation').getByRole('link', { name })).toBeVisible();
  }
});

test('no horizontal scroll at 320px wide', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
