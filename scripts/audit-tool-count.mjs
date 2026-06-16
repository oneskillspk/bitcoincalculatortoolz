#!/usr/bin/env node
/**
 * Fail CI when user-visible copy advertises a tool count that doesn't
 * match src/config/siteStats.ts LIVE_CALCULATOR_COUNT. Catches the
 * "45+ vs 35+ vs 36" inconsistency the live audit flagged.
 *
 * Allowed: literal numbers inside src/config/siteStats.ts and inside
 * article markdown bodies (src/data/articles/**), which are time-stamped
 * editorial content rather than trust-signal UI.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const stats = readFileSync(join(ROOT, 'src/config/siteStats.ts'), 'utf8');
const m = stats.match(/LIVE_CALCULATOR_COUNT\s*=\s*(\d+)/);
if (!m) {
  console.error('[audit-tool-count] could not parse LIVE_CALCULATOR_COUNT');
  process.exit(1);
}
const expected = Number(m[1]);

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'tmp']);
const SKIP_FILES = new Set([
  'src/config/siteStats.ts',
  'scripts/audit-tool-count.mjs',
]);
const SCAN_EXTS = /\.(tsx?|jsx?|html)$/;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) {
      // Skip article markdown bodies — editorial content, not UI claims.
      if (p.endsWith('/src/data/articles')) continue;
      walk(p, out);
    } else if (SCAN_EXTS.test(e)) out.push(p);
  }
  return out;
}

const re = /(\d{2})\+?\s*(tools|calculators|professional|free tools|purpose-built|hesaplayıcı|ücretsiz araç|araç|professional-grade|Tools|Calculators)/gi;
const offenders = [];

for (const file of walk(join(ROOT, 'src'))) {
  const rel = file.replace(ROOT + '/', '');
  if (SKIP_FILES.has(rel)) continue;
  const src = readFileSync(file, 'utf8');
  let match;
  while ((match = re.exec(src)) !== null) {
    const n = Number(match[1]);
    if (n >= 20 && n <= 99 && n !== expected) {
      const line = src.slice(0, match.index).split('\n').length;
      offenders.push({ file: rel, line, snippet: match[0] });
    }
  }
}

// Also scan index.html
const idx = readFileSync(join(ROOT, 'index.html'), 'utf8');
let m2;
while ((m2 = re.exec(idx)) !== null) {
  const n = Number(m2[1]);
  if (n >= 20 && n <= 99 && n !== expected) {
    const line = idx.slice(0, m2.index).split('\n').length;
    offenders.push({ file: 'index.html', line, snippet: m2[0] });
  }
}

if (offenders.length) {
  console.error(`\n[audit-tool-count] ${offenders.length} stale tool-count claim(s) — expected ${expected}:`);
  for (const o of offenders) console.error(`  ${o.file}:${o.line}  "${o.snippet}"`);
  console.error(`\nFix: update copy to "${expected}+" or import LIVE_CALCULATOR_COUNT_DISPLAY from "@/config/siteStats".`);
  process.exit(1);
}

console.log(`[ok] audit-tool-count clean — every count surface advertises ${expected}+.`);
