#!/usr/bin/env node
/**
 * Sitemap calculator-page validator.
 *
 * For every <url> in public/sitemap.xml whose <loc> matches /calculators/*
 * or /tr/hesaplayicilar/*, assert:
 *   1. The block declares hreflang="en", hreflang="tr", hreflang="x-default".
 *   2. The <loc> appears as one of those alternates (locale-aware canonical).
 *   3. The EN alternate is registered in EN_TO_TR (source of truth).
 *   4. The TR alternate matches EN_TO_TR[en].
 *   5. x-default points at the EN alternate.
 *
 * Exits 1 on any inconsistency. Run via `node scripts/audit-sitemap-calculators.mjs`.
 */
import { readFileSync } from 'node:fs';

const SITEMAP = 'public/sitemap.xml';
const ROUTES = 'src/utils/localizedRoutes.ts';
const BASE = 'https://bitcoincalculator.tools';

const routesSrc = readFileSync(ROUTES, 'utf8');
const mapBlock = routesSrc.match(/EN_TO_TR[^=]*=\s*\{([\s\S]*?)\n\};/);
if (!mapBlock) {
  console.error('✗ Could not parse EN_TO_TR from', ROUTES);
  process.exit(1);
}
const EN_TO_TR = {};
for (const m of mapBlock[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) EN_TO_TR[m[1]] = m[2];

const xml = readFileSync(SITEMAP, 'utf8');
const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);

const issues = [];
let checked = 0;

for (const block of blocks) {
  const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (!loc) continue;
  const path = loc.replace(BASE, '');
  const isCalc = path.startsWith('/calculators/') || path.startsWith('/tr/hesaplayicilar/');
  if (!isCalc) continue;
  checked++;

  const alts = Object.fromEntries(
    [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
  );

  for (const tag of ['en', 'tr', 'x-default']) {
    if (!alts[tag]) issues.push(`${loc}: missing hreflang="${tag}"`);
  }

  if (alts.en && alts.tr && alts.en !== loc && alts.tr !== loc) {
    issues.push(`${loc}: <loc> not present among its own en/tr alternates`);
  }

  if (alts.en) {
    const enPath = alts.en.replace(BASE, '');
    if (!(enPath in EN_TO_TR)) {
      issues.push(`${loc}: EN alternate ${enPath} not in EN_TO_TR map`);
    } else if (alts.tr && EN_TO_TR[enPath] !== alts.tr.replace(BASE, '')) {
      issues.push(`${loc}: TR alternate ${alts.tr} ≠ EN_TO_TR[${enPath}] (${EN_TO_TR[enPath]})`);
    }
  }

  if (alts['x-default'] && alts.en && alts['x-default'] !== alts.en) {
    issues.push(`${loc}: x-default ≠ EN alternate`);
  }
}

if (issues.length) {
  console.error(`✗ audit-sitemap-calculators: ${issues.length} issue(s) across ${checked} calculator URL(s)`);
  for (const i of issues.slice(0, 50)) console.error('  -', i);
  process.exit(1);
}
console.log(`✓ audit-sitemap-calculators: ${checked} calculator URLs — all en/tr/x-default alternates consistent and locale-aware.`);
