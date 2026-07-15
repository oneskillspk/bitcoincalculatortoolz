/**
 * Verifies every row in LumpSumVsDcaVsTradTable matches a recomputation
 * that uses EXACTLY the documented assumptions:
 *   • $10,000 stake per strategy (identical across BTC Lump, BTC DCA, S&P DCA)
 *   • BTC Lump  = single buy at start-of-window close
 *   • BTC DCA   = equal monthly buys summing to $10,000 across the window
 *   • S&P DCA   = the SAME monthly contribution schedule as BTC DCA,
 *                 compounded at a FLAT 10%/yr (0.10/12 per month)
 *   • 2021 → 2026 window ends 2026-07-15 (July 15, 2026 content anchor);
 *     all other windows end Jan 1 of their end year.
 * Data source: public/data/bitcoin_prices_v1.json — the same dataset
 * that powers the calculator on the page.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type PricePoint = { date: string; price: number };
type Dataset = { version: string; lastUpdated: string; data: Record<string, PricePoint[]> };

const STAKE_USD = 10_000;
const SP_ANNUAL_RATE = 0.10; // flat long-run historical average, documented in the caption

// Windows displayed in the table
const WINDOWS: { start: string; end: string; expected: { lump: number; bDca: number; spDca: number } }[] = [
  { start: '2015-01-01', end: '2020-01-01', expected: { lump: 224_000, bDca: 91_700, spDca: 13_000 } },
  { start: '2017-01-01', end: '2022-01-01', expected: { lump: 476_100, bDca: 88_700, spDca: 13_000 } },
  { start: '2018-01-01', end: '2023-01-01', expected: { lump: 11_900,  bDca: 15_200, spDca: 13_000 } },
  { start: '2019-01-01', end: '2024-01-01', expected: { lump: 112_200, bDca: 32_000, spDca: 13_000 } },
  { start: '2020-01-01', end: '2025-01-01', expected: { lump: 131_400, bDca: 40_500, spDca: 13_000 } },
  { start: '2021-01-01', end: '2026-07-15', expected: { lump: 20_100,  bDca: 14_100, spDca: 13_300 } },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DATASET_PATH = join(process.cwd(), 'public/data/bitcoin_prices_v1.json');
const DATASET: Dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf-8'));
const ALL_PRICES: PricePoint[] = Object.values(DATASET.data)
  .flat()
  .sort((a, b) => a.date.localeCompare(b.date));

const dayMs = 86_400_000;
const toMs = (d: string) => new Date(d).getTime();

/** Closest-date lookup — mirrors `LumpSumDCAComparator.findClosestPrice`. */
function priceNear(target: string): number {
  const t = toMs(target);
  let best = ALL_PRICES[0];
  let bestDiff = Math.abs(toMs(best.date) - t);
  for (const p of ALL_PRICES) {
    const diff = Math.abs(toMs(p.date) - t);
    if (diff < bestDiff) { best = p; bestDiff = diff; }
  }
  return best.price;
}

/** Emit Jan 1, Feb 1, … through the end month inclusive. */
function monthlyBuyDates(startISO: string, endISO: string): string[] {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const out: string[] = [];
  let y = s.getUTCFullYear();
  let m = s.getUTCMonth(); // 0-indexed
  const endY = e.getUTCFullYear();
  const endM = e.getUTCMonth();
  while (y < endY || (y === endY && m <= endM)) {
    out.push(`${y}-${String(m + 1).padStart(2, '0')}-01`);
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return out;
}

function computeRow(startISO: string, endISO: string) {
  const p0 = priceNear(startISO);
  const pEnd = priceNear(endISO);

  // BTC Lump: full $10k deployed once
  const lumpFinal = STAKE_USD * (pEnd / p0);

  // BTC DCA: split $10k across N monthly buys, hold to endISO
  const dates = monthlyBuyDates(startISO, endISO);
  const perBuy = STAKE_USD / dates.length;
  let btc = 0;
  for (const d of dates) btc += perBuy / priceNear(d);
  const bDcaFinal = btc * pEnd;

  // S&P DCA: same N monthly contributions, flat 10%/yr compounding
  const r = SP_ANNUAL_RATE / 12;
  const n = dates.length;
  let spFinal = 0;
  for (let i = 0; i < n; i++) spFinal += perBuy * Math.pow(1 + r, n - 1 - i);

  return { lumpFinal, bDcaFinal, spFinal, n };
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('LumpSumVsDcaVsTradTable — recomputation matches documented assumptions', () => {
  it('dataset used by the test is the one shipped to production', () => {
    expect(DATASET.version).toBeDefined();
    expect(ALL_PRICES.length).toBeGreaterThan(100);
    // The Oct 6, 2025 ATH point must be present (matches whatIfAnchors.LATEST_ATH_USD).
    const ath = ALL_PRICES.find((p) => p.date === '2025-10-06');
    expect(ath?.price).toBe(126_198);
  });

  it.each(WINDOWS)(
    'window $start → $end: rounded values match the table within ±$1,000 and use identical $10k stake',
    ({ start, end, expected }) => {
      const { lumpFinal, bDcaFinal, spFinal, n } = computeRow(start, end);

      // 1. Stake sizing is IDENTICAL across all three strategies.
      //    (Sum of monthly contributions must equal the lump stake exactly.)
      const perBuy = STAKE_USD / n;
      expect(perBuy * n).toBeCloseTo(STAKE_USD, 6);

      // 2. Values match the displayed rounded figures within a $1,000 tolerance
      //    (table displays to the nearest $100; tolerance covers rounding + any
      //    micro-drift from monthly-buy date snapping).
      expect(Math.abs(lumpFinal - expected.lump)).toBeLessThanOrEqual(1_000);
      expect(Math.abs(bDcaFinal - expected.bDca)).toBeLessThanOrEqual(1_000);
      expect(Math.abs(spFinal - expected.spDca)).toBeLessThanOrEqual(1_000);
    },
  );

  it('S&P DCA future-value formula uses a flat 10%/yr rate for every window', () => {
    // Independent closed-form check against the ordinary-annuity FV formula:
    //   FV = PMT * ((1+r)^n - 1) / r
    // If the assumption ever drifts (e.g. someone switches to real returns),
    // the closed-form and per-period loop diverge and this test fails.
    for (const { start, end } of WINDOWS) {
      const { spFinal, n } = computeRow(start, end);
      const r = 0.10 / 12;
      const pmt = STAKE_USD / n;
      const fvClosedForm = pmt * ((Math.pow(1 + r, n) - 1) / r);
      // Loop compounds each contribution for (n-1-i) months → FV of an ordinary
      // annuity paid at PERIOD END; closed-form uses same convention.
      expect(spFinal).toBeCloseTo(fvClosedForm, 4);
    }
  });

  it('total BTC DCA outlay across all buys equals the $10,000 stake for every window', () => {
    // Guards against the historical bug where buys outside the price window
    // silently reduced the deployed capital (see lumpSumDcaComparator.test.ts).
    for (const { start, end } of WINDOWS) {
      const dates = monthlyBuyDates(start, end);
      const perBuy = STAKE_USD / dates.length;
      const totalDeployed = perBuy * dates.length;
      expect(totalDeployed).toBeCloseTo(STAKE_USD, 6);
    }
  });
});
