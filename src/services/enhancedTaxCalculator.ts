import { format } from 'date-fns';

export interface TaxTransaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'trade' | 'mining' | 'staking' | 'gift' | 'fork';
  amount: number; // Bitcoin amount
  price: number; // Price per Bitcoin in fiat
  fiatAmount: number; // Total fiat amount
  currency: string;
  fees?: number;
  description?: string;
  exchange?: string;
}

export interface TaxableEvent {
  transactionId: string;
  date: string;
  type: 'capital_gain' | 'capital_loss' | 'mining_income' | 'staking_income';
  bitcoinAmount: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  holdingPeriod: number; // days
  isLongTerm: boolean;
  taxRate: number;
  taxOwed: number;
  stateRate?: number;
  stateTaxOwed?: number;
}

export interface TaxConfiguration {
  jurisdiction: string;
  state?: string;
  filingStatus: 'single' | 'married-filing-jointly' | 'married-filing-separately' | 'head-of-household';
  annualIncome: number;
  taxYear: number;
  costBasisMethod: 'FIFO' | 'LIFO' | 'SPECIFIC_ID' | 'AVERAGE_COST';
}

export interface EnhancedTaxCalculation {
  federalTax: {
    totalGains: number;
    totalLosses: number;
    netCapitalGains: number;
    shortTermGains: number;
    longTermGains: number;
    shortTermLosses: number;
    longTermLosses: number;
    totalTaxOwed: number;
    effectiveTaxRate: number;
    niitTax: number; // Net Investment Income Tax
  };
  stateTax?: {
    totalTaxOwed: number;
    effectiveTaxRate: number;
  };
  totalTaxLiability: number;
  netProceedsAfterTax: number;
  taxableEvents: TaxableEvent[];
  optimizationSuggestions: string[];
  summary: {
    totalTransactions: number;
    totalBitcoinTraded: number;
    averageHoldingPeriod: number;
    largestGain: number;
    largestLoss: number;
    washSaleWarnings: number;
  };
}

// 2024 Tax Brackets (Federal)
const FEDERAL_TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 }
  ],
  'married-filing-jointly': [
    { min: 0, max: 23200, rate: 10 },
    { min: 23200, max: 94300, rate: 12 },
    { min: 94300, max: 201050, rate: 22 },
    { min: 201050, max: 383900, rate: 24 },
    { min: 383900, max: 487450, rate: 32 },
    { min: 487450, max: 731200, rate: 35 },
    { min: 731200, max: Infinity, rate: 37 }
  ],
  'married-filing-separately': [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 365600, rate: 35 },
    { min: 365600, max: Infinity, rate: 37 }
  ],
  'head-of-household': [
    { min: 0, max: 16550, rate: 10 },
    { min: 16550, max: 63100, rate: 12 },
    { min: 63100, max: 100500, rate: 22 },
    { min: 100500, max: 191950, rate: 24 },
    { min: 191950, max: 243700, rate: 32 },
    { min: 243700, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 }
  ]
};

// Long-term capital gains rates for 2024
const LONG_TERM_CAPITAL_GAINS_RATES_2024 = {
  single: [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 518900, rate: 15 },
    { min: 518900, max: Infinity, rate: 20 }
  ],
  'married-filing-jointly': [
    { min: 0, max: 94050, rate: 0 },
    { min: 94050, max: 583750, rate: 15 },
    { min: 583750, max: Infinity, rate: 20 }
  ],
  'married-filing-separately': [
    { min: 0, max: 47025, rate: 0 },
    { min: 47025, max: 291850, rate: 15 },
    { min: 291850, max: Infinity, rate: 20 }
  ],
  'head-of-household': [
    { min: 0, max: 63000, rate: 0 },
    { min: 63000, max: 551350, rate: 15 },
    { min: 551350, max: Infinity, rate: 20 }
  ]
};

