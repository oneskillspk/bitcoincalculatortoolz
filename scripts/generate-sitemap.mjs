#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from EN_TO_TR (src/utils/localizedRoutes.ts).
 *
 * Per-page <lastmod>:
 *   Each URL's lastmod is derived from `git log -1 --format=%cs` on the
 *   source file(s) that render that route, not a uniform "today" stamp.
 *   Google ignores blanket lastmod dates — per-page dates are the
 *   industry best practice for crawl prioritization.
 *
 * Mapping:
 *   - Static pages → src/pages/<Page>.tsx
 *   - Calculators  → parsed from src/test/trCalculatorRoutes.ts
 *                    (TR path → component → import file)
 *   - Learn        → src/data/articles/<slug>.ts (+ .tr.ts for TR mirror)
 *
 * TR mirrors inherit their EN parent's lastmod, then take max() with
 * their TR-specific source file (e.g. TurkishHome.tsx, .tr.ts article).
 *
 * Flags:
 *   --check   exit 1 if generated XML differs structurally from disk
 *   --strict  exit 1 if any route falls back to "today" (no git history)
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

const BASE = 'https://bitcoincalculator.tools';
const TODAY = new Date().toISOString().slice(0, 10);

// ─── Parse EN_TO_TR ──────────────────────────────────────────────────────────
const routesSrc = readFileSync('src/utils/localizedRoutes.ts', 'utf8');
const mapBody = routesSrc.match(/EN_TO_TR:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/);
if (!mapBody) throw new Error('Could not parse EN_TO_TR from localizedRoutes.ts');
const EN_TO_TR = {};
for (const m of mapBody[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) {
  EN_TO_TR[m[1]] = m[2];
}
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([en, tr]) => [tr, en]));

// ─── Parse calculator TR path → page component file ─────────────────────────
const calcSrc = readFileSync('src/test/trCalculatorRoutes.ts', 'utf8');
const importFile = {}; // ComponentName → 'src/pages/<File>.tsx'
for (const m of calcSrc.matchAll(/import\s+(\w+)\s+from\s+'@\/pages\/([^']+)'/g)) {
  importFile[m[1]] = `src/pages/${m[2]}.tsx`;
}
const trCalcToFile = {}; // '/tr/hesaplayicilar/...' → 'src/pages/...'
for (const m of calcSrc.matchAll(/trPath:\s*'([^']+)'[^}]*page:\s*(\w+)/g)) {
  const file = importFile[m[2]];
  if (file) trCalcToFile[m[1]] = file;
}

// ─── Build EN path → source file(s) map ─────────────────────────────────────
const STATIC_FILES = {
  '/':           ['src/pages/Index.tsx'],
  '/calculators': ['src/pages/Calculators.tsx'],
  '/tools':      ['src/pages/Tools.tsx'],
  '/learn':      ['src/pages/Learn.tsx'],
  '/about':      ['src/pages/About.tsx', 'src/pages/OptimizedAbout.tsx'],
  '/contact':    ['src/pages/Contact.tsx'],
  '/terms':      ['src/pages/Terms.tsx'],
  '/privacy':    ['src/pages/Privacy.tsx'],
  '/sitemap':    ['src/pages/Sitemap.tsx'],
  '/methodology': ['src/pages/Methodology.tsx'],
};
const TR_STATIC_EXTRA = {
  '/tr/':        ['src/pages/TurkishHome.tsx'],
};

function enRouteFiles(enPath) {
  if (STATIC_FILES[enPath]) return STATIC_FILES[enPath].filter(existsSync);
  if (enPath.startsWith('/calculators/')) {
    const trPath = EN_TO_TR[enPath];
    const f = trPath && trCalcToFile[trPath];
    return f && existsSync(f) ? [f] : [];
  }
  if (enPath.startsWith('/learn/')) {
    const slug = enPath.slice('/learn/'.length);
    const f = `src/data/articles/${slug}.ts`;
    return existsSync(f) ? [f] : [];
  }
  return [];
}

function trRouteFiles(trPath) {
  const extra = TR_STATIC_EXTRA[trPath] ? TR_STATIC_EXTRA[trPath].filter(existsSync) : [];
  if (trPath.startsWith('/tr/ogrenin/')) {
    const enPath = TR_TO_EN[trPath];
    if (enPath) {
      const slug = enPath.slice('/learn/'.length);
      const trFile = `src/data/articles/${slug}.tr.ts`;
      if (existsSync(trFile)) extra.push(trFile);
    }
  }
  return extra;
}

// ─── Git lastmod resolver (with fs.mtime fallback) ──────────────────────────
const gitCache = new Map();
function gitDate(file) {
  if (gitCache.has(file)) return gitCache.get(file);
  let date = '';
  try {
    date = execSync(`git log -1 --format=%cs -- "${file}"`, { encoding: 'utf8' }).trim();
  } catch {}
  if (!date && existsSync(file)) {
    // Fallback: filesystem mtime (uncommitted edits)
    date = new Date(statSync(file).mtimeMs).toISOString().slice(0, 10);
  }
  gitCache.set(file, date);
  return date;
}

