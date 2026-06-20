import { test, expect } from '@playwright/test';

/**
 * Full-page visual regression for the Bitcoin Retirement calculator page.
 *
 * Mirrors e2e/dca-page-visual.spec.ts. Guards the Explain → Prove →
 * Answer → Cite section order plus per-section spacing at both
 * mobile (iPhone 13 via project) and desktop widths.
 *
 * Update baselines with:
 *   npx playwright test retirement-page-visual --update-snapshots
 */
test.describe('Retirement page — full layout visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators/retirement');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
        }
        [data-testid="live-bitcoin-price"],
        [data-live-price] { visibility: hidden !important; }
      `,
    });
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(400);
  });

  test('full page snapshot @ current project viewport', async ({ page }, testInfo) => {
    const name = `retirement-page-${testInfo.project.name}.png`;
    await expect(page).toHaveScreenshot(name, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('section order: Hero → Calculator → Overview → … (Explain before Prove)', async ({ page }) => {
    const labels = await page
      .locator('main section[aria-labelledby], main section[aria-label]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('aria-labelledby') || n.getAttribute('aria-label') || ''),
      );
    const idxHero = labels.indexOf('retirement-hero-heading');
    const idxCalc = labels.indexOf('retirement-calculator-heading');
    const idxOverview = labels.indexOf('retirement-overview-heading');
    expect(idxHero).toBeGreaterThanOrEqual(0);
    expect(idxCalc).toBeGreaterThan(idxHero);
    expect(idxOverview).toBeGreaterThan(idxCalc);
  });
});
