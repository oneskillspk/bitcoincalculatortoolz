#!/usr/bin/env node
/**
 * Fails CI if any homepage component contains hardcoded English JSX text
 * not wrapped in t()/translation context or an isTr/language ternary.
 *
 * Scope: components rendered (directly or lazily) by Home / TurkishHome.
 * Run: `node scripts/check-homepage-i18n.mjs`
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const FILES = [
  "src/components/Header.tsx",
  "src/components/Footer.tsx",
  "src/components/ProfessionalHeroSection.tsx",
  "src/components/PremiumCalculatorCards.tsx",
  "src/components/CalculatorGrid.tsx",
  "src/components/FAQSection.tsx",
  "src/components/NewsletterSection.tsx",
  "src/components/cinematic/EditorialStatement.tsx",
  "src/components/cinematic/badges/AppStoreBadge.tsx",
  "src/components/cinematic/badges/GooglePlayBadge.tsx",
  "src/components/modern/LiveCalculationDemo.tsx",
  "src/components/modern/CalculationFlowAnimation.tsx",
  "src/components/modern/UltraModernAssetComparison.tsx",
];

// Words that, if present alone in JSX text, are brand names or universal tokens
// and don't need translation.
const ALLOWLIST = new Set([
  "App Store",
  "Google Play",
  "Bitcoin",
  "BTC",
  "USD",
  "TRY",
  "DCA",
  "FAQ",
  "API",
  "CoinGecko",
  "Lovable",
]);

// JSX text node: between '>' and '<' on a single line, starts with capital,
// at least 2 spaces (3+ words) so we skip single tokens like ">USD<".
const JSX_TEXT = />\s*([A-Z][A-Za-z0-9][A-Za-z0-9 ,\.\!\?·&'\-/]{6,}?)\s*</g;
// Skip lines that clearly wire into i18n on the same line.
const SAFE_CONTEXT = /(t\(['"`]|language\s*===|isTr|isTurkish|tr\s*\?|\?\s*['"`][A-Za-zçğıöşüÇĞİÖŞÜ])/;

// Common props that render to user-facing copy.
const PROP_TEXT = /\b(aria-label|placeholder|title|alt)\s*=\s*["']([A-Z][A-Za-z0-9 ,\.\!\?\-]{4,})["']/g;

const offenders = [];

for (const rel of FILES) {
  const file = resolve(process.cwd(), rel);
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, idx) => {
    if (SAFE_CONTEXT.test(line)) return;
    if (/^\s*\/\//.test(line) || /^\s*\*/.test(line)) return;

    let m;
    JSX_TEXT.lastIndex = 0;
    while ((m = JSX_TEXT.exec(line)) !== null) {
      const text = m[1].trim();
      if (ALLOWLIST.has(text)) continue;
      if (!/[a-z]/.test(text)) continue; // skip all-caps acronyms
      offenders.push({ file: rel, line: idx + 1, kind: "jsx-text", text });
    }

    PROP_TEXT.lastIndex = 0;
    while ((m = PROP_TEXT.exec(line)) !== null) {
      offenders.push({ file: rel, line: idx + 1, kind: m[1], text: m[2] });
    }
  });
}

if (offenders.length) {
  console.error(
    `\n✗ Hardcoded English strings found in ${offenders.length} location(s):\n`,
  );
  for (const o of offenders) {
    console.error(`  ${o.file}:${o.line}  [${o.kind}]  "${o.text}"`);
  }
  console.error(
    `\nWrap with t('key') and add EN + TR entries in src/translations/index.ts.\n`,
  );
  process.exit(1);
}

console.log(`✓ Homepage i18n scan clean — ${FILES.length} files checked.`);
