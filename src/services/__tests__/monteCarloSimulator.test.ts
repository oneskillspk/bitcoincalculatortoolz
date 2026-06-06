import { describe, it, expect } from 'vitest';
import { MonteCarloSimulator } from '../monteCarloSimulator';

describe('MonteCarloSimulator', () => {
  it('zero volatility → all paths equal deterministic drift', () => {
    const r = MonteCarloSimulator.runSimulation({
      initialPrice: 100_000,
      projectionDays: 30,
      simulationCount: 50,
      volatility: 0,
      drift: 0,
    });
    // With zero vol & zero drift, prices stay flat
    expect(r.statistics.mean).toBeCloseTo(100_000, 0);
    expect(r.statistics.standardDeviation).toBeCloseTo(0, 2);
  });

  it('positive drift → mean final price > initial', () => {
    const r = MonteCarloSimulator.runSimulation({
      initialPrice: 100_000,
      projectionDays: 365,
      simulationCount: 200,
      volatility: 0,
      drift: 0.5, // +50%/yr
    });
    expect(r.statistics.mean).toBeGreaterThan(100_000);
  });

  it('percentile ordering: p5 ≤ p25 ≤ median ≤ p75 ≤ p95', () => {
    const r = MonteCarloSimulator.runSimulation({
      initialPrice: 100_000,
      projectionDays: 90,
      simulationCount: 500,
      volatility: 0.8,
      drift: 0.2,
    });
    const s = r.statistics;
    expect(s.percentile5).toBeLessThanOrEqual(s.percentile25);
    expect(s.percentile25).toBeLessThanOrEqual(s.median);
    expect(s.median).toBeLessThanOrEqual(s.percentile75);
    expect(s.percentile75).toBeLessThanOrEqual(s.percentile95);
  });

  it('returns ≤100 paths for visualization even when simulationCount is larger', () => {
    const r = MonteCarloSimulator.runSimulation({
      initialPrice: 100_000,
      projectionDays: 30,
      simulationCount: 500,
      volatility: 0.5,
      drift: 0.1,
    });
    expect(r.paths.length).toBeLessThanOrEqual(100);
  });
});
