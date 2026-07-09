import { describe, it, expect } from 'vitest';
import { LumpSumDCAComparator } from '../lumpSumDcaComparator';
import type { BitcoinPrice } from '../bitcoinApi';

const generatePrices = (start: number, end: number, days: number): BitcoinPrice[] => {
  const arr: BitcoinPrice[] = [];
  const startMs = new Date('2024-01-01').getTime();
  for (let i = 0; i < days; i++) {
    arr.push({
      date: new Date(startMs + i * 86400000).toISOString().slice(0, 10),
      price: start + ((end - start) * i) / (days - 1),
    });
  }
  return arr;
};

describe('LumpSumDCAComparator', () => {
  it('generateDCAPurchaseDates: weekly produces ~52 dates per year', () => {
    const dates = LumpSumDCAComparator.generateDCAPurchaseDates(
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'weekly',
    );
    expect(dates.length).toBeGreaterThanOrEqual(52);
    expect(dates.length).toBeLessThanOrEqual(53);
  });

  it('generateDCAPurchaseDates: monthly produces ~12 dates', () => {
    const dates = LumpSumDCAComparator.generateDCAPurchaseDates(
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'monthly',
    );
    expect(dates.length).toBeGreaterThanOrEqual(12);
    expect(dates.length).toBeLessThanOrEqual(13);
  });

  it('calculateLumpSum: all-in at start, ROI matches price ratio', () => {
    const prices = generatePrices(10_000, 20_000, 365);
    const r = LumpSumDCAComparator.calculateLumpSum(
      { amount: 10_000, investmentDate: new Date('2024-01-01'), currency: 'USD' },
      prices,
    );
    expect(r.strategy).toBe('lump-sum');
    expect(r.totalBitcoin).toBeCloseTo(1, 6);
    expect(r.currentValue).toBeCloseTo(20_000, 2);
    expect(r.roiPercentage).toBeCloseTo(100, 2);
    expect(r.purchases).toHaveLength(1);
  });

  it('findClosestPrice: exact date match', () => {
    const prices = generatePrices(10_000, 20_000, 30);
    const p = LumpSumDCAComparator.findClosestPrice('2024-01-15', prices);
    expect(p).toBeGreaterThan(10_000);
    expect(p).toBeLessThan(20_000);
  });

  it('calculateDCA: totalInvested matches user input even when purchase dates fall outside price data', () => {
    // 12 monthly buys of $1,000 each, but price dataset only covers first 6 months.
    // Bug fix: `totalAmount` must be divided across only the buys that can execute,
    // so totalInvested always equals the user-requested totalAmount.
    const prices: BitcoinPrice[] = Array.from({ length: 6 }, (_, i) => ({
      date: `2024-0${i + 1}-15`,
      price: 60_000,
    }));
    const r = LumpSumDCAComparator.calculateDCA(
      {
        totalAmount: 12_000,
        frequency: 'monthly',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-15'),
        currency: 'USD',
      },
      prices,
    );
    expect(r.totalInvested).toBeCloseTo(12_000, 2);
    expect(r.purchases.length).toBeGreaterThan(0);
  });
});
