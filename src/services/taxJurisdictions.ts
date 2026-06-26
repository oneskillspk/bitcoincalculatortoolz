interface TaxRates {
  shortTermCapitalGains: number; // Percentage
  longTermCapitalGains: number; // Percentage
  ordinaryIncome: number; // Percentage for mining income
  currency: string;
  longTermThresholdDays: number;
}

interface TaxJurisdiction {
  code: string;
  name: string;
  rates: TaxRates;
  description: string;
  features: string[];
}

const TAX_JURISDICTIONS: Record<string, TaxJurisdiction> = {
  US: {
    code: 'US',
    name: 'United States',
    rates: {
      shortTermCapitalGains: 37, // Treated as ordinary income, using top bracket
      longTermCapitalGains: 20, // Top long-term capital gains rate
      ordinaryIncome: 37, // Top marginal tax rate
      currency: 'USD',
      longTermThresholdDays: 365
    },
    description: 'US federal tax rates for high-income earners',
    features: [
      'Short-term gains taxed as ordinary income',
      'Long-term gains qualify for preferential rates',
      'Mining income taxed as ordinary income',
      'Tax-loss harvesting allowed'
    ]
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    rates: {
      shortTermCapitalGains: 20, // Higher rate for capital gains
      longTermCapitalGains: 20, // Same rate regardless of holding period
      ordinaryIncome: 45, // Additional rate income tax
      currency: 'GBP',
      longTermThresholdDays: 0 // No distinction in UK
    },
    description: 'UK capital gains tax rates',
    features: [
      'Annual exempt amount (allowance)',
      'No distinction between short and long-term',
      'Entrepreneurs\' Relief available',
      'Losses can offset gains'
    ]
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    rates: {
      shortTermCapitalGains: 26.76, // 50% inclusion rate at top marginal rate
      longTermCapitalGains: 26.76, // Same treatment
      ordinaryIncome: 53.53, // Top combined federal/provincial rate
      currency: 'CAD',
      longTermThresholdDays: 0 // No distinction in Canada
    },
    description: 'Canadian capital gains tax (50% inclusion rate)',
    features: [
      '50% of capital gains included in taxable income',
      'No distinction between holding periods',
      'Principal residence exemption',
      'Capital loss carryover rules'
    ]
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    rates: {
      shortTermCapitalGains: 45, // Top marginal tax rate
      longTermCapitalGains: 22.5, // 50% CGT discount applied
      ordinaryIncome: 45, // Top marginal tax rate plus Medicare levy
      currency: 'AUD',
      longTermThresholdDays: 365
    },
    description: 'Australian capital gains tax with 50% discount',
    features: [
      '50% CGT discount for assets held >12 months',
      'Mining income taxed as ordinary income',
      'Personal use asset exemption for <$10,000',
      'Capital loss quarantining'
    ]
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    rates: {
      shortTermCapitalGains: 47.48, // Income tax + solidarity surcharge
      longTermCapitalGains: 0, // Tax-free after 1 year
      ordinaryIncome: 47.48, // Top income tax rate with solidarity surcharge
      currency: 'EUR',
      longTermThresholdDays: 365
    },
    description: 'German cryptocurrency tax rules',
    features: [
      'Tax-free after 1 year holding period',
      'Private sale transactions',
      '600 EUR annual exemption',
      'Mining taxed as business income'
    ]
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    rates: {
      shortTermCapitalGains: 31, // Deemed return taxation
      longTermCapitalGains: 31, // Same rate
      ordinaryIncome: 49.5, // Top income tax rate
      currency: 'EUR',
      longTermThresholdDays: 0 // No distinction
    },
    description: 'Dutch Box 3 wealth taxation',
    features: [
      'Deemed return on wealth (Box 3)',
      'Fixed percentage of portfolio value',
      'No actual capital gains tracking',
      'Professional trading in Box 1'
    ]
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    rates: {
      shortTermCapitalGains: 0, // No capital gains tax
      longTermCapitalGains: 0, // No capital gains tax
      ordinaryIncome: 22, // Top personal income tax rate
      currency: 'SGD',
      longTermThresholdDays: 0
    },
    description: 'Singapore - no capital gains tax',
    features: [
      'No capital gains tax for individuals',
      'Business income rules may apply',
      'GST on commercial transactions',
      'IRAS guidance for crypto'
    ]
  }
};

export const getTaxRatesByJurisdiction = (jurisdictionCode: string): TaxRates => {
  const jurisdiction = TAX_JURISDICTIONS[jurisdictionCode];
  if (!jurisdiction) {
    throw new Error(`Unsupported jurisdiction: ${jurisdictionCode}`);
  }
  return jurisdiction.rates;
};
