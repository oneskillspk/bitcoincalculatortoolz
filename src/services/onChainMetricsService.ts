// ============================================================
// Bitcoin On-Chain Metrics Service
// Data: CoinGecko API (live) + hardcoded S2F model constants
// ============================================================

import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// ─── Interfaces ───────────────────────────────────────────────

export interface OnChainMetrics {
  // Price & Cap
  currentPrice: number;
  marketCap: number;
  realizedCap: number | null;

  // MVRV
  mvrvRatio: number | null;
  mvrvDeviation: number | null;
  mvrvSignal: 'undervalued' | 'fair' | 'overvalued' | 'extreme';

  // Stock-to-Flow
  s2fRatio: number;
  s2fModelPrice: number;
  s2fDeviation: number; // % deviation from model price

  // Hash Rate & Security
  hashRate: number | null; // EH/s
  hashRateChange30d: number | null; // %

  // Active Addresses (approximated via tx volume)
  activeAddresses: number | null;
  activeAddressesChange: number | null;

  // Supply
  circulatingSupply: number;
  maxSupply: number;
  percentMined: number;

  // Timing
  lastUpdated: string;
  fetchedAt: string;
}

export interface MetricHistoryPoint {
  date: string;
  value: number;
}

export interface OnChainHistory {
  priceHistory: MetricHistoryPoint[];
  marketCapHistory: MetricHistoryPoint[];
}

// ─── Stock-to-Flow Constants ───────────────────────────────────
// Based on PlanB's S2F model (Bitcoin's annual production schedule)

// Current era: post-4th halving (April 2024)
// Block reward: 3.125 BTC, ~144 blocks/day → ~164,250 BTC/year flow
const ANNUAL_FLOW_BTC = 164_250; // BTC/year after 4th halving
const CIRCULATING_SUPPLY_APPROX = 19_850_000; // approx current (2026)

export function calculateS2F(circulatingSupply: number): {
  ratio: number;
  modelPrice: number;
} {
  const stock = circulatingSupply;
  const flow = ANNUAL_FLOW_BTC;
  const ratio = stock / flow;
  // PlanB's power law: Price = exp(14.6) * S2F^3.3 (simplified)
  // Using published coefficients: ln(price) = 14.6 + 3.3*ln(S2F)
  const modelPrice = Math.exp(14.6) * Math.pow(ratio, 3.3);
  return { ratio, modelPrice };
}

// ─── MVRV Signal Classifier ────────────────────────────────────

export function getMVRVSignal(
  mvrv: number,
): OnChainMetrics['mvrvSignal'] {
  if (mvrv < 1) return 'undervalued';
  if (mvrv < 2.5) return 'fair';
  if (mvrv < 3.5) return 'overvalued';
  return 'extreme';
}

export function getMVRVLabel(signal: OnChainMetrics['mvrvSignal']): {
  label: string;
  color: string;
  bg: string;
} {
  switch (signal) {
    case 'undervalued':
      return { label: 'Undervalued', color: 'text-success', bg: 'bg-success/10' };
    case 'fair':
      return { label: 'Fair Value', color: 'text-blue-600', bg: 'bg-blue-500/10' };
    case 'overvalued':
      return { label: 'Overvalued', color: 'text-amber-600', bg: 'bg-amber-500/10' };
    case 'extreme':
      return { label: 'Extreme Overvalue', color: 'text-destructive', bg: 'bg-destructive/10' };
  }
}

// ─── Main Fetch Function ───────────────────────────────────────

