#!/usr/bin/env node
/**
 * Production crawl for the 12 URLs touched by the 2026-07 internal-link
 * push. Verifies:
 *   1. 200 OK (indexable, no redirect chain).
 *   2. <link rel="canonical"> self-references the fetched URL.
 *   3. Full hreflang triplet present (en, tr, x-default) and reciprocal
 *      with the EN_TO_TR map in src/utils/localizedRoutes.ts.
 *   4. og:url agrees with canonical.
 *   5. <html lang> matches locale prefix.
 *
 * Usage: node scripts/audit-new-links-hreflang.mjs
 * Exits non-zero on any inconsistency and writes /tmp/audit/new-links.json.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://bitcoincalculator.tools';
const UA = 'lovable-hreflang-audit/1.0';

// Sources + targets from the July 2026 internal-link plan.
const URLS = [
  // Anchor targets
  '/calculators/bitcoin-lot-size',
  '/learn/bitcoin-power-law-explained',
  '/calculators/stack-sats',
  '/calculators/sip',
  '/learn/how-to-calculate-bitcoin-lot-size',
  '/tr/hesaplayicilar/bitcoin-sip',
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
const EN_TO_TR = {};
for (const m of block[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) EN_TO_TR[m[1]] = m[2];
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([e, t]) => [t, e]));

function extractHead(html) {
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ?? null;
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? null;
  const htmlLang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? null;
  const alternates = {};
  for (const m of html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi)) {
    alternates[m[1].toLowerCase()] = m[2];
  }
  // Also match reversed attribute order.
  for (const m of html.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/gi)) {
    alternates[m[1].toLowerCase()] ??= m[2];
  }
  return { canonical, ogUrl, htmlLang, alternates };
}

async function fetchOnce(url) {
  try {
    const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': UA } });
    const status = res.status;
    // Follow one hop for measurement, but flag it.
    let hops = 0;
    let finalUrl = url;
    let finalStatus = status;
    let body = '';
    if (status >= 300 && status < 400) {
      const loc = res.headers.get('location');
      if (loc) {
        hops = 1;
        finalUrl = new URL(loc, url).toString();
        const r2 = await fetch(finalUrl, { redirect: 'manual', headers: { 'User-Agent': UA } });
        finalStatus = r2.status;
        body = r2.status === 200 ? await r2.text() : '';
      }
    } else if (status === 200) {
      body = await res.text();
    }
    return { url, status, hops, finalUrl, finalStatus, body };
  } catch (err) {
    return { url, status: 0, hops: 0, finalUrl: url, finalStatus: 0, body: '', error: err.message };
  }
}

const results = [];
const issues = [];
const add = (url, kind, detail) => issues.push({ url, kind, detail });

for (const path of URLS) {
  const url = `${BASE}${path}`;
  const r = await fetchOnce(url);
  const record = { path, url, status: r.status, hops: r.hops, finalStatus: r.finalStatus };

  if (r.status === 0) {
    add(url, 'fetch-error', r.error);
    results.push(record);
    continue;
  }
  if (r.hops > 0) add(url, 'redirect', `${r.status} → ${r.finalUrl}`);
  if (r.finalStatus !== 200) {
    add(url, 'non-200', String(r.finalStatus));
    results.push(record);
    continue;
  }

  const head = extractHead(r.body);
  Object.assign(record, head);

  // Canonical self-reference
  if (!head.canonical) add(url, 'canonical-missing', '');
  else if (head.canonical !== url) add(url, 'canonical-mismatch', `${head.canonical} ≠ ${url}`);

  // og:url == canonical
  if (head.ogUrl && head.canonical && head.ogUrl !== head.canonical) {
    add(url, 'og-url-mismatch', `${head.ogUrl} ≠ ${head.canonical}`);
  }

  // html lang
  const isTr = path === '/tr' || path === '/tr/' || path.startsWith('/tr/');
  const expectedLang = isTr ? 'tr' : 'en';
  if (!head.htmlLang) add(url, 'html-lang-missing', '');
  else if (!head.htmlLang.toLowerCase().startsWith(expectedLang)) {
    add(url, 'html-lang-wrong', `${head.htmlLang} (expected ${expectedLang})`);
  }

  // hreflang triplet reciprocity via EN_TO_TR
  const norm = (p) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);
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
    // Page has no mapped mirror — that's fine, but note it.
    record.note = 'no-mirror-in-EN_TO_TR';
  }

  results.push(record);
}

mkdirSync('/tmp/audit', { recursive: true });
writeFileSync('/tmp/audit/new-links.json', JSON.stringify({ results, issues }, null, 2));

const counts = issues.reduce((a, i) => ((a[i.kind] = (a[i.kind] || 0) + 1), a), {});
console.log(`Crawled ${URLS.length} URLs.`);
console.log(`Issues: ${issues.length}`, counts);
if (issues.length) {
  for (const i of issues) console.log(`  [${i.kind}] ${i.url} ${i.detail}`);
  process.exit(1);
}
console.log('✅ canonical + hreflang consistent across all newly linked URLs.');
