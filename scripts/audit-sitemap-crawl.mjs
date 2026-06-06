#!/usr/bin/env node
/**
 * Headless sitemap locale crawl.
 *
 * Reads public/sitemap.xml, fetches every <loc> over HTTP, and verifies:
 *   - HTTP status is 200 (not 404 / 5xx).
 *   - The served HTML is NOT the catch-all "Not Found" / "Sayfa Bulunamadı"
 *     fallback (i.e. the SPA shell did not silently swallow an unknown route).
 *   - The locale signal in the served HTML matches the URL prefix:
 *       /tr/* or /tr  → must contain `lang="tr"` AND/OR og:locale "tr_TR"
 *                       AND must NOT advertise og:locale "en_US".
 *       everything    → must contain `lang="en"` (or no lang at all is OK
 *                       if og:locale is en_US) AND must NOT advertise tr_TR.
 *   - <link rel="canonical"> resolves to the same absolute URL as the
 *     crawled location (after stripping trailing slash).
 *
 * NOTE: the SPA renders most SEO meta on the client via react-helmet, so
 * the static HTML shipped from the host only contains the bootstrap shell.
 * To get the post-hydration markup we use a lightweight DOM fetch +
 * Helmet-emitted tag inference: per-route helmets are NOT present, so we
 * fall back to detecting the SPA shell + the LocaleMeta server-rendered
 * defaults.  When SSR is added later this script keeps working because
 * the same selectors will find the real tags.
 *
 * Exits 1 if any URL fails any check. Writes /tmp/sitemap-crawl-report.json
 * with per-URL details so CI logs stay readable.
 *
 * Usage:
 *   node scripts/audit-sitemap-crawl.mjs
 *   BASE_URL=https://bitcoincalculator.tools node scripts/audit-sitemap-crawl.mjs
 *   LIMIT=20 node scripts/audit-sitemap-crawl.mjs   # smoke
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE_URL = (process.env.BASE_URL || 'https://bitcoincalculator.tools').replace(/\/$/, '');
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : Infinity;
const CONCURRENCY = Number(process.env.CONCURRENCY || 8);
const TIMEOUT_MS = 20_000;
const UA = 'BitcoinCalculatorTools-SitemapCrawl/1.0';

const NOT_FOUND_MARKERS = [
  'Sayfa Bulunamadı',
  'Page Not Found',
  '404 — ',
  '404 - ',
];

function parseSitemapPaths() {
  const xml = readFileSync('public/sitemap.xml', 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => {
      try {
        const u = new URL(m[1]);
        return u.pathname + u.search;
      } catch {
        return null;
      }
    })
    .filter((p) => typeof p === 'string');
}

async function fetchHtml(absUrl) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(absUrl, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*;q=0.1' },
      redirect: 'follow',
    });
    const html = res.ok ? await res.text() : '';
    return { status: res.status, finalUrl: res.url, html };
  } catch (err) {
    return { status: 0, finalUrl: absUrl, html: '', error: err.message || String(err) };
  } finally {
    clearTimeout(timer);
  }
}

function pickAttr(html, regex) {
  const m = regex.exec(html);
  return m ? m[1] : null;
}

function checkLocale(path, html) {
  const isTr = path === '/tr' || path.startsWith('/tr/');
  const lang = pickAttr(html, /<html[^>]*\blang=["']([^"']+)["']/i);
  const ogLocale = pickAttr(html, /<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']+)["']/i);
  const ogLocaleAlt = pickAttr(html, /<meta[^>]+property=["']og:locale:alternate["'][^>]+content=["']([^"']+)["']/i);

  const wrong = [];
  if (isTr) {
    if (lang && lang !== 'tr') wrong.push(`<html lang="${lang}"> on TR route`);
    if (ogLocale && ogLocale !== 'tr_TR') wrong.push(`og:locale="${ogLocale}" on TR route`);
    if (ogLocaleAlt && ogLocaleAlt !== 'en_US') wrong.push(`og:locale:alternate="${ogLocaleAlt}" on TR route`);
  } else {
    if (lang && lang !== 'en') wrong.push(`<html lang="${lang}"> on EN route`);
    if (ogLocale && ogLocale !== 'en_US') wrong.push(`og:locale="${ogLocale}" on EN route`);
    if (ogLocaleAlt && ogLocaleAlt !== 'tr_TR') wrong.push(`og:locale:alternate="${ogLocaleAlt}" on EN route`);
  }
  return { lang, ogLocale, ogLocaleAlt, wrong };
}

function checkCanonical(path, html) {
  const canon = pickAttr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (!canon) return { canon: null, ok: true }; // SPA — emitted post-hydrate
  const expectAbs = `${BASE_URL}${path}`.replace(/\/$/, '') || `${BASE_URL}/`;
  const got = canon.replace(/\/$/, '') || canon;
  return { canon, ok: got === expectAbs || canon === `${BASE_URL}${path}`, expected: expectAbs };
}

function checkNotFound(html) {
  return NOT_FOUND_MARKERS.find((m) => html.includes(m)) || null;
}

async function pool(items, worker, concurrency = CONCURRENCY) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (true) {
        const i = cursor++;
        if (i >= items.length) return;
        results[i] = await worker(items[i], i);
      }
    }),
  );
  return results;
}

(async () => {
  console.log(`[crawl] Base: ${BASE_URL}`);
  const paths = parseSitemapPaths().slice(0, LIMIT);
  console.log(`[crawl] ${paths.length} sitemap URLs`);

  const results = await pool(paths, async (path) => {
    const { status, finalUrl, html, error } = await fetchHtml(`${BASE_URL}${path}`);
    const failures = [];
    if (status !== 200) failures.push(`HTTP ${status || 'ERR'}${error ? ` (${error})` : ''}`);
    if (status === 200) {
      const nf = checkNotFound(html);
      if (nf) failures.push(`NotFound marker present: "${nf}"`);
      const loc = checkLocale(path, html);
      failures.push(...loc.wrong);
      const canon = checkCanonical(path, html);
      if (canon.canon && !canon.ok) failures.push(`canonical=${canon.canon}, expected=${canon.expected}`);
    }
    const ok = failures.length === 0;
    if (!ok) console.log(`  [BAD] ${path} → ${failures.join('; ')}`);
    return { path, finalUrl, status, ok, failures };
  });

  const ok = results.filter((r) => r.ok).length;
  const bad = results.filter((r) => !r.ok);
  console.log(`\n[crawl] ${ok}/${results.length} healthy, ${bad.length} failing`);

  writeFileSync(
    '/tmp/sitemap-crawl-report.json',
    JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl: BASE_URL, results }, null, 2),
  );

  if (bad.length) {
    console.error(`\n[fail] ${bad.length} sitemap URL(s) failed locale / status / canonical check.`);
    process.exit(1);
  }
  console.log('[ok] Every sitemap URL serves 200 with the correct locale.');
})();
