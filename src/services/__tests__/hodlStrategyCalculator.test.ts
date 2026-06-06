import { describe, it, expect } from 'vitest';
import { HODLStrategyCalculator } from '../hodlStrategyCalculator';
import type { BitcoinPrice } from '../bitcoinApi';

// Generate synthetic linear price series: $10k → $20k over 365 days
const generatePrices = (start: number, end: number, days: number): BitcoinPrice[] => {
  const arr: BitcoinPrice[] = [];
  const startDate = new Date('2024-01-01').getTime();
  for (let i = 0; i < days; i++) {
    const price = start + ((end - start) * i) / (days - 1);
    arr.push({ date: new Date(startDate + i * 86400000).toISOString().slice(0, 10), price });
  }
  return arr;
};

describe('HODLStrategyCalculator', () => {
  const prices = generatePrices(10_000, 20_000, 365);
  const params = {
    investmentAmount: 10_000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    currency: 'USD',
    strategies: ['hodl', 'dca-weekly', 'dca-monthly'] as ('hodl' | 'dca-weekly' | 'dca-monthly' | 'buy-dip' | 'rebalance')[],
  };

  it('HODL: buy at start price, final value = amount * (endPrice/startPrice)', () => {
    const result = HODLStrategyCalculator.calculateStrategies({ ...params, strategies: ['hodl'] }, prices);
    const hodl = result.strategies[0];
    // 10k / 10k = 1 BTC * 20k = 20k → 100% ROI
    expect(hodl.btcAcquired).toBeCloseTo(1, 6);
    expect(hodl.finalValue).toBeCloseTo(20_000, 2);
    expect(hodl.roiPercentage).toBeCloseTo(100, 2);
  });

  it('DCA: averageBuyPrice is between min and max price', () => {
    const result = HODLStrategyCalculator.calculateStrategies({ ...params, strategies: ['dca-monthly'] }, prices);
    const dca = result.strategies[0];
    expect(dca.averageBuyPrice).toBeGreaterThan(10_000);
    expect(dca.averageBuyPrice).toBeLessThan(20_000);
    expect(dca.numberOfPurchases).toBeGreaterThan(0);
  });

  it('throws when no price data falls in the range', () => {
    expect(() =>
      HODLStrategyCalculator.calculateStrategies(
        { ...params, startDate: new Date('2030-01-01'), endDate: new Date('2030-12-31') },
        prices,
      ),
    ).toThrow(/No price data/);
  });

  it('rankStrategies by roi sorts descending', () => {
    const result = HODLStrategyCalculator.calculateStrategies(params, prices);
    const ranked = HODLStrategyCalculator.rankStrategies(result.strategies, 'roi');
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i - 1].roiPercentage).toBeGreaterThanOrEqual(ranked[i].roiPercentage);
    }
  });
});
