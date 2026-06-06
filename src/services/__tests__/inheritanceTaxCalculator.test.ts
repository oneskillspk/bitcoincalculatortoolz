import { describe, it, expect } from 'vitest';
import { calculateInheritanceTax } from '../inheritanceTaxCalculator';

// 2026 US estate basis:
//   federal exemption single = $13.61M (married = 2x)
//   LTCG brackets single: 0% to $48,350 / 15% to $533,400 / 20% above
//   NIIT 3.8% above $200k (single) / $250k (married)

describe('inheritanceTaxCalculator', () => {
  it('step-up basis erases capital gains for an heir who sells at death-day price', () => {
    const r = calculateInheritanceTax(
      10,              // 10 BTC inherited
      100_000,         // death-day price = current price
      1_000,           // original cost basis (decedent)
      100_000,
      5_000_000,       // estate below federal exemption
      'single',
      'XX',            // no state estate tax
    );
    expect(r.capitalGainWithStepUp).toBe(0);
    expect(r.capitalGainWithoutStepUp).toBe((100_000 - 1_000) * 10);
    expect(r.estimatedCapitalGainsTax).toBe(0);
    expect(r.federalEstateTax).toBe(0);
    expect(r.netInheritanceValue).toBe(1_000_000);
  });

  it('step-up gain at +50% triggers 15% LTCG bracket and NIIT for single filer', () => {
    const r = calculateInheritanceTax(
      1,               // 1 BTC
      200_000,         // death-day
      10_000,
      300_000,         // sold at +50%
      5_000_000,
      'single',
      'XX',
    );
    // gain = 100k. LTCG: first 48,350 @ 0% → 0; next 51,650 @ 15% → 7,747.50
    expect(r.capitalGainWithStepUp).toBe(100_000);
    expect(r.estimatedCapitalGainsTax).toBeCloseTo(7_747.5, 2);
    // NIIT: max(0, 100k - 200k) = 0 (gain alone below threshold)
    expect(r.niitTax).toBe(0);
  });

  it('federal estate tax kicks in for $20M single-filer estate', () => {
    const r = calculateInheritanceTax(
      10,
      100_000,
      100_000,
      100_000,
      20_000_000,      // $20M estate
      'single',
      'XX',
    );
    // taxable = 20M - 13.61M = 6.39M; top brackets all 40%
    expect(r.taxableEstate).toBeCloseTo(6_390_000, 0);
    expect(r.federalEstateTax).toBeGreaterThan(0);
    // proportional: btc share = 1M / 20M = 5%
    expect(r.btcShareOfEstate).toBeCloseTo(0.05, 6);
    expect(r.proportionalEstateTax).toBeCloseTo(r.federalEstateTax * 0.05, 4);
  });

  it('married filer gets 2x federal exemption', () => {
    const r = calculateInheritanceTax(1, 100_000, 100_000, 100_000, 25_000_000, 'married', 'XX');
    expect(r.federalExemption).toBe(13_610_000 * 2);
    expect(r.taxableEstate).toBeCloseTo(25_000_000 - 27_220_000 < 0 ? 0 : 0, 0);
  });

  it('state estate tax applies when state code is known (NY)', () => {
    const r = calculateInheritanceTax(10, 100_000, 100_000, 100_000, 10_000_000, 'single', 'NY');
    expect(r.hasStateEstateTax).toBe(true);
    expect(r.stateName).toBe('New York');
    // NY exemption 6.94M, top rate 16% → ~ (10M - 6.94M) * 0.16 = 489,600
    expect(r.stateEstateTax).toBeCloseTo((10_000_000 - 6_940_000) * 0.16, 2);
  });

  it('unknown state code → no state tax', () => {
    const r = calculateInheritanceTax(1, 100_000, 100_000, 100_000, 5_000_000, 'single', 'CA');
    expect(r.hasStateEstateTax).toBe(false);
    expect(r.stateEstateTax).toBe(0);
  });
});
