/**
 * Bitcoin Pizza Day Calculator Service
 * Calculates opportunity cost and the famous 10,000 BTC pizza transaction value
 */

export interface OpportunityCostInput {
  amountSpent: number;
  purchaseDate: Date;
  itemName?: string;
  currentBtcPrice: number;
  historicalBtcPrice: number;
}

export interface OpportunityCostResult {
  amountSpent: number;
  btcCouldHaveBought: number;
  currentValue: number;
  profitMissed: number;
  multiplier: number;
  itemName: string;
}

export interface PizzaHeroData {
  originalBtcSpent: number;
  originalUsdValue: number;
  currentValue: number;
  costPerPizza: number;
  multiplier: number;
  pizzaDate: string;
}

export interface PizzaIndexPoint {
  year: number;
  price: number;
  pizzasPerBtc: number;
}

const PIZZA_PRICE_USD = 20; // Average pizza price

// Historical BTC prices (yearly averages for Pizza Index chart)
const HISTORICAL_YEARLY_PRICES: Record<number, number> = {
  2010: 0.06,
  2011: 5.27,
  2012: 12.46,
  2013: 198.51,
  2014: 502.12,
  2015: 272.38,
  2016: 567.16,
  2017: 4_348.17,
  2018: 7_578.45,
  2019: 7_344.88,
  2020: 11_071.64,
  2021: 47_312.76,
  2022: 28_268.23,
  2023: 29_655.31,
  2024: 62_517.35,
  2025: 97_150.00,
  2026: 89_500.00,
};

export const PIZZA_TRANSACTION = {
  date: '2010-05-22',
  btcSpent: 10_000,
  usdValue: 41,
  pizzaCount: 2,
  buyer: 'Laszlo Hanyecz',
  seller: 'Jeremy Sturdivant (jercos)',
};

export function calculatePizzaHeroData(currentBtcPrice: number): PizzaHeroData {
  const currentValue = PIZZA_TRANSACTION.btcSpent * currentBtcPrice;
  return {
    originalBtcSpent: PIZZA_TRANSACTION.btcSpent,
    originalUsdValue: PIZZA_TRANSACTION.usdValue,
    currentValue,
    costPerPizza: currentValue / PIZZA_TRANSACTION.pizzaCount,
    multiplier: currentValue / PIZZA_TRANSACTION.usdValue,
    pizzaDate: PIZZA_TRANSACTION.date,
  };
}

export function calculateOpportunityCost(input: OpportunityCostInput): OpportunityCostResult {
  const { amountSpent, currentBtcPrice, historicalBtcPrice, itemName } = input;

  if (historicalBtcPrice <= 0) {
    return {
      amountSpent,
      btcCouldHaveBought: 0,
      currentValue: 0,
      profitMissed: 0,
      multiplier: 0,
      itemName: itemName || 'Purchase',
    };
  }

  const btcCouldHaveBought = amountSpent / historicalBtcPrice;
  const currentValue = btcCouldHaveBought * currentBtcPrice;
  const profitMissed = currentValue - amountSpent;
  const multiplier = currentValue / amountSpent;

  return {
    amountSpent,
    btcCouldHaveBought,
    currentValue,
    profitMissed,
    multiplier,
    itemName: itemName || 'Purchase',
  };
}

export function getPizzaIndexData(currentBtcPrice: number): PizzaIndexPoint[] {
  const data: PizzaIndexPoint[] = [];

  for (const [yearStr, price] of Object.entries(HISTORICAL_YEARLY_PRICES)) {
    const year = parseInt(yearStr);
    data.push({
      year,
      price,
      pizzasPerBtc: Math.floor(price / PIZZA_PRICE_USD),
    });
  }

  // Add current year with live price
  const currentYear = new Date().getFullYear();
  const lastEntry = data[data.length - 1];
  if (lastEntry && lastEntry.year === currentYear) {
    lastEntry.price = currentBtcPrice;
    lastEntry.pizzasPerBtc = Math.floor(currentBtcPrice / PIZZA_PRICE_USD);
  }

  return data.sort((a, b) => a.year - b.year);
}

export const PIZZA_TIMELINE_EVENTS = [
  { date: '2010-05-18', title: 'The Forum Post', description: 'Laszlo Hanyecz posts on BitcoinTalk offering 10,000 BTC for two large pizzas delivered to his home in Jacksonville, Florida.', emoji: '📝' },
  { date: '2010-05-22', title: 'The Transaction', description: 'Jeremy Sturdivant (jercos) accepts the offer. Two Papa John\'s pizzas are delivered. The 10,000 BTC was worth approximately $41 at the time.', emoji: '🍕' },
  { date: '2011-02-09', title: 'BTC Hits $1', description: 'Bitcoin reaches $1 for the first time, making the pizza purchase worth $10,000.', emoji: '💵' },
  { date: '2013-11-28', title: 'BTC Hits $1,000', description: 'Bitcoin surpasses $1,000. The pizza BTC is now worth $10 million — the most expensive pizza in history.', emoji: '🚀' },
  { date: '2017-12-17', title: 'BTC Hits $20,000', description: 'Bitcoin reaches its then all-time high of ~$20,000. The pizza is valued at $200 million.', emoji: '📈' },
  { date: '2021-11-10', title: 'BTC Hits $69,000', description: 'Bitcoin reaches $69,000. The two pizzas are now worth approximately $690 million.', emoji: '🏆' },
  { date: '2024-03-14', title: 'BTC Hits $73,000', description: 'Bitcoin sets a new all-time high above $73,000. The pizza BTC surpasses $730 million.', emoji: '⚡' },
  { date: '2025-01-20', title: 'BTC Surpasses $100K', description: 'Bitcoin breaks through $100,000 for the first time. The pizza transaction is worth over $1 billion.', emoji: '🎯' },
];
