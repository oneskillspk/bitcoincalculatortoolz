export interface InheritanceTaxResult {
  // Step-up basis
  stepUpBasis: number;
  stepUpBasisTotal: number;
  
  // Capital gains if sold
  capitalGainWithStepUp: number;
  capitalGainWithoutStepUp: number;
  taxSavingsFromStepUp: number;
  
  // Federal estate tax
  federalExemption: number;
  taxableEstate: number;
  federalEstateTax: number;
  
  // State estate tax
  stateExemption: number;
  stateEstateTax: number;
  hasStateEstateTax: boolean;
  stateName: string;
  
  // Capital gains tax estimate (if sold after inheriting)
  estimatedCapitalGainsTax: number;
  niitTax: number;
  totalCapitalGainsTax: number;
  effectiveTaxRate: number;
  
  // Summary
  btcShareOfEstate: number;
  proportionalEstateTax: number;
  totalTaxLiability: number;
  netInheritanceValue: number;
  bitcoinValue: number;
}

const FEDERAL_ESTATE_TAX_EXEMPTION_2026 = 13_610_000;
const MARRIED_MULTIPLIER = 2;

const FEDERAL_ESTATE_TAX_BRACKETS = [
  { min: 0, max: 10_000, rate: 0.18 },
  { min: 10_000, max: 20_000, rate: 0.20 },
  { min: 20_000, max: 40_000, rate: 0.22 },
  { min: 40_000, max: 60_000, rate: 0.24 },
  { min: 60_000, max: 80_000, rate: 0.26 },
  { min: 80_000, max: 100_000, rate: 0.28 },
  { min: 100_000, max: 150_000, rate: 0.30 },
  { min: 150_000, max: 250_000, rate: 0.32 },
  { min: 250_000, max: 500_000, rate: 0.34 },
  { min: 500_000, max: 750_000, rate: 0.37 },
  { min: 750_000, max: 1_000_000, rate: 0.39 },
  { min: 1_000_000, max: Infinity, rate: 0.40 },
];

// States with estate taxes and their exemptions
const STATE_ESTATE_TAXES: Record<string, { exemption: number; topRate: number; name: string }> = {
  CT: { exemption: 13_610_000, topRate: 0.12, name: 'Connecticut' },
  DC: { exemption: 4_710_800, topRate: 0.16, name: 'District of Columbia' },
  HI: { exemption: 5_490_000, topRate: 0.20, name: 'Hawaii' },
  IL: { exemption: 4_000_000, topRate: 0.16, name: 'Illinois' },
  ME: { exemption: 6_800_000, topRate: 0.12, name: 'Maine' },
  MD: { exemption: 5_000_000, topRate: 0.16, name: 'Maryland' },
  MA: { exemption: 2_000_000, topRate: 0.16, name: 'Massachusetts' },
  MN: { exemption: 3_000_000, topRate: 0.16, name: 'Minnesota' },
  NY: { exemption: 6_940_000, topRate: 0.16, name: 'New York' },
  OR: { exemption: 1_000_000, topRate: 0.16, name: 'Oregon' },
  RI: { exemption: 1_774_583, topRate: 0.16, name: 'Rhode Island' },
  VT: { exemption: 5_000_000, topRate: 0.16, name: 'Vermont' },
  WA: { exemption: 2_193_000, topRate: 0.20, name: 'Washington' },
};

// Long-term capital gains brackets (2026 estimates)
const LTCG_BRACKETS_SINGLE = [
  { min: 0, max: 48_350, rate: 0 },
  { min: 48_350, max: 533_400, rate: 0.15 },
  { min: 533_400, max: Infinity, rate: 0.20 },
];

const LTCG_BRACKETS_MARRIED = [
  { min: 0, max: 96_700, rate: 0 },
  { min: 96_700, max: 600_050, rate: 0.15 },
  { min: 600_050, max: Infinity, rate: 0.20 },
];

// NIIT thresholds
const NIIT_THRESHOLD_SINGLE = 200_000;
const NIIT_THRESHOLD_MARRIED = 250_000;
const NIIT_RATE = 0.038;

function calculateProgressiveTax(taxableAmount: number, brackets: { min: number; max: number; rate: number }[]): number {
  if (taxableAmount <= 0) return 0;
  let tax = 0;
  let remaining = taxableAmount;

  for (const bracket of brackets) {
    const bracketSize = bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, bracketSize);
    tax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    if (remaining <= 0) break;
  }
  return tax;
}

