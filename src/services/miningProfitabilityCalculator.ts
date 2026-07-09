// Bitcoin Mining Profitability Calculator Service
// Calculates mining profitability based on hardware specs, electricity costs, and network difficulty

export interface MiningParams {
  hashRate: number; // TH/s (Terahashes per second)
  powerConsumption: number; // Watts
  electricityCost: number; // $/kWh
  poolFee: number; // percentage (e.g., 2 for 2%)
  hardwareCost: number; // $ initial investment
  bitcoinPrice: number; // current BTC price in USD
  networkDifficulty: number; // current network difficulty
  blockReward: number; // current block reward (3.125 BTC post-2024 halving)
  difficultyAdjustment: number; // monthly difficulty increase percentage
  currency: string;
}

export interface MiningResult {
  // Daily metrics
  dailyBtcMined: number;
  dailyRevenue: number;
  dailyElectricityCost: number;
  dailyProfit: number;
  
  // Monthly metrics
  monthlyBtcMined: number;
  monthlyRevenue: number;
  monthlyElectricityCost: number;
  monthlyProfit: number;
  
  // Yearly metrics
  yearlyBtcMined: number;
  yearlyRevenue: number;
  yearlyElectricityCost: number;
  yearlyProfit: number;
  
  // ROI Analysis
  breakEvenDays: number;
  roiPercentage: number;
  costPerBtc: number;
  
  // Projections (12 months)
  projections: MonthlyProjection[];
  
  // Efficiency metrics
  hashCostRatio: number; // $/TH/s
  energyEfficiency: number; // J/TH (Joules per Terahash)
  profitMargin: number; // percentage
}

export interface MonthlyProjection {
  month: number;
  btcMined: number;
  revenue: number;
  electricityCost: number;
  profit: number;
  cumulativeBtc: number;
  cumulativeProfit: number;
  difficulty: number;
  btcPrice: number;
}

export interface HardwarePreset {
  id: string;
  name: string;
  manufacturer: string;
  hashRate: number; // TH/s
  powerConsumption: number; // Watts
  price: number; // USD
  efficiency: number; // J/TH
  releaseYear: number;
}

// Popular mining hardware presets
export const HARDWARE_PRESETS: HardwarePreset[] = [
  {
    id: 'antminer-s21-pro',
    name: 'Antminer S21 Pro',
    manufacturer: 'Bitmain',
    hashRate: 234,
    powerConsumption: 3510,
    price: 6500,
    efficiency: 15,
    releaseYear: 2024
  },
  {
    id: 'antminer-s21',
    name: 'Antminer S21',
    manufacturer: 'Bitmain',
    hashRate: 200,
    powerConsumption: 3500,
    price: 5500,
    efficiency: 17.5,
    releaseYear: 2024
  },
  {
    id: 'antminer-s19-xp',
    name: 'Antminer S19 XP',
    manufacturer: 'Bitmain',
    hashRate: 140,
    powerConsumption: 3010,
    price: 4200,
    efficiency: 21.5,
    releaseYear: 2022
  },
  {
    id: 'whatsminer-m60s',
    name: 'WhatsMiner M60S',
    manufacturer: 'MicroBT',
    hashRate: 186,
    powerConsumption: 3422,
    price: 5200,
    efficiency: 18.4,
    releaseYear: 2024
  },
  {
    id: 'whatsminer-m50s',
    name: 'WhatsMiner M50S++',
    manufacturer: 'MicroBT',
    hashRate: 150,
    powerConsumption: 3276,
    price: 3800,
    efficiency: 21.8,
    releaseYear: 2023
  },
  {
    id: 'avalon-a1466',
    name: 'Avalon A1466',
    manufacturer: 'Canaan',
    hashRate: 150,
    powerConsumption: 3150,
    price: 3600,
    efficiency: 21,
    releaseYear: 2023
  },
  {
    id: 'bitaxe-ultra',
    name: 'Bitaxe Ultra (Solo)',
    manufacturer: 'Open Source',
    hashRate: 0.5,
    powerConsumption: 15,
    price: 70,
    efficiency: 30,
    releaseYear: 2024
  }
];

// Current network constants (updated for post-2024 halving)
export const NETWORK_CONSTANTS = {
  BLOCK_REWARD: 3.125, // BTC per block after 2024 halving
  BLOCKS_PER_DAY: 144, // ~10 min per block
  DIFFICULTY_ADJUSTMENT_BLOCKS: 2016, // blocks between adjustments
  AVG_DIFFICULTY_INCREASE: 3.5, // % monthly average increase
  HASH_TARGET_CONSTANT: 2 ** 32, // for difficulty calculations
};

