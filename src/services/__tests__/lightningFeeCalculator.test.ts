import { describe, it, expect } from 'vitest';
import {
  calculateLightningFee,
  calculateChannelEconomics,
  convertToSats,
  convertFromSats,
  formatSats,
  formatPercent,
  LIGHTNING_CONSTANTS,
} from '../lightningFeeCalculator';

// Reference: LN fee = (baseFee_msat × hops)/1000 + (amount_sat × ppm/1e6) × hops

describe('lightningFeeCalculator', () => {
  it('constants: 1 BTC = 1e8 sats, 1 sat = 1000 msat', () => {
    expect(LIGHTNING_CONSTANTS.SATS_PER_BTC).toBe(100_000_000);
    expect(LIGHTNING_CONSTANTS.MSAT_PER_SAT).toBe(1000);
  });

  it('calculateLightningFee: 100k sats, 3 hops, base 1000 msat, 500 ppm', () => {
    // base = (1000 * 3)/1000 = 3 sats
    // prop = (100000 * 500/1e6) * 3 = 50 * 3 = 150 sats
    // total = 153 sats
    const fee = calculateLightningFee(
      { amountSats: 100_000, estimatedHops: 3, baseFeePerHop: 1000, feeRatePpm: 500 },
      100_000,
    );
    expect(fee.baseFeeTotal).toBeCloseTo(3, 9);
    expect(fee.proportionalFeeTotal).toBeCloseTo(150, 9);
    expect(fee.totalFeeSats).toBeCloseTo(153, 9);
    // USD: 153 / 1e8 * 100000 = 0.153
    expect(fee.totalFeeUsd).toBeCloseTo(0.153, 6);
    // Effective rate = 153/100000 * 100 = 0.153%
    expect(fee.effectiveFeeRate).toBeCloseTo(0.153, 6);
  });

  it('calculateLightningFee: hop breakdown length matches hops & cumulative grows', () => {
    const fee = calculateLightningFee(
      { amountSats: 10_000, estimatedHops: 4, baseFeePerHop: 1000, feeRatePpm: 100 },
      100_000,
    );
    expect(fee.feeBreakdownByHop).toHaveLength(4);
    const cumul = fee.feeBreakdownByHop.map((h) => h.cumulativeFee);
    expect(cumul.every((v, i) => i === 0 || v >= cumul[i - 1])).toBe(true);
  });

  it('calculateLightningFee: zero amount → effective rate 0, no NaN', () => {
    const fee = calculateLightningFee(
      { amountSats: 0, estimatedHops: 2, baseFeePerHop: 1000, feeRatePpm: 500 },
      100_000,
    );
    expect(fee.effectiveFeeRate).toBe(0);
    expect(Number.isFinite(fee.totalFeeSats)).toBe(true);
  });

  it('calculateChannelEconomics: 1M sats channel, 500ppm, BTC $100k', () => {
    // daily volume = 100k sats, daily revenue = 100k * 500/1e6 = 50 sats
    const econ = calculateChannelEconomics(1_000_000, 500, 1000, 100_000);
    expect(econ.estimatedDailyRoutingVolume).toBe(100_000);
    expect(econ.estimatedDailyRevenue).toBeCloseTo(50, 6);
    expect(econ.estimatedAnnualRevenue).toBeCloseTo(50 * 365, 6);
    expect(econ.channelSizeBtc).toBeCloseTo(0.01, 9);
  });

  it('calculateChannelEconomics: zero channel returns sentinel object', () => {
    const econ = calculateChannelEconomics(0, 500, 1000, 100_000);
    expect(econ.estimatedAnnualRevenue).toBe(0);
    expect(econ.breakEvenDays).toBeNull();
  });

  it('convertToSats / convertFromSats roundtrip', () => {
    const sats = convertToSats(1, 'btc', 100_000);
    expect(sats).toBe(1e8);
    expect(convertFromSats(sats, 'btc', 100_000)).toBe(1);

    const usdSats = convertToSats(100, 'usd', 100_000);
    expect(usdSats).toBe((100 / 100_000) * 1e8);
    expect(convertFromSats(usdSats, 'usd', 100_000)).toBeCloseTo(100, 6);
  });

  it('convertToSats: zero btc price guards division', () => {
    expect(convertToSats(100, 'usd', 0)).toBe(0);
  });

  it('formatSats picks correct unit suffix', () => {
    expect(formatSats(150_000_000)).toMatch(/BTC$/);
    expect(formatSats(2_500_000)).toMatch(/M sats$/);
    expect(formatSats(5_000)).toMatch(/K sats$/);
    expect(formatSats(123)).toMatch(/sats$/);
  });

  it('formatPercent handles tiny values', () => {
    expect(formatPercent(0.0001)).toBe('<0.001%');
    expect(formatPercent(2.5)).toBe('2.50%');
  });
});
