#!/usr/bin/env node
/**
 * Phase E6 — Informational orphan detector for TR translation keys.
 *
 * Walks the `tr` namespace inside src/translations/index.ts (and any sibling
 * .ts files in src/translations/) and reports keys that are never referenced
 * via `t('key')` / `t("key")` in the src/ tree.
 *
 * Soft check: writes a report to tmp/i18n-tr-key-orphans.md and exits 0
 * regardless of findings.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const TRANS_FILE = 'src/translations/index.ts';
const SRC = 'src';
const REPORT = 'tmp/i18n-tr-key-orphans.md';

const tsrc = readFileSync(TRANS_FILE, 'utf8');
// Crude TR block extract: from `tr: {` to its matching closing `}` (depth scan).
const trIdx = tsrc.search(/\btr\s*:\s*\{/);
if (trIdx === -1) {
  console.log('[orphans] no `tr:` namespace found, exiting.');
  process.exit(0);
}
let depth = 0;
let start = tsrc.indexOf('{', trIdx);
let end = start;
for (let i = start; i < tsrc.length; i++) {
  const c = tsrc[i];
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
}
const trBlock = tsrc.slice(start, end + 1);
const keys = [...trBlock.matchAll(/['"]([a-zA-Z0-9_.-]+)['"]\s*:/g)].map((m) => m[1]);
const unique = [...new Set(keys)];

// Walk src/ for t('key') / t("key") usage
const SKIP = new Set(['node_modules', 'dist', '.git', '__tests__', 'test', 'translations']);
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    if (SKIP.has(e)) continue;
    const full = join(d, e);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(e)) files.push(full);
  }
})(SRC);

const used = new Set();
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]/g)) used.add(m[1]);
}

const orphans = unique.filter((k) => !used.has(k)).sort();

try { mkdirSync('tmp', { recursive: true }); } catch {}
const md = [
  '# TR translation-key orphans (informational)',
  '',
  `Scanned ${unique.length} TR keys; ${orphans.length} have no \`t('key')\` reference in src/.`,
  '',
  ...orphans.map((k) => `- \`${k}\``),
  '',
].join('\n');
writeFileSync(REPORT, md);
console.log(`[orphans] ${orphans.length}/${unique.length} TR keys appear unused — see ${REPORT}`);
