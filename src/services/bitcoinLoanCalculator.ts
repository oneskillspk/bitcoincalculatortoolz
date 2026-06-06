export interface LoanInputs {
  btcCollateral: number;
  btcPrice: number;
  loanAmountUsd: number;
  interestRateAnnual: number;
  loanTermMonths: number;
  initialLtv: number;
  marginCallLtv: number;
  liquidationLtv: number;
  expectedBtcGrowthRate: number; // annual %
}

export interface LoanResult {
  // Core loan metrics
  collateralValueUsd: number;
  loanAmountUsd: number;
  currentLtv: number;
  maxLoanAmount: number;

  // Liquidation
  liquidationPrice: number;
  marginCallPrice: number;
  distanceToLiquidation: number; // % drop from current price
  distanceToMarginCall: number;

  // Interest & cost
  totalInterestPaid: number;
  monthlyPayment: number;
  totalRepayment: number;
  effectiveApr: number;

  // Borrow vs Sell comparison
  borrowCost: number;
  sellTaxCost: number;
  borrowVsSellSavings: number;
  btcAppreciationGain: number;
  netBorrowAdvantage: number;

  // Risk metrics
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  healthFactor: number;

  // Amortization
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  projectedBtcPrice: number;
  projectedLtv: number;
}

export interface PlatformPreset {
  id: string;
  name: string;
  maxLtv: number;
  interestRange: string;
  marginCallLtv: number;
  liquidationLtv: number;
  minLoan: number;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  { id: 'conservative', name: 'Conservative Platform', maxLtv: 50, interestRange: '4-8%', marginCallLtv: 65, liquidationLtv: 80, minLoan: 1000 },
  { id: 'moderate', name: 'Standard Platform', maxLtv: 60, interestRange: '5-12%', marginCallLtv: 70, liquidationLtv: 85, minLoan: 500 },
  { id: 'aggressive', name: 'Aggressive Platform', maxLtv: 75, interestRange: '8-18%', marginCallLtv: 80, liquidationLtv: 90, minLoan: 100 },
  { id: 'custom', name: 'Custom Settings', maxLtv: 100, interestRange: 'Custom', marginCallLtv: 80, liquidationLtv: 90, minLoan: 0 },
];

export function calculateBitcoinLoan(inputs: LoanInputs): LoanResult {
  const {
    btcCollateral,
    btcPrice,
    loanAmountUsd,
    interestRateAnnual,
    loanTermMonths,
    initialLtv,
    marginCallLtv,
    liquidationLtv,
    expectedBtcGrowthRate,
  } = inputs;

  const collateralValueUsd = btcCollateral * btcPrice;
  const maxLoanAmount = collateralValueUsd * (initialLtv / 100);
  const actualLoan = Math.min(loanAmountUsd, maxLoanAmount);
  const currentLtv = (actualLoan / collateralValueUsd) * 100;

  // Liquidation & margin call prices
  const liquidationPrice = (actualLoan / btcCollateral) / (liquidationLtv / 100);
  const marginCallPrice = (actualLoan / btcCollateral) / (marginCallLtv / 100);
  const distanceToLiquidation = ((btcPrice - liquidationPrice) / btcPrice) * 100;
  const distanceToMarginCall = ((btcPrice - marginCallPrice) / btcPrice) * 100;

  const monthlyRate = interestRateAnnual / 100 / 12;
  
  // Monthly payment (amortizing)
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = actualLoan / loanTermMonths;
  } else {
    monthlyPayment = actualLoan * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  }
  
  const totalRepayment = monthlyPayment * loanTermMonths;
  const effectiveApr = ((totalRepayment - actualLoan) / actualLoan) / (loanTermMonths / 12) * 100;

  // Borrow vs Sell comparison (US-specific defaults: 20% federal LTCG + 3.8% NIIT)
  // These rates are educational estimates; actual tax rates vary by jurisdiction and income level
  const capitalGainsTaxRate = 0.20;
  const niitRate = 0.038;
  const totalTaxRate = capitalGainsTaxRate + niitRate;
  const sellTaxCost = actualLoan * totalTaxRate; // Tax on selling $actualLoan worth of BTC
  const borrowCost = totalRepayment - actualLoan; // Total interest paid

  // BTC appreciation during loan term
  const monthlyGrowthRate = Math.pow(1 + expectedBtcGrowthRate / 100, 1 / 12) - 1;
  const endBtcPrice = btcPrice * Math.pow(1 + monthlyGrowthRate, loanTermMonths);
  const btcAppreciationGain = (endBtcPrice - btcPrice) * btcCollateral;
  const netBorrowAdvantage = (sellTaxCost - borrowCost) + btcAppreciationGain;

  // Risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  const healthFactor = (collateralValueUsd * (liquidationLtv / 100)) / actualLoan;
  if (currentLtv < 40) riskLevel = 'low';
  else if (currentLtv < 60) riskLevel = 'medium';
  else if (currentLtv < 75) riskLevel = 'high';
  else riskLevel = 'critical';

  // Amortization schedule
  const amortizationSchedule: AmortizationEntry[] = [];
  let balance = actualLoan;
  for (let m = 1; m <= Math.min(loanTermMonths, 60); m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    const projectedPrice = btcPrice * Math.pow(1 + monthlyGrowthRate, m);
    const projectedLtv = (balance / (btcCollateral * projectedPrice)) * 100;
    
    amortizationSchedule.push({
      month: m,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: balance,
      projectedBtcPrice: projectedPrice,
      projectedLtv,
    });
  }

  return {
    collateralValueUsd,
    loanAmountUsd: actualLoan,
    currentLtv,
    maxLoanAmount,
    liquidationPrice,
    marginCallPrice,
    distanceToLiquidation,
    distanceToMarginCall,
    totalInterestPaid: totalRepayment - actualLoan,
    monthlyPayment,
    totalRepayment,
    effectiveApr,
    borrowCost,
    sellTaxCost,
    borrowVsSellSavings: sellTaxCost - borrowCost,
    btcAppreciationGain,
    netBorrowAdvantage,
    riskLevel,
    healthFactor,
    amortizationSchedule,
  };
}
