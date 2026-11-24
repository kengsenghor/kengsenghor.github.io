import { test, expect } from '@playwright/test';

const titles = [
  'Senior Software Engineering Manager',
  'Software Engineering Manager',
  'Software Test Team Leader',
  'Team Lead (Web)',
  'Solution Assurance Lead',
  'Senior Software Engineer, Level 3',
  'Software Engineer (Embedded and Firmware)',
];

test('/cv lists all seven roles in order with dates', async ({ page }) => {
  await page.goto('/cv');
  const headings = page.locator('main article.role h3');
  await expect(headings).toHaveCount(7);
  expect(await headings.allInnerTexts()).toEqual(titles);
  await expect(page.locator('main article.role').first()).toContainText('2025-06');
  await expect(page.locator('main article.role').last()).toContainText('2005');
});

test('/cv shows education and certifications', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.getByText('Universiti Malaysia Sarawak')).toBeVisible();
  await expect(page.getByText('ISTQB Certified Tester Foundation Level (CTFL)')).toBeVisible();
});

test('/cv hides the site header in print and links the download placeholder', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('a[href="/cv-placeholder.txt"]')).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('header.site')).toBeHidden();
});

test('/contact has email and LinkedIn links and no phone number', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('main a[href="mailto:kengseng.hor@outlook.com"]')).toBeVisible();
  await expect(page.locator('main a[href="https://www.linkedin.com/in/horkengseng"]')).toBeVisible();
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/\+?\d{2}[-\s]?\d{2}[-\s]?\d{6,}/);
});
