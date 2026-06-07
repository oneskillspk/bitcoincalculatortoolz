#!/usr/bin/env node
/**
 * Round 2 codemod: replace raw Tailwind palette literals with semantic tokens
 * (warning / success / destructive / info) on calculator pages & components.
 *
 * Scope rules:
 *  - Skip files that intentionally use the full palette as data/category tints
 *    (RelatedCalculators, purchasingPowerCalculator, lightning Visualizations,
 *     RiskRewardVisualization, chart components).
 *  - Skip src/services/* except where they emit CSS class strings for UI badges.
 *
 * Mapping (verified against tokens in src/index.css + tailwind.config.ts):
 *    amber/yellow      -> warning
 *    emerald/green     -> success
 *    red/rose          -> destructive
 *    blue/sky/cyan/indigo (only in known warning-callout contexts) -> info
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const SKIP = new Set([
  'src/components/RelatedCalculators.tsx',
  'src/services/purchasingPowerCalculator.ts',
  'src/components/lightning/RouteFinderVisualization.tsx',
  'src/components/lightning/FeeEconomicsVisualization.tsx',
  'src/components/leverage/RiskRewardVisualization.tsx',
  'src/components/halving/HalvingProjection.tsx',
  'src/services/accumulationScoreService.ts',
  'src/lib/chartTokenGuard.ts',
  'src/lib/brandColors.ts',
]);

// Order matters — replace specific shade combos before generic ones.
const RULES = [
  // ---- warning (amber / yellow) ----
  [/\bbg-(amber|yellow)-(50|100)\b/g, 'bg-warning-soft'],
  [/\bbg-(amber|yellow)-(500|600|700)\/(\d{1,2})\b/g, 'bg-warning/$3'],
  [/\bborder-(amber|yellow)-(100|200|300)\b/g, 'border-warning/30'],
  [/\bborder-(amber|yellow)-(400|500|600|700)\b/g, 'border-warning'],
  [/\bborder-(amber|yellow)-(500|600)\/(\d{1,2})\b/g, 'border-warning/$3'],
  [/\btext-(amber|yellow)-(50|100|200|300|400|500)\b/g, 'text-warning'],
  [/\btext-(amber|yellow)-(600|700)\b/g, 'text-warning'],
  [/\btext-(amber|yellow)-(800|900)\b/g, 'text-warning-foreground'],
  [/\bring-(amber|yellow)-(400|500|600)\b/g, 'ring-warning'],
  [/\bfill-(amber|yellow)-(400|500|600)\b/g, 'fill-warning'],
  [/\bdark:bg-(amber|yellow)-(800|900|950)\/?(\d{0,2})\b/g, 'dark:bg-warning/20'],
  [/\bdark:text-(amber|yellow)-(200|300|400)\b/g, 'dark:text-warning'],
  [/\bdark:border-(amber|yellow)-(700|800|900)\b/g, 'dark:border-warning/40'],

  // ---- success (emerald / green) ----
  [/\bbg-(emerald|green)-(50|100)\b/g, 'bg-success-soft'],
  [/\bbg-(emerald|green)-(500|600|700)\/(\d{1,2})\b/g, 'bg-success/$3'],
  [/\bborder-(emerald|green)-(100|200|300)\b/g, 'border-success/30'],
  [/\bborder-(emerald|green)-(400|500|600|700)\b/g, 'border-success'],
  [/\btext-(emerald|green)-(50|100|200|300|400|500)\b/g, 'text-success'],
  [/\btext-(emerald|green)-(600|700|800|900)\b/g, 'text-success'],
  [/\bring-(emerald|green)-(400|500|600)\b/g, 'ring-success'],
  [/\bfill-(emerald|green)-(400|500|600)\b/g, 'fill-success'],
  [/\bdark:bg-(emerald|green)-(800|900|950)\/?(\d{0,2})\b/g, 'dark:bg-success/20'],
  [/\bdark:text-(emerald|green)-(200|300|400)\b/g, 'dark:text-success'],
  [/\bdark:border-(emerald|green)-(700|800|900)\b/g, 'dark:border-success/40'],

  // ---- destructive (red / rose) ----
  [/\bbg-(red|rose)-(50|100)\b/g, 'bg-destructive-soft'],
  [/\bbg-(red|rose)-(500|600|700)\/(\d{1,2})\b/g, 'bg-destructive/$3'],
  [/\bborder-(red|rose)-(100|200|300)\b/g, 'border-destructive/30'],
  [/\bborder-(red|rose)-(400|500|600|700)\b/g, 'border-destructive'],
  [/\btext-(red|rose)-(50|100|200|300|400|500)\b/g, 'text-destructive'],
  [/\btext-(red|rose)-(600|700|800|900)\b/g, 'text-destructive'],
  [/\bring-(red|rose)-(400|500|600)\b/g, 'ring-destructive'],
  [/\bfill-(red|rose)-(400|500|600)\b/g, 'fill-destructive'],
  [/\bdark:bg-(red|rose)-(800|900|950)\/?(\d{0,2})\b/g, 'dark:bg-destructive/20'],
  [/\bdark:text-(red|rose)-(200|300|400)\b/g, 'dark:text-destructive'],
  [/\bdark:border-(red|rose)-(700|800|900)\b/g, 'dark:border-destructive/40'],
];

const exts = new Set(['.ts', '.tsx']);
let changed = 0;
let scannedFiles = 0;
let touchedFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__tests__' || entry.name === 'test') continue;
      walk(p);
    } else if (exts.has(path.extname(entry.name))) {
      const rel = path.relative('.', p);
      if (SKIP.has(rel)) continue;
      scannedFiles++;
      const src = fs.readFileSync(p, 'utf8');
      let out = src;
      let fileHits = 0;
      for (const [re, repl] of RULES) {
        out = out.replace(re, (...args) => {
          fileHits++;
          return typeof repl === 'function' ? repl(...args) : repl;
        });
      }
      if (out !== src) {
        fs.writeFileSync(p, out);
        changed += fileHits;
        touchedFiles.push(`${rel}  (${fileHits})`);
      }
    }
  }
}

walk(ROOT);
console.log(`Scanned ${scannedFiles} files. Replacements: ${changed}. Files touched: ${touchedFiles.length}`);
for (const t of touchedFiles) console.log('  ' + t);
