import { describe, it, expect } from 'vitest';
import { calculateBtcVsRealEstate, defaultInputs } from '../btcVsRealEstateCalculator';

describe('btcVsRealEstateCalculator', () => {
  it('same-cash mode: BTC investment = down + closing costs', () => {
    const r = calculateBtcVsRealEstate({ ...defaultInputs, comparisonMode: 'same-cash' });
    const down = defaultInputs.propertyPrice * defaultInputs.downPaymentPercent / 100;
    const closing = defaultInputs.propertyPrice * defaultInputs.closingCostPercent / 100;
    expect(r.btcInvestment).toBeCloseTo(down + closing, 6);
  });

  it('all-cash mode: BTC investment = property + closing costs', () => {
    const r = calculateBtcVsRealEstate({ ...defaultInputs, comparisonMode: 'all-cash' as never });
    const closing = defaultInputs.propertyPrice * defaultInputs.closingCostPercent / 100;
    expect(r.btcInvestment).toBeCloseTo(defaultInputs.propertyPrice + closing, 6);
  });

  it('high BTC growth wins over real estate in 10y default scenario', () => {
    const r = calculateBtcVsRealEstate(defaultInputs);
    expect(r.winner).toBe('btc');
    expect(r.btcFinalValue).toBeGreaterThan(r.reFinalNetValue);
  });

  it('zero BTC growth → real estate wins', () => {
    const r = calculateBtcVsRealEstate({ ...defaultInputs, btcGrowthRate: 0, horizonYears: 10 });
    expect(r.winner).toBe('real-estate');
  });

  it('BTC value compounds: yearN = investment * (1+g)^N', () => {
    const r = calculateBtcVsRealEstate({ ...defaultInputs, horizonYears: 5, btcGrowthRate: 20 });
    const last = r.yearlyBreakdown.at(-1)!;
    expect(last.btcValue).toBeCloseTo(r.btcInvestment * Math.pow(1.2, 5), 2);
  });

  it('yearly breakdown length = horizonYears', () => {
    const r = calculateBtcVsRealEstate({ ...defaultInputs, horizonYears: 7 });
    expect(r.yearlyBreakdown).toHaveLength(7);
  });

  it('ROI math: btcROI = (final/invested - 1) * 100', () => {
    const r = calculateBtcVsRealEstate(defaultInputs);
    expect(r.btcROI).toBeCloseTo((r.btcFinalValue / r.btcInvestment - 1) * 100, 4);
  });
});
