import { test, expect, type Page } from '@playwright/test';

/**
 * Behavioral checks for the retirement scroll tables at small widths:
 *  1. Row-header column stays pinned at left:0 while the scroller scrolls.
 *  2. Right edge fade is visible at scrollLeft=0 (more content to the right).
 *  3. Left edge fade becomes visible after scrolling right.
 */

const ROUTE = '/calculators/retirement';
const VIEWPORTS = [
  { name: '375', width: 375, height: 900 },
  { name: '390', width: 390, height: 900 },
  { name: '414', width: 414, height: 900 },
  { name: '768', width: 768, height: 1000 },
] as const;

const TABLE_REGIONS = [
  'region[aria-label="Bitcoin retirement income comparison table"]',
  'region[aria-label="Bitcoin retirement vs. 60/40 portfolio comparison"]',
].map((s) => s.replace('region', '[role="region"]'));

async function gotoReady(page: Page) {
  await page.goto(ROUTE);
  await page.waitForLoadState('networkidle');
}

for (const vp of VIEWPORTS) {
  test.describe(`retirement tables @ ${vp.name}px`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('row headers are sticky and fades respond to scroll', async ({ page }) => {
      await gotoReady(page);

      for (const sel of TABLE_REGIONS) {
        const region = page.locator(sel).first();
        // Some tables stack into cards below the `sm` breakpoint (640px) and
        // hide the scrollable region entirely. Skip those at small widths.
        if ((await region.count()) === 0 || !(await region.isVisible().catch(() => false))) {
          continue;
        }
        await region.scrollIntoViewIfNeeded();
        await expect(region).toBeVisible();


        // Row header sticky positioning
        const rowHeader = region.locator('th[scope="row"]').first();
        const stickyPos = await rowHeader.evaluate(
          (el) => getComputedStyle(el).position
        );
        expect(stickyPos).toBe('sticky');

        // Right fade visible at start (only if table actually overflows)
        const overflows = await region.evaluate(
          (el) => el.scrollWidth > el.clientWidth + 4
        );

        if (overflows) {
          const fades = region.locator('xpath=..').locator('[aria-hidden="true"]');
          await expect(fades.nth(1)).toHaveCSS('opacity', '1');

          // Scroll the region and re-check left fade
          await region.evaluate((el) => el.scrollTo({ left: 200 }));
          await page.waitForTimeout(250);
          await expect(fades.nth(0)).toHaveCSS('opacity', '1');

          // Row header remains visually pinned at the region's left edge
          const [regionBox, headerBox] = await Promise.all([
            region.boundingBox(),
            rowHeader.boundingBox(),
          ]);
          expect(regionBox && headerBox).toBeTruthy();
          if (regionBox && headerBox) {
            expect(Math.abs(headerBox.x - regionBox.x)).toBeLessThan(8);
          }
        }
      }
    });
  });
}
