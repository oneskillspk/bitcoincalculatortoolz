#!/usr/bin/env node
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const exists = async (path) => access(join(ROOT, path)).then(() => true).catch(() => false);

const app = await readFile(join(ROOT, 'src/App.tsx'), 'utf8');
const sitemap = await readFile(join(ROOT, 'public/sitemap.xml'), 'utf8');
const manifest = JSON.parse(await readFile(join(ROOT, 'public/site.webmanifest'), 'utf8'));
const sw = await readFile(join(ROOT, 'public/sw.js'), 'utf8');

// Exemption lists — kept as named sets so failures can report which list
// matched (or that no list matched, hence the route must be added to the
// sitemap or explicitly exempted).
const POLICY_EXEMPT = new Set(['/contact', '/privacy', '/terms', '/unsubscribe']);
// /admin/link-audit is a developer-only noindex debug page. /tr/iletisim,
// /tr/gizlilik, /tr/kosullar are private. /tr (no trailing slash) resolves
// to TurkishHome but the canonical sitemap entry is /tr/.
// /typography-preview and /qa/state-cards are internal QA pages.
const PRIVATE_EXEMPT = new Set([
  '/admin/link-audit',
  '/tr/iletisim', '/tr/gizlilik', '/tr/kosullar',
  '/tr',
  '/typography-preview', '/qa/state-cards', '/qa/affiliates',
  '/admin', '/admin/login',
  '/status',
]);

const allRouteMatches = [...app.matchAll(/<Route path="([^"]+)"\s+element=\{([^}]+)\}/g)];
const routePaths = allRouteMatches
  .filter((m) => !/LegacyRedirect|Navigate /.test(m[2]))
  .map((m) => m[1])
  .filter((route) => !route.includes(':') && route !== '*' && !route.endsWith('/*') && !route.startsWith('/s/'))
  .filter((route) => !POLICY_EXEMPT.has(route))
  .filter((route) => !PRIVATE_EXEMPT.has(route));

const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/bitcoincalculator\.tools([^<]*)<\/loc>/g)].map((m) => m[1]);
const sitemapSet = new Set(sitemapPaths);

const missingFromSitemap = routePaths.filter((route) => !sitemapSet.has(route));
if (missingFromSitemap.length) {
  console.error(`\n[audit-app-readiness] ${missingFromSitemap.length} route(s) declared in src/App.tsx are missing from public/sitemap.xml:`);
  for (const route of missingFromSitemap) {
    console.error(`  - ${route}`);
    console.error(`      hint: add <url><loc>https://bitcoincalculator.tools${route}</loc>…</url> to public/sitemap.xml,`);
    console.error(`            or add '${route}' to PRIVATE_EXEMPT / POLICY_EXEMPT in scripts/audit-app-readiness.mjs if it should not be indexed.`);
    fail(`Missing sitemap URL for route: ${route}`);
  }
}

// Diagnostic: report which exemption list each excluded route matched, so
// reviewers can see why a route was skipped without re-reading this script.
const allRoutes = allRouteMatches
  .filter((m) => !/LegacyRedirect|Navigate /.test(m[2]))
  .map((m) => m[1])
  .filter((route) => !route.includes(':') && route !== '*' && !route.endsWith('/*') && !route.startsWith('/s/'));
const exemptHits = allRoutes
  .map((r) => {
    if (POLICY_EXEMPT.has(r)) return `  - ${r} → POLICY_EXEMPT`;
    if (PRIVATE_EXEMPT.has(r)) return `  - ${r} → PRIVATE_EXEMPT`;
    return null;
  })
  .filter(Boolean);
if (exemptHits.length) {
  console.log(`\n[audit-app-readiness] ${exemptHits.length} route(s) intentionally excluded from sitemap parity check:`);
  exemptHits.forEach((line) => console.log(line));
}

// Verify EN↔TR sitemap pairing: every TR URL has an hreflang sibling and vice versa
const hreflangCount = (sitemap.match(/<xhtml:link rel="alternate"/g) || []).length;
if (hreflangCount < 100) fail(`Sitemap has only ${hreflangCount} hreflang links — expected EN/TR pairs for every localized route.`);
const trLocCount = sitemapPaths.filter((p) => p.startsWith('/tr')).length;
if (trLocCount < 40) fail(`Sitemap contains only ${trLocCount} /tr URLs — Turkish tree is not fully indexed.`);

