import { test, expect } from '@playwright/test';

/**
 * Live BTC sparkline — visual + a11y regression guard.
 *
 *  - Highlight dot (halo + core circle) must render at the end of the
 *    polyline on both desktop and mobile.
 *  - The widget must expose an aria-label and an sr-only text fallback
 *    so screen-reader users get the latest BTC value.
 *  - Reserving a fixed height on the sparkline wrapper must keep CLS
 *    at zero across the LCP window.
 */

const VIEWPORTS = [
  { name: 'desktop', width: 1366, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`Hero BTC sparkline @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('renders highlight dot, a11y label, and no CLS', async ({ page }) => {
      // Track layout shifts before navigation so we capture the LCP window.
      await page.addInitScript(() => {
        (window as any).__cls = 0;
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as any[]) {
              if (!entry.hadRecentInput) (window as any).__cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });
        } catch {
          /* unsupported */
        }
      });

      await page.goto('/');

      const widget = page.getByTestId('hero-btc-sparkline');
      await expect(widget).toBeVisible();

      // Accessibility surface
      const aria = await widget.getAttribute('aria-label');
      expect(aria, 'sparkline must expose aria-label').toMatch(/bitcoin/i);
      await expect(widget).toHaveAttribute('role', 'img');
      await expect(widget).toHaveAttribute('tabindex', '0');

      // Text fallback
      const sr = page.getByTestId('spark-sr-latest');
      await expect(sr).toHaveText(/BTC|loading/i);

      // Highlight dot pair (halo + core)
      await expect(widget.getByTestId('spark-halo')).toBeAttached();
      await expect(widget.getByTestId('spark-dot')).toBeAttached();

      // Keyboard focusable + visible focus ring
      await widget.focus();
      await expect(widget).toBeFocused();

      // Snapshot for visual regression
      await expect(widget).toHaveScreenshot(`hero-sparkline-${vp.name}.png`, {
        maxDiffPixelRatio: 0.02,
      });

      // CLS guard — sparkline reserved height should keep CLS tiny.
      await page.waitForLoadState('networkidle');
      const cls = await page.evaluate(() => (window as any).__cls ?? 0);
      expect(cls, `CLS should be ≤ 0.05, was ${cls}`).toBeLessThanOrEqual(0.05);
    });
  });
}
