import { describe, it, expect } from 'vitest';
import { calculateStakingRewards, compareAllProtocols, STAKING_PROTOCOLS } from '../stakingCalculator';

describe('stakingCalculator', () => {
  it('compounding: 1 BTC @ 4.5% for 5 years = 1.0451^5 ≈ 1.24618 BTC', () => {
    const r = calculateStakingRewards(
      { btcAmount: 1, protocolId: 'babylon', years: 5, compounding: true },
      100_000,
    );
    expect(r!.finalBtcBalance).toBeCloseTo(Math.pow(1.045, 5), 8);
    expect(r!.btcRewards).toBeCloseTo(Math.pow(1.045, 5) - 1, 8);
    expect(r!.effectiveAPY).toBeCloseTo(4.5, 6);
  });

  it('simple interest: 1 BTC @ 4.5% for 5y = 1 + 0.045*5 = 1.225 BTC', () => {
    const r = calculateStakingRewards(
      { btcAmount: 1, protocolId: 'babylon', years: 5, compounding: false },
      100_000,
    );
    expect(r!.finalBtcBalance).toBeCloseTo(1.225, 8);
  });

  it('USD value = balance * price', () => {
    const r = calculateStakingRewards(
      { btcAmount: 2, protocolId: 'binance-flexible', years: 1, compounding: true },
      80_000,
    );
    expect(r!.usdFinalValueAtCurrentPrice).toBeCloseTo(r!.finalBtcBalance * 80_000, 4);
  });

  it('unknown protocol id → null', () => {
    const r = calculateStakingRewards(
      { btcAmount: 1, protocolId: 'nonexistent', years: 1, compounding: true },
      100_000,
    );
    expect(r).toBeNull();
  });

  it('compareAllProtocols returns one result per protocol', () => {
    const all = compareAllProtocols(1, 3, true, 100_000);
    expect(all).toHaveLength(STAKING_PROTOCOLS.length);
  });

  it('yearly breakdown length matches years', () => {
    const r = calculateStakingRewards(
      { btcAmount: 1, protocolId: 'babylon', years: 7, compounding: true },
      100_000,
    );
    expect(r!.yearlyBreakdown).toHaveLength(7);
  });
});
