// Bitcoin Wealth Percentile Service
// On-chain address distribution data from BitInfoCharts (February 2026)
// This data changes slowly (weekly) and is updated periodically.

export interface DistributionTier {
  minBtc: number;
  maxBtc: number;
  addresses: number;
  totalBtcHeld: number;
  tierName: string;
  tierEmoji: string;
  tierDescription: string;
  color: string;
}

export interface PercentileResult {
  percentile: number;
  tier: DistributionTier;
  addressesBelow: number;
  addressesAbove: number;
  totalAddresses: number;
  supplyPercentage: number;
  btcAmount: number;
}

export interface MilestoneInfo {
  nextTier: DistributionTier | null;
  btcNeeded: number;
  percentileJump: number;
  currentProgress: number; // 0-100 within current tier
}

export interface GlobalContext {
  percentileText: string;
  supplyShare: string;
  estimatedHolderRank: string;
  fairShareComparison: string;
  totalHolders: number;
  worldPopulation: number;
}

// Total Bitcoin supply (approximate as of Feb 2026)
const TOTAL_BTC_SUPPLY = 19_800_000;
const ESTIMATED_INDIVIDUAL_HOLDERS = 106_000_000;
const WORLD_POPULATION = 8_100_000_000;
const TOTAL_ADDRESSES_WITH_BALANCE = 57_970_000;

export const DISTRIBUTION_TIERS: DistributionTier[] = [
  {
    minBtc: 0,
    maxBtc: 0.001,
    addresses: 33_500_000,
    totalBtcHeld: 8_400,
    tierName: 'Plankton',
    tierEmoji: '🦠',
    tierDescription: 'Micro-holders with dust-level balances. You\'re taking your first steps into Bitcoin.',
    color: '#94a3b8',
  },
  {
    minBtc: 0.001,
    maxBtc: 0.01,
    addresses: 11_900_000,
    totalBtcHeld: 42_000,
    tierName: 'Shrimp',
    tierEmoji: '🦐',
    tierDescription: 'Small holders getting started. You own more Bitcoin than most addresses on the network.',
    color: '#60a5fa',
  },
  {
    minBtc: 0.01,
    maxBtc: 0.1,
    addresses: 8_150_000,
    totalBtcHeld: 280_000,
    tierName: 'Crab',
    tierEmoji: '🦀',
    tierDescription: 'Committed stackers building a meaningful position. You\'re in the top ~8% of addresses.',
    color: '#34d399',
  },
  {
    minBtc: 0.1,
    maxBtc: 1,
    addresses: 3_490_000,
    totalBtcHeld: 1_050_000,
    tierName: 'Octopus',
    tierEmoji: '🐙',
    tierDescription: 'Serious Bitcoin holders. You own more than ~92% of all Bitcoin addresses worldwide.',
    color: '#a78bfa',
  },
  {
    minBtc: 1,
    maxBtc: 10,
    addresses: 823_000,
    totalBtcHeld: 2_350_000,
    tierName: 'Fish',
    tierEmoji: '🐟',
    tierDescription: 'Whole-coiners and beyond. Fewer than 1 million addresses hold 1+ BTC. You\'re in an elite group.',
    color: '#fbbf24',
  },
  {
    minBtc: 10,
    maxBtc: 100,
    addresses: 131_000,
    totalBtcHeld: 3_950_000,
    tierName: 'Dolphin',
    tierEmoji: '🐬',
    tierDescription: 'Major holders with significant influence. You hold more Bitcoin than ~99.8% of all addresses.',
    color: '#2dd4bf',
  },
  {
    minBtc: 100,
    maxBtc: 1_000,
    addresses: 17_700,
    totalBtcHeld: 4_870_000,
    tierName: 'Shark',
    tierEmoji: '🦈',
    tierDescription: 'Power holders in the top 0.03%. Your holdings represent serious wealth in Bitcoin terms.',
    color: '#f472b6',
  },
  {
    minBtc: 1_000,
    maxBtc: 10_000,
    addresses: 1_941,
    totalBtcHeld: 4_650_000,
    tierName: 'Whale',
    tierEmoji: '🐋',
    tierDescription: 'Institutional-level holdings. Fewer than 2,000 addresses hold this much Bitcoin.',
    color: '#818cf8',
  },
  {
    minBtc: 10_000,
    maxBtc: 100_000,
    addresses: 85,
    totalBtcHeld: 2_180_000,
    tierName: 'Mega Whale',
    tierEmoji: '🐳',
    tierDescription: 'Ultra-high net worth Bitcoin holdings. Only ~85 addresses in the world hold this much.',
    color: '#c084fc',
  },
  {
    minBtc: 100_000,
    maxBtc: 21_000_000,
    addresses: 4,
    totalBtcHeld: 420_000,
    tierName: 'Humpback',
    tierEmoji: '🏔️',
    tierDescription: 'The largest known Bitcoin addresses on Earth. Only 4 addresses hold 100,000+ BTC.',
    color: '#f59e0b',
  },
];

/**
 * Calculate the percentile ranking for a given BTC amount.
 * Uses linear interpolation within the matching tier.
 */
