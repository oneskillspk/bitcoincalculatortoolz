import { describe, it, expect } from 'vitest';
import { calculateTimeMachine, PRESET_DATES } from '../timeMachineService';

describe('timeMachineService.calculateTimeMachine', () => {
  it('pizza day: $41 buys 10000 BTC at $0.0041; $50k today → $500M', () => {
    const r = calculateTimeMachine(0.0041, 50_000, 41);
    expect(r.btcAmount).toBeCloseTo(10_000, 6);
    expect(r.currentValue).toBeCloseTo(500_000_000, 0);
    expect(r.profit).toBeCloseTo(500_000_000 - 41, 0);
    expect(r.roi).toBeCloseTo(((500_000_000 - 41) / 41) * 100, 1);
  });

  it('breakeven: same price = 0% ROI', () => {
    const r = calculateTimeMachine(50_000, 50_000, 1000);
    expect(r.roi).toBe(0);
    expect(r.profit).toBe(0);
  });

  it('preset dates include canonical Bitcoin milestones', () => {
    const labels = PRESET_DATES.map((p) => p.label);
    expect(labels).toContain('Pizza Day');
    expect(labels).toContain('Halving #4');
    expect(labels).toContain('Spot ETF Launch');
  });
});
