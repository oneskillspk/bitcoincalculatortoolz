import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BitcoinSupplyService } from '../bitcoinSupplyService';

// Bitcoin supply formula:
//   After N full halvings (each 210k blocks): supply = 210000 * 50 * (1 - 0.5^N) / 0.5
//   First epoch only (0..210000): supply(h) = h * 50

describe('bitcoinSupplyService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getSupplyData @ height 920000 → 19.9375M BTC mined, next halving = 1.05M', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => 920_000,
    }) as never;
    const data = await BitcoinSupplyService.getSupplyData();
    // four full epochs (210k blocks each at 50/25/12.5/6.25 BTC) + 80k blocks @ 3.125
    // = 210000 * 93.75 + 80000 * 3.125 = 19,687,500 + 250,000 = 19,937,500
    expect(data.currentSupply).toBe(19_937_500);
    expect(data.totalSupply).toBe(21_000_000);
    expect(data.nextHalving.blockHeight).toBe(1_050_000);
    expect(data.nextHalving.blocksRemaining).toBe(130_000);
  });

  // ✅ FIX for BUG-001: at an exact halving boundary block (e.g. 840000),
  // nextHalving must advance to h + 210_000 (not stay on h with 0 remaining).
  it('boundary fix: at exact halving block, next halving advances by 210k', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ json: async () => 840_000 }) as never;
    const data = await BitcoinSupplyService.getSupplyData();
    expect(data.nextHalving.blockHeight).toBe(1_050_000);
    expect(data.nextHalving.blocksRemaining).toBe(210_000);
  });

  it('getSupplyData @ height 210000 → exactly 10.5M BTC mined', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => 210_000,
    }) as never;
    const data = await BitcoinSupplyService.getSupplyData();
    expect(data.currentSupply).toBe(10_500_000);
  });

  it('fallback path: returns plausible supply when fetch fails', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline')) as never;
    const data = await BitcoinSupplyService.getSupplyData();
    expect(data.totalSupply).toBe(21_000_000);
    expect(data.currentSupply).toBeGreaterThan(15_000_000);
    expect(data.currentSupply).toBeLessThan(21_000_000);
    expect(data.percentageMined).toBeGreaterThan(0);
  });
});
