#!/usr/bin/env node
/**
 * /tr currency audit — static source scan (watchlist mode).
 *
 * Goal: prevent USD ($) from leaking into TRY-formatted UI on /tr/* calculator
 * pages. The codebase is being localized incrementally, so this audit operates
 * on an opt-in watchlist of locale-aware source files. Once a component is
 * made locale-aware (renders ₺ on /tr), add its path to the watchlist; the
 * audit then guards it against future "$" regressions.
 *
 * Files NOT in the watchlist are reported as INFO (informational), never fail
 * the build. Files in the watchlist that contain a stray "$" outside an
 * exempt context fail the build (--strict).
 *
 * Exemptions inside watched files (any one is enough):
 *   1. Source line contains the marker comment  `currency-audit-allow`
 *   2. Source line contains the JSX attribute   `data-currency-exempt`
 *   3. Line is part of a JSON-LD `<script type="application/ld+json">` block
 *      or a single line containing schema.org markers (`"@type"` etc.).
 *   4. Line is a `<meta ... content="...">` head tag.
 *   5. The "$" is part of a template-literal interpolation `${...}`.
 *
 * Pair this with the runtime DOM check in
 * src/test/tr-e2e-extended.test.tsx (Phase 9.2) which prunes
 * [data-currency-exempt="true"] subtrees and asserts no "$" remains.
 *
 * Configure:
 *   scripts/.tr-currency-watchlist.json   — files the audit enforces
 *   scripts/.tr-currency-allowlist.json   — files explicitly exempt (legacy)
 *
 * Usage:
 *   node scripts/audit-tr-currency.mjs            # warn-only
 *   node scripts/audit-tr-currency.mjs --strict   # fail build on watchlist
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const STRICT = process.argv.includes('--strict');

const TIERS_PATH     = 'scripts/.tr-currency-tiers.json';
const WATCHLIST_PATH = 'scripts/.tr-currency-watchlist.json';
const ALLOWLIST_PATH = 'scripts/.tr-currency-allowlist.json';

const loadList = (path) => {
  if (!existsSync(path)) return new Set();
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.files) ? raw.files : [];
    return new Set(arr);
  } catch (e) {
    console.error(`[warn] Could not parse ${path}: ${e.message}`);
    return new Set();
  }
};

// Tiered config (preferred). Falls back to legacy watchlist if tiers file missing.
const loadTiers = () => {
  if (existsSync(TIERS_PATH)) {
    try {
      const raw = JSON.parse(readFileSync(TIERS_PATH, 'utf8'));
      return {
        strict: new Set(raw.strict || []),
        soft:   new Set(raw.soft   || []),
        tracked: new Set(raw.tracked || []),
      };
    } catch (e) {
      console.error(`[warn] Could not parse ${TIERS_PATH}: ${e.message}`);
    }
  }
  return { strict: loadList(WATCHLIST_PATH), soft: new Set(), tracked: new Set() };
};

const TIERS     = loadTiers();
const ALLOWLIST = loadList(ALLOWLIST_PATH);

if (TIERS.strict.size === 0 && TIERS.soft.size === 0) {
  console.log(`[ok] /tr currency audit skipped — empty tiers at ${TIERS_PATH}.`);
  process.exit(0);
}

function stripInterpolations(line) {
  let out = '';
  let i = 0;
  while (i < line.length) {
    if (line[i] === '$' && line[i + 1] === '{') {
      let depth = 1;
      i += 2;
      while (i < line.length && depth > 0) {
        if (line[i] === '{') depth++;
        else if (line[i] === '}') depth--;
        i++;
      }
    } else {
      out += line[i];
      i++;
    }
  }
  return out;
}

const isJsonLdMarker = (l) =>
  /"@type"|"@context"|"acceptedAnswer"|"mainEntity"|application\/ld\+json/.test(l);
const isMetaTag = (l) => /<meta\s/.test(l);
const isExempt = (l) =>
  l.includes('currency-audit-allow') ||
  l.includes('data-currency-exempt') ||
  isJsonLdMarker(l) ||
  isMetaTag(l);

// Per-file scan returning violation objects (line + snippet).
const scanFile = (file) => {
  if (!existsSync(file)) {
    console.error(`[error] tier-listed file missing: ${file}`);
    return null;
  }
  const out = [];
  const lines = readFileSync(file, 'utf8').split('\n');
  let inJsonLd = false;
  for (let n = 0; n < lines.length; n++) {
    const raw = lines[n];
    if (/<script[^>]*application\/ld\+json/.test(raw)) inJsonLd = true;
    const exemptByBlock = inJsonLd;
    if (/<\/script>/.test(raw)) inJsonLd = false;
    if (exemptByBlock) continue;
    if (isExempt(raw)) continue;
    const cleaned = stripInterpolations(raw);
    if (!cleaned.includes('$')) continue;
    const trimmed = cleaned.trim();
    if (
      trimmed.startsWith('import ') ||
      trimmed.startsWith('export ') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('*')
    ) continue;
    out.push({ file, line: n + 1, snippet: raw.replace(/\s+/g, ' ').trim().slice(0, 200) });
  }
  return out;
};

const strictViolations = [];
const softViolations   = [];

for (const file of TIERS.strict) {
  if (ALLOWLIST.has(file)) continue;
  const v = scanFile(file);
  if (v === null) { if (STRICT) process.exit(1); continue; }
  strictViolations.push(...v);
}
for (const file of TIERS.soft) {
  if (ALLOWLIST.has(file)) continue;
  const v = scanFile(file);
  if (v === null) continue;
  softViolations.push(...v);
}

const reportGroup = (label, vs, level) => {
  if (vs.length === 0) return;
  console[level](`\n[${level}] /tr currency audit (${label}) — ${vs.length} stray "$" leak(s):`);
  const byFile = new Map();
  for (const v of vs) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v);
  }
  for (const [file, fv] of [...byFile.entries()].sort()) {
    console[level](`  ${file} (${fv.length})`);
    for (const v of fv.slice(0, 5)) console[level](`    L${v.line}: ${v.snippet}`);
    if (fv.length > 5) console[level](`    … +${fv.length - 5} more`);
  }
};

reportGroup('soft',   softViolations,   'warn');
reportGroup('strict', strictViolations, STRICT ? 'error' : 'warn');

if (strictViolations.length === 0 && softViolations.length === 0) {
  console.log(
    `[ok] /tr currency audit clean — ${TIERS.strict.size} strict + ${TIERS.soft.size} soft file(s), no stray "$".`
  );
  process.exit(0);
}

if (strictViolations.length > 0) {
  console[STRICT ? 'error' : 'warn'](
    `\nTo exempt: add  data-currency-exempt="true"  on the wrapping element,\n` +
    `add a  // currency-audit-allow  comment on the line, or list the file in\n` +
    `${ALLOWLIST_PATH}.`
  );
  if (STRICT) process.exit(1);
}

