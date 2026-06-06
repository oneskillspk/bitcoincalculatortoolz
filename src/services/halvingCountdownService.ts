export interface HalvingCountdownData {
  nextHalvingBlock: number;
  currentBlockHeight: number;
  blocksRemaining: number;
  estimatedTimeMs: number;
  estimatedDate: Date;
  epochProgress: number;
  currentReward: number;
  nextReward: number;
}

export interface HalvingHistoricalImpact {
  halvingNumber: number;
  date: string;
  priceAtHalving: number;
  returns: {
    label: string;
    days: number;
    price: number | null;
    returnPct: number | null;
  }[];
  allTimeHighAfter: number;
  daysToATH: number;
}

export interface HalvingProjectionScenario {
  label: string;
  description: string;
  priceAtHalving: number;
  price6MonthsAfter: number;
  price1YearAfter: number;
  price18MonthsAfter: number;
  peakPrice: number;
  multiplier: number;
}

export interface SupplySchedulePoint {
  year: number;
  blockHeight: number;
  totalSupply: number;
  blockReward: number;
  annualInflationRate: number;
  halvingNumber: number;
  isHalving: boolean;
}

export interface EnhancedHalvingEvent {
  number: number;
  date: string;
  blockHeight: number;
  rewardBefore: number;
  rewardAfter: number;
  btcPrice?: number;
  estimated?: boolean;
  price1MonthAfter?: number;
  price3MonthsAfter?: number;
  price6MonthsAfter?: number;
  price1YearAfter?: number;
  price18MonthsAfter?: number;
  allTimeHighAfter?: number;
  daysToATH?: number;
}

const NEXT_HALVING_BLOCK = 1050000;
const CURRENT_EPOCH_START = 840000;
const BLOCKS_PER_HALVING = 210000;
const AVERAGE_BLOCK_TIME_MS = 10 * 60 * 1000;
const TOTAL_SUPPLY = 21_000_000;
const INITIAL_REWARD = 50;

export class HalvingCountdownService {

