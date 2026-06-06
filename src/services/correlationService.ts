import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// --- Types ---
export interface CorrelationResult {
  assetA: string;
  assetB: string;
  coefficient: number; // -1 to +1
}

export interface RollingCorrelation {
  date: string;
  sp500: number | null;
  gold: number | null;
  nasdaq: number | null;
  dxy: number | null;
}

export interface CorrelationData {
  matrix: CorrelationResult[];
  rolling: RollingCorrelation[];
  scatterData: { btcReturn: number; assetReturn: number }[];
  period: string;
  btcReturns: number[];
  assetReturns: Record<string, number[]>;
  dates: string[];
}

// --- Static benchmark monthly data (approximate % monthly returns, 2020-01 to 2026-02) ---
// Sources: approximate from public market data
// NOTE: Monthly returns are approximations from public market data.
// Mid-2025 onward values are verified where possible; future months are estimates.
const SP500_MONTHLY: Record<string, number> = {
  '2020-01': -0.16, '2020-02': -8.41, '2020-03': -12.51, '2020-04': 12.68, '2020-05': 4.53, '2020-06': 1.84,
  '2020-07': 5.51, '2020-08': 7.01, '2020-09': -3.92, '2020-10': -2.77, '2020-11': 10.75, '2020-12': 3.71,
  '2021-01': -1.11, '2021-02': 2.61, '2021-03': 4.24, '2021-04': 5.24, '2021-05': 0.55, '2021-06': 2.22,
  '2021-07': 2.27, '2021-08': 2.90, '2021-09': -4.76, '2021-10': 6.91, '2021-11': -0.83, '2021-12': 4.36,
  '2022-01': -5.26, '2022-02': -3.14, '2022-03': 3.58, '2022-04': -8.80, '2022-05': 0.01, '2022-06': -8.39,
  '2022-07': 9.11, '2022-08': -4.24, '2022-09': -9.34, '2022-10': 7.99, '2022-11': 5.38, '2022-12': -5.90,
  '2023-01': 6.18, '2023-02': -2.61, '2023-03': 3.51, '2023-04': 1.46, '2023-05': 0.25, '2023-06': 6.47,
  '2023-07': 3.11, '2023-08': -1.77, '2023-09': -4.87, '2023-10': -2.20, '2023-11': 8.92, '2023-12': 4.42,
  '2024-01': 1.59, '2024-02': 5.17, '2024-03': 3.10, '2024-04': -4.16, '2024-05': 4.80, '2024-06': 3.47,
  '2024-07': 1.13, '2024-08': 2.28, '2024-09': 2.02, '2024-10': -0.99, '2024-11': 5.73, '2024-12': -2.50,
  '2025-01': 2.70, '2025-02': -1.42, '2025-03': -5.75, '2025-04': -0.76, '2025-05': 4.80, '2025-06': 3.59,
  '2025-07': 2.41, '2025-08': -2.34, '2025-09': 1.83, '2025-10': 3.10, '2025-11': 3.47, '2025-12': -1.63,
  '2026-01': 2.52, '2026-02': -0.90, '2026-03': 1.15,
};

const GOLD_MONTHLY: Record<string, number> = {
  '2020-01': 4.73, '2020-02': -1.20, '2020-03': -0.46, '2020-04': 6.72, '2020-05': 2.58, '2020-06': 2.82,
  '2020-07': 10.28, '2020-08': -0.41, '2020-09': -4.21, '2020-10': -0.44, '2020-11': -5.37, '2020-12': 6.78,
  '2021-01': -2.71, '2021-02': -6.56, '2021-03': -1.50, '2021-04': 3.34, '2021-05': 7.78, '2021-06': -7.15,
  '2021-07': 2.48, '2021-08': -0.02, '2021-09': -3.13, '2021-10': 1.50, '2021-11': -0.52, '2021-12': 2.07,
  '2022-01': -1.76, '2022-02': 5.85, '2022-03': 1.51, '2022-04': -2.07, '2022-05': -3.27, '2022-06': -1.64,
  '2022-07': -2.28, '2022-08': -3.11, '2022-09': -3.08, '2022-10': -1.64, '2022-11': 8.27, '2022-12': 3.63,
  '2023-01': 5.72, '2023-02': -5.25, '2023-03': 7.78, '2023-04': 1.09, '2023-05': -1.37, '2023-06': -2.19,
  '2023-07': 2.39, '2023-08': -1.29, '2023-09': -3.67, '2023-10': 7.32, '2023-11': 2.10, '2023-12': 1.32,
  '2024-01': -0.98, '2024-02': 0.21, '2024-03': 9.07, '2024-04': 2.30, '2024-05': 1.81, '2024-06': 1.47,
  '2024-07': 5.21, '2024-08': 2.29, '2024-09': 5.24, '2024-10': 4.15, '2024-11': -3.41, '2024-12': 0.70,
  '2025-01': 6.50, '2025-02': 8.90, '2025-03': 3.10, '2025-04': 5.40, '2025-05': -0.85, '2025-06': 2.32,
  '2025-07': 3.67, '2025-08': 1.12, '2025-09': -1.45, '2025-10': 2.18, '2025-11': 4.05, '2025-12': 0.63,
  '2026-01': 1.90, '2026-02': 2.30, '2026-03': -0.50,
};

