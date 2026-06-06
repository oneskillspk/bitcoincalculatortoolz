// Bitcoin ETF data - expense ratios and metadata
export interface BitcoinETF {
  ticker: string;
  name: string;
  issuer: string;
  expenseRatio: number; // Annual expense ratio as decimal (e.g., 0.0025 = 0.25%)
  inceptionDate: string;
}

export const BITCOIN_ETFS: BitcoinETF[] = [
  { ticker: 'IBIT', name: 'iShares Bitcoin Trust ETF', issuer: 'BlackRock', expenseRatio: 0.0025, inceptionDate: '2024-01-11' },
  { ticker: 'FBTC', name: 'Wise Origin Bitcoin Fund', issuer: 'Fidelity', expenseRatio: 0.0025, inceptionDate: '2024-01-11' },
  { ticker: 'ARKB', name: 'ARK 21Shares Bitcoin ETF', issuer: 'ARK/21Shares', expenseRatio: 0.0021, inceptionDate: '2024-01-11' },
  { ticker: 'BITB', name: 'Bitwise Bitcoin ETF', issuer: 'Bitwise', expenseRatio: 0.0020, inceptionDate: '2024-01-11' },
  { ticker: 'HODL', name: 'VanEck Bitcoin Trust', issuer: 'VanEck', expenseRatio: 0.0020, inceptionDate: '2024-01-11' },
  { ticker: 'BRRR', name: 'Valkyrie Bitcoin Fund', issuer: 'CoinShares', expenseRatio: 0.0025, inceptionDate: '2024-01-11' },
  { ticker: 'GBTC', name: 'Grayscale Bitcoin Trust', issuer: 'Grayscale', expenseRatio: 0.0150, inceptionDate: '2013-09-25' },
  { ticker: 'BTC', name: 'Grayscale Bitcoin Mini Trust', issuer: 'Grayscale', expenseRatio: 0.0015, inceptionDate: '2024-07-31' },
];

export interface ETFCalculationResult {
  etf: BitcoinETF;
  investmentAmount: number;
  holdingPeriodYears: number;
  btcPrice: number;
  sharesEquivalent: number;
  btcExposure: number;
  totalFeesPaid: number;
  feeImpactOnReturns: number;
  valueAfterFees: number;
  valueWithoutFees: number;
  directBtcValue: number;
  costSavingsVsDirect: number;
}

export function calculateETFReturns(
  investmentAmount: number,
  etf: BitcoinETF,
  holdingPeriodYears: number,
  btcPrice: number,
  annualBtcReturn: number = 0 // Expected annual BTC return as decimal
): ETFCalculationResult {
  const btcExposure = investmentAmount / btcPrice;
  
  // Compound fee drag over holding period
  const feeMultiplier = Math.pow(1 - etf.expenseRatio, holdingPeriodYears);
  const growthMultiplier = Math.pow(1 + annualBtcReturn, holdingPeriodYears);
  
  const valueWithoutFees = investmentAmount * growthMultiplier;
  const valueAfterFees = investmentAmount * growthMultiplier * feeMultiplier;
  const totalFeesPaid = valueWithoutFees - valueAfterFees;
  const feeImpactOnReturns = ((valueWithoutFees - valueAfterFees) / valueWithoutFees) * 100;
  
  return {
    etf,
    investmentAmount,
    holdingPeriodYears,
    btcPrice,
    sharesEquivalent: btcExposure * 1000, // Approximate shares (most ETFs ~1/1000 BTC per share)
    btcExposure,
    totalFeesPaid,
    feeImpactOnReturns,
    valueAfterFees,
    valueWithoutFees,
    directBtcValue: valueWithoutFees, // Direct BTC has no expense ratio
    costSavingsVsDirect: 0, // ETFs always cost more than direct due to fees
  };
}

export function compareAllETFs(
  investmentAmount: number,
  holdingPeriodYears: number,
  btcPrice: number,
  annualBtcReturn: number = 0
): ETFCalculationResult[] {
  return BITCOIN_ETFS.map(etf => 
    calculateETFReturns(investmentAmount, etf, holdingPeriodYears, btcPrice, annualBtcReturn)
  ).sort((a, b) => a.totalFeesPaid - b.totalFeesPaid);
}
