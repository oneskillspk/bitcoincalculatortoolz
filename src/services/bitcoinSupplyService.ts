interface BitcoinSupplyData {
  totalSupply: number;
  currentSupply: number;
  percentageMined: number;
  remainingToMine: number;
  currentInflationRate: number;
  nextHalving: {
    blockHeight: number;
    estimatedDate: string;
    blocksRemaining: number;
  };
}

interface HalvingEvent {
  number: number;
  date: string;
  blockHeight: number;
  rewardBefore: number;
  rewardAfter: number;
  btcPrice?: number;
  estimated?: boolean;
}

class BitcoinSupplyService {
  private static readonly TOTAL_SUPPLY = 21000000;
  private static readonly BLOCKS_PER_HALVING = 210000;
  private static readonly INITIAL_REWARD = 50;
  private static readonly AVERAGE_BLOCK_TIME = 10 * 60 * 1000; // 10 minutes in ms

  static async getSupplyData(): Promise<BitcoinSupplyData> {
    try {
      // Get current block height from mempool.space
      const response = await fetch('https://mempool.space/api/blocks/tip/height');
      const currentHeight = await response.json();
      
      // Calculate current supply based on block height
      const currentSupply = this.calculateSupply(currentHeight);
      const percentageMined = (currentSupply / this.TOTAL_SUPPLY) * 100;
      const remainingToMine = this.TOTAL_SUPPLY - currentSupply;
      
      // Calculate current inflation rate
      const currentReward = this.getCurrentReward(currentHeight);
      const blocksPerYear = (365.25 * 24 * 60) / 10; // blocks per year
      const newBTCPerYear = currentReward * blocksPerYear;
      const currentInflationRate = (newBTCPerYear / currentSupply) * 100;
      
      // Calculate next halving
      // Next halving is always the *following* boundary, even if currentHeight
      // sits exactly on one (e.g. 840_000). Math.floor + 1 period avoids the
      // off-by-one where Math.ceil(840000/210000)*210000 === 840000.
      const nextHalvingHeight = (Math.floor(currentHeight / this.BLOCKS_PER_HALVING) + 1) * this.BLOCKS_PER_HALVING;
      const blocksRemaining = nextHalvingHeight - currentHeight;
      const timeToHalving = blocksRemaining * this.AVERAGE_BLOCK_TIME;
      const estimatedDate = new Date(Date.now() + timeToHalving).toISOString();
      
      return {
        totalSupply: this.TOTAL_SUPPLY,
        currentSupply: Math.round(currentSupply),
        percentageMined: Math.round(percentageMined * 100) / 100,
        remainingToMine: Math.round(remainingToMine),
        currentInflationRate: Math.round(currentInflationRate * 100) / 100,
        nextHalving: {
          blockHeight: nextHalvingHeight,
          estimatedDate,
          blocksRemaining
        }
      };
    } catch (error) {
      console.error('Error fetching Bitcoin supply data:', error);
      // Fallback: estimate block height from time since genesis (Jan 3, 2009)
      // and derive supply from the same calculator used in the happy path.
      const GENESIS_MS = Date.UTC(2009, 0, 3);
      const estimatedHeight = Math.floor(
        (Date.now() - GENESIS_MS) / this.AVERAGE_BLOCK_TIME
      );
      const fallbackSupply = this.calculateSupply(estimatedHeight);
      const fallbackReward = this.getCurrentReward(estimatedHeight);
      const blocksPerYear = (365.25 * 24 * 60) / 10;
      const fallbackInflation =
        ((fallbackReward * blocksPerYear) / fallbackSupply) * 100;
      const nextHalvingHeight =
        (Math.floor(estimatedHeight / this.BLOCKS_PER_HALVING) + 1) *
        this.BLOCKS_PER_HALVING;
      const blocksRemaining = nextHalvingHeight - estimatedHeight;
      const estimatedDate = new Date(
        Date.now() + blocksRemaining * this.AVERAGE_BLOCK_TIME
      ).toISOString();

      return {
        totalSupply: this.TOTAL_SUPPLY,
        currentSupply: Math.round(fallbackSupply),
        percentageMined: Math.round((fallbackSupply / this.TOTAL_SUPPLY) * 10000) / 100,
        remainingToMine: Math.round(this.TOTAL_SUPPLY - fallbackSupply),
        currentInflationRate: Math.round(fallbackInflation * 100) / 100,
        nextHalving: {
          blockHeight: nextHalvingHeight,
          estimatedDate,
          blocksRemaining,
        },
      };
    }
  }

  static async getHalvingHistory(): Promise<HalvingEvent[]> {
    try {
      const response = await fetch('/data/bitcoin_halving_history.json');
      const data = await response.json();
      return data.halvings;
    } catch (error) {
      console.error('Error loading halving history:', error);
      return [];
    }
  }

  private static calculateSupply(blockHeight: number): number {
    let supply = 0;
    let currentHeight = 0;
    let reward = this.INITIAL_REWARD;
    
    while (currentHeight < blockHeight) {
      const nextHalving = Math.ceil((currentHeight + 1) / this.BLOCKS_PER_HALVING) * this.BLOCKS_PER_HALVING;
      const blocksInThisPeriod = Math.min(nextHalving - currentHeight, blockHeight - currentHeight);
      
      supply += blocksInThisPeriod * reward;
      currentHeight += blocksInThisPeriod;
      
      if (currentHeight >= nextHalving) {
        reward /= 2;
      }
    }
    
    return supply;
  }

  private static getCurrentReward(blockHeight: number): number {
    const halvings = Math.floor(blockHeight / this.BLOCKS_PER_HALVING);
    return this.INITIAL_REWARD / Math.pow(2, halvings);
  }
}

export { BitcoinSupplyService };
export type { BitcoinSupplyData, HalvingEvent };
