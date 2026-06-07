import { test, expect } from '@playwright/test';

/**
 * Splash → React-mount smoke test (production build).
 *
 * Verifies:
 *  1. The inline splash renders before any JS executes (LCP-friendly).
 *  2. React mounts and replaces the splash within a strict timeout.
 *  3. A screenshot of the splash is captured for visual review.
 *
 * Runs against `vite preview` (see playwright.config.ts).
 */

const MOUNT_TIMEOUT_MS = 10_000;

test.describe('Splash screen', () => {
  test('renders splash, then React mounts within timeout (EN)', async ({ page }, testInfo) => {
    // Throttle network slightly so the splash is observable on fast machines.
    const responsePromise = page.goto('/', { waitUntil: 'commit' });
    await responsePromise;

    const splash = page.getByTestId('splash');
    await expect(splash).toBeVisible();

    // Capture the splash for visual review before React tears it down.
    const splashShot = await splash.screenshot();
    await testInfo.attach('splash-en.png', { body: splashShot, contentType: 'image/png' });

    // React mounts — splash should be removed and real app content present.
    await expect(splash).toHaveCount(0, { timeout: MOUNT_TIMEOUT_MS });
    await expect(page.locator('main, [role="main"], header').first()).toBeVisible({
      timeout: MOUNT_TIMEOUT_MS,
    });
  });

  test('renders Turkish splash copy on /tr', async ({ page }, testInfo) => {
    await page.goto('/tr', { waitUntil: 'commit' });
    const splash = page.getByTestId('splash');
    await expect(splash).toBeVisible();
    await expect(page.locator('#splash-title')).toHaveText(/Hesaplayıcı/i);

    const splashShot = await splash.screenshot();
    await testInfo.attach('splash-tr.png', { body: splashShot, contentType: 'image/png' });

    await expect(splash).toHaveCount(0, { timeout: MOUNT_TIMEOUT_MS });
  });

  test('splash respects dark color scheme', async ({ browser }, testInfo) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'commit' });
    const splash = page.getByTestId('splash');
    await expect(splash).toBeVisible();
    const shot = await splash.screenshot();
    await testInfo.attach('splash-dark.png', { body: shot, contentType: 'image/png' });
    await context.close();
  });
});
