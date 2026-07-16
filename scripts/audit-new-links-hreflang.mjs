#!/usr/bin/env node
/**
 * Production crawl for URLs touched by the 2026-07 internal-link push.
 * Uses Playwright because canonical/hreflang tags are injected client-side
 * by react-helmet-async — a raw HTTP fetch of the HTML shell can't see them.
 *
 * Verifies for every URL:
 *   1. HTTP 200 with no redirect hop.
 *   2. <link rel="canonical"> self-references the fetched URL.
 *   3. og:url agrees with canonical.
 *   4. <html lang> matches locale prefix (tr for /tr, en otherwise).
 *   5. Full hreflang triplet (en, tr, x-default) reciprocal with
 *      EN_TO_TR in src/utils/localizedRoutes.ts. Pages with no mirror
 *      are only checked for canonical + og:url + html lang.
 *
 * Usage: node scripts/audit-new-links-hreflang.mjs
 * Writes /tmp/audit/new-links.json. Exits non-zero on any inconsistency.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = 'https://bitcoincalculator.tools';

const URLS = [
  // Anchor targets
  '/calculators/bitcoin-lot-size',
  '/learn/bitcoin-power-law-explained',
  '/calculators/stack-sats',
  '/calculators/sip',
  '/learn/how-to-calculate-bitcoin-lot-size',
  '/tr/hesaplayicilar/bitcoin-sip-dca',
  '/tr/hesaplayicilar/bitcoin-korku-acgozluluk',
  '/tr/',
  // Source pages touched by the edits
  '/about',
  '/affiliate-disclosure',
  '/calculators/retirement',
  '/calculators/rainbow-chart',
  '/calculators/volatility',
  '/calculators/bitcoin-accumulation-score',
  '/learn/how-much-bitcoin-should-i-own',
  '/learn/how-much-bitcoin-by-age',
  '/learn/how-to-calculate-bitcoin-profit-loss',
  '/tr/hakkimizda',
  '/tr/bagli-kurulus-aciklamasi',
  '/tr/ogrenin/bitcoin-hesaplayici-karsilastirma',
  '/tr/ogrenin/bitcoin-sip-rehberi',
  '/tr/ogrenin/bitcoin-emeklilik-planlama-rehberi',
];

// Parse EN_TO_TR from source of truth.
const src = readFileSync('src/utils/localizedRoutes.ts', 'utf8');
const block = src.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\};/);
if (!block) throw new Error('EN_TO_TR map not found');
const EN_TO_TR = { '/': '/tr/' }; // Homepage mirror
for (const m of block[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) EN_TO_TR[m[1]] = m[2];
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([e, t]) => [t, e]));
const norm = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const results = [];
const issues = [];
const add = (url, kind, detail) => issues.push({ url, kind, detail });

for (const path of URLS) {
  const url = `${BASE}${path}`;
  const page = await ctx.newPage();
  const record = { path, url };
  try {
    const nav = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    record.status = nav?.status() ?? 0;
    record.finalUrl = page.url();
    record.redirected = record.finalUrl !== url;

    if (record.status !== 200) add(url, 'non-200', String(record.status));
    if (record.redirected) add(url, 'redirect', `→ ${record.finalUrl}`);

    // Wait for Helmet to hydrate canonical.
    await page
      .waitForFunction(() => !!document.querySelector('link[rel="canonical"]'), null, { timeout: 10_000 })
      .catch(() => {});

    const head = await page.evaluate(() => {
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null;
      const htmlLang = document.documentElement.getAttribute('lang');
      const alternates = {};
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
        const k = el.getAttribute('hreflang').toLowerCase();
        alternates[k] ??= el.getAttribute('href');
      });
      return { canonical, ogUrl, htmlLang, alternates };
    });
    Object.assign(record, head);

    if (!head.canonical) add(url, 'canonical-missing', '');
    else if (head.canonical !== url) add(url, 'canonical-mismatch', `${head.canonical} ≠ ${url}`);

    if (head.ogUrl && head.canonical && head.ogUrl !== head.canonical) {
      add(url, 'og-url-mismatch', `${head.ogUrl} ≠ ${head.canonical}`);
    }

    const isTr = path === '/tr' || path === '/tr/' || path.startsWith('/tr/');
    const expectedLang = isTr ? 'tr' : 'en';
    if (!head.htmlLang) add(url, 'html-lang-missing', '');
    else if (!head.htmlLang.toLowerCase().startsWith(expectedLang)) {
      add(url, 'html-lang-wrong', `${head.htmlLang} (expected ${expectedLang})`);
    }

    const enPath = isTr ? (TR_TO_EN[norm(path)] ?? TR_TO_EN[path] ?? null) : norm(path);
    const trPath = isTr ? norm(path) : (EN_TO_TR[norm(path)] ?? EN_TO_TR[path] ?? null);

    if (enPath && trPath) {
      const want = {
        en: `${BASE}${enPath}`,
        tr: `${BASE}${trPath}`,
        'x-default': `${BASE}${enPath}`,
      };
      for (const key of ['en', 'tr', 'x-default']) {
        const got = head.alternates[key];
        if (!got) add(url, 'hreflang-missing', key);
        else if (got !== want[key]) add(url, 'hreflang-wrong', `${key}: ${got} ≠ ${want[key]}`);
      }
    } else {
      record.note = 'no-mirror-in-EN_TO_TR (hreflang triplet not required)';
    }
  } catch (err) {
    add(url, 'fetch-error', err.message);
  } finally {
    await page.close();
    results.push(record);
  }
}

await browser.close();

mkdirSync('/tmp/audit', { recursive: true });
writeFileSync('/tmp/audit/new-links.json', JSON.stringify({ results, issues }, null, 2));

const counts = issues.reduce((a, i) => ((a[i.kind] = (a[i.kind] || 0) + 1), a), {});
console.log(`\nCrawled ${URLS.length} URLs.`);
console.log(`Issues: ${issues.length}`, counts);
if (issues.length) {
  for (const i of issues) console.log(`  [${i.kind}] ${i.url} ${i.detail}`);
  process.exit(1);
}
console.log('✅ canonical + hreflang consistent across all newly linked URLs.');
