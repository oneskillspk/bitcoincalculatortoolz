export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annually';

export type SavingsMode = 'fixed' | 'percentage';

export interface SavingsInputs {
  income: number;
  frequency: PayFrequency;
  savingsMode: SavingsMode;
  fixedAmount: number;
  savingsPercentage: number;
  currentBtcPrice: number;
  annualGrowthRate: number; // 0-1 (e.g. 0.25 = 25%)
  timeHorizonMonths: number;
  savingsAccountAPY: number; // 0-1 (e.g. 0.045 = 4.5%)
}

export interface AccumulationDataPoint {
  month: number;
  btcPurchased: number;
  cumulativeBtc: number;
  cumulativeSats: number;
  cumulativeFiat: number;
  btcPrice: number;
  portfolioValue: number;
}

export interface SavingsResult {
  satsPerPaycheck: number;
  btcPerPaycheck: number;
  monthlyAmount: number;
  totalBtcAccumulated: number;
  totalSatsAccumulated: number;
  totalFiatInvested: number;
  projectedPortfolioValue: number;
  projectedGainLoss: number;
  projectedROI: number;
  accumulationData: AccumulationDataPoint[];
  savingsAccountFinalValue: number;
  savingsAccountInterest: number;
  satsPerDollar: number;
}

export interface MilestoneResult {
  name: string;
  targetSats: number;
  targetBtc: number;
  monthsToReach: number | null;
  estimatedDate: Date | null;
  totalFiatInvested: number | null;
  isReachable: boolean;
  progress: number; // 0-100
}

const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annually: 1,
};

export const FREQUENCY_LABELS: Record<PayFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly (every 2 weeks)',
  semimonthly: 'Semimonthly (twice/month)',
  monthly: 'Monthly',
  annually: 'Annually',
};

export const QUICK_PRESETS = [
  { label: '$25/week', amount: 25, frequency: 'weekly' as PayFrequency },
  { label: '$50/week', amount: 50, frequency: 'weekly' as PayFrequency },
  { label: '$100/month', amount: 100, frequency: 'monthly' as PayFrequency },
  { label: '$250/month', amount: 250, frequency: 'monthly' as PayFrequency },
  { label: '$500/month', amount: 500, frequency: 'monthly' as PayFrequency },
];

export const PERCENTAGE_PRESETS = [1, 3, 5, 10, 15, 20];

export const GROWTH_PRESETS = [
  { label: 'Flat (0%)', value: 0, description: 'Pure accumulation, no price growth' },
  { label: 'Conservative (10%)', value: 10, description: 'Modest yearly growth' },
  { label: 'Moderate (25%)', value: 25, description: 'Historical adoption-driven growth' },
  { label: 'Aggressive (50%)', value: 50, description: 'High conviction scenario' },
];

export const TIME_PRESETS = [
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
  { label: '3 years', months: 36 },
  { label: '5 years', months: 60 },
];

export function normalizeToMonthly(amount: number, frequency: PayFrequency): number {
  return (amount * PERIODS_PER_YEAR[frequency]) / 12;
}

export function calculateSavingsAmount(inputs: SavingsInputs): number {
  if (inputs.savingsMode === 'fixed') {
    return inputs.fixedAmount;
  }
  return inputs.income * (inputs.savingsPercentage / 100);
}

export function calculateSatsPerDollar(btcPrice: number): number {
  if (btcPrice <= 0) return 0;
  return 100_000_000 / btcPrice;
}

