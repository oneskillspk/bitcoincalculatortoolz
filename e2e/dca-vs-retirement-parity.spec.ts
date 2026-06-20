import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * Cross-page visual parity snapshots for the Bitcoin DCA Calculator vs the
 * Bitcoin Retirement Calculator.
 *
 * These tests capture the shared "zone primitives" (hero badge + H1 + lead,
 * Quick Answer card, section headers, FAQ accordion, comparison tables) on
 * BOTH pages at mobile / tablet / desktop. Baselines live next to the spec in
 * `dca-vs-retirement-parity.spec.ts-snapshots/`.
 *
 * Any pixel drift > 2% on a primitive on either page fails the build, so a
 * styling change on one calculator that the other doesn't get is caught
 * automatically. To intentionally accept changes:
 *
 *   npx playwright test dca-vs-retirement-parity --update-snapshots
 */

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 900 },
  { name: 'tablet',  width: 768,  height: 1100 },
  { name: 'desktop', width: 1280, height: 1000 },
] as const;

const PAGES = [
  { id: 'dca',        path: '/calculators/dca' },
  { id: 'retirement', path: '/calculators/retirement' },
] as const;

const MASKS = (page: Page) => [
  page.locator('[data-testid="live-btc-price"]'),
  page.locator('time'),
  page.locator('text=/\\$[\\d,]+/').first(),
];

async function snap(region: Locator, page: Page, file: string) {
  await region.first().waitFor({ state: 'visible', timeout: 15_000 });
  await region.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await expect(region.first()).toHaveScreenshot(file, {
    animations: 'disabled',
    mask: MASKS(page),
    maxDiffPixelRatio: 0.02,
  });
}

for (const vp of VIEWPORTS) {
  for (const p of PAGES) {
    test.describe(`${p.id} parity · ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(p.path, { waitUntil: 'networkidle' });
      });

      test('hero (badge + H1 + lead + live chip)', async ({ page }) => {
        const hero = page.locator('header, section').filter({ has: page.locator('h1') }).first();
        await snap(hero, page, `${p.id}-hero-${vp.name}.png`);
      });

      test('quick answer block', async ({ page }) => {
        const region = page
          .locator('section[aria-label="Quick Answer"], section[aria-label="Hızlı Cevap"]')
          .first();
        await snap(region, page, `${p.id}-quick-answer-${vp.name}.png`);
      });

      test('faq section', async ({ page }) => {
        const faq = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first();
        if (!(await faq.count())) test.skip();
        await snap(faq, page, `${p.id}-faq-${vp.name}.png`);
      });

      test('comparison table section', async ({ page }) => {
        const table = page.locator('section').filter({ has: page.locator('table') }).first();
        if (!(await table.count())) test.skip();
        await snap(table, page, `${p.id}-table-${vp.name}.png`);
      });
    });
  }
}
