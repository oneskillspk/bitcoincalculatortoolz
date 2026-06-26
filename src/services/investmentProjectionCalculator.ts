/**
 * Investment Projection Calculator Service
 * Forward-looking growth projections with compound interest, DCA, inflation adjustment, and asset comparison
 */

export interface GrowthModel {
  id: string;
  name: string;
  annualRate: number;
  description: string;
  color: string;
}

export const GROWTH_MODELS: GrowthModel[] = [
  { id: 'conservative', name: 'Conservative', annualRate: 0.10, description: '10% annual growth — lower bound of Bitcoin\'s historical 4-year rolling CAGR', color: 'hsl(var(--muted-foreground))' },
  { id: 'moderate', name: 'Moderate', annualRate: 0.25, description: '25% annual growth — approximates Bitcoin\'s risk-adjusted average return', color: 'hsl(var(--primary))' },
  { id: 'aggressive', name: 'Aggressive', annualRate: 0.50, description: '50% annual growth — based on Bitcoin\'s historical 10-year CAGR, discounted for market maturation', color: 'hsl(142, 76%, 36%)' },
];

export const COMPARISON_ASSETS = [
  { id: 'sp500', name: 'S&P 500', annualRate: 0.10, color: 'hsl(217, 91%, 60%)' },
  { id: 'gold', name: 'Gold', annualRate: 0.07, color: 'hsl(45, 93%, 47%)' },
  { id: 'savings', name: 'Savings Account', annualRate: 0.045, color: 'hsl(var(--muted-foreground))' },
];

export const TIME_HORIZON_OPTIONS = [1, 2, 3, 5, 10, 15, 20];

export const DEFAULT_INFLATION_RATE = 0.03;

export interface ProjectionYear {
  year: number;
  nominalValue: number;
  realValue: number;
  totalInvested: number;
  btcHoldings: number;
  btcPrice: number;
}

export interface ProjectionResult {
  modelId: string;
  modelName: string;
  color: string;
  projections: ProjectionYear[];
  finalValue: number;
  finalRealValue: number;
  totalInvested: number;
  projectedProfit: number;
  projectedROI: number;
  estimatedBtcHoldings: number;
  finalBtcPrice: number;
}

export interface AssetComparisonResult {
  assetId: string;
  assetName: string;
  color: string;
  finalValue: number;
  totalReturn: number;
  roi: number;
}

export interface InvestmentInputs {
  lumpSum: number;
  monthlyContribution: number;
  timeHorizon: number; // years
  currentBtcPrice: number;
  inflationRate: number;
  customCAGR?: number;
  targetBtcPrice?: number;
}

/**
 * Calculate future value with compound growth (lump sum only)
 * FV = PV * (1 + r)^n
 */
export const futureValueLumpSum = (presentValue: number, annualRate: number, years: number): number => {
  return presentValue * Math.pow(1 + annualRate, years);
};

/**
 * Calculate future value of annuity (recurring contributions)
 * FV = PMT * [((1 + r)^n - 1) / r]
 * Uses monthly compounding for accuracy
 */
export const futureValueAnnuity = (monthlyPayment: number, annualRate: number, years: number): number => {
  if (annualRate === 0) return monthlyPayment * years * 12;
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;
  return monthlyPayment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
};

/**
 * Combined future value: lump sum + DCA
 */
export const futureValueCombined = (lumpSum: number, monthlyPayment: number, annualRate: number, years: number): number => {
  const lumpFV = futureValueLumpSum(lumpSum, annualRate, years);
  const annuityFV = futureValueAnnuity(monthlyPayment, annualRate, years);
  return lumpFV + annuityFV;
};

/**
 * Inflation-adjusted (real) value
 */
export const adjustForInflation = (nominalValue: number, inflationRate: number, years: number): number => {
  return nominalValue / Math.pow(1 + inflationRate, years);
};

/**
 * Calculate breakeven CAGR to beat inflation
 */
export const breakevenCAGR = (inflationRate: number): number => {
  return inflationRate;
};

/**
 * Generate year-by-year projection for a given growth model
 */
export const generateProjection = (
  inputs: InvestmentInputs,
  annualRate: number
): ProjectionYear[] => {
  const projections: ProjectionYear[] = [];
  const monthlyRate = annualRate / 12;

  // Year 0 (starting point)
  const initialBtc = inputs.currentBtcPrice > 0 ? inputs.lumpSum / inputs.currentBtcPrice : 0;
  projections.push({
    year: 0,
    nominalValue: inputs.lumpSum,
    realValue: inputs.lumpSum,
    totalInvested: inputs.lumpSum,
    btcHoldings: initialBtc,
    btcPrice: inputs.currentBtcPrice,
  });

  for (let year = 1; year <= inputs.timeHorizon; year++) {
    const totalInvested = inputs.lumpSum + (inputs.monthlyContribution * 12 * year);
    const nominalValue = futureValueCombined(inputs.lumpSum, inputs.monthlyContribution, annualRate, year);
    const realValue = adjustForInflation(nominalValue, inputs.inflationRate, year);
    const btcPrice = inputs.currentBtcPrice * Math.pow(1 + annualRate, year);

    // Estimate BTC holdings: initial purchase + accumulated DCA
    let btcHoldings = initialBtc;
    for (let month = 1; month <= year * 12; month++) {
      const priceAtMonth = inputs.currentBtcPrice * Math.pow(1 + monthlyRate, month);
      btcHoldings += priceAtMonth > 0 ? inputs.monthlyContribution / priceAtMonth : 0;
    }

    projections.push({
      year,
      nominalValue,
      realValue,
      totalInvested,
      btcHoldings,
      btcPrice,
    });
  }

  return projections;
};

