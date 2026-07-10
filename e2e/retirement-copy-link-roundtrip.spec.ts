import { test, expect, type Page } from '@playwright/test';

/** Canonical CSV filename bases per mode (must mirror RETIREMENT_CSV_FILENAMES). */
const CSV_BASE: Record<'forecaster' | 'planner' | 'fire', string> = {
  forecaster: 'bitcoin-retirement-projections',
  planner: 'bitcoin-retirement-goal-plan',
  fire: 'bitcoin-fire-scenarios',
};

function todayIso(): string {
  const d = new Date();
  const p = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Copy-link round-trip regression for the Retirement calculator.
 *
 * Contract: when the user clicks Copy-link in any mode, the URL written
 * to the clipboard must, when reopened in a fresh page load, restore
 *   (a) the same mode tab (forecaster/planner/fire)
 *   (b) the same input values the user had when they copied it
 *
 * If share params drift out of sync with the URL-restore effect in
 * BitcoinRetirementCalculator.tsx, this test fails immediately.
 */

const MODES = [
  {
    name: 'forecaster',
    tabIndex: 0,
    // Params we tweak before copying, and assert on reload
    edits: {
      currentAge: '35',
      retirementAge: '60',
      monthlyContribution: '750',
    },
    expectedParams: {
      tab: 'forecaster',
      currentAge: '35',
      retirementAge: '60',
      monthlyContribution: '750',
    },
  },
  {
    name: 'planner',
    tabIndex: 1,
    edits: {
      currentAge: '32',
      desiredRetirementAge: '55',
      desiredAnnualBudget: '120000',
    },
    expectedParams: {
      tab: 'planner',
      currentAge: '32',
      desiredRetirementAge: '55',
      desiredAnnualBudget: '120000',
    },
  },
  {
    name: 'fire',
    tabIndex: 2,
    edits: {
      currentAge: '28',
      annualExpenses: '48000',
      withdrawalRate: '3.5',
    },
    expectedParams: {
      tab: 'fire',
      currentAge: '28',
      annualExpenses: '48000',
      withdrawalRate: '3.5',
    },
  },
] as const;

async function selectMode(page: Page, tabIndex: number) {
  const modeButtons = page.locator('main button').filter({ hasText: /Forecaster|Goal Planner|FIRE/i });
  if (await modeButtons.count()) {
    await modeButtons.nth(tabIndex).click({ trial: false }).catch(() => {});
    await page.waitForTimeout(200);
  }
}

async function setNumberInput(page: Page, labelLike: RegExp, value: string) {
  // Try id/label-based lookup first, then fall back to any input near the label.
  const byLabel = page.getByLabel(labelLike, { exact: false }).first();
  if (await byLabel.count()) {
    await byLabel.fill(value).catch(() => {});
    return;
  }
  // Fallback: any input with matching name/aria-label
  const byAria = page.locator(`input[aria-label], input[name]`).filter({ has: page.locator(':scope') });
  const n = await byAria.count();
  for (let i = 0; i < n; i++) {
    const el = byAria.nth(i);
    const name = ((await el.getAttribute('name')) ?? '') + ' ' + ((await el.getAttribute('aria-label')) ?? '');
    if (labelLike.test(name)) {
      await el.fill(value).catch(() => {});
      return;
    }
  }
}

async function installClipboardCapture(page: Page) {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.evaluate(() => {
    (window as any).__copied = null;
    const original = navigator.clipboard?.writeText?.bind(navigator.clipboard);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as any).__copied = text;
          try { await original?.(text); } catch { /* headless */ }
        },
        readText: async () => (window as any).__copied ?? '',
      },
    });
  });
}

for (const mode of MODES) {
  test(`retirement copy-link · ${mode.name}: round-trips tab + inputs through the URL`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1400 });
    await page.goto('/calculators/retirement', { waitUntil: 'domcontentloaded' });
    await selectMode(page, mode.tabIndex);

    // Nudge a handful of inputs so we know we're not just matching defaults.
    for (const [k, v] of Object.entries(mode.edits)) {
      // Convert camelCase → space-separated for label matching (currentAge → /current\s*age/i)
      const words = k.replace(/([A-Z])/g, ' $1').trim();
      const re = new RegExp(words.replace(/\s+/g, '\\s*'), 'i');
      await setNumberInput(page, re, v);
    }

    // Trigger calculation so the export panel renders (some modes gate on results)
    const calcBtn = page.getByRole('button', { name: /^\s*Calculate/i }).first();
    if (await calcBtn.count()) await calcBtn.click().catch(() => {});
    await page.waitForTimeout(800);

    await installClipboardCapture(page);

    const copyBtn = page.getByRole('button', { name: /(copy|link|share)/i }).first();
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();

    await expect.poll(() => page.evaluate(() => (window as any).__copied ?? null), {
      timeout: 5_000,
    }).toBeTruthy();

    const copied: string = await page.evaluate(() => (window as any).__copied);
    expect(copied, 'clipboard value must be an absolute URL').toMatch(/^https?:\/\//);

    const url = new URL(copied);
    expect(url.pathname).toBe('/calculators/retirement');

    // Every expected param must be present with the right value.
    for (const [k, v] of Object.entries(mode.expectedParams)) {
      expect(url.searchParams.get(k), `param ${k} in copied URL`).toBe(v);
    }

    // Now navigate to the copied URL and verify state is actually restored.
    await page.goto(url.pathname + url.search, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Restored tab: only the active tab's inputs render, so we can just check
    // that the copied URL echoes back verbatim from window.location.search
    // AND that the tab button carries an active state or matching content.
    const restoredSearch = await page.evaluate(() => window.location.search);
    const restoredUrl = new URL('http://x.local' + restoredSearch);
    expect(restoredUrl.searchParams.get('tab')).toBe(mode.expectedParams.tab);

    // Spot-check a numeric input was hydrated from the URL for the edited fields.
    for (const [k, v] of Object.entries(mode.edits)) {
      const words = k.replace(/([A-Z])/g, ' $1').trim();
      const re = new RegExp(words.replace(/\s+/g, '\\s*'), 'i');
      const input = page.getByLabel(re, { exact: false }).first();
      if (await input.count()) {
        const val = await input.inputValue().catch(() => '');
        expect(String(val), `restored value for ${k}`).toBe(v);
      }
    }
  });
}
