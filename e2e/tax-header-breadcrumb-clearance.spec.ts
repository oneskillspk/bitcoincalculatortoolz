import { test, expect } from '@playwright/test';

/**
 * Header ↔ breadcrumb overlap regression for the UK + Germany tax pages.
 *
 * The FloatingNavigation is `position: fixed; top: 0` and roughly
 * 56–70 px tall. If the breadcrumb container ever loses its top padding
 * (as India did with `pt-6`), the header visually covers the breadcrumb
 * on narrow viewports. This spec asserts strict vertical separation
 * across the viewports that matter: 360, 390, 414 (mobile), 768 (tablet),
 * 1280 (desktop).
 */

const ROUTES = [
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
];

const VIEWPORTS = [
  { width: 360, height: 800, label: 'android-360' },
  { width: 390, height: 844, label: 'iphone-390' },
  { width: 414, height: 896, label: 'iphone-plus-414' },
  { width: 768, height: 1024, label: 'tablet-768' },
  { width: 1280, height: 900, label: 'desktop-1280' },
];

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    test(`breadcrumb clears fixed header at ${vp.label} on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'networkidle' });

      // Fixed page header. FloatingNavigation is the site-wide top nav.
      const header = page.locator('header').first();
      await expect(header).toBeVisible();

      // Breadcrumb list rendered by <Breadcrumb />.
      const breadcrumb = page.getByRole('navigation', { name: /breadcrumb/i }).first();
      await expect(breadcrumb).toBeVisible();

      const headerBox = await header.boundingBox();
      const crumbBox = await breadcrumb.boundingBox();

      expect(headerBox, 'header bounding box missing').not.toBeNull();
      expect(crumbBox, 'breadcrumb bounding box missing').not.toBeNull();

      // Breadcrumb top must sit below the header bottom — no overlap.
      expect(
        crumbBox!.y,
        `Breadcrumb overlaps header at ${vp.label} on ${route} ` +
          `(header bottom=${headerBox!.y + headerBox!.height}, ` +
          `crumb top=${crumbBox!.y})`,
      ).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
    });
  }
}
