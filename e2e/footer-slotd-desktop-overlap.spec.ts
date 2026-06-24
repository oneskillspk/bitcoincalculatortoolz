import { test, expect } from '@playwright/test';

/**
 * Regression test for the Footer ↔ SlotD desktop layout contract.
 *
 * On desktop (≥1024px) SlotD renders as a fixed 280px sidebar pinned
 * to the right rail (`right: 24px; top: 50%`). The pre-footer affiliate
 * lives inside the centered container in normal flow. Once the user
 * scrolls to the footer, the two surfaces must not visually overlap —
 * the sidebar should either retract off-screen via the collision rule
 * or simply sit clear of the centered footer band.
 *
 * We assert this across three common desktop breakpoints. The mobile
 * project skips this test by design.
 */
const DESKTOP_VIEWPORTS = [
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop-hd', width: 1440, height: 900 },
  { name: 'desktop-fhd', width: 1920, height: 1080 },
];

const TEST_ROUTE = '/calculators/dca';

test.describe('Desktop layout — Footer never overlaps SlotD', () => {
  test.skip(
    ({}, testInfo) => !testInfo.project.name.startsWith('chromium-desktop'),
    'Desktop-only regression'
  );

  for (const vp of DESKTOP_VIEWPORTS) {
    test(`no overlap at ${vp.name} (${vp.width}×${vp.height})`, async ({ browser }) => {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();

      // Pre-grant consent so slots arm normally for a returning visitor.
      await page.addInitScript(() => {
        try {
          localStorage.setItem('bct-consent-v1', 'granted');
        } catch {
          /* ignore */
        }
      });

      await page.goto(TEST_ROUTE, { waitUntil: 'domcontentloaded' });

      // Mid-scroll arms SlotD via useSmartZones / PreFAQPlacement.
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' as ScrollBehavior })
      );
      await page.waitForTimeout(800);

      // Scroll to bottom — footer + pre-footer affiliate are now on screen.
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior })
      );
      await page.waitForTimeout(700);

      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();

      const slotD = page.locator('[role="complementary"][aria-label="Sponsored offer"]');
      const slotDState = await slotD.evaluateAll((els, vw) => {
        const el = els[0] as HTMLElement | undefined;
        if (!el) return { present: false };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          present: true,
          fixed: cs.position === 'fixed',
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          // "Retracted" = slid off-screen to the right via translateX(320px).
          offscreen: r.left >= vw - 1 || r.right <= 0,
        };
      }, vp.width);

      if (!slotDState.present) {
        // Dismissed / fatigued — nothing to overlap.
        await ctx.close();
        return;
      }

      const collisionTarget = page.locator('[data-slot-d-collision]').first();
      const targetCount = await collisionTarget.count();

      // Helper: assert two rects don't intersect.
      const intersects = (
        a: { left: number; right: number; top: number; bottom: number },
        b: { x: number; y: number; width: number; height: number }
      ) =>
        a.right > b.x &&
        a.left < b.x + b.width &&
        a.bottom > b.y &&
        a.top < b.y + b.height;

      if (targetCount === 0) {
        // No pre-footer affiliate on this route — assert vs <footer>.
        const footerBox = await footer.boundingBox();
        if (footerBox && !slotDState.offscreen) {
          expect(
            !intersects(slotDState, footerBox),
            `SlotD overlaps <footer> at ${vp.name}`
          ).toBeTruthy();
        }
        await ctx.close();
        return;
      }

      const targetBox = await collisionTarget.boundingBox();
      expect(targetBox, 'pre-footer affiliate must have a layout box').not.toBeNull();

      const overlap = !slotDState.offscreen && intersects(slotDState, targetBox!);

      expect(
        overlap,
        `SlotD rect [${slotDState.left}-${slotDState.right} × ${slotDState.top}-${slotDState.bottom}] ` +
          `overlaps pre-footer affiliate [${targetBox!.x}-${targetBox!.x + targetBox!.width} × ` +
          `${targetBox!.y}-${targetBox!.y + targetBox!.height}] at ${vp.name}`
      ).toBeFalsy();

      await ctx.close();
    });
  }
});
