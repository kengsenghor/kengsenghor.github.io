import { test, expect, type Page } from '@playwright/test';
import { LABS } from '../../src/lib/labs';
import { LAYER_ITEMS, TRIAGE_ITEMS, METRIC_ITEMS, ROUTER_ITEMS, LAYER_CHOICES, TRIAGE_CHOICES, METRIC_CHOICES, ROUTER_CHOICES } from '../../src/lib/quizzes';
import { QUESTIONS } from '../../src/lib/process-choice';
import type { QuizItem } from '../../src/lib/quiz';

test('/lab lists every lab with a link', async ({ page }) => {
  await page.goto('/lab');
  for (const l of LABS) await expect(page.getByRole('link', { name: l.title, exact: true })).toHaveAttribute('href', l.href);
  await expect(page.locator('main article.card')).toHaveCount(LABS.length);
});

const quizzes = [
  { slug: 'which-layer', items: LAYER_ITEMS, choices: [...LAYER_CHOICES] },
  { slug: 'regression-change-or-flake', items: TRIAGE_ITEMS, choices: [...TRIAGE_CHOICES] },
  { slug: 'metric-detective', items: METRIC_ITEMS, choices: [...METRIC_CHOICES] },
  { slug: 'model-tier-router', items: ROUTER_ITEMS, choices: [...ROUTER_CHOICES] },
];

async function current(page: Page, items: QuizItem[]) {
  const text = await page.locator('#prompt').innerText();
  const it = items.find((i) => text.includes(i.prompt));
  if (!it) throw new Error('unknown prompt: ' + text);
  return it;
}
const choice = (page: Page, name: string) => page.locator('#choices').getByRole('button', { name, exact: true });
const nextBtn = (page: Page) => page.getByRole('button', { name: /Next|See score/ });

for (const q of quizzes) {
  test.describe(`quiz: ${q.slug}`, () => {
    const n = q.items.length;
    const url = `/lab/${q.slug}`;

    test('shows one item at a time with every choice as a button', async ({ page }) => {
      await page.goto(url);
      await expect(page.getByText(`Question 1 of ${n}`)).toBeVisible();
      for (const c of q.choices) await expect(choice(page, c)).toBeVisible();
      await expect(page.locator('#feedback')).toBeHidden();
    });

    test('answering reveals the verdict, rule and why, and focuses Next', async ({ page }) => {
      await page.goto(url);
      const it = await current(page, q.items);
      await choice(page, it.correct).click();
      await expect(page.locator('#feedback')).toContainText('Correct');
      await expect(page.locator('#feedback')).toContainText('Rule:');
      await expect(nextBtn(page)).toBeFocused();
      await expect(choice(page, it.correct)).toBeDisabled();
    });

    test(`a perfect run scores ${n} of ${n}, even with double-clicks`, async ({ page }) => {
      await page.goto(url);
      for (let i = 0; i < n; i++) {
        const it = await current(page, q.items);
        await choice(page, it.correct).dblclick();
        await nextBtn(page).click();
      }
      await expect(page.locator('#result')).toContainText(`${n} of ${n}`);
    });

    test('giving the same answer every time is not a perfect score', async ({ page }) => {
      await page.goto(url);
      for (let i = 0; i < n; i++) {
        await choice(page, q.choices[0]).dblclick();
        await nextBtn(page).click();
      }
      const text = await page.locator('#result').innerText();
      expect(text).not.toContain(`${n} of ${n}`);
    });

    test('works from the keyboard and Play again resets', async ({ page }) => {
      await page.goto(url);
      for (let i = 0; i < n; i++) {
        const it = await current(page, q.items);
        await choice(page, it.correct).focus();
        await page.keyboard.press('Enter');
        await expect(nextBtn(page)).toBeFocused();
        await page.keyboard.press('Enter');
      }
      await expect(page.locator('#result')).toContainText(`${n} of ${n}`);
      await page.getByRole('button', { name: 'Play again' }).click();
      await expect(page.getByText(`Question 1 of ${n}`)).toBeVisible();
      await expect(page.locator('#result')).toBeHidden();
    });

    test('without JavaScript every item and its answer is a readable list', async ({ browser }) => {
      const ctx = await browser.newContext({ javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto(url);
      await expect(page.locator('#static-list > li')).toHaveCount(n);
      await expect(page.locator('#quiz')).toBeHidden();
      await ctx.close();
    });
  });
}

test('metric detective draws a described trend for each scenario', async ({ page }) => {
  await page.goto('/lab/metric-detective');
  const svg = page.locator('#prompt-area svg[role="img"]');
  await expect(svg).toBeVisible();
  await expect(svg).toHaveAttribute('aria-label', /Rising|Falling|Flat/);
});

test.describe('scrum or kanban', () => {
  const url = '/lab/scrum-or-kanban';
  async function answerAll(page: Page, lean: 'scrum' | 'kanban') {
    for (const q of QUESTIONS) {
      const o = q.options.find((x) => x.leans === lean)!;
      await page.getByRole('group', { name: q.text }).getByLabel(o.label, { exact: true }).check();
    }
  }
  test('asks five questions and prompts until they are answered', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('fieldset')).toHaveCount(5);
    await expect(page.locator('#recommendation')).toContainText('Answer the questions');
  });
  test('recommends Scrum, Kanban or either, with reasons and the trade-off', async ({ page }) => {
    await page.goto(url);
    await answerAll(page, 'scrum');
    await expect(page.locator('#recommendation')).toContainText('Scrum');
    await expect(page.locator('#recommendation')).toContainText('The trade-off');
    await answerAll(page, 'kanban');
    await expect(page.locator('#recommendation')).toContainText('Kanban');
    await expect(page.locator('#recommendation')).toHaveAttribute('role', 'status');
  });
  test('without JavaScript the page still explains the choice', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(url);
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
    await ctx.close();
  });
});

