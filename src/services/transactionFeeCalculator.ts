/**
 * Bitcoin Transaction Fee Calculator Service
 * Fetches live fee data from mempool.space API and calculates transaction costs
 */

// Types
export interface FeeRecommendation {
  fastestFee: number;      // sat/vB for next block
  halfHourFee: number;     // sat/vB for ~3 blocks
  hourFee: number;         // sat/vB for ~6 blocks
  economyFee: number;      // sat/vB for low priority
  minimumFee: number;      // sat/vB minimum relay fee
}

export interface MempoolStats {
  count: number;           // Number of pending transactions
  vsize: number;           // Total virtual size in vBytes
  totalFee: number;        // Total fees in satoshis
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface HistoricalFeePoint {
  timestamp: number;
  avgHeight: number;
  avgFee_10: number;   // Economy tier
  avgFee_50: number;   // Medium tier (30 min)
  avgFee_90: number;   // Fast tier
}

export interface MempoolBlock {
  blockSize: number;
  blockVSize: number;
  nTx: number;
  totalFees: number;
  medianFee: number;
  feeRange: number[];
}

export type AddressType = 'legacy' | 'segwit' | 'native-segwit' | 'taproot';
export type Priority = 'fastest' | 'halfHour' | 'hour' | 'economy';

export interface TransactionParams {
  inputCount: number;
  outputCount: number;
  addressType: AddressType;
  amountSats: number;
  priority: Priority;
}

export interface FeeEstimate {
  satsPerVbyte: number;
  totalFeeSats: number;
  totalFeeUsd: number;
  estimatedSize: number;
  confirmationBlocks: number;
  confirmationTime: string;
  feePercentage: number;
}

export interface AllFeeEstimates {
  fastest: FeeEstimate;
  halfHour: FeeEstimate;
  hour: FeeEstimate;
  economy: FeeEstimate;
}

// Fallback values for when API is unavailable
const FALLBACK_FEES: FeeRecommendation = {
  fastestFee: 50,
  halfHourFee: 40,
  hourFee: 25,
  economyFee: 10,
  minimumFee: 1
};

// Transaction size constants (in vBytes)
const TX_SIZE = {
  legacy: {
    input: 148,
    output: 34,
    overhead: 10
  },
  segwit: {
    input: 91,
    output: 32,
    overhead: 10
  },
  'native-segwit': {
    input: 68,
    output: 31,
    overhead: 10.5
  },
  taproot: {
    input: 57.5,
    output: 43,
    overhead: 10.5
  }
};

// Priority to confirmation mapping
const PRIORITY_BLOCKS: Record<Priority, number> = {
  fastest: 1,
  halfHour: 3,
  hour: 6,
  economy: 24
};

const PRIORITY_TIME: Record<Priority, string> = {
  fastest: '~10 min',
  halfHour: '~30 min',
  hour: '~1 hour',
  economy: '~4+ hours'
};

class TransactionFeeCalculator {
  private apiBase = 'https://mempool.space/api';
  private cachedFees: FeeRecommendation | null = null;
  private cacheTimestamp: number = 0;
  private cacheDuration = 30000; // 30 seconds

