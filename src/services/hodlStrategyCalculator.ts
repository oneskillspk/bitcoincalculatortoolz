import { BitcoinPrice } from './bitcoinApi';

export interface HODLParams {
  investmentAmount: number;
  startDate: Date;
  endDate: Date;
  currency: string;
  strategies: ('hodl' | 'dca-weekly' | 'dca-monthly' | 'buy-dip' | 'rebalance')[];
}

export interface StrategyTimelinePoint {
  date: string;
  value: number;
  btcHoldings: number;
  invested: number;
}

export interface StrategyResult {
  name: string;
  type: 'hodl' | 'dca-weekly' | 'dca-monthly' | 'buy-dip' | 'rebalance';
  totalInvested: number;
  finalValue: number;
  btcAcquired: number;
  roiPercentage: number;
  averageBuyPrice: number;
  numberOfPurchases: number;
  maxDrawdown: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  portfolioTimeline: StrategyTimelinePoint[];
}

export interface ComparisonInsights {
  mostVolatile: string;
  mostStable: string;
  highestReturn: string;
  bestRiskAdjusted: string;
}

export interface HODLResult {
  strategies: StrategyResult[];
  bestStrategy: StrategyResult;
  priceData: BitcoinPrice[];
  comparisonInsights: ComparisonInsights;
}

