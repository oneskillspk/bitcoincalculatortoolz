import { test, expect, type Page } from '@playwright/test';

/**
 * End-to-end monetization smoke suite.
 *
 * For every monetizable route (a representative cross-section of the
 * calculator catalog plus key static surfaces) we assert:
 *
 *   1. At least one affiliate surface renders and is visibly painted
 *      (non-zero box, in-document, not display:none).
 *   2. No two affiliate surfaces visually overlap once the page has
 *      settled at the bottom — SlotD's collision rule must fire and the
 *      pre-footer band must remain clear.
 *
 * Runs on both the desktop and mobile Playwright projects so each
 * breakpoint is exercised end-to-end.
 */

// A representative slice of monetizable routes. We deliberately mix
// CRITICAL / HIGH / MEDIUM tiers, EN + TR mirrors, and the key static
// surfaces (home, calculators index, learn). Keeping it under ~12 routes
// keeps the smoke suite fast while still covering every placement path.
const MONETIZABLE_ROUTES: string[] = [
  '/',
  '/calculators',
  '/learn',
  '/calculators/dca',
  '/calculators/profit-loss',
  '/calculators/retirement',
  '/calculators/rainbow-chart',
  '/calculators/halving-countdown',
  '/calculators/fear-greed-index',
  '/calculators/portfolio-tracker',
  '/tr/',
  '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
];

// Selectors that identify any affiliate / sponsored surface on the page.
const AFFILIATE_SELECTORS = [
  '[data-affiliate-placement]',
  '[data-slot-d-collision]',
  '[role="complementary"][aria-label="Sponsored offer"]',
];

const AFFILIATE_SELECTOR = AFFILIATE_SELECTORS.join(', ');

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

async function settle(page: Page) {
  // Pre-grant consent so slots arm as for a returning visitor.
  await page.addInitScript(() => {
    try {
      localStorage.setItem('bct-consent-v1', 'granted');
    } catch {
      /* ignore */
    }
  });
}

async function scrollThrough(page: Page) {
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' as ScrollBehavior })
  );
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as ScrollBehavior })
  );
  await page.waitForTimeout(700);
}

async function collectVisibleRects(page: Page): Promise<Rect[]> {
  return await page.$$eval(AFFILIATE_SELECTOR, (els) =>
    (els as HTMLElement[])
      .map((el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
          return null;
        }
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      })
      .filter((r): r is { x: number; y: number; w: number; h: number } => r !== null)
  );
}

test.describe('Monetization smoke — affiliate surfaces render and never overlap', () => {
  for (const route of MONETIZABLE_ROUTES) {
    test(`route "${route}" renders affiliate surfaces without overlap`, async ({ page }, testInfo) => {
      await settle(page);
      const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(resp, `navigation to ${route} returned a response`).not.toBeNull();
      expect(resp!.status(), `route ${route} responded 2xx/3xx`).toBeLessThan(400);

      await scrollThrough(page);

      const rects = await collectVisibleRects(page);

      // 1. At least one affiliate surface must be visible.
      expect(
        rects.length,
        `expected at least one visible affiliate surface on ${route} ` +
          `(project=${testInfo.project.name})`
      ).toBeGreaterThan(0);

      // 2. No two visible surfaces may overlap.
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const overlap = rectsOverlap(rects[i], rects[j]);
          expect(
            overlap,
            `affiliate surfaces overlap on ${route} ` +
              `(project=${testInfo.project.name}): ` +
              `[${JSON.stringify(rects[i])}] vs [${JSON.stringify(rects[j])}]`
          ).toBeFalsy();
        }
      }
    });
  }
});