test.describe('evidence gate', () => {
  const url = '/lab/evidence-gate';
  const setup = async (page: Page, status: string, evidence: string, attempts: string, safety = false) => {
    await page.goto(url);
    await page.getByLabel('Stage status').selectOption(status);
    await page.getByLabel('Evidence, one item per line').fill(evidence);
    await page.getByLabel('Retries so far').fill(attempts);
    if (safety) await page.getByLabel('A safety rule was violated').check();
  };
  test('a PASS with evidence advances', async ({ page }) => {
    await setup(page, 'PASS', 'pages/checkout.page.ts\nselector: #pay', '0');
    await expect(page.locator('#gate-result')).toContainText('Advances');
  });
  test('a PASS with no evidence is refused: a claim, not a result', async ({ page }) => {
    await setup(page, 'PASS', '', '0');
    await expect(page.locator('#gate-result')).toContainText('Refused');
    await expect(page.locator('#gate-result')).toContainText('claim');
  });
  test('a FAIL retries twice, then goes to a person', async ({ page }) => {
    await setup(page, 'FAIL', '', '1');
    await expect(page.locator('#gate-result')).toContainText('Retry');
    await page.getByLabel('Retries so far').fill('2');
    await expect(page.locator('#gate-result')).toContainText('sent to a person');
  });
  test('a safety violation halts before the gate', async ({ page }) => {
    await setup(page, 'PASS', 'pages/checkout.page.ts', '0', true);
    await expect(page.locator('#gate-result')).toContainText('Halted');
    await expect(page.locator('#gate-result')).toHaveAttribute('role', 'status');
  });
});

test.describe('pyramid balancer', () => {
  const url = '/lab/pyramid-balancer';
  const slide = (page: Page, label: string, value: number) =>
    page.getByLabel(label).evaluate((el, v) => { (el as HTMLInputElement).value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
  test('the starting split is a pyramid', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('#pyramid-result')).toContainText('pyramid');
    await expect(page.locator('#pyramid-result')).toContainText('69.6');
  });
  test('an end-to-end heavy mix becomes an ice-cream cone with a longer run', async ({ page }) => {
    await page.goto(url);
    await slide(page, 'Unit tests', 10);
    await slide(page, 'API tests', 10);
    await slide(page, 'End-to-end tests', 80);
    await expect(page.locator('#pyramid-result')).toContainText('ice-cream cone');
    await expect(page.locator('#pyramid-result')).not.toContainText('69.6');
  });
  test('says that the numbers are an illustrative model, not measured data', async ({ page }) => {
    await page.goto(url);
    await expect(page.getByText(/illustrative model/i)).toBeVisible();
  });
});

test.describe('capacity planner', () => {
  const url = '/lab/capacity-planner';
  test('turns leave and holidays into person-days and links to the forecast', async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('#capacity-result')).toContainText('30 person-days');
    await page.getByLabel('Shared holidays (days)').fill('1');
    await expect(page.locator('#capacity-result')).toContainText('27 person-days');
    await page.getByLabel('Person 3 leave (days)').fill('5');
    await expect(page.locator('#capacity-result')).toContainText('22 person-days');
    await page.getByRole('button', { name: 'Add person' }).click();
    await expect(page.locator('#capacity-result')).toContainText('31 person-days');
    await expect(page.getByRole('link', { name: /forecast calculator/i })).toHaveAttribute('href', /days=31/);
  });
  test('blank or odd input never shows NaN', async ({ page }) => {
    await page.goto(url);
    await page.getByLabel('Sprint length (days)').fill('abc');
    const t = await page.locator('#capacity-result').innerText();
    expect(t).not.toMatch(/NaN|Infinity/);
  });
  test('the forecast calculator is prefilled from the link', async ({ page }) => {
    await page.goto('/work/forecasting-with-points-per-person-day?days=31#forecast-calc');
    await expect(page.getByLabel('Upcoming person-days')).toHaveValue('31');
  });
});
