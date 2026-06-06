import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface TimeMachineResult {
  date: string;
  priceOnDate: number;
  currentPrice: number;
  investment: number;
  currentValue: number;
  profit: number;
  roi: number;
  btcAmount: number;
}

export interface PresetDate {
  label: string;
  labelTr?: string;
  date: string;
  description: string;
  descriptionTr?: string;
  emoji: string;
}

export const PRESET_DATES: PresetDate[] = [
  { label: 'Pizza Day', labelTr: 'Pizza Günü', date: '2010-05-22', description: '10,000 BTC for 2 pizzas', descriptionTr: '2 pizza için 10.000 BTC', emoji: '🍕' },
  { label: 'First $1', labelTr: 'İlk 1 $', date: '2011-02-09', description: 'Bitcoin hits $1 for the first time', descriptionTr: "Bitcoin ilk kez 1 $'a ulaştı", emoji: '💵' },
  { label: 'First $100', labelTr: 'İlk 100 $', date: '2013-04-01', description: 'Bitcoin crosses $100', descriptionTr: "Bitcoin 100 $'ı geçti", emoji: '📈' },
  { label: 'First $1,000', labelTr: 'İlk 1.000 $', date: '2013-11-28', description: 'Bitcoin reaches $1,000', descriptionTr: "Bitcoin 1.000 $'a ulaştı", emoji: '🚀' },
  { label: 'Mt. Gox Crash', labelTr: 'Mt. Gox Çöküşü', date: '2014-02-07', description: 'Mt. Gox exchange collapse', descriptionTr: 'Mt. Gox borsasının çöküşü', emoji: '💥' },
  { label: 'Halving #2', labelTr: 'Halving #2', date: '2016-07-09', description: 'Block reward drops to 12.5 BTC', descriptionTr: 'Blok ödülü 12,5 BTC’ye düştü', emoji: '⛏️' },
  { label: '2017 Bull Peak', labelTr: '2017 Boğa Zirvesi', date: '2017-12-17', description: 'Bitcoin ATH near $20,000', descriptionTr: "Bitcoin ATH ~20.000 $", emoji: '🏔️' },
  { label: 'COVID Crash', labelTr: 'COVID Çöküşü', date: '2020-03-12', description: 'Black Thursday — BTC drops 50%', descriptionTr: "Kara Perşembe — BTC %50 düştü", emoji: '🦠' },
  { label: 'Halving #3', labelTr: 'Halving #3', date: '2020-05-11', description: 'Block reward drops to 6.25 BTC', descriptionTr: 'Blok ödülü 6,25 BTC’ye düştü', emoji: '⛏️' },
  { label: '2021 ATH', labelTr: '2021 ATH', date: '2021-11-10', description: 'Bitcoin ATH near $69,000', descriptionTr: "Bitcoin ATH ~69.000 $", emoji: '🎯' },
  { label: 'FTX Crash', labelTr: 'FTX Çöküşü', date: '2022-11-09', description: 'FTX collapse shakes crypto', descriptionTr: 'FTX çöküşü kripto piyasasını sarstı', emoji: '🏚️' },
  { label: 'Halving #4', labelTr: 'Halving #4', date: '2024-04-19', description: 'Block reward drops to 3.125 BTC', descriptionTr: 'Blok ödülü 3,125 BTC’ye düştü', emoji: '⛏️' },
  { label: 'Spot ETF Launch', labelTr: 'Spot ETF Lansmanı', date: '2024-01-11', description: 'First US spot Bitcoin ETFs approved', descriptionTr: 'İlk ABD spot Bitcoin ETF’leri onaylandı', emoji: '🏛️' },
];

// Local price data cache
let localPriceCache: { date: string; price: number }[] | null = null;

async function getLocalPrices(): Promise<{ date: string; price: number }[]> {
  if (localPriceCache) return localPriceCache;
  const res = await axios.get('/data/bitcoin_prices_v1.json');
  const data = res.data.data as Record<string, { date: string; price: number }[]>;
  const prices: { date: string; price: number }[] = [];
  for (const year of Object.keys(data).sort()) {
    for (const entry of data[year]) {
      prices.push({ date: entry.date, price: entry.price });
    }
  }
  localPriceCache = prices;
  return prices;
}

function interpolatePrice(prices: { date: string; price: number }[], targetDate: string): number {
  const target = new Date(targetDate).getTime();
  // Find surrounding data points
  let before = prices[0];
  let after = prices[prices.length - 1];
  for (let i = 0; i < prices.length; i++) {
    const d = new Date(prices[i].date).getTime();
    if (d <= target) before = prices[i];
    if (d >= target) { after = prices[i]; break; }
  }
  if (before.date === after.date) return before.price;
  const beforeTime = new Date(before.date).getTime();
  const afterTime = new Date(after.date).getTime();
  const ratio = (target - beforeTime) / (afterTime - beforeTime);
  return before.price + (after.price - before.price) * ratio;
}

export async function fetchHistoricalPrice(dateStr: string): Promise<number> {
  try {
    const [y, m, d] = dateStr.split('-');
    const formatted = `${d}-${m}-${y}`;
    const res = await axios.get(`${COINGECKO_API}/coins/bitcoin/history`, {
      params: { date: formatted, localization: false },
    });
    return res.data.market_data?.current_price?.usd ?? 0;
  } catch (err) {
    console.warn('CoinGecko unavailable, using local price data:', err);
    const prices = await getLocalPrices();
    return interpolatePrice(prices, dateStr);
  }
}

export async function fetchCurrentPrice(): Promise<number> {
  try {
    const res = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: { ids: 'bitcoin', vs_currencies: 'usd' },
    });
    return res.data.bitcoin.usd;
  } catch (err) {
    console.warn('CoinGecko unavailable, using local price data:', err);
    const prices = await getLocalPrices();
    return prices[prices.length - 1].price;
  }
}

export function calculateTimeMachine(
  priceOnDate: number,
  currentPrice: number,
  investment: number
): TimeMachineResult {
  const btcAmount = investment / priceOnDate;
  const currentValue = btcAmount * currentPrice;
  const profit = currentValue - investment;
  const roi = ((currentValue - investment) / investment) * 100;

  return {
    date: '',
    priceOnDate,
    currentPrice,
    investment,
    currentValue,
    profit,
    roi,
    btcAmount,
  };
}