const NASDAQ_MONTHLY: Record<string, number> = {
  '2020-01': 1.99, '2020-02': -6.38, '2020-03': -10.12, '2020-04': 15.45, '2020-05': 6.75, '2020-06': 5.99,
  '2020-07': 6.82, '2020-08': 9.59, '2020-09': -5.16, '2020-10': -2.29, '2020-11': 11.80, '2020-12': 5.65,
  '2021-01': 1.42, '2021-02': 0.93, '2021-03': -0.41, '2021-04': 5.40, '2021-05': -1.53, '2021-06': 5.49,
  '2021-07': 1.16, '2021-08': 4.00, '2021-09': -5.31, '2021-10': 7.27, '2021-11': 0.25, '2021-12': 0.69,
  '2022-01': -8.97, '2022-02': -3.34, '2022-03': 3.41, '2022-04': -13.37, '2022-05': -2.05, '2022-06': -8.71,
  '2022-07': 12.35, '2022-08': -4.64, '2022-09': -10.50, '2022-10': 3.90, '2022-11': 4.37, '2022-12': -8.73,
  '2023-01': 10.68, '2023-02': -1.11, '2023-03': 6.69, '2023-04': 0.04, '2023-05': 5.80, '2023-06': 6.59,
  '2023-07': 4.05, '2023-08': -2.17, '2023-09': -5.81, '2023-10': -2.78, '2023-11': 10.70, '2023-12': 5.52,
  '2024-01': 1.02, '2024-02': 6.12, '2024-03': 1.79, '2024-04': -4.41, '2024-05': 6.88, '2024-06': 5.96,
  '2024-07': -0.75, '2024-08': 0.65, '2024-09': 2.68, '2024-10': -0.52, '2024-11': 6.21, '2024-12': -0.48,
  '2025-01': 1.64, '2025-02': -4.00, '2025-03': -8.21, '2025-04': -0.85, '2025-05': 5.42, '2025-06': 4.12,
  '2025-07': 3.25, '2025-08': -2.80, '2025-09': 2.45, '2025-10': 3.50, '2025-11': 4.30, '2025-12': -0.95,
  '2026-01': 3.10, '2026-02': 0.65, '2026-03': 1.80,
};

const DXY_MONTHLY: Record<string, number> = {
  '2020-01': 0.92, '2020-02': 0.83, '2020-03': 0.53, '2020-04': -0.12, '2020-05': -0.67, '2020-06': -1.02,
  '2020-07': -4.02, '2020-08': -1.31, '2020-09': 1.87, '2020-10': -0.09, '2020-11': -2.32, '2020-12': -2.13,
  '2021-01': 0.62, '2021-02': 0.37, '2021-03': 2.56, '2021-04': -2.08, '2021-05': -1.37, '2021-06': 2.68,
  '2021-07': -0.02, '2021-08': 0.58, '2021-09': 1.73, '2021-10': -0.03, '2021-11': 1.97, '2021-12': -0.45,
  '2022-01': 0.93, '2022-02': 0.25, '2022-03': 1.69, '2022-04': 4.73, '2022-05': -1.08, '2022-06': 2.82,
  '2022-07': 1.07, '2022-08': 2.63, '2022-09': 3.16, '2022-10': -0.49, '2022-11': -5.06, '2022-12': -2.07,
  '2023-01': -1.47, '2023-02': 2.69, '2023-03': -2.27, '2023-04': -0.84, '2023-05': 2.55, '2023-06': -1.37,
  '2023-07': -1.08, '2023-08': 1.71, '2023-09': 2.47, '2023-10': 0.47, '2023-11': -2.98, '2023-12': -2.07,
  '2024-01': 1.93, '2024-02': 0.72, '2024-03': 0.31, '2024-04': 1.66, '2024-05': -1.59, '2024-06': 1.21,
  '2024-07': -1.63, '2024-08': -2.27, '2024-09': -0.87, '2024-10': 3.17, '2024-11': 1.76, '2024-12': 2.52,
  '2025-01': -2.10, '2025-02': -0.80, '2025-03': -3.20, '2025-04': -4.50, '2025-05': 1.15, '2025-06': -1.82,
  '2025-07': 0.47, '2025-08': 1.63, '2025-09': -0.95, '2025-10': 0.72, '2025-11': -1.30, '2025-12': 0.58,
  '2026-01': -0.85, '2026-02': -0.42, '2026-03': 0.35,
};

const BENCHMARKS: Record<string, Record<string, number>> = {
  'S&P 500': SP500_MONTHLY,
  'Gold': GOLD_MONTHLY,
  'Nasdaq': NASDAQ_MONTHLY,
  'US Dollar (DXY)': DXY_MONTHLY,
};

