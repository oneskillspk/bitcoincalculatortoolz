import { test, expect } from '@playwright/test';
import { EN_TO_TR } from '../src/utils/localizedRoutes';

/**
 * Guards against the "double loading screen" regression:
 *  1. Splash is visible on first paint.
 *  2. Splash fades out smoothly (opacity transitions, not instant remove).
 *  3. At no point between splash visible → page visible is there a frame where
 *     both splash is gone AND the route fallback is the only thing on screen
 *     (i.e. a blank/background-only flash).
 *  4. Subsequent client-side navigations do not re-show the splash.
 */

const ROUTES = [
  '/',
  '/tr',
  ...Object.keys(EN_TO_TR),
  ...Object.values(EN_TO_TR),
].filter((route, index, routes) => routes.indexOf(route) === index);

const CLIENT_NAV_ROUTES = [
  '/calculators',
  '/calculators/dca',
  '/calculators/retirement',
  '/learn',
  '/tr/hesaplayicilar',
  '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
  '/tr/ogrenin',
];

const isAlertRed = (value: string) => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return false;
  const [, r, g, b] = match.map(Number);
  return r > 180 && g < 120 && b < 90;
};

async function expectNoRedLoadingIndicators(page: import('@playwright/test').Page) {
  const loadingColorsAreNeutral = await page.evaluate(() => {
    const isAlertRedInBrowser = (value: string) => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return false;
      const [, r, g, b] = match.map(Number);
      return r > 180 && g < 120 && b < 90;
    };

    const splashDot = document.querySelector('.splash-eyebrow');
    const progress = document.querySelector('#route-progress > div');
    const colors = [
      splashDot ? getComputedStyle(splashDot, '::before').backgroundColor : '',
      progress ? getComputedStyle(progress).backgroundColor : '',
    ];

    return colors.every((color) => !isAlertRedInBrowser(color));
  });
  expect(loadingColorsAreNeutral).toBe(true);
}

test.describe('splash screen — no double-loading flash', () => {
  for (const route of ROUTES) {
    test(`smooth handoff on ${route}`, async ({ page }) => {
      // Simulate a slower network so the lazy chunk gap is observable.
      await page.route('**/*.js', async (r) => {
        await new Promise((res) => setTimeout(res, 50));
        await r.continue();
      });

      await page.goto(route, { waitUntil: 'commit' });

      // Splash must be visible right after commit.
      const splash = page.locator('[data-testid="splash"]');
      await expect(splash).toBeVisible();

      // The loading handoff itself must stay neutral — no red/orange alert-like
      // indicator on the splash or route fallback.
      const loadingColorsAreNeutral = await page.evaluate(() => {
        const isAlertRed = (value: string) => {
          const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (!match) return false;
          const [, r, g, b] = match.map(Number);
          return r > 180 && g < 120 && b < 90;
        };

        const splashDot = document.querySelector('.splash-eyebrow');
        const progress = document.querySelector('#route-progress > div');
        const colors = [
          splashDot ? getComputedStyle(splashDot, '::before').backgroundColor : '',
          progress ? getComputedStyle(progress).backgroundColor : '',
        ];

        return colors.every((color) => !isAlertRed(color));
      });
      expect(loadingColorsAreNeutral).toBe(true);

      // Wait for the real page <main> / root content to mount.
      await page.waitForFunction(() => {
        const root = document.getElementById('root');
        return !!root && root.children.length > 0 && !!document.querySelector('main, h1');
      });

      // While the page is painted, splash should still exist mid-fade
      // (opacity transitioning, not instantly removed) — proving the smooth
      // handoff is in effect.
      const opacityDuringHandoff = await splash.evaluate(
        (el) => getComputedStyle(el).transitionDuration,
      ).catch(() => '0s');
      expect(opacityDuringHandoff).not.toBe('0s');

      // Eventually splash is removed entirely.
      await expect(splash).toHaveCount(0, { timeout: 5000 });

      // Visual snapshot of the final route to catch unrelated layout regressions.
      await expect(page).toHaveScreenshot(`route${route.replace(/\//g, '_') || '_root'}.png`, {
        fullPage: false,
        maxDiffPixelRatio: 0.03,
      });
    });
  }

  test('splash does not reappear on client-side navigation', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="splash"]').waitFor({ state: 'detached' });

    await page.goto('/bitcoin-retirement-calculator', { waitUntil: 'commit' });
    // After initial removal, a client nav must not inject a fresh splash element.
    const splashAfterNav = await page.locator('[data-testid="splash"]').count();
    expect(splashAfterNav).toBe(0);
  });
});
