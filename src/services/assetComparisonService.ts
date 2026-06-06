import { format } from 'date-fns';

export interface AssetData {
  name: string;
  symbol: string;
  currentPrice: number;
  prices: Record<string, number>;
}

export interface AssetComparison {
  asset: string;
  symbol: string;
  startPrice: number;
  currentPrice: number;
  shares: number;
  currentValue: number;
  roi: number;
  roiDifference: number; // Difference from Bitcoin ROI
  icon: string;
  color: string;
}

export interface AssetDataResponse {
  sp500: AssetData;
  gold: AssetData;
  nvidia: AssetData;
  realestate: AssetData;
}

class AssetComparisonService {
  private assetData: AssetDataResponse | null = null;

  async loadAssetData(): Promise<AssetDataResponse> {
    if (this.assetData) {
      return this.assetData;
    }

    try {
      const response = await fetch('/data/asset_prices_v1.json');
      if (!response.ok) {
        throw new Error('Failed to load asset data');
      }
      this.assetData = await response.json();
      return this.assetData!;
    } catch (error) {
      console.error('Error loading asset data:', error);
      throw error;
    }
  }

  async compareAssets(
    investmentAmount: number,
    startDate: Date,
    bitcoinROI: number,
    currency: string = 'USD'
  ): Promise<AssetComparison[]> {
    const data = await this.loadAssetData();
    const startMonth = format(startDate, 'yyyy-MM');
    
    const comparisons: AssetComparison[] = [];
    
    // Asset configurations with icons and colors (NVIDIA removed for cleaner comparison)
    const assetConfigs = [
      {
        key: 'sp500' as keyof AssetDataResponse,
        data: data.sp500,
        icon: '📈',
        color: 'bg-blue-500/10 text-blue-600'
      },
      {
        key: 'gold' as keyof AssetDataResponse,
        data: data.gold,
        icon: '🥇',
        color: 'bg-yellow-500/10 text-yellow-600'
      },
      {
        key: 'realestate' as keyof AssetDataResponse,
        data: data.realestate,
        icon: '🏠',
        color: 'bg-purple-500/10 text-purple-600'
      }
    ];

    for (const config of assetConfigs) {
      const asset = config.data;
      const startPrice = this.getClosestPrice(asset.prices, startMonth);
      
      if (startPrice > 0) {
        const shares = investmentAmount / startPrice;
        const currentValue = shares * asset.currentPrice;
        const roi = ((currentValue - investmentAmount) / investmentAmount) * 100;
        const roiDifference = roi - bitcoinROI;

        comparisons.push({
          asset: asset.name,
          symbol: asset.symbol,
          startPrice,
          currentPrice: asset.currentPrice,
          shares,
          currentValue,
          roi,
          roiDifference,
          icon: config.icon,
          color: config.color
        });
      }
    }

    return comparisons;
  }

  private getClosestPrice(prices: Record<string, number>, targetMonth: string): number {
    // Try exact match first
    if (prices[targetMonth]) {
      return prices[targetMonth];
    }

    // Find closest available month
    const availableMonths = Object.keys(prices).sort();
    const targetDate = new Date(targetMonth + '-01');
    
    let closestMonth = availableMonths[0];
    let closestDiff = Math.abs(new Date(closestMonth + '-01').getTime() - targetDate.getTime());

    for (const month of availableMonths) {
      const diff = Math.abs(new Date(month + '-01').getTime() - targetDate.getTime());
      if (diff < closestDiff) {
        closestDiff = diff;
        closestMonth = month;
      }
    }

    return prices[closestMonth] || 0;
  }

  // Get historical data for best/worst entry analysis
  async getHistoricalAnalysis(
    investmentAmount: number,
    asset: keyof AssetDataResponse,
    currency: string = 'USD'
  ): Promise<{
    bestEntry: { date: string; roi: number; currentValue: number };
    worstEntry: { date: string; roi: number; currentValue: number };
    averageROI: number;
  }> {
    const data = await this.loadAssetData();
    const assetData = data[asset];
    const scenarios: { date: string; roi: number; currentValue: number }[] = [];

    for (const [month, price] of Object.entries(assetData.prices)) {
      const shares = investmentAmount / price;
      const currentValue = shares * assetData.currentPrice;
      const roi = ((currentValue - investmentAmount) / investmentAmount) * 100;

      scenarios.push({
        date: month,
        roi,
        currentValue
      });
    }

    scenarios.sort((a, b) => b.roi - a.roi);

    return {
      bestEntry: scenarios[0],
      worstEntry: scenarios[scenarios.length - 1],
      averageROI: scenarios.reduce((sum, s) => sum + s.roi, 0) / scenarios.length
    };
  }

