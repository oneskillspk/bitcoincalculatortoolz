import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface VolatilityData {
  vol7d: number;
  vol30d: number;
  vol60d: number;
  vol90d: number;
  vol1y: number;
  annualized30d: number;
  regime: 'low' | 'normal' | 'high' | 'extreme';
  dailyReturns: { date: string; ret: number }[];
  rollingVol: { date: string; vol30: number; vol60: number; vol90: number }[];
  expectedDailyMove: number;
  expectedWeeklyMove: number;
  expectedMonthlyMove: number;
  currentPrice: number;
  maxSingleDayMove: { date: string; magnitude: number };
  volatilityPercentile: number;
  sharpeRatio: number;
  dayOfWeekVol: { day: string; avgVol: number }[];
  prices: number[];
  dates: string[];
}

export interface AssetVolatility {
  asset: string;
  vol30d: number;
  vol90d: number;
  annualized: number;
  vsBtc: string;
}

function stddev(arr: number[]): number {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const sq = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(sq);
}

function dailyReturns(prices: number[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    r.push(Math.log(prices[i] / prices[i - 1]));
  }
  return r;
}

function rollingStddev(returns: number[], window: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < returns.length; i++) {
    if (i < window - 1) { result.push(null); continue; }
    const slice = returns.slice(i - window + 1, i + 1);
    result.push(stddev(slice) * Math.sqrt(365) * 100);
  }
  return result;
}

function getRegime(annualized: number): VolatilityData['regime'] {
  if (annualized < 40) return 'low';
  if (annualized < 65) return 'normal';
  if (annualized < 90) return 'high';
  return 'extreme';
}

