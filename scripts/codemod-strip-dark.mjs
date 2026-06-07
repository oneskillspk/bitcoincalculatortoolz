#!/usr/bin/env node
/**
 * Round 2 follow-up: strip stray `dark:` Tailwind utilities (light-only ship,
 * dark theme deferred per docs/audit-2026-06-launch.md §0).
 * Skips shadcn primitives that legitimately ship dual-tone defaults.
 */
import fs from 'node:fs';
import path from 'node:path';

const SKIP = new Set([
  // shadcn primitives — keep their dual-tone defaults; harmless on light-only.
  'src/components/ui/alert.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/field.tsx',
  'src/components/ui/kbd.tsx',
  'src/components/ui/input-group.tsx',
]);

const files = process.argv.slice(2);
let total = 0;
for (const f of files) {
  if (SKIP.has(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  // strip `dark:<class>` tokens including arbitrary values like dark:bg-[#abc]
  // and dark:hover:foo. Conservatively only inside className strings, but a
  // global token-strip is safe because dark: utilities never affect light mode.
  let hits = 0;
  const out = src.replace(/\s+dark:[\w\-./[\]#%():,]+/g, () => { hits++; return ''; });
  if (out !== src) {
    fs.writeFileSync(f, out);
    total += hits;
    console.log(`  ${f}  (${hits})`);
  }
}
console.log(`Stripped ${total} dark: utilities.`);
