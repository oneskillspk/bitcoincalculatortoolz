import { test, expect, devices } from '@playwright/test';

/**
 * Regression test for the Footer ↔ SlotD mobile collision fix.
 *
 * On small screens SlotD renders as a fixed 60px bottom bar (z-40).
 * Without the IntersectionObserver collision rule it would visually
 * overlap the pre-footer affiliate band the moment the user scrolled
 * to the bottom of the page — two ad surfaces stacked on top of each
 * other, which looks unprofessional and hurts CTR.
 *
 * We assert across three common mobile breakpoints that, once the
 * footer is on screen, SlotD has either fully retracted off-screen
 * (translateY(80px)) or its visual rect does not overlap the pre-footer
 * affiliate band. The desktop project skips this test by design.
 */
const MOBILE_VIEWPORTS = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-13', width: 390, height: 844 },
  { name: 'pixel-7', width: 412, height: 915 },
];

// Use a calculator route that we know mounts SlotD via useSmartZones.
const TEST_ROUTE = '/calculators/dca';

test.describe('Mobile layout — Footer never overlaps SlotD', () => {
  test.skip(
    ({ browserName }, testInfo) =>
      !testInfo.project.name.startsWith('mobile'),
    'Mobile-only regression'
  );

  for (const vp of MOBILE_VIEWPORTS) {
    test(`no overlap at ${vp.name} (${vp.width}×${vp.height})`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({
        ...devices['iPhone 13'],
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();

      // Pre-grant consent so impression logging + slots behave as in
      // a returning-visitor session.
      await page.addInitScript(() => {
        try {
          localStorage.setItem('bct-consent-v1', 'granted');
        } catch {
          /* ignore */
        }
      });

      await page.goto(TEST_ROUTE, { waitUntil: 'domcontentloaded' });

      // Scroll halfway down so PreFAQPlacement / useSmartZones arms
      // SlotD before we land on the footer.
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' as ScrollBehavior })
      );
      await page.waitForTimeout(800);

      // Then scroll to the very bottom — footer + pre-footer affiliate
      // are now in view and the collision rule should fire.
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior })
      );
      // Give the IntersectionObserver + 350ms slide-out animation room.
      await page.waitForTimeout(700);

      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();

      // SlotD: the fixed mobile bar is the only `[role="complementary"]`
      // with `position: fixed; bottom: 0` on the page.
      const slotD = page.locator('[role="complementary"][aria-label="Sponsored offer"]');

      const slotDState = await slotD.evaluateAll((els, vh) => {
        const el = els[0] as HTMLElement | undefined;
        if (!el) return { present: false };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          present: true,
          fixed: cs.position === 'fixed',
          transform: cs.transform,
          top: r.top,
          bottom: r.bottom,
          // "Retracted" = the bar slid off-screen via translateY(80px).
          offscreen: r.top >= vh - 1 || r.bottom <= 0,
        };
      }, vp.height);

      if (!slotDState.present) {
        // Slot may have been dismissed in fatigue path — that's fine,
        // nothing to overlap.
        await ctx.close();
        return;
      }

      // The pre-footer affiliate carries data-slot-d-collision.
      const collisionTarget = page.locator('[data-slot-d-collision]').first();
      const targetCount = await collisionTarget.count();

      if (targetCount === 0) {
        // No pre-footer affiliate on this route — just assert SlotD
        // doesn't cover the footer itself.
        const footerBox = await footer.boundingBox();
        if (footerBox && !slotDState.offscreen) {
          // SlotD rect must not intrude into the visible footer area.
          expect(
            slotDState.top >= footerBox.y + footerBox.height ||
              slotDState.bottom <= footerBox.y,
            `SlotD overlaps <footer> at ${vp.name}`
          ).toBeTruthy();
        }
        await ctx.close();
        return;
      }

      const targetBox = await collisionTarget.boundingBox();
      expect(targetBox, 'pre-footer affiliate must have a layout box').not.toBeNull();

      // The contract: once the footer is in view, SlotD is either
      // visually retracted OR its rect does not overlap the pre-footer
      // affiliate band.
      const overlap =
        !slotDState.offscreen &&
        targetBox! &&
        slotDState.bottom > targetBox!.y &&
        slotDState.top < targetBox!.y + targetBox!.height;

      expect(
        overlap,
        `SlotD (${slotDState.top}-${slotDState.bottom}) overlaps pre-footer affiliate ` +
          `(${targetBox!.y}-${targetBox!.y + targetBox!.height}) at ${vp.name}`
      ).toBeFalsy();

      await ctx.close();
    });
  }
});
