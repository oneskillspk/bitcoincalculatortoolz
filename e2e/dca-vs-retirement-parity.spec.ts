import { test, expect, type Page, type Locator } from '@playwright/test';

/**
 * Cross-page visual parity snapshots for the Bitcoin DCA Calculator vs the
 * Bitcoin Retirement Calculator.
 *
 * Captures every shared zone primitive (hero, quick-answer, calculator grid,
 * how-it-works, all editorial sections containing tables, FAQ, methodology,
 * disclaimer) on BOTH pages at mobile / tablet / desktop in BOTH light and
 * dark color schemes. Any pixel drift > 2% fails the build.
 *
 * Update baselines:
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

const SCHEMES = ['light', 'dark'] as const;

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

for (const scheme of SCHEMES) {
  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      test.describe(`${p.id} parity · ${vp.name} · ${scheme}`, () => {
        test.beforeEach(async ({ page }) => {
          await page.emulateMedia({ colorScheme: scheme });
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(p.path, { waitUntil: 'networkidle' });
          // Force dark class on <html> for projects using class-based dark mode.
          if (scheme === 'dark') {
            await page.evaluate(() => document.documentElement.classList.add('dark'));
          } else {
            await page.evaluate(() => document.documentElement.classList.remove('dark'));
          }
          await page.waitForTimeout(150);
        });

        test('hero (badge + H1 + lead + live chip)', async ({ page }) => {
          const hero = page.locator('header, section').filter({ has: page.locator('h1') }).first();
          await snap(hero, page, `${p.id}-${scheme}-hero-${vp.name}.png`);
        });

        test('quick answer block', async ({ page }) => {
          const region = page
            .locator('section[aria-label="Quick Answer"], section[aria-label="Hızlı Cevap"]')
            .first();
          if (!(await region.count())) test.skip();
          await snap(region, page, `${p.id}-${scheme}-quick-answer-${vp.name}.png`);
        });

        test('calculator grid (inputs + results)', async ({ page }) => {
          const region = page.locator('main section').filter({ has: page.locator('form, [role="form"], input') }).first();
          if (!(await region.count())) test.skip();
          await snap(region, page, `${p.id}-${scheme}-calculator-${vp.name}.png`);
        });

        test('how it works / step guide', async ({ page }) => {
          const region = page.locator('section').filter({ hasText: /how it works|nasıl çalışır/i }).first();
          if (!(await region.count())) test.skip();
          await snap(region, page, `${p.id}-${scheme}-howitworks-${vp.name}.png`);
        });

        test('all editorial table sections', async ({ page }) => {
          const sections = page.locator('section').filter({ has: page.locator('table, ul[aria-label]') });
          const count = await sections.count();
          for (let i = 0; i < count; i++) {
            await snap(sections.nth(i), page, `${p.id}-${scheme}-table-${i}-${vp.name}.png`);
          }
        });

        test('faq section', async ({ page }) => {
          const faq = page.locator('section').filter({ hasText: /frequently asked|faq|sıkça sorulan/i }).first();
          if (!(await faq.count())) test.skip();
          await snap(faq, page, `${p.id}-${scheme}-faq-${vp.name}.png`);
        });

        test('methodology + sources block', async ({ page }) => {
          const region = page.locator('section, div').filter({ hasText: /methodology|sources|kaynaklar|nasıl hesaplıyoruz/i }).first();
          if (!(await region.count())) test.skip();
          await snap(region, page, `${p.id}-${scheme}-methodology-${vp.name}.png`);
        });

        test('disclaimer card', async ({ page }) => {
          const region = page.locator('div').filter({ hasText: /^Disclaimer|^Feragatname/ }).first();
          if (!(await region.count())) test.skip();
          await snap(region, page, `${p.id}-${scheme}-disclaimer-${vp.name}.png`);
        });
      });
    }
  }
}