function estimateCapitalGainsTax(gain: number, filingStatus: 'single' | 'married'): number {
  if (gain <= 0) return 0;
  const brackets = filingStatus === 'single' ? LTCG_BRACKETS_SINGLE : LTCG_BRACKETS_MARRIED;
  return calculateProgressiveTax(gain, brackets);
}

function calculateNIIT(gain: number, filingStatus: 'single' | 'married'): number {
  if (gain <= 0) return 0;
  const threshold = filingStatus === 'single' ? NIIT_THRESHOLD_SINGLE : NIIT_THRESHOLD_MARRIED;
  const niitableAmount = Math.max(0, gain - threshold);
  return niitableAmount * NIIT_RATE;
}

export function calculateInheritanceTax(
  inheritedBtcAmount: number,
  dateOfDeathPrice: number,
  originalCostBasis: number,
  currentPrice: number,
  totalEstateValue: number,
  filingStatus: 'single' | 'married',
  stateCode: string
): InheritanceTaxResult {
  const stepUpBasis = dateOfDeathPrice;
  const stepUpBasisTotal = inheritedBtcAmount * dateOfDeathPrice;
  const bitcoinValue = inheritedBtcAmount * currentPrice;

  // Capital gains comparison
  const capitalGainWithStepUp = Math.max(0, (currentPrice - dateOfDeathPrice) * inheritedBtcAmount);
  const capitalGainWithoutStepUp = Math.max(0, (currentPrice - originalCostBasis) * inheritedBtcAmount);

  const taxWithStepUp = estimateCapitalGainsTax(capitalGainWithStepUp, filingStatus);
  const taxWithoutStepUp = estimateCapitalGainsTax(capitalGainWithoutStepUp, filingStatus);
  const taxSavingsFromStepUp = taxWithoutStepUp - taxWithStepUp;

  // NIIT on step-up gain
  const niitTax = calculateNIIT(capitalGainWithStepUp, filingStatus);
  const totalCapitalGainsTax = taxWithStepUp + niitTax;

  // Federal estate tax
  const federalExemption = filingStatus === 'married'
    ? FEDERAL_ESTATE_TAX_EXEMPTION_2026 * MARRIED_MULTIPLIER
    : FEDERAL_ESTATE_TAX_EXEMPTION_2026;
  const taxableEstate = Math.max(0, totalEstateValue - federalExemption);
  const federalEstateTax = calculateProgressiveTax(taxableEstate, FEDERAL_ESTATE_TAX_BRACKETS);

  // State estate tax
  const stateInfo = STATE_ESTATE_TAXES[stateCode];
  const hasStateEstateTax = !!stateInfo;
  let stateExemption = 0;
  let stateEstateTax = 0;
  let stateName = stateCode;

  if (stateInfo) {
    stateExemption = stateInfo.exemption;
    stateName = stateInfo.name;
    const stateTaxable = Math.max(0, totalEstateValue - stateInfo.exemption);
    stateEstateTax = stateTaxable * stateInfo.topRate;
  }

  // Proportional estate tax impact on inherited BTC
  const btcShareOfEstate = totalEstateValue > 0 ? bitcoinValue / totalEstateValue : 0;
  const totalEstateTax = federalEstateTax + stateEstateTax;
  const proportionalEstateTax = totalEstateTax * btcShareOfEstate;

  // Summary
  const estimatedCapitalGainsTax = taxWithStepUp;
  const effectiveTaxRate = bitcoinValue > 0 ? (totalCapitalGainsTax / bitcoinValue) * 100 : 0;
  const totalTaxLiability = proportionalEstateTax + totalCapitalGainsTax;
  const netInheritanceValue = bitcoinValue - totalTaxLiability;

  return {
    stepUpBasis,
    stepUpBasisTotal,
    capitalGainWithStepUp,
    capitalGainWithoutStepUp,
    taxSavingsFromStepUp,
    federalExemption,
    taxableEstate,
    federalEstateTax,
    stateExemption,
    stateEstateTax,
    hasStateEstateTax,
    stateName,
    estimatedCapitalGainsTax,
    niitTax,
    totalCapitalGainsTax,
    effectiveTaxRate,
    btcShareOfEstate,
    proportionalEstateTax,
    totalTaxLiability,
    netInheritanceValue,
    bitcoinValue,
  };
}
