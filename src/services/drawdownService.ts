import axios from 'axios';

export interface DrawdownPeriod {
  rank: number;
  peakDate: string;
  troughDate: string;
  peakPrice: number;
  troughPrice: number;
  drawdownPercent: number;
  recoveryDate: string | null;
  recoveryDays: number | null;
  daysToTrough: number;
}

export interface DrawdownSummary {
  currentPrice: number;
  athPrice: number;
  athDate: string;
  currentDrawdown: number;
  maxDrawdown: number;
  avgDrawdown: number;
  totalCrashes: number;
  avgRecoveryDays: number;
  asOf: string;
  dataSource: 'coingecko' | 'cryptocompare' | 'local';
}

export interface ATHScenario {
  athDate: string;
  athPrice: number;
  investment: number;
  btcBought: number;
  currentValue: number;
  lossPercent: number;
  profitUsd: number;
}

interface PricePoint {
  date: string;
  price: number;
}

async function fetchPricesFromLocal(): Promise<PricePoint[]> {
  const res = await axios.get('/data/bitcoin_prices_v1.json');
  const data = res.data.data as Record<string, { date: string; price: number }[]>;
  const prices: PricePoint[] = [];
  for (const year of Object.keys(data).sort()) {
    for (const entry of data[year]) {
      prices.push({ date: entry.date, price: entry.price });
    }
  }
  return prices;
}

async function fetchPricesFromCoinGecko(): Promise<PricePoint[]> {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
    { params: { vs_currency: 'usd', days: 'max', interval: 'daily' }, timeout: 10000 }
  );
  return res.data.prices.map(([ts, price]: [number, number]) => ({
    date: new Date(ts).toISOString().split('T')[0],
    price,
  }));
}

