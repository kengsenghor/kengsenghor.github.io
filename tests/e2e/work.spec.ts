import { test, expect } from '@playwright/test';

const slugs = ['agentic-testing-pipeline', 'visual-ui-test-suite', 'scrum-to-kanban', 'manual-to-automation', 'rescuing-legacy-selenium-suite', 'playwright-typescript-standard'];

for (const slug of slugs) {
  test(`case study ${slug} has one h1 and the Problem and What I did headings`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /what i did/i })).toBeVisible();
  });
}

test('/work lists six case-study links', async ({ page }) => {
  await page.goto('/work');
  const links = page.locator('main a[href^="/work/"]');
  await expect(links).toHaveCount(6);
});

test('home page shows the six case studies in Selected work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.grid article')).toHaveCount(6);
});
