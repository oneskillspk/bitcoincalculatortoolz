/**
 * Advanced lot-size math: liquidation price, fees/funding, scenario matrix,
 * reverse solver, portfolio heat. Kept separate from `lotSizeCalculator.ts`
 * so the base calculator stays lean and this module can be tree-shaken by
 * pages that don't need the extras.
 *
 * Formulas (linear USDT-M perpetual, isolated margin, no cross-collateral):
 *   Long liquidation  = entry * (1 - 1/leverage + maintMarginPct)
 *   Short liquidation = entry * (1 + 1/leverage - maintMarginPct)
 *   Effective risk    = dollarRisk + (positionValue * feeBps/1e4 * 2) + fundingCost
 *   R-multiple EV     = winRate * RR - (1 - winRate) * 1
 */

export interface LiquidationInput {
  entry: number;
  leverage: number;
  side: 'long' | 'short';
  maintMarginPct: number; // e.g. 0.005 for 0.5%
}

export function calcLiquidationPrice({ entry, leverage, side, maintMarginPct }: LiquidationInput): number {
  if (leverage <= 0 || entry <= 0) return 0;
  const invL = 1 / leverage;
  const px = side === 'long'
    ? entry * (1 - invL + maintMarginPct)
    : entry * (1 + invL - maintMarginPct);
  return Math.max(0, Math.round(px * 100) / 100);
}

export interface FeeInput {
  positionValueUsd: number;
  takerFeeBps: number;        // e.g. 5.5 = 0.055%
  fundingRatePct?: number;    // avg funding %, e.g. 0.01 for 0.01% per 8h
  holdHours?: number;         // expected hold time in hours
}

export function calcFeeAndFunding({ positionValueUsd, takerFeeBps, fundingRatePct = 0, holdHours = 0 }: FeeInput) {
  const roundTripFees = positionValueUsd * (takerFeeBps / 1e4) * 2;
  const fundingPeriods = holdHours > 0 ? holdHours / 8 : 0;
  const fundingCost = positionValueUsd * (fundingRatePct / 100) * fundingPeriods;
  return {
    roundTripFees: Math.round(roundTripFees * 100) / 100,
    fundingCost: Math.round(fundingCost * 100) / 100,
    total: Math.round((roundTripFees + fundingCost) * 100) / 100,
  };
}

export interface ScenarioRow {
  riskPercent: number;
  dollarRisk: number;
  lotSize: number;
  positionValue: number;
  liquidationPrice: number;
}

export function buildScenarioMatrix(params: {
  accountBalance: number;
  entryPrice: number;
  stopLossPrice: number;
  contractSize: number;
  leverage: number;
  side: 'long' | 'short';
  maintMarginPct: number;
  risks?: number[];
}): ScenarioRow[] {
  const risks = params.risks ?? [0.5, 1, 2, 3];
  const slDist = Math.abs(params.entryPrice - params.stopLossPrice);
  if (slDist <= 0) return [];
  return risks.map(r => {
    const dollarRisk = params.accountBalance * (r / 100);
    const lot = dollarRisk / (slDist * params.contractSize);
    const positionValue = lot * params.contractSize * params.entryPrice;
    return {
      riskPercent: r,
      dollarRisk: Math.round(dollarRisk * 100) / 100,
      lotSize: Math.round(lot * 10000) / 10000,
      positionValue: Math.round(positionValue * 100) / 100,
      liquidationPrice: calcLiquidationPrice({
        entry: params.entryPrice,
        leverage: params.leverage,
        side: params.side,
        maintMarginPct: params.maintMarginPct,
      }),
    };
  });
}

/** Given a target lot size, solve for required stop distance to keep chosen risk %. */
export function reverseSolveStopDistance(params: {
  accountBalance: number;
  riskPercent: number;
  targetLotSize: number;
  contractSize: number;
}): number {
  const { accountBalance, riskPercent, targetLotSize, contractSize } = params;
  if (targetLotSize <= 0 || contractSize <= 0) return 0;
  const dollarRisk = accountBalance * (riskPercent / 100);
  return Math.round((dollarRisk / (targetLotSize * contractSize)) * 100) / 100;
}

export interface PortfolioTrade {
  id: string;
  label: string;
  riskPercent: number;
}

export function calcPortfolioHeat(trades: PortfolioTrade[], accountBalance: number) {
  const totalRiskPct = trades.reduce((s, t) => s + (Number.isFinite(t.riskPercent) ? t.riskPercent : 0), 0);
  const totalRiskUsd = accountBalance * (totalRiskPct / 100);
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  if (totalRiskPct > 6) status = 'danger';
  else if (totalRiskPct > 3) status = 'warning';
  return {
    totalRiskPct: Math.round(totalRiskPct * 100) / 100,
    totalRiskUsd: Math.round(totalRiskUsd * 100) / 100,
    status,
  };
}

/** R-multiple / expected-value helpers. */
export function calcExpectedValue(riskRewardRatio: number, winRate: number) {
  // winRate in 0..1
  const ev = winRate * riskRewardRatio - (1 - winRate) * 1;
  return Math.round(ev * 1000) / 1000;
}

export function breakEvenWinRate(riskRewardRatio: number) {
  if (riskRewardRatio <= 0) return 1;
  return Math.round((1 / (1 + riskRewardRatio)) * 1000) / 1000;
}

/**
 * 2026 broker maintenance-margin defaults (isolated, ~0.5-1% typical BTC-perp).
 * Sourced from public exchange docs, July 2026 review. Kept indicative.
 */
export const BROKER_MAINT_MARGIN: Record<string, number> = {
  standard: 0.005,
  exness: 0.01,
  icmarkets: 0.01,
  bybit: 0.005,
  binance: 0.004,
  delta: 0.005,
  custom: 0.005,
};

export const BROKER_TAKER_FEE_BPS: Record<string, number> = {
  standard: 6,
  exness: 8,
  icmarkets: 7,
  bybit: 5.5,
  binance: 4,
  delta: 5,
  custom: 6,
};
