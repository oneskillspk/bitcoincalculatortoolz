import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ─── Interfaces ───────────────────────────────────────────────
export interface NisabData {
  goldPerGramUsd: number;
  silverPerGramUsd: number;
  silverNisabUsd: number;
  goldNisabUsd: number;
  exchangeRates: Record<string, number>;
  btcUsd: number;
  updatedAt: string;
  isFallback: boolean;
}

export interface ZakatAssets {
  btcAmount: number;
  cashOnHand: number;
  bankSavings: number;
  fixedDeposits: number;
  goldGrams: number;
  goldPurity: '24K' | '22K' | '21K' | '18K';
  silverGrams: number;
  stocksValue: number;
  debts: number;
}

export interface ZakatResult {
  breakdown: {
    bitcoin: number;
    cash: number;
    gold: number;
    silver: number;
    stocks: number;
  };
  totalZakatable: number;
  deductions: number;
  netWealth: number;
  nisabExceeded: boolean;
  zakatDue: number;
  zakatInBtc: number;
}

export type NisabStandard = 'silver' | 'gold';
export type SupportedCurrency = 'USD' | 'PKR' | 'INR' | 'AED' | 'GBP' | 'BDT' | 'MYR' | 'IDR' | 'SAR' | 'NGN' | 'EUR' | 'CAD' | 'AUD' | 'TRY';

// ─── Constants ───────────────────────────────────────────────
export const GOLD_PURITY: Record<string, number> = {
  '24K': 1.0,
  '22K': 0.9167,
  '21K': 0.875,
  '18K': 0.75,
};

export const ZAKAT_RATE = 0.025;
export const LUNAR_YEAR_DAYS = 354;

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$', PKR: '₨', INR: '₹', AED: 'AED ', GBP: '£',
  BDT: '৳', MYR: 'RM', IDR: 'Rp', SAR: 'SAR ', NGN: '₦',
  EUR: '€', CAD: 'C$', AUD: 'A$', TRY: '₺',
};

export const CURRENCY_FLAGS: Record<SupportedCurrency, string> = {
  USD: '🇺🇸', PKR: '🇵🇰', INR: '🇮🇳', AED: '🇦🇪', GBP: '🇬🇧',
  BDT: '🇧🇩', MYR: '🇲🇾', IDR: '🇮🇩', SAR: '🇸🇦', NGN: '🇳🇬',
  EUR: '🇪🇺', CAD: '🇨🇦', AUD: '🇦🇺', TRY: '🇹🇷',
};

// ─── Calculation functions ───────────────────────────────────
export function calculateZakat(
  assets: ZakatAssets,
  nisab: NisabData,
  standard: NisabStandard,
  currency: SupportedCurrency
): ZakatResult {
  const rate = currency === 'USD' ? 1 : (nisab.exchangeRates[currency] || 1);

  const btcValueUsd = assets.btcAmount * nisab.btcUsd;
  const goldValueUsd = assets.goldGrams * GOLD_PURITY[assets.goldPurity] * nisab.goldPerGramUsd;
  const silverValueUsd = assets.silverGrams * nisab.silverPerGramUsd;

  // Convert local currency inputs to USD for comparison
  const cashUsd = (assets.cashOnHand + assets.bankSavings + assets.fixedDeposits) / rate;
  const stocksUsd = assets.stocksValue / rate;
  const debtsUsd = assets.debts / rate;

  const breakdown = {
    bitcoin: btcValueUsd,
    cash: cashUsd,
    gold: goldValueUsd,
    silver: silverValueUsd,
    stocks: stocksUsd,
  };

  const totalZakatable = btcValueUsd + cashUsd + goldValueUsd + silverValueUsd + stocksUsd;
  const netWealth = totalZakatable - debtsUsd;
  const nisabThreshold = standard === 'silver' ? nisab.silverNisabUsd : nisab.goldNisabUsd;
  const nisabExceeded = netWealth >= nisabThreshold;
  const zakatDue = nisabExceeded ? netWealth * ZAKAT_RATE : 0;
  const zakatInBtc = nisab.btcUsd > 0 ? zakatDue / nisab.btcUsd : 0;

  return { breakdown, totalZakatable, deductions: debtsUsd, netWealth, nisabExceeded, zakatDue, zakatInBtc };
}

export function convertUsd(amountUsd: number, currency: SupportedCurrency, rates: Record<string, number>): number {
  if (currency === 'USD') return amountUsd;
  return amountUsd * (rates[currency] || 1);
}

export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (amount >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 10_000) return `${symbol}${Math.round(amount).toLocaleString()}`;
  return `${symbol}${amount.toFixed(2)}`;
}

export function calculateHawlDate(startDate: Date): { anniversary: Date; isDue: boolean } {
  const anniversary = new Date(startDate);
  anniversary.setDate(anniversary.getDate() + LUNAR_YEAR_DAYS);
  return { anniversary, isDue: new Date() >= anniversary };
}

export function getQuickReferenceAmounts(): number[] {
  return [0.01, 0.05, 0.1, 0.5, 1.0];
}

// ─── Hook ────────────────────────────────────────────────────
let cachedData: NisabData | null = null;
let cachedAt = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 60 min

export function useMetalPrices() {
  const [data, setData] = useState<NisabData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    // Return cache if fresh
    if (cachedData && Date.now() - cachedAt < CACHE_DURATION) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('metal-prices');
      if (fnError) throw new Error(fnError.message);

      const nisabData: NisabData = {
        goldPerGramUsd: result.gold_per_gram_usd,
        silverPerGramUsd: result.silver_per_gram_usd,
        silverNisabUsd: result.silver_nisab_usd,
        goldNisabUsd: result.gold_nisab_usd,
        exchangeRates: result.exchange_rates,
        btcUsd: result.btc_usd,
        updatedAt: result.updated_at,
        isFallback: result.is_fallback,
      };

      cachedData = nisabData;
      cachedAt = Date.now();
      setData(nisabData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch metal prices:', err);
      setError('Failed to load live prices');
      // Keep showing cached data if available
      if (!cachedData) setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { data, loading, error, refetch: fetchPrices };
}
