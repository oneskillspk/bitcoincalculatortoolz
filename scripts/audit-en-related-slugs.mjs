#!/usr/bin/env node
/**
 * EN related-slug validator — same contract as audit-tr-related-slugs.mjs
 * but for English articles. Fails the build when an EN article file
 * (src/data/articles/*.ts, excluding *.tr.ts) references a related slug
 * that does not resolve.
 *
 * Sources of truth:
 *   - Calculator slugs: EN_TO_TR keys in src/utils/localizedRoutes.ts
 *     (every `/calculators/<slug>` mapping; both EN and TR articles use
 *     the same EN calc slug — TR rendering happens via getLocalizedPath).
 *   - EN article slugs: rows in `articlesMeta` WITHOUT a `language:`
 *     field (the language defaults to 'en').
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');
const META_FILE = join(ROOT, 'src/data/articles.ts');

const routesSrc = readFileSync(ROUTES_FILE, 'utf8');
const calcSlugs = new Set();
for (const m of routesSrc.matchAll(/['"]\/calculators\/([a-z0-9][a-z0-9-]*)['"]\s*:/g)) {
  calcSlugs.add(m[1]);
}

// EN row shape: { slug: '...', title: ...   (no language field between)
const metaSrc = readFileSync(META_FILE, 'utf8');
const enArticleSlugs = new Set();
for (const m of metaSrc.matchAll(/\{\s*slug:\s*'([^']+)'\s*,\s*title:/g)) {
  enArticleSlugs.add(m[1]);
}

const enFiles = readdirSync(ARTICLES_DIR).filter(
  (f) => f.endsWith('.ts') && !f.endsWith('.tr.ts'),
);

const errors = [];
const warnings = [];

function extractArray(src, key) {
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

for (const file of enFiles) {
  const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const calcs = extractArray(src, 'relatedCalculators');
  const arts = extractArray(src, 'relatedArticles');

  for (const c of calcs) {
    if (!calcSlugs.has(c)) {
      errors.push(`${file}  → relatedCalculators: unknown slug '${c}'`);
    }
  }
  for (const a of arts) {
    if (!enArticleSlugs.has(a)) {
      errors.push(`${file}  → relatedArticles: unknown EN slug '${a}'`);
    }
  }
  if (calcs.length === 0) errors.push(`${file}  → relatedCalculators is empty`);
  if (arts.length === 0) errors.push(`${file}  → relatedArticles is empty`);
  if (calcs.length > 0 && calcs.length < 3)
    warnings.push(`${file}  → only ${calcs.length} related calculators (target: ≥3)`);
  if (arts.length > 0 && arts.length < 3)
    warnings.push(`${file}  → only ${arts.length} related articles (target: ≥3)`);
}

if (warnings.length) {
  console.warn(`\n[warn] EN related-slug audit — ${warnings.length} thin links:`);
  warnings.forEach((w) => console.warn('  ' + w));
}

if (errors.length) {
  console.error(`\n[error] EN related-slug audit — ${errors.length} broken references:\n`);
  errors.forEach((e) => console.error('  ' + e));
  console.error(`\nFix each EN article so every related slug exists in EN_TO_TR (calculators)`);
  console.error(`or in articlesMeta (EN articles).\n`);
  process.exit(1);
}

console.log(
  `[ok] EN related-slug audit — ${enFiles.length} EN articles checked against ` +
    `${calcSlugs.size} calculator slugs + ${enArticleSlugs.size} EN article slugs.` +
    (warnings.length ? ` (${warnings.length} warnings)` : ''),
);
