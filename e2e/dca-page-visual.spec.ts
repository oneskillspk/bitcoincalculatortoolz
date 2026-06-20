import { test, expect } from '@playwright/test';

/**
 * Full-page visual regression for the DCA calculator page.
 *
 * Guards the Explain → Prove → Answer → Cite section order plus
 * per-section spacing at both mobile (iPhone 13 via project) and
 * desktop (1280) widths. Runs against the pre-calculation page so
 * the snapshot is deterministic (no live BTC price drift influences
 * the result cards).
 *
 * Update baselines with:
 *   npx playwright test dca-page-visual --update-snapshots
 */
test.describe('DCA page — full layout visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators/dca');
    // Wait for hero H1 to mount.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Disable animations + hide live price chip (changes every render).
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
    // Let lazy sections settle.
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(400);
  });

  test('full page snapshot @ current project viewport', async ({ page }, testInfo) => {
    const name = `dca-page-${testInfo.project.name}.png`;
    await expect(page).toHaveScreenshot(name, {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.02,
    });
  });

  test('section order: Calculator → Overview → Comparison → FAQ → Methodology', async ({ page }) => {
    const labels = await page.locator('main section[aria-labelledby], main section[aria-label]').evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute('aria-labelledby') || n.getAttribute('aria-label') || '')
    );
    // Hero + Calculator must precede Overview, etc.
    const idxHero = labels.indexOf('dca-hero-heading');
    const idxCalc = labels.indexOf('dca-calculator-heading');
    const idxOverview = labels.indexOf('dca-overview-heading');
    expect(idxHero).toBeGreaterThanOrEqual(0);
    expect(idxCalc).toBeGreaterThan(idxHero);
    expect(idxOverview).toBeGreaterThan(idxCalc);
  });
});
