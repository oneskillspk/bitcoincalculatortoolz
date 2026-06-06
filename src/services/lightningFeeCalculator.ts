/**
 * Lightning Network Fee Calculator Service
 * Provides API integration with mempool.space and fee calculations
 */

import axios from 'axios';

// ============ INTERFACES ============

export interface LightningNetworkStats {
  nodeCount: number;
  channelCount: number;
  totalCapacitySats: number;
  avgCapacitySats: number;
  avgBaseFee: number;        // millisatoshis
  avgFeeRate: number;        // ppm (parts per million)
  medianBaseFee: number;
  medianFeeRate: number;
  medianCapacity: number;
}

export interface PaymentParams {
  amountSats: number;
  estimatedHops: number;
  baseFeePerHop: number;     // millisatoshis
  feeRatePpm: number;        // parts per million
  channelSizeSats?: number;
}

export interface LightningFeeEstimate {
  totalFeeSats: number;
  totalFeeUsd: number;
  baseFeeTotal: number;      // satoshis
  proportionalFeeTotal: number; // satoshis
  effectiveFeeRate: number;  // percentage
  estimatedTime: string;
  feeBreakdownByHop: HopFeeBreakdown[];
  onChainComparison: {
    fastestFeeSats: number;
    halfHourFeeSats: number;
    economyFeeSats: number;
    savingsPercent: number;
  };
}

export interface HopFeeBreakdown {
  hop: number;
  baseFee: number;
  proportionalFee: number;
  totalFee: number;
  cumulativeFee: number;
  percentOfAmount: number;
}

export interface ChannelEconomics {
  channelSizeSats: number;
  channelSizeBtc: number;
  estimatedDailyRoutingVolume: number;
  estimatedDailyRevenue: number;
  estimatedMonthlyRevenue: number;
  estimatedAnnualRevenue: number;
  breakEvenDays: number;
  expectedAnnualRoi: number;
}

export interface HistoricalNetworkData {
  date: string;
  nodeCount: number;
  channelCount: number;
  totalCapacityBtc: number;
  avgCapacitySats: number;
}

// ============ CONSTANTS ============

const MEMPOOL_API_BASE = 'https://mempool.space/api';

export const LIGHTNING_CONSTANTS = {
  MIN_BASE_FEE_MSAT: 0,
  MAX_BASE_FEE_MSAT: 10000,
  MIN_FEE_RATE_PPM: 0,
  MAX_FEE_RATE_PPM: 5000,
  DEFAULT_HOPS: 3,
  MIN_HOPS: 1,
  MAX_HOPS: 10,
  INSTANT_PAYMENT_TIME: "~1-2 seconds",
  SATS_PER_BTC: 100_000_000,
  MSAT_PER_SAT: 1000,
};

export const FALLBACK_NETWORK_STATS: LightningNetworkStats = {
  nodeCount: 18000,
  channelCount: 75000,
  totalCapacitySats: 500_000_000_000, // ~5000 BTC
  avgCapacitySats: 6_600_000,
  avgBaseFee: 1000,                   // 1 sat (1000 msat)
  avgFeeRate: 100,                    // 100 ppm
  medianBaseFee: 1000,
  medianFeeRate: 50,
  medianCapacity: 2_000_000,
};

export const PAYMENT_PRESETS = [
  { name: 'Coffee', sats: 5000, description: '~$5 coffee' },
  { name: 'Small', sats: 50000, description: '~$50 purchase' },
  { name: 'Medium', sats: 500000, description: '~$500 payment' },
  { name: 'Large', sats: 5000000, description: '~$5,000 transfer' },
];

// ============ API FUNCTIONS ============

/**
 * Fetch current Lightning Network statistics
 */
export async function fetchLightningStats(): Promise<LightningNetworkStats> {
  try {
    const response = await axios.get(`${MEMPOOL_API_BASE}/v1/lightning/statistics/latest`, {
      timeout: 10000,
    });
    
    const data = response.data?.latest;
    if (!data) {
      console.warn('No Lightning statistics data returned, using fallback');
      return FALLBACK_NETWORK_STATS;
    }

    return {
      nodeCount: data.node_count || FALLBACK_NETWORK_STATS.nodeCount,
      channelCount: data.channel_count || FALLBACK_NETWORK_STATS.channelCount,
      totalCapacitySats: data.total_capacity || FALLBACK_NETWORK_STATS.totalCapacitySats,
      avgCapacitySats: data.avg_capacity || FALLBACK_NETWORK_STATS.avgCapacitySats,
      avgBaseFee: data.avg_base_fee_mtokens || FALLBACK_NETWORK_STATS.avgBaseFee,
      avgFeeRate: data.avg_fee_rate || FALLBACK_NETWORK_STATS.avgFeeRate,
      medianBaseFee: data.med_base_fee_mtokens || FALLBACK_NETWORK_STATS.medianBaseFee,
      medianFeeRate: data.med_fee_rate || FALLBACK_NETWORK_STATS.medianFeeRate,
      medianCapacity: data.med_capacity || FALLBACK_NETWORK_STATS.medianCapacity,
    };
  } catch (error) {
    console.error('Failed to fetch Lightning stats:', error);
    return FALLBACK_NETWORK_STATS;
  }
}

