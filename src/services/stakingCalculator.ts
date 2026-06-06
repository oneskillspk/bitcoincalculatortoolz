// ============================================================
// Bitcoin Staking / Yield Calculator — Core Logic
// APY rates sourced from published platform data (Jan 2026)
// ============================================================

export interface StakingProtocol {
  id: string;
  name: string;
  platform: string;
  apy: number;          // decimal (0.045 = 4.5%)
  type: 'native' | 'wrapped' | 'custodial';
  lockPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
  color: string;
  description: string;
  url: string;
}

export const STAKING_PROTOCOLS: StakingProtocol[] = [
  {
    id: 'babylon',
    name: 'Babylon',
    platform: 'Babylon Protocol',
    apy: 0.045,
    type: 'native',
    lockPeriod: 'Flexible',
    riskLevel: 'low',
    color: '#F7931A',
    description: 'Non-custodial native BTC staking. Your keys, your Bitcoin.',
    url: 'https://babylon.finance',
  },
  {
    id: 'lido-wbtc',
    name: 'Lido wBTC',
    platform: 'Lido Finance',
    apy: 0.021,
    type: 'wrapped',
    lockPeriod: 'Flexible',
    riskLevel: 'medium',
    color: '#00A3FF',
    description: 'DeFi yield via wrapped BTC. Exposes you to smart contract risk.',
    url: 'https://lido.fi',
  },
  {
    id: 'binance-flexible',
    name: 'Binance Flexible',
    platform: 'Binance Earn',
    apy: 0.015,
    type: 'custodial',
    lockPeriod: 'Flexible',
    riskLevel: 'high',
    color: '#F0B90B',
    description: 'Custodial yield. Withdraw anytime. Counterparty risk applies.',
    url: 'https://www.binance.com/earn',
  },
  {
    id: 'binance-locked',
    name: 'Binance 30-Day',
    platform: 'Binance Earn',
    apy: 0.032,
    type: 'custodial',
    lockPeriod: '30 days',
    riskLevel: 'high',
    color: '#FFA500',
    description: 'Higher yield with 30-day lock. Custodial counterparty risk.',
    url: 'https://www.binance.com/earn',
  },
];

export const RATES_LAST_UPDATED = 'January 2026';

// ─── Interfaces ───────────────────────────────────────────────

export interface StakingInput {
  btcAmount: number;
  protocolId: string;
  years: number;
  compounding: boolean;
}

export interface YearlyBreakdownEntry {
  year: number;
  btcBalance: number;
  btcRewards: number;
  usdBalance: number;
  usdRewards: number;
}

export interface StakingResult {
  protocol: StakingProtocol;
  btcAmount: number;
  finalBtcBalance: number;
  btcRewards: number;
  usdRewardsAtCurrentPrice: number;
  usdFinalValueAtCurrentPrice: number;
  yearlyBreakdown: YearlyBreakdownEntry[];
  effectiveAPY: number;
}

// ─── Core Calculations ────────────────────────────────────────

export function calculateStakingRewards(
  input: StakingInput,
  btcPrice: number,
): StakingResult | null {
  const protocol = STAKING_PROTOCOLS.find(p => p.id === input.protocolId);
  if (!protocol) return null;

  const { btcAmount, years, compounding } = input;
  const apy = protocol.apy;

  const yearlyBreakdown: YearlyBreakdownEntry[] = [];

  for (let y = 1; y <= years; y++) {
    let balance: number;
    if (compounding) {
      balance = btcAmount * Math.pow(1 + apy, y);
    } else {
      balance = btcAmount + btcAmount * apy * y;
    }
    const rewards = balance - btcAmount;
    yearlyBreakdown.push({
      year: y,
      btcBalance: balance,
      btcRewards: rewards,
      usdBalance: balance * btcPrice,
      usdRewards: rewards * btcPrice,
    });
  }

  const finalBtcBalance = yearlyBreakdown[yearlyBreakdown.length - 1]?.btcBalance ?? btcAmount;
  const btcRewards = finalBtcBalance - btcAmount;

  // Effective APY (annualised total return)
  const effectiveAPY =
    years > 0 ? (Math.pow(finalBtcBalance / btcAmount, 1 / years) - 1) * 100 : apy * 100;

  return {
    protocol,
    btcAmount,
    finalBtcBalance,
    btcRewards,
    usdRewardsAtCurrentPrice: btcRewards * btcPrice,
    usdFinalValueAtCurrentPrice: finalBtcBalance * btcPrice,
    yearlyBreakdown,
    effectiveAPY,
  };
}

export function compareAllProtocols(
  btcAmount: number,
  years: number,
  compounding: boolean,
  btcPrice: number,
): StakingResult[] {
  return STAKING_PROTOCOLS.map(p =>
    calculateStakingRewards({ btcAmount, protocolId: p.id, years, compounding }, btcPrice),
  ).filter((r): r is StakingResult => r !== null);
}

// ─── Formatters ───────────────────────────────────────────────

export function formatBTC(value: number): string {
  if (Math.abs(value) < 0.0001) return value.toFixed(8) + ' BTC';
  if (Math.abs(value) < 0.01) return value.toFixed(6) + ' BTC';
  return value.toFixed(4) + ' BTC';
}

export function formatUSD(value: number): string {
  if (value >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(2) + 'M';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
