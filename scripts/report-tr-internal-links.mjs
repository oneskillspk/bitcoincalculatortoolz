#!/usr/bin/env node
/**
 * TR internal-linking report — writes a Markdown audit to
 * /mnt/documents/tr-internal-links-audit.md listing every TR article with
 * its related calculator and related article counts so gaps are easy to spot.
 *
 * Read-only. Run via: npm run report:tr-links
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, 'src/data/articles');
const ROUTES_FILE = join(ROOT, 'src/utils/localizedRoutes.ts');
const META_FILE = join(ROOT, 'src/data/articles.ts');
const OUT = '/mnt/documents/tr-internal-links-audit.md';

const routesSrc = readFileSync(ROUTES_FILE, 'utf8');
const calcSlugs = new Set();
for (const m of routesSrc.matchAll(/['"]\/calculators\/([a-z0-9][a-z0-9-]*)['"]\s*:/g)) {
  calcSlugs.add(m[1]);
}

const metaSrc = readFileSync(META_FILE, 'utf8');
const trArticleSlugs = new Set();
const trTitles = new Map();
for (const m of metaSrc.matchAll(
  /\{\s*slug:\s*'([^']+)'\s*,\s*language:\s*'tr'\s*,\s*title:\s*'((?:\\'|[^'])+)'/g,
)) {
  trArticleSlugs.add(m[1]);
  trTitles.set(m[1], m[2].replace(/\\'/g, "'"));
}

function extractArray(src, key) {
  const re = new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

const trFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.tr.ts')).sort();

const rows = [];
let totalIssues = 0;
let warnCount = 0;

for (const file of trFiles) {
  const src = readFileSync(join(ARTICLES_DIR, file), 'utf8');
  const slug = src.match(/slug:\s*'([^']+)'/)?.[1] ?? file;
  const title = trTitles.get(slug) ?? src.match(/title:\s*'((?:\\'|[^'])+)'/)?.[1] ?? '—';
  const calcs = extractArray(src, 'relatedCalculators');
  const arts = extractArray(src, 'relatedArticles');

  const issues = [];
  for (const c of calcs) if (!calcSlugs.has(c)) issues.push(`calc \`${c}\` ✗`);
  for (const a of arts) if (!trArticleSlugs.has(a)) issues.push(`article \`${a}\` ✗`);
  if (calcs.length === 0) issues.push('no calculators');
  if (arts.length === 0) issues.push('no articles');
  if (calcs.length > 0 && calcs.length < 3) {
    issues.push(`thin calcs (${calcs.length})`);
    warnCount++;
  }
  if (arts.length > 0 && arts.length < 3) {
    issues.push(`thin articles (${arts.length})`);
    warnCount++;
  }
  totalIssues += issues.length;

  rows.push({
    slug,
    title,
    calcCount: calcs.length,
    calcList: calcs.join(', '),
    artCount: arts.length,
    artList: arts.join(', '),
    issues: issues.length ? issues.join('; ') : '—',
  });
}

const today = new Date().toISOString().slice(0, 10);

let out = `# TR Internal-Linking Audit\n\n`;
out += `_Generated: ${today}_\n\n`;
out += `- **Articles scanned:** ${trFiles.length}\n`;
out += `- **Calculator slugs (source of truth):** ${calcSlugs.size}\n`;
out += `- **TR article slugs (source of truth):** ${trArticleSlugs.size}\n`;
out += `- **Total issues / warnings flagged:** ${totalIssues}\n\n`;
out += `Slugs marked ✗ are broken references — they do not resolve to a valid `;
out += `calculator route (EN_TO_TR) or a registered TR article (articlesMeta).\n\n`;
out += `## Summary table\n\n`;
out += `| Slug | Title | Calcs | Articles | Issues |\n`;
out += `|------|-------|------:|---------:|--------|\n`;
for (const r of rows) {
  const titleEsc = r.title.replace(/\|/g, '\\|');
  out += `| \`${r.slug}\` | ${titleEsc} | ${r.calcCount} | ${r.artCount} | ${r.issues} |\n`;
}

out += `\n## Per-article detail\n\n`;
for (const r of rows) {
  out += `### \`${r.slug}\`\n`;
  out += `**${r.title}**\n\n`;
  out += `- Calculators (${r.calcCount}): ${r.calcList || '—'}\n`;
  out += `- Articles (${r.artCount}): ${r.artList || '—'}\n`;
  if (r.issues !== '—') out += `- ⚠️ ${r.issues}\n`;
  out += `\n`;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out);
console.log(`[ok] TR internal-linking report written to ${OUT}`);
console.log(`     ${trFiles.length} articles, ${totalIssues} issues, ${warnCount} thin-link warnings.`);
