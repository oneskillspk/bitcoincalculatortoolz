#!/usr/bin/env bun
/**
 * Translation audit.
 *
 * Reports:
 *   1. EN keys missing TR equivalents (and vice versa)
 *   2. Components still using inline `isTr ? '...' : '...'` ternaries
 *
 * Exits non-zero when issues are found (suitable for CI).
 *
 * Run: `bun scripts/audit-translations.ts`
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SRC = join(ROOT, 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(p);
  }
  return out;
}

// 1. Compare EN/TR keys --------------------------------------------------------
let translations: Record<string, Record<string, string>> = {};
try {
  // Dynamic import to avoid a hard build-time dep.
  const mod = await import(join(SRC, 'translations/index.ts'));
  translations = mod.translations;
} catch (e) {
  console.error('Could not import src/translations/index.ts:', e);
  process.exit(1);
}

const langs = Object.keys(translations);
const allKeys = new Set<string>();
for (const l of langs) for (const k of Object.keys(translations[l] ?? {})) allKeys.add(k);

const missing: Record<string, string[]> = {};
for (const l of langs) {
  missing[l] = [];
  for (const k of allKeys) {
    if (!(k in (translations[l] ?? {}))) missing[l].push(k);
  }
}

// 2. Inline isTr ternaries -----------------------------------------------------
const files = walk(SRC);
const ternaryHits: Array<{ file: string; line: number; snippet: string }> = [];
const ternaryRe = /\bisTr\s*\?|\blanguage\s*===\s*['"]tr['"]\s*\?/;

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (ternaryRe.test(line)) {
      ternaryHits.push({ file: f.replace(ROOT + '/', ''), line: i + 1, snippet: line.trim().slice(0, 120) });
    }
  });
}

// Report -----------------------------------------------------------------------
let hasIssues = false;

console.log('\n=== Translation key coverage ===');
for (const l of langs) {
  console.log(`  ${l}: ${Object.keys(translations[l] ?? {}).length} keys, missing ${missing[l].length}`);
  if (missing[l].length) {
    hasIssues = true;
    console.log('    First 10 missing:', missing[l].slice(0, 10));
  }
}

console.log(`\n=== Inline isTr ternaries (${ternaryHits.length} occurrences across ${new Set(ternaryHits.map(h => h.file)).size} files) ===`);
const byFile = ternaryHits.reduce<Record<string, number>>((acc, h) => {
  acc[h.file] = (acc[h.file] || 0) + 1;
  return acc;
}, {});
const top = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 20);
for (const [f, n] of top) console.log(`  ${n.toString().padStart(4)}  ${f}`);
if (ternaryHits.length > 0) hasIssues = true;

console.log('');
process.exit(hasIssues ? 1 : 0);
