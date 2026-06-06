import { describe, it, expect } from 'vitest';
import { calculateScenario, historicalDominance } from '../dominanceService';

describe('dominanceService.calculateScenario', () => {
  it('total mcap = trillions * 1e12; impliedPrice = btcMcap / supply', () => {
    const r = calculateScenario(4, 60, 19_700_000);
    // total = $4T, btcMcap = $4T*0.6 = $2.4T, implied = 2.4e12/19.7M ≈ $121,827
    expect(r.totalMarketCap).toBe(4e12);
    expect(r.dominance).toBe(60);
    expect(r.impliedBtcPrice).toBeCloseTo(2.4e12 / 19_700_000, 2);
  });

  it('100% dominance → all mcap is BTC', () => {
    const r = calculateScenario(2, 100, 19_700_000);
    expect(r.impliedBtcPrice).toBeCloseTo(2e12 / 19_700_000, 2);
  });

  it('historical timeline is chronologically sorted', () => {
    for (let i = 1; i < historicalDominance.length; i++) {
      expect(historicalDominance[i].date >= historicalDominance[i - 1].date).toBe(true);
    }
  });
});