export class HODLStrategyCalculator {
  static calculateStrategies(params: HODLParams, priceData: BitcoinPrice[]): HODLResult {
    const results: StrategyResult[] = [];
    
    // Filter price data to date range
    const filteredPrices = priceData.filter(p => {
      const priceDate = new Date(p.date);
      return priceDate >= params.startDate && priceDate <= params.endDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredPrices.length === 0) {
      throw new Error('No price data available for selected date range');
    }

    // Calculate each selected strategy
    params.strategies.forEach(strategy => {
      switch (strategy) {
        case 'hodl':
          results.push(this.calculateHODL(params.investmentAmount, filteredPrices));
          break;
        case 'dca-weekly':
          results.push(this.calculateDCA(params.investmentAmount, 'weekly', filteredPrices));
          break;
        case 'dca-monthly':
          results.push(this.calculateDCA(params.investmentAmount, 'monthly', filteredPrices));
          break;
        case 'buy-dip':
          results.push(this.calculateBuyTheDip(params.investmentAmount, filteredPrices));
          break;
        case 'rebalance':
          results.push(this.calculateRebalancing(params.investmentAmount, filteredPrices));
          break;
      }
    });

    const bestStrategy = results.reduce((best, current) => 
      current.roiPercentage > best.roiPercentage ? current : best
    );

    const insights = this.compareStrategies(results);

    return {
      strategies: results,
      bestStrategy,
      priceData: filteredPrices,
      comparisonInsights: insights
    };
  }

  private static calculateHODL(amount: number, priceData: BitcoinPrice[]): StrategyResult {
    const startPrice = priceData[0].price;
    const endPrice = priceData[priceData.length - 1].price;
    const btcAcquired = amount / startPrice;
    const finalValue = btcAcquired * endPrice;
    
    const timeline: StrategyTimelinePoint[] = priceData.map(p => ({
      date: p.date,
      value: btcAcquired * p.price,
      btcHoldings: btcAcquired,
      invested: amount
    }));

    const returns = timeline.map(t => (t.value - amount) / amount);
    const maxDrawdown = this.calculateMaxDrawdown(timeline.map(t => t.value));
    const volatility = this.calculateVolatility(returns);
    const sharpeRatio = this.calculateSharpeRatio(returns, 0.02);
    const sortinoRatio = this.calculateSortinoRatio(returns, 0.02);

    return {
      name: 'Pure HODL',
      type: 'hodl',
      totalInvested: amount,
      finalValue,
      btcAcquired,
      roiPercentage: ((finalValue - amount) / amount) * 100,
      averageBuyPrice: startPrice,
      numberOfPurchases: 1,
      maxDrawdown,
      volatility,
      sharpeRatio,
      sortinoRatio,
      portfolioTimeline: timeline
    };
  }

  private static calculateDCA(
    amount: number, 
    frequency: 'weekly' | 'monthly', 
    priceData: BitcoinPrice[]
  ): StrategyResult {
    const intervalDays = frequency === 'weekly' ? 7 : 30;
    let btcHoldings = 0;
    let totalInvested = 0;
    let numberOfPurchases = 0;
    let lastPurchaseDate = new Date(priceData[0].date);
    const timeline: StrategyTimelinePoint[] = [];

    // Calculate number of periods
    const totalDays = (new Date(priceData[priceData.length - 1].date).getTime() - 
                       new Date(priceData[0].date).getTime()) / (1000 * 60 * 60 * 24);
    const numberOfPeriods = Math.floor(totalDays / intervalDays);
    const amountPerPurchase = numberOfPeriods > 0 ? amount / numberOfPeriods : amount;

    priceData.forEach(price => {
      const currentDate = new Date(price.date);
      const daysDiff = (currentDate.getTime() - lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff >= intervalDays && totalInvested < amount) {
        const purchaseAmount = Math.min(amountPerPurchase, amount - totalInvested);
        btcHoldings += purchaseAmount / price.price;
        totalInvested += purchaseAmount;
        numberOfPurchases++;
        lastPurchaseDate = currentDate;
      }

      timeline.push({
        date: price.date,
        value: btcHoldings * price.price,
        btcHoldings,
        invested: totalInvested
      });
    });

    const finalValue = btcHoldings * priceData[priceData.length - 1].price;
    const averageBuyPrice = totalInvested / btcHoldings;
    const returns = timeline.filter(t => t.invested > 0).map(t => (t.value - t.invested) / t.invested);
    
    return {
      name: frequency === 'weekly' ? 'DCA Weekly' : 'DCA Monthly',
      type: frequency === 'weekly' ? 'dca-weekly' : 'dca-monthly',
      totalInvested,
      finalValue,
      btcAcquired: btcHoldings,
      roiPercentage: ((finalValue - totalInvested) / totalInvested) * 100,
      averageBuyPrice,
      numberOfPurchases,
      maxDrawdown: this.calculateMaxDrawdown(timeline.map(t => t.value)),
      volatility: this.calculateVolatility(returns),
      sharpeRatio: this.calculateSharpeRatio(returns, 0.02),
      sortinoRatio: this.calculateSortinoRatio(returns, 0.02),
      portfolioTimeline: timeline
    };
  }

  private static calculateBuyTheDip(amount: number, priceData: BitcoinPrice[]): StrategyResult {
    const dipThreshold = 0.10; // 10% drop
    let btcHoldings = 0;
    let totalInvested = 0;
    let numberOfPurchases = 0;
    let localPeak = priceData[0].price;
    const timeline: StrategyTimelinePoint[] = [];
    const purchaseAmount = amount / 10; // Divide into 10 potential buys

    priceData.forEach((price, index) => {
      if (price.price > localPeak) {
        localPeak = price.price;
      }

      const dropPercent = (localPeak - price.price) / localPeak;
      
      if (dropPercent >= dipThreshold && totalInvested < amount) {
        const buyAmount = Math.min(purchaseAmount, amount - totalInvested);
        btcHoldings += buyAmount / price.price;
        totalInvested += buyAmount;
        numberOfPurchases++;
        localPeak = price.price; // Reset peak after buy
      }

      timeline.push({
        date: price.date,
        value: btcHoldings * price.price,
        btcHoldings,
        invested: totalInvested
      });
    });

    // If we didn't spend all money, buy at the end
    if (totalInvested < amount && priceData.length > 0) {
      const remainingAmount = amount - totalInvested;
      const lastPrice = priceData[priceData.length - 1].price;
      btcHoldings += remainingAmount / lastPrice;
      totalInvested += remainingAmount;
      numberOfPurchases++;
    }

    const finalValue = btcHoldings * priceData[priceData.length - 1].price;
    const averageBuyPrice = totalInvested / btcHoldings;
    const returns = timeline.filter(t => t.invested > 0).map(t => (t.value - t.invested) / t.invested);

    return {
      name: 'Buy the Dip',
      type: 'buy-dip',
      totalInvested,
      finalValue,
      btcAcquired: btcHoldings,
      roiPercentage: ((finalValue - totalInvested) / totalInvested) * 100,
      averageBuyPrice,
      numberOfPurchases,
      maxDrawdown: this.calculateMaxDrawdown(timeline.map(t => t.value)),
      volatility: this.calculateVolatility(returns),
      sharpeRatio: this.calculateSharpeRatio(returns, 0.02),
      sortinoRatio: this.calculateSortinoRatio(returns, 0.02),
      portfolioTimeline: timeline
    };
  }

  private static calculateRebalancing(amount: number, priceData: BitcoinPrice[]): StrategyResult {
    const btcRatio = 0.6; // 60% BTC, 40% cash
    let btcHoldings = (amount * btcRatio) / priceData[0].price;
    let cashHoldings = amount * (1 - btcRatio);
    let numberOfPurchases = 1;
    let totalInvested = amount;
    const timeline: StrategyTimelinePoint[] = [];
    let lastRebalanceDate = new Date(priceData[0].date);

    priceData.forEach(price => {
      const currentDate = new Date(price.date);
      const daysSinceRebalance = (currentDate.getTime() - lastRebalanceDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Rebalance monthly
      if (daysSinceRebalance >= 30) {
        const totalValue = btcHoldings * price.price + cashHoldings;
        const targetBtcValue = totalValue * btcRatio;
        const currentBtcValue = btcHoldings * price.price;
        
        if (currentBtcValue > targetBtcValue) {
          // Sell BTC to rebalance
          const btcToSell = (currentBtcValue - targetBtcValue) / price.price;
          btcHoldings -= btcToSell;
          cashHoldings += btcToSell * price.price;
        } else {
          // Buy BTC to rebalance
          const btcToBuy = (targetBtcValue - currentBtcValue) / price.price;
          const cost = btcToBuy * price.price;
          if (cost <= cashHoldings) {
            btcHoldings += btcToBuy;
            cashHoldings -= cost;
            numberOfPurchases++;
          }
        }
        
        lastRebalanceDate = currentDate;
      }

      const portfolioValue = btcHoldings * price.price + cashHoldings;
      timeline.push({
        date: price.date,
        value: portfolioValue,
        btcHoldings,
        invested: totalInvested
      });
    });

    const finalValue = btcHoldings * priceData[priceData.length - 1].price + cashHoldings;
    const averageBuyPrice = (amount * btcRatio) / btcHoldings;
    const returns = timeline.map(t => (t.value - amount) / amount);

    return {
      name: 'Rebalancing (60/40)',
      type: 'rebalance',
      totalInvested,
      finalValue,
      btcAcquired: btcHoldings,
      roiPercentage: ((finalValue - totalInvested) / totalInvested) * 100,
      averageBuyPrice,
      numberOfPurchases,
      maxDrawdown: this.calculateMaxDrawdown(timeline.map(t => t.value)),
      volatility: this.calculateVolatility(returns),
      sharpeRatio: this.calculateSharpeRatio(returns, 0.02),
      sortinoRatio: this.calculateSortinoRatio(returns, 0.02),
      portfolioTimeline: timeline
    };
  }

  private static calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const volatility = this.calculateVolatility(returns);
    
    if (volatility === 0) return 0;
    
    return (avgReturn - riskFreeRate) / volatility;
  }

  private static calculateSortinoRatio(returns: number[], riskFreeRate: number): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const negativeReturns = returns.filter(r => r < 0);
    
    if (negativeReturns.length === 0) return avgReturn > riskFreeRate ? Infinity : 0;
    
    const downside = Math.sqrt(
      negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length
    );
    
    if (downside === 0) return 0;
    
    return (avgReturn - riskFreeRate) / downside;
  }