  // Get historical averages for homepage comparison
  // Uses a consistent 10-year window (Jan 2016 - Jan 2026) across all assets
  // to ensure fair, apples-to-apples comparison
  async getHistoricalAverages(): Promise<{
    bitcoin: any;
    sp500: any;
    gold: any;
    realestate: any;
  }> {
    const data = await this.loadAssetData();
    
    // Determine the common comparison window from traditional asset data
    // All traditional assets start from 2016-01, so we align Bitcoin to the same window
    const COMPARISON_START = '2016-01';
    
    // Load Bitcoin data separately
    const btcResponse = await fetch('/data/bitcoin_prices_v1.json');
    const btcData = await btcResponse.json();
    
    // Convert Bitcoin data structure to monthly prices, filtered to comparison window
    const bitcoinPrices: Record<string, number> = {};
    if (btcData.data) {
      for (const [year, entries] of Object.entries(btcData.data)) {
        const yearEntries = entries as Array<{ date: string; price: number }>;
        for (const entry of yearEntries) {
          const month = entry.date.substring(0, 7); // Get YYYY-MM
          // Only include data from the comparison window onwards
          if (month >= COMPARISON_START) {
            bitcoinPrices[month] = entry.price;
          }
        }
      }
    }

    // Calculate metrics for each asset using the same time window
    const bitcoin = this.calculateAssetMetrics(bitcoinPrices, 'Bitcoin', '₿');
    const sp500 = this.calculateAssetMetrics(data.sp500.prices, data.sp500.name, data.sp500.symbol);
    const gold = this.calculateAssetMetrics(data.gold.prices, data.gold.name, data.gold.symbol);
    const realestate = this.calculateAssetMetrics(data.realestate.prices, data.realestate.name, data.realestate.symbol);

    return { bitcoin, sp500, gold, realestate };
  }

  private calculateAssetMetrics(prices: Record<string, number>, name: string, symbol: string) {
    const sortedDates = Object.keys(prices).sort();
    if (sortedDates.length < 2) {
      return {
        name,
        symbol,
        annualizedReturn: 0,
        totalReturn: 0,
        bestYear: { year: '', return: 0 },
        worstYear: { year: '', return: 0 },
        volatility: 0,
        period: ''
      };
    }

    const startPrice = prices[sortedDates[0]];
    const endPrice = prices[sortedDates[sortedDates.length - 1]];
    
    // Calculate total return
    const totalReturn = ((endPrice - startPrice) / startPrice) * 100;
    
    // Calculate years between start and end
    const startDate = new Date(sortedDates[0] + '-01');
    const endDate = new Date(sortedDates[sortedDates.length - 1] + '-01');
    const years = (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Calculate annualized return (CAGR)
    const annualizedReturn = years > 0 ? (Math.pow(endPrice / startPrice, 1 / years) - 1) * 100 : 0;
    
    // Calculate yearly returns
    const yearlyReturns = new Map<string, number>();
    for (let i = 1; i < sortedDates.length; i++) {
      const prevPrice = prices[sortedDates[i - 1]];
      const currPrice = prices[sortedDates[i]];
      const year = sortedDates[i].substring(0, 4);
      
      if (prevPrice > 0) {
        const monthlyReturn = ((currPrice - prevPrice) / prevPrice);
        const existing = yearlyReturns.get(year) || 0;
        yearlyReturns.set(year, existing + monthlyReturn);
      }
    }
    
    // Convert to percentages and find best/worst years
    const yearlyReturnsArray = Array.from(yearlyReturns.entries()).map(([year, ret]) => ({
      year,
      return: ret * 100
    }));
    
    const bestYear = yearlyReturnsArray.length > 0 
      ? yearlyReturnsArray.reduce((max, curr) => curr.return > max.return ? curr : max)
      : { year: '', return: 0 };
    
    const worstYear = yearlyReturnsArray.length > 0
      ? yearlyReturnsArray.reduce((min, curr) => curr.return < min.return ? curr : min)
      : { year: '', return: 0 };
    
    // Calculate volatility (standard deviation of monthly returns)
    const returns: number[] = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const prevPrice = prices[sortedDates[i - 1]];
      const currPrice = prices[sortedDates[i]];
      if (prevPrice > 0) {
        returns.push(((currPrice - prevPrice) / prevPrice) * 100);
      }
    }
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(12); // Annualized volatility
    
    const period = `${sortedDates[0].substring(0, 4)}-${sortedDates[sortedDates.length - 1].substring(0, 4)}`;
    
    return {
      name,
      symbol,
      annualizedReturn: Number(annualizedReturn.toFixed(2)),
      totalReturn: Number(totalReturn.toFixed(2)),
      bestYear: { year: bestYear.year, return: Number(bestYear.return.toFixed(2)) },
      worstYear: { year: worstYear.year, return: Number(worstYear.return.toFixed(2)) },
      volatility: Number(volatility.toFixed(2)),
      period
    };
  }
}

export const assetComparisonService = new AssetComparisonService();