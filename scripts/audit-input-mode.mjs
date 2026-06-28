#!/usr/bin/env node
/**
 * Build-time gate: every <input>/<Input> with type="number" must declare
 * inputMode so iOS/Android render the numeric keypad on mobile.
 *
 * Also flags <Input> elements (no explicit type, defaults to text) that
 * are wired to parseLocaleNumber — those must also set inputMode="decimal".
 *
 * Exits non-zero on any violation so CI blocks regressions.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SKIP_DIRS = new Set([
  'node_modules', 'dist', '.git', '__tests__', 'test', 'tests', '__mocks__',
]);
const EXTS = /\.(tsx|jsx)$/;
// Recharts axes also use type="number" — exclude.
const NON_INPUT_TAGS = new Set(['XAxis', 'YAxis', 'ZAxis']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (EXTS.test(entry)) out.push(full);
  }
  return out;
}

const violations = [];

for (const file of walk('src')) {
  const src = readFileSync(file, 'utf8');
  const usesLocaleParser = src.includes('parseLocaleNumber');

  // Scan every JSX opening tag.
  const tagRe = /<([A-Za-z][A-Za-z0-9]*)\b([^<>]*?)\/?>/gs;
  let m;
  while ((m = tagRe.exec(src)) !== null) {
    const [, tag, attrs] = m;
    if (NON_INPUT_TAGS.has(tag)) continue;

    const isInputEl = tag === 'input' || tag === 'Input';
    if (!isInputEl) continue;

    const hasNumberType = /type=["']number["']/.test(attrs);
    const hasInputMode = /\binputMode\b/.test(attrs);
    if (hasNumberType && !hasInputMode) {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${file}:${line}  <${tag} type="number"> missing inputMode`);
      continue;
    }

    // Untyped <Input> used with parseLocaleNumber in same file → likely numeric.
    const hasAnyType = /\btype=/.test(attrs);
    if (!hasAnyType && !hasInputMode && usesLocaleParser && tag === 'Input') {
      const line = src.slice(0, m.index).split('\n').length;
      violations.push(`${file}:${line}  <Input> in locale-numeric file missing inputMode`);
    }
  }
}

if (violations.length) {
  console.error(`\n[error] audit-input-mode: ${violations.length} numeric input(s) missing inputMode:\n`);
  violations.forEach((v) => console.error('  ' + v));
  console.error('\nAdd inputMode="decimal" (default) or inputMode="numeric" (integer-only fields).');
  process.exit(1);
}

console.log('[ok] audit-input-mode: all numeric inputs declare inputMode.');
