import { describe, it, expect } from 'vitest';
import {
  futureValueLumpSum,
  futureValueAnnuity,
  futureValueCombined,
  adjustForInflation,
  breakevenCAGR,
  generateProjection,
  type InvestmentInputs,
} from '../investmentProjectionCalculator';

// Reference formulas:
//   FV lump  = PV·(1+r)^n
//   FV annuity (monthly) = PMT·[((1+r/12)^(12n) - 1)/(r/12)]
//   Real value = Nominal / (1+i)^n

describe('investmentProjectionCalculator', () => {
  it('futureValueLumpSum: $10k at 10%/yr, 10y → $25,937.42', () => {
    const fv = futureValueLumpSum(10_000, 0.10, 10);
    expect(fv).toBeCloseTo(25_937.42, 2);
  });

  it('futureValueLumpSum: rate=0 → unchanged', () => {
    expect(futureValueLumpSum(1000, 0, 5)).toBe(1000);
  });

  it('futureValueAnnuity: $100/mo, 12%/yr, 10y ≈ $23,003.87 (ordinary annuity, end-of-period)', () => {
    // Ordinary monthly annuity: 100 * ((1.01^120 - 1)/0.01) ≈ 23003.87
    const fv = futureValueAnnuity(100, 0.12, 10);
    expect(fv).toBeCloseTo(23_003.87, 0);
  });

  it('futureValueAnnuity: rate=0 → PMT × n × 12', () => {
    expect(futureValueAnnuity(100, 0, 5)).toBe(100 * 5 * 12);
  });

  it('futureValueCombined = lump + annuity components', () => {
    const combined = futureValueCombined(1000, 50, 0.08, 5);
    const lump = futureValueLumpSum(1000, 0.08, 5);
    const ann = futureValueAnnuity(50, 0.08, 5);
    expect(combined).toBeCloseTo(lump + ann, 6);
  });

  it('adjustForInflation: $1000 future / 3% / 10y ≈ $744.09 real', () => {
    expect(adjustForInflation(1000, 0.03, 10)).toBeCloseTo(744.09, 2);
  });

  it('breakevenCAGR equals inflation rate', () => {
    expect(breakevenCAGR(0.07)).toBe(0.07);
  });

  it('generateProjection: year 0 reflects starting lump sum and BTC holdings', () => {
    const inputs: InvestmentInputs = {
      lumpSum: 10_000,
      monthlyContribution: 0,
      currentBtcPrice: 100_000,
      timeHorizon: 5,
      inflationRate: 0.03,
    } as InvestmentInputs;
    const proj = generateProjection(inputs, 0.10);
    expect(proj).toHaveLength(6); // years 0..5
    expect(proj[0].year).toBe(0);
    expect(proj[0].nominalValue).toBe(10_000);
    expect(proj[0].btcHoldings).toBeCloseTo(0.1, 8);
    // Year 5 nominal = lump * 1.1^5
    expect(proj[5].nominalValue).toBeCloseTo(10_000 * 1.1 ** 5, 2);
  });

  it('generateProjection: zero BTC price guards division and keeps holdings 0', () => {
    const inputs: InvestmentInputs = {
      lumpSum: 1000,
      monthlyContribution: 100,
      currentBtcPrice: 0,
      timeHorizon: 1,
      inflationRate: 0.02,
    } as InvestmentInputs;
    const proj = generateProjection(inputs, 0.05);
    expect(proj[0].btcHoldings).toBe(0);
    expect(Number.isFinite(proj[1].nominalValue)).toBe(true);
  });
});
