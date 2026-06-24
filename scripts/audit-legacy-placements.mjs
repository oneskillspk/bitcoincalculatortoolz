#!/usr/bin/env node
/**
 * audit-legacy-placements.mjs
 *
 * Fails the build if any calculator page in src/pages uses legacy
 * placement primitives instead of the V2 Slot system.
 *
 * Forbidden in src/pages/*Calculator.tsx:
 *   - SmartCalculatorLayout
 *   - Zone1SlimBanner | Zone2ResultsSpotlight | Zone3ContentGap
 *     | Zone4PreFAQ | Zone5Companion
 *   - Direct import of AffiliatePlacement (must go through V2 slots)
 *
 * Allowed: PreFAQPlacement (V2 shim) and useSmartZones (V2 hook).
 * The `sz.Zone1/2/4/5` aliases returned by useSmartZones are V2 — we
 * only flag direct imports of legacy components.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PAGES_DIR = "src/pages";

const FORBIDDEN = [
  { name: "SmartCalculatorLayout", re: /\bSmartCalculatorLayout\b/ },
  { name: "Zone1SlimBanner", re: /\bZone1SlimBanner\b/ },
  { name: "Zone2ResultsSpotlight", re: /\bZone2ResultsSpotlight\b/ },
  { name: "Zone3ContentGap", re: /\bZone3ContentGap\b/ },
  { name: "Zone4PreFAQ", re: /\bZone4PreFAQ\b/ },
  { name: "Zone5Companion", re: /\bZone5Companion\b/ },
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
    else if (/Calculator\.tsx$/.test(entry)) out.push(p);
  }
  return out;
}

const files = walk(PAGES_DIR);
/** @type {Map<string, Array<{rule: string, line: number, snippet: string}>>} */
const violationsByPage = new Map();

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  const found = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const rule of FORBIDDEN) {
      if (rule.re.test(line)) {
        found.push({
          rule: rule.name,
          line: i + 1,
          snippet: line.trim().slice(0, 120),
        });
      }
    }
  }
  if (found.length) violationsByPage.set(file, found);
}

const scanned = files.length;
const offenders = violationsByPage.size;

if (offenders === 0) {
  console.log(
    `✓ audit:legacy-placements — scanned ${scanned} calculator pages, no legacy placements found.`
  );
  process.exit(0);
}

const totalHits = [...violationsByPage.values()].reduce(
  (n, arr) => n + arr.length,
  0
);

console.error("");
console.error(
  `❌ audit:legacy-placements — ${totalHits} legacy placement` +
    `${totalHits === 1 ? "" : "s"} across ${offenders} of ${scanned} calculator pages`
);
console.error("");

const sorted = [...violationsByPage.keys()].sort();
for (const file of sorted) {
  const rel = relative(process.cwd(), file);
  const pageName = file.split("/").pop().replace(/\.tsx$/, "");
  const hits = violationsByPage.get(file);
  console.error(`  ${pageName}  (${rel})`);
  for (const h of hits) {
    console.error(`    ${rel}:${h.line}  ${h.rule}`);
    console.error(`      → ${h.snippet}`);
  }
  console.error("");
}

console.error(
  "Migrate to the V2 Slot system: add <PreFAQPlacement /> above the FAQ"
);
console.error(
  "section, or wire useSmartZones() for inline SlotA/B/C/D placements."
);
console.error("");

process.exit(1);
