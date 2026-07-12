#!/usr/bin/env node
/**
 * Bundle deferral report.
 *
 * Confirms after every `vite build` that:
 *   1. `recharts` (charts-*.js) is NOT statically imported by any route chunk
 *      — it must load dynamically via *.impl-*.js shims.
 *   2. `jspdf` (jspdf.es.min-*.js) is NOT statically imported by any route
 *      chunk — it must load only on Export PDF click via pdfReport-*.js.
 *   3. The RelatedCalculatorsLazy shared chunk stays small (<50 KB gz).
 *   4. Prints the size table used in perf reports.
 *
 * Exit codes:
 *   0  all deferrals confirmed, budgets green
 *   1  regression: a route now statically imports recharts or jspdf,
 *      or the shared chunk crossed the budget
 *
 * Usage:
 *   node scripts/report-bundle-deferral.mjs           # human report
 *   node scripts/report-bundle-deferral.mjs --json    # machine-readable
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist/assets';
const RELATED_GZ_BUDGET_KB = 50;

// Route chunks match calculator page filenames. Adjust here if new page
// naming schemes appear so the report keeps scanning them all.
const ROUTE_PREFIXES = [
  'Bitcoin', 'LumpSum', 'StackSats', 'PiToBitcoin', 'Lightning', 'BtcVsReal',
];

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST} not found — run \`vite build\` first.`);
  process.exit(1);
}

const files = readdirSync(DIST).filter(f => f.endsWith('.js'));
const sizeOf = (name) => {
  const raw = readFileSync(join(DIST, name));
  return { raw: raw.length, gz: gzipSync(raw).length };
};
const fmt = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

// ---- Locate the tracked chunks ------------------------------------------
const findOne = (re) => files.find(f => re.test(f)) ?? null;
const findAll = (re) => files.filter(f => re.test(f));

const chartsFile = findOne(/^charts-[^.]+\.js$/);
const jspdfFile = findOne(/^jspdf\.es\.min-[^.]+\.js$/);
const relatedFile = findOne(/^RelatedCalculatorsLazy-[^.]+\.js$/);
const pdfReportFile = findOne(/^pdfReport-[^.]+\.js$/);

const routeFiles = files.filter(f =>
  ROUTE_PREFIXES.some(p => f.startsWith(p)) && !f.includes('.impl-')
);

// ---- Scan every route chunk for STATIC imports of the tracked chunks ----
const staticImportRe = /\bfrom"(\.\/[^"]+\.js)"/g;
const dynImportRe = /import\("(\.\/[^"]+\.js)"\)/g;

const violations = { charts: [], jspdf: [] };
let dynChartsRoutes = 0;
let dynJspdfRoutes = 0;

for (const rf of routeFiles) {
  const src = readFileSync(join(DIST, rf), 'utf8');
  const staticImports = new Set(
    [...src.matchAll(staticImportRe)].map(m => m[1])
  );
  const dynImports = new Set(
    [...src.matchAll(dynImportRe)].map(m => m[1])
  );

  if ([...staticImports].some(s => /\/charts-[^/]+\.js$/.test(s))) {
    violations.charts.push(rf);
  }
  if ([...staticImports].some(s => /\/jspdf\.es\.min-[^/]+\.js$/.test(s))) {
    violations.jspdf.push(rf);
  }
  if ([...dynImports].some(s => /\/charts-[^/]+\.js$/.test(s))) dynChartsRoutes++;
  if ([...dynImports].some(s => /\/jspdf\.es\.min-[^/]+\.js$/.test(s))) dynJspdfRoutes++;
}

// ---- Assemble report ----------------------------------------------------
const report = {
  timestamp: new Date().toISOString(),
  routes: { scanned: routeFiles.length },
  chunks: {},
  budgets: {},
  violations,
  dynamic: { charts: dynChartsRoutes, jspdf: dynJspdfRoutes },
};

for (const [key, file] of Object.entries({
  charts: chartsFile,
  jspdf: jspdfFile,
  related: relatedFile,
  pdfReport: pdfReportFile,
})) {
  if (file) {
    const { raw, gz } = sizeOf(file);
    report.chunks[key] = { file, raw, gz };
  } else {
    report.chunks[key] = null;
  }
}

// Related chunk must stay under the budget
const relatedGz = report.chunks.related?.gz ?? 0;
report.budgets.relatedGzKb = {
  actual: +(relatedGz / 1024).toFixed(2),
  budget: RELATED_GZ_BUDGET_KB,
  pass: relatedGz / 1024 <= RELATED_GZ_BUDGET_KB,
};

// pdfReport must dynamic-import jspdf
if (pdfReportFile && jspdfFile) {
  const src = readFileSync(join(DIST, pdfReportFile), 'utf8');
  report.pdfReportDynamicallyImportsJspdf = new RegExp(
    `import\\("\\./${jspdfFile.replace(/[.\-]/g, '\\$&')}"\\)`
  ).test(src);
}

const fail =
  violations.charts.length > 0 ||
  violations.jspdf.length > 0 ||
  !report.budgets.relatedGzKb.pass;

report.status = fail ? 'fail' : 'pass';

// ---- Output -------------------------------------------------------------
if (asJson) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(fail ? 1 : 0);
}

const row = (label, chunk) => {
  if (!chunk) return `  ${label.padEnd(30)} — not found`;
  return `  ${label.padEnd(30)} ${fmt(chunk.raw).padStart(10)} raw / ${fmt(chunk.gz).padStart(9)} gz   ${chunk.file}`;
};

console.log('\nBundle deferral report');
console.log('─'.repeat(90));
console.log(row('recharts (charts-*)',       report.chunks.charts));
console.log(row('jspdf   (jspdf.es.min-*)',  report.chunks.jspdf));
console.log(row('RelatedCalculatorsLazy',    report.chunks.related));
console.log(row('pdfReport (jspdf wrapper)', report.chunks.pdfReport));
console.log('─'.repeat(90));
console.log(`  Scanned route chunks: ${routeFiles.length}`);
console.log(`  Dynamic-import recharts: ${dynChartsRoutes} routes`);
console.log(`  Dynamic-import jspdf:    ${dynJspdfRoutes} routes (via pdfReport)`);
if (report.pdfReportDynamicallyImportsJspdf !== undefined) {
  console.log(`  pdfReport → jspdf is dynamic: ${report.pdfReportDynamicallyImportsJspdf ? 'yes ✓' : 'NO ✗'}`);
}
console.log('─'.repeat(90));
console.log(`  Budget: RelatedCalculatorsLazy ≤ ${RELATED_GZ_BUDGET_KB} KB gz — actual ${report.budgets.relatedGzKb.actual} KB gz  ${report.budgets.relatedGzKb.pass ? '✓' : '✗ OVER BUDGET'}`);
console.log('─'.repeat(90));

if (violations.charts.length) {
  console.log(`\n✗ ${violations.charts.length} route(s) statically import recharts:`);
  for (const v of violations.charts) console.log(`    - ${v}`);
} else {
  console.log('\n✓ 0 routes statically import recharts');
}

if (violations.jspdf.length) {
  console.log(`\n✗ ${violations.jspdf.length} route(s) statically import jspdf:`);
  for (const v of violations.jspdf) console.log(`    - ${v}`);
} else {
  console.log('✓ 0 routes statically import jspdf');
}

console.log(`\nStatus: ${fail ? 'FAIL — chunk deferral regressed' : 'PASS — all deferrals confirmed'}\n`);
process.exit(fail ? 1 : 0);
