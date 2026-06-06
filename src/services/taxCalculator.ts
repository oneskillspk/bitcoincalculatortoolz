import { format } from 'date-fns';
import { getTaxRatesByJurisdiction } from './taxJurisdictions';

export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell' | 'trade' | 'mining';
  amount: number; // Bitcoin amount
  price: number; // Price per Bitcoin in fiat
  fiatAmount: number; // Total fiat amount
  currency: string;
  fees?: number;
  description?: string;
}

export interface TaxableEvent {
  transactionId: string;
  date: string;
  type: 'capital_gain' | 'capital_loss' | 'mining_income';
  bitcoinAmount: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  holdingPeriod: number; // days
  isLongTerm: boolean;
  taxRate: number;
  taxOwed: number;
}

export interface TaxCalculation {
  totalGains: number;
  totalLosses: number;
  netCapitalGains: number;
  shortTermGains: number;
  longTermGains: number;
  shortTermLosses: number;
  longTermLosses: number;
  totalTaxOwed: number;
  effectiveTaxRate: number;
  taxableEvents: TaxableEvent[];
  summary: {
    totalTransactions: number;
    totalBitcoinTraded: number;
    averageHoldingPeriod: number;
    largestGain: number;
    largestLoss: number;
  };
}

export interface CostBasisMethod {
  method: 'FIFO' | 'LIFO' | 'SPECIFIC_ID' | 'AVERAGE_COST';
  description: string;
}

export class TaxCalculatorService {
  private static readonly LONG_TERM_THRESHOLD_DAYS = 365;

