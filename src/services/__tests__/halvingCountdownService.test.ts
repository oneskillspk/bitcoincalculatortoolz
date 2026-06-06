import { describe, it, expect } from 'vitest';
import { HalvingCountdownService } from '../halvingCountdownService';

// Bitcoin halving spec:
//   blocks per halving = 210,000
//   epoch 4 starts at block 840,000 (reward 3.125)
//   epoch 5 starts at block 1,050,000 (reward 1.5625)

describe('halvingCountdownService', () => {
  it('calculateCountdown: at 840k → current reward 3.125, next 1.5625', () => {
    const c = HalvingCountdownService.calculateCountdown(840_000);
    expect(c.currentReward).toBeCloseTo(3.125, 6);
    expect(c.nextReward).toBeCloseTo(1.5625, 6);
    expect(c.blocksRemaining).toBe(210_000);
    expect(c.epochProgress).toBe(0);
  });

  it('calculateCountdown: mid-epoch progress at block 945,000 = 50%', () => {
    const c = HalvingCountdownService.calculateCountdown(945_000);
    expect(c.epochProgress).toBeCloseTo(50, 6);
    expect(c.blocksRemaining).toBe(105_000);
  });

  it('calculateCountdown: past next halving block → blocksRemaining clamped to 0', () => {
    const c = HalvingCountdownService.calculateCountdown(1_100_000);
    expect(c.blocksRemaining).toBe(0);
    expect(c.estimatedTimeMs).toBe(0);
  });

  it('calculateSupplySchedule: first point reflects 50 BTC reward', () => {
    const sched = HalvingCountdownService.calculateSupplySchedule();
    expect(sched[0].blockReward).toBe(50);
    expect(sched[0].halvingNumber).toBe(0);
    // After first period: 210000 * 50 = 10.5M BTC
    expect(sched[0].totalSupply).toBe(10_500_000);
  });

  it('calculateSupplySchedule: total supply converges toward 21M and never exceeds it', () => {
    const sched = HalvingCountdownService.calculateSupplySchedule();
    for (const p of sched) {
      expect(p.totalSupply).toBeLessThanOrEqual(21_000_000);
    }
    expect(sched.at(-1)!.totalSupply).toBeGreaterThan(20_999_000);
  });

  it('calculateSupplySchedule: reward halves each row', () => {
    const sched = HalvingCountdownService.calculateSupplySchedule();
    for (let i = 1; i < sched.length; i++) {
      expect(sched[i].blockReward).toBeCloseTo(sched[i - 1].blockReward / 2, 10);
    }
  });

  it('calculateProjection: scenarios scale current price by historical multipliers', () => {
    const fakeHalvings = [
      { number: 1, date: '2012-11-28', blockHeight: 210_000, rewardBefore: 50, rewardAfter: 25, btcPrice: 12, price6MonthsAfter: 120, price1YearAfter: 1200, price18MonthsAfter: 600, allTimeHighAfter: 1100 },
      { number: 2, date: '2016-07-09', blockHeight: 420_000, rewardBefore: 25, rewardAfter: 12.5, btcPrice: 650, price6MonthsAfter: 750, price1YearAfter: 2500, price18MonthsAfter: 9000, allTimeHighAfter: 19800 },
    ];
    const proj = HalvingCountdownService.calculateProjection(50_000, fakeHalvings as never);
    expect(proj).toHaveLength(3);
    expect(proj[0].label).toBe('Conservative');
    expect(proj[2].label).toBe('Optimistic');
    expect(proj[2].peakPrice).toBeGreaterThan(proj[0].peakPrice);
  });
});
