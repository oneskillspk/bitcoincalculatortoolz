import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression for the retirement Results panel and the 60/40
 * comparison table, in EN and TR.
 *
 * Update baselines with:
 *   npx playwright test retirement-results-visual --update-snapshots
 */

const ROUTES = [
  { locale: 'en', path: '/calculators/retirement' },
  { locale: 'tr', path: '/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi' },
] as const;

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 1100 },
  { name: 'desktop', width: 1440, height: 1100 },
] as const;

async function snap(page: Page, selector: string, file: string) {
  const region = page.locator(selector).first();
  await region.waitFor({ state: 'visible', timeout: 15_000 });
  await region.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(region).toHaveScreenshot(file, {
    animations: 'disabled',
    mask: [page.locator('[data-testid="live-btc-price"]'), page.locator('time')],
    maxDiffPixelRatio: 0.02,
  });
}

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test.describe(`retirement results · ${route.locale} · ${vp.name}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path, { waitUntil: 'networkidle' });
      });

      test('results panel renders without layout shift', async ({ page }) => {
        await snap(
          page,
          'section[aria-labelledby*="result"], [data-testid="results-dashboard"], .calc-surface-card',
          `retirement-results-${route.locale}-${vp.name}.png`,
        );
      });

      test('60/40 comparison table', async ({ page }) => {
        await snap(
          page,
          'section[aria-labelledby="retirement-vs-trad-heading"]',
          `retirement-6040-${route.locale}-${vp.name}.png`,
        );
      });
    });
  }
}
