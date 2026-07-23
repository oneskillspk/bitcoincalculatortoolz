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
interface SlugIntent {
  en: string[];
  tr: string[];
}

export const INTENT_BOOST = 15;

// Currently enabled affiliates: ledger, coinbase, koinly, tradingview, redotpay, mexc, bybit.
// Phase-2 intent re-routing: order reflects EPC × intent fit (see epc.ts).
// Highest-EPC partner that matches the page intent leads; legacy winners
// remain in the top-3 so intentMap.test.ts invariants hold.
export const INTENT_MAP: Record<string, SlugIntent> = {
  // DCA / accumulation — card on-ramp + cold storage out-perform pure CEX
  dca:                       { en: ["redotpay", "bybit", "ledger", "coinbase"], tr: ["redotpay", "bybit", "ledger", "coinbase"] },
  "bitcoin-savings":         { en: ["redotpay", "ledger", "bybit", "coinbase"], tr: ["redotpay", "ledger", "bybit", "coinbase"] },
  "stack-sats":              { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  sip:                       { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  "hodl-strategy":           { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  millionaire:               { en: ["redotpay", "ledger", "bybit", "coinbase"], tr: ["redotpay", "ledger", "bybit", "coinbase"] },
  // Profit/loss & investment — active traders convert best on derivatives venues.
  // Axi ($400 CPA IB) leads the leverage/CFD intent pages; bybit/tradingview kept in top-3.
  "profit-loss":             { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  investment:                { en: ["bybit", "ledger", "coinbase"],             tr: ["bybit", "ledger", "coinbase"] },
  etf:                       { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  // Retirement & wealth — long horizon → cold storage first
  retirement:                { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  "accumulation-score":      { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  "wealth-percentile":       { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  // Tax — Koinly dominates EPC and intent
  "capital-gains-tax":       { en: ["koinly", "ledger", "coinbase"],            tr: ["koinly", "ledger", "coinbase"] },
  "tax-calculator":          { en: ["koinly", "ledger", "coinbase"],            tr: ["koinly", "ledger", "coinbase"] },
  "inheritance-tax":         { en: ["koinly", "ledger"],                        tr: ["koinly", "ledger"] },
  "bitcoin-zakat":           { en: ["koinly", "ledger", "coinbase"],            tr: ["koinly", "ledger", "coinbase"] },
  // Trading & charts — Axi IB ($400 CPA) leads leverage/lot intent, then bybit/tradingview
  "lot-size":                { en: ["axi", "bybit", "mexc", "tradingview"],    tr: ["axi", "bybit", "mexc", "tradingview"] },
  "bitcoin-lot-size":        { en: ["axi", "bybit", "mexc", "tradingview"],    tr: ["axi", "bybit", "mexc", "tradingview"] },
  "pip-value":               { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  liquidation:               { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  volatility:                { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  drawdown:                  { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  arbitrage:                 { en: ["bybit", "mexc", "tradingview", "coinbase"], tr: ["bybit", "mexc", "tradingview", "coinbase"] },
  "fear-greed-index":        { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "rainbow-chart":           { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "power-law":               { en: ["axi", "bybit", "tradingview", "coinbase", "mexc"], tr: ["axi", "bybit", "tradingview", "coinbase", "mexc"] },
  "stock-to-flow":           { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "leverage-liquidation":    { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  "risk-reward":             { en: ["axi", "bybit", "tradingview", "coinbase"], tr: ["axi", "bybit", "tradingview", "coinbase"] },
  correlation:               { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  // Mining — Bybit Earn + MEXC payouts
  "mining-profitability":    { en: ["bybit", "mexc", "tradingview", "coinbase"], tr: ["bybit", "mexc", "tradingview", "coinbase"] },
  // Hypotheticals / explorers
  "what-if":                 { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  "price-target":            { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "time-machine":            { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  "pizza-day":               { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  "pi-to-bitcoin":           { en: ["redotpay", "bybit", "coinbase"],           tr: ["redotpay", "bybit", "coinbase"] },
  cagr:                      { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "average-buy-price":       { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  // Utility / on-chain / payments — payment-card EPC dominates
  "purchasing-power":        { en: ["redotpay", "ledger", "coinbase"],          tr: ["redotpay", "ledger", "coinbase"] },
  "transaction-fees":        { en: ["redotpay", "ledger"],                      tr: ["redotpay", "ledger"] },
  lightning:                 { en: ["redotpay", "bybit", "ledger", "coinbase"], tr: ["redotpay", "bybit", "ledger", "coinbase"] },
  staking:                   { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "halving-countdown":       { en: ["bybit", "ledger", "coinbase"],             tr: ["bybit", "ledger", "coinbase"] },
  supply:                    { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
  dominance:                 { en: ["bybit", "tradingview", "coinbase"],        tr: ["bybit", "tradingview", "coinbase"] },
  "bitcoin-loan":            { en: ["redotpay", "ledger", "coinbase"],          tr: ["redotpay", "ledger", "coinbase"] },
  // Comparisons
  "lump-sum-vs-dca":         { en: ["bybit", "mexc", "ledger", "coinbase"],     tr: ["bybit", "mexc", "ledger", "coinbase"] },
  "btc-vs-real-estate":      { en: ["ledger", "bybit", "coinbase"],             tr: ["ledger", "bybit", "coinbase"] },
};

/**
 * Wishlist intent: strategic preferences for partners that are not yet
 * enabled. Read by docs/tests only — NOT applied to scoring. Promote
 * entries into INTENT_MAP when the partner's `enabled` flag flips true.
 */
export const WISHLIST_INTENT_MAP: Record<string, SlugIntent> = {
  dca:                    { en: [],                       tr: ["paribu"] },
  "capital-gains-tax":    { en: ["coinledger"],           tr: [] },
  "inheritance-tax":      { en: ["coinledger"],           tr: [] },
  "accumulation-score":   { en: ["trezor"],               tr: [] },
  "wealth-percentile":    { en: ["trezor"],               tr: [] },
};

/**
 * Learn-article category → preferred affiliate per language.
 * Used by `LearnArticle.tsx` to seed `forceAffiliateId` on the inline
 * mid-article placement so editorial pages get a topical CTA instead of
 * the generic scoring winner.
 */
const ARTICLE_CATEGORY_AFFILIATE: Record<string, { en: string | string[]; tr: string | string[] }> = {
  Basics:            { en: "coinbase",                       tr: "coinbase" },
  Investing:         { en: "coinbase",                       tr: "coinbase" },
  "Market Analysis": { en: ["tradingview", "mexc"],          tr: ["tradingview", "mexc"] },
  Trading:           { en: ["tradingview", "bybit"],         tr: ["tradingview", "bybit"] },
  Mining:            { en: ["coinbase", "mexc"],             tr: ["coinbase", "mexc"] },
  Tax:               { en: "koinly",                         tr: "koinly" },
};

/**
 * Resolve a category's preferred affiliate id for a given language. When the
 * mapping is an array, deterministically pick one based on the slug hash so
 * the same article always shows the same partner (stable for A/B + caching).
 */
export function resolveArticleAffiliate(
  category: string,
  lang: 'en' | 'tr',
  slug?: string,
): string | undefined {
  const entry = ARTICLE_CATEGORY_AFFILIATE[category];
  if (!entry) return undefined;
  const pick = entry[lang];
  if (Array.isArray(pick)) {
    if (pick.length === 0) return undefined;
    const seed = slug ?? category;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return pick[h % pick.length];
  }
  return pick;
}
