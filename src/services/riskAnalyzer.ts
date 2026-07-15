import { BitcoinPrice } from './bitcoinApi';
import { addDays, differenceInDays } from 'date-fns';

export interface RiskMetrics {
  volatility: number; // Annualized volatility
  sharpeRatio: number;
  maxDrawdown: number;
  valueAtRisk95: number; // 95% VaR
  valueAtRisk99: number; // 99% VaR
  beta: number; // Beta vs market (S&P 500 proxy)
  calmarRatio: number | null;
  sortinoRatio: number | null;
  averageReturn: number;
  standardDeviation: number;
}


export interface VolatilityAnalysis {
  current: number;
  historical30d: number;
  historical90d: number;
  historical1y: number;
  volatilityRegime: 'low' | 'normal' | 'high' | 'extreme';
  riskLevel: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
}

export interface DrawdownPeriod {
  startDate: string;
  endDate: string;
  peakValue: number;
  troughValue: number;
  drawdownPercent: number;
  recoveryDays: number;
}

export class RiskAnalyzer {
  static calculateRiskMetrics(priceData: BitcoinPrice[], benchmarkData?: number[]): RiskMetrics {
    const returns = this.calculateReturns(priceData);
    const averageReturn = returns.length > 0
      ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length
      : 0;
    const standardDeviation = this.calculateStandardDeviation(returns, averageReturn);
    const volatility = standardDeviation * Math.sqrt(252); // Annualized

    const maxDrawdown = this.calculateMaxDrawdown(priceData);
    const sharpeRatio = this.calculateSharpeRatio(returns, 0.02 / 252); // 2% annual risk-free rate
    const calmarRatio = Math.abs(maxDrawdown) > 0 && Number.isFinite(averageReturn)
      ? (averageReturn * 252) / Math.abs(maxDrawdown)
      : null;
    const sortinoRatio = this.calculateSortinoRatio(returns, 0.02 / 252);

    
    // Calculate VaR (Value at Risk)
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const valueAtRisk95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)];
    const valueAtRisk99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)];
    
    // Calculate Beta (if benchmark data is provided)
    const beta = benchmarkData ? this.calculateBeta(returns, benchmarkData) : 1;
    
    return {
      volatility,
      sharpeRatio,
      maxDrawdown,
      valueAtRisk95,
      valueAtRisk99,
      beta,
      calmarRatio,
      sortinoRatio,
      averageReturn: averageReturn * 252, // Annualized
      standardDeviation
    };
  }
  
  static calculateVolatilityAnalysis(priceData: BitcoinPrice[]): VolatilityAnalysis {
    const currentVolatility = this.calculateRollingVolatility(priceData, 30);
    const historical30d = this.calculateRollingVolatility(priceData, 30);
    const historical90d = this.calculateRollingVolatility(priceData, 90);
    const historical1y = this.calculateRollingVolatility(priceData, 365);
    
    // Determine volatility regime
    let volatilityRegime: 'low' | 'normal' | 'high' | 'extreme';
    if (currentVolatility < 0.3) volatilityRegime = 'low';
    else if (currentVolatility < 0.6) volatilityRegime = 'normal';
    else if (currentVolatility < 1.0) volatilityRegime = 'high';
    else volatilityRegime = 'extreme';
    
    // Determine risk level
    let riskLevel: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
    if (currentVolatility < 0.2) riskLevel = 'conservative';
    else if (currentVolatility < 0.5) riskLevel = 'moderate';
    else if (currentVolatility < 0.8) riskLevel = 'aggressive';
    else riskLevel = 'speculative';
    
    return {
      current: currentVolatility,
      historical30d,
      historical90d,
      historical1y,
      volatilityRegime,
      riskLevel
    };
  }
  
  static findDrawdownPeriods(priceData: BitcoinPrice[]): DrawdownPeriod[] {
    const drawdowns: DrawdownPeriod[] = [];
    let peak = priceData[0]?.price || 0;
    let peakDate = priceData[0]?.date || '';
    let inDrawdown = false;
    let startDate = '';
    
    for (let i = 1; i < priceData.length; i++) {
      const current = priceData[i];
      
      if (current.price > peak) {
        if (inDrawdown) {
          const troughIndex = i - 1;
          const trough = priceData[troughIndex];
          const drawdownPercent = ((peak - trough.price) / peak) * 100;
          
          let recoveryDays = 0;
          for (let j = i; j < priceData.length; j++) {
            if (priceData[j].price >= peak) {
              recoveryDays = differenceInDays(new Date(priceData[j].date), new Date(trough.date));
              break;
            }
          }
          
          drawdowns.push({
            startDate,
            endDate: trough.date,
            peakValue: peak,
            troughValue: trough.price,
            drawdownPercent,
            recoveryDays
          });
          
          inDrawdown = false;
        }
        
        peak = current.price;
        peakDate = current.date;
      } else if (!inDrawdown && current.price < peak * 0.95) {
        inDrawdown = true;
        startDate = peakDate;
      }
    }
    
    return drawdowns.filter(dd => dd.drawdownPercent > 5);
  }
  
  private static calculateReturns(priceData: BitcoinPrice[]): number[] {
    const returns: number[] = [];
    for (let i = 1; i < priceData.length; i++) {
      const prevPrice = priceData[i - 1].price;
      const currentPrice = priceData[i].price;
      returns.push((currentPrice - prevPrice) / prevPrice);
    }
    return returns;
  }
  
  private static calculateStandardDeviation(returns: number[], mean: number): number {
    if (returns.length === 0) return 0;
    const squaredDiffs = returns.map(ret => Math.pow(ret - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / returns.length;
    return Math.sqrt(variance);
  }

  private static calculateMaxDrawdown(priceData: BitcoinPrice[]): number {
    let maxDrawdown = 0;
    let peak = priceData[0]?.price || 0;

    for (const point of priceData) {
      if (point.price > peak) {
        peak = point.price;
      }
      if (peak > 0) {
        const drawdown = (peak - point.price) / peak;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }

    return maxDrawdown;
  }

  private static calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    if (returns.length === 0) return 0;
    const excessReturns = returns.map(ret => ret - riskFreeRate);
    const averageExcessReturn = excessReturns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = this.calculateStandardDeviation(excessReturns, averageExcessReturn);
    return stdDev > 0 ? averageExcessReturn / stdDev : 0;
  }

  private static calculateSortinoRatio(returns: number[], targetReturn: number): number | null {
    if (returns.length === 0) return null;
    const excessReturns = returns.map(ret => ret - targetReturn);
    const averageExcessReturn = excessReturns.reduce((sum, ret) => sum + ret, 0) / returns.length;

    const downsideReturns = excessReturns.filter(ret => ret < 0);
    // No downside deviations → Sortino is undefined (∞ in math). Return null so
    // consumers render "—" instead of leaking Infinity into the UI.
    if (downsideReturns.length === 0) return null;

    const downsideVariance = downsideReturns.reduce((sum, ret) => sum + ret * ret, 0) / downsideReturns.length;
    const downsideDeviation = Math.sqrt(downsideVariance);

    return downsideDeviation > 0 ? averageExcessReturn / downsideDeviation : 0;
  }

  
  private static calculateRollingVolatility(priceData: BitcoinPrice[], days: number): number {
    if (priceData.length < days) return 0;
    
    const recentData = priceData.slice(-days);
    const returns = this.calculateReturns(recentData);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = this.calculateStandardDeviation(returns, avgReturn);
    
    return stdDev * Math.sqrt(252);
  }
  
  private static calculateBeta(assetReturns: number[], benchmarkReturns: number[]): number {
    const minLength = Math.min(assetReturns.length, benchmarkReturns.length);
    const assetRets = assetReturns.slice(0, minLength);
    const benchmarkRets = benchmarkReturns.slice(0, minLength);
    
    const assetMean = assetRets.reduce((sum, ret) => sum + ret, 0) / assetRets.length;
    const benchmarkMean = benchmarkRets.reduce((sum, ret) => sum + ret, 0) / benchmarkRets.length;
    
    let covariance = 0;
    let benchmarkVariance = 0;
    
    for (let i = 0; i < assetRets.length; i++) {
      const assetDiff = assetRets[i] - assetMean;
      const benchmarkDiff = benchmarkRets[i] - benchmarkMean;
      covariance += assetDiff * benchmarkDiff;
      benchmarkVariance += benchmarkDiff * benchmarkDiff;
    }
    
    covariance /= assetRets.length;
    benchmarkVariance /= benchmarkRets.length;
    
    return benchmarkVariance > 0 ? covariance / benchmarkVariance : 1;
  }
}