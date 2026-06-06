import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface DominanceData {
  btcDominance: number;
  btcMarketCap: number;
  totalMarketCap: number;
  btcPrice: number;
  circulatingSupply: number;
}

export interface DominanceScenario {
  totalMarketCap: number;
  dominance: number;
  impliedBtcPrice: number;
}

export async function fetchDominanceData(): Promise<DominanceData> {
  const [globalRes, btcRes] = await Promise.all([
    axios.get(`${COINGECKO_API}/global`),
    axios.get(`${COINGECKO_API}/simple/price`, {
      params: { ids: 'bitcoin', vs_currencies: 'usd', include_market_cap: true },
    }),
  ]);

  const g = globalRes.data.data;
  const btcMcap = btcRes.data.bitcoin.usd_market_cap;
  const btcPrice = btcRes.data.bitcoin.usd;
  const totalMcap = g.total_market_cap?.usd ?? btcMcap / (g.market_cap_percentage?.btc / 100);

  return {
    btcDominance: Math.round((g.market_cap_percentage?.btc ?? 50) * 100) / 100,
    btcMarketCap: btcMcap,
    totalMarketCap: totalMcap,
    btcPrice,
    circulatingSupply: btcMcap / btcPrice,
  };
}

export function calculateScenario(
  totalMarketCapTrillions: number,
  dominancePercent: number,
  circulatingSupply: number
): DominanceScenario {
  const totalMcap = totalMarketCapTrillions * 1e12;
  const btcMcap = totalMcap * (dominancePercent / 100);
  return {
    totalMarketCap: totalMcap,
    dominance: dominancePercent,
    impliedBtcPrice: btcMcap / circulatingSupply,
  };
}

// Historical dominance approximation (quarterly data)
export const historicalDominance = [
  { date: '2020-01', dominance: 68.3 },
  { date: '2020-07', dominance: 62.5 },
  { date: '2021-01', dominance: 70.1 },
  { date: '2021-07', dominance: 45.3 },
  { date: '2022-01', dominance: 39.8 },
  { date: '2022-07', dominance: 42.1 },
  { date: '2023-01', dominance: 40.5 },
  { date: '2023-07', dominance: 49.2 },
  { date: '2024-01', dominance: 52.4 },
  { date: '2024-07', dominance: 56.1 },
  { date: '2025-01', dominance: 58.7 },
  { date: '2025-07', dominance: 61.2 },
  { date: '2026-01', dominance: 61.5 },
];
