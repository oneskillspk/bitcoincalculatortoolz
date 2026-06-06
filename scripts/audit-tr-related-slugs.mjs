#!/usr/bin/env node
/**
 * TR related-slug validator — fails the build when a `*.tr.ts` article
 * file references a `relatedCalculators` or `relatedArticles` slug that
 * does not resolve to a real calculator route or a registered TR article.
 *
 * Sources of truth:
 *   - Calculator slugs: EN_TO_TR keys in src/utils/localizedRoutes.ts
 *     (every `/calculators/<slug>` mapping).
 *   - TR article slugs: rows in `articlesMeta` with language === 'tr'
 *     inside src/data/articles.ts.
 *
 * Severity:
 *   - Unknown calculator slug    → ERROR (fails build)
 *   - Unknown related-article    → ERROR (fails build)
 *   - 0 calculators OR 0 articles → ERROR
 *   - <3 of either                → WARN (logged, build passes)
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');
const META_FILE = join(ROOT, 'src/data/articles.ts');

// ---- 1. Build calculator-slug set from EN_TO_TR ---------------------------
const routesSrc = readFileSync(ROUTES_FILE, 'utf8');
const calcSlugs = new Set();
for (const m of routesSrc.matchAll(/['"]\/calculators\/([a-z0-9][a-z0-9-]*)['"]\s*:/g)) {
  calcSlugs.add(m[1]);
}

// ---- 2. Build TR article-slug set from articlesMeta ------------------------
const metaSrc = readFileSync(META_FILE, 'utf8');
const trArticleSlugs = new Set();
for (const m of metaSrc.matchAll(/\{\s*slug:\s*'([^']+)'\s*,\s*language:\s*'tr'/g)) {
  trArticleSlugs.add(m[1]);
}

// ---- 3. Walk *.tr.ts article files ----------------------------------------
const trFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.tr.ts'));

const errors = [];
const warnings = [];

function extractArray(src, key) {
  // matches  `relatedCalculators: ['a', 'b']` or with double quotes / newlines
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

for (const file of trFiles) {
  const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const slug = src.match(/slug:\s*'([^']+)'/)?.[1] ?? file;
  const calcs = extractArray(src, 'relatedCalculators');
  const arts = extractArray(src, 'relatedArticles');

  for (const c of calcs) {
    if (!calcSlugs.has(c)) {
      errors.push(`${file}  → relatedCalculators: unknown slug '${c}'`);
    }
  }
  for (const a of arts) {
    if (!trArticleSlugs.has(a)) {
      errors.push(`${file}  → relatedArticles: unknown TR slug '${a}'`);
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
  console.warn(`\n[warn] TR related-slug audit — ${warnings.length} thin links:`);
  warnings.forEach((w) => console.warn('  ' + w));
}

if (errors.length) {
  console.error(`\n[error] TR related-slug audit — ${errors.length} broken references:\n`);
  errors.forEach((e) => console.error('  ' + e));
  console.error(`\nFix each .tr.ts file so every related slug exists in EN_TO_TR (calculators)`);
  console.error(`or in articlesMeta with language: 'tr' (articles).\n`);
  process.exit(1);
}

console.log(
  `[ok] TR related-slug audit — ${trFiles.length} TR articles checked against ` +
    `${calcSlugs.size} calculator slugs + ${trArticleSlugs.size} TR article slugs.` +
    (warnings.length ? ` (${warnings.length} warnings)` : ''),
);
