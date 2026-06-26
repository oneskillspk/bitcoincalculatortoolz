export interface ForwardResult {
  portfolioValue: number;
  gainFromToday: number;
  gainPercent: number;
  multiplier: number;
}

export interface ReverseResult {
  btcNeeded: number;
  costToday: number;
  progressPercent: number;
}

export interface ScenarioRow {
  targetPrice: number;
  portfolioValue: number;
  gainPercent: number;
  multiplier: number;
}

const SCENARIO_TARGETS = [200_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];

export function calculateForward(btcAmount: number, targetPrice: number, liveBtcPrice: number): ForwardResult {
  const currentValue = btcAmount * liveBtcPrice;
  const portfolioValue = btcAmount * targetPrice;
  const gainFromToday = portfolioValue - currentValue;
  const gainPercent = currentValue > 0 ? (gainFromToday / currentValue) * 100 : 0;
  const multiplier = liveBtcPrice > 0 ? targetPrice / liveBtcPrice : 0;
  return { portfolioValue, gainFromToday, gainPercent, multiplier };
}

export function calculateReverse(targetNetWorth: number, targetPrice: number, liveBtcPrice: number, currentHolding: number = 0): ReverseResult {
  const btcNeeded = targetPrice > 0 ? targetNetWorth / targetPrice : 0;
  const costToday = btcNeeded * liveBtcPrice;
  const progressPercent = btcNeeded > 0 ? Math.min((currentHolding / btcNeeded) * 100, 100) : 0;
  return { btcNeeded, costToday, progressPercent };
}

export function buildScenarioTable(btcAmount: number, liveBtcPrice: number): ScenarioRow[] {
  return SCENARIO_TARGETS.map(targetPrice => {
    const portfolioValue = btcAmount * targetPrice;
    const gainPercent = liveBtcPrice > 0 ? ((targetPrice - liveBtcPrice) / liveBtcPrice) * 100 : 0;
    const multiplier = liveBtcPrice > 0 ? targetPrice / liveBtcPrice : 0;
    return { targetPrice, portfolioValue, gainPercent, multiplier };
  });
}

export function findClosestScenarioIndex(liveBtcPrice: number): number {
  let closest = 0;
  let minDiff = Math.abs(SCENARIO_TARGETS[0] - liveBtcPrice);
  SCENARIO_TARGETS.forEach((t, i) => {
    const diff = Math.abs(t - liveBtcPrice);
    if (diff < minDiff) { minDiff = diff; closest = i; }
  });
  return closest;
}
