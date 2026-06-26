#!/usr/bin/env node
/**
 * Homepage performance gate.
 *
 * Runs Lighthouse against a locally previewed production build and fails CI
 * if the headline metrics regress. Thresholds are intentionally generous so
 * the gate only fires on real regressions, not noise.
 *
 *   PERF >= 0.85   LCP <= 2800ms   CLS <= 0.05   TBT <= 300ms
 *
 * Usage:  node scripts/lighthouse-homepage.mjs [url]
 *         (defaults to http://localhost:4173/)
 *
 * Requires `lighthouse` and `chrome-launcher` (peer-installed in CI only —
 * skipped automatically with a clear message when missing locally).
 */
const URL = process.argv[2] ?? process.env.LH_URL ?? 'http://localhost:4173/';

const THRESHOLDS = {
  performanceScore: 0.85,
  lcpMs: 2800,
  cls: 0.05,
  tbtMs: 300,
};

let lighthouse, chromeLauncher;
try {
  ({ default: lighthouse } = await import('lighthouse'));
  chromeLauncher = await import('chrome-launcher');
} catch {
  console.warn(
    '[lighthouse] `lighthouse` / `chrome-launcher` not installed — skipping. ' +
      'Install with: bun add -d lighthouse chrome-launcher',
  );
  process.exit(0);
}

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
try {
  const result = await lighthouse(URL, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance'],
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10_240, cpuSlowdownMultiplier: 1 },
  });

  const lhr = result.lhr;
  const perf = lhr.categories.performance.score ?? 0;
  const lcp = lhr.audits['largest-contentful-paint']?.numericValue ?? Infinity;
  const cls = lhr.audits['cumulative-layout-shift']?.numericValue ?? Infinity;
  const tbt = lhr.audits['total-blocking-time']?.numericValue ?? Infinity;

  const rows = [
    ['Performance', perf.toFixed(2), `>= ${THRESHOLDS.performanceScore}`, perf >= THRESHOLDS.performanceScore],
    ['LCP (ms)', Math.round(lcp), `<= ${THRESHOLDS.lcpMs}`, lcp <= THRESHOLDS.lcpMs],
    ['CLS', cls.toFixed(3), `<= ${THRESHOLDS.cls}`, cls <= THRESHOLDS.cls],
    ['TBT (ms)', Math.round(tbt), `<= ${THRESHOLDS.tbtMs}`, tbt <= THRESHOLDS.tbtMs],
  ];

  console.log(`\nLighthouse — ${URL}`);
  for (const [m, v, t, ok] of rows) console.log(`  ${ok ? '✓' : '✗'} ${m.padEnd(14)} ${String(v).padStart(8)}   (${t})`);

  const failed = rows.filter(([, , , ok]) => !ok);
  if (failed.length) {
    console.error(`\n[lighthouse] ${failed.length} threshold(s) failed.`);
    process.exit(1);
  }
  console.log('\n[lighthouse] All thresholds passed.');
} finally {
  await chrome.kill();
}
