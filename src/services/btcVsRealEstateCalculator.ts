export interface BtcVsRealEstateInputs {
  propertyPrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  annualAppreciation: number;
  annualRentalYield: number;
  vacancyRate: number;
  maintenancePercent: number;
  propertyTaxPercent: number;
  closingCostPercent: number;
  btcGrowthRate: number;
  horizonYears: number;
  comparisonMode: 'same-cash' | 'full-value';
}

export interface YearlyBreakdown {
  year: number;
  btcValue: number;
  rePropertyValue: number;
  reEquity: number;
  reMortgageBalance: number;
  reCumulativeRental: number;
  reCumulativeCosts: number;
  reNetValue: number;
}

export interface CostBreakdown {
  totalMortgageInterest: number;
  totalMaintenance: number;
  totalPropertyTax: number;
  buyClosingCosts: number;
  sellClosingCosts: number;
  totalCosts: number;
}

export interface BtcVsRealEstateResult {
  yearlyBreakdown: YearlyBreakdown[];
  btcFinalValue: number;
  reFinalNetValue: number;
  btcROI: number;
  reROI: number;
  difference: number;
  winner: 'btc' | 'real-estate' | 'tie';
  btcInvestment: number;
  reInvestment: number;
  costBreakdown: CostBreakdown;
  breakEvenYear: number | null;
}

function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (annualRate === 0) return principal / (termYears * 12);
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calculateRemainingBalance(principal: number, annualRate: number, termYears: number, monthsPaid: number): number {
  if (annualRate === 0) return principal - (principal / (termYears * 12)) * monthsPaid;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (monthsPaid >= n) return 0;
  return principal * (Math.pow(1 + r, n) - Math.pow(1 + r, monthsPaid)) / (Math.pow(1 + r, n) - 1);
}

export function calculateBtcVsRealEstate(inputs: BtcVsRealEstateInputs): BtcVsRealEstateResult {
  const {
    propertyPrice, downPaymentPercent, mortgageRate, loanTermYears,
    annualAppreciation, annualRentalYield, vacancyRate, maintenancePercent,
    propertyTaxPercent, closingCostPercent, btcGrowthRate, horizonYears, comparisonMode
  } = inputs;

  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanAmount, mortgageRate, loanTermYears);
  const buyClosingCosts = propertyPrice * (closingCostPercent / 100);

  // BTC investment amount depends on comparison mode
  const btcInvestment = comparisonMode === 'same-cash' ? downPayment + buyClosingCosts : propertyPrice + buyClosingCosts;

  const yearlyBreakdown: YearlyBreakdown[] = [];
  let cumulativeRental = 0;
  let cumulativeCosts = buyClosingCosts;
  let totalMortgageInterest = 0;
  let totalMaintenance = 0;
  let totalPropertyTax = 0;
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= horizonYears; year++) {
    // BTC value
    const btcValue = btcInvestment * Math.pow(1 + btcGrowthRate / 100, year);

    // Real estate
    const currentPropertyValue = propertyPrice * Math.pow(1 + annualAppreciation / 100, year);
    const monthsPaid = Math.min(year * 12, loanTermYears * 12);
    const mortgageBalance = calculateRemainingBalance(loanAmount, mortgageRate, loanTermYears, monthsPaid);

    // Yearly costs
    const yearPropertyValue = propertyPrice * Math.pow(1 + annualAppreciation / 100, year - 0.5); // mid-year approx
    const yearMaintenance = yearPropertyValue * (maintenancePercent / 100);
    const yearPropertyTax = yearPropertyValue * (propertyTaxPercent / 100);

    // Mortgage interest for this year
    const balanceStart = calculateRemainingBalance(loanAmount, mortgageRate, loanTermYears, (year - 1) * 12);
    const balanceEnd = mortgageBalance;
    const principalPaid = balanceStart - balanceEnd;
    const yearMortgagePayments = year * 12 <= loanTermYears * 12
      ? monthlyPayment * 12
      : Math.max(0, (loanTermYears * 12 - (year - 1) * 12)) * monthlyPayment;
    const yearInterest = Math.max(0, yearMortgagePayments - principalPaid);

    totalMortgageInterest += yearInterest;
    totalMaintenance += yearMaintenance;
    totalPropertyTax += yearPropertyTax;

    // Rental income
    const yearRentalGross = currentPropertyValue * (annualRentalYield / 100);
    const yearRentalNet = yearRentalGross * (1 - vacancyRate / 100);
    cumulativeRental += yearRentalNet;
    cumulativeCosts = buyClosingCosts + totalMortgageInterest + totalMaintenance + totalPropertyTax;

    // Sell closing costs at the end
    const sellClosing = currentPropertyValue * (closingCostPercent / 100);
    const reNetValue = currentPropertyValue - mortgageBalance + cumulativeRental - cumulativeCosts - sellClosing;

    if (breakEvenYear === null && btcValue <= reNetValue) {
      breakEvenYear = year;
    }

    yearlyBreakdown.push({
      year,
      btcValue,
      rePropertyValue: currentPropertyValue,
      reEquity: currentPropertyValue - mortgageBalance,
      reMortgageBalance: mortgageBalance,
      reCumulativeRental: cumulativeRental,
      reCumulativeCosts: cumulativeCosts + sellClosing,
      reNetValue
    });
  }

  const lastYear = yearlyBreakdown[yearlyBreakdown.length - 1];
  const btcFinalValue = lastYear.btcValue;
  const reFinalNetValue = lastYear.reNetValue;
  const sellClosingCosts = lastYear.rePropertyValue * (closingCostPercent / 100);

  const btcROI = ((btcFinalValue - btcInvestment) / btcInvestment) * 100;
  const reInvestment = downPayment + buyClosingCosts;
  const reROI = ((reFinalNetValue - reInvestment) / reInvestment) * 100;

  const difference = btcFinalValue - reFinalNetValue;
  const winner = Math.abs(difference) < 1 ? 'tie' : difference > 0 ? 'btc' : 'real-estate';

  return {
    yearlyBreakdown,
    btcFinalValue,
    reFinalNetValue,
    btcROI,
    reROI,
    difference,
    winner,
    btcInvestment,
    reInvestment,
    costBreakdown: {
      totalMortgageInterest,
      totalMaintenance,
      totalPropertyTax,
      buyClosingCosts,
      sellClosingCosts,
      totalCosts: totalMortgageInterest + totalMaintenance + totalPropertyTax + buyClosingCosts + sellClosingCosts
    },
    breakEvenYear
  };
}

export const defaultInputs: BtcVsRealEstateInputs = {
  propertyPrice: 400000,
  downPaymentPercent: 20,
  mortgageRate: 6.5,
  loanTermYears: 30,
  annualAppreciation: 3.5,
  annualRentalYield: 5,
  vacancyRate: 8,
  maintenancePercent: 1.5,
  propertyTaxPercent: 1.2,
  closingCostPercent: 3,
  btcGrowthRate: 30,
  horizonYears: 10,
  comparisonMode: 'same-cash'
};
