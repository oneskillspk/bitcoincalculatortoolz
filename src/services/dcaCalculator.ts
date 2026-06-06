import { BitcoinPrice } from './bitcoinApi';
import { addDays, addWeeks, addMonths } from 'date-fns';

export interface DCAParams {
  totalAmount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  currency: string;
}

export interface DCAResult {
  totalInvested: number;
  totalBitcoin: number;
  currentValue: number;
  profitLoss: number;
  roiPercentage: number;
  averageBuyPrice: number;
  purchases: DCAPurchase[];
  performanceMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    averageReturn: number;
  };
}

export interface DCAPurchase {
  date: string;
  amount: number;
  bitcoinPrice: number;
  bitcoinAmount: number;
  totalBitcoin: number;
  totalInvested: number;
  currentValue: number;
  unrealizedPL: number;
}

export class DCACalculator {
  static calculateDCA(params: DCAParams, priceData: BitcoinPrice[]): DCAResult {
    const { totalAmount, frequency, startDate, endDate } = params;

    // Calculate purchase dates based on frequency
    const purchaseDates = this.generatePurchaseDates(startDate, endDate, frequency);
    const amountPerPurchase = totalAmount / purchaseDates.length;

    const purchases: DCAPurchase[] = [];
    let totalInvested = 0;
    let totalBitcoin = 0;

    // Build the price lookup once and reuse it for both the purchase loop and
    // the performance metrics step. Sorted dates back the binary-search lookup.
    const priceMap = new Map(priceData.map(p => [p.date, p.price]));
    const sortedDates = priceData.map(p => p.date).sort();
    const currentPrice = priceData[priceData.length - 1]?.price || 0;

    purchaseDates.forEach(date => {
      // toISOString().slice(0,10) matches 'yyyy-MM-dd' but is ~10x faster than date-fns format
      const dateStr = date.toISOString().slice(0, 10);
      const price = this.findClosestPrice(dateStr, priceMap, sortedDates);

      if (price > 0) {
        const bitcoinAmount = amountPerPurchase / price;
        totalInvested += amountPerPurchase;
        totalBitcoin += bitcoinAmount;

        const currentValue = totalBitcoin * currentPrice;
        const unrealizedPL = currentValue - totalInvested;

        purchases.push({
          date: dateStr,
          amount: amountPerPurchase,
          bitcoinPrice: price,
          bitcoinAmount,
          totalBitcoin,
          totalInvested,
          currentValue,
          unrealizedPL
        });
      }
    });

    const currentValue = totalBitcoin * currentPrice;
    const profitLoss = currentValue - totalInvested;
    const roiPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
    const averageBuyPrice = totalBitcoin > 0 ? totalInvested / totalBitcoin : 0;

    // Calculate performance metrics using actual portfolio valuations
    const performanceMetrics = this.calculatePerformanceMetrics(
      purchases,
      priceMap,
      sortedDates,
      frequency
    );

    return {
      totalInvested,
      totalBitcoin,
      currentValue,
      profitLoss,
      roiPercentage,
      averageBuyPrice,
      purchases,
      performanceMetrics
    };
  }
  
  private static generatePurchaseDates(startDate: Date, endDate: Date, frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly'): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      
      switch (frequency) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'bi-weekly':
          currentDate = addWeeks(currentDate, 2);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
        case 'quarterly':
          currentDate = addMonths(currentDate, 3);
          break;
      }
    }
    
    return dates;
  }
  
  /**
   * Find the price for `date`, falling back to the nearest available date within ±7 days.
   * `sortedDates` enables an O(log n) binary search instead of repeated O(n) scans.
   */
  private static findClosestPrice(
    date: string,
    priceMap: Map<string, number>,
    sortedDates: string[]
  ): number {
    const direct = priceMap.get(date);
    if (direct !== undefined) return direct;

    if (sortedDates.length === 0) return 0;

    // Binary search for the insertion index of `date`
    let lo = 0;
    let hi = sortedDates.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (sortedDates[mid] < date) lo = mid + 1;
      else hi = mid;
    }

    // Pick the closer of the two neighbours (in days), but only accept if within 7 days.
    const candidates: string[] = [];
    if (lo > 0) candidates.push(sortedDates[lo - 1]);
    candidates.push(sortedDates[lo]);

    const target = Date.parse(date);
    let best: string | null = null;
    let bestDiff = Infinity;
    for (const c of candidates) {
      const diff = Math.abs(Date.parse(c) - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = c;
      }
    }

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (best !== null && bestDiff <= SEVEN_DAYS_MS) {
      return priceMap.get(best) ?? 0;
    }
    return 0;
  }
  
  private static getPeriodsPerYear(frequency: DCAParams['frequency']): number {
    switch (frequency) {
      case 'daily': return 365;
      case 'weekly': return 52;
      case 'bi-weekly': return 26;
      case 'monthly': return 12;
      case 'quarterly': return 4;
    }
  }

  private static calculatePerformanceMetrics(
    purchases: DCAPurchase[],
    priceMap: Map<string, number>,
    sortedDates: string[],
    frequency: DCAParams['frequency']
  ) {
    if (purchases.length < 2) {
      return { sharpeRatio: 0, maxDrawdown: 0, volatility: 0, averageReturn: 0 };
    }

    // Reuses prebuilt priceMap + sortedDates from calculateDCA — no rebuild here.
    const portfolioValues: number[] = purchases.map(purchase => {
      const priceAtDate = this.findClosestPrice(purchase.date, priceMap, sortedDates);
      return purchase.totalBitcoin * priceAtDate;
    });

    // Calculate per-period returns based on actual portfolio value changes
    const returns: number[] = [];
    for (let i = 1; i < portfolioValues.length; i++) {
      // Account for the new investment: return = (endValue - startValue - newInvestment) / startValue
      const prevValue = portfolioValues[i - 1];
      const newInvestment = purchases[i].amount;
      if (prevValue + newInvestment > 0) {
        returns.push((portfolioValues[i] - prevValue - newInvestment) / (prevValue + newInvestment));
      } else {
        returns.push(0);
      }
    }

    const periodsPerYear = this.getPeriodsPerYear(frequency);

    const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - averageReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(periodsPerYear); // Annualized

    // Max drawdown using actual portfolio valuations
    let maxDrawdown = 0;
    let peak = 0;
    for (const value of portfolioValues) {
      if (value > peak) peak = value;
      if (peak > 0) {
        const drawdown = (peak - value) / peak;
        if (drawdown > maxDrawdown) maxDrawdown = drawdown;
      }
    }

    // Sharpe ratio: annualize average return, then subtract annual risk-free rate
    const annualizedReturn = averageReturn * periodsPerYear;
    const riskFreeRate = 0.02; // 2% annual
    const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;

    return {
      sharpeRatio,
      maxDrawdown,
      volatility,
      averageReturn: annualizedReturn
    };
  }
}

export default DCACalculator;