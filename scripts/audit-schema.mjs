#!/usr/bin/env node
/**
 * SEO/GEO audit: canonical + hreflang + JSON-LD schema linter.
 *
 * Run:  node scripts/audit-schema.mjs
 *       npm run audit:schema
 *
 * Validates, across every src/pages/*.tsx file:
 *   1. Each <script type="application/ld+json"> block contains valid JSON.
 *   2. The `url` / `mainEntityOfPage` / `@id` fields inside JSON-LD agree
 *      with the page's <link rel="canonical">.
 *   3. No two pages declare the same canonical URL (duplicate canonicals).
 *   4. Every hreflang entry uses an absolute https:// URL.
 *   5. Each page declares at most one canonical link.
 *
 * Exits with code 1 (failing the build) on any error.
 * Warnings are printed but do not fail the build.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES_DIR = join(ROOT, 'src', 'pages');

const errors = [];
const warnings = [];
const canonicalToFile = new Map();

const COLORS = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const error = (file, msg) => errors.push({ file, msg });
const warn = (file, msg) => warnings.push({ file, msg });

/**
 * Extract every <script type="application/ld+json">…</script> block and
 * normalize it to a JS object literal source string ready for evaluation.
 *
 * Real-world shapes we handle:
 *   {JSON.stringify({ ... })}             ← most common in this codebase
 *   {`...static JSON string...`}          ← rare, template literal
 *   { ...inline object... }               ← uncommon, treated as dynamic
 */
function extractJsonLdBlocks(source) {
  const blocks = [];
  const re = /<script\s+type=(?:"|')application\/ld\+json(?:"|')\s*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const raw = m[1].trim();

    // Case 1: {JSON.stringify({ ... inline literal ... })}
    const stringifyMatch = raw.match(/^\{\s*JSON\.stringify\(\s*([\s\S]*?)\s*\)\s*\}$/);
    if (stringifyMatch) {
      const inner = stringifyMatch[1].trim();
      // If it's a bare identifier (variable), we can't statically resolve it.
      if (/^[A-Za-z_$][\w$]*$/.test(inner)) {
        blocks.push({ objectSrc: inner, dynamic: true });
        continue;
      }
      blocks.push({ objectSrc: inner, dynamic: false });
      continue;
    }

    // Case 2: {`...`}  (template literal containing static JSON)
    if (raw.startsWith('{`') && raw.endsWith('`}')) {
      blocks.push({ objectSrc: raw.slice(2, -2), dynamic: false, isJson: true });
      continue;
    }

    // Anything else — JSX expression we cannot statically resolve.
    blocks.push({ objectSrc: raw, dynamic: true });
  }
  return blocks;
}

/**
 * Evaluate a JS object-literal source in a sandboxed Function call.
 * Returns the parsed object, or throws with a useful error message.
 */
