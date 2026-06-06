/**
 * Default zone + format rules per calculator category, plus rules for the
 * shared site-wide zones (pre-footer, inline-mid-article).
 */
import type { Format, Zone } from "@/lib/affiliateAI/types";

export interface PlacementRule {
  zone: Zone;
  format: Format;
  delay_ms: number;
  max_affiliates: number;
}

export const DEFAULT_PLACEMENT: PlacementRule = {
  zone: "post-result",
  format: "two-card-strip",
  delay_ms: 800,
  max_affiliates: 2,
};

// Page-category → placement preference
export const CATEGORY_PLACEMENT: Record<string, PlacementRule> = {
  accumulation: {
    zone: "post-result",
    format: "single-card",
    delay_ms: 600,
    max_affiliates: 1,
  },
  tax: {
    zone: "post-result",
    format: "single-card",
    delay_ms: 400,
    max_affiliates: 1,
  },
  trading: {
    zone: "sidebar",
    format: "sidebar-widget",
    delay_ms: 1000,
    max_affiliates: 2,
  },
  mining: {
    zone: "post-result",
    format: "comparison",
    delay_ms: 800,
    max_affiliates: 2,
  },
  comparison: {
    zone: "inline",
    format: "comparison",
    delay_ms: 500,
    max_affiliates: 2,
  },
  general: {
    zone: "post-result",
    format: "two-card-strip",
    delay_ms: 800,
    max_affiliates: 2,
  },
};

/** Standalone zone presets used by site-wide placements. */
export const ZONE_PRESETS: Record<Zone, PlacementRule> = {
  "post-result":        { zone: "post-result",        format: "two-card-strip", delay_ms: 800, max_affiliates: 2 },
  sidebar:              { zone: "sidebar",            format: "image-banner",   delay_ms: 800, max_affiliates: 1 },
  "inline-mid-article": { zone: "inline-mid-article", format: "image-banner",   delay_ms: 600, max_affiliates: 1 },
  "pre-footer":         { zone: "pre-footer",         format: "image-banner",   delay_ms: 400, max_affiliates: 1 },
  inline:               { zone: "inline",             format: "image-banner",   delay_ms: 500, max_affiliates: 1 },
  comparison:           { zone: "comparison",         format: "comparison",     delay_ms: 500, max_affiliates: 2 },
  footer:               { zone: "footer",             format: "image-banner",   delay_ms: 400, max_affiliates: 1 },
};

// Calculator slug → category for placement lookup
export const SLUG_CATEGORY: Record<string, keyof typeof CATEGORY_PLACEMENT> = {
  // Accumulation / DCA
  dca: "accumulation",
  "stack-sats": "accumulation",
  "bitcoin-savings": "accumulation",
  sip: "accumulation",
  millionaire: "accumulation",
  "hodl-strategy": "accumulation",
  retirement: "accumulation",
  "accumulation-score": "accumulation",
  "wealth-percentile": "accumulation",
  "average-buy-price": "accumulation",
  // Tax
  "capital-gains-tax": "tax",
  "tax-calculator": "tax",
  "inheritance-tax": "tax",
  "bitcoin-zakat": "tax",
  // Trading
  "profit-loss": "trading",
  volatility: "trading",
  drawdown: "trading",
  "fear-greed-index": "trading",
  "rainbow-chart": "trading",
  "power-law": "trading",
  "stock-to-flow": "trading",
  liquidation: "trading",
  "leverage-liquidation": "trading",
  "lot-size": "trading",
  "pip-value": "trading",
  arbitrage: "trading",
  correlation: "trading",
  // Mining
  "mining-profitability": "mining",
  // Comparison
  "lump-sum-vs-dca": "comparison",
  "btc-vs-assets": "comparison",
  "btc-vs-real-estate": "comparison",
  // General (everything else: explorers, converters, hypotheticals)
  etf: "general",
  investment: "general",
  "what-if": "general",
  "purchasing-power": "general",
  "transaction-fees": "general",
  lightning: "general",
  "halving-countdown": "general",
  cagr: "general",
  staking: "general",
  supply: "general",
  dominance: "general",
  "time-machine": "general",
  "pizza-day": "general",
  "price-target": "general",
  "bitcoin-loan": "general",
  "pi-to-bitcoin": "general",
  "bitcoin-converter": "general",
};

/**
 * Section-10 AI Decision Map. Hard intent boost applied in `scoreAffiliate`
 * when an affiliate id appears in the slug's intent list for the active
 * language. Keys are calculator slugs; missing slugs fall through to the
 * generic scoring weights.
 */
export interface SlugIntent {
  en: string[];
  tr: string[];
}

export const INTENT_BOOST = 15;

