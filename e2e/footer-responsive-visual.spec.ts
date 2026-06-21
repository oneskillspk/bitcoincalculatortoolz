import { test, expect } from '@playwright/test';

/**
 * Responsive footer visual checks.
 *
 * Guards spacing/alignment of the site <footer> on both mobile and desktop
 * after the "Read the guide" section was removed. Also asserts that the
 * newsletter consent checkbox renders at the intended ~14px square (not
 * the oversized native default that previously bled into the layout).
 */

const ROUTES = ['/', '/calculators/dca'];

test.describe('Footer — responsive layout', () => {
  for (const route of ROUTES) {
    test(`mobile @ ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      const footer = page.locator('footer.site-footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer).toHaveScreenshot(`footer-mobile-${route.replace(/\W+/g, '_')}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });

    test(`desktop @ ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 900 });
      await page.goto(route);
      const footer = page.locator('footer.site-footer');
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      await expect(footer).toHaveScreenshot(`footer-desktop-${route.replace(/\W+/g, '_')}.png`, {
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});

test.describe('Newsletter consent checkbox', () => {
  for (const size of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1366, height: 900 },
  ] as const) {
    test(`renders ~14px on ${size.name}`, async ({ page }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('/');
      const checkbox = page
        .locator('input[type="checkbox"][aria-label*="privacy" i], input[type="checkbox"][aria-label*="gizlilik" i]')
        .first();
      await checkbox.scrollIntoViewIfNeeded();
      await expect(checkbox).toBeVisible();
      const box = await checkbox.boundingBox();
      expect(box, 'checkbox should have a bounding box').not.toBeNull();
      // Locked to 14×14 via inline style + h-3.5/w-3.5 classes.
      expect(box!.width).toBeGreaterThanOrEqual(12);
      expect(box!.width).toBeLessThanOrEqual(18);
      expect(box!.height).toBeGreaterThanOrEqual(12);
      expect(box!.height).toBeLessThanOrEqual(18);
    });
  }
});
