import React from 'react';
import { formatGroupedInt } from '@/utils/numberFormat';
import { useQuery } from '@tanstack/react-query';
import { bitcoinApi } from '@/services/bitcoinApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatTRY } from '@/utils/formatTRY';
import { useNumberCounter } from '@/hooks/useNumberCounter';

interface CompactLiveBitcoinPriceProps {
  /**
   * Display currency requested by the host page. On Turkish routes we
   * automatically override to TRY so the ₺ symbol always reflects the
   * real Turkish lira price (not the USD price relabelled).
   */
  currency: string;
}

export const CompactLiveBitcoinPrice = ({ currency }: CompactLiveBitcoinPriceProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  // Locale-driven currency override prevents the "USD value with ₺ symbol" bug.
  const effectiveCurrency = tr ? 'TRY' : currency;

  // Share the exact query key/fetcher used by useLiveBitcoinPrice so a page can
  // never show two different BTC prices at the same time.
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['bitcoin-market-data', effectiveCurrency],
    queryFn: () => bitcoinApi.getCurrentMarketData(effectiveCurrency),
    refetchInterval: 10000,
    staleTime: 8000,
  });
  const currentPrice = marketData?.price;


  // Smooth-tick the displayed price toward the latest value (~600ms ease-out).
  // Hook runs every render so we can't put it behind an early return.
  const animatedPrice = useNumberCounter({
    end: currentPrice ?? 0,
    duration: 600,
    isActive: !!currentPrice,
    decimals: 0,
  });

  if (isLoading || !currentPrice) {
    return (
      <div className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-3.5 py-1.5 backdrop-blur-sm">
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
        <div className="h-3 w-24 bg-muted/60 rounded animate-pulse" />
      </div>
    );
  }

  const displayPrice = animatedPrice || currentPrice;
  // Use Intl currency formatting so INR renders ₹ (India pages), EUR renders €,
  // GBP renders £, etc. Falls back to legacy `$…` formatter only for USD to keep
  // the compact "$X,XXX,XXX" look on English pages.
  let formattedPrice: string;
  if (tr) {
    formattedPrice = formatTRY(displayPrice, 0);
  } else if (effectiveCurrency && effectiveCurrency.toUpperCase() !== 'USD') {
    const locale = effectiveCurrency.toUpperCase() === 'INR' ? 'en-IN' : 'en-US';
    try {
      formattedPrice = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: effectiveCurrency,
        maximumFractionDigits: 0,
      }).format(displayPrice);
    } catch {
      formattedPrice = `${formatGroupedInt(displayPrice, locale)} ${effectiveCurrency}`;
    }
  } else {
    formattedPrice = `$${formatGroupedInt(displayPrice, 'en-US')}`;
  }

  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-card/70 px-3.5 py-1.5 text-sm whitespace-nowrap shadow-sm backdrop-blur-sm">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary/50 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {tr ? 'Canlı BTC' : 'Live BTC'}
      </span>
      <span className="h-3 w-px bg-border/60" aria-hidden />
      <span className="font-semibold text-foreground tabular-nums">{formattedPrice}</span>
    </div>
  );
};