export async function fetchOnChainMetrics(): Promise<OnChainMetrics> {
  const [marketRes, globalRes] = await Promise.allSettled([
    axios.get(`${COINGECKO_API}/coins/bitcoin`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
      timeout: 10_000,
    }),
    axios.get(`${COINGECKO_API}/global`, { timeout: 8_000 }),
  ]);

  // Parse market data
  let price = 95_000;
  let marketCap = 1_900_000_000_000;
  let circulatingSupply = CIRCULATING_SUPPLY_APPROX;
  let maxSupply = 21_000_000;
  let lastUpdated = new Date().toISOString();

  if (marketRes.status === 'fulfilled') {
    const d = marketRes.value.data.market_data;
    price = d?.current_price?.usd ?? price;
    marketCap = d?.market_cap?.usd ?? marketCap;
    circulatingSupply = marketRes.value.data.market_data?.circulating_supply ?? circulatingSupply;
    maxSupply = marketRes.value.data.market_data?.max_supply ?? maxSupply;
    lastUpdated = marketRes.value.data.last_updated ?? lastUpdated;
  }

  // MVRV approximation
  // Without on-chain data (Glassnode/CryptoQuant), we cannot compute true realized cap.
  // We use a rough approximation: realizedCap ≈ marketCap * 0.62
  // NOTE: This yields a near-constant ratio (~1.61). Labeled as "Approx." in the UI.
  const realizedCapApprox = marketCap * 0.62;
  const mvrvRatio = marketCap / realizedCapApprox;
  const mvrvSignal = getMVRVSignal(mvrvRatio);

  // Stock-to-Flow
  const { ratio: s2fRatio, modelPrice: s2fModelPrice } = calculateS2F(circulatingSupply);
  const s2fDeviation = ((price - s2fModelPrice) / s2fModelPrice) * 100;

  // Hash rate — fetch live from mempool.space
  let hashRate: number | null = 820; // fallback
  let hashRateChange30d: number | null = 5.0; // fallback
  try {
    const hashRes = await axios.get('https://mempool.space/api/v1/mining/hashrate/3d', { timeout: 8_000 });
    if (hashRes.data?.currentHashrate) {
      hashRate = Math.round(hashRes.data.currentHashrate / 1e18); // convert H/s to EH/s
    }
    if (hashRes.data?.hashrates && hashRes.data.hashrates.length >= 2) {
      const rates = hashRes.data.hashrates;
      const recent = rates[rates.length - 1]?.avgHashrate ?? 0;
      const older = rates[0]?.avgHashrate ?? 1;
      hashRateChange30d = older > 0 ? Math.round(((recent - older) / older) * 10000) / 100 : null;
    }
  } catch {
    // Use fallback values
  }

  // Active addresses — no free API available; labeled as estimate in UI
  const activeAddresses = 920_000; // approximate daily active addresses
  const activeAddressesChange = null; // no live data available

  const percentMined = (circulatingSupply / maxSupply) * 100;

  return {
    currentPrice: price,
    marketCap,
    realizedCap: realizedCapApprox,
    mvrvRatio,
    mvrvDeviation: mvrvRatio - 1, // how far above realized cap (not a true Z-score)
    mvrvSignal,
    s2fRatio,
    s2fModelPrice,
    s2fDeviation,
    hashRate,
    hashRateChange30d,
    activeAddresses,
    activeAddressesChange,
    circulatingSupply,
    maxSupply,
    percentMined,
    lastUpdated,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Historical Price (for charts) ────────────────────────────

export async function fetchPriceHistory(days = 90): Promise<MetricHistoryPoint[]> {
  try {
    const res = await axios.get(
      `${COINGECKO_API}/coins/bitcoin/market_chart`,
      {
        params: { vs_currency: 'usd', days, interval: days > 30 ? 'daily' : 'hourly' },
        timeout: 12_000,
      },
    );
    return (res.data.prices as [number, number][]).map(([ts, val]) => ({
      date: new Date(ts).toISOString().split('T')[0],
      value: val,
    }));
  } catch {
    return [];
  }
}

// ─── Formatters ───────────────────────────────────────────────

export function formatHashRate(eh: number): string {
  if (eh >= 1000) return (eh / 1000).toFixed(1) + ' ZH/s';
  return eh.toFixed(0) + ' EH/s';
}

export function formatMarketCap(usd: number): string {
  if (usd >= 1e12) return '$' + (usd / 1e12).toFixed(2) + 'T';
  if (usd >= 1e9) return '$' + (usd / 1e9).toFixed(1) + 'B';
  return '$' + (usd / 1e6).toFixed(0) + 'M';
}

export function formatSupply(btc: number): string {
  return (btc / 1_000_000).toFixed(2) + 'M BTC';
}

export function formatActiveAddresses(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toFixed(0);
}
