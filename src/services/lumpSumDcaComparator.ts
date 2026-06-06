import { BitcoinPrice } from './bitcoinApi';
import { format } from 'date-fns';

export interface LumpSumParams {
  amount: number;
  investmentDate: Date;
  currency: string;
}

export interface DCAParams {
  totalAmount: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  currency: string;
}

export interface DVAParams {
  totalAmount: number;
  targetGrowthPerPeriod: number;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  currency: string;
}

export interface StrategyResult {
  strategy: 'lump-sum' | 'dca' | 'dva';
  totalInvested: number;
  totalBitcoin: number;
  currentValue: number;
  profitLoss: number;
  roiPercentage: number;
  averageBuyPrice: number;
  purchases: Purchase[];
  performanceMetrics: {
    maxDrawdown: number;
    volatility: number;
    sharpeRatio: number;
    bestDay: { date: string; value: number };
    worstDay: { date: string; value: number };
  };
}

export interface Purchase {
  date: string;
  amount: number;
  bitcoinPrice: number;
  bitcoinAmount: number;
  totalBitcoin: number;
  totalInvested: number;
  currentValue: number;
}

export interface ComparisonResult {
  lumpSum: StrategyResult;
  dca: StrategyResult;
  dva?: StrategyResult;
  winner: 'lump-sum' | 'dca' | 'dva' | 'tie';
  difference: {
    absoluteValue: number;
    percentageDifference: number;
    profitDifference: number;
  };
  summary: {
    betterStrategy: string;
    winMargin: number;
    riskAnalysis: {
      lumpSumRisk: 'low' | 'medium' | 'high';
      dcaRisk: 'low' | 'medium' | 'high';
      dvaRisk?: 'low' | 'medium' | 'high';
      recommendation: string;
    };
  };
}