  /**
   * Fetch recommended fees from mempool.space
   */
  async getRecommendedFees(): Promise<FeeRecommendation> {
    // Check cache
    if (this.cachedFees && Date.now() - this.cacheTimestamp < this.cacheDuration) {
      return this.cachedFees;
    }

    try {
      const response = await fetch(`${this.apiBase}/v1/fees/recommended`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      this.cachedFees = {
        fastestFee: data.fastestFee || FALLBACK_FEES.fastestFee,
        halfHourFee: data.halfHourFee || FALLBACK_FEES.halfHourFee,
        hourFee: data.hourFee || FALLBACK_FEES.hourFee,
        economyFee: data.economyFee || FALLBACK_FEES.economyFee,
        minimumFee: data.minimumFee || FALLBACK_FEES.minimumFee
      };
      this.cacheTimestamp = Date.now();
      
      return this.cachedFees;
    } catch (error) {
      console.warn('Failed to fetch fees from mempool.space, using fallback:', error);
      return FALLBACK_FEES;
    }
  }

  /**
   * Fetch mempool statistics
   */
  async getMempoolStats(): Promise<MempoolStats> {
    try {
      const response = await fetch(`${this.apiBase}/mempool`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Calculate congestion level based on mempool size
      const vsizeMB = data.vsize / 1000000;
      let congestionLevel: 'low' | 'medium' | 'high';
      if (vsizeMB < 10) {
        congestionLevel = 'low';
      } else if (vsizeMB < 50) {
        congestionLevel = 'medium';
      } else {
        congestionLevel = 'high';
      }
      
      return {
        count: data.count || 0,
        vsize: data.vsize || 0,
        totalFee: data.total_fee || 0,
        congestionLevel
      };
    } catch (error) {
      console.warn('Failed to fetch mempool stats:', error);
      return {
        count: 0,
        vsize: 0,
        totalFee: 0,
        congestionLevel: 'medium'
      };
    }
  }

  /**
   * Fetch projected mempool blocks
   */
  async getMempoolBlocks(): Promise<MempoolBlock[]> {
    try {
      const response = await fetch(`${this.apiBase}/v1/fees/mempool-blocks`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      return data.slice(0, 6).map((block: any) => ({
        blockSize: block.blockSize || 0,
        blockVSize: block.blockVSize || 0,
        nTx: block.nTx || 0,
        totalFees: block.totalFees || 0,
        medianFee: block.medianFee || 0,
        feeRange: block.feeRange || []
      }));
    } catch (error) {
      console.warn('Failed to fetch mempool blocks:', error);
      return [];
    }
  }

  /**
   * Fetch 24-hour historical fee rates from mempool.space
   */
  async getHistoricalFeeRates(): Promise<HistoricalFeePoint[]> {
    try {
      const response = await fetch(`${this.apiBase}/v1/mining/blocks/fee-rates/24h`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Map API response to our interface
      return data.map((point: any) => ({
        timestamp: point.timestamp * 1000, // Convert to milliseconds
        avgHeight: point.avgHeight || 0,
        avgFee_10: point.avgFee_10 || 1,
        avgFee_50: point.avgFee_50 || 5,
        avgFee_90: point.avgFee_90 || 20
      }));
    } catch (error) {
      console.warn('Failed to fetch historical fee rates:', error);
      return [];
    }
  }

  /**
   * Calculate transaction size in vBytes
   */
  calculateTransactionSize(params: Pick<TransactionParams, 'inputCount' | 'outputCount' | 'addressType'>): number {
    const sizes = TX_SIZE[params.addressType];
    const size = sizes.overhead + 
                 (sizes.input * params.inputCount) + 
                 (sizes.output * params.outputCount);
    return Math.ceil(size);
  }

  /**
   * Calculate fee estimate for given parameters
   */
  calculateFeeEstimate(
    params: TransactionParams,
    feeRateSatsPerVb: number,
    btcPriceUsd: number
  ): FeeEstimate {
    const estimatedSize = this.calculateTransactionSize(params);
    const totalFeeSats = Math.ceil(estimatedSize * feeRateSatsPerVb);
    const totalFeeUsd = (totalFeeSats / 100000000) * btcPriceUsd;
    
    // Calculate fee as percentage of amount (if amount > 0)
    let feePercentage = 0;
    if (params.amountSats > 0) {
      feePercentage = (totalFeeSats / params.amountSats) * 100;
    }
    
    return {
      satsPerVbyte: feeRateSatsPerVb,
      totalFeeSats,
      totalFeeUsd,
      estimatedSize,
      confirmationBlocks: PRIORITY_BLOCKS[params.priority],
      confirmationTime: PRIORITY_TIME[params.priority],
      feePercentage
    };
  }

  /**
   * Calculate all fee estimates for comparison
   */
  async calculateAllFeeEstimates(
    params: Omit<TransactionParams, 'priority'>,
    btcPriceUsd: number
  ): Promise<AllFeeEstimates> {
    const fees = await this.getRecommendedFees();
    
    return {
      fastest: this.calculateFeeEstimate(
        { ...params, priority: 'fastest' },
        fees.fastestFee,
        btcPriceUsd
      ),
      halfHour: this.calculateFeeEstimate(
        { ...params, priority: 'halfHour' },
        fees.halfHourFee,
        btcPriceUsd
      ),
      hour: this.calculateFeeEstimate(
        { ...params, priority: 'hour' },
        fees.hourFee,
        btcPriceUsd
      ),
      economy: this.calculateFeeEstimate(
        { ...params, priority: 'economy' },
        fees.economyFee,
        btcPriceUsd
      )
    };
  }

  /**
   * Get address type display name
   */
  getAddressTypeLabel(type: AddressType): string {
    const labels: Record<AddressType, string> = {
      'legacy': 'Legacy (P2PKH)',
      'segwit': 'SegWit (P2SH-P2WPKH)',
      'native-segwit': 'Native SegWit (P2WPKH)',
      'taproot': 'Taproot (P2TR)'
    };
    return labels[type];
  }

  /**
   * Get estimated savings compared to legacy
   */
  calculateSavingsVsLegacy(addressType: AddressType, inputCount: number, outputCount: number): number {
    if (addressType === 'legacy') return 0;
    
    const legacySize = this.calculateTransactionSize({ inputCount, outputCount, addressType: 'legacy' });
    const currentSize = this.calculateTransactionSize({ inputCount, outputCount, addressType });
    
    return Math.round(((legacySize - currentSize) / legacySize) * 100);
  }

  /**
   * Format satoshis for display
   */
  formatSats(sats: number): string {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(2)}M sats`;
    }
    if (sats >= 1000) {
      return `${(sats / 1000).toFixed(1)}K sats`;
    }
    return `${sats.toLocaleString()} sats`;
  }

  /**
   * Format USD for display
   */
  formatUsd(amount: number): string {
    if (amount < 0.01) {
      return `$${amount.toFixed(4)}`;
    }
    return `$${amount.toFixed(2)}`;
  }
}

export const transactionFeeCalculator = new TransactionFeeCalculator();