  static async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await fetch('https://mempool.space/api/blocks/tip/height');
      if (!response.ok) throw new Error('Failed to fetch block height');
      return await response.json();
    } catch (error) {
      console.error('Error fetching block height, using estimate:', error);
      // Fallback: estimate from genesis
      const genesisDate = new Date('2009-01-03T18:15:05Z');
      const elapsedMs = Date.now() - genesisDate.getTime();
      return Math.floor(elapsedMs / AVERAGE_BLOCK_TIME_MS);
    }
  }

  static calculateCountdown(currentHeight: number): HalvingCountdownData {
    const blocksRemaining = Math.max(0, NEXT_HALVING_BLOCK - currentHeight);
    const estimatedTimeMs = blocksRemaining * AVERAGE_BLOCK_TIME_MS;
    const estimatedDate = new Date(Date.now() + estimatedTimeMs);
    const epochProgress = ((currentHeight - CURRENT_EPOCH_START) / BLOCKS_PER_HALVING) * 100;
    const halvings = Math.floor(currentHeight / BLOCKS_PER_HALVING);
    const currentReward = INITIAL_REWARD / Math.pow(2, halvings);
    const nextReward = currentReward / 2;

    return {
      nextHalvingBlock: NEXT_HALVING_BLOCK,
      currentBlockHeight: currentHeight,
      blocksRemaining,
      estimatedTimeMs,
      estimatedDate,
      epochProgress: Math.min(epochProgress, 100),
      currentReward,
      nextReward,
    };
  }

  static calculateHistoricalImpact(halvings: EnhancedHalvingEvent[]): HalvingHistoricalImpact[] {
    return halvings
      .filter(h => !h.estimated && h.btcPrice)
      .map(h => {
        const price = h.btcPrice!;
        const makeReturn = (label: string, days: number, afterPrice?: number | null) => ({
          label,
          days,
          price: afterPrice ?? null,
          returnPct: afterPrice != null ? ((afterPrice - price) / price) * 100 : null,
        });

        return {
          halvingNumber: h.number,
          date: h.date,
          priceAtHalving: price,
          returns: [
            makeReturn('1 Month', 30, h.price1MonthAfter),
            makeReturn('3 Months', 90, h.price3MonthsAfter),
            makeReturn('6 Months', 180, h.price6MonthsAfter),
            makeReturn('1 Year', 365, h.price1YearAfter),
            makeReturn('18 Months', 540, h.price18MonthsAfter),
          ],
          allTimeHighAfter: h.allTimeHighAfter || 0,
          daysToATH: h.daysToATH || 0,
        };
      });
  }

  static calculateProjection(
    currentPrice: number,
    halvings: EnhancedHalvingEvent[]
  ): HalvingProjectionScenario[] {
    const pastHalvings = halvings.filter(h => !h.estimated && h.btcPrice && h.price1YearAfter);

    // Calculate multipliers for each cycle
    const multipliers6m = pastHalvings
      .filter(h => h.price6MonthsAfter)
      .map(h => h.price6MonthsAfter! / h.btcPrice!);
    const multipliers1y = pastHalvings
      .filter(h => h.price1YearAfter)
      .map(h => h.price1YearAfter! / h.btcPrice!);
    const multipliers18m = pastHalvings
      .filter(h => h.price18MonthsAfter)
      .map(h => h.price18MonthsAfter! / h.btcPrice!);
    const multipliersATH = pastHalvings
      .filter(h => h.allTimeHighAfter)
      .map(h => h.allTimeHighAfter! / h.btcPrice!);

    const min = (arr: number[]) => Math.min(...arr);
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const max = (arr: number[]) => Math.max(...arr);

    return [
      {
        label: 'Conservative',
        description: 'Based on the weakest post-halving cycle performance',
        priceAtHalving: currentPrice,
        price6MonthsAfter: currentPrice * min(multipliers6m),
        price1YearAfter: currentPrice * min(multipliers1y),
        price18MonthsAfter: multipliers18m.length ? currentPrice * min(multipliers18m) : currentPrice * min(multipliers1y) * 0.9,
        peakPrice: currentPrice * min(multipliersATH),
        multiplier: min(multipliersATH),
      },
      {
        label: 'Average',
        description: 'Based on the mean of all post-halving cycle performances',
        priceAtHalving: currentPrice,
        price6MonthsAfter: currentPrice * avg(multipliers6m),
        price1YearAfter: currentPrice * avg(multipliers1y),
        price18MonthsAfter: multipliers18m.length ? currentPrice * avg(multipliers18m) : currentPrice * avg(multipliers1y) * 1.2,
        peakPrice: currentPrice * avg(multipliersATH),
        multiplier: avg(multipliersATH),
      },
      {
        label: 'Optimistic',
        description: 'Based on the strongest post-halving cycle performance',
        priceAtHalving: currentPrice,
        price6MonthsAfter: currentPrice * max(multipliers6m),
        price1YearAfter: currentPrice * max(multipliers1y),
        price18MonthsAfter: multipliers18m.length ? currentPrice * max(multipliers18m) : currentPrice * max(multipliers1y) * 1.5,
        peakPrice: currentPrice * max(multipliersATH),
        multiplier: max(multipliersATH),
      },
    ];
  }

  static calculateSupplySchedule(): SupplySchedulePoint[] {
    const points: SupplySchedulePoint[] = [];
    let reward = INITIAL_REWARD;
    let supply = 0;
    const genesisYear = 2009;

    for (let halvingNum = 0; halvingNum <= 33; halvingNum++) {
      const blockHeight = halvingNum * BLOCKS_PER_HALVING;
      const yearOffset = (blockHeight * 10) / (60 * 24 * 365.25);
      const year = Math.round(genesisYear + yearOffset);

      const blocksInPeriod = BLOCKS_PER_HALVING;
      const supplyBefore = supply;
      supply += blocksInPeriod * reward;
      if (supply > TOTAL_SUPPLY) supply = TOTAL_SUPPLY;

      const newCoinsPerYear = reward * (365.25 * 24 * 60 / 10);
      const inflationRate = supplyBefore > 0 ? (newCoinsPerYear / supplyBefore) * 100 : 100;

      points.push({
        year,
        blockHeight,
        totalSupply: Math.round(supply),
        blockReward: reward,
        annualInflationRate: Math.round(inflationRate * 100) / 100,
        halvingNumber: halvingNum,
        isHalving: halvingNum > 0,
      });

      reward /= 2;
      if (reward < 0.00000001) break;
    }

    return points;
  }

  static async loadHalvingHistory(): Promise<EnhancedHalvingEvent[]> {
    try {
      const response = await fetch('/data/bitcoin_halving_history.json');
      const data = await response.json();
      return data.halvings;
    } catch (error) {
      console.error('Error loading halving history:', error);
      return [];
    }
  }
}
