import { test, expect, type Page } from '@playwright/test';

/**
 * Visual regression suite for the three retirement result modes
 * (Forecaster, Goal Planner, FIRE) at mobile + desktop.
 *
 * Update baselines with:
 *   npx playwright test retirement-modes-visual --update-snapshots
 */

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 1300 },
  { name: 'desktop', width: 1440, height: 1100 },
] as const;

const MODES = [
  { name: 'forecaster', tabIndex: 0 },
  { name: 'planner', tabIndex: 1 },
  { name: 'fire', tabIndex: 2 },
] as const;

async function setupMode(page: Page, tabIndex: number) {
  await page.goto('/calculators/retirement', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const modeButtons = page.locator('main button').filter({ hasText: /Forecaster|Goal Planner|FIRE/i });
  const target = modeButtons.nth(tabIndex);
  if (await target.count()) await target.click().catch(() => {});
  const calcBtn = page.getByRole('button', { name: /Calculate/i }).first();
  await calcBtn.click().catch(() => {});
  await page.waitForTimeout(900);
}

for (const vp of VIEWPORTS) {
  for (const mode of MODES) {
    test(`visual · ${mode.name} · ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await setupMode(page, mode.tabIndex);

      const region = page
        .locator('main section[aria-labelledby*="result"], .calc-surface-card, [data-testid="results-dashboard"]')
        .first();
      await region.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
      await region.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(300);

      await expect(region).toHaveScreenshot(`retirement-${mode.name}-${vp.name}.png`, {
        animations: 'disabled',
        mask: [page.locator('[data-testid="live-btc-price"]'), page.locator('time')],
        maxDiffPixelRatio: 0.03,
      });
    });
  }
}
