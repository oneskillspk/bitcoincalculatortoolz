import { BitcoinPrice } from './bitcoinApi';
import { addDays, format } from 'date-fns';

export interface MonteCarloParams {
  initialPrice: number;
  projectionDays: number;
  simulationCount: number;
  volatility: number;
  drift: number; // Expected annual return
}

export interface SimulationResult {
  paths: SimulationPath[];
  statistics: {
    mean: number;
    median: number;
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    standardDeviation: number;
    probabilityOfProfit: number;
  };
  confidence: {
    days30: PriceRange;
    days90: PriceRange;
    days180: PriceRange;
    days365: PriceRange;
  };
}

export interface SimulationPath {
  pathId: number;
  prices: { date: string; price: number }[];
  finalPrice: number;
  return: number;
}

export interface PriceRange {
  low: number;
  high: number;
  mean: number;
  probability: number;
}

export class MonteCarloSimulator {
  static runSimulation(params: MonteCarloParams, historicalData?: BitcoinPrice[]): SimulationResult {
    const { initialPrice, projectionDays, simulationCount, volatility, drift } = params;
    
    // If historical data is provided, calculate parameters from it
    let adjustedVolatility = volatility;
    let adjustedDrift = drift;
    
    if (historicalData && historicalData.length > 30) {
      const calculatedParams = this.calculateParametersFromHistory(historicalData);
      adjustedVolatility = calculatedParams.volatility;
      adjustedDrift = calculatedParams.drift;
    }
    
    const paths: SimulationPath[] = [];
    const finalPrices: number[] = [];
    
    for (let i = 0; i < simulationCount; i++) {
      const path = this.generatePath(i, initialPrice, projectionDays, adjustedVolatility, adjustedDrift);
      paths.push(path);
      finalPrices.push(path.finalPrice);
    }
    
    // Calculate statistics
    const statistics = this.calculateStatistics(finalPrices, initialPrice);
    
    // Calculate confidence intervals for different time horizons
    const confidence = this.calculateConfidenceIntervals(paths, projectionDays);
    
    return {
      paths: paths.slice(0, 100), // Return only 100 paths for visualization
      statistics,
      confidence
    };
  }
  
  private static generatePath(
    pathId: number,
    initialPrice: number,
    days: number,
    volatility: number,
    drift: number
  ): SimulationPath {
    const prices: { date: string; price: number }[] = [];
    let currentPrice = initialPrice;
    const dt = 1 / 365; // Daily time step
    
    const startDate = new Date();
    prices.push({
      date: format(startDate, 'yyyy-MM-dd'),
      price: currentPrice
    });
    
    for (let day = 1; day <= days; day++) {
      // Geometric Brownian Motion: dS = μ*S*dt + σ*S*dW
      const random = this.boxMullerTransform();
      const priceChange = drift * currentPrice * dt + volatility * currentPrice * Math.sqrt(dt) * random;
      currentPrice += priceChange;
      
      // Ensure price doesn't go negative
      currentPrice = Math.max(currentPrice, 0.01);
      
      prices.push({
        date: format(addDays(startDate, day), 'yyyy-MM-dd'),
        price: currentPrice
      });
    }
    
    const finalPrice = currentPrice;
    const returnPercent = ((finalPrice - initialPrice) / initialPrice) * 100;
    
    return {
      pathId,
      prices,
      finalPrice,
      return: returnPercent
    };
  }
  
  private static calculateParametersFromHistory(historicalData: BitcoinPrice[]) {
    const returns: number[] = [];
    
    for (let i = 1; i < historicalData.length; i++) {
      const prevPrice = historicalData[i - 1].price;
      const currentPrice = historicalData[i].price;
      const dailyReturn = Math.log(currentPrice / prevPrice);
      returns.push(dailyReturn);
    }
    
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance * 252); // Annualized volatility
    const drift = meanReturn * 252; // Annualized drift
    
    return { volatility, drift };
  }
  
  private static calculateStatistics(finalPrices: number[], initialPrice: number) {
    const sortedPrices = [...finalPrices].sort((a, b) => a - b);
    const returns = finalPrices.map(price => ((price - initialPrice) / initialPrice) * 100);
    
    const mean = finalPrices.reduce((sum, price) => sum + price, 0) / finalPrices.length;
    const median = sortedPrices[Math.floor(sortedPrices.length / 2)];
    
    const percentile5 = sortedPrices[Math.floor(sortedPrices.length * 0.05)];
    const percentile25 = sortedPrices[Math.floor(sortedPrices.length * 0.25)];
    const percentile75 = sortedPrices[Math.floor(sortedPrices.length * 0.75)];
    const percentile95 = sortedPrices[Math.floor(sortedPrices.length * 0.95)];
    
    const variance = finalPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / finalPrices.length;
    const standardDeviation = Math.sqrt(variance);
    
    const profitablePaths = returns.filter(ret => ret > 0).length;
    const probabilityOfProfit = (profitablePaths / returns.length) * 100;
    
    return {
      mean,
      median,
      percentile5,
      percentile25,
      percentile75,
      percentile95,
      standardDeviation,
      probabilityOfProfit
    };
  }
  
  private static calculateConfidenceIntervals(paths: SimulationPath[], projectionDays: number) {
    const intervals = [30, 90, 180, 365];
    const confidence: any = {};
    
    intervals.forEach(days => {
      if (days <= projectionDays) {
        const pricesAtDay = paths.map(path => {
          const dayIndex = Math.min(days, path.prices.length - 1);
          return path.prices[dayIndex]?.price || path.finalPrice;
        }).sort((a, b) => a - b);
        
        const low = pricesAtDay[Math.floor(pricesAtDay.length * 0.05)]; // 5th percentile
        const high = pricesAtDay[Math.floor(pricesAtDay.length * 0.95)]; // 95th percentile
        const mean = pricesAtDay.reduce((sum, price) => sum + price, 0) / pricesAtDay.length;
        
        const key = `days${days}`;
        confidence[key] = {
          low,
          high,
          mean,
          probability: 90 // 90% confidence interval
        };
      }
    });
    
    return confidence;
  }
  
  // Box-Muller transformation for generating normally distributed random numbers
  private static boxMullerTransform(): number {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random(); // Converting [0,1) to (0,1)
    while (u2 === 0) u2 = Math.random();
    
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0;
  }
}