function maxDate(files) {
  const dates = files.map(gitDate).filter(Boolean);
  return dates.length ? dates.sort().at(-1) : '';
}

// ─── Live-data routes deserve daily changefreq ──────────────────────────────
const DAILY_ROUTES = new Set([
  '/calculators/halving-countdown',
  '/calculators/fear-greed-index',
  '/calculators/on-chain',
  '/calculators/dominance',
  '/calculators/supply',
  '/calculators/drawdown',
  '/calculators/volatility',
  '/calculators/inflation-dashboard',
  '/calculators/bitcoin-converter',
  '/calculators/portfolio-tracker',
]);
const YEARLY_ROUTES = new Set(['/terms', '/privacy']);

function changefreqFor(enPath, fallback) {
  if (DAILY_ROUTES.has(enPath)) return 'daily';
  if (YEARLY_ROUTES.has(enPath)) return 'yearly';
  return fallback || 'weekly';
}

// ─── Read existing sitemap to preserve priority + per-route changefreq ──────
const oldXml = existsSync('public/sitemap.xml') ? readFileSync('public/sitemap.xml', 'utf8') : '';
const oldMeta = {}; // path → { priority, changefreq }
for (const m of oldXml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
  const block = m[1];
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
  const path = loc.replace(BASE, '') || '/';
  oldMeta[path] = {
    changefreq: block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] ?? 'weekly',
    priority:   block.match(/<priority>([^<]+)<\/priority>/)?.[1] ?? '0.5',
  };
}

const NOINDEX = new Set([
  '/terms', '/contact', '/privacy',
  '/tr/kosullar', '/tr/iletisim', '/tr/gizlilik',
]);

// ─── Build entries: EN routes from EN_TO_TR keys ────────────────────────────
const enPaths = [...Object.keys(EN_TO_TR), '/methodology'];

const stats = { resolved: 0, fallback: 0, missing: [] };

function buildEntry(path, files, fallbackMeta) {
  let lastmod = maxDate(files);
  if (!lastmod) {
    stats.fallback++;
    stats.missing.push(path);
    lastmod = TODAY;
  } else {
    stats.resolved++;
  }
  const meta = fallbackMeta ?? { priority: '0.5', changefreq: 'weekly' };
  return {
    path,
    lastmod,
    changefreq: changefreqFor(path, meta.changefreq),
    priority: meta.priority,
  };
}

const enEntries = enPaths
  .filter((p) => !NOINDEX.has(p))
  .map((p) => buildEntry(p, enRouteFiles(p), oldMeta[p]));

const urlBlock = (path, lastmod, changefreq, priority, hreflangs) => {
  const lines = [
    '  <url>',
    `    <loc>${BASE}${path}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
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
  '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  '',
];

// EN block
for (const e of enEntries) {
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

// TR block — inherit EN lastmod, then bump with TR-specific file mtime
for (const e of enEntries) {
  const trPath = EN_TO_TR[e.path];
  if (!trPath || NOINDEX.has(trPath)) continue;
  const trExtra = trRouteFiles(trPath);
  const trLastmod = trExtra.length ? maxDate([...enRouteFiles(e.path), ...trExtra]) || e.lastmod : e.lastmod;
  const trPriority = Math.max(0.3, parseFloat(e.priority) - 0.1).toFixed(1);
  const hreflangs = [
    { lang: 'en', path: e.path },
    { lang: 'tr', path: trPath },
    { lang: 'x-default', path: e.path },
  ];
  out.push(urlBlock(trPath, trLastmod, e.changefreq, trPriority, hreflangs));
  out.push('');
}

out.push('</urlset>');
const generated = out.join('\n');

// ─── --check mode ───────────────────────────────────────────────────────────
const isCheck = process.argv.includes('--check');
const isStrict = process.argv.includes('--strict');

if (isCheck) {
  const current = readFileSync('public/sitemap.xml', 'utf8');
  // Compare structure, ignore lastmod dates (those drift with git history).
  const stripLastmod = (s) => s.replace(/<lastmod>[^<]+<\/lastmod>/g, '<lastmod/>');
  if (stripLastmod(current) !== stripLastmod(generated)) {
    console.error('[error] sitemap drift — public/sitemap.xml is stale.');
    console.error('        Run `node scripts/generate-sitemap.mjs` and commit the result.');
    process.exit(1);
  }
  console.log('[ok] sitemap structure is in sync with EN_TO_TR.');
  process.exit(0);
}

writeFileSync('public/sitemap.xml', generated);

const trCount = enEntries.filter((e) => EN_TO_TR[e.path] && !NOINDEX.has(EN_TO_TR[e.path])).length;
const distinctDates = new Set();
for (const m of generated.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) distinctDates.add(m[1]);
console.log(`[sitemap] wrote ${enEntries.length} EN + ${trCount} TR urls`);
console.log(`[sitemap] lastmod: ${stats.resolved} resolved from git, ${stats.fallback} fallback → ${distinctDates.size} distinct dates`);

if (isStrict && stats.fallback > 0) {
  console.error(`[error] --strict: ${stats.fallback} routes fell back to today (no git history):`);
  for (const p of stats.missing) console.error('  ' + p);
  process.exit(1);
}
