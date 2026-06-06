import { describe, it, expect } from 'vitest';
import { transactionFeeCalculator } from '../transactionFeeCalculator';

// BIP rules:
//   P2PKH (legacy):  ~148 vB input, 34 vB output, 10 vB overhead
//   P2WPKH (native): ~68 vB input, 31 vB output, 10.5 vB overhead

describe('transactionFeeCalculator', () => {
  it('calculateTransactionSize: legacy 1in1out = 148+34+10 = 192 vB', () => {
    const size = transactionFeeCalculator.calculateTransactionSize({
      inputCount: 1,
      outputCount: 1,
      addressType: 'legacy',
    });
    expect(size).toBe(192);
  });

  it('calculateTransactionSize: native-segwit 2in2out = 68*2 + 31*2 + 10.5 = 208.5 → ceil 209', () => {
    const size = transactionFeeCalculator.calculateTransactionSize({
      inputCount: 2,
      outputCount: 2,
      addressType: 'native-segwit',
    });
    expect(size).toBe(209);
  });

  it('taproot is smaller than legacy for same in/out count', () => {
    const legacy = transactionFeeCalculator.calculateTransactionSize({ inputCount: 2, outputCount: 2, addressType: 'legacy' });
    const taproot = transactionFeeCalculator.calculateTransactionSize({ inputCount: 2, outputCount: 2, addressType: 'taproot' });
    expect(taproot).toBeLessThan(legacy);
  });

  it('calculateFeeEstimate: 200 vB × 50 sat/vB = 10000 sats; USD = 10000/1e8 × price', () => {
    const fee = transactionFeeCalculator.calculateFeeEstimate(
      { inputCount: 1, outputCount: 1, addressType: 'legacy', amountSats: 1_000_000, priority: 'fastest' },
      50,
      100_000,
    );
    expect(fee.estimatedSize).toBe(192);
    expect(fee.totalFeeSats).toBe(Math.ceil(192 * 50));
    expect(fee.totalFeeUsd).toBeCloseTo((fee.totalFeeSats / 1e8) * 100_000, 6);
    // fee %: 9600/1e6*100 = 0.96
    expect(fee.feePercentage).toBeCloseTo((fee.totalFeeSats / 1_000_000) * 100, 6);
  });

  it('calculateFeeEstimate: zero amount → feePercentage = 0 (no NaN)', () => {
    const fee = transactionFeeCalculator.calculateFeeEstimate(
      { inputCount: 1, outputCount: 1, addressType: 'native-segwit', amountSats: 0, priority: 'economy' },
      10,
      100_000,
    );
    expect(fee.feePercentage).toBe(0);
  });

  it('calculateSavingsVsLegacy: native-segwit cheaper than legacy', () => {
    const pct = transactionFeeCalculator.calculateSavingsVsLegacy('native-segwit', 2, 2);
    expect(pct).toBeGreaterThan(30);
    expect(transactionFeeCalculator.calculateSavingsVsLegacy('legacy', 2, 2)).toBe(0);
  });
});
