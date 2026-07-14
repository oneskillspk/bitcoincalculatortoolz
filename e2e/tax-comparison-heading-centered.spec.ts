import { test, expect } from '@playwright/test';

/**
 * Layout regression: the "Bitcoin tax — country comparison" heading must
 * be *computed* as centered in a real browser at every viewport we care
 * about — including the 320 px iPhone SE floor and the 1440 px desktop
 * ceiling — so no responsive utility can silently flip it back to left
 * alignment.
 */

const ROUTES = [
  '/calculators/bitcoin-tax-india',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
];

const VIEWPORTS = [
  { width: 320, height: 568, label: 'iphone-se-320' },
  { width: 360, height: 800, label: 'android-360' },
  { width: 768, height: 1024, label: 'tablet-768' },
  { width: 1024, height: 1366, label: 'ipad-pro-1024' },
  { width: 1280, height: 900, label: 'desktop-1280' },
  { width: 1440, height: 900, label: 'desktop-1440' },
];

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    test(`comparison heading is centered at ${vp.label} on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'networkidle' });

      const heading = page.locator('#tax-compare-heading');
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();

      const textAlign = await heading.evaluate(
        (el) => getComputedStyle(el).textAlign,
      );
      expect(
        textAlign,
        `Heading text-align at ${vp.label} on ${route} was "${textAlign}", expected "center"`,
      ).toBe('center');

      // Also assert the CardHeader wrapper inherits centering so any
      // future subheading (subtitle, badge, etc.) stays centered too.
      const wrapperAlign = await heading.evaluate((el) => {
        const parent = el.parentElement;
        return parent ? getComputedStyle(parent).textAlign : null;
      });
      expect(
        wrapperAlign,
        `CardHeader wrapper text-align at ${vp.label} on ${route} was "${wrapperAlign}", expected "center"`,
      ).toBe('center');
    });
  }
}