async function fetchPricesFromCryptoCompare(): Promise<PricePoint[]> {
  // CryptoCompare allows 2000 daily points per call; we paginate back to 2010.
  const all: PricePoint[] = [];
  let toTs = Math.floor(Date.now() / 1000);
  const earliest = Math.floor(new Date('2010-07-17').getTime() / 1000);
  for (let i = 0; i < 4 && toTs > earliest; i++) {
    const res = await axios.get('https://min-api.cryptocompare.com/data/v2/histoday', {
      params: { fsym: 'BTC', tsym: 'USD', limit: 2000, toTs },
      timeout: 12000,
    });
    const pts = (res.data?.Data?.Data ?? []) as Array<{ time: number; high: number; close: number }>;
    if (!pts.length) break;
    let minTs = toTs;
    for (const p of pts) {
      if (!p.high && !p.close) continue;
      const date = new Date(p.time * 1000).toISOString().split('T')[0];
      all.push({ date, price: p.high || p.close });
      if (p.time < minTs) minTs = p.time;
    }
    toTs = minTs - 86400;
  }
  // Dedup + sort ascending
  const seen = new Map<string, number>();
  for (const p of all) if (!seen.has(p.date)) seen.set(p.date, p.price);
  return Array.from(seen.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeDrawdowns(
  prices: PricePoint[],
  dataSource: DrawdownSummary['dataSource']
): { periods: DrawdownPeriod[]; summary: DrawdownSummary } {
  if (!prices.length) {
    throw new Error('computeDrawdowns: empty price series');
  }
  const periods: DrawdownPeriod[] = [];
  let peak = prices[0].price;
  let peakDate = prices[0].date;
  let trough = peak;
  let troughDate = peakDate;
  let troughIdx = 0;
  let inDrawdown = false;

  for (let i = 1; i < prices.length; i++) {
    const { price, date } = prices[i];

    if (price > peak) {
      if (inDrawdown) {
        const drawdownPercent = ((peak - trough) / peak) * 100;
        if (drawdownPercent >= 20) {
          let recoveryDate: string | null = null;
          let recoveryDays: number | null = null;
          for (let j = troughIdx + 1; j < prices.length; j++) {
            if (prices[j].price >= peak) {
              recoveryDate = prices[j].date;
              recoveryDays = Math.round((new Date(prices[j].date).getTime() - new Date(troughDate).getTime()) / 86400000);
              break;
            }
          }
          periods.push({
            rank: 0, peakDate, troughDate, peakPrice: peak, troughPrice: trough,
            drawdownPercent, recoveryDate, recoveryDays,
            daysToTrough: Math.round((new Date(troughDate).getTime() - new Date(peakDate).getTime()) / 86400000),
          });
        }
        inDrawdown = false;
      }
      peak = price;
      peakDate = date;
      trough = price;
      troughDate = date;
      troughIdx = i;
    } else {
      if (price < trough) {
        trough = price;
        troughDate = date;
        troughIdx = i;
      }
      if (!inDrawdown && ((peak - price) / peak) >= 0.20) {
        inDrawdown = true;
      }
    }
  }

  // Handle ongoing drawdown
  if (inDrawdown) {
    const drawdownPercent = ((peak - trough) / peak) * 100;
    if (drawdownPercent >= 20) {
      periods.push({
        rank: 0, peakDate, troughDate, peakPrice: peak, troughPrice: trough,
        drawdownPercent, recoveryDate: null, recoveryDays: null,
        daysToTrough: Math.round((new Date(troughDate).getTime() - new Date(peakDate).getTime()) / 86400000),
      });
    }
  }

  periods.sort((a, b) => b.drawdownPercent - a.drawdownPercent);
  periods.forEach((p, i) => (p.rank = i + 1));

  const currentPrice = prices[prices.length - 1].price;
  let athPrice = 0;
  let athDate = '';
  for (const p of prices) {
    if (p.price > athPrice) { athPrice = p.price; athDate = p.date; }
  }

  const currentDrawdown = ((athPrice - currentPrice) / athPrice) * 100;
  const allDrawdowns = periods.map((p) => p.drawdownPercent);
  const avgDrawdown = allDrawdowns.length > 0 ? allDrawdowns.reduce((s, d) => s + d, 0) / allDrawdowns.length : 0;
  const recoveredPeriods = periods.filter((p) => p.recoveryDays !== null);
  const avgRecoveryDays = recoveredPeriods.length > 0 ? recoveredPeriods.reduce((s, p) => s + (p.recoveryDays || 0), 0) / recoveredPeriods.length : 0;

  const asOf = prices[prices.length - 1]?.date ?? new Date().toISOString().split('T')[0];

  return {
    periods: periods.slice(0, 10),
    summary: {
      currentPrice, athPrice, athDate, currentDrawdown,
      maxDrawdown: allDrawdowns[0] || 0, avgDrawdown,
      totalCrashes: periods.length, avgRecoveryDays: Math.round(avgRecoveryDays),
      asOf, dataSource,
    },
  };
}

export async function fetchDrawdownData(): Promise<{ periods: DrawdownPeriod[]; summary: DrawdownSummary }> {
  // CoinGecko first → CryptoCompare → bundled local snapshot.
  try {
    const prices = await fetchPricesFromCoinGecko();
    return computeDrawdowns(prices, 'coingecko');
  } catch (err) {
    console.warn('CoinGecko unavailable, trying CryptoCompare:', err);
  }
  try {
    const prices = await fetchPricesFromCryptoCompare();
    if (prices.length > 100) return computeDrawdowns(prices, 'cryptocompare');
  } catch (err) {
    console.warn('CryptoCompare unavailable, using local snapshot:', err);
  }
  const prices = await fetchPricesFromLocal();
  return computeDrawdowns(prices, 'local');
}

export function calculateATHScenario(athPrice: number, athDate: string, currentPrice: number, investment: number): ATHScenario {
  const btcBought = investment / athPrice;
  const currentValue = btcBought * currentPrice;
  const lossPercent = ((currentValue - investment) / investment) * 100;
  return { athDate, athPrice, investment, btcBought, currentValue, lossPercent, profitUsd: currentValue - investment };
}