  static calculateTaxes(
    transactions: Transaction[],
    jurisdiction: string,
    taxYear: number,
    costBasisMethod: CostBasisMethod['method'] = 'FIFO'
  ): TaxCalculation {
    // Filter transactions for the tax year
    const yearTransactions = transactions.filter(t => {
      const transactionYear = new Date(t.date).getFullYear();
      return transactionYear === taxYear;
    });

    // Separate buy and sell transactions
    const purchases = transactions.filter(t => t.type === 'buy').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sales = yearTransactions.filter(t => t.type === 'sell').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const taxRates = getTaxRatesByJurisdiction(jurisdiction);
    const taxableEvents: TaxableEvent[] = [];

    // Calculate cost basis for each sale
    let remainingPurchases = [...purchases];

    for (const sale of sales) {
      const saleAmount = sale.amount;
      let remainingSaleAmount = saleAmount;
      let totalCostBasis = 0;
      let weightedHoldingPeriod = 0;

      while (remainingSaleAmount > 0 && remainingPurchases.length > 0) {
        const purchase = remainingPurchases[0];
        const availableAmount = Math.min(remainingSaleAmount, purchase.amount);
        
        // Calculate cost basis for this portion
        const costBasisPortion = (availableAmount / purchase.amount) * purchase.fiatAmount;
        totalCostBasis += costBasisPortion;

        // Calculate holding period
        const holdingPeriod = Math.floor(
          (new Date(sale.date).getTime() - new Date(purchase.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        weightedHoldingPeriod += holdingPeriod * availableAmount;

        // Update remaining amounts
        remainingSaleAmount -= availableAmount;
        purchase.amount -= availableAmount;
        purchase.fiatAmount -= costBasisPortion;

        // Remove purchase if fully consumed
        if (purchase.amount <= 0) {
          remainingPurchases.shift();
        }
      }

      if (saleAmount > 0) {
        const avgHoldingPeriod = weightedHoldingPeriod / saleAmount;
        const isLongTerm = avgHoldingPeriod >= this.LONG_TERM_THRESHOLD_DAYS;
        const proceeds = sale.fiatAmount - (sale.fees || 0);
        const gainLoss = proceeds - totalCostBasis;
        
        const taxRate = isLongTerm ? taxRates.longTermCapitalGains : taxRates.shortTermCapitalGains;
        const taxOwed = Math.max(0, gainLoss * (taxRate / 100));

        taxableEvents.push({
          transactionId: sale.id,
          date: sale.date,
          type: gainLoss >= 0 ? 'capital_gain' : 'capital_loss',
          bitcoinAmount: saleAmount,
          costBasis: totalCostBasis,
          proceeds,
          gainLoss,
          holdingPeriod: Math.floor(avgHoldingPeriod),
          isLongTerm,
          taxRate,
          taxOwed
        });
      }
    }

    // Calculate mining income
    const miningTransactions = yearTransactions.filter(t => t.type === 'mining');
    for (const mining of miningTransactions) {
      taxableEvents.push({
        transactionId: mining.id,
        date: mining.date,
        type: 'mining_income',
        bitcoinAmount: mining.amount,
        costBasis: 0,
        proceeds: mining.fiatAmount,
        gainLoss: mining.fiatAmount,
        holdingPeriod: 0,
        isLongTerm: false,
        taxRate: taxRates.ordinaryIncome,
        taxOwed: mining.fiatAmount * (taxRates.ordinaryIncome / 100)
      });
    }

    // Calculate totals
    const gains = taxableEvents.filter(e => e.gainLoss > 0);
    const losses = taxableEvents.filter(e => e.gainLoss < 0);
    
    const shortTermGains = gains.filter(e => !e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0);
    const longTermGains = gains.filter(e => e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0);
    const shortTermLosses = Math.abs(losses.filter(e => !e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0));
    const longTermLosses = Math.abs(losses.filter(e => e.isLongTerm).reduce((sum, e) => sum + e.gainLoss, 0));

    const totalGains = shortTermGains + longTermGains;
    const totalLosses = shortTermLosses + longTermLosses;
    const netCapitalGains = totalGains - totalLosses;
    const totalTaxOwed = taxableEvents.reduce((sum, e) => sum + e.taxOwed, 0);
    
    const effectiveTaxRate = totalGains > 0 ? (totalTaxOwed / totalGains) * 100 : 0;

    return {
      totalGains,
      totalLosses,
      netCapitalGains,
      shortTermGains,
      longTermGains,
      shortTermLosses,
      longTermLosses,
      totalTaxOwed,
      effectiveTaxRate,
      taxableEvents,
      summary: {
        totalTransactions: yearTransactions.length,
        totalBitcoinTraded: yearTransactions.reduce((sum, t) => sum + t.amount, 0),
        averageHoldingPeriod: taxableEvents.length > 0 
          ? taxableEvents.reduce((sum, e) => sum + e.holdingPeriod, 0) / taxableEvents.length 
          : 0,
        largestGain: Math.max(...taxableEvents.map(e => e.gainLoss), 0),
        largestLoss: Math.min(...taxableEvents.map(e => e.gainLoss), 0)
      }
    };
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

  static generateTaxReport(calculation: TaxCalculation, jurisdiction: string, taxYear: number) {
    return {
      title: `Bitcoin Capital Gains Tax Report - ${taxYear}`,
      jurisdiction,
      taxYear,
      generatedDate: format(new Date(), 'MMMM dd, yyyy'),
      summary: {
        totalGains: this.formatCurrency(calculation.totalGains),
        totalLosses: this.formatCurrency(calculation.totalLosses),
        netCapitalGains: this.formatCurrency(calculation.netCapitalGains),
        totalTaxOwed: this.formatCurrency(calculation.totalTaxOwed),
        effectiveTaxRate: this.formatPercentage(calculation.effectiveTaxRate)
      },
      breakdown: {
        shortTerm: {
          gains: this.formatCurrency(calculation.shortTermGains),
          losses: this.formatCurrency(calculation.shortTermLosses)
        },
        longTerm: {
          gains: this.formatCurrency(calculation.longTermGains),
          losses: this.formatCurrency(calculation.longTermLosses)
        }
      },
      transactions: calculation.taxableEvents.map(event => ({
        date: format(new Date(event.date), 'MMM dd, yyyy'),
        type: event.type.replace('_', ' ').toUpperCase(),
        amount: `${event.bitcoinAmount.toFixed(8)} BTC`,
        costBasis: this.formatCurrency(event.costBasis),
        proceeds: this.formatCurrency(event.proceeds),
        gainLoss: this.formatCurrency(event.gainLoss),
        holdingPeriod: `${event.holdingPeriod} days`,
        term: event.isLongTerm ? 'Long-term' : 'Short-term',
        taxRate: this.formatPercentage(event.taxRate),
        taxOwed: this.formatCurrency(event.taxOwed)
      }))
    };
  }
}