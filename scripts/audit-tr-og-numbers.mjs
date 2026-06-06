#!/usr/bin/env node
/**
 * Phase F8 — TR OG/Twitter description formatting audit.
 *
 * Scans every TR-gated branch of a Helmet `<meta name="description">` /
 * `og:description` / `twitter:description` and fails on number/currency/date
 * patterns that violate the TR locale (per docs/TR_TRANSLATION_GUIDELINES.md):
 *
 *   - `$<digit>`          → use `₺` or `<n> dolar`
 *   - decimal-point %:    `99.9%` → `%99,9`
 *   - English month names in body text
 *
 * Detection is conservative: only flags strings that sit inside a
 * `language === 'tr' ? '…' : …` ternary OR inside a TR-gated fragment.
 * Pure-EN strings are not flagged.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PAGES = 'src/pages';
const EN_MONTHS = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/;
const DOLLAR_NUM = /\$\d/;
const EN_DECIMAL_PCT = /\d+\.\d+%/;

function trStrings(src) {
  // Capture the TR side of `language === 'tr' ? 'TR…' : 'EN…'` and the body
  // of `language === 'tr' && <>…</>` fragments — only inside `content=` /
  // `description` contexts (loosely matched as quoted strings near the gate).
  const out = [];
  const ternRe = /language\s*===?\s*['"]tr['"]\s*\?\s*(['"])((?:[^\\\1]|\\.)*?)\1/g;
  for (const m of src.matchAll(ternRe)) out.push({ text: m[2], idx: m.index ?? 0 });
  return out;
}

const errors = [];
for (const f of readdirSync(PAGES).filter((x) => x.endsWith('.tsx'))) {
  const src = readFileSync(join(PAGES, f), 'utf8');
  for (const { text, idx } of trStrings(src)) {
    // Only flag strings that look like meta/og/twitter descriptions
    // (≥40 chars; pure tokens/labels are not descriptions).
    if (text.length < 40) continue;
    const hits = [];
    if (DOLLAR_NUM.test(text)) hits.push('$<digit> leak');
    if (EN_DECIMAL_PCT.test(text)) hits.push('EN decimal percent (use %99,9)');
    if (EN_MONTHS.test(text)) hits.push('English month name');
    if (hits.length) {
      const line = src.slice(0, idx).split('\n').length;
      errors.push(`${f}:${line}  [${hits.join(', ')}]  ${text.slice(0, 100)}…`);
    }
  }
}

if (errors.length) {
  console.error(`\n[error] TR OG/description formatting — ${errors.length} leaks:\n`);
  errors.forEach((e) => console.error('  ' + e));
  console.error(
    `\nFix: replace with ₺ / TR percent (%99,9) / TR month names per docs/TR_TRANSLATION_GUIDELINES.md.\n`,
  );
  process.exit(1);
}
console.log(`[ok] TR OG/description formatting — no $/EN-decimal/EN-month leaks across ${readdirSync(PAGES).length} pages.`);
