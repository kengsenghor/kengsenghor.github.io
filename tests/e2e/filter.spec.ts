import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

const total = readdirSync('src/content/work').filter((f) => f.endsWith('.md')).length;

test.describe('work filter', () => {
  test('chips and search appear with JS and filter the cards', async ({ page }) => {
    await page.goto('/work');
    const search = page.getByLabel('Search case studies');
    await expect(search).toBeVisible();
    const cards = page.locator('main article.card:not([hidden])');
    await expect(cards).toHaveCount(total);

    await search.fill('forecast');
    await expect(cards).toHaveCount(1);
    await expect(page.getByRole('status')).toContainText('1 of ' + total);

    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(cards).toHaveCount(total);
  });

  test('tag chip toggles aria-pressed and filters', async ({ page }) => {
    await page.goto('/work');
    const chip = page.getByRole('button', { name: 'Metrics', exact: true });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    const n = await page.locator('main article.card:not([hidden])').count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(total);
    await chip.click();
    await expect(page.locator('main article.card:not([hidden])')).toHaveCount(total);
  });

  test('no match shows an empty state', async ({ page }) => {
    await page.goto('/work');
    await page.getByLabel('Search case studies').fill('zzzz-no-such-thing');
    await expect(page.locator('main article.card:not([hidden])')).toHaveCount(0);
    await expect(page.getByText('No case studies match')).toBeVisible();
    await expect(page.getByRole('status')).toContainText('0 of ' + total);
  });

  test('the URL hash records the filter and restores it on reload', async ({ page }) => {
    await page.goto('/work');
    await page.getByRole('button', { name: 'Metrics', exact: true }).click();
    await expect(page).toHaveURL(/#.*tag=Metrics/);
    await page.reload();
    await expect(page.getByRole('button', { name: 'Metrics', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });

  test('an unknown tag in the hash shows the empty state without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/work#tag=Nope%20Nope&q=%E0%A4%A');
    await expect(page.getByText('No case studies match')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.locator('main article.card:not([hidden])')).toHaveCount(total);
    expect(errors).toEqual([]);
  });

  test('without JavaScript every card shows and the controls are hidden', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/work');
    await expect(page.locator('main article.card')).toHaveCount(total);
    await expect(page.getByLabel('Search case studies')).toBeHidden();
    await ctx.close();
  });
});

test.describe('home stages', () => {
  test('Expand all and Collapse all', async ({ page }) => {
    await page.goto('/');
    const details = page.locator('details.stage');
    await page.getByRole('button', { name: 'Expand all' }).click();
    expect(await details.evaluateAll((els) => els.every((d) => (d as HTMLDetailsElement).open))).toBe(true);
    await page.getByRole('button', { name: 'Collapse all' }).click();
    expect(await details.evaluateAll((els) => els.every((d) => !(d as HTMLDetailsElement).open))).toBe(true);
  });
  test('the stage buttons are hidden without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Expand all' })).toBeHidden();
    await ctx.close();
  });
});
