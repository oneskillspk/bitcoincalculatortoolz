#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml so every English route that has a Turkish
 * mirror (per src/utils/localizedRoutes.ts) emits BOTH the EN and TR <url>
 * entries with proper xhtml:hreflang annotations.
 *
 * Run before deploy:  node scripts/generate-sitemap.mjs
 * Also wired into prebuild via package.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://bitcoincalculator.tools';

// Parse EN_TO_TR from the source map without importing TS at runtime
const src = readFileSync('src/utils/localizedRoutes.ts', 'utf8');
const mapBody = src.match(/EN_TO_TR:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/);
if (!mapBody) throw new Error('Could not parse EN_TO_TR from localizedRoutes.ts');
const EN_TO_TR = {};
for (const m of mapBody[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) {
  EN_TO_TR[m[1]] = m[2];
}

// Existing sitemap defines the canonical EN URL list + their priority/freq/lastmod
const oldXml = readFileSync('public/sitemap.xml', 'utf8');
const bump = process.argv.includes('--bump');
const today = new Date().toISOString().slice(0, 10);

// Routes that carry <meta name="robots" content="noindex"> in source —
// must NOT appear in the sitemap (Ahrefs flags this as self-contradictory).
const NOINDEX_PATHS = new Set([
  '/terms', '/contact', '/privacy',
  '/tr/kosullar', '/tr/iletisim', '/tr/gizlilik',
]);

const entries = [];
for (const m of oldXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const block = m[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '';
  const changefreq = block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] ?? 'weekly';
  const priority = block.match(/<priority>([^<]+)<\/priority>/)?.[1] ?? '0.5';
  const path = loc.replace(BASE, '') || '/';
  if (path.startsWith('/tr')) continue; // strip any pre-existing TR entries; we re-emit
  if (NOINDEX_PATHS.has(path)) continue; // skip noindex routes
  entries.push({ path, lastmod: bump ? today : lastmod, changefreq, priority });
}

const urlBlock = (path, lastmod, changefreq, priority, hreflangs) => {
  const lines = [
    '  <url>',
    `    <loc>${BASE}${path}</loc>`,
    `    <lastmod>${lastmod || today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
  ];
  for (const h of hreflangs) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="${h.lang}" href="${BASE}${h.path}"/>`);
  }
  lines.push('  </url>');
  return lines.join('\n');
};

const out = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  '',
];

// Emit EN entries (with hreflang siblings when a TR mirror exists)
for (const e of entries) {
  const trPath = EN_TO_TR[e.path];
  const hreflangs = trPath
    ? [
        { lang: 'en', path: e.path },
        { lang: 'tr', path: trPath },
        { lang: 'x-default', path: e.path },
      ]
    : [];
  out.push(urlBlock(e.path, e.lastmod, e.changefreq, e.priority, hreflangs));
  out.push('');
}

// Emit TR mirrors with the same metadata as their EN parent
for (const e of entries) {
  const trPath = EN_TO_TR[e.path];
  if (!trPath) continue;
  const hreflangs = [
    { lang: 'en', path: e.path },
    { lang: 'tr', path: trPath },
    { lang: 'x-default', path: e.path },
  ];
  // Slightly lower priority so EN remains canonical default
  const trPriority = Math.max(0.3, parseFloat(e.priority) - 0.1).toFixed(1);
  out.push(urlBlock(trPath, e.lastmod, e.changefreq, trPriority, hreflangs));
  out.push('');
}

out.push('</urlset>');
const generated = out.join('\n');

const isCheck = process.argv.includes('--check');
if (isCheck) {
  const current = readFileSync('public/sitemap.xml', 'utf8');
  // Normalize line endings + ignore the auto-stamped `today` lastmod by comparing
  // structural shape (path + hreflang siblings) rather than exact lastmod dates.
  const stripLastmod = (s) => s.replace(/<lastmod>[^<]+<\/lastmod>/g, '<lastmod/>');
  if (stripLastmod(current) !== stripLastmod(generated)) {
    console.error('[error] sitemap drift — public/sitemap.xml is stale.');
    console.error('        Run `node scripts/generate-sitemap.mjs` and commit the result.');
    process.exit(1);
  }
  console.log('[ok] sitemap is in sync with EN_TO_TR.');
  process.exit(0);
}

writeFileSync('public/sitemap.xml', generated);

const enCount = entries.length;
const trCount = entries.filter((e) => EN_TO_TR[e.path]).length;
console.log(`[sitemap] wrote ${enCount} EN + ${trCount} TR urls (with hreflang)`);