export const INTENT_MAP: Record<string, SlugIntent> = {
  // DCA / accumulation
  dca:                       { en: ["coinbase", "mexc"],     tr: ["coinbase", "paribu"] },
  "bitcoin-savings":         { en: ["coinbase", "mexc"],     tr: ["coinbase", "paribu"] },
  "stack-sats":              { en: ["coinbase", "mexc"],     tr: ["coinbase", "paribu"] },
  sip:                       { en: ["coinbase", "mexc"],     tr: ["coinbase", "paribu"] },
  "hodl-strategy":           { en: ["ledger", "coinbase"],   tr: ["ledger", "coinbase"] },
  millionaire:               { en: ["coinbase", "ledger"],   tr: ["coinbase", "ledger"] },
  // Profit/loss & investment
  "profit-loss":             { en: ["coinbase", "kraken"],       tr: ["coinbase", "mexc"] },
  investment:                { en: ["coinbase", "mexc"],         tr: ["coinbase", "paribu"] },
  etf:                       { en: ["coinbase", "kraken"],       tr: ["coinbase", "mexc"] },
  // Retirement & accumulation score / wealth
  retirement:                { en: ["coinbase", "ledger"],   tr: ["ledger", "coinbase"] },
  "accumulation-score":      { en: ["ledger", "trezor"],         tr: ["ledger", "coinbase"] },
  "wealth-percentile":       { en: ["ledger", "trezor"],         tr: ["ledger", "coinbase"] },
  // Tax
  "capital-gains-tax":       { en: ["koinly", "coinledger"],     tr: ["koinly"] },
  "tax-calculator":          { en: ["koinly", "coinledger"],     tr: ["koinly", "coinbase"] },
  // Mining
  "mining-profitability":    { en: ["mexc", "bybit"],            tr: ["mexc"] },
  // Trading
  "lot-size":                { en: ["bybit", "tradingview"],     tr: ["bybit", "mexc"] },
  "pip-value":               { en: ["bybit", "tradingview"],     tr: ["bybit", "mexc"] },
  liquidation:               { en: ["bybit", "tradingview"],     tr: ["bybit", "mexc"] },
  volatility:                { en: ["tradingview", "bybit"],     tr: ["tradingview", "mexc"] },
  drawdown:                  { en: ["tradingview", "bybit"],     tr: ["tradingview", "mexc"] },
  arbitrage:                 { en: ["tradingview", "bybit"],     tr: ["tradingview", "mexc"] },
  "fear-greed-index":        { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "rainbow-chart":           { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "power-law":               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "stock-to-flow":           { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "leverage-liquidation":    { en: ["bybit", "tradingview"],     tr: ["bybit", "mexc"] },
  correlation:               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  // Tax variants
  "inheritance-tax":         { en: ["koinly", "coinledger"],     tr: ["koinly"] },
  "bitcoin-zakat":           { en: ["koinly"],                   tr: ["koinly", "coinbase"] },
  // Hypotheticals / explorers (general intent: where to actually buy/secure)
  "what-if":                 { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "price-target":            { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "time-machine":            { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "pizza-day":               { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "pi-to-bitcoin":           { en: ["coinbase", "mexc"],         tr: ["coinbase", "mexc"] },
  cagr:                      { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "average-buy-price":       { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  // Utility / on-chain
  "purchasing-power":        { en: ["coinbase", "ledger"],   tr: ["coinbase", "ledger"] },
  "transaction-fees":        { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  lightning:                 { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  staking:                   { en: ["mexc", "bybit"],            tr: ["mexc", "coinbase"] },
  "halving-countdown":       { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  supply:                    { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  dominance:                 { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "bitcoin-loan":            { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  // Comparisons
  "lump-sum-vs-dca":         { en: ["coinbase", "coinbase"], tr: ["coinbase", "paribu"] },
  "btc-vs-real-estate":      { en: ["ledger", "coinbase"],   tr: ["ledger", "coinbase"] },
};

/**
 * Learn-article category → preferred affiliate per language.
 * Used by `LearnArticle.tsx` to seed `forceAffiliateId` on the inline
 * mid-article placement so editorial pages get a topical CTA instead of
 * the generic scoring winner.
 */
export const ARTICLE_CATEGORY_AFFILIATE: Record<string, { en: string; tr: string }> = {
  Basics:            { en: "coinbase", tr: "coinbase" },
  Investing:         { en: "coinbase", tr: "coinbase" },
  "Market Analysis": { en: "tradingview",  tr: "tradingview" },
  Trading:           { en: "bybit",        tr: "bybit" },
  Mining:            { en: "mexc",         tr: "mexc" },
  Tax:               { en: "koinly",       tr: "koinly" },
};
