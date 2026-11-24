import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

const slugs = readdirSync('src/content/work').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));

for (const slug of slugs) {
  test(`case study ${slug} has one h1 and the Problem and What I did headings`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /what i did/i })).toBeVisible();
  });
}

test('/work lists every case-study link', async ({ page }) => {
  await page.goto('/work');
  const links = page.locator('main a[href^="/work/"]');
  await expect(links).toHaveCount(slugs.length);
});

test('home page shows every case study in Selected work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.grid article')).toHaveCount(slugs.length);
});