export function calculateAccumulation(inputs: SavingsInputs): SavingsResult {
  const savingsPerPeriod = calculateSavingsAmount(inputs);
  const monthlyAmount = normalizeToMonthly(savingsPerPeriod, inputs.frequency);
  const monthlyGrowthRate = Math.pow(1 + inputs.annualGrowthRate, 1 / 12) - 1;
  const satsPerDollar = calculateSatsPerDollar(inputs.currentBtcPrice);

  // Per-paycheck stats at current price
  const btcPerPaycheck = inputs.currentBtcPrice > 0 ? savingsPerPeriod / inputs.currentBtcPrice : 0;
  const satsPerPaycheck = btcPerPaycheck * 100_000_000;

  const accumulationData: AccumulationDataPoint[] = [];
  let cumulativeBtc = 0;
  let cumulativeFiat = 0;

  for (let m = 1; m <= inputs.timeHorizonMonths; m++) {
    const projectedPrice = inputs.currentBtcPrice * Math.pow(1 + monthlyGrowthRate, m);
    const btcPurchased = projectedPrice > 0 ? monthlyAmount / projectedPrice : 0;
    cumulativeBtc += btcPurchased;
    cumulativeFiat += monthlyAmount;
    const portfolioValue = cumulativeBtc * projectedPrice;

    accumulationData.push({
      month: m,
      btcPurchased,
      cumulativeBtc,
      cumulativeSats: Math.round(cumulativeBtc * 100_000_000),
      cumulativeFiat: Math.round(cumulativeFiat * 100) / 100,
      btcPrice: Math.round(projectedPrice * 100) / 100,
      portfolioValue: Math.round(portfolioValue * 100) / 100,
    });
  }

  const finalData = accumulationData[accumulationData.length - 1];
  const totalBtc = finalData?.cumulativeBtc || 0;
  const totalSats = Math.round(totalBtc * 100_000_000);
  const totalFiat = finalData?.cumulativeFiat || 0;
  const portfolioValue = finalData?.portfolioValue || 0;
  const gainLoss = portfolioValue - totalFiat;
  const roi = totalFiat > 0 ? (gainLoss / totalFiat) * 100 : 0;

  // Savings account comparison
  const savingsComparison = calculateSavingsAccountComparison(
    monthlyAmount,
    inputs.savingsAccountAPY,
    inputs.timeHorizonMonths
  );

  return {
    satsPerPaycheck: Math.round(satsPerPaycheck),
    btcPerPaycheck,
    monthlyAmount,
    totalBtcAccumulated: totalBtc,
    totalSatsAccumulated: totalSats,
    totalFiatInvested: totalFiat,
    projectedPortfolioValue: portfolioValue,
    projectedGainLoss: gainLoss,
    projectedROI: roi,
    accumulationData,
    savingsAccountFinalValue: savingsComparison.finalBalance,
    savingsAccountInterest: savingsComparison.totalInterest,
    satsPerDollar,
  };
}

export function calculateSavingsAccountComparison(
  monthlyAmount: number,
  savingsAPY: number,
  months: number
): { finalBalance: number; totalInterest: number } {
  const monthlyRate = savingsAPY / 12;
  let balance = 0;
  const totalDeposited = monthlyAmount * months;

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + monthlyAmount;
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalInterest: Math.round((balance - totalDeposited) * 100) / 100,
  };
}

export function calculateMilestones(
  monthlyAmount: number,
  currentBtcPrice: number,
  annualGrowthRate: number,
  timeHorizonMonths: number
): MilestoneResult[] {
  const milestones = [
    { name: 'Starter Stack', targetSats: 100_000, targetBtc: 0.001 },
    { name: 'One in a Million', targetSats: 1_000_000, targetBtc: 0.01 },
    { name: 'Serious Stacker', targetSats: 10_000_000, targetBtc: 0.1 },
    { name: 'Half Coiner', targetSats: 50_000_000, targetBtc: 0.5 },
    { name: 'Whole Coiner', targetSats: 100_000_000, targetBtc: 1.0 },
  ];

  // Use compound monthly rate to stay consistent with calculateAccumulation
  const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;
  const maxSimMonths = 600; // 50 years max
  let cumulativeBtc = 0;

  // Pre-simulate to find when each milestone is hit
  const milestoneMonths: (number | null)[] = milestones.map(() => null);
  const milestoneFiat: (number | null)[] = milestones.map(() => null);
  let cumulativeFiat = 0;

  for (let m = 1; m <= maxSimMonths; m++) {
    const projectedPrice = currentBtcPrice * Math.pow(1 + monthlyGrowthRate, m);
    const btcPurchased = projectedPrice > 0 ? monthlyAmount / projectedPrice : 0;
    cumulativeBtc += btcPurchased;
    cumulativeFiat += monthlyAmount;

    milestones.forEach((ms, i) => {
      if (milestoneMonths[i] === null && cumulativeBtc >= ms.targetBtc) {
        milestoneMonths[i] = m;
        milestoneFiat[i] = Math.round(cumulativeFiat * 100) / 100;
      }
    });

    // All found
    if (milestoneMonths.every((v) => v !== null)) break;
  }

  // Recalculate progress at end of time horizon
  let finalBtc = 0;
  for (let m = 1; m <= timeHorizonMonths; m++) {
    const projectedPrice = currentBtcPrice * Math.pow(1 + monthlyGrowthRate, m);
    const btcPurchased = projectedPrice > 0 ? monthlyAmount / projectedPrice : 0;
    finalBtc += btcPurchased;
  }

  return milestones.map((ms, i) => {
    const monthsToReach = milestoneMonths[i];
    const isReachable = monthsToReach !== null && monthsToReach <= timeHorizonMonths;
    const progress = Math.min(100, (finalBtc / ms.targetBtc) * 100);

    return {
      name: ms.name,
      targetSats: ms.targetSats,
      targetBtc: ms.targetBtc,
      monthsToReach,
      estimatedDate: monthsToReach !== null
        ? new Date(Date.now() + monthsToReach * 30.44 * 24 * 60 * 60 * 1000)
        : null,
      totalFiatInvested: milestoneFiat[i],
      isReachable,
      progress,
    };
  });
}
