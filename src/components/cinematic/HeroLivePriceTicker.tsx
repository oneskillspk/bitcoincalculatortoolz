import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Subtle live BTC price ticker for the hero badge.
 * Explicit loading skeleton, explicit error state, soft "tick" pulse on
 * fresh price arrival. Respects prefers-reduced-motion.
 */
export const HeroLivePriceTicker = () => {
  const { t } = useLanguage();
  const { price, priceChangePercentage24h, isLoading, error } = useLiveBitcoinPrice('USD');
  const prevPrice = useRef<number | null>(null);
  const [tick, setTick] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!price || isLoading) return;
    if (prevPrice.current !== null && prevPrice.current !== price) {
      setTick(price > prevPrice.current ? 'up' : 'down');
      const id = window.setTimeout(() => setTick(null), 900);
      prevPrice.current = price;
      return () => window.clearTimeout(id);
    }
    prevPrice.current = price;
  }, [price, isLoading]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(p);

  // ---- Error state ----
  if (error && !price) {
    return (
      <Badge
        variant="outline"
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-card/60 backdrop-blur-xl border-destructive/30 text-destructive max-w-[92vw]"
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
        <span className="text-[10px] sm:text-xs font-medium">{t('ticker.error')}</span>
      </Badge>
    );
  }

  // ---- Loading state ----
  if (isLoading || !price) {
    return (
      <Badge
        variant="outline"
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-card/60 backdrop-blur-xl border-border/50 max-w-[92vw]"
      >
        <span className="sr-only">{t('ticker.loading')}</span>
        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 motion-safe:animate-pulse" aria-hidden />
        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {t('ticker.label')}
        </span>
        <span className="h-3.5 sm:h-4 w-px bg-border/50" aria-hidden />
        <span
          aria-hidden
          className="h-3 w-20 rounded bg-gradient-to-r from-foreground/15 via-foreground/30 to-foreground/15 bg-[length:200%_100%] motion-safe:animate-gradient-shimmer"
        />
      </Badge>
    );
  }

  const displayPct = Math.abs(priceChangePercentage24h) < 0.05 ? 0 : priceChangePercentage24h;
  const isPositive = displayPct > 0;
  const isNeutral = displayPct === 0;

  return (
    <Badge
      variant="outline"
      role="status"
      aria-live="polite"
      aria-label={`${t('ticker.label')}: ${formatPrice(price)}, ${isPositive ? '+' : ''}${priceChangePercentage24h.toFixed(1)}% 24h`}
      className={cn(
        'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-background/90 backdrop-blur-xl border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all max-w-[92vw]',
        tick === 'up' && 'motion-safe:ring-1 motion-safe:ring-success/40',
        tick === 'down' && 'motion-safe:ring-1 motion-safe:ring-destructive/40'
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="w-2 h-2 bg-success rounded-full motion-safe:animate-pulse shrink-0" aria-hidden />
        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('ticker.label')}
        </span>
      </div>
      <div className="h-3.5 sm:h-4 w-px bg-border" aria-hidden />
      <span className="text-xs sm:text-sm font-mono font-bold text-foreground tabular-nums">
        {formatPrice(price)}
      </span>
      <span
        className={cn(
          'text-[10px] sm:text-xs font-semibold tabular-nums',
          isNeutral ? 'text-muted-foreground' : isPositive ? 'text-success' : 'text-destructive'
        )}
      >
        {isNeutral ? '' : isPositive ? '+' : ''}
        {displayPct.toFixed(1)}%
      </span>
    </Badge>
  );
};
