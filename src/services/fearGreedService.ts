import axios from 'axios';

export interface FGDataPoint {
  value: number;
  classification: string;
  timestamp: number;
  date: string;
}

interface FGCurrentData {
  value: number;
  classification: string;
  timestamp: number;
  date: string;
  timeUntilUpdate: string;
}

export interface FGHistoricalOutcome {
  range: string;
  label: string;
  color: string;
  count: number;
  avgReturn7d: number;
  avgReturn30d: number;
  avgReturn90d: number;
  medianReturn30d: number;
}

interface FGTrend {
  avg7d: number;
  avg30d: number;
  direction: 'improving' | 'declining' | 'stable';
  delta7d: number;
}

interface SentimentFactor {
  name: string;
  weight: number;
  description: string;
  icon: string;
}

const FNG_API = 'https://api.alternative.me/fng';

// --- Classification & Colors ---

export function getClassification(value: number): string {
  if (value <= 24) return 'Extreme Fear';
  if (value <= 44) return 'Fear';
  if (value <= 55) return 'Neutral';
  if (value <= 75) return 'Greed';
  return 'Extreme Greed';
}

export function getColor(value: number): string {
  if (value <= 24) return '#ea384c';
  if (value <= 44) return '#f59e0b';
  if (value <= 55) return '#eab308';
  if (value <= 75) return '#22c55e';
  return '#16a34a';
}

export function getColorClass(value: number): string {
  if (value <= 24) return 'text-destructive';
  if (value <= 44) return 'text-warning';
  if (value <= 55) return 'text-warning';
  if (value <= 75) return 'text-success';
  return 'text-success';
}

function getBgColorClass(value: number): string {
  if (value <= 24) return 'bg-destructive/10';
  if (value <= 44) return 'bg-warning/$3';
  if (value <= 55) return 'bg-warning/$3';
  if (value <= 75) return 'bg-success/10';
  return 'bg-success/10';
}

// --- API Fetching ---

async function fetchFearGreedIndex(limit: number = 1): Promise<FGDataPoint[]> {
  const response = await axios.get(`${FNG_API}/`, {
    params: { limit, format: 'json' },
    timeout: 10000,
  });

  const data = response.data?.data;
  if (!data || !Array.isArray(data)) {
    throw new Error('Invalid Fear & Greed Index response');
  }

  return data.map((d: any) => {
    const ts = parseInt(d.timestamp, 10) * 1000;
    return {
      value: parseInt(d.value, 10),
      classification: d.value_classification,
      timestamp: ts,
      date: new Date(ts).toISOString().split('T')[0],
    };
  });
}

export async function fetchCurrentIndex(): Promise<FGCurrentData> {
  const points = await fetchFearGreedIndex(2);
  const current = points[0];
  // Approximate next update (API updates daily ~00:00 UTC)
  const nextUpdate = new Date(current.timestamp);
  nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1);
  nextUpdate.setUTCHours(0, 0, 0, 0);
  const msUntil = Math.max(0, nextUpdate.getTime() - Date.now());
  const hoursUntil = Math.floor(msUntil / 3600000);
  const minutesUntil = Math.floor((msUntil % 3600000) / 60000);

  return {
    ...current,
    timeUntilUpdate: `${hoursUntil}h ${minutesUntil}m`,
  };
}

export async function fetchHistoricalIndex(days: number = 365): Promise<FGDataPoint[]> {
  return fetchFearGreedIndex(days);
}

// --- Trend Calculation ---

export function calculateTrend(data: FGDataPoint[]): FGTrend {
  if (data.length < 2) {
    return { avg7d: data[0]?.value ?? 50, avg30d: 50, direction: 'stable', delta7d: 0 };
  }

  const last7 = data.slice(0, Math.min(7, data.length));
  const last30 = data.slice(0, Math.min(30, data.length));

  const avg7d = last7.reduce((sum, d) => sum + d.value, 0) / last7.length;
  const avg30d = last30.reduce((sum, d) => sum + d.value, 0) / last30.length;

  const delta7d = data[0].value - (data[6]?.value ?? data[data.length - 1].value);

  let direction: 'improving' | 'declining' | 'stable' = 'stable';
  if (delta7d > 3) direction = 'improving';
  else if (delta7d < -3) direction = 'declining';

  return {
    avg7d: Math.round(avg7d * 10) / 10,
    avg30d: Math.round(avg30d * 10) / 10,
    direction,
    delta7d: Math.round(delta7d),
  };
}

