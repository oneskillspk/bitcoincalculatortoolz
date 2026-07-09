import { test, expect, devices, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Full accessibility guard.
 *
 * For every public route × viewport (desktop + mobile) this spec runs:
 *
 *   1. axe-core wcag2a/wcag2aa/wcag21a/wcag21aa scan (baseline-guarded — see
 *      below).
 *   2. Keyboard traversal — presses Tab a handful of times from the
 *      document root and asserts focus lands on real, visible interactive
 *      elements (guards against tabindex traps and invisible focus).
 *   3. Cookie-consent banner assertion — the banner uses aria-live and was
 *      previously collapsed to 1×1px by an overly-broad sr-only rule. This
 *      asserts the banner is a real visible size and NOT sr-only.
 *
 * ── Baseline model ───────────────────────────────────────────────────────
 * The site has pre-existing serious/critical violations we are working
 * through. To catch *regressions* now (new rules newly failing on a route)
 * without blocking on every legacy finding, we compare against a checked-in
 * baseline at `e2e/a11y-baseline.json`.
 *
 *   - Set of `${ruleId}` per `${viewport}::${route}` in the baseline = known
 *     violations. Any additional rule id in a run fails the build.
 *   - To accept a new baseline (after fixing / conscious changes), run
 *     `UPDATE_A11Y_BASELINE=1 npx playwright test e2e/a11y-axe-full.spec.ts`.
 *
 * Rules always disabled (auditable list, keep tiny):
 *   - color-contrast: gradient backgrounds axe can't sample; QA'd manually.
 *   - frame-title: third-party consent iframes we don't control.
 */

const ROUTES = [
  '/',
  '/calculators',
  '/calculators/dca',
  '/calculators/retirement',
  '/calculators/portfolio-tracker',
  '/calculators/bitcoin-converter',
  '/calculators/bitcoin-tax-uk-cgt',
  '/calculators/bitcoin-tax-germany',
  '/calculators/bitcoin-tax-india',
  '/learn',
  '/about',
  '/contact',
  '/tools',
  '/methodology',
  '/tr',
  '/tr/hesaplayicilar',
  '/tr/hesaplayicilar/bitcoin-portfoy',
];

const VIEWPORTS: Array<{ name: 'desktop' | 'mobile'; viewport: { width: number; height: number } }> = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'mobile', viewport: devices['iPhone 13'].viewport },
];

const DISABLED_RULES = ['color-contrast', 'frame-title'];

const BASELINE_PATH = path.resolve(process.cwd(), 'e2e/a11y-baseline.json');
const UPDATE_BASELINE = process.env.UPDATE_A11Y_BASELINE === '1';

type Baseline = Record<string, string[]>; // "vp::route" -> [ruleId,...]

const REPORT_DIR = path.resolve(process.cwd(), 'a11y-report');
mkdirSync(REPORT_DIR, { recursive: true });

type PerRunEntry = {
  route: string;
  viewport: string;
  key: string;
  currentIds: string[];
  allowedIds: string[];
  regressions: Array<{
    id: string;
    impact: string | null | undefined;
    help: string;
    helpUrl: string;
    nodes: string[];
  }>;
  allBlocking: Array<{
    id: string;
    impact: string | null | undefined;
    help: string;
    helpUrl: string;
    nodeCount: number;
  }>;
};
const runReport: PerRunEntry[] = [];

function loadBaseline(): Baseline {
  if (!existsSync(BASELINE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;
  } catch {
    return {};
  }
}
const baseline = loadBaseline();
const collected: Baseline = {};

async function runAxe(page: Page, route: string, viewport: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(DISABLED_RULES)
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  const key = `${viewport}::${route}`;
  const currentIds = blocking.map((v) => v.id).sort();
  collected[key] = currentIds;

  // Persist raw axe results for CI artifact inspection.
  const safeRoute = route.replace(/[^a-z0-9]+/gi, '_') || 'root';
  writeFileSync(
    path.join(REPORT_DIR, `raw-${viewport}-${safeRoute}.json`),
    JSON.stringify(results, null, 2),
    'utf8',
  );

  const allowed = new Set(baseline[key] ?? []);
  const regressions = blocking.filter((v) => !allowed.has(v.id));

  runReport.push({
    route,
    viewport,
    key,
    currentIds,
    allowedIds: [...allowed].sort(),
    regressions: regressions.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.slice(0, 10).map((n) => n.target.join(' ')),
    })),
    allBlocking: blocking.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
    })),
  });

  if (UPDATE_BASELINE) return; // recording mode

  if (regressions.length) {
    const summary = regressions
      .map(
        (v) =>
          `- [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(' '))
            .join('\n    ')}\n    ${v.helpUrl}`,
      )
      .join('\n');
    throw new Error(
      `A11y regression on ${route} (${viewport}) — new rule(s) failing vs baseline:\n${summary}\n\n` +
        `If this is intentional, re-baseline with:\n  UPDATE_A11Y_BASELINE=1 npx playwright test e2e/a11y-axe-full.spec.ts`,
    );
  }
}

async function assertKeyboardFocus(page: Page, route: string) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur?.());
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        visible:
          r.width > 0 &&
          r.height > 0 &&
          cs.visibility !== 'hidden' &&
          cs.display !== 'none' &&
          cs.opacity !== '0',
        interactive:
          /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName) ||
          el.hasAttribute('tabindex') ||
          el.getAttribute('role') === 'button' ||
          el.getAttribute('role') === 'link',
      };
    });
    if (!info) continue;
    expect(info.visible, `${route}: focused element ${info.tag} not visible`).toBe(true);
    expect(info.interactive, `${route}: focused element ${info.tag} not interactive`).toBe(true);
  }
}

async function assertCookieBannerHealth(page: Page, route: string) {
  await page.evaluate(() => {
    try {
      localStorage.removeItem('cookie-consent');
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('consent');
    } catch { /* noop */ }
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const banner = await page.evaluate(() => {
    const candidates = [
      ...document.querySelectorAll('[aria-live]'),
      ...document.querySelectorAll('[role="dialog"]'),
    ];
    const el = candidates.find((n) =>
      /cookie|çerez/i.test((n as HTMLElement).innerText || ''),
    ) as HTMLElement | undefined;
    if (!el) return { present: false };
    const r = el.getBoundingClientRect();
    return {
      present: true,
      width: r.width,
      height: r.height,
      classList: [...el.classList],
    };
  });

  if (!banner.present) return;
  expect(banner.width, `${route}: cookie banner width collapsed`).toBeGreaterThan(200);
  expect(banner.height, `${route}: cookie banner height collapsed`).toBeGreaterThan(30);
  expect(banner.classList.includes('sr-only')).toBe(false);
}

for (const { name: vpName, viewport } of VIEWPORTS) {
  test.describe(`a11y (${vpName})`, () => {
    test.use({ viewport });

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }, testInfo) => {
        test.skip(
          testInfo.project.name !== 'chromium-desktop',
          'a11y matrix runs inside a single project',
        );
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        await runAxe(page, route, vpName);
        await assertKeyboardFocus(page, route);
        await assertCookieBannerHealth(page, route);
      });
    }
  });
}

test.afterAll(async () => {
  if (!UPDATE_BASELINE) return;
  mkdirSync(path.dirname(BASELINE_PATH), { recursive: true });
  // Merge with existing baseline so a partial run doesn't wipe untested keys.
  const merged: Baseline = { ...baseline };
  for (const [k, v] of Object.entries(collected)) merged[k] = v;
  writeFileSync(BASELINE_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`[a11y] baseline written to ${BASELINE_PATH}`);
});
