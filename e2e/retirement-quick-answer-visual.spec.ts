import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression for the Bitcoin Retirement Calculator "Quick Answer"
 * (TR: "Hızlı Cevap") block in EN and TR locales.
 *
 * Guards against future localization regressions (e.g. English mode names
 * leaking into TR copy) and layout shifts in the answer-chunk callout that
 * sits above the input panel.
 *
 * Update baselines intentionally with:
 *   npx playwright test retirement-quick-answer-visual --update-snapshots
 */

const ROUTES = [
  { locale: 'en', path: '/calculators/retirement' },
  { locale: 'tr', path: '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' },
] as const;

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 900 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const;

async function snapQuickAnswer(page: Page, file: string) {
  const region = page.locator('section[aria-label="Quick Answer"], section[aria-label="Hızlı Cevap"]').first();
  await region.waitFor({ state: 'visible', timeout: 15_000 });
  await region.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(region).toHaveScreenshot(file, {
    animations: 'disabled',
    mask: [page.locator('[data-testid="live-btc-price"]'), page.locator('time')],
    maxDiffPixelRatio: 0.02,
  });
}

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test.describe(`retirement quick-answer · ${route.locale} · ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path, { waitUntil: 'networkidle' });
      });

      test('quick answer block', async ({ page }) => {
        await snapQuickAnswer(page, `retirement-quick-answer-${route.locale}-${vp.name}.png`);
      });

      test('no English mode names leak into TR copy', async ({ page }) => {
        if (route.locale !== 'tr') test.skip();
        const region = page.locator('section[aria-label="Hızlı Cevap"]').first();
        const text = (await region.textContent()) ?? '';
        // Forbid English mode names in the TR quick answer
        expect(text).not.toMatch(/\bForecaster\b/);
        expect(text).not.toMatch(/\bGoal Planner\b/);
        expect(text).not.toMatch(/\bFIRE modes?\b/);
      });
    });
  }
}
