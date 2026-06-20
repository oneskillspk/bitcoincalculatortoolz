import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression for the DCA results panel AFTER the user clicks
 * "Calculate DCA Returns". Guards against stat-card label/value clipping
 * (e.g. "BITCOIN ACQUIRE" / "PURCHAS"), Advanced Insights bar tone drift,
 * and any future grid-breakpoint regressions.
 *
 * Baselines live in `dca-results-visual.spec.ts-snapshots/`.
 *
 * Update baselines:
 *   npx playwright test dca-results-visual --update-snapshots
 */

const VIEWPORTS = [
  { name: 'mobile',  width: 375,  height: 900 },
  { name: 'desktop', width: 1280, height: 1100 },
] as const;

const MASKS = (page: Page) => [
  page.locator('[data-testid="live-btc-price"]'),
  page.locator('time'),
];

async function calculate(page: Page) {
  await page.goto('/calculators/dca', { waitUntil: 'networkidle' });
  const btn = page.getByRole('button', { name: /Calculate DCA Returns/i });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  // Results panel renders into ResultPanel with title "DCA Results".
  await page.getByRole('heading', { name: /DCA Results/i }).waitFor({ timeout: 15_000 });
  // Let counter animation settle.
  await page.waitForTimeout(1200);
}

for (const vp of VIEWPORTS) {
  test.describe(`DCA results · ${vp.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await calculate(page);
    });

    test('primary stat-card grid (no label or value clipping)', async ({ page }) => {
      const panel = page.locator('section, div').filter({ has: page.getByRole('heading', { name: /DCA Results/i }) }).first();
      await expect(panel).toHaveScreenshot(`dca-results-grid-${vp.name}.png`, {
        animations: 'disabled',
        mask: MASKS(page),
        maxDiffPixelRatio: 0.02,
      });
    });

    test('advanced insights (per-metric tone bars)', async ({ page }) => {
      const panel = page.locator('section, div').filter({ has: page.getByRole('heading', { name: /Advanced Insights/i }) }).first();
      await expect(panel).toHaveScreenshot(`dca-results-insights-${vp.name}.png`, {
        animations: 'disabled',
        mask: MASKS(page),
        maxDiffPixelRatio: 0.02,
      });
    });
  });
}