// State tax rates — all 50 states + DC (top marginal / flat income-tax rates, 2024)
const STATE_TAX_RATES: Record<string, { rate: number; hasCapitalGains: boolean }> = {
  'AL': { rate: 5.00, hasCapitalGains: true },
  'AK': { rate: 0, hasCapitalGains: false },
  'AZ': { rate: 2.50, hasCapitalGains: true },
  'AR': { rate: 4.40, hasCapitalGains: true },
  'CA': { rate: 13.30, hasCapitalGains: true },
  'CO': { rate: 4.40, hasCapitalGains: true },
  'CT': { rate: 6.99, hasCapitalGains: true },
  'DE': { rate: 6.60, hasCapitalGains: true },
  'FL': { rate: 0, hasCapitalGains: false },
  'GA': { rate: 5.49, hasCapitalGains: true },
  'HI': { rate: 11.00, hasCapitalGains: true },
  'ID': { rate: 5.80, hasCapitalGains: true },
  'IL': { rate: 4.95, hasCapitalGains: true },
  'IN': { rate: 3.05, hasCapitalGains: true },
  'IA': { rate: 5.70, hasCapitalGains: true },
  'KS': { rate: 5.70, hasCapitalGains: true },
  'KY': { rate: 4.50, hasCapitalGains: true },
  'LA': { rate: 4.25, hasCapitalGains: true },
  'ME': { rate: 7.15, hasCapitalGains: true },
  'MD': { rate: 5.75, hasCapitalGains: true },
  'MA': { rate: 5.00, hasCapitalGains: true },
  'MI': { rate: 4.05, hasCapitalGains: true },
  'MN': { rate: 9.85, hasCapitalGains: true },
  'MS': { rate: 5.00, hasCapitalGains: true },
  'MO': { rate: 4.95, hasCapitalGains: true },
  'MT': { rate: 6.75, hasCapitalGains: true },
  'NE': { rate: 6.64, hasCapitalGains: true },
  'NV': { rate: 0, hasCapitalGains: false },
  'NH': { rate: 0, hasCapitalGains: false },
  'NJ': { rate: 10.75, hasCapitalGains: true },
  'NM': { rate: 5.90, hasCapitalGains: true },
  'NY': { rate: 8.82, hasCapitalGains: true },
  'NC': { rate: 4.50, hasCapitalGains: true },
  'ND': { rate: 1.95, hasCapitalGains: true },
  'OH': { rate: 3.50, hasCapitalGains: true },
  'OK': { rate: 4.75, hasCapitalGains: true },
  'OR': { rate: 9.90, hasCapitalGains: true },
  'PA': { rate: 3.07, hasCapitalGains: true },
  'RI': { rate: 5.99, hasCapitalGains: true },
  'SC': { rate: 6.40, hasCapitalGains: true },
  'SD': { rate: 0, hasCapitalGains: false },
  'TN': { rate: 0, hasCapitalGains: false },
  'TX': { rate: 0, hasCapitalGains: false },
  'UT': { rate: 4.65, hasCapitalGains: true },
  'VT': { rate: 8.75, hasCapitalGains: true },
  'VA': { rate: 5.75, hasCapitalGains: true },
  'WA': { rate: 7.00, hasCapitalGains: true }, // Capital gains tax on high earners
  'WV': { rate: 5.12, hasCapitalGains: true },
  'WI': { rate: 7.65, hasCapitalGains: true },
  'WY': { rate: 0, hasCapitalGains: false },
  'DC': { rate: 10.75, hasCapitalGains: true },
};

export class EnhancedTaxCalculatorService {
  private static readonly LONG_TERM_THRESHOLD_DAYS = 365;
  private static readonly NIIT_RATE = 3.8; // Net Investment Income Tax
  private static readonly NIIT_THRESHOLD_SINGLE = 200000;
  private static readonly NIIT_THRESHOLD_MFJ = 250000;
  private static readonly WASH_SALE_DAYS = 30;

