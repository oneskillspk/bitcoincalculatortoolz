import { describe, it, expect } from 'vitest';
import { MiningProfitabilityCalculator, NETWORK_CONSTANTS } from '../miningProfitabilityCalculator';

describe('MiningProfitabilityCalculator', () => {
  it('network constants match post-2024 halving spec', () => {
    expect(NETWORK_CONSTANTS.BLOCK_REWARD).toBe(3.125);
    expect(NETWORK_CONSTANTS.BLOCKS_PER_DAY).toBe(144);
    expect(NETWORK_CONSTANTS.HASH_TARGET_CONSTANT).toBe(2 ** 32);
  });

  it('daily BTC formula: networkShare × 144 × reward, after pool fee', () => {
    const hashRateTh = 100;                       // 100 TH/s miner
    const difficulty = 100e12;                    // 100 T difficulty (synthetic)
    const blockReward = 3.125;
    const poolFee = 1;                            // 1%
    const networkHs = (difficulty * 2 ** 32) / 600;
    const share = (hashRateTh * 1e12) / networkHs;
    const expectedGross = share * 144 * blockReward;
    const expectedNet = expectedGross * (1 - 0.01);

    const r = MiningProfitabilityCalculator.calculate({
      hashRate: hashRateTh,
      powerConsumption: 3000,
      electricityCost: 0.05,
      poolFee,
      hardwareCost: 5000,
      bitcoinPrice: 100_000,
      networkDifficulty: difficulty,
      blockReward,
      difficultyAdjustment: 0,
      currency: 'USD',
    });

    expect(r.dailyBtcMined).toBeCloseTo(expectedNet, 12);
  });

  it('electricity cost: kWh/day = (W/1000) × 24 × $/kWh', () => {
    const r = MiningProfitabilityCalculator.calculate({
      hashRate: 100,
      powerConsumption: 3000,    // 3 kW
      electricityCost: 0.10,     // $0.10/kWh
      poolFee: 0,
      hardwareCost: 0,
      bitcoinPrice: 100_000,
      networkDifficulty: 100e12,
      blockReward: 3.125,
      difficultyAdjustment: 0,
      currency: 'USD',
    });
    // 3 kW * 24 h = 72 kWh/day * $0.10 = $7.20
    expect(r.dailyElectricityCost).toBeCloseTo(7.20, 6);
  });

  it('breakEvenDays = ceil(hardwareCost / dailyProfit) when profitable', () => {
    const r = MiningProfitabilityCalculator.calculate({
      hashRate: 1000,            // big rig
      powerConsumption: 3000,
      electricityCost: 0.05,
      poolFee: 1,
      hardwareCost: 10_000,
      bitcoinPrice: 100_000,
      networkDifficulty: 100e12,
      blockReward: 3.125,
      difficultyAdjustment: 0,
      currency: 'USD',
    });
    if (r.dailyProfit > 0) {
      expect(r.breakEvenDays).toBe(Math.ceil(10_000 / r.dailyProfit));
    }
  });

  it('unprofitable rig → breakEvenDays = Infinity', () => {
    const r = MiningProfitabilityCalculator.calculate({
      hashRate: 1,               // tiny
      powerConsumption: 3000,
      electricityCost: 1,        // expensive electricity
      poolFee: 5,
      hardwareCost: 10_000,
      bitcoinPrice: 100_000,
      networkDifficulty: 100e15, // huge difficulty
      blockReward: 3.125,
      difficultyAdjustment: 0,
      currency: 'USD',
    });
    expect(r.dailyProfit).toBeLessThan(0);
    expect(r.breakEvenDays).toBe(Infinity);
  });

  it('projections has 12 monthly entries, sums to yearly totals', () => {
    const r = MiningProfitabilityCalculator.calculate({
      hashRate: 100,
      powerConsumption: 3000,
      electricityCost: 0.05,
      poolFee: 1,
      hardwareCost: 5000,
      bitcoinPrice: 100_000,
      networkDifficulty: 100e12,
      blockReward: 3.125,
      difficultyAdjustment: 3.5,
      currency: 'USD',
    });
    expect(r.projections).toHaveLength(12);
    const sumBtc = r.projections.reduce((s, p) => s + p.btcMined, 0);
    expect(r.yearlyBtcMined).toBeCloseTo(sumBtc, 9);
  });
});
