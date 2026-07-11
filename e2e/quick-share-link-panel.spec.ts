import { test, expect, type Page } from '@playwright/test';

/**
 * QuickShareLinkPanel coverage guard.
 *
 * Every calculator route that was previously flagged as MISSING-PANEL in the
 * share audit must now:
 *   1. Render a visible [data-share-export-panel] (the ShareExportPanel card),
 *   2. Place that panel ABOVE the RelatedCalculators rail (so it lives in
 *      the calculator's own results/action zone — not below unrelated nav),
 *   3. Copy a canonical share URL that targets the CORRECT slug when the
 *      Copy-link button is activated.
 *
 * If a page regresses (panel removed, moved below Related, or slug drifts),
 * this spec fails loudly with the offending route + reason.
 */

interface RouteCase {
  /** URL path (no origin). */ path: string;
  /** Expected slug in the copied URL — matches /s/<slug> or /calculators/<slug>. */
  slug: string;
}

const ROUTES: RouteCase[] = [
  { path: '/calculators/arbitrage',                slug: 'arbitrage' },
  { path: '/calculators/cagr',                     slug: 'cagr' },
  { path: '/calculators/capital-gains-tax',        slug: 'capital-gains-tax' },
  { path: '/calculators/bitcoin-converter',        slug: 'bitcoin-converter' },
  { path: '/calculators/correlation',              slug: 'correlation' },
  { path: '/calculators/dominance',                slug: 'dominance' },
  { path: '/calculators/drawdown',                 slug: 'drawdown' },
  { path: '/calculators/hodl-strategy',            slug: 'hodl-strategy' },
  { path: '/calculators/purchasing-power',         slug: 'purchasing-power' },
  { path: '/calculators/sip',                      slug: 'sip' },
  { path: '/calculators/staking',                  slug: 'staking' },
  { path: '/calculators/supply',                   slug: 'supply' },
  { path: '/calculators/volatility',               slug: 'volatility' },
  { path: '/calculators/zakat',                    slug: 'zakat' },
  { path: '/calculators/btc-vs-real-estate',       slug: 'btc-vs-real-estate' },
  { path: '/calculators/pi-to-bitcoin',            slug: 'pi-to-bitcoin' },
];

async function installClipboardCapture(page: Page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.addInitScript(() => {
    (window as any).__copied = null;
    const shim = {
      writeText: async (text: string) => { (window as any).__copied = text; },
      readText:  async () => (window as any).__copied ?? '',
    };
    try {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: shim });
    } catch { /* headless */ }
  });
}

function extractUrl(payload: string): URL {
  const direct = payload.match(/https?:\/\/[^\s]+/);
  if (direct) return new URL(direct[0]);
  const bare = payload.match(/([\w-]+\.)+[\w-]+\/[^\s]*/);
  if (!bare) throw new Error(`no URL in clipboard payload: ${payload}`);
  return new URL('https://' + bare[0]);
}

test.describe('QuickShareLinkPanel · coverage on previously MISSING-PANEL routes', () => {
  for (const { path, slug } of ROUTES) {
    test(`${path} → panel renders above RelatedCalculators and copies /${slug}`, async ({ page }) => {
      test.setTimeout(45_000);
      await installClipboardCapture(page);
      await page.setViewportSize({ width: 1280, height: 1800 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      // 1. Panel is present and visible.
      const panel = page.locator('[data-share-export-panel="card"]').first();
      await expect(panel, `panel missing on ${path}`).toBeAttached({ timeout: 15_000 });
      await panel.scrollIntoViewIfNeeded();
      await expect(panel).toBeVisible();

      // 2. Panel lives above the RelatedCalculators rail. The rail is
      //    rendered by RelatedCalculators.tsx and heading-labelled "Related".
      const related = page
        .getByRole('heading', { name: /related/i })
        .first();
      const hasRelated = await related.count();
      if (hasRelated) {
        const [panelTop, relatedTop] = await Promise.all([
          panel.evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
          related.evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
        ]);
        expect(
          panelTop,
          `panel (y=${panelTop}) must render above RelatedCalculators (y=${relatedTop}) on ${path}`,
        ).toBeLessThan(relatedTop);
      }

      // 3. Copy-link button copies a URL targeting the correct slug.
      //    Multiple panels can exist (some pages have full ExportReport + Quick),
      //    but every copy-link button on these routes must resolve to the
      //    same calculator slug — no cross-page drift.
      const copyButtons = panel.getByRole('button', { name: /copy.*link/i });
      const count = await copyButtons.count();
      expect(count, `no copy-link button in panel on ${path}`).toBeGreaterThan(0);

      await page.evaluate(() => { (window as any).__copied = null; });
      await copyButtons.first().click();

      await expect
        .poll(() => page.evaluate(() => (window as any).__copied ?? null), { timeout: 5_000 })
        .toBeTruthy();

      const payload: string = await page.evaluate(() => (window as any).__copied);
      const url = extractUrl(payload);
      const slugPattern = new RegExp(`/(s|calculators)/${slug.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?:[/?]|$)`);
      expect(
        url.pathname,
        `copied URL "${url.pathname}" on ${path} must target slug "${slug}"`,
      ).toMatch(slugPattern);
    });
  }
});
