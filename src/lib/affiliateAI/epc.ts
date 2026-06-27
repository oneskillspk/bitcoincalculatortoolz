/**
 * Estimated Earnings-Per-Click (EPC) per affiliate program, in USD.
 *
 * These are conservative industry medians used to:
 *   1. Power GA4 `value` on `affiliate_click` so conversion reports show
 *      monetary estimates instead of just counts.
 *   2. Drive the /admin/revenue dashboard until real partner-dashboard
 *      EPCs are pasted in.
 *
 * Update with real numbers from each partner's reporting once we have
 * 30+ days of attributed conversions. The shape stays stable; only the
 * numbers move.
 */
export const AFFILIATE_EPC_USD: Record<string, number> = {
  // Tax SaaS — high CPA, long cookie
  koinly: 4.0,
  coinledger: 3.5,

  // Hardware wallets — physical good, ~10% commission
  ledger: 2.2,
  trezor: 1.8,

  // Exchanges — funded-account bonus
  redotpay: 3.0,
  mexc: 1.5,
  bybit: 2.5,
  coinbase: 1.2,
  kraken: 1.0,
  btcturk: 0.8,
  paribu: 0.6,
  swan_bitcoin: 2.0,

  // Tools / SaaS — recurring
  tradingview: 1.5,
};

export const DEFAULT_EPC_USD = 0.5;

export function epcFor(affiliateId: string): number {
  return AFFILIATE_EPC_USD[affiliateId] ?? DEFAULT_EPC_USD;
}
