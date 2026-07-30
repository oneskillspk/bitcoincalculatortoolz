#!/usr/bin/env node
/**
 * Diff sitemap entries vs <Route path=...> declarations in src/App.tsx.
 * Ghosts = in sitemap, not in router (404 risk).
 * Orphans = public indexable route, not in sitemap.
 * Writes /tmp/audit/router-diff.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://bitcoincalculator.tools';
const ALLOW_NOT_IN_SITEMAP = [
  /^\/lovable(\/|$)/,
  /^\/admin/,
  /^\/share\//,
  /^\/qa\//,
  /^\/typography-preview$/,
  /^\/status$/,
  /^\/not-found$/,
  /^\*$/,
  /^\/$/, // covered separately
  /^\/unsubscribe$/, // noindex utility page
  /^\/tr\/\*$/, // TR 404 catch-all
  /^\/\.lovable\//, // platform routes
];

const app = readFileSync('src/App.tsx', 'utf8');
const routePaths = new Set();
for (const m of app.matchAll(/<Route\s+path=["']([^"']+)["'][^>]*element=\{<\s*Navigate/g)) {
  // skip redirects from router list (they shouldn't be in sitemap)
}
const redirectPaths = new Set();
for (const m of app.matchAll(/<Route\s+path=["']([^"']+)["'][^>]*element=\{<\s*(?:Navigate|LegacyRedirect)[^>]*to=["']([^"']+)["']/g)) {
  redirectPaths.add(m[1]);
}
for (const m of app.matchAll(/<Route\s+path=["']([^"']+)["']/g)) {
  routePaths.add(m[1]);
}

const xml = readFileSync('public/sitemap.xml', 'utf8');
const sitemapPaths = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(BASE, '') || '/'));

const ghosts = [];
for (const p of sitemapPaths) {
  if (routePaths.has(p)) continue;
  // also allow parameterized matches like /share/:id
  const matched = [...routePaths].some((r) => {
    if (!r.includes(':')) return false;
    const re = new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$');
    return re.test(p);
  });
  if (!matched) ghosts.push(p);
}

const orphans = [];
for (const r of routePaths) {
  if (r.includes(':') || r === '*') continue;
  if (sitemapPaths.has(r)) continue;
  if (redirectPaths.has(r)) continue;
  if (ALLOW_NOT_IN_SITEMAP.some((re) => re.test(r))) continue;
  orphans.push(r);
}

mkdirSync('/tmp/audit', { recursive: true });
writeFileSync('/tmp/audit/router-diff.json', JSON.stringify({ ghosts, orphans, redirectPaths: [...redirectPaths] }, null, 2));
console.log(`[router] ghosts=${ghosts.length} orphans=${orphans.length} redirects=${redirectPaths.size}`);
if (ghosts.length) console.log('  ghosts:', ghosts);
if (orphans.length) console.log('  orphans:', orphans);
