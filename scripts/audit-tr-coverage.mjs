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
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

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

  // Suspect: JSX text > 4 chars, looks English, on a line WITHOUT ternary/t()
  let suspect = 0;
  const examples = [];
  for (const line of src.split('\n')) {
    if (/language\s*===?\s*['"]tr['"]/.test(line)) continue;
    if (/\bt\(['"]/.test(line)) continue;
    const m = line.match(/>([A-Z][A-Za-z][A-Za-z ,.'\-/&]{5,70})</);
    if (!m) continue;
    const txt = m[1].trim();
    if (/^(BTC|USD|EUR|TRY)$/.test(txt)) continue;
    if (!/\s/.test(txt)) continue;
    suspect++;
    if (examples.length < 3) examples.push(txt);
  }
  totalSuspect += suspect;
  rows.push({ file: f, usesLang, ternaryCount, tCalls, suspect, examples });
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