  static calculateTaxes(
    transactions: TaxTransaction[],
    config: TaxConfiguration
  ): EnhancedTaxCalculation {
    // Filter transactions for the tax year
    const yearTransactions = transactions.filter(t => {
      const transactionYear = new Date(t.date).getFullYear();
      return transactionYear === config.taxYear;
    });

    // Separate buy and sell transactions
    const purchases = transactions.filter(t => t.type === 'buy').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
const sales = yearTransactions
      .filter(t => t.type === 'sell' || t.type === 'trade')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const taxableEvents: TaxableEvent[] = [];
    const optimizationSuggestions: string[] = [];
    let washSaleWarnings = 0;

    // Calculate cost basis for each sale using specified method
    let remainingPurchases = purchases.map(p => ({ ...p }));

    for (const sale of sales) {
      const saleAmount = sale.amount;
      let remainingSaleAmount = saleAmount;
      let totalCostBasis = 0;
      let weightedHoldingPeriod = 0;

while (remainingSaleAmount > 0) {
        const saleTime = new Date(sale.date).getTime();
        const eligiblePurchases = remainingPurchases.filter(p => new Date(p.date).getTime() <= saleTime);
        if (eligiblePurchases.length === 0) break;

        const purchase = this.selectPurchaseForCostBasis(eligiblePurchases, config.costBasisMethod);
        const availableAmount = Math.min(remainingSaleAmount, purchase.amount);
        
        // Calculate cost basis for this portion
        const costBasisPortion = (availableAmount / purchase.amount) * purchase.fiatAmount;
        totalCostBasis += costBasisPortion;

        // Calculate holding period
        const holdingPeriod = Math.floor(
          (new Date(sale.date).getTime() - new Date(purchase.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        weightedHoldingPeriod += holdingPeriod * availableAmount;

        // Note: Wash sale check will be done after calculating gain/loss

        // Update remaining amounts
        remainingSaleAmount -= availableAmount;
        purchase.amount -= availableAmount;
        purchase.fiatAmount -= costBasisPortion;

        // Remove purchase if fully consumed
        if (purchase.amount <= 0) {
          const idx = remainingPurchases.findIndex(p => p.id === purchase.id);
          if (idx !== -1) remainingPurchases.splice(idx, 1);
        }
      }

      if (saleAmount > 0) {
        const avgHoldingPeriod = weightedHoldingPeriod / saleAmount;
        const isLongTerm = avgHoldingPeriod >= this.LONG_TERM_THRESHOLD_DAYS;
        const proceeds = sale.fiatAmount - (sale.fees || 0);
        const gainLoss = proceeds - totalCostBasis;
        
        // Check for wash sale BEFORE calculating tax
        const isWashSaleTransaction = this.isWashSale(sale, purchases, gainLoss);
        
        if (isWashSaleTransaction) {
          washSaleWarnings++;
          optimizationSuggestions.push(`Wash sale detected for transaction on ${format(new Date(sale.date), 'MMM dd, yyyy')} - loss disallowed`);
        }
        
        // Apply wash sale rule: disallow loss if wash sale
        const adjustedGainLoss = isWashSaleTransaction ? 0 : gainLoss;
        
        // Calculate federal tax
        let federalTaxRate: number;
        let federalTaxOwed: number;
        if (isLongTerm) {
          federalTaxRate = this.getLongTermCapitalGainsRate(config.annualIncome, config.filingStatus);
          federalTaxOwed = Math.max(0, adjustedGainLoss * (federalTaxRate / 100));
        } else {
          // Short-term gains: use progressive brackets stacked on ordinary income
          federalTaxOwed = Math.max(0, this.calculateOrdinaryIncomeTax(adjustedGainLoss, config.annualIncome, config.filingStatus));
          federalTaxRate = adjustedGainLoss > 0 ? (federalTaxOwed / adjustedGainLoss) * 100 : 0;
        }

        // Calculate state tax if applicable
        let stateTaxOwed = 0;
        let stateRate = 0;
        if (config.state && STATE_TAX_RATES[config.state]) {
          const stateInfo = STATE_TAX_RATES[config.state];
          if (stateInfo.hasCapitalGains && adjustedGainLoss > 0) {
            stateRate = stateInfo.rate;
            stateTaxOwed = adjustedGainLoss * (stateRate / 100);
          }
        }

        taxableEvents.push({
          transactionId: sale.id,
          date: sale.date,
          type: adjustedGainLoss >= 0 ? 'capital_gain' : 'capital_loss',
          bitcoinAmount: saleAmount,
          costBasis: totalCostBasis,
          proceeds,
          gainLoss: adjustedGainLoss, // Use adjusted gain/loss
          holdingPeriod: Math.floor(avgHoldingPeriod),
          isLongTerm,
          taxRate: federalTaxRate,
          taxOwed: federalTaxOwed,
          stateRate,
          stateTaxOwed,
          washSale: isWashSaleTransaction,
          originalGainLoss: isWashSaleTransaction ? gainLoss : undefined // Track original loss
        } as any);
      }
    }

    // Calculate mining/staking income
    const miningTransactions = yearTransactions.filter(t => ['mining', 'staking'].includes(t.type));
    for (const mining of miningTransactions) {
      const federalTaxOwed = this.calculateOrdinaryIncomeTax(mining.fiatAmount, config.annualIncome, config.filingStatus);
      const ordinaryIncomeRate = mining.fiatAmount > 0 ? (federalTaxOwed / mining.fiatAmount) * 100 : 0;
      
      let stateTaxOwed = 0;
      let stateRate = 0;
      if (config.state && STATE_TAX_RATES[config.state]) {
        stateRate = STATE_TAX_RATES[config.state].rate;
        stateTaxOwed = mining.fiatAmount * (stateRate / 100);
      }

      taxableEvents.push({
        transactionId: mining.id,
        date: mining.date,
        type: mining.type === 'mining' ? 'mining_income' : 'staking_income',
        bitcoinAmount: mining.amount,
        costBasis: 0,
        proceeds: mining.fiatAmount,
        gainLoss: mining.fiatAmount,
        holdingPeriod: 0,
        isLongTerm: false,
        taxRate: ordinaryIncomeRate,
        taxOwed: federalTaxOwed,
        stateRate,
        stateTaxOwed
      });
    }

    // Calculate federal tax totals
    const gains = taxableEvents.filter(e => e.gainLoss > 0);
    const losses = taxableEvents.filter(e => e.gainLoss < 0);
    
    const shortTermGains = gains.filter(e => !e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0);
    const longTermGains = gains.filter(e => e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0);
    const shortTermLosses = Math.abs(losses.filter(e => !e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0));
    const longTermLosses = Math.abs(losses.filter(e => e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0));

    const totalGains = shortTermGains + longTermGains;
    const totalLosses = shortTermLosses + longTermLosses;
    const netCapitalGains = totalGains - totalLosses;
    const federalTaxOwed = taxableEvents.reduce((sum, e) => sum + e.taxOwed, 0);
    
    // Calculate NIIT (Net Investment Income Tax) for high earners
    const niitThreshold = config.filingStatus === 'married-filing-jointly' 
      ? this.NIIT_THRESHOLD_MFJ 
      : this.NIIT_THRESHOLD_SINGLE;
    // MAGI includes capital gains for NIIT threshold calculation
    const magi = config.annualIncome + Math.max(0, netCapitalGains);
    const niitTax = magi > niitThreshold && netCapitalGains > 0
      ? Math.min(netCapitalGains, magi - niitThreshold) * (this.NIIT_RATE / 100)
      : 0;

    const effectiveFederalTaxRate = totalGains > 0 ? ((federalTaxOwed + niitTax) / totalGains) * 100 : 0;

    // Calculate state tax totals
    const stateTaxOwed = taxableEvents.reduce((sum, e) => sum + (e.stateTaxOwed || 0), 0);
    const effectiveStateTaxRate = totalGains > 0 && stateTaxOwed > 0 ? (stateTaxOwed / totalGains) * 100 : 0;

    const totalTaxLiability = federalTaxOwed + niitTax + stateTaxOwed;
    const totalProceeds = taxableEvents.reduce((sum, e) => sum + e.proceeds, 0);
    const netProceedsAfterTax = totalProceeds - totalTaxLiability;

    // Generate optimization suggestions
    this.generateOptimizationSuggestions(taxableEvents, optimizationSuggestions);

    return {
      federalTax: {
        totalGains,
        totalLosses,
        netCapitalGains,
        shortTermGains,
        longTermGains,
        shortTermLosses,
        longTermLosses,
        totalTaxOwed: federalTaxOwed,
        effectiveTaxRate: effectiveFederalTaxRate,
        niitTax
      },
      stateTax: config.state ? {
        totalTaxOwed: stateTaxOwed,
        effectiveTaxRate: effectiveStateTaxRate
      } : undefined,
      totalTaxLiability,
      netProceedsAfterTax,
      taxableEvents,
      optimizationSuggestions,
      summary: {
        totalTransactions: yearTransactions.length,
        totalBitcoinTraded: yearTransactions.reduce((sum, t) => sum + t.amount, 0),
        averageHoldingPeriod: taxableEvents.length > 0 
          ? taxableEvents.reduce((sum, e) => sum + e.holdingPeriod, 0) / taxableEvents.length 
          : 0,
        largestGain: Math.max(...taxableEvents.map(e => e.gainLoss), 0),
        largestLoss: Math.min(...taxableEvents.map(e => e.gainLoss), 0),
        washSaleWarnings
      }
    };
  }

  private static selectPurchaseForCostBasis(
    purchases: TaxTransaction[], 
    method: TaxConfiguration['costBasisMethod']
  ): TaxTransaction {
    switch (method) {
      case 'FIFO':
        return purchases[0];
      case 'LIFO':
        return purchases[purchases.length - 1];
      case 'SPECIFIC_ID':
        // Use highest cost first (most tax-efficient for gains)
        return purchases.reduce((highest, current) => 
          current.price > highest.price ? current : highest
        );
      case 'AVERAGE_COST':
        // Calculate weighted average cost and create synthetic transaction
        const totalAmount = purchases.reduce((sum, p) => sum + p.amount, 0);
        const totalValue = purchases.reduce((sum, p) => sum + p.fiatAmount, 0);
        const avgPrice = totalValue / totalAmount;
        
        // Return first purchase but with average price
        return {
          ...purchases[0],
          price: avgPrice,
          fiatAmount: purchases[0].amount * avgPrice
        };
      default:
        return purchases[0];
    }
  }

  private static getLongTermCapitalGainsRate(income: number, filingStatus: TaxConfiguration['filingStatus']): number {
    const brackets = LONG_TERM_CAPITAL_GAINS_RATES_2024[filingStatus];
    const bracket = brackets.find(b => income >= b.min && income < b.max);
    return bracket ? bracket.rate : 20;
  }

  /**
   * Calculate the total progressive tax on a given taxable income amount.
   */
  private static calculateProgressiveTax(taxableIncome: number, filingStatus: TaxConfiguration['filingStatus']): number {
    if (taxableIncome <= 0) return 0;
    const brackets = FEDERAL_TAX_BRACKETS_2024[filingStatus];
    let tax = 0;
    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break;
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * (bracket.rate / 100);
    }
    return tax;
  }

  /**
   * Calculate the tax owed on a gain amount stacked on top of base ordinary income
   * using progressive federal brackets.
   */
  private static calculateOrdinaryIncomeTax(gain: number, baseIncome: number, filingStatus: TaxConfiguration['filingStatus']): number {
    if (gain <= 0) return 0;
    return this.calculateProgressiveTax(baseIncome + gain, filingStatus) - this.calculateProgressiveTax(baseIncome, filingStatus);
  }

  private static isWashSale(sale: TaxTransaction, purchases: TaxTransaction[], gainLoss: number): boolean {
    // Wash sale rule only applies to losses
    if (gainLoss >= 0) return false;
    
    const saleDate = new Date(sale.date);
    const washSaleStart = new Date(saleDate.getTime() - (this.WASH_SALE_DAYS * 24 * 60 * 60 * 1000));
    const washSaleEnd = new Date(saleDate.getTime() + (this.WASH_SALE_DAYS * 24 * 60 * 60 * 1000));

    return purchases.some(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= washSaleStart && purchaseDate <= washSaleEnd && purchase.id !== sale.id;
    });
  }

  private static generateOptimizationSuggestions(
    taxableEvents: TaxableEvent[], 
    suggestions: string[]
  ): void {
    const gains = taxableEvents.filter(e => e.gainLoss > 0);
    const losses = taxableEvents.filter(e => e.gainLoss < 0);

    if (losses.length > 0 && gains.length > 0) {
      suggestions.push('Consider tax-loss harvesting to offset capital gains with capital losses');
    }

    const shortTermGains = gains.filter(e => !e.isLongTerm);
    if (shortTermGains.length > 0) {
      suggestions.push('Consider holding assets longer than one year to qualify for lower long-term capital gains rates');
    }

    const totalLosses = Math.abs(losses.reduce((sum, e) => sum + e.gainLoss, 0));
    if (totalLosses > 3000) {
      suggestions.push('Capital losses exceeding $3,000 can be carried forward to future tax years');
    }
  }

  static formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  static generateTaxReport(calculation: EnhancedTaxCalculation, config: TaxConfiguration) {
    return {
      title: `Bitcoin Capital Gains Tax Report - ${config.taxYear}`,
      jurisdiction: config.jurisdiction,
      state: config.state,
      filingStatus: config.filingStatus,
      taxYear: config.taxYear,
      generatedDate: format(new Date(), 'MMMM dd, yyyy'),
      federalSummary: {
        totalGains: this.formatCurrency(calculation.federalTax.totalGains),
        totalLosses: this.formatCurrency(calculation.federalTax.totalLosses),
        netCapitalGains: this.formatCurrency(calculation.federalTax.netCapitalGains),
        federalTaxOwed: this.formatCurrency(calculation.federalTax.totalTaxOwed),
        niitTax: this.formatCurrency(calculation.federalTax.niitTax),
        effectiveTaxRate: this.formatPercentage(calculation.federalTax.effectiveTaxRate)
      },
      stateSummary: calculation.stateTax ? {
        stateTaxOwed: this.formatCurrency(calculation.stateTax.totalTaxOwed),
        effectiveTaxRate: this.formatPercentage(calculation.stateTax.effectiveTaxRate)
      } : undefined,
      totalTaxLiability: this.formatCurrency(calculation.totalTaxLiability),
      netProceedsAfterTax: this.formatCurrency(calculation.netProceedsAfterTax),
      breakdown: {
        shortTerm: {
          gains: this.formatCurrency(calculation.federalTax.shortTermGains),
          losses: this.formatCurrency(calculation.federalTax.shortTermLosses)
        },
        longTerm: {
          gains: this.formatCurrency(calculation.federalTax.longTermGains),
          losses: this.formatCurrency(calculation.federalTax.longTermLosses)
        }
      },
      optimizationSuggestions: calculation.optimizationSuggestions,
      transactions: calculation.taxableEvents.map(event => ({
        date: format(new Date(event.date), 'MMM dd, yyyy'),
        type: event.type.replace('_', ' ').toUpperCase(),
        amount: `${event.bitcoinAmount.toFixed(8)} BTC`,
        costBasis: this.formatCurrency(event.costBasis),
        proceeds: this.formatCurrency(event.proceeds),
        gainLoss: this.formatCurrency(event.gainLoss),
        holdingPeriod: `${event.holdingPeriod} days`,
        term: event.isLongTerm ? 'Long-term' : 'Short-term',
        federalTaxRate: this.formatPercentage(event.taxRate),
        federalTaxOwed: this.formatCurrency(event.taxOwed),
        stateTaxRate: event.stateRate ? this.formatPercentage(event.stateRate) : 'N/A',
        stateTaxOwed: event.stateTaxOwed ? this.formatCurrency(event.stateTaxOwed) : 'N/A'
      }))
    };
  }

  static getAvailableStates() {
    return Object.keys(STATE_TAX_RATES).map(code => ({
      code,
      name: this.getStateName(code),
      rate: STATE_TAX_RATES[code].rate,
      hasCapitalGains: STATE_TAX_RATES[code].hasCapitalGains
    }));
  }

  private static getStateName(code: string): string {
    const stateNames: Record<string, string> = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
      'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
      'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
      'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
      'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
      'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
      'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
      'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
      'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
      'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
      'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District of Columbia',
    };
    return stateNames[code] || code;
  }
}