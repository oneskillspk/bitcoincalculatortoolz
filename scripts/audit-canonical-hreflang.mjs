#!/usr/bin/env node
/**
 * Reads /tmp/audit/http.json + EN_TO_TR from src/utils/localizedRoutes.ts.
 * Asserts canonical match, indexability, <html lang>, hreflang reciprocity
 * and parity with the source-of-truth map. Writes /tmp/audit/hreflang.json.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://bitcoincalculator.tools';
const probes = JSON.parse(readFileSync('/tmp/audit/http.json', 'utf8'));

const src = readFileSync('src/utils/localizedRoutes.ts', 'utf8');
const mapBody = src.match(/EN_TO_TR:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/);
const EN_TO_TR = {};
for (const m of mapBody[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) EN_TO_TR[m[1]] = m[2];
const TR_TO_EN = Object.fromEntries(Object.entries(EN_TO_TR).map(([e, t]) => [t, e]));

const byUrl = Object.fromEntries(probes.map((p) => [p.url, p]));
const issues = [];
const add = (url, kind, detail) => issues.push({ url, kind, detail });

for (const p of probes) {
  if (p.status === 0 || p.status >= 400) continue; // covered by HTTP audit
  const path = p.url.replace(BASE, '') || '/';

  // canonical must equal sitemap loc
  if (!p.canonical) add(p.url, 'canonical-missing', '');
  else if (p.canonical !== p.url) add(p.url, 'canonical-mismatch', `${p.canonical} ≠ ${p.url}`);

  // robots noindex
  if (p.robots && /noindex/i.test(p.robots)) add(p.url, 'noindex', p.robots);

  // <html lang>
  const isTr = path.startsWith('/tr');
  const expectedLang = isTr ? 'tr' : 'en';
  if (!p.htmlLang) add(p.url, 'html-lang-missing', '');
  else if (!p.htmlLang.toLowerCase().startsWith(expectedLang)) add(p.url, 'html-lang-wrong', `${p.htmlLang} (expected ${expectedLang})`);

  // hreflang map vs EN_TO_TR
  const enPath = isTr ? TR_TO_EN[path] : path;
  const trPath = EN_TO_TR[enPath];
  if (trPath) {
    const alt = Object.fromEntries((p.alternates ?? []).map((a) => [a.hreflang, a.href]));
    const want = {
      en: `${BASE}${enPath}`,
      tr: `${BASE}${trPath}`,
      'x-default': `${BASE}${enPath}`,
    };
    for (const k of ['en', 'tr', 'x-default']) {
      if (!alt[k]) add(p.url, 'hreflang-missing', k);
      else if (alt[k] !== want[k]) add(p.url, 'hreflang-wrong', `${k}: ${alt[k]} ≠ ${want[k]}`);
    }
  }
}

// reciprocity: en page's tr alt must declare en back
for (const [enPath, trPath] of Object.entries(EN_TO_TR)) {
  const en = byUrl[`${BASE}${enPath}`];
  const tr = byUrl[`${BASE}${trPath}`];
  if (!en || !tr) continue;
  const enAlt = Object.fromEntries((en.alternates ?? []).map((a) => [a.hreflang, a.href]));
  const trAlt = Object.fromEntries((tr.alternates ?? []).map((a) => [a.hreflang, a.href]));
  if (enAlt.tr && trAlt.en && enAlt.tr !== tr.url) add(en.url, 'reciprocity-broken', `EN→TR points ${enAlt.tr} but TR is ${tr.url}`);
  if (enAlt.tr && trAlt.en && trAlt.en !== en.url) add(tr.url, 'reciprocity-broken', `TR→EN points ${trAlt.en} but EN is ${en.url}`);
}

writeFileSync('/tmp/audit/hreflang.json', JSON.stringify(issues, null, 2));
const counts = issues.reduce((a, i) => ((a[i.kind] = (a[i.kind] || 0) + 1), a), {});
console.log(`[canonical/hreflang] ${issues.length} issues`, counts);
