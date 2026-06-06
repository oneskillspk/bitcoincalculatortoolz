interface FiatMoneySupplyData {
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';
  symbol: string;
  lastUpdated: string;
  currentM2: number;
  currentCPI: number;
  baseCPI: number;
  baseYear: number;
  historicalData: Array<{
    year: string;
    month: string;
    m2Supply: number;
    cpi: number;
  }>;
  annualGrowthRates: Record<string, number>;
}

interface FiatDataResponse {
  [currency: string]: FiatMoneySupplyData;
}

class FiatMoneySupplyService {
  private static cache: FiatDataResponse | null = null;
  private static cacheTimestamp: number = 0;
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static async getData(currency: string = 'USD'): Promise<FiatMoneySupplyData | null> {
    const allData = await this.getAllData();
    return allData[currency] || null;
  }

  static async getAllData(): Promise<FiatDataResponse> {
    // Check cache
    if (this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch('/data/fiat_money_supply_v1.json');
      const data: FiatDataResponse = await response.json();
      
      this.cache = data;
      this.cacheTimestamp = Date.now();
      
      return data;
    } catch (error) {
      console.error('Error loading fiat money supply data:', error);
      return {};
    }
  }

  static calculatePurchasingPowerLoss(
    cpiStart: number,
    cpiEnd: number,
    baseCPI: number = 100
  ): number {
    // Calculate purchasing power loss as percentage
    const inflationMultiplier = cpiEnd / cpiStart;
    const purchasingPowerLoss = ((1 - (1 / inflationMultiplier)) * 100);
    return Math.round(purchasingPowerLoss * 100) / 100;
  }

  static calculateM2GrowthRate(
    m2Start: number,
    m2End: number,
    years: number
  ): number {
    // Calculate annualized growth rate
    const growthRate = (Math.pow(m2End / m2Start, 1 / years) - 1) * 100;
    return Math.round(growthRate * 100) / 100;
  }

  static getMoneyCreatedPerSecond(annualGrowthAmount: number): number {
    // Calculate how much money is created per second
    const secondsPerYear = 365.25 * 24 * 60 * 60;
    return annualGrowthAmount / secondsPerYear;
  }

  static formatMoneySupply(amount: number, currency: string = 'USD'): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥'
    };

    const symbol = symbols[currency] || '$';
    
    if (amount >= 1_000_000_000_000) {
      return `${symbol}${(amount / 1_000_000_000_000).toFixed(2)}T`;
    } else if (amount >= 1_000_000_000) {
      return `${symbol}${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  }
}

export { FiatMoneySupplyService };
export type { FiatMoneySupplyData, FiatDataResponse };
