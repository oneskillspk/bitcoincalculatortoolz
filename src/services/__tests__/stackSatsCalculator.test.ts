import { describe, it, expect, vi } from 'vitest';

vi.mock('../bitcoinApi', () => ({
  bitcoinApi: {
    getCurrentPrice: vi.fn().mockResolvedValue(100_000),
  },
}));

import { StackSatsCalculator } from '../stackSatsCalculator';

describe('StackSatsCalculator', () => {
  it('reaches a 0.5 BTC goal in finite months at modest growth, $2000/mo from zero', async () => {
    const r = await StackSatsCalculator.calculateGoal({
      currentBtcHoldings: 0,
      targetBtcGoal: 0.5,
      monthlyContribution: 2000,
      currency: 'USD',
      expectedGrowthRate: 8,
      startDate: new Date('2024-01-01'),
    });
    expect(r.monthsToGoal).toBeGreaterThan(0);
    expect(r.monthsToGoal).toBeLessThan(600);
    expect(r.totalBtcAtGoal).toBe(0.5);
    expect(r.totalFiatInvested).toBeCloseTo(r.monthsToGoal * 2000, 2);
  });

  it('produces 4 progress milestones at 25/50/75/100%', async () => {
    const r = await StackSatsCalculator.calculateGoal({
      currentBtcHoldings: 0.1,
      targetBtcGoal: 1,
      monthlyContribution: 500,
      currency: 'USD',
      expectedGrowthRate: 15,
      startDate: new Date('2024-01-01'),
    });
    expect(r.progressMilestones.map((m) => m.percentage)).toEqual([25, 50, 75, 100]);
  });

  it('alternative scenarios: faster price growth → fewer BTC accumulated per dollar → more months', async () => {
    const r = await StackSatsCalculator.calculateGoal({
      currentBtcHoldings: 0,
      targetBtcGoal: 0.5,
      monthlyContribution: 2000,
      currency: 'USD',
      expectedGrowthRate: 15,
      startDate: new Date('2024-01-01'),
    });
    // Higher growth → harder to reach a fixed BTC goal
    expect(r.alternativeScenarios.optimistic.months).toBeGreaterThanOrEqual(
      r.alternativeScenarios.conservative.months,
    );
  });

  it('currentProgress = currentHoldings / target * 100', async () => {
    const r = await StackSatsCalculator.calculateGoal({
      currentBtcHoldings: 0.25,
      targetBtcGoal: 1,
      monthlyContribution: 1000,
      currency: 'USD',
      expectedGrowthRate: 15,
      startDate: new Date('2024-01-01'),
    });
    expect(r.currentProgress).toBeCloseTo(25, 6);
  });
});
