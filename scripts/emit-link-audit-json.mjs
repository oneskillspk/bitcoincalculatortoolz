#!/usr/bin/env node
/**
 * Emits a combined EN+TR internal-link audit as JSON to
 * public/audit/link-audit.json so the in-app /admin/link-audit page
 * can render thin-link warnings and broken-reference summaries.
 *
 * Read-only: never modifies article sources.
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');
const META_FILE = join(ROOT, 'src/data/articles.ts');
const OUT_DIR = join(ROOT, 'public/audit');
const OUT = join(OUT_DIR, 'link-audit.json');

const routesSrc = readFileSync(ROUTES_FILE, 'utf8');
const calcSlugs = new Set();
for (const m of routesSrc.matchAll(/['"]\/calculators\/([a-z0-9][a-z0-9-]*)['"]\s*:/g)) {
  calcSlugs.add(m[1]);
}

const metaSrc = readFileSync(META_FILE, 'utf8');
const enArticleSlugs = new Set();
const trArticleSlugs = new Set();
// EN rows: { slug: '...', title: ...  (no language field directly after slug)
for (const m of metaSrc.matchAll(/\{\s*slug:\s*'([^']+)'\s*,\s*title:/g)) {
  enArticleSlugs.add(m[1]);
}
// TR rows: { slug: '...', language: 'tr'
for (const m of metaSrc.matchAll(/\{\s*slug:\s*'([^']+)'\s*,\s*language:\s*'tr'/g)) {
  trArticleSlugs.add(m[1]);
}

function extractArray(src, key) {
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

function auditLang({ files, articleSlugs }) {
  const rows = [];
  let broken = 0;
  let thin = 0;
  for (const file of files) {
    const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
    const slug = src.match(/slug:\s*['"]([^'"]+)['"]/)?.[1] ?? file;
    const title =
      src.match(/title:\s*["']((?:\\["']|[^"'])+)["']/)?.[1]?.replace(/\\(['"])/g, '$1') ?? '—';
    const calcs = extractArray(src, 'relatedCalculators');
    const arts = extractArray(src, 'relatedArticles');

    const brokenCalcs = calcs.filter((c) => !calcSlugs.has(c));
    const brokenArts = arts.filter((a) => !articleSlugs.has(a));
    const warnings = [];
    if (calcs.length === 0) warnings.push('no calculators');
    if (arts.length === 0) warnings.push('no articles');
    if (calcs.length > 0 && calcs.length < 3) {
      warnings.push(`thin calcs (${calcs.length})`);
      thin++;
    }
    if (arts.length > 0 && arts.length < 3) {
      warnings.push(`thin articles (${arts.length})`);
      thin++;
    }
    broken += brokenCalcs.length + brokenArts.length;

    rows.push({
      file,
      slug,
      title,
      calcCount: calcs.length,
      artCount: arts.length,
      calcs,
      articles: arts,
      brokenCalcs,
      brokenArticles: brokenArts,
      warnings,
    });
  }
  return { rows, broken, thin };
}

const allFiles = readdirSync(ARTICLES_DIR).sort();
const en = auditLang({
  files: allFiles.filter((f) => f.endsWith('.ts') && !f.endsWith('.tr.ts')),
  articleSlugs: enArticleSlugs,
});
const tr = auditLang({
  files: allFiles.filter((f) => f.endsWith('.tr.ts')),
  articleSlugs: trArticleSlugs,
});

const payload = {
  generatedAt: new Date().toISOString(),
  calculatorSlugCount: calcSlugs.size,
  en: {
    articleCount: en.rows.length,
    brokenReferences: en.broken,
    thinWarnings: en.thin,
    rows: en.rows,
  },
  tr: {
    articleCount: tr.rows.length,
    brokenReferences: tr.broken,
    thinWarnings: tr.thin,
    rows: tr.rows,
  },
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(payload, null, 2));
console.log(
  `[ok] Link audit JSON written to ${OUT}\n` +
    `     EN: ${en.rows.length} articles, ${en.broken} broken, ${en.thin} thin\n` +
    `     TR: ${tr.rows.length} articles, ${tr.broken} broken, ${tr.thin} thin`,
);
