import { test, expect } from '@playwright/test';

/**
 * Visual regression snapshots for the Bitcoin Purchasing Power Calculator
 * dashboard ("What You Can Buy" + Top Items + Category Distribution).
 *
 * Captures the results region at mobile / tablet / desktop widths so layout
 * regressions (wrapping, spacing, two-col vs single-col breakage) fail CI.
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

for (const vp of VIEWPORTS) {
  test(`purchasing-power dashboard layout — ${vp.name} (${vp.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(ROUTE, { waitUntil: 'networkidle' });

    // Wait for the two charts + comparison grid to mount.
    await page.waitForSelector('[data-testid="purchasing-power-chart"], .recharts-surface', {
      timeout: 15_000,
    });
    // Settle animations / chart transitions.
    await page.waitForTimeout(800);

    // Mask volatile bits (live BTC price, timestamps) so snapshots are stable.
    const masks = [
      page.locator('[data-testid="live-btc-price"]'),
      page.locator('time'),
    ];

    await expect(page).toHaveScreenshot(`pp-${vp.name}.png`, {
      fullPage: true,
      mask: masks,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });
}