// Strict EN_TO_TR ↔ sitemap parity: every mapped pair must appear as a
// <loc> with the full hreflang triplet pointing at exactly those URLs.
const localizedRoutesSrc = await readFile(join(ROOT, 'src/utils/localizedRoutes.ts'), 'utf8');
const enToTrBlock = localizedRoutesSrc.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\};/);
const enToTrPairs = [...(enToTrBlock?.[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g) ?? [])]
  .map((m) => ({ en: m[1], tr: m[2] }));
if (enToTrPairs.length < 50) fail(`Could not parse EN_TO_TR (got ${enToTrPairs.length} entries). Sitemap parity check skipped.`);

const enLocs = new Set(sitemapPaths);
// Private/non-indexed pages: present in EN_TO_TR for in-app locale switching
// but intentionally excluded from sitemap.xml.
const SITEMAP_EXEMPT = new Set([
  '/contact', '/privacy', '/terms', '/unsubscribe',
  '/tr/iletisim', '/tr/gizlilik', '/tr/kosullar',
]);
for (const { en, tr } of enToTrPairs) {
  if (SITEMAP_EXEMPT.has(en) || SITEMAP_EXEMPT.has(tr)) continue;
  // Sitemap stores /tr/ as the homepage but EN_TO_TR also stores /tr/.
  const trLoc = tr;
  if (!enLocs.has(en)) fail(`Sitemap missing EN <loc> for mapped route: ${en}`);
  if (!enLocs.has(trLoc)) fail(`Sitemap missing TR <loc> for mapped route: ${trLoc}`);

  // Each EN <loc> entry must carry the full hreflang triplet.
  const enUrl = `https://bitcoincalculator.tools${en}`;
  const trUrl = `https://bitcoincalculator.tools${trLoc}`;
  const enBlock = sitemap.split('<url>').find((b) => b.includes(`<loc>${enUrl}</loc>`));
  if (enBlock) {
    if (!enBlock.includes(`hreflang="en" href="${enUrl}"`)) fail(`Missing hreflang=en self-link for ${en}`);
    if (!enBlock.includes(`hreflang="tr" href="${trUrl}"`)) fail(`Missing hreflang=tr sibling for ${en} → expected ${trUrl}`);
    if (!enBlock.includes(`hreflang="x-default" href="${enUrl}"`)) fail(`Missing hreflang=x-default for ${en}`);
  }
}

if (manifest.name !== 'Bitcoin Calculator App') warn(`Manifest name is "${manifest.name}"; expected Bitcoin Calculator App.`);
if (manifest.display !== 'standalone') fail('Manifest display must be standalone for app installability.');
if (!manifest.icons?.some((icon) => icon.sizes === '192x192' && icon.purpose?.includes('maskable'))) fail('Missing 192x192 maskable icon.');
if (!manifest.icons?.some((icon) => icon.sizes === '512x512' && icon.purpose?.includes('maskable'))) fail('Missing 512x512 maskable icon.');

for (const asset of ['public/apple-touch-icon.png', 'public/android-chrome-192x192.png', 'public/android-chrome-512x512.png', 'public/social-preview.webp', 'public/offline.html']) {
  if (!(await exists(asset))) fail(`Required app asset missing: ${asset}`);
}

if (!sw.includes('/~oauth')) fail('Service worker must bypass /~oauth routes.');
if (!sw.includes('/offline.html')) fail('Service worker must cache/use branded offline.html.');

if (warnings.length) {
  console.log(`\nApp readiness warnings (${warnings.length}):`);
  warnings.forEach((msg) => console.log(`  • ${msg}`));
}

if (errors.length) {
  console.error(`\nApp readiness errors (${errors.length}):`);
  errors.forEach((msg) => console.error(`  • ${msg}`));
  process.exit(1);
}

console.log('\nApp readiness audit passed.');