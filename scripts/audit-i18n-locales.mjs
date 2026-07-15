#!/usr/bin/env node
/**
 * i18n locale guard — fails the build when:
 *   1. Any "full" locale (see FULL_LOCALES) is missing keys present in EN.
 *   2. Any source file ships an EN-only aria-label string literal
 *      (multi-word English aria-label="...") outside the allowlist.
 *
 * Stub locales (see STUB_LOCALES) are permitted to be sparse because
 * `src/translations/index.ts` falls back to EN for unresolved keys.
 *
 * Wire this into CI (or `npm run build`) via:
 *   node scripts/audit-i18n-locales.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TRANSLATIONS_DIR = join(ROOT, 'src/translations');

// Locales that MUST have full key parity with EN.
const FULL_LOCALES = ['tr'];
// Locales intentionally shipped as sparse stubs (fall back to EN at runtime).
const STUB_LOCALES = ['es', 'fr', 'de', 'pt', 'ja', 'ko'];

// Files exempt from the aria-label literal check (kept in sync with
// src/test/tr-aria-labels.test.ts).
const ARIA_ALLOWLIST = new Set([
  'src/components/ui/sidebar.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/debug/AffiliateDebugOverlay.tsx',
  'src/components/placement/SlotD_StickyCompanion.tsx',
  'src/pages/Index.tsx',
  'src/pages/TurkishHome.tsx',
  'src/components/motion/SectionNavRail.tsx',
  'src/pages/Methodology.tsx',
  'src/pages/Privacy.tsx',
  'src/components/admin/AdminOverrides.tsx',
  'src/components/affiliateAI/PreFooterEditorialBand.tsx',
]);

// ----- key extraction -------------------------------------------------------

function extractKeys(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const keys = new Set();
  // Matches `'key.name':` or `"key.name":` at start of a dict entry.
  const re = /(^|[\s,{])['"]([a-zA-Z0-9_.\-]+)['"]\s*:/gm;
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[2]);
  return keys;
}

function diffMissingKeys() {
  const enPath = join(TRANSLATIONS_DIR, 'en.ts');
  const enKeys = extractKeys(enPath);
  const report = [];
  for (const loc of FULL_LOCALES) {
    const p = join(TRANSLATIONS_DIR, `${loc}.ts`);
    if (!existsSync(p)) {
      report.push({ locale: loc, missing: [...enKeys] });
      continue;
    }
    const locKeys = extractKeys(p);
    const missing = [...enKeys].filter((k) => !locKeys.has(k));
    if (missing.length) report.push({ locale: loc, missing });
  }
  return report;
}

// ----- aria-label scan ------------------------------------------------------

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(p);
  }
  return out;
}

const LITERAL_RE = /aria-label="([A-Za-z][^"]*\s[^"]+)"/g;

function scanAriaLabels() {
  const violations = [];
  const files = [...walk(join(ROOT, 'src/components')), ...walk(join(ROOT, 'src/pages'))];
  for (const abs of files) {
    const rel = relative(ROOT, abs).replaceAll('\\', '/');
    if (ARIA_ALLOWLIST.has(rel)) continue;
    const src = readFileSync(abs, 'utf8');
    LITERAL_RE.lastIndex = 0;
    let m;
    while ((m = LITERAL_RE.exec(src)) !== null) {
      violations.push(`${rel} — aria-label="${m[1]}"`);
    }
  }
  return violations;
}

// ----- run ------------------------------------------------------------------

const missing = diffMissingKeys();
const aria = scanAriaLabels();

let failed = false;

if (missing.length) {
  failed = true;
  console.error('\n✗ Missing i18n keys:');
  for (const { locale, missing: keys } of missing) {
    console.error(`  [${locale}] ${keys.length} missing key(s):`);
    for (const k of keys.slice(0, 25)) console.error(`    - ${k}`);
    if (keys.length > 25) console.error(`    … and ${keys.length - 25} more`);
  }
}

if (aria.length) {
  failed = true;
  console.error(`\n✗ ${aria.length} EN-only aria-label literal(s) — localize via t('aria.*') or add to ARIA_ALLOWLIST:`);
  for (const v of aria) console.error(`  - ${v}`);
}

if (failed) {
  console.error('\ni18n locale guard FAILED.');
  process.exit(1);
}

console.log(
  `✓ i18n locale guard passed (locales=[${FULL_LOCALES.join(', ')}] full, [${STUB_LOCALES.join(', ')}] stub).`,
);
