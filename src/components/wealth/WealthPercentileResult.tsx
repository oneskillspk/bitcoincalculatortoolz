import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Percent, Coins } from 'lucide-react';
import { useNumberCounter } from '@/hooks/useNumberCounter';
import {
  PercentileResult,
  btcToSats,
  TOTAL_BTC_SUPPLY,
} from '@/services/wealthPercentileService';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney, formatMoneyCompact } from '@/utils/formatMoney';
import { ResultPanel, ResultsGrid, ResultCard } from '@/components/calculator';

interface WealthPercentileResultProps {
  result: PercentileResult;
}

export const WealthPercentileResult: React.FC<WealthPercentileResultProps> = ({ result }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const { price: btcPrice } = useLiveBitcoinPrice();
  const animatedPercentile = useNumberCounter({
    end: result.percentile,
    duration: 1500,
    isActive: result.btcAmount > 0,
    decimals: result.percentile >= 99 ? 2 : 1,
  });

  if (result.btcAmount <= 0) return null;

  const fiatValue = btcPrice > 0 ? result.btcAmount * btcPrice : 0;
  const sats = btcToSats(result.btcAmount);

  return (
    <ResultPanel
      accentBar="primary"
      action={
        <Badge
          variant="outline"
          className="text-sm px-3 py-1 border-border/40"
          style={{ borderColor: result.tier.color, color: result.tier.color }}
        >
          {result.tier.tierEmoji} {result.tier.tierName} {tr ? 'Kademesi' : 'Tier'}
        </Badge>
      }
    >
      <div className="text-center space-y-2">
        <p className="calc-text-small text-muted-foreground">
          {tr ? 'Daha fazla Bitcoin sahibisiniz' : 'You own more Bitcoin than'}
        </p>
        <p className="calc-text-display text-foreground tabular-nums tracking-tight">
          {animatedPercentile}%
        </p>
        <p className="calc-text-small text-muted-foreground">
          {tr ? 'dünya genelindeki tüm Bitcoin adreslerinin' : 'of all Bitcoin addresses worldwide'}
        </p>
      </div>

      <p className="text-center calc-text-body text-muted-foreground max-w-md mx-auto">
        {result.tier.tierDescription}
      </p>

      <ResultsGrid cols={4}>
        <ResultCard
          icon={<Coins />}
          label={tr ? "BTC'niz" : 'Your BTC'}
          value={`${result.btcAmount.toFixed(8)} BTC`}
          sub={`${sats.toLocaleString(getCurrentIntlLocale())} sats`}
        />
        <ResultCard
          icon={<TrendingUp />}
          label={tr ? 'Güncel Değer' : 'Current Value'}
          value={fiatValue > 0 ? formatMoneyCompact(fiatValue, { tr, fxRate }) : '—'}
          fullValue={fiatValue > 0 ? formatMoney(fiatValue, { tr, fxRate, decimals: 2 }) : undefined}
          sub={tr ? 'canlı fiyata göre' : 'at live price'}
        />
        <ResultCard
          icon={<Percent />}
          label={tr ? "Toplam Arzın %'si" : '% of Total Supply'}
          value={result.supplyPercentage >= 0.0001
            ? `${result.supplyPercentage.toFixed(6)}%`
            : `${result.supplyPercentage.toExponential(2)}`}
          sub={`of ${(TOTAL_BTC_SUPPLY / 1_000_000).toFixed(1)}M BTC`}
        />
        <ResultCard
          icon={<Users />}
          label={tr ? 'Daha Fazlasına Sahip Adresler' : 'Addresses with More'}
          value={result.addressesAbove >= 1_000_000
            ? `~${(result.addressesAbove / 1_000_000).toFixed(1)}M`
            : result.addressesAbove >= 1_000
              ? `~${(result.addressesAbove / 1_000).toFixed(0)}K`
              : `~${result.addressesAbove.toLocaleString(getCurrentIntlLocale())}`}
          sub={`of ${(result.totalAddresses / 1_000_000).toFixed(1)}M total`}
        />
      </ResultsGrid>
    </ResultPanel>
  );
};
