import { test, expect, type Page } from '@playwright/test';

/**
 * Wide visual regression / screenshot audit.
 *
 * For 20+ representative routes (EN + TR, home, calculators index,
 * learn hub, top calculators and tax pages) we:
 *
 *   1. Navigate, grant consent, wait for the page to settle.
 *   2. Capture three viewport screenshots — top, mid-scroll, bottom —
 *      and attach them to the Playwright report for visual review.
 *   3. Assert that at least one affiliate / sponsored surface is
 *      visibly painted by the time the user reaches the page bottom,
 *      so monetization regressions surface immediately alongside the
 *      visual diff.
 *
 * Runs on both the `chromium-desktop` and `mobile-safari` projects so
 * every breakpoint is exercised. Pure assertions only — no baseline
 * image comparison — so the suite is stable across font/anti-alias
 * drift while still capturing artefacts for human review.
 */

const ROUTES: string[] = [
  // EN — static surfaces
  '/',
  '/calculators',
  '/learn',
  '/about',
  '/methodology',
  // EN — top calculators
  '/calculators/dca',
  '/calculators/profit-loss',
  '/calculators/retirement',
  '/calculators/rainbow-chart',
  '/calculators/halving-countdown',
  '/calculators/fear-greed-index',
  '/calculators/portfolio-tracker',
  '/calculators/bitcoin-converter',
  '/calculators/savings',
  '/calculators/investment',
  '/calculators/hodl-strategy',
  '/calculators/lump-sum-vs-dca',
  // EN — tax surfaces
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
  '/calculators/bitcoin-tax-india',
  // TR mirror
  '/tr/',
  '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi',
];

const AFFILIATE_SELECTOR = [
  '[data-affiliate-placement]',
  '[data-slot-d-collision]',
  '[role="complementary"][aria-label="Sponsored offer"]',
  '[role="complementary"][aria-label="Sponsored partner"]',
].join(', ');

async function grantConsent(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('bct-consent-v1', 'granted');
    } catch {
      /* ignore */
    }
  });
}

async function captureAtScroll(
  page: Page,
  testInfoAttach: (name: string, body: Buffer) => Promise<void>,
  label: string,
  yFactor: number
) {
  await page.evaluate((f) => {
    const top = Math.max(
      0,
      Math.floor((document.documentElement.scrollHeight - window.innerHeight) * f)
    );
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  }, yFactor);
  await page.waitForTimeout(500);
  const buf = await page.screenshot({ fullPage: false });
  await testInfoAttach(label, buf);
}

test.describe('Wide visual regression — affiliate visibility + screenshot audit', () => {
  for (const route of ROUTES) {
    test(`visual: ${route}`, async ({ page }, testInfo) => {
      await grantConsent(page);

      const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(resp, `navigation to ${route}`).not.toBeNull();
      expect(resp!.status(), `route ${route} responded 2xx/3xx`).toBeLessThan(400);

      await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});

      const attach = async (name: string, body: Buffer) => {
        await testInfo.attach(`${route.replace(/\W+/g, '_')}__${name}`, {
          body,
          contentType: 'image/png',
        });
      };

      await captureAtScroll(page, attach, 'top', 0);
      await captureAtScroll(page, attach, 'mid', 0.5);
      await captureAtScroll(page, attach, 'bottom', 1);

      // Affiliate visibility assertion — at least one tracked surface
      // must be painted by the time the user reaches the page bottom.
      const visibleCount = await page.$$eval(AFFILIATE_SELECTOR, (els) =>
        (els as HTMLElement[]).filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) {
            return false;
          }
          const r = el.getBoundingClientRect();
          return r.width >= 2 && r.height >= 2;
        }).length
      );

      expect(
        visibleCount,
        `expected at least one visible affiliate surface on ${route} ` +
          `(project=${testInfo.project.name})`
      ).toBeGreaterThan(0);
    });
  }
});
