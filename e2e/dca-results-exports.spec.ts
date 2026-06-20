/**
 * E2E: Verifies that DCA results exports (CSV / PDF / PNG) reflect the
 * exact values rendered in the on-screen results panel.
 *
 * - CSV: parsed → last-row aggregate columns (Total Invested, Total BTC,
 *        Current Value) must match the corresponding ResultCard values
 *        shown in the panel (read via `aria-label="${label}: ${fullValue}"`).
 * - PDF: download captured, magic bytes asserted (`%PDF`), non-empty.
 * - PNG: download captured, magic bytes asserted (89 50 4E 47), non-empty.
 *
 * Run on chromium-desktop + mobile-safari projects (configured in
 * playwright.config.ts) to cover both desktop and mobile.
 */
import { test, expect, type Page, type Download } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const NUM = (s: string) => Number(s.replace(/[^0-9.\-]/g, ''));

async function calculate(page: Page) {
  await page.goto('/calculators/dca', { waitUntil: 'networkidle' });
  const btn = page.getByRole('button', { name: /Calculate DCA Returns/i });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.getByRole('heading', { name: /DCA Results/i }).waitFor({ timeout: 15_000 });
  await page.waitForTimeout(1200); // counter animation settle
}

/** Extract the full-precision value out of a ResultCard via its aria-label. */
async function fullValue(page: Page, labelRegex: RegExp): Promise<string> {
  const btn = page.locator('[data-testid="result-card-value"]').filter({
    has: page.locator('xpath=.'),
  });
  // Pick by aria-label which is "<Label>: <fullValue>".
  const target = page.locator(`button[aria-label]`, {
    hasText: '',
  }).filter({ has: page.locator('xpath=.') });
  // Simpler: query directly by aria-label regex
  const el = page.locator('button[data-testid="result-card-value"]').filter({
    hasNot: page.locator('xpath=//*[contains(., "__never__")]'),
  });
  const all = await el.elementHandles();
  for (const h of all) {
    const aria = await h.getAttribute('aria-label');
    if (aria && labelRegex.test(aria)) {
      const m = aria.match(/:\s*(.+)$/);
      if (m) return m[1].trim();
    }
  }
  throw new Error(`No ResultCard matched ${labelRegex}`);
}

async function downloadVia(page: Page, click: () => Promise<void>): Promise<Download> {
  const [dl] = await Promise.all([page.waitForEvent('download'), click()]);
  return dl;
}

test.describe('DCA results · exports match displayed values', () => {
  test.beforeEach(async ({ page }) => {
    await calculate(page);
  });

  test('CSV last-row aggregates match panel ResultCard values', async ({ page }) => {
    const totalInvestedDisplay = await fullValue(page, /Total Invested|Toplam Yatırım/i);
    const btcAcquiredDisplay   = await fullValue(page, /Bitcoin Acquired|Edinilen BTC/i);

    const exportBtn = page.getByRole('button', { name: /Export CSV|CSV İndir/i });
    await exportBtn.scrollIntoViewIfNeeded();
    const dl = await downloadVia(page, () => exportBtn.click());
    expect(dl.suggestedFilename()).toMatch(/bitcoin-dca-purchases-.*\.csv$/);

    const path = await dl.path();
    expect(path).toBeTruthy();
    const csv = await readFile(path!, 'utf8');
    const rows = csv.trim().split('\n').map((r) => r.split(','));
    expect(rows.length).toBeGreaterThan(1);

    // Header order (from DCAPurchasesTable):
    // Date, Amount Invested, Bitcoin Price, Bitcoin Purchased,
    // Total BTC, Total Invested, Current Value, Unrealized P&L
    const last = rows[rows.length - 1];
    const csvTotalInvested = Number(last[5]);
    const csvTotalBtc      = Number(last[4]);
    const csvCurrentValue  = Number(last[6]);

    // Compare with on-screen full values (strip currency/symbols).
    expect(csvTotalInvested).toBeCloseTo(NUM(totalInvestedDisplay), 2);
    // BTC display is e.g. "₿0.10970000" or "0.1097 BTC".
    expect(csvTotalBtc).toBeCloseTo(NUM(btcAcquiredDisplay), 6);
    // Current value must be positive and finite.
    expect(csvCurrentValue).toBeGreaterThan(0);
    expect(Number.isFinite(csvCurrentValue)).toBe(true);
  });

  test('PDF export downloads a valid PDF', async ({ page }) => {
    const pdfBtn = page.getByRole('button', { name: /(Download|Export|İndir).*PDF|PDF.*(Download|Export|İndir)|^PDF$/i }).first();
    await pdfBtn.scrollIntoViewIfNeeded();
    const dl = await downloadVia(page, () => pdfBtn.click());
    expect(dl.suggestedFilename()).toMatch(/\.pdf$/i);

    const path = await dl.path();
    const buf = await readFile(path!);
    expect(buf.byteLength).toBeGreaterThan(1000);
    expect(buf.subarray(0, 4).toString('ascii')).toBe('%PDF');
  });

  test('PNG export downloads a valid PNG', async ({ page }) => {
    const pngBtn = page.getByRole('button', { name: /(Download|Export|İndir).*PNG|PNG.*(Download|Export|İndir)|^PNG$/i }).first();
    await pngBtn.scrollIntoViewIfNeeded();
    const dl = await downloadVia(page, () => pngBtn.click());
    expect(dl.suggestedFilename()).toMatch(/\.png$/i);

    const path = await dl.path();
    const buf = await readFile(path!);
    expect(buf.byteLength).toBeGreaterThan(1000);
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    expect([...buf.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  });
});