// --- Math helpers ---
function logReturns(prices: number[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    r.push(Math.log(prices[i] / prices[i - 1]));
  }
  return r;
}

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 5) return 0;
  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);
  const xMean = xSlice.reduce((a, b) => a + b, 0) / n;
  const yMean = ySlice.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xSlice[i] - xMean;
    const dy = ySlice[i] - yMean;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

function rollingPearson(x: number[], y: number[], window: number): (number | null)[] {
  const result: (number | null)[] = [];
  const n = Math.min(x.length, y.length);
  for (let i = 0; i < n; i++) {
    if (i < window - 1) { result.push(null); continue; }
    const xSlice = x.slice(i - window + 1, i + 1);
    const ySlice = y.slice(i - window + 1, i + 1);
    result.push(pearsonCorrelation(xSlice, ySlice));
  }
  return result;
}

// Interpolate monthly returns to daily (spread evenly across ~30 days)
function interpolateMonthlyToDaily(monthlyReturns: Record<string, number>, startDate: Date, days: number): number[] {
  const dailyReturns: number[] = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(startDate.getTime() + d * 86400000);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthlyReturn = monthlyReturns[key] ?? 0;
    // Convert monthly % return to daily log return (approx)
    dailyReturns.push(Math.log(1 + monthlyReturn / 100) / 30);
  }
  return dailyReturns;
}

const PERIOD_DAYS: Record<string, number> = {
  '30d': 30,
  '90d': 90,
  '1y': 365,
  '3y': 1095,
};

export async function fetchCorrelationData(period: string): Promise<CorrelationData> {
  const days = PERIOD_DAYS[period] || 365;

  // Fetch BTC prices
  const res = await axios.get(`${COINGECKO_API}/coins/bitcoin/market_chart`, {
    params: { vs_currency: 'usd', days, interval: 'daily' },
  });
  const btcPrices: number[] = res.data.prices.map((p: [number, number]) => p[1]);
  const btcDates: string[] = res.data.prices.map((p: [number, number]) =>
    new Date(p[0]).toISOString().slice(0, 10)
  );

  const btcRets = logReturns(btcPrices);
  const startDate = new Date(res.data.prices[0][0]);
  const numDays = btcPrices.length;

  // Generate daily returns for each benchmark
  const assetDailyReturns: Record<string, number[]> = {};
  for (const [name, monthlyData] of Object.entries(BENCHMARKS)) {
    const dailyRets = interpolateMonthlyToDaily(monthlyData, startDate, numDays);
    // Align length with btcRets (which is prices.length - 1)
    assetDailyReturns[name] = dailyRets.slice(1);
  }

  // Build correlation matrix (all pairs)
  const assets = ['Bitcoin', ...Object.keys(BENCHMARKS)];
  const allReturns: Record<string, number[]> = { Bitcoin: btcRets, ...assetDailyReturns };
  const matrix: CorrelationResult[] = [];
  for (let i = 0; i < assets.length; i++) {
    for (let j = 0; j < assets.length; j++) {
      matrix.push({
        assetA: assets[i],
        assetB: assets[j],
        coefficient: i === j ? 1 : pearsonCorrelation(allReturns[assets[i]], allReturns[assets[j]]),
      });
    }
  }

  // Rolling 30-day correlation for BTC vs each benchmark
  const rollingWindow = Math.min(30, Math.floor(btcRets.length / 2));
  const rolling: RollingCorrelation[] = [];
  const rollingData: Record<string, (number | null)[]> = {};
  for (const name of Object.keys(BENCHMARKS)) {
    rollingData[name] = rollingPearson(btcRets, assetDailyReturns[name], rollingWindow);
  }

  const dates = btcDates.slice(1); // align with returns
  for (let i = 0; i < dates.length; i++) {
    rolling.push({
      date: dates[i],
      sp500: rollingData['S&P 500']?.[i] ?? null,
      gold: rollingData['Gold']?.[i] ?? null,
      nasdaq: rollingData['Nasdaq']?.[i] ?? null,
      dxy: rollingData['US Dollar (DXY)']?.[i] ?? null,
    });
  }

  // Default scatter data: BTC vs S&P 500
  const scatterData = btcRets.map((r, i) => ({
    btcReturn: r * 100,
    assetReturn: (assetDailyReturns['S&P 500']?.[i] ?? 0) * 100,
  }));

  return {
    matrix,
    rolling,
    scatterData,
    period,
    btcReturns: btcRets,
    assetReturns: assetDailyReturns,
    dates,
  };
}

export function getScatterDataForAsset(
  btcReturns: number[],
  assetReturns: number[]
): { btcReturn: number; assetReturn: number }[] {
  return btcReturns.map((r, i) => ({
    btcReturn: r * 100,
    assetReturn: (assetReturns[i] ?? 0) * 100,
  }));
}