export class MiningProfitabilityCalculator {
  /**
   * Calculate mining profitability based on parameters
   */
  static calculate(params: MiningParams): MiningResult {
    const {
      hashRate,
      powerConsumption,
      electricityCost,
      poolFee,
      hardwareCost,
      bitcoinPrice,
      networkDifficulty,
      blockReward,
      difficultyAdjustment,
    } = params;

    // Calculate daily BTC mined
    // Formula: (hashRate * 10^12 * 86400) / (difficulty * 2^32) * blockReward
    const dailyBtcMined = this.calculateDailyBtc(
      hashRate,
      networkDifficulty,
      blockReward,
      poolFee
    );

    // Calculate costs
    const dailyKwh = (powerConsumption / 1000) * 24;
    const dailyElectricityCost = dailyKwh * electricityCost;
    const dailyRevenue = dailyBtcMined * bitcoinPrice;
    const dailyProfit = dailyRevenue - dailyElectricityCost;

    // Monthly calculations
    const monthlyBtcMined = dailyBtcMined * 30;
    const monthlyRevenue = dailyRevenue * 30;
    const monthlyElectricityCost = dailyElectricityCost * 30;
    const monthlyProfit = dailyProfit * 30;

    // Yearly calculations — sum from 12-month projections to account for difficulty growth
    const projections = this.generateProjections(
      hashRate, powerConsumption, electricityCost, poolFee,
      bitcoinPrice, networkDifficulty, blockReward, difficultyAdjustment
    );
    const yearlyBtcMined = projections.reduce((s, p) => s + p.btcMined, 0);
    const yearlyRevenue = projections.reduce((s, p) => s + p.revenue, 0);
    const yearlyElectricityCost = projections.reduce((s, p) => s + p.electricityCost, 0);
    const yearlyProfit = projections.reduce((s, p) => s + p.profit, 0);

    // ROI Analysis
    const breakEvenDays = dailyProfit > 0 ? Math.ceil(hardwareCost / dailyProfit) : Infinity;
    const roiPercentage = hardwareCost > 0 ? ((yearlyProfit) / hardwareCost) * 100 : 0;
    const costPerBtc = yearlyBtcMined > 0 ? (yearlyElectricityCost + hardwareCost) / yearlyBtcMined : 0;

    // projections already computed above for yearly totals

    // Efficiency metrics
    const hashCostRatio = hardwareCost / hashRate; // $/TH/s
    // Watts / (TH/s) = J/TH directly (W = J/s, TH/s = 10^12 H/s, units cancel).
    const energyEfficiency = powerConsumption / hashRate; // J/TH
    const profitMargin = dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0;

    return {
      dailyBtcMined,
      dailyRevenue,
      dailyElectricityCost,
      dailyProfit,
      monthlyBtcMined,
      monthlyRevenue,
      monthlyElectricityCost,
      monthlyProfit,
      yearlyBtcMined,
      yearlyRevenue,
      yearlyElectricityCost,
      yearlyProfit,
      breakEvenDays,
      roiPercentage,
      costPerBtc,
      projections,
      hashCostRatio,
      energyEfficiency,
      profitMargin,
    };
  }

  /**
   * Calculate daily BTC mined based on hash rate and network difficulty
   */
  private static calculateDailyBtc(
    hashRate: number,
    difficulty: number,
    blockReward: number,
    poolFee: number
  ): number {
    // Convert TH/s to H/s
    const hashRateHs = hashRate * 1e12;
    
    // Seconds in a day
    const secondsPerDay = 86400;
    
    // Expected blocks per day for the network
    const expectedBlocksPerDay = NETWORK_CONSTANTS.BLOCKS_PER_DAY;
    
    // Total network hashrate derived from difficulty
    // Network hashrate = difficulty * 2^32 / 600 (600 seconds per block target)
    const networkHashRate = (difficulty * NETWORK_CONSTANTS.HASH_TARGET_CONSTANT) / 600;
    
    // Your share of the network
    const networkShare = hashRateHs / networkHashRate;
    
    // Daily BTC before pool fee
    const dailyBtcGross = networkShare * expectedBlocksPerDay * blockReward;
    
    // Apply pool fee
    const dailyBtcNet = dailyBtcGross * (1 - poolFee / 100);
    
    return dailyBtcNet;
  }

