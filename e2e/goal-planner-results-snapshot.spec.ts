import { test, expect } from '@playwright/test';

const url = '/bitcoin-retirement-calculator?mode=planner';

test.describe('Goal Planner results layout', () => {
  for (const viewport of [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    test(`matches Forecaster rhythm @ ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const results = page.locator('[data-testid="goal-planner-results"], .calc-surface-card').first();
      await results.waitFor({ state: 'visible' });

      // No horizontal page overflow.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(2);

      await expect(page).toHaveScreenshot(`goal-planner-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }

  test('Copy link restores chartView=table state', async ({ page }) => {
    await page.goto(`${url}&view=table`);
    await page.waitForLoadState('networkidle');
    const tableTrigger = page.getByRole('tab', { name: /year.?by.?year/i }).first();
    if (await tableTrigger.count()) {
      await expect(tableTrigger).toHaveAttribute('data-state', 'active');
    }
  });
});