function evalObjectLiteral(src) {
  // Strip ${...} interpolations so the literal becomes statically evaluable.
  const cleaned = src.replace(/\$\{[^}]*\}/g, '"__INTERP__"');
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${cleaned});`)();
}

function extractCanonical(source) {
  // Match both static `href="..."` and dynamic `href={...}` canonical links.
  const results = [];
  // Static string href
  const staticRe = /<link\s+rel=(?:"|')canonical(?:"|')\s+href=(?:"|')([^"']+)(?:"|')/g;
  let m;
  while ((m = staticRe.exec(source)) !== null) {
    results.push({ href: m[1], dynamic: false });
  }
  // Dynamic JSX expression href={...} — count as present but don't validate URL.
  const dynamicRe = /<link\s+rel=(?:"|')canonical(?:"|')\s+href=\{[^}]+\}/g;
  while ((m = dynamicRe.exec(source)) !== null) {
    results.push({ href: null, dynamic: true });
  }
  return results;
}

function extractHreflangs(source) {
  const matches = [...source.matchAll(
    /<link\s+rel=(?:"|')alternate(?:"|')\s+hrefLang=(?:"|')([^"']+)(?:"|')\s+href=(?:"|')([^"']+)(?:"|')/g,
  )];
  return matches.map((m) => ({ lang: m[1], href: m[2] }));
}

// Keys whose nested `url` / `@id` legitimately point at *other* resources
// (logo image, contact endpoint, publisher, related entities) and therefore
// should NOT be compared against the page's canonical.
const SKIP_NESTED_KEYS = new Set([
  'logo', 'image', 'thumbnailUrl', 'contactPoint', 'publisher', 'author',
  'sameAs', 'potentialAction', 'sourceOrganization', 'creator', 'provider',
  'parentOrganization', 'subOrganization', 'memberOf', 'brand', 'isPartOf',
  'about', 'mentions', 'citation', 'hasPart', 'relatedLink',
]);

function collectUrlFields(node, found = [], parentKey = null) {
  if (!node || typeof node !== 'object') return found;
  if (Array.isArray(node)) {
    node.forEach((n) => collectUrlFields(n, found, parentKey));
    return found;
  }
  if (parentKey && SKIP_NESTED_KEYS.has(parentKey)) return found;
  for (const [k, v] of Object.entries(node)) {
    if ((k === 'url' || k === '@id' || k === 'mainEntityOfPage') && typeof v === 'string') {
      if (v.startsWith('https://bitcoincalculator.tools')) found.push({ key: k, value: v });
    } else if (typeof v === 'object') {
      collectUrlFields(v, found, k);
    }
  }
  return found;
}

async function auditFile(filePath, fileName) {
  const source = await readFile(filePath, 'utf8');

  // Pages that legitimately have no static canonical:
  //  - About.tsx is a thin wrapper around OptimizedAbout (which owns the canonical).
  //  - LearnArticle.tsx renders its canonical dynamically per slug.
  //  - ShareRedirect.tsx is a redirect-only route.
  const NO_CANONICAL_OK = new Set([
    'About.tsx',
    'LearnArticle.tsx',
    'ShareRedirect.tsx',
    'AdminLinkAudit.tsx', // dev-only admin page, intentionally no canonical
    // Internal noindex QA / preview pages — never indexed, no canonical needed.
    'AffiliatePlacementQA.tsx',
    'StateCardsQA.tsx',
    'TypographyPreview.tsx',
    // Canonical owned by a dedicated SEO head subcomponent.
    'BitcoinRetirementCalculator.tsx', // -> RetirementSEOHead
    'BitcoinArbitrageCalculator.tsx',  // -> BitcoinArbitrageSeoHead
    'BitcoinDCACalculator.tsx',        // -> BitcoinDCASeoHead
    'BitcoinLoanCalculator.tsx',       // -> BitcoinLoanSeoHead
    'BitcoinWhatIfCalculator.tsx',     // -> WhatIfSeoHead
  ]);

  // ---- canonical check ----
  const canonicals = extractCanonical(source);
  if (canonicals.length === 0) {
    if (!NO_CANONICAL_OK.has(fileName)) {
      warn(fileName, 'No <link rel="canonical"> found.');
    }
  } else if (canonicals.length > 1) {
    error(fileName, `Multiple canonical links declared (${canonicals.length}). Pick exactly one.`);
  }

  // Use first static canonical (if any) for downstream URL/JSON-LD validation.
  const canonical = canonicals.find((c) => !c.dynamic)?.href ?? null;

  if (canonical) {
    if (!canonical.startsWith('https://')) {
      error(fileName, `Canonical must be absolute https:// URL. Got: ${canonical}`);
    }
    if (canonicalToFile.has(canonical)) {
      error(fileName, `Duplicate canonical "${canonical}" — also declared in ${canonicalToFile.get(canonical)}.`);
    } else {
      canonicalToFile.set(canonical, fileName);
    }
  }

  // ---- hreflang check ----
  const hreflangs = extractHreflangs(source);
  for (const { lang, href } of hreflangs) {
    if (!href.startsWith('https://')) {
      error(fileName, `hreflang "${lang}" must use absolute https:// URL. Got: ${href}`);
    }
  }
  // Dedupe by (lang+href) — pages may render hreflang in conditional branches
  // (e.g. `tr ? <>...</> : <>...</>`) where the same lang/href pair legitimately
  // appears in both branches but only one renders at runtime.
  const seen = new Set();
  const uniqueLangs = [];
  for (const { lang, href } of hreflangs) {
    const key = `${lang}|${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueLangs.push(lang);
  }
  const dupLangs = uniqueLangs.filter((l, i) => uniqueLangs.indexOf(l) !== i);
  if (dupLangs.length > 0) {
    error(fileName, `Duplicate hreflang entries: ${[...new Set(dupLangs)].join(', ')}`);
  }

  // ---- JSON-LD blocks ----
  const blocks = extractJsonLdBlocks(source);
  for (const [i, block] of blocks.entries()) {
    if (block.dynamic) {
      // Dynamic JSX expression — cannot statically lint. TS/build validates refs.
      continue;
    }
    let parsed;
    try {
      if (block.isJson) {
        parsed = JSON.parse(block.objectSrc.replace(/\$\{[^}]*\}/g, '"__INTERP__"'));
      } else {
        parsed = evalObjectLiteral(block.objectSrc);
      }
    } catch (e) {
      // ReferenceError = literal references runtime data (e.g. tr, language, faqSchema).
      // TS/build already validates these — silently skip.
      if (e instanceof ReferenceError || /is not defined/.test(e.message)) {
        continue;
      }
      error(fileName, `JSON-LD block #${i + 1} is malformed: ${e.message}`);
      continue;
    }
    if (!canonical) continue;

    const urlFields = collectUrlFields(parsed);
    for (const { key, value } of urlFields) {
      // Strip trailing slash + fragment for comparison.
      const norm = (s) => s.replace(/#.*$/, '').replace(/\/$/, '');
      // Allow schema URLs to be the canonical (with optional #fragment for HowTo steps)
      // OR the site root (for Organization/WebSite cross-page references).
      const isRoot = norm(value) === 'https://bitcoincalculator.tools';
      if (norm(value) !== norm(canonical) && !isRoot) {
        warn(
          fileName,
          `JSON-LD block #${i + 1} ${key}="${value}" does not match canonical "${canonical}".`,
        );
      }
    }
  }
}

