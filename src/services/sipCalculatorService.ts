export type SIPFrequency = 'weekly' | 'biweekly' | 'monthly';

export interface SIPInputs {
  amount: number;
  frequency: SIPFrequency;
  expectedAnnualReturn: number; // as decimal, e.g. 0.30 for 30%
  timePeriodYears: number;
  inflationRate: number | null; // as decimal, null if disabled
}

export interface SIPGrowthDataPoint {
  period: number;
  label: string;
  invested: number;
  portfolioValue: number;
  realValue?: number;
}

export interface SIPResults {
  totalInvested: number;
  estimatedCorpus: number;
  wealthGained: number;
  effectiveCAGR: number;
  realCorpus: number | null;
  realWealthGained: number | null;
  growthData: SIPGrowthDataPoint[];
}

export interface SIPvsLumpSumResults {
  sipCorpus: number;
  lumpSumCorpus: number;
  sipTotalInvested: number;
  winner: 'sip' | 'lumpsum';
  difference: number;
  differencePercent: number;
}

function getPeriodsPerYear(frequency: SIPFrequency): number {
  switch (frequency) {
    case 'weekly': return 52;
    case 'biweekly': return 26;
    case 'monthly': return 12;
  }
}

/**
 * SIP Future Value: FV = P * [((1+r)^n - 1) / r] * (1+r)
 * where P = periodic investment, r = rate per period, n = total periods
 */
export function calculateSIPFutureValue(
  periodicAmount: number,
  ratePerPeriod: number,
  totalPeriods: number
): number {
  if (ratePerPeriod === 0) return periodicAmount * totalPeriods;
  return periodicAmount * (((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod) * (1 + ratePerPeriod));
}

/**
 * Lump Sum Future Value: FV = PV * (1+r)^n
 */
export function calculateLumpSumFutureValue(
  principal: number,
  annualRate: number,
  years: number
): number {
  return principal * Math.pow(1 + annualRate, years);
}

export function calculateSIPResults(inputs: SIPInputs): SIPResults {
  const { amount, frequency, expectedAnnualReturn, timePeriodYears, inflationRate } = inputs;
  const periodsPerYear = getPeriodsPerYear(frequency);
  const totalPeriods = periodsPerYear * timePeriodYears;
  const ratePerPeriod = expectedAnnualReturn / periodsPerYear;
  const totalInvested = amount * totalPeriods;

  const estimatedCorpus = calculateSIPFutureValue(amount, ratePerPeriod, totalPeriods);
  const wealthGained = estimatedCorpus - totalInvested;
  const effectiveCAGR = totalInvested > 0
    ? (Math.pow(estimatedCorpus / totalInvested, 1 / timePeriodYears) - 1)
    : 0;

  // Inflation-adjusted
  let realCorpus: number | null = null;
  let realWealthGained: number | null = null;
  if (inflationRate !== null && inflationRate > 0) {
    const realRate = (1 + expectedAnnualReturn) / (1 + inflationRate) - 1;
    const realRatePerPeriod = realRate / periodsPerYear;
    realCorpus = calculateSIPFutureValue(amount, realRatePerPeriod, totalPeriods);
    realWealthGained = realCorpus - totalInvested;
  }

  // Growth data (yearly snapshots)
  const growthData: SIPGrowthDataPoint[] = [];
  for (let year = 0; year <= timePeriodYears; year++) {
    const periodsAtYear = periodsPerYear * year;
    const invested = amount * periodsAtYear;
    const portfolioValue = year === 0 ? 0 : calculateSIPFutureValue(amount, ratePerPeriod, periodsAtYear);

    const point: SIPGrowthDataPoint = {
      period: year,
      label: `Year ${year}`,
      invested,
      portfolioValue: Math.round(portfolioValue * 100) / 100,
    };

    if (inflationRate !== null && inflationRate > 0 && year > 0) {
      const realRate = (1 + expectedAnnualReturn) / (1 + inflationRate) - 1;
      const realRatePerPeriod = realRate / periodsPerYear;
      point.realValue = Math.round(calculateSIPFutureValue(amount, realRatePerPeriod, periodsAtYear) * 100) / 100;
    }

    growthData.push(point);
  }

  return {
    totalInvested,
    estimatedCorpus: Math.round(estimatedCorpus * 100) / 100,
    wealthGained: Math.round(wealthGained * 100) / 100,
    effectiveCAGR,
    realCorpus: realCorpus !== null ? Math.round(realCorpus * 100) / 100 : null,
    realWealthGained: realWealthGained !== null ? Math.round(realWealthGained * 100) / 100 : null,
    growthData,
  };
}

export function calculateSIPvsLumpSum(inputs: SIPInputs): SIPvsLumpSumResults {
  const { amount, frequency, expectedAnnualReturn, timePeriodYears } = inputs;
  const periodsPerYear = getPeriodsPerYear(frequency);
  const totalPeriods = periodsPerYear * timePeriodYears;
  const ratePerPeriod = expectedAnnualReturn / periodsPerYear;
  const totalInvested = amount * totalPeriods;

  const sipCorpus = calculateSIPFutureValue(amount, ratePerPeriod, totalPeriods);
  const lumpSumCorpus = calculateLumpSumFutureValue(totalInvested, expectedAnnualReturn, timePeriodYears);

  const winner = lumpSumCorpus >= sipCorpus ? 'lumpsum' : 'sip';
  const difference = Math.abs(lumpSumCorpus - sipCorpus);
  const differencePercent = sipCorpus > 0 ? (difference / sipCorpus) * 100 : 0;

  return {
    sipCorpus: Math.round(sipCorpus * 100) / 100,
    lumpSumCorpus: Math.round(lumpSumCorpus * 100) / 100,
    sipTotalInvested: totalInvested,
    winner,
    difference: Math.round(difference * 100) / 100,
    differencePercent: Math.round(differencePercent * 100) / 100,
  };
}
