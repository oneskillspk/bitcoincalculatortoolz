/**
 * SEO smoke test — visits every calculator route (EN + TR alternate) and
 * verifies the rendered <head> exposes:
 *   • non-empty <title>
 *   • <link rel="canonical"> that self-references the current URL
 *   • hreflang="en", hreflang="tr", hreflang="x-default" alternates
 *   • <meta property="og:url"> matching the canonical
 *
 * Source of truth for the (en → tr) pairs is src/utils/localizedRoutes.ts.
 */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PROD = 'https://bitcoincalculator.tools';

function loadCalcPairs(): Array<{ en: string; tr: string }> {
  const src = readFileSync(resolve('src/utils/localizedRoutes.ts'), 'utf8');
  const block = src.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\};/);
  if (!block) throw new Error('EN_TO_TR map not found');
  const pairs: Array<{ en: string; tr: string }> = [];
  for (const m of block[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) {
    if (m[1].startsWith('/calculators/')) pairs.push({ en: m[1], tr: m[2] });
  }
  return pairs;
}

const pairs = loadCalcPairs();

async function assertSeo(page: any, path: string, expectedLang: 'en' | 'tr', pair: { en: string; tr: string }) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  // Helmet hydrates after mount — wait for canonical to appear.
  await page.waitForFunction(() => !!document.querySelector('link[rel="canonical"]'), null, { timeout: 10_000 });

  const title = await page.title();
  expect(title.trim().length, `${path}: <title> empty`).toBeGreaterThan(0);

  const canonical = await page.locator('link[rel="canonical"]').first().getAttribute('href');
  const ogUrl = await page.locator('meta[property="og:url"]').first().getAttribute('content');
  const expectedCanon = `${PROD}${expectedLang === 'en' ? pair.en : pair.tr}`;
  expect(canonical, `${path}: canonical`).toBe(expectedCanon);
  expect(ogUrl, `${path}: og:url`).toBe(expectedCanon);

  const en = await page.locator('link[rel="alternate"][hreflang="en"]').first().getAttribute('href');
  const tr = await page.locator('link[rel="alternate"][hreflang="tr"]').first().getAttribute('href');
  const xd = await page.locator('link[rel="alternate"][hreflang="x-default"]').first().getAttribute('href');
  expect(en, `${path}: hreflang=en`).toBe(`${PROD}${pair.en}`);
  expect(tr, `${path}: hreflang=tr`).toBe(`${PROD}${pair.tr}`);
  expect(xd, `${path}: hreflang=x-default`).toBe(`${PROD}${pair.en}`);
}

test.describe('Calculator pages — SEO head', () => {
  for (const pair of pairs) {
    test(`EN ${pair.en}`, async ({ page }) => {
      await assertSeo(page, pair.en, 'en', pair);
    });
    test(`TR ${pair.tr}`, async ({ page }) => {
      await assertSeo(page, pair.tr, 'tr', pair);
    });
  }
});
