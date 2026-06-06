import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, ArrowUp, ArrowDown, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConverterContextStripProps {
  btcPrice: number;
  priceChangePercentage24h: number;
  currencySymbol: string;
  selectedCurrency: string;
  isLoading?: boolean;
  weekChangePercentage?: number | null;
  high24h?: number | null;
  low24h?: number | null;
}

const formatPrice = (v: number, sym: string): string =>
  `${sym}${v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const ConverterContextStrip: React.FC<ConverterContextStripProps> = ({
  btcPrice,
  priceChangePercentage24h,
  currencySymbol,
  selectedCurrency,
  isLoading = false,
  weekChangePercentage = null,
  high24h = null,
  low24h = null,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const swingMagnitude = Math.max(Math.abs(priceChangePercentage24h) / 100, 0.005);
  const highValue = high24h && high24h > 0 ? high24h : btcPrice * (1 + swingMagnitude * 0.6);
  const lowValue = low24h && low24h > 0 ? low24h : btcPrice * (1 - swingMagnitude * 0.6);
  const highLowAreReal = !!(high24h && low24h);

  const changeIsUp = priceChangePercentage24h >= 0;
  const weekIsUp = (weekChangePercentage ?? 0) >= 0;

  const sourceBadge = highLowAreReal
    ? { label: tr ? 'Canlı' : 'Live', cls: 'bg-success/15 text-success border-success/30' }
    : { label: tr ? 'Tahmin' : 'Estimated', cls: 'bg-amber-500/15 text-amber-600 border-amber-500/30' };

  const items = [
    {
      label: tr ? '24s Değişim' : '24h Change',
      value: isLoading ? '—' : `${changeIsUp ? '+' : ''}${priceChangePercentage24h.toFixed(2)}%`,
      icon: changeIsUp ? TrendingUp : TrendingDown,
      tone: changeIsUp ? 'text-success bg-success/5' : 'text-destructive bg-destructive/5',
      badge: null as null | { label: string; cls: string },
    },
    {
      label: tr ? '24s Yüksek' : '24h High',
      value: isLoading || btcPrice <= 0 ? '—' : formatPrice(highValue, currencySymbol),
      icon: ArrowUp,
      tone: 'text-foreground bg-muted/30',
      badge: sourceBadge,
    },
    {
      label: tr ? '24s Düşük' : '24h Low',
      value: isLoading || btcPrice <= 0 ? '—' : formatPrice(lowValue, currencySymbol),
      icon: ArrowDown,
      tone: 'text-foreground bg-muted/30',
      badge: sourceBadge,
    },
    {
      label: tr ? '7g Trend' : '7d Trend',
      value:
        weekChangePercentage === null || weekChangePercentage === undefined
          ? '—'
          : `${weekIsUp ? '+' : ''}${weekChangePercentage.toFixed(2)}%`,
      icon: CalendarRange,
      tone:
        weekChangePercentage === null
          ? 'text-muted-foreground bg-muted/30'
          : weekIsUp
            ? 'text-success bg-success/5'
            : 'text-destructive bg-destructive/5',
      badge: null,
    },
  ];

  return (
    <Card className="bg-card border border-border/50 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">
          {tr ? `Canlı ${selectedCurrency} piyasa bağlamı` : `Live ${selectedCurrency} market context`}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                'flex flex-col gap-1 px-3 py-2.5 rounded-lg border border-border/30',
                item.tone,
              )}
            >
              <div className="flex items-center justify-between gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wide leading-none',
                      item.badge.cls,
                    )}
                  >
                    {item.badge.label}
                  </span>
                )}
              </div>
              <div className="font-mono text-sm font-semibold">{item.value}</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground/70 mt-3">
        {tr
          ? (highLowAreReal
              ? '24s yüksek ve düşük değerler CoinGecko /coins/markets\'ten canlı olarak çekilmektedir. 7g trendi, canlı fiyatı 7 gün önceki fiyatla karşılaştırır.'
              : '24s yüksek ve düşük değerler canlı kaynak kullanılamadığından canlı fiyat ve gün içi hareketten tahmin edilmiştir. 7g trendi, mevcut olduğunda 7 gün önceki fiyatı kullanır.')
          : (highLowAreReal
              ? '24h high and low are pulled live from CoinGecko /coins/markets. 7d trend compares the live price to the price 7 days ago.'
              : '24h high and low are estimated from the live price and intraday move because the live source was unavailable. 7d trend uses the price 7 days ago when available.')}
      </p>
    </Card>
  );
};
