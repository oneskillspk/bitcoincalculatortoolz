import { BitcoinSupplyData } from './bitcoinSupplyService';
import { FiatMoneySupplyData } from './fiatMoneySupplyService';

interface ComparisonResult {
  bitcoin: {
    supply: number;
    inflationRate: number;
    fixedSupply: boolean;
  };
  fiat: {
    supply: number;
    inflationRate: number;
    growthRate: number;
  };
  comparison: {
    supplyRatio: number;
    inflationDifference: number;
    purchasingPowerDifference: number;
  };
}

interface PurchasingPowerComparison {
  year: string;
  bitcoinPurchasingPower: number;
  fiatPurchasingPower: number;
  bitcoinValue: number;
  fiatValue: number;
}

interface SupplyGrowthData {
  date: string;
  bitcoinSupply: number;
  fiatSupply: number;
  bitcoinInflationRate: number;
  fiatInflationRate: number;
}

class InflationComparisonCalculator {
  static compareSupplies(
    btcData: BitcoinSupplyData,
    fiatData: FiatMoneySupplyData
  ): ComparisonResult {
    const latestFiatGrowthRate = fiatData.annualGrowthRates[
      Object.keys(fiatData.annualGrowthRates).sort().reverse()[0]
    ] || 6.2;

    return {
      bitcoin: {
        supply: btcData.currentSupply,
        inflationRate: btcData.currentInflationRate,
        fixedSupply: true
      },
      fiat: {
        supply: fiatData.currentM2,
        inflationRate: latestFiatGrowthRate,
        growthRate: latestFiatGrowthRate
      },
      comparison: {
        supplyRatio: fiatData.currentM2 / btcData.currentSupply,
        inflationDifference: latestFiatGrowthRate - btcData.currentInflationRate,
        purchasingPowerDifference: this.calculatePurchasingPowerDiff(
          fiatData.baseCPI,
          fiatData.currentCPI
        )
      }
    };
  }

  static calculatePurchasingPowerTimeline(
    fiatData: FiatMoneySupplyData,
    bitcoinPriceHistory: Array<{ date: string; price: number }>,
    startYear: number,
    endYear: number
  ): PurchasingPowerComparison[] {
    const result: PurchasingPowerComparison[] = [];
    const baseYear = startYear;
    
    // Get base values
    const baseYearData = fiatData.historicalData.find(d => d.year === baseYear.toString());
    if (!baseYearData) return result;
    
    const baseCPI = baseYearData.cpi;
    const baseBTCPrice = bitcoinPriceHistory.find(p => p.date.startsWith(baseYear.toString()))?.price || 100;
    
    for (let year = startYear; year <= endYear; year++) {
      const yearData = fiatData.historicalData.find(d => d.year === year.toString());
      const btcPrice = bitcoinPriceHistory.find(p => p.date.startsWith(year.toString()))?.price || baseBTCPrice;
      
      if (yearData) {
        const fiatPurchasingPower = (baseCPI / yearData.cpi) * 100;
        const bitcoinPurchasingPower = (btcPrice / baseBTCPrice) * 100;
        
        result.push({
          year: year.toString(),
          bitcoinPurchasingPower,
          fiatPurchasingPower,
          bitcoinValue: btcPrice,
          fiatValue: yearData.cpi
        });
      }
    }
    
    return result;
  }

  static calculateSupplyGrowthTimeline(
    fiatData: FiatMoneySupplyData,
    startYear: number,
    endYear: number
  ): SupplyGrowthData[] {
    const result: SupplyGrowthData[] = [];
    const btcSupplySchedule = this.getBitcoinSupplySchedule();
    
    for (let year = startYear; year <= endYear; year++) {
      const yearData = fiatData.historicalData.find(d => d.year === year.toString());
      const btcSupply = btcSupplySchedule[year] || 19800000;
      
      if (yearData) {
        const prevYearData = fiatData.historicalData.find(d => d.year === (year - 1).toString());
        const fiatGrowthRate = prevYearData 
          ? ((yearData.m2Supply - prevYearData.m2Supply) / prevYearData.m2Supply) * 100
          : 0;
        
        const btcInflationRate = this.getBitcoinInflationRate(year);
        
        result.push({
          date: `${year}-01-01`,
          bitcoinSupply: btcSupply,
          fiatSupply: yearData.m2Supply,
          bitcoinInflationRate: btcInflationRate,
          fiatInflationRate: fiatGrowthRate
        });
      }
    }
    
    return result;
  }

  private static calculatePurchasingPowerDiff(baseCPI: number, currentCPI: number): number {
    return ((baseCPI / currentCPI) - 1) * 100;
  }

  private static getBitcoinSupplySchedule(): Record<number, number> {
    const schedule: Record<number, number> = {};
    const halvingYears = [2009, 2012, 2016, 2020, 2024, 2028, 2032];
    const initialSupply = 0;
    const blocksPerYear = 52560; // ~10 min blocks
    
    let currentSupply = initialSupply;
    let reward = 50;
    let halvingIndex = 0;
    
    for (let year = 2009; year <= 2030; year++) {
      if (halvingIndex < halvingYears.length - 1 && year >= halvingYears[halvingIndex + 1]) {
        reward /= 2;
        halvingIndex++;
      }
      
      currentSupply += blocksPerYear * reward;
      schedule[year] = Math.min(currentSupply, 21000000);
    }
    
    return schedule;
  }

  private static getBitcoinInflationRate(year: number): number {
    if (year < 2012) return 33.3;
    if (year < 2016) return 12.5;
    if (year < 2020) return 4.2;
    if (year < 2024) return 1.8;
    if (year < 2028) return 0.9;
    return 0.45;
  }

  static calculateRealReturns(
    investmentAmount: number,
    bitcoinROI: number,
    fiatInflation: number
  ): {
    nominalValue: number;
    realValue: number;
    inflationAdjustedGain: number;
  } {
    const nominalValue = investmentAmount * (1 + bitcoinROI / 100);
    const inflationMultiplier = 1 + fiatInflation / 100;
    const realValue = nominalValue / inflationMultiplier;
    const inflationAdjustedGain = ((realValue - investmentAmount) / investmentAmount) * 100;
    
    return {
      nominalValue,
      realValue,
      inflationAdjustedGain
    };
  }
}

export { InflationComparisonCalculator };
export type { ComparisonResult, PurchasingPowerComparison, SupplyGrowthData };
