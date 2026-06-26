import { test, expect } from '@playwright/test';

/**
 * Visual regression snapshot for the homepage newsletter section.
 *
 * Catches CSS regressions that could re-inflate the consent checkbox
 * (e.g. global `input { min-height: 44px }` rules on touch devices) or
 * otherwise distort the section layout on mobile vs. desktop.
 */

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1366, height: 900 },
] as const;

test.describe('Newsletter section — visual snapshot', () => {
  for (const vp of VIEWPORTS) {
    test(`renders consistently on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      // testNoAnim=1 disables entry animations so snapshots are deterministic.
      await page.goto('/?testNoAnim=1');

      const checkbox = page
        .locator(
          'input[type="checkbox"][aria-label*="privacy" i], input[type="checkbox"][aria-label*="gizlilik" i]',
        )
        .first();
      await checkbox.scrollIntoViewIfNeeded();
      await expect(checkbox).toBeVisible();

      // The closest <section> ancestor of the consent checkbox is the
      // newsletter block; fall back to the wrapping <form> if no section.
      const section = checkbox
        .locator('xpath=ancestor::section[1] | ancestor::form[1]')
        .first();
      await expect(section).toBeVisible();

      // Let lazy media/fonts settle before snapshot.
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(400);

      await expect(section).toHaveScreenshot(
        `newsletter-section-${vp.name}.png`,
        { maxDiffPixelRatio: 0.02, animations: 'disabled' },
      );
    });
  }
});
