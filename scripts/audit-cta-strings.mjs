#!/usr/bin/env node
/**
 * Audit calculator CTA strings.
 *
 * Goal: every clickable surface that points at a `/calculators/*` (or TR
 * `/tr/hesaplayicilar/*`) route should use one of the canonical CTA
 * tokens — `t('common.launchCalculator')` or `t('cards.exploreBtn')` —
 * so the site speaks with one voice.
 *
 * This script grep-scans `src/` for Link/Button elements whose `to` /
 * `href` includes a calculator path and flags hardcoded English/Turkish
 * CTA strings that don't match the allow-list.
 *
 * Exit code 0 = clean (or warn-only). Use `--strict` to fail CI.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
const STRICT = process.argv.includes('--strict');

// Canonical CTA labels (post-translation). Anything matching these as a
// literal child is considered NON-canonical because it bypasses t().
const HARDCODED_BAD = [
  /\b(Try|Open|Use|Run|Start|Go to|Launch)\s+(the\s+)?Calculator\b/i,
  /\b(Calculate Now|Get Started)\b/i,
  /\bHesapla(yıcı)?(yı)?\s+(Aç|Başlat|Dene|Kullan)\b/i,
];

const ALLOWED_T_KEYS = new Set([
  'common.launchCalculator',
  'cards.exploreBtn',
]);

const findings = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (name === '__tests__' || name === 'test' || name === 'assets') continue;
      // Article data and FAQ data files contain prose CTAs inside answer
      // text — those are intentional editorial copy, not interactive CTAs.
      if (p.includes('/data/articles')) continue;
      walk(p);
    } else if (['.tsx', '.ts'].includes(extname(name))) {
      scan(p);
    }
  }
}

function scan(path) {
  const src = readFileSync(path, 'utf8');
  if (!/\/calculators\/|\/hesaplayicilar\//.test(src)) return;

  const lines = src.split('\n');
  lines.forEach((line, i) => {
    // Skip FAQ answer / question fields and prose strings — they're copy,
    // not button labels.
    if (/\b(a|q|answer|question|text|content|description)\s*:/i.test(line)) return;
    if (/^\s*["'`]/.test(line)) return;
    for (const re of HARDCODED_BAD) {
      const m = line.match(re);
      if (m) {
        findings.push({
          file: path.replace(ROOT, 'src/'),
          line: i + 1,
          text: line.trim().slice(0, 120),
          match: m[0],
        });
      }
    }
  });
}


walk(ROOT);

if (findings.length === 0) {
  console.log('✓ audit-cta-strings: no hardcoded calculator CTAs found.');
  process.exit(0);
}

console.log(`⚠ audit-cta-strings: ${findings.length} hardcoded CTA(s) detected.`);
console.log(`  Canonical keys: ${[...ALLOWED_T_KEYS].join(', ')}\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}  «${f.match}»`);
  console.log(`      ${f.text}`);
}

process.exit(STRICT ? 1 : 0);