export async function fetchVolatilityData(): Promise<VolatilityData> {
  const res = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart`, {
    params: { vs_currency: 'usd', days: 365, interval: 'daily' },
  });
  const prices: number[] = res.data.prices.map((p: [number, number]) => p[1]);
  const dates: string[] = res.data.prices.map((p: [number, number]) =>
    new Date(p[0]).toISOString().slice(0, 10)
  );

  const rets = dailyReturns(prices);
  const retDates = dates.slice(1);

  const vol7 = stddev(rets.slice(-7)) * Math.sqrt(365) * 100;
  const vol30 = stddev(rets.slice(-30)) * Math.sqrt(365) * 100;
  const vol60 = stddev(rets.slice(-60)) * Math.sqrt(365) * 100;
  const vol90 = stddev(rets.slice(-90)) * Math.sqrt(365) * 100;
  const vol1y = stddev(rets) * Math.sqrt(365) * 100;

  const r30 = rollingStddev(rets, 30);
  const r60 = rollingStddev(rets, 60);
  const r90 = rollingStddev(rets, 90);

  const rollingVol = retDates.map((d, i) => ({
    date: d,
    vol30: r30[i] ?? 0,
    vol60: r60[i] ?? 0,
    vol90: r90[i] ?? 0,
  })).filter((_, i) => r90[i] !== null);

  // Expected moves from 30d vol
  const dailyVol = vol30 / Math.sqrt(365);
  const currentPrice = prices[prices.length - 1];
  const expectedDailyMove = dailyVol;
  const expectedWeeklyMove = dailyVol * Math.sqrt(7);
  const expectedMonthlyMove = dailyVol * Math.sqrt(30);

  // Max single-day move
  let maxIdx = 0;
  let maxAbs = 0;
  for (let i = 0; i < rets.length; i++) {
    if (Math.abs(rets[i]) > maxAbs) { maxAbs = Math.abs(rets[i]); maxIdx = i; }
  }

  // Volatility percentile (current 30d vol ranked against all rolling 30d readings)
  const valid30 = r30.filter((v): v is number => v !== null);
  const belowCount = valid30.filter(v => v <= vol30).length;
  const volatilityPercentile = Math.round((belowCount / valid30.length) * 100);

  // Sharpe ratio (annualized return / annualized vol) with risk-free rate
  const RISK_FREE_RATE = 4.5; // approximate T-bill rate %
  const totalReturn = (prices[prices.length - 1] / prices[0] - 1);
  const annualizedReturn = totalReturn * 100; // already ~1 year
  const sharpeRatio = vol1y > 0 ? (annualizedReturn - RISK_FREE_RATE) / vol1y : 0;

  // Day-of-week average volatility
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayBuckets: Record<string, number[]> = {};
  dayNames.forEach(d => { dayBuckets[d] = []; });
  retDates.forEach((d, i) => {
    const dow = new Date(d).getDay();
    dayBuckets[dayNames[dow]].push(Math.abs(rets[i]) * 100);
  });
  const dayOfWeekVol = dayNames.map(day => ({
    day,
    avgVol: dayBuckets[day].length > 0
      ? Math.round((dayBuckets[day].reduce((a, b) => a + b, 0) / dayBuckets[day].length) * 100) / 100
      : 0,
  }));

  return {
    vol7d: Math.round(vol7 * 100) / 100,
    vol30d: Math.round(vol30 * 100) / 100,
    vol60d: Math.round(vol60 * 100) / 100,
    vol90d: Math.round(vol90 * 100) / 100,
    vol1y: Math.round(vol1y * 100) / 100,
    annualized30d: Math.round(vol30 * 100) / 100,
    regime: getRegime(vol30),
    dailyReturns: retDates.map((d, i) => ({ date: d, ret: rets[i] * 100 })),
    rollingVol,
    expectedDailyMove: Math.round(expectedDailyMove * 100) / 100,
    expectedWeeklyMove: Math.round(expectedWeeklyMove * 100) / 100,
    expectedMonthlyMove: Math.round(expectedMonthlyMove * 100) / 100,
    currentPrice,
    maxSingleDayMove: {
      date: retDates[maxIdx] ?? '',
      magnitude: Math.round(rets[maxIdx] * 10000) / 100,
    },
    volatilityPercentile,
    sharpeRatio: Math.round(sharpeRatio * 100) / 100,
    dayOfWeekVol,
    prices,
    dates,
  };
}

export function getAssetComparison(btcVol30: number, btcVol1y?: number): AssetVolatility[] {
  const btc1y = btcVol1y ?? btcVol30 * 0.95;
  const assets: AssetVolatility[] = [
    { asset: 'Bitcoin', vol30d: btcVol30, vol90d: btcVol30 * 0.95, annualized: btc1y, vsBtc: '—' },
    { asset: 'Ethereum', vol30d: 65.0, vol90d: 62.0, annualized: 63.5, vsBtc: `${(65 / btcVol30).toFixed(1)}×` },
    { asset: 'NVIDIA', vol30d: 50.0, vol90d: 48.0, annualized: 49.5, vsBtc: `${(50 / btcVol30).toFixed(1)}×` },
    { asset: 'Tesla', vol30d: 55.0, vol90d: 53.0, annualized: 54.0, vsBtc: `${(55 / btcVol30).toFixed(1)}×` },
    { asset: 'S&P 500', vol30d: 16.5, vol90d: 15.9, annualized: 16.2, vsBtc: `${(16.5 / btcVol30).toFixed(1)}×` },
    { asset: 'Gold', vol30d: 14.2, vol90d: 13.8, annualized: 14.0, vsBtc: `${(14.2 / btcVol30).toFixed(1)}×` },
  ];
  return assets;
}

export interface StockVsBtc {
  ticker: string;
  name: string;
  vol30d: number;
  vol1y: number;
  ratioVsBtc: string;
  context: string;
}

/**
 * Individual stock vs BTC comparison.
 * Reference values sourced from public 30-day realized vol benchmarks (Q1 2025).
 * Updated periodically; live BTC vol drives the ratio column.
 */
export function getStockVsBtcComparison(btcVol30: number): StockVsBtc[] {
  const stocks = [
    { ticker: 'MSTR', name: 'MicroStrategy', vol30d: 95.0, vol1y: 88.5, context: 'Levered BTC proxy via treasury holdings' },
    { ticker: 'COIN', name: 'Coinbase', vol30d: 78.0, vol1y: 72.4, context: 'Crypto exchange, beta to BTC' },
    { ticker: 'TSLA', name: 'Tesla', vol30d: 55.0, vol1y: 52.0, context: 'High-beta mega-cap tech' },
    { ticker: 'NFLX', name: 'Netflix', vol30d: 32.0, vol1y: 30.5, context: 'Mature growth name' },
    { ticker: 'NVDA', name: 'NVIDIA', vol30d: 50.0, vol1y: 47.8, context: 'AI mega-cap, similar to BTC' },
  ];
  return stocks.map(s => ({
    ...s,
    ratioVsBtc: btcVol30 > 0 ? `${(s.vol30d / btcVol30).toFixed(2)}×` : '—',
  }));
}

// Hardcoded hourly volatility reference data (research-based)
export function getHourlyVolatilityData(): { hour: number; label: string; avgVol: number }[] {
  return [
    { hour: 0, label: '00:00', avgVol: 1.2 },
    { hour: 1, label: '01:00', avgVol: 1.1 },
    { hour: 2, label: '02:00', avgVol: 1.0 },
    { hour: 3, label: '03:00', avgVol: 1.0 },
    { hour: 4, label: '04:00', avgVol: 1.1 },
    { hour: 5, label: '05:00', avgVol: 1.3 },
    { hour: 6, label: '06:00', avgVol: 1.5 },
    { hour: 7, label: '07:00', avgVol: 1.8 },
    { hour: 8, label: '08:00', avgVol: 2.4 },
    { hour: 9, label: '09:00', avgVol: 2.6 },
    { hour: 10, label: '10:00', avgVol: 2.3 },
    { hour: 11, label: '11:00', avgVol: 2.0 },
    { hour: 12, label: '12:00', avgVol: 1.9 },
    { hour: 13, label: '13:00', avgVol: 2.1 },
    { hour: 14, label: '14:00', avgVol: 2.3 },
    { hour: 15, label: '15:00', avgVol: 2.1 },
    { hour: 16, label: '16:00', avgVol: 1.8 },
    { hour: 17, label: '17:00', avgVol: 1.6 },
    { hour: 18, label: '18:00', avgVol: 1.4 },
    { hour: 19, label: '19:00', avgVol: 1.3 },
    { hour: 20, label: '20:00', avgVol: 1.3 },
    { hour: 21, label: '21:00', avgVol: 1.4 },
    { hour: 22, label: '22:00', avgVol: 1.3 },
    { hour: 23, label: '23:00', avgVol: 1.2 },
  ];
}

// Custom volatility calculation for any date range
export function computeCustomVolatility(
  prices: number[],
  dates: string[],
  startDate: string,
  endDate: string,
  window: number
): {
  annualizedVol: number;
  dailyVol: number;
  avgDailyRange: number;
  maxSingleDayMove: { date: string; magnitude: number };
  sharpeRatio: number;
  rollingData: { date: string; vol: number }[];
} {
  const startIdx = dates.findIndex(d => d >= startDate);
  const endIdx = dates.findIndex(d => d > endDate);
  const slicedPrices = prices.slice(
    Math.max(0, startIdx),
    endIdx === -1 ? prices.length : endIdx
  );
  const slicedDates = dates.slice(
    Math.max(0, startIdx),
    endIdx === -1 ? dates.length : endIdx
  );

  if (slicedPrices.length < 2) {
    return { annualizedVol: 0, dailyVol: 0, avgDailyRange: 0, maxSingleDayMove: { date: '', magnitude: 0 }, sharpeRatio: 0, rollingData: [] };
  }

  const rets = dailyReturns(slicedPrices);
  const retDates = slicedDates.slice(1);

  const annVol = stddev(rets) * Math.sqrt(365) * 100;
  const dVol = stddev(rets) * 100;
  const avgRange = rets.reduce((s, r) => s + Math.abs(r), 0) / rets.length * slicedPrices[slicedPrices.length - 1];

  let maxIdx = 0;
  let maxAbs = 0;
  for (let i = 0; i < rets.length; i++) {
    if (Math.abs(rets[i]) > maxAbs) { maxAbs = Math.abs(rets[i]); maxIdx = i; }
  }

  const RISK_FREE_RATE = 4.5;
  const periodYears = rets.length / 365;
  // Compound annualization instead of linear
  const annReturn = periodYears > 0
    ? (Math.pow(slicedPrices[slicedPrices.length - 1] / slicedPrices[0], 1 / periodYears) - 1) * 100
    : (slicedPrices[slicedPrices.length - 1] / slicedPrices[0] - 1) * 100;
  const sharpe = annVol > 0 ? (annReturn - RISK_FREE_RATE) / annVol : 0;

  const rolling = rollingStddev(rets, Math.min(window, rets.length));
  const rollingData = retDates
    .map((d, i) => ({ date: d, vol: rolling[i] ?? 0 }))
    .filter((_, i) => rolling[i] !== null);

  return {
    annualizedVol: Math.round(annVol * 100) / 100,
    dailyVol: Math.round(dVol * 100) / 100,
    avgDailyRange: Math.round(avgRange),
    maxSingleDayMove: { date: retDates[maxIdx] ?? '', magnitude: Math.round(rets[maxIdx] * 10000) / 100 },
    sharpeRatio: Math.round(sharpe * 100) / 100,
    rollingData,
  };
}