  /**
   * Generate 12-month projections with difficulty adjustments
   */
  private static generateProjections(
    hashRate: number,
    powerConsumption: number,
    electricityCost: number,
    poolFee: number,
    initialBtcPrice: number,
    initialDifficulty: number,
    blockReward: number,
    monthlyDifficultyIncrease: number
  ): MonthlyProjection[] {
    const projections: MonthlyProjection[] = [];
    let cumulativeBtc = 0;
    let cumulativeProfit = 0;
    let currentDifficulty = initialDifficulty;
    let currentBtcPrice = initialBtcPrice;

    const dailyKwh = (powerConsumption / 1000) * 24;
    const monthlyElectricityCost = dailyKwh * electricityCost * 30;

    for (let month = 1; month <= 12; month++) {
      // Apply difficulty increase each month
      if (month > 1) {
        currentDifficulty *= (1 + monthlyDifficultyIncrease / 100);
      }

      // Calculate monthly BTC with updated difficulty
      const dailyBtc = this.calculateDailyBtc(
        hashRate,
        currentDifficulty,
        blockReward,
        poolFee
      );
      const monthlyBtc = dailyBtc * 30;

      // Revenue and profit
      const revenue = monthlyBtc * currentBtcPrice;
      const profit = revenue - monthlyElectricityCost;

      // Cumulative totals
      cumulativeBtc += monthlyBtc;
      cumulativeProfit += profit;

      projections.push({
        month,
        btcMined: monthlyBtc,
        revenue,
        electricityCost: monthlyElectricityCost,
        profit,
        cumulativeBtc,
        cumulativeProfit,
        difficulty: currentDifficulty,
        btcPrice: currentBtcPrice,
      });
    }

    return projections;
  }

  /**
   * Get current estimated network difficulty (fallback value)
   */
  static getEstimatedDifficulty(): number {
    // Fallback difficulty — only used when live fetch fails
    return 113_000_000_000_000;
  }

  /**
   * Fetch live network difficulty and stats from mempool.space API
   */
  static async fetchNetworkStats(): Promise<NetworkStats> {
    try {
      const [difficultyRes, blockHeightRes, hashrateRes] = await Promise.all([
        fetch('https://mempool.space/api/v1/difficulty-adjustment'),
        fetch('https://mempool.space/api/blocks/tip/height'),
        fetch('https://mempool.space/api/v1/mining/hashrate/1m')
      ]);

      if (!difficultyRes.ok || !blockHeightRes.ok) {
        throw new Error('Failed to fetch network stats');
      }

      const difficultyData = await difficultyRes.json();
      const blockHeight = await blockHeightRes.json();

      // Derive current difficulty from network hashrate:
      // difficulty = hashrate * 600 / 2^32
      let currentDifficulty = this.getEstimatedDifficulty();
      let networkHashrate = 0;

      if (hashrateRes.ok) {
        const hashrateData = await hashrateRes.json();
        networkHashrate = hashrateData.currentHashrate || 0;
        if (networkHashrate > 0) {
          currentDifficulty = (networkHashrate * 600) / NETWORK_CONSTANTS.HASH_TARGET_CONSTANT;
        }
      }

      return {
        difficulty: currentDifficulty,
        blockHeight: blockHeight,
        networkHashrate: networkHashrate,
        difficultyChange: difficultyData.difficultyChange || 0,
        estimatedRetargetDate: difficultyData.estimatedRetargetDate ? new Date(difficultyData.estimatedRetargetDate * 1000) : null,
        remainingBlocks: difficultyData.remainingBlocks || 0,
        progressPercent: difficultyData.progressPercent || 0,
        previousRetarget: difficultyData.previousRetarget || 0,
      };
    } catch (error) {
      console.warn('Failed to fetch live network stats, using fallback:', error);
      return {
        difficulty: this.getEstimatedDifficulty(),
        blockHeight: 0,
        networkHashrate: 0,
        difficultyChange: 0,
        estimatedRetargetDate: null,
        remainingBlocks: 0,
        progressPercent: 0,
        previousRetarget: 0,
      };
    }
  }

  /**
   * Format hash rate for display
   */
  static formatHashRate(hashRate: number): string {
    if (hashRate >= 1000) {
      return `${(hashRate / 1000).toFixed(2)} PH/s`;
    }
    return `${hashRate.toFixed(2)} TH/s`;
  }

  /**
   * Format network hashrate (in H/s) for display
   */
  static formatNetworkHashrate(hashrate: number): string {
    if (hashrate >= 1e18) {
      return `${(hashrate / 1e18).toFixed(2)} EH/s`;
    }
    if (hashrate >= 1e15) {
      return `${(hashrate / 1e15).toFixed(2)} PH/s`;
    }
    return `${(hashrate / 1e12).toFixed(2)} TH/s`;
  }

  /**
   * Format difficulty for display
   */
  static formatDifficulty(difficulty: number): string {
    if (difficulty >= 1e12) {
      return `${(difficulty / 1e12).toFixed(2)} T`;
    }
    return difficulty.toExponential(2);
  }
}

// Network stats interface
export interface NetworkStats {
  difficulty: number;
  blockHeight: number;
  networkHashrate: number;
  difficultyChange: number;
  estimatedRetargetDate: Date | null;
  remainingBlocks: number;
  progressPercent: number;
  previousRetarget: number;
}

export default MiningProfitabilityCalculator;