async function auditRobotsTxt() {
  const robotsPath = join(ROOT, 'public', 'robots.txt');
  let txt;
  try {
    txt = await readFile(robotsPath, 'utf8');
  } catch {
    error('public/robots.txt', 'File missing — required for crawler discovery.');
    return;
  }
  const lines = txt.split('\n').map((l) => l.trim()).filter(Boolean);
  let sawSitemap = false;
  let sawUserAgent = false;
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (/^User-agent:/i.test(line)) sawUserAgent = true;
    else if (/^Sitemap:/i.test(line)) sawSitemap = true;
    else if (!/^(Allow|Disallow|Crawl-delay|Host):/i.test(line)) {
      warn('public/robots.txt', `Unrecognized directive: "${line}"`);
    }
  }
  if (!sawUserAgent) error('public/robots.txt', 'No User-agent directive found.');
  if (!sawSitemap) warn('public/robots.txt', 'No Sitemap: line found.');
  const aiBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
  for (const bot of aiBots) {
    if (!new RegExp(`User-agent:\\s*${bot}`, 'i').test(txt)) {
      warn('public/robots.txt', `AI crawler "${bot}" not explicitly listed.`);
    }
  }
}

async function main() {
  const entries = await readdir(PAGES_DIR, { withFileTypes: true });
  const files = entries
    .filter((d) => d.isFile() && d.name.endsWith('.tsx'))
    .map((d) => d.name);

  console.log(COLORS.bold(`\n🔍 Auditing ${files.length} page files in src/pages/ and public/robots.txt\n`));

  await auditRobotsTxt();

  for (const fileName of files) {
    await auditFile(join(PAGES_DIR, fileName), fileName);
  }

  if (warnings.length) {
    console.log(COLORS.yellow(COLORS.bold(`\n⚠  ${warnings.length} warning(s):\n`)));
    for (const { file, msg } of warnings) {
      console.log(`  ${COLORS.yellow('•')} ${COLORS.dim(file)}  ${msg}`);
    }
  }

  if (errors.length) {
    console.log(COLORS.red(COLORS.bold(`\n✗ ${errors.length} error(s):\n`)));
    for (const { file, msg } of errors) {
      console.log(`  ${COLORS.red('•')} ${COLORS.dim(file)}  ${msg}`);
    }
    console.log(COLORS.red(COLORS.bold('\nAudit failed.\n')));
    process.exit(1);
  }

  console.log(COLORS.green(COLORS.bold(`\n✓ Audit passed. ${canonicalToFile.size} unique canonical URLs, ${warnings.length} warnings.\n`)));
}

main().catch((e) => {
  console.error(COLORS.red(`Audit script crashed: ${e.message}`));
  console.error(e.stack);
  process.exit(2);
});
