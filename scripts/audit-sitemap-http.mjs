#!/usr/bin/env node
/**
 * Live HTTP probe for every URL in public/sitemap.xml.
 * Records status, final URL after redirects, canonical, robots meta,
 * <html lang>, and all <link rel=alternate hreflang> tags.
 * Writes /tmp/audit/http.json.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://bitcoincalculator.tools';
const CONCURRENCY = 8;
const TIMEOUT_MS = 15000;

const xml = readFileSync('public/sitemap.xml', 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`[probe] ${urls.length} URLs against ${BASE}`);

const pick = (html, re) => html.match(re)?.[1]?.trim() ?? null;

async function probe(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'BTCCalc-Sitemap-Audit/1.0' },
      signal: ctrl.signal,
    });
    const html = await res.text();
    const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+>/gi)].map((m) => {
      const tag = m[0];
      return {
        hreflang: tag.match(/hreflang=["']([^"']+)["']/i)?.[1] ?? null,
        href: tag.match(/href=["']([^"']+)["']/i)?.[1] ?? null,
      };
    }).filter((a) => a.hreflang);
    return {
      url,
      status: res.status,
      finalUrl: res.url,
      redirected: res.url !== url,
      title: pick(html, /<title[^>]*>([^<]*)<\/title>/i),
      canonical: pick(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i),
      robots: pick(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i),
      htmlLang: pick(html, /<html[^>]+lang=["']([^"']+)["']/i),
      alternates,
    };
  } catch (e) {
    return { url, status: 0, error: String(e?.message ?? e) };
  } finally {
    clearTimeout(t);
  }
}

async function runPool(items, n, worker) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await worker(items[idx]);
      if ((idx + 1) % 25 === 0) console.log(`  ${idx + 1}/${items.length}`);
    }
  }));
  return out;
}

const results = await runPool(urls, CONCURRENCY, probe);
mkdirSync('/tmp/audit', { recursive: true });
writeFileSync('/tmp/audit/http.json', JSON.stringify(results, null, 2));

const by = (pred) => results.filter(pred).length;
console.log(`[probe] done. 2xx=${by((r) => r.status >= 200 && r.status < 300)} 3xx=${by((r) => r.status >= 300 && r.status < 400)} 4xx=${by((r) => r.status >= 400 && r.status < 500)} 5xx=${by((r) => r.status >= 500)} err=${by((r) => r.status === 0)} redirected=${by((r) => r.redirected)}`);
