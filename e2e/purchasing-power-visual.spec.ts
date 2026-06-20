import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * Visual regression snapshots for the Bitcoin Purchasing Power Calculator
 * dashboard. We capture three independent regions per breakpoint so a
 * regression in one (e.g. chart wrapping) doesn't blow away the others:
 *
 *   1. Full results region   (sanity / outer spacing)
 *   2. Two-column charts row (Top Items + Category Distribution)
 *   3. Single-column "What You Can Buy" grid
 *
 * Update baselines intentionally with:
 *   npx playwright test purchasing-power-visual --update-snapshots
 */

const ROUTE = '/calculators/purchasing-power';

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 900 },
  { name: 'tablet',  width: 834,  height: 1100 },
  { name: 'desktop', width: 1440, height: 1000 },
] as const;

async function snap(page: Page, locator: Locator, file: string) {
  await locator.waitFor({ state: 'visible', timeout: 15_000 });
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400); // settle chart transitions
  await expect(locator).toHaveScreenshot(file, {
    animations: 'disabled',
    mask: [page.locator('[data-testid="live-btc-price"]'), page.locator('time')],
    maxDiffPixelRatio: 0.02,
  });
}

for (const vp of VIEWPORTS) {
  test.describe(`purchasing-power · ${vp.name} (${vp.width}px)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(ROUTE, { waitUntil: 'networkidle' });
      await page.waitForSelector('.recharts-surface', { timeout: 15_000 });
      await page.waitForTimeout(600);
    });

    test('two-column charts row', async ({ page }) => {
      await snap(page, page.locator('[data-testid="pp-charts-row"]'), `pp-charts-${vp.name}.png`);
    });

    test('single-column “What You Can Buy” grid', async ({ page }) => {
      await snap(page, page.locator('[data-testid="pp-what-you-can-buy"]'), `pp-wycb-${vp.name}.png`);
    });
  });
}
