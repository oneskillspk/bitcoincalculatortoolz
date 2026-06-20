#!/usr/bin/env node
/**
 * Per-page TR i18n coverage report.
 *
 * Scans every calculator page (src/pages/Bitcoin*.tsx, Lump*, Light*, Stack*)
 * and counts:
 *   - inline TR/EN ternaries: `language === 'tr' ? 'TR' : 'EN'`
 *   - t('key') calls
 *   - English JSX text NOT wrapped in either pattern (suspect untranslated)
 *
 * Also cross-checks src/translations/index.ts for EN keys missing TR values.
 *
 * Output: tmp/i18n-tr-coverage.md (committed; rerun after TR work).
 *
 *   node scripts/audit-tr-coverage.mjs
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  checkTitles, checkH1, checkButtons, checkPlaceholders,
  checkAriaLabels, checkBreadcrumbLabels, checkFaqParity,
} from './lib/tr-coverage-checks.mjs';

const PAGES_DIR = 'src/pages';
const OUT = 'tmp/i18n-tr-coverage.md';

const CALC_RE = /^(Bitcoin|Lump|Light|Stack).*Calculator?.*\.tsx$|^BitcoinRainbowChart\.tsx$|^BitcoinInflationDashboard\.tsx$|^BitcoinPortfolioTracker\.tsx$|^BitcoinObituariesTracker\.tsx$|^BitcoinWealthPercentile\.tsx$|^BitcoinConverter\.tsx$/;

const pages = readdirSync(PAGES_DIR).filter((f) => CALC_RE.test(f)).sort();

// --- 1. translations/index.ts parity ---------------------------------------
const transSrc = readFileSync('src/translations/index.ts', 'utf8');
function extractBlock(src, lang) {
  const start = src.indexOf(`  ${lang}: {`);
  if (start === -1) return {};
  let depth = 0;
  let end = start;
  for (let i = start + lang.length + 4; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  const block = src.slice(start, end);
  const keys = {};
  for (const m of block.matchAll(/'([^']+)':\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g)) {
    keys[m[1]] = m[2] ?? m[3] ?? '';
  }
  return keys;
}
const EN = extractBlock(transSrc, 'en');
const TR = extractBlock(transSrc, 'tr');
const missingInTr = Object.keys(EN).filter((k) => !(k in TR));
const echoes = Object.keys(EN).filter((k) => k in TR && EN[k] === TR[k] && EN[k].length > 4);

// --- 2. per-page scan ------------------------------------------------------
const rows = [];
let totalSuspect = 0;
for (const f of pages) {
  const src = readFileSync(join(PAGES_DIR, f), 'utf8');
  const ternaryCount = (src.match(/language\s*===?\s*['"]tr['"]\s*\?/g) || []).length;
  const tCalls = (src.match(/\bt\(['"][\w.-]+['"]\)/g) || []).length;
  const usesLang = /useLanguage\(/.test(src);

  // Suspect: JSX text > 4 chars, looks English, with no TR gate in a ±6-line
  // window (catches multi-line ternaries and `{language === 'tr' && (...)}`
  // blocks that wrap whole sections).
  const lines = src.split('\n');
  const TR_GATE = /language\s*===?\s*['"]tr['"]|\bt\(['"]|isTurkish/;
  // Looks-Turkish heuristic: TR-specific letters or common TR stopwords.
  const LOOKS_TR = /[çğıİöşüÇĞÖŞÜ]|\b(ve|ile|için|bir|bu|şu|kaç|nasıl|nedir|hesaplay)\b/i;
  let suspect = 0;
  const examples = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/>([A-Z][A-Za-z][A-Za-z ,.'\-/&]{5,70})</);
    if (!m) continue;
    const txt = m[1].trim();
    if (/^(BTC|USD|EUR|TRY)$/.test(txt)) continue;
    if (!/\s/.test(txt)) continue;
    if (LOOKS_TR.test(txt)) continue;
    const windowStart = Math.max(0, i - 6);
    const windowEnd = Math.min(lines.length, i + 7);
    const ctx = lines.slice(windowStart, windowEnd).join('\n');
    if (TR_GATE.test(ctx)) continue;
    suspect++;
    if (examples.length < 3) examples.push(txt);
  }
  totalSuspect += suspect;
  rows.push({ file: f, usesLang, ternaryCount, tCalls, suspect, examples });
}

// --- 2b. Strict checks: titles, headings, FAQ data parity -----------------
// CI fails if any of these are violated.
const strict = { enOnlyTitles: [], enOnlyH1: [], faqMissingTr: [], faqLengthMismatch: [] };

// (a) Helmet <title> must branch on language (ternary or t()).
// (b) JSX <h1> must branch on language too (most-prominent page heading).
const TITLE_RE = /<title>([\s\S]*?)<\/title>/g;
const H1_RE = /<h1[^>]*>([\s\S]*?)<\/h1>/g;
for (const f of pages) {
  const src = readFileSync(join(PAGES_DIR, f), 'utf8');
  for (const m of src.matchAll(TITLE_RE)) {
    const body = m[1];
    if (!/language\s*===?\s*['"]tr['"]|\btr\s*\?|\bt\(['"]/.test(body)) {
      strict.enOnlyTitles.push(`${f}: <title>${body.slice(0, 60).trim()}…</title>`);
    }
  }
  for (const m of src.matchAll(H1_RE)) {
    const body = m[1];
    // skip pure expression `{var}` headings (already localized upstream)
    if (/^\s*\{[^}]+\}\s*$/.test(body)) continue;
    if (!/language\s*===?\s*['"]tr['"]|\btr\s*\?|\bt\(['"]/.test(body)) {
      strict.enOnlyH1.push(`${f}: <h1>${body.slice(0, 60).trim()}…</h1>`);
    }
  }
}

// (c) Every FAQ component declaring an EN dataset must declare a TR sibling
// with the same number of `question:` entries.
const FAQ_DIRS = ['src/components', 'src/pages'];
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(e)) out.push(full);
  }
  return out;
}
const FAQ_EN_RE = /\b(faq(?:Data)?_?en|FAQ_EN|faqEn|faqDataEn)\b/i;
const FAQ_TR_RE = /\b(faq(?:Data)?_?tr|FAQ_TR|faqTr|faqDataTr)\b/i;
const allFiles = FAQ_DIRS.flatMap((d) => walk(d));
for (const f of allFiles) {
  const src = readFileSync(f, 'utf8');
  if (!FAQ_EN_RE.test(src)) continue;
  // only care about files that actually render FAQ items (have `question:`)
  if (!/question\s*:/i.test(src)) continue;
  if (!FAQ_TR_RE.test(src)) {
    strict.faqMissingTr.push(f);
    continue;
  }
  // Compare question counts inside the EN vs TR const declaration blocks.
  const blockOf = (name) => {
    const i = src.search(new RegExp(`const\\s+${name}\\s*=\\s*\\[`));
    if (i < 0) return null;
    let depth = 0, end = i;
    for (let k = src.indexOf('[', i); k < src.length; k++) {
      if (src[k] === '[') depth++;
      else if (src[k] === ']') { depth--; if (depth === 0) { end = k; break; } }
    }
    return src.slice(i, end);
  };
  const enName = (src.match(FAQ_EN_RE) || [])[0];
  const trName = (src.match(FAQ_TR_RE) || [])[0];
  const enBlock = enName && blockOf(enName);
  const trBlock = trName && blockOf(trName);
  if (enBlock && trBlock) {
    const enQ = (enBlock.match(/question\s*:/g) || []).length;
    const trQ = (trBlock.match(/question\s*:/g) || []).length;
    if (enQ !== trQ) strict.faqLengthMismatch.push(`${f}: EN=${enQ} TR=${trQ}`);
  }
}


// --- 3. write report -------------------------------------------------------
mkdirSync('tmp', { recursive: true });
const now = new Date().toISOString();
const out = [];
out.push(`# /tr i18n Coverage Report`);
out.push('');
out.push(`Generated: ${now}`);
out.push(`Scanner: \`scripts/audit-tr-coverage.mjs\``);
out.push('');
out.push(`## Translation key parity (\`src/translations/index.ts\`)`);
out.push('');
out.push(`- EN keys: **${Object.keys(EN).length}**`);
out.push(`- TR keys: **${Object.keys(TR).length}**`);
out.push(`- EN keys missing TR value: **${missingInTr.length}**`);
out.push(`- TR values identical to EN (likely untranslated): **${echoes.length}**`);
out.push('');
if (missingInTr.length) {
  out.push('### Missing TR keys');
  out.push('');
  for (const k of missingInTr.slice(0, 50)) out.push(`- \`${k}\``);
  if (missingInTr.length > 50) out.push(`- … +${missingInTr.length - 50} more`);
  out.push('');
}
if (echoes.length) {
  out.push('### TR = EN (suspected untranslated)');
  out.push('');
  for (const k of echoes.slice(0, 30)) out.push(`- \`${k}\` — "${EN[k].slice(0, 60)}"`);
  if (echoes.length > 30) out.push(`- … +${echoes.length - 30} more`);
  out.push('');
}
out.push(`## Per-page coverage`);
out.push('');
out.push(`Total pages scanned: ${pages.length}`);
out.push(`Total suspect English JSX strings (no \`language === 'tr'\` or \`t()\` wrapper on same line): **${totalSuspect}**`);
out.push('');
out.push('| Page | useLanguage | TR ternaries | t() calls | Suspect EN | Examples |');
out.push('|---|---|---:|---:|---:|---|');
for (const r of rows.sort((a, b) => b.suspect - a.suspect)) {
  const ex = r.examples.map((e) => `\`${e.replace(/\|/g, '\\|')}\``).join(' · ');
  out.push(`| ${r.file} | ${r.usesLang ? '✅' : '❌'} | ${r.ternaryCount} | ${r.tCalls} | ${r.suspect} | ${ex} |`);
}
out.push('');
out.push(`---`);
out.push(`Rerun: \`node scripts/audit-tr-coverage.mjs\``);
writeFileSync(OUT, out.join('\n'));
console.log(`✓ Wrote ${OUT}`);
console.log(`  ${pages.length} pages · ${totalSuspect} suspect strings · ${missingInTr.length} missing TR keys · ${echoes.length} echoes`);

// --- 4. Strict gate (CI fails on any violation) ---------------------------
const failures = [];
if (totalSuspect > 0) failures.push(`${totalSuspect} suspect EN JSX string(s)`);
if (missingInTr.length) failures.push(`${missingInTr.length} EN translation key(s) missing TR value`);
if (strict.enOnlyTitles.length) failures.push(`${strict.enOnlyTitles.length} <title> tag(s) without TR branch`);
if (strict.enOnlyH1.length) failures.push(`${strict.enOnlyH1.length} <h1> tag(s) without TR branch`);
if (strict.faqMissingTr.length) failures.push(`${strict.faqMissingTr.length} FAQ component(s) missing TR dataset`);
if (strict.faqLengthMismatch.length) failures.push(`${strict.faqLengthMismatch.length} FAQ EN/TR length mismatch`);

if (failures.length) {
  console.error('\n[error] /tr coverage check FAILED:');
  for (const reason of failures) console.error(`  - ${reason}`);
  if (strict.enOnlyTitles.length) {
    console.error('\nEN-only <title>:'); strict.enOnlyTitles.slice(0, 10).forEach((l) => console.error('  ' + l));
  }
  if (strict.enOnlyH1.length) {
    console.error('\nEN-only <h1>:'); strict.enOnlyH1.slice(0, 10).forEach((l) => console.error('  ' + l));
  }
  if (strict.faqMissingTr.length) {
    console.error('\nFAQ components missing TR dataset:'); strict.faqMissingTr.forEach((l) => console.error('  ' + l));
  }
  if (strict.faqLengthMismatch.length) {
    console.error('\nFAQ EN/TR length mismatch:'); strict.faqLengthMismatch.forEach((l) => console.error('  ' + l));
  }
  process.exit(1);
}
console.log('[ok] /tr coverage strict checks pass.');

