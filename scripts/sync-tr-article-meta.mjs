#!/usr/bin/env node
/**
 * One-off TR metadata sync — rewrites the title/metaDescription fields of
 * `articlesMeta` rows (language: 'tr') in src/data/articles.ts so they
 * mirror the authoritative values inside each `src/data/articles/*.tr.ts`
 * file. Safe to re-run; only the two text fields are touched.
 *
 * Run via: node scripts/sync-tr-article-meta.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const META_FILE = join(ROOT, 'src/data/articles.ts');

const trFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.tr.ts'));

function parseField(src, key) {
  // Match `key: 'value'` OR `key: "value"` OR `key:\n  'value'` across lines.
  const re = new RegExp(`${key}\\s*:\\s*\\n?\\s*['"]((?:\\\\['"]|[^'"])+)['"]`, 'm');
  return src.match(re)?.[1];
}

const updates = new Map(); // slug -> { title, metaDescription }
for (const file of trFiles) {
  const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const slug = parseField(src, 'slug');
  const title = parseField(src, 'title');
  const metaDescription = parseField(src, 'metaDescription');
  if (slug && title && metaDescription) {
    updates.set(slug, { title, metaDescription });
  }
}

let meta = readFileSync(META_FILE, 'utf8');
let changed = 0;

for (const [slug, { title, metaDescription }] of updates) {
  // Find the row for this slug + language: 'tr'
  const rowRe = new RegExp(
    `(\\{\\s*slug:\\s*'${slug.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}'\\s*,\\s*language:\\s*'tr'\\s*,\\s*title:\\s*')((?:\\\\'|[^'])+)('\\s*,\\s*metaDescription:\\s*')((?:\\\\'|[^'])+)(')`,
  );
  const before = meta;
  // The captured TR file values may already contain `\'` escape sequences
  // because we read the file as text. Normalise to raw apostrophes first,
  // then re-escape once when injecting into the single-quoted JS literal.
  const rawTitle = title.replace(/\\'/g, "'");
  const rawDesc = metaDescription.replace(/\\'/g, "'");
  meta = meta.replace(
    rowRe,
    (_, p1, _t, p3, _d, p5) =>
      `${p1}${rawTitle.replace(/'/g, "\\'")}${p3}${rawDesc.replace(/'/g, "\\'")}${p5}`,
  );
  if (meta !== before) changed++;
}

writeFileSync(META_FILE, meta);
console.log(`[ok] TR meta sync — ${changed}/${updates.size} rows refreshed in src/data/articles.ts`);
