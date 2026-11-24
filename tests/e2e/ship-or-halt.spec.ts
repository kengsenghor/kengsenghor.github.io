import { test, expect, type Page } from '@playwright/test';
import { SCENARIOS } from '../../src/lib/scenarios';

const url = '/lab/ship-or-halt';
const allow = (page: Page) => page.getByRole('button', { name: 'Allow', exact: true });
const halt = (page: Page) => page.getByRole('button', { name: 'Halt', exact: true });

async function currentCorrect(page: Page) {
  const text = await page.locator('#proposal').innerText();
  const s = SCENARIOS.find((x) => text.includes(x.proposal));
  if (!s) throw new Error('unknown scenario: ' + text);
  return s.correct;
}

test('Lab is in the nav and /lab links to the game and the calculator', async ({ page }) => {
  await page.goto('/lab');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Lab' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Ship or halt/ })).toHaveAttribute('href', '/lab/ship-or-halt');
  await expect(page.getByRole('link', { name: /Sprint forecast calculator/ })).toHaveAttribute('href', /forecasting-with-points-per-person-day/);
});

test('shows one scenario at a time with Allow and Halt', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByText('Scenario 1 of 7')).toBeVisible();
  await expect(allow(page)).toBeVisible();
  await expect(halt(page)).toBeVisible();
  await expect(page.locator('#feedback')).toBeHidden();
});

test('answering reveals verdict, rule and why, and focuses Next', async ({ page }) => {
  await page.goto(url);
  const right = await currentCorrect(page);
  await (right === 'halt' ? halt(page) : allow(page)).click();
  const fb = page.locator('#feedback');
  await expect(fb).toBeVisible();
  await expect(fb).toContainText('Correct');
  await expect(fb).toContainText('Rule:');
  await expect(page.getByRole('button', { name: /Next|See score/ })).toBeFocused();
  await expect(allow(page)).toBeDisabled();
});

test('a perfect run scores 7 of 7, even with double-clicks', async ({ page }) => {
  await page.goto(url);
  for (let i = 0; i < 7; i++) {
    const right = await currentCorrect(page);
    await (right === 'halt' ? halt(page) : allow(page)).dblclick();
    await page.getByRole('button', { name: /Next|See score/ }).click();
  }
  await expect(page.locator('#result')).toContainText('7 of 7');
  await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();
});

test('halting everything is not a perfect score', async ({ page }) => {
  await page.goto(url);
  for (let i = 0; i < 7; i++) {
    await halt(page).dblclick();
    await page.getByRole('button', { name: /Next|See score/ }).click();
  }
  await expect(page.locator('#result')).toContainText('5 of 7');
});

test('works from the keyboard alone and Play again resets', async ({ page }) => {
  await page.goto(url);
  for (let i = 0; i < 7; i++) {
    const right = await currentCorrect(page);
    await (right === 'halt' ? halt(page) : allow(page)).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Next|See score/ })).toBeFocused();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('#result')).toContainText('7 of 7');
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.getByText('Scenario 1 of 7')).toBeVisible();
  await expect(page.locator('#result')).toBeHidden();
});

test('without JavaScript every scenario and its answer is a readable list', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url);
  await expect(page.locator('#static-list > li')).toHaveCount(7);
  await expect(page.locator('#static-list')).toContainText('Never edit an assertion');
  await expect(page.locator('#game')).toBeHidden();
  await ctx.close();
});
