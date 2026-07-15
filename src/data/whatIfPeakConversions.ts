/**
 * Pure helpers that derive "what $X bought at price Y is worth at reference price"
 * from the same anchor constants used across the What-If page.
 * Keeping these here (and tested) prevents secondary displays from drifting
 * out of sync with LATEST_ATH_USD / BTC_REF_PRICE_USD.
 */
import { BTC_REF_PRICE_USD, LATEST_ATH_USD } from "./whatIfAnchors";

export interface Conversion {
  btcAmount: number;    // BTC bought with `invest` at `btcPrice`
  worthNow: number;     // Value at BTC_REF_PRICE_USD
}

export const computeConversion = (
  btcPrice: number,
  invest = 100,
  refPrice: number = BTC_REF_PRICE_USD,
): Conversion => {
  if (btcPrice <= 0) throw new Error("btcPrice must be > 0");
  const btcAmount = invest / btcPrice;
  return { btcAmount, worthNow: btcAmount * refPrice };
};

// Fixed-precision helpers for display parity with the editorial table.
export const formatBtcAmount = (btc: number): string => {
  if (btc >= 1) return btc.toFixed(2);
  if (btc >= 0.001) return btc.toFixed(5);
  return btc.toFixed(6);
};

export const formatWorth = (usd: number): string =>
  `$${Math.round(usd).toLocaleString("en-US")}`;

// Convenience: the latest-ATH row, always sourced from anchors.
export const latestAthConversion = (invest = 100) =>
  computeConversion(LATEST_ATH_USD, invest);
