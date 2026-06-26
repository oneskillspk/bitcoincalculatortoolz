import { test, expect, type Page } from '@playwright/test';

/**
 * Single source of truth for splash regressions.
 *
 * After consolidating the loading path (React owns the initial paint, no
 * inline static splash in index.html), there must be exactly ZERO splash
 * elements rendered:
 *   1. on first paint of `/`
 *   2. after a client-side navigation to the Explore Calculators page
 *      (`/calculators`, which is where the "Explore Calculators" CTA links).
 *
 * Splash selectors guarded here cover every historical implementation:
 *   - `[data-testid="splash"]`
 *   - `.splash-container`
 *   - `#splash-title`
 *   - `.splash-eyebrow`
 */

const SPLASH_SELECTOR =
  '[data-testid="splash"], .splash-container, #splash-title, .splash-eyebrow';

async function expectNoSplash(page: Page) {
  await expect(page.locator(SPLASH_SELECTOR)).toHaveCount(0);
}

test.describe('No splash anywhere', () => {
  test('no splash renders on first paint of /', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    // Check the very first paint — before React has had a chance to mount.
    await expectNoSplash(page);

    // And after React has fully mounted the page.
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('main, [role="main"], header').first()).toBeVisible();
    await expectNoSplash(page);
  });

  test('no splash after client-side navigation to Explore Calculators', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main, header').first()).toBeVisible();
    await expectNoSplash(page);

    // Drive a client-side navigation (history.pushState — same path React Router uses).
    await page.evaluate(() => {
      window.history.pushState({}, '', '/calculators');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    await expect(page).toHaveURL(/\/calculators\/?$/);
    await page.waitForFunction(() => !!document.querySelector('main, h1'));
    await expectNoSplash(page);
  });
});