/**
 * Calculate full projection result for a growth model
 */
const calculateProjectionResult = (
  inputs: InvestmentInputs,
  model: GrowthModel
): ProjectionResult => {
  const projections = generateProjection(inputs, model.annualRate);
  const finalProjection = projections[projections.length - 1];

  return {
    modelId: model.id,
    modelName: model.name,
    color: model.color,
    projections,
    finalValue: finalProjection.nominalValue,
    finalRealValue: finalProjection.realValue,
    totalInvested: finalProjection.totalInvested,
    projectedProfit: finalProjection.nominalValue - finalProjection.totalInvested,
    projectedROI: finalProjection.totalInvested > 0
      ? ((finalProjection.nominalValue - finalProjection.totalInvested) / finalProjection.totalInvested) * 100
      : 0,
    estimatedBtcHoldings: finalProjection.btcHoldings,
    finalBtcPrice: finalProjection.btcPrice,
  };
};

/**
 * Calculate all projection results (for all active models)
 */
export const calculateAllProjections = (
  inputs: InvestmentInputs,
  includeCustom: boolean = false,
): ProjectionResult[] => {
  const results: ProjectionResult[] = [];

  for (const model of GROWTH_MODELS) {
    results.push(calculateProjectionResult(inputs, model));
  }

  if (includeCustom && inputs.customCAGR !== undefined && inputs.customCAGR > 0) {
    const customModel: GrowthModel = {
      id: 'custom',
      name: `Custom (${(inputs.customCAGR * 100).toFixed(0)}%)`,
      annualRate: inputs.customCAGR,
      description: 'Your custom growth rate',
      color: 'hsl(280, 80%, 55%)',
    };
    results.push(calculateProjectionResult(inputs, customModel));
  }

  return results;
};

/**
 * Calculate asset comparison results
 */
export const calculateAssetComparisons = (
  inputs: InvestmentInputs
): AssetComparisonResult[] => {
  return COMPARISON_ASSETS.map((asset) => {
    const finalValue = futureValueCombined(inputs.lumpSum, inputs.monthlyContribution, asset.annualRate, inputs.timeHorizon);
    const totalInvested = inputs.lumpSum + (inputs.monthlyContribution * 12 * inputs.timeHorizon);
    return {
      assetId: asset.id,
      assetName: asset.name,
      color: asset.color,
      finalValue,
      totalReturn: finalValue - totalInvested,
      roi: totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0,
    };
  });
};

/**
 * Price target reverse calculation
 * Given a target BTC price, what would the investment be worth?
 */
export const calculateFromPriceTarget = (
  inputs: InvestmentInputs,
  targetPrice: number
): { portfolioValue: number; profit: number; roi: number; btcHoldings: number } => {
  if (inputs.currentBtcPrice <= 0 || targetPrice <= 0) {
    return { portfolioValue: 0, profit: 0, roi: 0, btcHoldings: 0 };
  }

  // BTC from lump sum
  const initialBtc = inputs.lumpSum / inputs.currentBtcPrice;

  // For DCA, estimate average purchase price between current and target
  // Simple approximation: assume linear price increase
  const avgPrice = (inputs.currentBtcPrice + targetPrice) / 2;
  const totalDcaContribution = inputs.monthlyContribution * 12 * inputs.timeHorizon;
  const dcaBtc = avgPrice > 0 ? totalDcaContribution / avgPrice : 0;

  const totalBtc = initialBtc + dcaBtc;
  const portfolioValue = totalBtc * targetPrice;
  const totalInvested = inputs.lumpSum + totalDcaContribution;
  const profit = portfolioValue - totalInvested;
  const roi = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

  return { portfolioValue, profit, roi, btcHoldings: totalBtc };
};

import { formatCurrencyAmount } from '@/utils/formatCurrency';

/**
 * Format currency for display — uses Intl.NumberFormat under the hood
 * via formatCurrencyAmount so every ISO 4217 code renders the right symbol.
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  const locale = currency === 'TRY' ? 'tr-TR' : 'en-US';
  const compact = Math.abs(value) >= 1_000_000;
  return formatCurrencyAmount(value, currency, { compact, locale, decimals: compact ? 2 : 0 });
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  if (Math.abs(value) >= 10000) {
    return `${(value / 1000).toFixed(1)}K%`;
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};
