import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Full share-panel coverage guard.
 *
 * Crawls every calculator route in public/sitemap.xml and asserts:
 *   1. A visible [data-share-export-panel] renders on the page.
 *   2. The panel (when it renders as a `card` variant) sits ABOVE the
 *      RelatedCalculators rail.
 *   3. The Copy-link button copies a URL whose path matches
 *      /s/<slug> or /calculators/<slug> for the correct calculator slug.
 *
 * Inline-only panels (pizza-day, price-target, average-buy-price) are
 * accepted for the presence check but exempted from the above-related
 * ordering assertion because they render inside article footers.
 */

const SITEMAP = resolve(process.cwd(), 'public/sitemap.xml');
const ROUTES: { path: string; slug: string }[] = (() => {
  const xml = readFileSync(SITEMAP, 'utf-8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs
    .map((u) => u.replace(/^https?:\/\/[^/]+/, ''))
    .filter((p) => p.startsWith('/calculators/'));
  return [...new Set(paths)]
    .sort()
    .map((path) => ({ path, slug: path.split('/').pop()! }));
})();

// Slug-mismatch tolerance: page path segment may differ from the canonical
// share slug when the page has a "bitcoin-<slug>" alias.
function slugMatches(pathSlug: string, copiedSlug: string): boolean {
  if (pathSlug === copiedSlug) return true;
  if (`bitcoin-${copiedSlug}` === pathSlug) return true;
  if (pathSlug.replace(/^bitcoin-/, '') === copiedSlug) return true;
  return false;
}

async function installClipboardCapture(page: Page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.addInitScript(() => {
    (window as unknown as { __copied: string | null }).__copied = null;
    const shim = {
      writeText: async (t: string) => { (window as unknown as { __copied: string | null }).__copied = t; },
      readText:  async () => (window as unknown as { __copied: string | null }).__copied ?? '',
    };
    try { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: shim }); } catch {}
  });
}

function extractUrl(payload: string): URL {
  const direct = payload.match(/https?:\/\/[^\s]+/);
  if (direct) return new URL(direct[0]);
  const bare = payload.match(/([\w-]+\.)+[\w-]+\/[^\s]*/);
  if (!bare) throw new Error(`no URL in clipboard payload: ${payload}`);
  return new URL('https://' + bare[0]);
}

test.describe('Share panel · full site coverage (all 49 calculator routes)', () => {
  test.beforeAll(() => {
    expect(ROUTES.length, 'sitemap must expose at least 40 calculator routes').toBeGreaterThanOrEqual(40);
  });

  for (const { path, slug } of ROUTES) {
    test(`${path} · panel present, above Related, copy-link → /${slug}`, async ({ page }) => {
      test.setTimeout(60_000);
      await installClipboardCapture(page);
      await page.setViewportSize({ width: 1280, height: 1800 });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      // Trigger lazy sections that mount on scroll.
      for (const y of [1000, 2500, 4500, 7000, 10000]) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(120);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);

      // 1. Panel present.
      const anyPanel = page.locator('[data-share-export-panel]').first();
      await expect(anyPanel, `no share panel rendered on ${path}`).toBeAttached({ timeout: 15_000 });

      const card = page.locator('[data-share-export-panel="card"]').first();
      const hasCard = (await card.count()) > 0;

      // 2. Card variant must render above RelatedCalculators.
      if (hasCard) {
        await card.scrollIntoViewIfNeeded();
        const related = page.getByRole('heading', { name: /related/i }).first();
        if (await related.count()) {
          const [panelTop, relatedTop] = await Promise.all([
            card.evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
            related.evaluate((el) => el.getBoundingClientRect().top + window.scrollY),
          ]);
          expect(
            panelTop,
            `panel (y=${panelTop}) must render above RelatedCalculators (y=${relatedTop}) on ${path}`,
          ).toBeLessThan(relatedTop);
        }
      }

      // 3. Copy-link button copies a URL targeting the correct slug.
      const scope = hasCard ? card : anyPanel;
      const copyBtn = scope.getByRole('button', { name: /copy.*link/i }).first();
      await expect(copyBtn, `no copy-link button on ${path}`).toBeVisible();

      await page.evaluate(() => { (window as unknown as { __copied: string | null }).__copied = null; });
      await copyBtn.click();
      await expect
        .poll(() => page.evaluate(() => (window as unknown as { __copied: string | null }).__copied), { timeout: 5_000 })
        .toBeTruthy();

      const payload = (await page.evaluate(
        () => (window as unknown as { __copied: string | null }).__copied,
      )) as string;
      const url = extractUrl(payload);
      const m = url.pathname.match(/^\/(?:s|calculators)\/([\w-]+)/);
      expect(m, `copied URL "${url.pathname}" on ${path} must be /s/<slug> or /calculators/<slug>`).not.toBeNull();
      expect(
        slugMatches(slug, m![1]),
        `copied slug "${m![1]}" on ${path} must match page slug "${slug}"`,
      ).toBe(true);
    });
  }
});