// --- Historical Outcomes ---

export function calculateHistoricalOutcomes(
  fgData: FGDataPoint[],
  priceData: { date: string; price: number }[]
): FGHistoricalOutcome[] {
  // Create a date -> price map for fast lookup
  const priceMap = new Map<string, number>();
  priceData.forEach((p) => priceMap.set(p.date, p.price));

  const ranges = [
    { min: 0, max: 25, label: 'Extreme Fear', range: '0-25', color: '#ea384c' },
    { min: 26, max: 50, label: 'Fear / Neutral', range: '26-50', color: '#f59e0b' },
    { min: 51, max: 75, label: 'Greed', range: '51-75', color: '#22c55e' },
    { min: 76, max: 100, label: 'Extreme Greed', range: '76-100', color: '#16a34a' },
  ];

  return ranges.map(({ min, max, label, range, color }) => {
    const matchingDates = fgData.filter((d) => d.value >= min && d.value <= max);

    const returns7d: number[] = [];
    const returns30d: number[] = [];
    const returns90d: number[] = [];

    matchingDates.forEach((d) => {
      const basePrice = priceMap.get(d.date);
      if (!basePrice) return;

      const d7 = getDateAfter(d.date, 7);
      const d30 = getDateAfter(d.date, 30);
      const d90 = getDateAfter(d.date, 90);

      const p7 = priceMap.get(d7);
      const p30 = priceMap.get(d30);
      const p90 = priceMap.get(d90);

      if (p7) returns7d.push(((p7 - basePrice) / basePrice) * 100);
      if (p30) returns30d.push(((p30 - basePrice) / basePrice) * 100);
      if (p90) returns90d.push(((p90 - basePrice) / basePrice) * 100);
    });

    return {
      range,
      label,
      color,
      count: matchingDates.length,
      avgReturn7d: avg(returns7d),
      avgReturn30d: avg(returns30d),
      avgReturn90d: avg(returns90d),
      medianReturn30d: median(returns30d),
    };
  });
}

// --- Sentiment Factors (educational/static) ---

export const SENTIMENT_FACTORS: SentimentFactor[] = [
  {
    name: 'Volatility',
    weight: 25,
    description: 'Measures current Bitcoin volatility compared to 30-day and 90-day averages. Unusual spikes in volatility push toward fear.',
    icon: 'activity',
  },
  {
    name: 'Market Momentum',
    weight: 25,
    description: 'Compares current trading volume and price momentum against 30/90-day moving averages. High momentum = greed.',
    icon: 'trending-up',
  },
  {
    name: 'Social Media',
    weight: 15,
    description: 'Analyzes Twitter and Reddit sentiment, hashtag volume, and engagement rates for Bitcoin-related posts.',
    icon: 'message-circle',
  },
  {
    name: 'Surveys',
    weight: 15,
    description: 'Weekly community polls and surveys gauging investor confidence and market outlook (when available).',
    icon: 'bar-chart-3',
  },
  {
    name: 'Bitcoin Dominance',
    weight: 10,
    description: 'Tracks Bitcoin\'s share of total crypto market cap. Rising dominance suggests fear (flight to safety).',
    icon: 'pie-chart',
  },
  {
    name: 'Google Trends',
    weight: 10,
    description: 'Monitors search volume for Bitcoin-related terms. Spikes in "Bitcoin crash" indicate fear; "buy Bitcoin" indicates greed.',
    icon: 'search',
  },
];

// --- Helpers ---

function getDateAfter(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10;
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return Math.round(
    (sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2) * 10
  ) / 10;
}
