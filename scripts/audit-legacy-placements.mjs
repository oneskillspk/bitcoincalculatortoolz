#!/usr/bin/env node
/**
 * audit-legacy-placements.mjs
 *
 * Fails the build if any monetizable page in src/pages uses a legacy
 * placement primitive instead of the V2 Slot system.
 *
 * Two-phase scan:
 *
 *  1. LEGACY  — every *.tsx in src/pages (and src/components/learn,
 *               src/components/Footer) is checked for forbidden tokens:
 *                 - SmartCalculatorLayout
 *                 - Zone1–5SlimBanner / ResultsSpotlight / ContentGap / PreFAQ / Companion
 *                 - Direct import of AffiliatePlacement from a *Calculator.tsx
 *                   page (calculators must go through PreFAQPlacement /
 *                   useSmartZones, not the raw component).
 *
 *  2. COVERAGE — every monetizable page (calculator or hub) must mount
 *                at least one of: PreFAQPlacement, useSmartZones, or a
 *                forced editorial AffiliatePlacement (forceAffiliateId).
 *                Otherwise the page ships zero revenue surface.
 *
 * Legal / utility / admin pages are explicitly excluded from coverage.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PAGES_DIR = "src/pages";
const EXTRA_FILES = [
  "src/components/Footer.tsx",
  "src/components/learn/ArticleSidebar.tsx",
];

// Pages that legitimately have no monetization surface.
const COVERAGE_EXCLUDE = new Set([
  "About.tsx",
  "AdminLinkAudit.tsx",
  "AffiliateDisclosure.tsx",
  "AffiliatePlacementQA.tsx",
  "Contact.tsx",
  "Methodology.tsx",
  "NotFound.tsx",
  "OAuthConsent.tsx",
  "OptimizedAbout.tsx",
  "Privacy.tsx",
  "ShareRedirect.tsx",
  "Sitemap.tsx",
  "StateCardsQA.tsx",
  "Status.tsx",
  "Terms.tsx",
  "TurkishNotFound.tsx",
  "TypographyPreview.tsx",
  "Unsubscribe.tsx",
  // Hubs/lists that are pure navigation — monetization handled inside
  // the linked pages, not here.
  "Learn.tsx",
  "Tools.tsx",
]);

const FORBIDDEN = [
  { name: "SmartCalculatorLayout", re: /\bSmartCalculatorLayout\b/ },
  { name: "Zone1SlimBanner", re: /\bZone1SlimBanner\b/ },
  { name: "Zone2ResultsSpotlight", re: /\bZone2ResultsSpotlight\b/ },
  { name: "Zone3ContentGap", re: /\bZone3ContentGap\b/ },
  { name: "Zone4PreFAQ", re: /\bZone4PreFAQ\b/ },
  { name: "Zone5Companion", re: /\bZone5Companion\b/ },
];

const CALC_RE = /Calculator\.tsx$/;
const AFFILIATE_IMPORT_RE =
  /from\s+["']@\/components\/affiliateAI\/AffiliatePlacement["']/;
const V2_MARKERS = [
  /\bPreFAQPlacement\b/,
  /\buseSmartZones\b/,
  /forceAffiliateId\s*[=:]/, // editorial brand placement
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.tsx$/.test(entry)) out.push(p);
  }
  return out;
}

const pageFiles = walk(PAGES_DIR);
const allTargets = [...pageFiles, ...EXTRA_FILES];

/** @type {Map<string, Array<{rule: string, line: number, snippet: string}>>} */
const violationsByPage = new Map();
/** @type {string[]} */
const coverageGaps = [];

for (const file of allTargets) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const lines = src.split("\n");
  const found = [];

  // Phase 1 — forbidden tokens (sitewide).
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

  // Calculator pages: ban direct AffiliatePlacement import.
  if (CALC_RE.test(file)) {
    for (let i = 0; i < lines.length; i++) {
      if (AFFILIATE_IMPORT_RE.test(lines[i])) {
        found.push({
          rule: "AffiliatePlacement (direct import in calculator page)",
          line: i + 1,
          snippet: lines[i].trim().slice(0, 120),
        });
      }
    }
  }

  // Conflict rule: a single page must not mount BOTH `useSmartZones`
  // (inline SlotA/B/C/D) AND `<PreFAQPlacement />`. PreFAQPlacement
  // internally creates its own orchestrator and renders SlotB/C/D, so
  // combining the two double-paints banners in the same vertical band.
  // Pick ONE owner per page.
  const usesSmartZones = /\buseSmartZones\s*\(/.test(src);
  const usesPreFAQ = /<\s*PreFAQPlacement\b/.test(src);
  if (usesSmartZones && usesPreFAQ) {
    const idx = lines.findIndex((l) => /<\s*PreFAQPlacement\b/.test(l));
    found.push({
      rule: "Duplicate slot owner (useSmartZones + PreFAQPlacement on same page)",
      line: idx + 1,
      snippet: (lines[idx] ?? "").trim().slice(0, 120),
    });
  }

  if (found.length) violationsByPage.set(file, found);

  // Phase 2 — coverage: only for src/pages files not in the exclude list.
  if (file.startsWith(PAGES_DIR + "/")) {
    const base = file.slice(PAGES_DIR.length + 1);
    if (base.includes("/")) continue; // admin/ etc.
    if (COVERAGE_EXCLUDE.has(base)) continue;
    const hasV2 = V2_MARKERS.some((re) => re.test(src));
    if (!hasV2) coverageGaps.push(file);
  }
}

const scanned = allTargets.length;
const offenders = violationsByPage.size;
const totalHits = [...violationsByPage.values()].reduce(
  (n, arr) => n + arr.length,
  0
);

let failed = false;

if (offenders === 0) {
  console.log(
    `✓ audit:legacy-placements — scanned ${scanned} files, no legacy placements found.`
  );
} else {
  failed = true;
  console.error("");
  console.error(
    `❌ audit:legacy-placements — ${totalHits} legacy placement` +
      `${totalHits === 1 ? "" : "s"} across ${offenders} of ${scanned} files`
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
}

if (coverageGaps.length === 0) {
  console.log(
    `✓ audit:monetization-coverage — every monetizable page mounts a V2 slot or editorial placement.`
  );
} else {
  failed = true;
  console.error("");
  console.error(
    `❌ audit:monetization-coverage — ${coverageGaps.length} page${
      coverageGaps.length === 1 ? "" : "s"
    } ship zero monetization surface:`
  );
  for (const f of coverageGaps.sort()) {
    const rel = relative(process.cwd(), f);
    const name = f.split("/").pop().replace(/\.tsx$/, "");
    console.error(`    ${name}   (${rel})`);
  }
  console.error("");
  console.error(
    "Add <PreFAQPlacement slug=\"...\" /> above the FAQ section, or wire"
  );
  console.error(
    "useSmartZones() for inline SlotA/B/C/D placements. If the page is"
  );
  console.error(
    "legitimately ad-free (legal/admin), add it to COVERAGE_EXCLUDE in"
  );
  console.error("scripts/audit-legacy-placements.mjs.");
  console.error("");
}

process.exit(failed ? 1 : 0);