/**
 * Fetch historical network statistics (1 year)
 */
export async function fetchHistoricalStats(): Promise<HistoricalNetworkData[]> {
  try {
    const response = await axios.get(`${MEMPOOL_API_BASE}/v1/lightning/statistics/1y`, {
      timeout: 15000,
    });
    
    if (!Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item: any) => ({
      date: item.added || new Date().toISOString(),
      nodeCount: item.node_count || 0,
      channelCount: item.channel_count || 0,
      totalCapacityBtc: (item.total_capacity || 0) / LIGHTNING_CONSTANTS.SATS_PER_BTC,
      avgCapacitySats: item.avg_capacity || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch historical Lightning stats:', error);
    return [];
  }
}

/**
 * Fetch current on-chain fee recommendations for comparison
 */
export async function fetchOnChainFees(): Promise<{
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
}> {
  try {
    const response = await axios.get(`${MEMPOOL_API_BASE}/v1/fees/recommended`, {
      timeout: 10000,
    });
    
    return {
      fastestFee: response.data.fastestFee || 10,
      halfHourFee: response.data.halfHourFee || 8,
      hourFee: response.data.hourFee || 5,
      economyFee: response.data.economyFee || 2,
    };
  } catch (error) {
    console.error('Failed to fetch on-chain fees:', error);
    return { fastestFee: 10, halfHourFee: 8, hourFee: 5, economyFee: 2 };
  }
}

// ============ CALCULATION FUNCTIONS ============

/**
 * Calculate Lightning Network routing fees
 * 
 * Fee Formula:
 * - Base Fee: baseFeePerHop * numberOfHops (in millisatoshis)
 * - Proportional Fee: (amountSats * feeRatePpm / 1,000,000) * numberOfHops
 * - Total Fee: (baseFee / 1000) + proportionalFee (in satoshis)
 */
export function calculateLightningFee(
  params: PaymentParams,
  btcPriceUsd: number,
  onChainFees?: { fastestFee: number; halfHourFee: number; economyFee: number }
): LightningFeeEstimate {
  const { amountSats, estimatedHops, baseFeePerHop, feeRatePpm } = params;
  
  // Calculate base fee in millisatoshis, then convert to satoshis
  const baseFeeTotal = (baseFeePerHop * estimatedHops) / LIGHTNING_CONSTANTS.MSAT_PER_SAT;
  
  // Calculate proportional fee in satoshis
  const proportionalFeeTotal = (amountSats * feeRatePpm / 1_000_000) * estimatedHops;
  
  // Total fee in satoshis
  const totalFeeSats = baseFeeTotal + proportionalFeeTotal;
  
  // Convert to USD
  const satsPerBtc = LIGHTNING_CONSTANTS.SATS_PER_BTC;
  const totalFeeUsd = (totalFeeSats / satsPerBtc) * btcPriceUsd;
  
  // Calculate effective fee rate as percentage
  const effectiveFeeRate = amountSats > 0 ? (totalFeeSats / amountSats) * 100 : 0;
  
  // Build hop-by-hop breakdown
  const feeBreakdownByHop: HopFeeBreakdown[] = [];
  let cumulativeFee = 0;
  
  for (let hop = 1; hop <= estimatedHops; hop++) {
    const hopBaseFee = baseFeePerHop / LIGHTNING_CONSTANTS.MSAT_PER_SAT;
    const hopProportionalFee = (amountSats * feeRatePpm) / 1_000_000;
    const hopTotalFee = hopBaseFee + hopProportionalFee;
    cumulativeFee += hopTotalFee;
    
    feeBreakdownByHop.push({
      hop,
      baseFee: hopBaseFee,
      proportionalFee: hopProportionalFee,
      totalFee: hopTotalFee,
      cumulativeFee,
      percentOfAmount: amountSats > 0 ? (cumulativeFee / amountSats) * 100 : 0,
    });
  }
  
  // Calculate on-chain comparison (typical P2WPKH transaction ~140 vBytes)
  const typicalTxSize = 140;
  const fastestFeeSats = onChainFees ? onChainFees.fastestFee * typicalTxSize : 1400;
  const halfHourFeeSats = onChainFees ? onChainFees.halfHourFee * typicalTxSize : 1120;
  const economyFeeSats = onChainFees ? onChainFees.economyFee * typicalTxSize : 280;
  
  const savingsPercent = fastestFeeSats > 0 
    ? Math.max(0, ((fastestFeeSats - totalFeeSats) / fastestFeeSats) * 100)
    : 0;
  
  return {
    totalFeeSats,
    totalFeeUsd,
    baseFeeTotal,
    proportionalFeeTotal,
    effectiveFeeRate,
    estimatedTime: LIGHTNING_CONSTANTS.INSTANT_PAYMENT_TIME,
    feeBreakdownByHop,
    onChainComparison: {
      fastestFeeSats,
      halfHourFeeSats,
      economyFeeSats,
      savingsPercent,
    },
  };
}

/**
 * Calculate channel economics for routing node operators
 */
export function calculateChannelEconomics(
  channelSizeSats: number,
  avgFeeRatePpm: number,
  avgBaseFee: number,
  btcPriceUsd: number
): ChannelEconomics {
  if (channelSizeSats <= 0) {
    return {
      channelSizeSats: 0,
      channelSizeBtc: 0,
      estimatedDailyRoutingVolume: 0,
      estimatedDailyRevenue: 0,
      estimatedMonthlyRevenue: 0,
      estimatedAnnualRevenue: 0,
      breakEvenDays: Infinity,
      expectedAnnualRoi: 0,
    };
  }
  
  const channelSizeBtc = channelSizeSats / LIGHTNING_CONSTANTS.SATS_PER_BTC;
  
  // Estimate daily routing volume (conservative: 10% of channel capacity per day)
  const estimatedDailyRoutingVolume = channelSizeSats * 0.10;
  
  // Daily revenue in sats
  const estimatedDailyRevenue = estimatedDailyRoutingVolume * (avgFeeRatePpm / 1_000_000);
  
  // Monthly and annual revenue
  const estimatedMonthlyRevenue = estimatedDailyRevenue * 30;
  const estimatedAnnualRevenue = estimatedDailyRevenue * 365;
  
  // Break-even calculation (assuming channel open/close costs ~2000 sats total)
  const channelOperatingCosts = 2000;
  const breakEvenDays = estimatedDailyRevenue > 0 
    ? Math.ceil(channelOperatingCosts / estimatedDailyRevenue)
    : Infinity;
  
  // Annual ROI
  const channelValueUsd = channelSizeBtc * btcPriceUsd;
  const annualRevenueUsd = (estimatedAnnualRevenue / LIGHTNING_CONSTANTS.SATS_PER_BTC) * btcPriceUsd;
  const expectedAnnualRoi = channelValueUsd > 0 
    ? (annualRevenueUsd / channelValueUsd) * 100
    : 0;
  
  return {
    channelSizeSats,
    channelSizeBtc,
    estimatedDailyRoutingVolume,
    estimatedDailyRevenue,
    estimatedMonthlyRevenue,
    estimatedAnnualRevenue,
    breakEvenDays,
    expectedAnnualRoi,
  };
}

/**
 * Format satoshis to human-readable string
 */
export function formatSats(sats: number): string {
  if (sats >= 100_000_000) {
    return `${(sats / 100_000_000).toFixed(4)} BTC`;
  }
  if (sats >= 1_000_000) {
    return `${(sats / 1_000_000).toFixed(2)}M sats`;
  }
  if (sats >= 1_000) {
    return `${(sats / 1_000).toFixed(2)}K sats`;
  }
  return `${sats.toFixed(3)} sats`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  if (value < 0.001) {
    return '<0.001%';
  }
  if (value < 0.01) {
    return `${value.toFixed(4)}%`;
  }
  if (value < 1) {
    return `${value.toFixed(3)}%`;
  }
  return `${value.toFixed(2)}%`;
}

/**
 * Convert between amount units
 */
export function convertToSats(amount: number, unit: 'sats' | 'btc' | 'usd', btcPriceUsd: number): number {
  switch (unit) {
    case 'btc':
      return amount * LIGHTNING_CONSTANTS.SATS_PER_BTC;
    case 'usd':
      return btcPriceUsd > 0 
        ? (amount / btcPriceUsd) * LIGHTNING_CONSTANTS.SATS_PER_BTC
        : 0;
    case 'sats':
    default:
      return amount;
  }
}

export function convertFromSats(sats: number, unit: 'sats' | 'btc' | 'usd', btcPriceUsd: number): number {
  switch (unit) {
    case 'btc':
      return sats / LIGHTNING_CONSTANTS.SATS_PER_BTC;
    case 'usd':
      return (sats / LIGHTNING_CONSTANTS.SATS_PER_BTC) * btcPriceUsd;
    case 'sats':
    default:
      return sats;
  }
}
