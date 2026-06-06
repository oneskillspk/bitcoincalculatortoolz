#!/usr/bin/env node
/**
 * Slug ↔ route parity validator — every slug referenced from
 * `relatedCalculators` / `relatedArticles` (across EN + TR article files)
 * must resolve in BOTH the EN and TR route maps.
 *
 * Calculator slug 'dca' is valid when:
 *   '/calculators/dca'      exists as an EN_TO_TR key, AND
 *   its TR value (e.g. '/tr/hesaplayicilar/...')  exists as the mapped value.
 *
 * Article slug 'bitcoin-halving-explained' is valid when:
 *   '/learn/bitcoin-halving-explained'  exists as an EN_TO_TR key, AND
 *   it has a TR mirror value, AND
 *   both `<slug>.ts` and `<slug>.tr.ts` exist under src/data/articles/.
 *
 * Exits 1 on any missing side.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');

const routesSrc = readFileSync(ROUTES_FILE, 'utf8');
const enToTr = new Map();
for (const m of routesSrc.matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)) {
  enToTr.set(m[1], m[2]);
}

// Collect referenced slugs from every article file, split EN vs TR.
const articleFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.ts'));
const calcRefs = new Map();      // slug → Set<file>   (calc slugs are language-neutral, always EN keys)
const enArticleRefs = new Map(); // EN article slug → Set<file>
const trArticleRefs = new Map(); // TR article slug → Set<file>

function track(map, slug, file) {
  if (!map.has(slug)) map.set(slug, new Set());
  map.get(slug).add(file);
}

function extractArray(src, key) {
  const m = src.match(new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

// Build TR-slug → EN-slug reverse map from EN_TO_TR /learn/ entries.
const trSlugToEn = new Map();
for (const [en, tr] of enToTr) {
  if (en.startsWith('/learn/') && tr.startsWith('/tr/ogrenin/')) {
    trSlugToEn.set(tr.slice('/tr/ogrenin/'.length), en.slice('/learn/'.length));
  }
}

for (const file of articleFiles) {
  const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const isTr = file.endsWith('.tr.ts');
  for (const c of extractArray(src, 'relatedCalculators')) track(calcRefs, c, file);
  for (const a of extractArray(src, 'relatedArticles')) {
    track(isTr ? trArticleRefs : enArticleRefs, a, file);
  }
}

const errors = [];

// ---- Calculator slug parity ----
for (const [slug, refs] of calcRefs) {
  const enPath = `/calculators/${slug}`;
  const trPath = enToTr.get(enPath);
  const sample = [...refs].slice(0, 2).join(', ');
  if (!trPath) {
    errors.push(`Calculator slug '${slug}' has no EN route in EN_TO_TR (used by: ${sample})`);
  } else if (!trPath.startsWith('/tr/')) {
    errors.push(`Calculator slug '${slug}' EN route maps to non-TR path '${trPath}' (used by: ${sample})`);
  }
}

// ---- EN article slug parity ----
function checkArticle(slug, refs) {
  const enPath = `/learn/${slug}`;
  const trPath = enToTr.get(enPath);
  const sample = [...refs].slice(0, 2).join(', ');
  if (!trPath) {
    errors.push(`Article slug '${slug}' has no /learn/ route in EN_TO_TR (used by: ${sample})`);
    return;
  }
  if (!trPath.startsWith('/tr/ogrenin/')) {
    errors.push(`Article slug '${slug}' maps to unexpected TR path '${trPath}' (used by: ${sample})`);
  }
  const enFile = join(ARTICLES_DIR, `${slug}.ts`);
  const trFile = join(ARTICLES_DIR, `${slug}.tr.ts`);
  if (!existsSync(enFile)) errors.push(`Article slug '${slug}' missing EN data file ${slug}.ts (used by: ${sample})`);
  if (!existsSync(trFile)) errors.push(`Article slug '${slug}' missing TR data file ${slug}.tr.ts (used by: ${sample})`);
}

for (const [slug, refs] of enArticleRefs) checkArticle(slug, refs);

// ---- TR article slug parity (resolve TR slug → EN slug via route map) ----
for (const [trSlug, refs] of trArticleRefs) {
  const enSlug = trSlugToEn.get(trSlug);
  const sample = [...refs].slice(0, 2).join(', ');
  if (!enSlug) {
    errors.push(`TR article slug '${trSlug}' has no /tr/ogrenin/ route in EN_TO_TR (used by: ${sample})`);
    continue;
  }
  checkArticle(enSlug, refs);
}

if (errors.length) {
  console.error(`\n[error] Slug ↔ route parity — ${errors.length} broken references:\n`);
  errors.forEach((e) => console.error('  ' + e));
  console.error(
    `\nFix: add the missing EN_TO_TR mapping in src/utils/localizedRoutes.ts and/or create the missing article data files.\n`,
  );
  process.exit(1);
}

console.log(
  `[ok] Slug ↔ route parity — ${calcRefs.size} calculator slugs + ${enArticleRefs.size} EN + ${trArticleRefs.size} TR article slugs resolve in both EN and TR route maps.`,
);
