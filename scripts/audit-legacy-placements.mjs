#!/usr/bin/env node
/**
 * audit-legacy-placements.mjs
 *
 * Fails the build if any calculator page in src/pages uses legacy
 * placement primitives instead of the V2 Slot system.
 *
 * Forbidden in src/pages/**:
 *   - import { SmartCalculatorLayout } ...
 *   - import { Zone1SlimBanner | Zone2ResultsSpotlight | Zone3ContentGap
 *              | Zone4PreFAQ | Zone5Companion } ...
 *   - import { AffiliatePlacement } ...   (must go through V2 slots)
 *
 * Allowed: PreFAQPlacement (V2 shim) and useSmartZones (V2 hook).
 * The `sz.Zone1/2/4/5` aliases returned by useSmartZones are fine —
 * we only flag direct imports of the legacy components.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PAGES_DIR = "src/pages";

const FORBIDDEN = [
  { name: "SmartCalculatorLayout", re: /\bSmartCalculatorLayout\b/ },
  { name: "Zone1SlimBanner", re: /\bZone1SlimBanner\b/ },
  { name: "Zone2ResultsSpotlight", re: /\bZone2ResultsSpotlight\b/ },
  { name: "Zone3ContentGap", re: /\bZone3ContentGap\b/ },
  { name: "Zone4PreFAQ", re: /\bZone4PreFAQ\b/ },
  { name: "Zone5Companion", re: /\bZone5Companion\b/ },
  // AffiliatePlacement: only flag direct imports — sz.* and SlotX
  // components are V2 and may transitively render it.
  {
    name: "AffiliatePlacement (direct import)",
    re: /from\s+["']@\/components\/affiliateAI\/AffiliatePlacement["']/,
  },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(p);
  }
  return out;
}

const violations = [];
for (const file of walk(PAGES_DIR)) {
  const src = readFileSync(file, "utf8");
  for (const rule of FORBIDDEN) {
    if (rule.re.test(src)) {
      violations.push({ file, rule: rule.name });
    }
  }
}

if (violations.length) {
  console.error("\n❌ Legacy placement usage detected in calculator pages:\n");
  for (const v of violations) {
    console.error(`  • ${v.file}  →  ${v.rule}`);
  }
  console.error(
    "\nUse the V2 Slot system instead: <PreFAQPlacement /> (shim) or useSmartZones().\n"
  );
  process.exit(1);
}

console.log(
  `✓ audit:legacy-placements — no legacy placements found in ${PAGES_DIR}`
);
