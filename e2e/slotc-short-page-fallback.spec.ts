import { test, expect, type Page } from '@playwright/test';

/**
 * SlotC short-page fallback regression.
 *
 * The orchestrator's preferred SlotC gate is `contentTall` (page
 * scrollHeight > 2.5× viewport). On short calculator pages that gate
 * never fires, so the fallback arms SlotC once the user is engaged:
 *
 *   pageReady && !inCooldown && (contentTall || hasResult || timeOnPage ≥ 12s)
 *
 * This suite picks two known-short calculator routes, waits long enough
 * for the idle-hint dwell (12s) plus SlotC's 2s in-view arming delay,
 * and asserts:
 *
 *   1. A SlotC region (`[data-slot="C"]`) is visibly painted.
 *   2. SlotC does not visually overlap SlotB (`[data-slot="B"]`) or
 *      SlotD (`[data-slot="D"]`) at any viewport.
 *
 * Runs on both `chromium-desktop` and `mobile-safari` projects.
 */

const SHORT_CALCULATOR_ROUTES = [
  '/calculators/halving-countdown',
  '/calculators/fear-greed-index',
];

// Idle-hint (12s) + SlotC arming dwell (2s) + small safety margin.
const SLOTC_FALLBACK_WAIT_MS = 15_500;

interface Rect { x: number; y: number; w: number; h: number; slot: string }

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

async function grantConsent(page: Page) {
  await page.addInitScript(() => {
    try { localStorage.setItem('bct-consent-v1', 'granted'); } catch { /* ignore */ }
  });
}

async function collectSlotRects(page: Page): Promise<Rect[]> {
  return await page.$$eval('[data-slot]', (els) =>
    (els as HTMLElement[])
      .map((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
          return null;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        return {
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
          slot: el.getAttribute('data-slot') || '',
        };
      })
      .filter((r): r is { x: number; y: number; w: number; h: number; slot: string } => r !== null)
  );
}

// Each test allows 60s (config default); the per-route work waits ~16s.
test.describe('SlotC short-page fallback — renders and never overlaps B/D', () => {
  for (const route of SHORT_CALCULATOR_ROUTES) {
    test(`SlotC fallback fires on short page ${route}`, async ({ page }, testInfo) => {
      await grantConsent(page);
      const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(resp, `navigation to ${route}`).not.toBeNull();
      expect(resp!.status(), `route ${route} responded 2xx/3xx`).toBeLessThan(400);

      // Confirm the page actually is short — guards against accidentally
      // running this test against a long-form route, which would let the
      // `contentTall` branch satisfy the assertion and mask a fallback
      // regression.
      const ratio = await page.evaluate(
        () => document.documentElement.scrollHeight / window.innerHeight
      );
      expect(
        ratio,
        `expected ${route} to be short (<2.5× viewport) so the SlotC fallback path is exercised`
      ).toBeLessThan(2.5);

      // Wait for the orchestrator's 12s idle-hint + SlotC's 2s arm dwell.
      // Keep the IntersectionObserver happy by scrolling SlotC's slot
      // into view periodically.
      const deadline = Date.now() + SLOTC_FALLBACK_WAIT_MS;
      while (Date.now() < deadline) {
        await page.evaluate(() => {
          const c = document.querySelector('[data-slot="C"]') as HTMLElement | null;
          if (c) c.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
          else window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await page.waitForTimeout(1_000);
      }

      const rects = await collectSlotRects(page);
      const c = rects.filter((r) => r.slot === 'C');
      const b = rects.filter((r) => r.slot === 'B');
      const d = rects.filter((r) => r.slot === 'D');

      // 1. SlotC must be visibly painted on the short page.
      expect(
        c.length,
        `expected SlotC to render on short page ${route} ` +
          `(project=${testInfo.project.name}); seen slots=${rects.map((r) => r.slot).join(',') || 'none'}`
      ).toBeGreaterThan(0);

      // 2. SlotC must not overlap SlotB or SlotD.
      for (const cr of c) {
        for (const other of [...b, ...d]) {
          expect(
            rectsOverlap(cr, other),
            `SlotC overlaps Slot${other.slot} on ${route} ` +
              `(project=${testInfo.project.name}): ` +
              `C=${JSON.stringify(cr)} vs ${other.slot}=${JSON.stringify(other)}`
          ).toBeFalsy();
        }
      }
    });
  }
});
