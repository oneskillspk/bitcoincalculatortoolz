#!/usr/bin/env bun
/**
 * i18n Bilingual Consistency Audit
 *
 * Scans result panels, badges, and table label files for
 * untranslated English strings — JSX text or string literals
 * that should likely be wrapped in `isTr ? 'TR' : 'EN'`.
 *
 * Heuristics flagged:
 *   - JSX text node containing >=2 ASCII letters and a space
 *     (e.g. <span>Total Profit</span>) where the file does NOT
 *     wrap the same line in an isTr ternary or a t(...) call.
 *   - String literals passed to known label props (label=, title=,
 *     placeholder=) that are pure English.
 *
 * Files audited:
 *   - src/components/** matching Result*.tsx, *ResultsPanel.tsx,
 *     *ResultPanel.tsx, *ResultCards.tsx, *Badge.tsx, *Row.tsx
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(process.cwd(), 'src/components');
const PATTERN = /(Result.*\.tsx$|ResultsPanel\.tsx$|ResultPanel\.tsx$|ResultCards?\.tsx$|Badge\.tsx$|ResultRow\.tsx$|ResultHero\.tsx$)/;

type Finding = { file: string; line: number; rule: string; snippet: string };
const findings: Finding[] = [];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    if (e === '__tests__' || e === 'node_modules') continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (PATTERN.test(e)) out.push(p);
  }
  return out;
}

// Strings to ignore (UI-meaningless or already universal)
const IGNORE_TEXT = new Set([
  'BTC', 'USD', 'EUR', 'TRY', 'ETH', 'sats', 'sat', 'PDF', 'CSV',
  'btc', 'usd', 'API', 'URL', 'ID', 'OK',
]);

function isLikelyEnglishLabel(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return false;
  if (IGNORE_TEXT.has(trimmed)) return false;
  // Must contain at least one space and only ASCII letters/spaces/punct
  if (!/[A-Za-z]{2,}.*\s.+[A-Za-z]/.test(trimmed)) return false;
  // Skip if it contains template/JSX braces or interpolation
  if (/[{}<>$]/.test(trimmed)) return false;
  // Skip mostly-numeric strings
  if (/^\d/.test(trimmed)) return false;
  // Likely English: starts with capital letter or contains common word
  return /^[A-Z]/.test(trimmed) || /\b(the|of|to|in|and|for|per|with|from|by|as|a|an|is|are|was|were)\b/i.test(trimmed);
}

function audit(file: string): void {
  const src = readFileSync(file, 'utf8');
  const usesIsTr = /\bisTr\b|\buseLanguage\(/.test(src);
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();

    // Skip comments and imports
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('import ')) return;
    // Skip lines already wrapped in isTr/t( on the same line
    if (/\bisTr\s*\?/.test(line) || /\bt\(['"]/.test(line)) return;

    // Rule A — JSX text node like >Total Profit<
    const jsxText = line.match(/>([^<>{}\n]{4,80})</);
    if (jsxText && isLikelyEnglishLabel(jsxText[1])) {
      findings.push({
        file, line: ln,
        rule: usesIsTr ? 'untranslated-jsx-text' : 'no-i18n-in-file',
        snippet: jsxText[1].trim(),
      });
      return;
    }

    // Rule B — label/title/placeholder = "English string"
    const propStr = line.match(/\b(label|title|placeholder|aria-label)=["']([^"'{}\n]{4,80})["']/);
    if (propStr && isLikelyEnglishLabel(propStr[2])) {
      findings.push({
        file, line: ln,
        rule: usesIsTr ? 'untranslated-prop-string' : 'no-i18n-in-file',
        snippet: `${propStr[1]}="${propStr[2]}"`,
      });
    }
  });
}

const files = walk(ROOT);
for (const f of files) audit(f);

const byFile = new Map<string, Finding[]>();
for (const f of findings) {
  const arr = byFile.get(f.file) ?? [];
  arr.push(f); byFile.set(f.file, arr);
}

console.log(`\ni18n bilingual audit — scanned ${files.length} result/badge files\n${'─'.repeat(64)}`);
const sorted = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [file, items] of sorted.slice(0, 25)) {
  console.log(`\n  ${relative(process.cwd(), file)}  (${items.length})`);
  for (const it of items.slice(0, 6)) {
    console.log(`    L${it.line.toString().padStart(4)}  [${it.rule}]  ${it.snippet}`);
  }
  if (items.length > 6) console.log(`    … +${items.length - 6} more`);
}
const byRule = new Map<string, number>();
for (const f of findings) byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
console.log(`\n${'─'.repeat(64)}\nTotal: ${findings.length} suspect strings across ${byFile.size} files`);
for (const [r, n] of byRule) console.log(`  • ${r}: ${n}`);
