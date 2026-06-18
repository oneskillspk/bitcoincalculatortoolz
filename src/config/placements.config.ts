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
 *
 * INVARIANTS (enforced by `src/test/intent-map-integrity.test.ts`):
 *   1. Every id in INTENT_MAP MUST refer to a currently-enabled affiliate.
 *   2. No duplicate ids within the same (slug, lang) list.
 *
 * Future partners (Bybit, MEXC, Trezor, CoinLedger, Paribu, Kraken) live
 * in `WISHLIST_INTENT_MAP` so the strategic intent is preserved without
 * poisoning the scoring engine. When a wishlist partner becomes enabled,
 * promote its ids into `INTENT_MAP`.
 */
export interface SlugIntent {
  en: string[];
  tr: string[];
}

export const INTENT_BOOST = 15;

// Currently enabled affiliates: ledger, coinbase, koinly, tradingview, redotpay.
export const INTENT_MAP: Record<string, SlugIntent> = {
  // DCA / accumulation
  dca:                       { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "bitcoin-savings":         { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "stack-sats":              { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  sip:                       { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "hodl-strategy":           { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  millionaire:               { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  // Profit/loss & investment
  "profit-loss":             { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  investment:                { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  etf:                       { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  // Retirement & wealth
  retirement:                { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  "accumulation-score":      { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  "wealth-percentile":       { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  // Tax
  "capital-gains-tax":       { en: ["koinly", "coinbase"],       tr: ["koinly", "coinbase"] },
  "tax-calculator":          { en: ["koinly", "coinbase"],       tr: ["koinly", "coinbase"] },
  "inheritance-tax":         { en: ["koinly", "ledger"],         tr: ["koinly", "ledger"] },
  "bitcoin-zakat":           { en: ["koinly", "coinbase"],       tr: ["koinly", "coinbase"] },
  // Trading & charts
  "lot-size":                { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "pip-value":               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  liquidation:               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  volatility:                { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  drawdown:                  { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  arbitrage:                 { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "fear-greed-index":        { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "rainbow-chart":           { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "power-law":               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "stock-to-flow":           { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "leverage-liquidation":    { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  correlation:               { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  // Mining (no enabled mining partner — falls back to general)
  "mining-profitability":    { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  // Hypotheticals / explorers
  "what-if":                 { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "price-target":            { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  "time-machine":            { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "pizza-day":               { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "pi-to-bitcoin":           { en: ["coinbase", "redotpay"],     tr: ["coinbase", "redotpay"] },
  cagr:                      { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  "average-buy-price":       { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  // Utility / on-chain / payments
  "purchasing-power":        { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "transaction-fees":        { en: ["redotpay", "ledger"],       tr: ["redotpay", "ledger"] },
  lightning:                 { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
  staking:                   { en: ["coinbase", "tradingview"],  tr: ["coinbase", "tradingview"] },
  "halving-countdown":       { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  supply:                    { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  dominance:                 { en: ["tradingview", "coinbase"],  tr: ["tradingview", "coinbase"] },
  "bitcoin-loan":            { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  // Comparisons
  "lump-sum-vs-dca":         { en: ["coinbase", "ledger"],       tr: ["coinbase", "ledger"] },
  "btc-vs-real-estate":      { en: ["ledger", "coinbase"],       tr: ["ledger", "coinbase"] },
};

/**
 * Wishlist intent: strategic preferences for partners that are not yet
 * enabled. Read by docs/tests only — NOT applied to scoring. Promote
 * entries into INTENT_MAP when the partner's `enabled` flag flips true.
 */
export const WISHLIST_INTENT_MAP: Record<string, SlugIntent> = {
  dca:                    { en: ["mexc"],              tr: ["paribu"] },
  "mining-profitability": { en: ["mexc", "bybit"],     tr: ["mexc"] },
  "lot-size":             { en: ["bybit"],             tr: ["bybit"] },
  "pip-value":            { en: ["bybit"],             tr: ["bybit"] },
  liquidation:            { en: ["bybit"],             tr: ["bybit"] },
  "leverage-liquidation": { en: ["bybit"],             tr: ["bybit"] },
  "capital-gains-tax":    { en: ["coinledger"],        tr: [] },
  "inheritance-tax":      { en: ["coinledger"],        tr: [] },
  "accumulation-score":   { en: ["trezor"],            tr: [] },
  "wealth-percentile":    { en: ["trezor"],            tr: [] },
};

/**
 * Learn-article category → preferred affiliate per language.
 * Used by `LearnArticle.tsx` to seed `forceAffiliateId` on the inline
 * mid-article placement so editorial pages get a topical CTA instead of
 * the generic scoring winner.
 */
export const ARTICLE_CATEGORY_AFFILIATE: Record<string, { en: string; tr: string }> = {
  Basics:            { en: "coinbase",    tr: "coinbase" },
  Investing:         { en: "coinbase",    tr: "coinbase" },
  "Market Analysis": { en: "tradingview", tr: "tradingview" },
  Trading:           { en: "tradingview", tr: "tradingview" },
  Mining:            { en: "coinbase",    tr: "coinbase" },
  Tax:               { en: "koinly",      tr: "koinly" },
};