export class LumpSumDCAComparator {
  static generateDCAPurchaseDates(startDate: Date, endDate: Date, frequency: string): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };
    
    const interval = frequency === 'daily' ? 1 : 
                     frequency === 'weekly' ? 7 : 
                     frequency === 'bi-weekly' ? 14 : 30;
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate = addDays(currentDate, interval);
    }
    
    return dates;
  }

  static findClosestPrice(date: string, priceData: BitcoinPrice[]): number {
    const priceMap = new Map(priceData.map(p => [p.date, p.price]));
    
    if (priceMap.has(date)) {
      return priceMap.get(date)!;
    }
    
    const targetDate = new Date(date);
    for (let i = 0; i <= 7; i++) {
      const beforeDate = new Date(targetDate);
      beforeDate.setDate(beforeDate.getDate() - i);
      const afterDate = new Date(targetDate);
      afterDate.setDate(afterDate.getDate() + i);
      
      const beforeStr = format(beforeDate, 'yyyy-MM-dd');
      const afterStr = format(afterDate, 'yyyy-MM-dd');
      
      if (priceMap.has(beforeStr)) return priceMap.get(beforeStr)!;
      if (priceMap.has(afterStr)) return priceMap.get(afterStr)!;
    }
    
    return 0;
  }

  static calculateLumpSum(params: LumpSumParams, priceData: BitcoinPrice[]): StrategyResult {
    const { amount, investmentDate } = params;
    const dateStr = format(investmentDate, 'yyyy-MM-dd');
    
    const buyPrice = this.findClosestPrice(dateStr, priceData);
    const currentPrice = priceData[priceData.length - 1]?.price || 0;
    
    const bitcoinAmount = amount / buyPrice;
    const currentValue = bitcoinAmount * currentPrice;
    const profitLoss = currentValue - amount;
    const roiPercentage = (profitLoss / amount) * 100;
    
    const purchase: Purchase = {
      date: dateStr,
      amount,
      bitcoinPrice: buyPrice,
      bitcoinAmount,
      totalBitcoin: bitcoinAmount,
      totalInvested: amount,
      currentValue
    };

    const portfolioValues = priceData
      .filter(p => new Date(p.date) >= investmentDate)
      .map(p => ({
        date: p.date,
        value: bitcoinAmount * p.price
      }));

    const performanceMetrics = this.calculatePerformanceMetrics(portfolioValues, amount);
    
    return {
      strategy: 'lump-sum',
      totalInvested: amount,
      totalBitcoin: bitcoinAmount,
      currentValue,
      profitLoss,
      roiPercentage,
      averageBuyPrice: buyPrice,
      purchases: [purchase],
      performanceMetrics
    };
  }

  static calculateDCA(params: DCAParams, priceData: BitcoinPrice[]): StrategyResult {
    const { totalAmount, frequency, startDate, endDate } = params;
    
    const purchaseDates = this.generateDCAPurchaseDates(startDate, endDate, frequency);
    const amountPerPurchase = totalAmount / purchaseDates.length;
    
    const purchases: Purchase[] = [];
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    purchaseDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const price = this.findClosestPrice(dateStr, priceData);
      
      if (price > 0) {
        const bitcoinAmount = amountPerPurchase / price;
        totalInvested += amountPerPurchase;
        totalBitcoin += bitcoinAmount;
        
        const currentPrice = priceData[priceData.length - 1]?.price || price;
        const currentValue = totalBitcoin * currentPrice;
        
        purchases.push({
          date: dateStr,
          amount: amountPerPurchase,
          bitcoinPrice: price,
          bitcoinAmount,
          totalBitcoin,
          totalInvested,
          currentValue
        });
      }
    });
    
    const currentPrice = priceData[priceData.length - 1]?.price || 0;
    const currentValue = totalBitcoin * currentPrice;
    const profitLoss = currentValue - totalInvested;
    const roiPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
    const averageBuyPrice = totalInvested / totalBitcoin;

    // NOTE: DCA portfolioValues only has entries at purchase dates (e.g., monthly = 12 points/year).
    // Volatility and Sharpe computed from these sparse points are less precise than lump sum's daily timeline.
    const portfolioValues = purchases.map(p => ({
      date: p.date,
      value: p.currentValue
    }));

    const performanceMetrics = this.calculatePerformanceMetrics(portfolioValues, totalInvested);
    
    return {
      strategy: 'dca',
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

  static calculateDVA(params: DVAParams, priceData: BitcoinPrice[]): StrategyResult {
    const { targetGrowthPerPeriod, frequency, startDate, endDate } = params;
    
    const purchaseDates = this.generateDCAPurchaseDates(startDate, endDate, frequency);
    
    const purchases: Purchase[] = [];
    let totalInvested = 0;
    let totalBitcoin = 0;
    
    purchaseDates.forEach((date, index) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const price = this.findClosestPrice(dateStr, priceData);
      
      if (price > 0) {
        const periodNumber = index + 1;
        const targetValue = targetGrowthPerPeriod * periodNumber;
        const currentHoldingsValue = totalBitcoin * price;
        let investmentNeeded = targetValue - currentHoldingsValue;
        
        // In no-sell mode: if investmentNeeded < 0, invest $0 this period
        if (investmentNeeded < 0) {
          investmentNeeded = 0;
        }
        
        const bitcoinAmount = investmentNeeded / price;
        totalInvested += investmentNeeded;
        totalBitcoin += bitcoinAmount;
        
        const currentPrice = priceData[priceData.length - 1]?.price || price;
        const currentValue = totalBitcoin * currentPrice;
        
        purchases.push({
          date: dateStr,
          amount: investmentNeeded,
          bitcoinPrice: price,
          bitcoinAmount,
          totalBitcoin,
          totalInvested,
          currentValue
        });
      }
    });
    
    const currentPrice = priceData[priceData.length - 1]?.price || 0;
    const currentValue = totalBitcoin * currentPrice;
    const profitLoss = currentValue - totalInvested;
    const roiPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
    const averageBuyPrice = totalBitcoin > 0 ? totalInvested / totalBitcoin : 0;

    const portfolioValues = purchases.map(p => ({
      date: p.date,
      value: p.currentValue
    }));

    const performanceMetrics = this.calculatePerformanceMetrics(portfolioValues, totalInvested);
    
    return {
      strategy: 'dva',
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

  static calculatePerformanceMetrics(portfolioValues: Array<{date: string, value: number}>, initialInvestment: number) {
    if (portfolioValues.length === 0) {
      return {
        maxDrawdown: 0,
        volatility: 0,
        sharpeRatio: 0,
        bestDay: { date: '', value: 0 },
        worstDay: { date: '', value: 0 }
      };
    }

    const returns = portfolioValues.map((val, index) => {
      if (index === 0) return 0;
      const prevValue = portfolioValues[index - 1].value;
      return prevValue > 0 ? (val.value - prevValue) / prevValue : 0;
    });

    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252);

    let maxDrawdown = 0;
    let peak = 0;
    portfolioValues.forEach(val => {
      if (val.value > peak) peak = val.value;
      const drawdown = peak > 0 ? (peak - val.value) / peak : 0;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    const sortedValues = [...portfolioValues].sort((a, b) => b.value - a.value);
    const bestDay = sortedValues[0];
    const worstDay = sortedValues[sortedValues.length - 1];

    const riskFreeRate = 0.045;
    const annualizedReturn = avgReturn * 252;
    const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;

    return {
      maxDrawdown,
      volatility,
      sharpeRatio,
      bestDay,
      worstDay
    };
  }

  static compare(
    lumpSumParams: LumpSumParams,
    dcaParams: DCAParams,
    priceData: BitcoinPrice[],
    dvaParams?: DVAParams
  ): ComparisonResult {
    const lumpSum = this.calculateLumpSum(lumpSumParams, priceData);
    const dca = this.calculateDCA(dcaParams, priceData);
    const dva = dvaParams ? this.calculateDVA(dvaParams, priceData) : undefined;
    
    // Determine winner across all strategies
    const candidates: Array<{ strategy: 'lump-sum' | 'dca' | 'dva'; value: number }> = [
      { strategy: 'lump-sum', value: lumpSum.currentValue },
      { strategy: 'dca', value: dca.currentValue }
    ];
    if (dva) {
      candidates.push({ strategy: 'dva', value: dva.currentValue });
    }
    
    candidates.sort((a, b) => b.value - a.value);
    const topValue = candidates[0].value;
    const allSame = candidates.every(c => c.value === topValue);
    
    const winner: 'lump-sum' | 'dca' | 'dva' | 'tie' = allSame ? 'tie' : candidates[0].strategy;
    
    const absoluteValue = candidates[0].value - candidates[candidates.length - 1].value;
    const percentageDifference = candidates[candidates.length - 1].value > 0 
      ? (absoluteValue / candidates[candidates.length - 1].value) * 100 
      : 0;
    const profitDifference = Math.abs(lumpSum.profitLoss - dca.profitLoss);
    
    // Risk analysis
    const lumpSumRisk = lumpSum.performanceMetrics.maxDrawdown > 0.5 ? 'high' : 
                        lumpSum.performanceMetrics.maxDrawdown > 0.2 ? 'medium' : 'low';
    const dcaRisk = dca.performanceMetrics.maxDrawdown > 0.4 ? 'high' : 
                    dca.performanceMetrics.maxDrawdown > 0.15 ? 'medium' : 'low';
    const dvaRisk = dva ? (dva.performanceMetrics.maxDrawdown > 0.45 ? 'high' : 
                    dva.performanceMetrics.maxDrawdown > 0.18 ? 'medium' : 'low') : undefined;
    
    let recommendation = '';
    const winnerName = winner === 'lump-sum' ? 'Lump Sum' : winner === 'dca' ? 'DCA' : winner === 'dva' ? 'DVA' : '';
    if (winner !== 'tie') {
      recommendation = percentageDifference > 20 
        ? `${winnerName} significantly outperformed the other strategies in this scenario`
        : `${winnerName} slightly outperformed the other strategies`;
    } else {
      recommendation = 'All strategies performed similarly';
    }
    
    if (dva) {
      recommendation += '. DVA adapts investment amounts based on portfolio targets, investing more when prices drop and less when prices rise.';
    }
    
    return {
      lumpSum,
      dca,
      dva,
      winner,
      difference: {
        absoluteValue,
        percentageDifference,
        profitDifference
      },
      summary: {
        betterStrategy: winner === 'tie' ? 'Both equally' : winnerName,
        winMargin: percentageDifference,
        riskAnalysis: {
          lumpSumRisk,
          dcaRisk,
          dvaRisk,
          recommendation
        }
      }
    };
  }
}

export const lumpSumDcaComparator = LumpSumDCAComparator;
