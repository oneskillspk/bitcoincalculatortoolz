#!/usr/bin/env node
/**
 * Internal link audit — runs at build time.
 *
 * Walks src/ for every absolute internal reference (`/calculators/...`,
 * `/learn/...`, etc.) and confirms it resolves to either:
 *   - a real <Route> in src/App.tsx, or
 *   - a legacy redirect (<Navigate to=...>), or
 *   - an existing article slug in src/data/articles/.
 *
 * Fails the build on any 404-bound internal href. Treats redirect targets
 * as a *warning* so the team can clean up call sites pointing at legacy
 * URLs even though the redirect protects users.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const app = readFileSync('src/App.tsx', 'utf8');

const directRoutes = new Set(
  [...app.matchAll(/<Route path="([^"]+)" element=\{<(?!Navigate)/g)]
    .map((m) => m[1])
    .filter((r) => !r.includes(':') && r !== '*')
);

const redirects = new Map(
  [...app.matchAll(/<Route path="([^"]+)" element=\{<Navigate to="([^"]+)"/g)]
    .map((m) => [m[1], m[2]])
);

const learnSlugs = new Set(
  readdirSync('src/data/articles/')
    .filter((s) => s.endsWith('.ts'))
    .map((s) => '/learn/' + s.replace(/\.ts$/, ''))
);

// Pull every "/calculators/..." or "/learn/..." substring used in source.
// Exclude App.tsx — its <Route> declarations for legacy redirects would
// otherwise show up as call sites. Uses a Node-native walk so this works
// in CI environments (e.g. Vercel) that don't ship ripgrep.
const SCAN_EXTS = /\.(tsx?|jsx?|md)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '__tests__', 'test', 'tests', '__mocks__']);
const PATTERN = /(\/calculators\/[a-z0-9][a-z0-9_-]*|\/learn\/[a-z0-9][a-z0-9_-]*|\/tr\/hesaplayicilar\/[a-z0-9][a-z0-9_-]*|\/tr\/ogrenin\/[a-z0-9][a-z0-9_-]*|\/tr\/(?:hakkimizda|iletisim|kosullar|gizlilik|araclar|site-haritasi))/g;

// Build a Set of every TR route declared in App.tsx (both real components and Navigate redirects)
const trRoutes = new Set(
  [...app.matchAll(/<Route path="(\/tr[^"]*)"\s+element=/g)].map((m) => m[1])
);

// Dynamic TR route prefixes (e.g. `/tr/ogrenin/:slug` → prefix `/tr/ogrenin/`)
const trDynamicPrefixes = [...trRoutes]
  .filter((r) => r.includes('/:'))
  .map((r) => r.slice(0, r.indexOf('/:') + 1));

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (SCAN_EXTS.test(entry) && full !== join('src', 'App.tsx')) out.push(full);
  }
  return out;
}

const matches = new Set();
for (const file of walk('src')) {
  const content = readFileSync(file, 'utf8');
  for (const m of content.matchAll(PATTERN)) matches.add(m[1]);
}
const refs = [...matches];

const broken = [];
const warnRedirected = [];

for (const r of refs) {
  if (r.startsWith('/calculators/')) {
    if (directRoutes.has(r)) continue;
    if (redirects.has(r)) {
      warnRedirected.push(`${r} → ${redirects.get(r)} (uses legacy redirect)`);
      continue;
    }
    broken.push(r);
  } else if (r.startsWith('/learn/')) {
    if (!learnSlugs.has(r)) broken.push(r);
  } else if (r.startsWith('/tr/')) {
    if (trRoutes.has(r)) continue;
    if (trDynamicPrefixes.some((p) => r.startsWith(p))) continue;
    broken.push(r);
  }
}

if (warnRedirected.length) {
  console.log('\n[warn] Internal links pointing at legacy redirect routes:');
  warnRedirected.sort().forEach((l) => console.log('  ' + l));
}

if (broken.length) {
  console.error('\n[error] Broken internal links (no matching route or article):');
  broken.sort().forEach((l) => console.error('  ' + l));
  process.exit(1);
}

// ----- Phase 9: TR locale parity audit -----
// Every value in EN_TO_TR (the canonical TR mirror map) must resolve to a real
// route or redirect under /tr/* in App.tsx. This catches drift between the
// localizedRoutes table and the actual router declarations without needing
// to crawl pages at runtime.
const localized = readFileSync('src/utils/localizedRoutes.ts', 'utf8');
const enToTrBlock = localized.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\}/);
const trMirrorPaths = enToTrBlock
  ? [...enToTrBlock[1].matchAll(/['"](\/tr[^'"]*)['"]/g)].map((m) => m[1])
  : [];

const missingTrRoutes = trMirrorPaths.filter(
  (p) => !trRoutes.has(p) && !trDynamicPrefixes.some((pre) => p.startsWith(pre))
);
if (missingTrRoutes.length) {
  console.error(
    '\n[error] EN_TO_TR maps to TR paths with no <Route> in App.tsx:'
  );
  [...new Set(missingTrRoutes)].sort().forEach((l) => console.error('  ' + l));
  process.exit(1);
}

console.log(
  `[ok] TR locale parity: ${trMirrorPaths.length} EN_TO_TR mirrors all resolve under /tr/*.`
);
console.log('[ok] Internal link audit clean — every reference resolves.');