  private static calculateMaxDrawdown(values: number[]): number {
    if (values.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = values[0];
    
    values.forEach(value => {
      if (value > peak) {
        peak = value;
      }
      const drawdown = ((peak - value) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    return maxDrawdown;
  }

  private static calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  static compareStrategies(results: StrategyResult[]): ComparisonInsights {
    if (results.length === 0) {
      return {
        mostVolatile: 'N/A',
        mostStable: 'N/A',
        highestReturn: 'N/A',
        bestRiskAdjusted: 'N/A'
      };
    }

    const mostVolatile = results.reduce((max, r) => r.volatility > max.volatility ? r : max);
    const mostStable = results.reduce((min, r) => r.volatility < min.volatility ? r : min);
    const highestReturn = results.reduce((max, r) => r.roiPercentage > max.roiPercentage ? r : max);
    const bestRiskAdjusted = results.reduce((max, r) => r.sharpeRatio > max.sharpeRatio ? r : max);

    return {
      mostVolatile: mostVolatile.name,
      mostStable: mostStable.name,
      highestReturn: highestReturn.name,
      bestRiskAdjusted: bestRiskAdjusted.name
    };
  }

  static rankStrategies(results: StrategyResult[], metric: 'roi' | 'sharpe' | 'drawdown'): StrategyResult[] {
    return [...results].sort((a, b) => {
      switch (metric) {
        case 'roi':
          return b.roiPercentage - a.roiPercentage;
        case 'sharpe':
          return b.sharpeRatio - a.sharpeRatio;
        case 'drawdown':
          return a.maxDrawdown - b.maxDrawdown;
        default:
          return 0;
      }
    });
  }
}