export function calculatePercentile(btcAmount: number): PercentileResult {
  if (btcAmount <= 0) {
    return {
      percentile: 0,
      tier: DISTRIBUTION_TIERS[0],
      addressesBelow: 0,
      addressesAbove: TOTAL_ADDRESSES_WITH_BALANCE,
      totalAddresses: TOTAL_ADDRESSES_WITH_BALANCE,
      supplyPercentage: 0,
      btcAmount: 0,
    };
  }

  let addressesBelow = 0;
  let matchedTier = DISTRIBUTION_TIERS[DISTRIBUTION_TIERS.length - 1];

  for (let i = 0; i < DISTRIBUTION_TIERS.length; i++) {
    const tier = DISTRIBUTION_TIERS[i];

    if (btcAmount <= tier.maxBtc || i === DISTRIBUTION_TIERS.length - 1) {
      // User falls within this tier — interpolate
      matchedTier = tier;
      const tierRange = tier.maxBtc - tier.minBtc;
      const userPositionInTier = Math.min(
        Math.max((btcAmount - tier.minBtc) / tierRange, 0),
        1
      );
      // Linear interpolation: fraction of this tier's addresses that are below
      addressesBelow += Math.round(userPositionInTier * tier.addresses);
      break;
    }

    // All addresses in this tier are below the user
    addressesBelow += tier.addresses;
  }

  const percentile = Math.min(
    (addressesBelow / TOTAL_ADDRESSES_WITH_BALANCE) * 100,
    99.9999
  );

  const supplyPercentage = (btcAmount / TOTAL_BTC_SUPPLY) * 100;

  return {
    percentile,
    tier: matchedTier,
    addressesBelow,
    addressesAbove: TOTAL_ADDRESSES_WITH_BALANCE - addressesBelow,
    totalAddresses: TOTAL_ADDRESSES_WITH_BALANCE,
    supplyPercentage,
    btcAmount,
  };
}

/**
 * Get the next milestone tier and how much BTC is needed to reach it.
 */
export function getNextMilestone(btcAmount: number): MilestoneInfo {
  const result = calculatePercentile(btcAmount);
  const currentTierIndex = DISTRIBUTION_TIERS.indexOf(result.tier);
  const nextTierIndex = currentTierIndex + 1;

  if (nextTierIndex >= DISTRIBUTION_TIERS.length) {
    return {
      nextTier: null,
      btcNeeded: 0,
      percentileJump: 0,
      currentProgress: 100,
    };
  }

  const nextTier = DISTRIBUTION_TIERS[nextTierIndex];
  const btcNeeded = Math.max(nextTier.minBtc - btcAmount, 0);

  // Calculate percentile at the next tier boundary
  const nextPercentile = calculatePercentile(nextTier.minBtc).percentile;
  const percentileJump = nextPercentile - result.percentile;

  // Progress within current tier
  const tierRange = result.tier.maxBtc - result.tier.minBtc;
  const currentProgress = tierRange > 0
    ? Math.min(((btcAmount - result.tier.minBtc) / tierRange) * 100, 100)
    : 100;

  return {
    nextTier,
    btcNeeded,
    percentileJump,
    currentProgress,
  };
}

/**
 * Get all tiers with optional fiat value conversion.
 */
export function getAllTiers(btcPrice?: number): (DistributionTier & { minFiat?: number; maxFiat?: number; percentOfAddresses: number; percentOfSupply: number })[] {
  return DISTRIBUTION_TIERS.map((tier) => ({
    ...tier,
    minFiat: btcPrice ? tier.minBtc * btcPrice : undefined,
    maxFiat: btcPrice ? (tier.maxBtc >= 21_000_000 ? undefined : tier.maxBtc * btcPrice) : undefined,
    percentOfAddresses: (tier.addresses / TOTAL_ADDRESSES_WITH_BALANCE) * 100,
    percentOfSupply: (tier.totalBtcHeld / TOTAL_BTC_SUPPLY) * 100,
  }));
}

/**
 * Global context statistics for the user's BTC amount.
 */
export function getGlobalContext(btcAmount: number): GlobalContext {
  const result = calculatePercentile(btcAmount);
  const fairShare = TOTAL_BTC_SUPPLY / WORLD_POPULATION;

  // Estimate individual holder rank
  const estimatedRank = Math.max(
    1,
    Math.round(ESTIMATED_INDIVIDUAL_HOLDERS * (1 - result.percentile / 100))
  );

  return {
    percentileText: `You own more Bitcoin than ${formatPercentile(result.percentile)} of all addresses`,
    supplyShare: `${result.supplyPercentage.toFixed(8)}%`,
    estimatedHolderRank: estimatedRank.toLocaleString(),
    fairShareComparison: `${(btcAmount / fairShare).toFixed(1)}x the fair share if equally distributed`,
    totalHolders: ESTIMATED_INDIVIDUAL_HOLDERS,
    worldPopulation: WORLD_POPULATION,
  };
}

/**
 * Format percentile for display.
 */
export function formatPercentile(percentile: number): string {
  if (percentile >= 99.99) return '99.99%';
  if (percentile >= 99.9) return `${percentile.toFixed(2)}%`;
  if (percentile >= 99) return `${percentile.toFixed(1)}%`;
  if (percentile >= 10) return `${percentile.toFixed(1)}%`;
  return `${percentile.toFixed(2)}%`;
}

/**
 * Convert satoshis to BTC.
 */
export function satsToBtc(sats: number): number {
  return sats / 100_000_000;
}

/**
 * Convert BTC to satoshis.
 */
export function btcToSats(btc: number): number {
  return Math.round(btc * 100_000_000);
}

export { TOTAL_BTC_SUPPLY, ESTIMATED_INDIVIDUAL_HOLDERS, WORLD_POPULATION, TOTAL_ADDRESSES_WITH_BALANCE };
