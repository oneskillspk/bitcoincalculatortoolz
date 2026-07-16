import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Consolidated live-metric hook for the homepage hero card.
 *
 * Sources:
 *  • CoinGecko `/coins/markets` (via project price-proxy edge fn) — marketCap,
 *    total volume (24h), and a 7-day sparkline (hourly points).
 *  • mempool.space public API — network hashrate and current difficulty.
 *
 * Both endpoints support CORS in the browser. mempool.space is called
 * directly (no key, no proxy needed). CoinGecko is routed through the
 * existing price-proxy edge function.
 */

const PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/price-proxy`;
const PROXY_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
};

export interface HeroMarketMetrics {
  marketCap: number | null;
  volume24h: number | null;
  sparkline: number[];
  hashRateEHs: number | null; // exahashes per second
  difficulty: number | null; // raw difficulty
  isLoading: boolean;
}

async function fetchCoinGeckoMarket() {
  const res = await axios.get(PROXY_BASE, {
    params: {
      path: '/coins/markets',
      vs_currency: 'usd',
      ids: 'bitcoin',
      sparkline: true,
      price_change_percentage: '24h',
    },
    timeout: 8000,
    headers: PROXY_HEADERS,
  });
  const row = Array.isArray(res.data) ? res.data[0] : null;
  if (!row) throw new Error('CoinGecko: empty market row');
  return {
    marketCap: typeof row.market_cap === 'number' ? row.market_cap : null,
    volume24h: typeof row.total_volume === 'number' ? row.total_volume : null,
    sparkline: Array.isArray(row.sparkline_in_7d?.price)
      ? (row.sparkline_in_7d.price as number[])
      : [],
  };
}

async function fetchMempoolNetwork() {
  // Hashrate: 3-day rolling. Value returned as H/s (very large integer).
  const [hashRes, diffRes] = await Promise.all([
    axios.get('https://mempool.space/api/v1/mining/hashrate/3d', { timeout: 8000 }),
    axios.get('https://mempool.space/api/v1/difficulty-adjustment', { timeout: 8000 }),
  ]);
  const currentHashrate =
    typeof hashRes.data?.currentHashrate === 'number' ? hashRes.data.currentHashrate : null;
  const currentDifficulty =
    typeof hashRes.data?.currentDifficulty === 'number'
      ? hashRes.data.currentDifficulty
      : typeof diffRes.data?.difficulty === 'number'
      ? diffRes.data.difficulty
      : null;
  return {
    hashRateEHs: currentHashrate !== null ? currentHashrate / 1e18 : null,
    difficulty: currentDifficulty,
  };
}

export function useHeroMarketMetrics(): HeroMarketMetrics {
  const market = useQuery({
    queryKey: ['hero-market-metrics', 'coingecko'],
    queryFn: fetchCoinGeckoMarket,
    refetchInterval: 60_000,
    staleTime: 45_000,
    retry: 2,
  });

  const network = useQuery({
    queryKey: ['hero-market-metrics', 'mempool'],
    queryFn: fetchMempoolNetwork,
    refetchInterval: 5 * 60_000, // hashrate/difficulty barely move on this scale
    staleTime: 4 * 60_000,
    retry: 2,
  });

  return {
    marketCap: market.data?.marketCap ?? null,
    volume24h: market.data?.volume24h ?? null,
    sparkline: market.data?.sparkline ?? [],
    hashRateEHs: network.data?.hashRateEHs ?? null,
    difficulty: network.data?.difficulty ?? null,
    isLoading: market.isLoading || network.isLoading,
  };
}
