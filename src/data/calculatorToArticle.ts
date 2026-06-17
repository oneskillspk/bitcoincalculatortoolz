/**
 * Calculator → Learn article cross-link map.
 * Keyed by calculator slug (EN). Value is the EN article slug; the route
 * resolver localizes to `/learn/<slug>` or `/tr/ogrenin/<tr-slug>` at
 * render time.
 *
 * Only entries with a strong topical match are listed. Calculators without
 * a paired guide simply skip the "Read the guide" card.
 */
export const calculatorToArticle: Record<string, string> = {
  "dca": "what-is-bitcoin-dca",
  "lump-sum-vs-dca": "dca-vs-lump-sum-bitcoin",
  "bitcoin-savings": "bitcoin-savings-plan-guide",
  "halving-countdown": "bitcoin-halving-explained",
  "mining-profitability": "bitcoin-mining-profitability-2026",
  "profit-loss": "how-to-calculate-bitcoin-profit-loss",
  "capital-gains-tax": "bitcoin-tax-guide-capital-gains",
  "retirement": "how-to-plan-retirement-with-bitcoin",
  "fear-greed-index": "bitcoin-fear-greed-index-strategy",
  "hodl-strategy": "bitcoin-hodl-strategy-explained",
  "average-buy-price": "how-to-calculate-average-buy-price-bitcoin",
  "wealth-percentile": "bitcoin-wealth-distribution",
  "btc-vs-real-estate": "bitcoin-vs-real-estate-sp500-gold-comparison",
  "btc-vs-assets": "bitcoin-vs-gold-sp500",
  "dominance": "bitcoin-dominance-explained",
  "rainbow-chart": "how-to-read-bitcoin-rainbow-chart",
  "drawdown": "bitcoin-drawdown-history",
  "volatility": "bitcoin-volatility-explained",
  "power-law": "bitcoin-power-law-explained",
  "stock-to-flow": "bitcoin-stock-to-flow-model",
  "on-chain": "bitcoin-on-chain-metrics-guide",
  "transaction-fees": "bitcoin-transaction-fees-explained",
  "etf": "bitcoin-etf-guide-ibit-fbtc-arkb",
  "sip": "bitcoin-sip-guide",
  "pizza-day": "bitcoin-pizza-day-history",
  "millionaire": "bitcoin-millionaire-calculator-guide",
  "staking": "bitcoin-staking-guide",
  "leverage-liquidation": "bitcoin-leverage-trading-risks",
  "bitcoin-lot-size": "how-to-calculate-bitcoin-lot-size",
  "bitcoin-zakat": "zakat-on-bitcoin-guide",
  "bitcoin-converter": "what-is-a-satoshi",
};
