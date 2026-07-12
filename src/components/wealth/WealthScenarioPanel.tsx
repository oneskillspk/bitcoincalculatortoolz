import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  btcAmount: number;
}

const PRICE_SCENARIOS = [
  { price: 200_000, labelEn: '$200K BTC', labelTr: '$200K BTC', contextEn: 'Mid-cycle target', contextTr: 'Döngü ortası hedefi' },
  { price: 500_000, labelEn: '$500K BTC', labelTr: '$500K BTC', contextEn: 'Cycle peak estimate', contextTr: 'Döngü zirvesi tahmini' },
  { price: 1_000_000, labelEn: '$1M BTC', labelTr: '$1M BTC', contextEn: 'Long-term thesis', contextTr: 'Uzun vadeli tez' },
];

const fmtUsd = (n: number) =>
  n >= 1_000_000_000
    ? `$${(n / 1_000_000_000).toFixed(2)}B`
    : n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(1)}K`
    : `$${n.toFixed(0)}`;

const getPercentile = (value: number, tr: boolean): string => {
  if (value >= 13_700_000) return tr ? 'ABD\'nin En Üst %0.1' : 'Top 0.1% US';
  if (value >= 11_600_000) return tr ? 'ABD\'nin En Üst %1' : 'Top 1% US';
  if (value >= 2_600_000) return tr ? 'ABD\'nin En Üst %5' : 'Top 5% US';
  if (value >= 1_063_700) return tr ? 'ABD\'nin En Üst %10' : 'Top 10% US';
  if (value >= 192_700) return tr ? 'ABD\'nin En Üst %50' : 'Top 50% US';
  if (value >= 50_000) return tr ? 'ABD Medyanının Üzeri' : 'Above median US';
  return tr ? 'ABD Medyanının Altı' : 'Below median US';
};

export const WealthScenarioPanel: React.FC<Props> = ({ btcAmount }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const { price } = useLiveBitcoinPrice('USD');
  const livePrice = price ?? 0;

  const rows = useMemo(() => {
    return PRICE_SCENARIOS.map((s) => {
      const value = btcAmount * s.price;
      const multiple = livePrice > 0 ? s.price / livePrice : 0;
      return { ...s, value, multiple, percentile: getPercentile(value, tr) };
    });
  }, [btcAmount, livePrice, tr]);

  if (btcAmount <= 0) return null;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {tr ? 'Gelecek Fiyat Senaryoları' : 'Future-Price Scenarios'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {(() => {
                const raw = btcAmount.toFixed(8).replace(/\.?0+$/, '');
                const btcStr = tr ? raw.replace('.', ',') : raw;
                return tr
                  ? `${btcStr} BTC'niz tahmini fiyatlarda`
                  : `Your ${btcStr} BTC at projected prices`;
              })()}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border/30 text-xs text-muted-foreground">
                <th className="text-left font-medium py-2 px-5 sm:px-3">{tr ? 'Senaryo' : 'Scenario'}</th>
                <th className="text-right font-medium py-2 px-3">{tr ? 'Varlık Değeri' : 'Holdings Value'}</th>
                <th className="text-right font-medium py-2 px-3">{tr ? 'Çarpan' : 'Multiple'}</th>
                <th className="text-right font-medium py-2 px-5 sm:px-3">{tr ? 'ABD Servet Kademesi' : 'US Wealth Tier'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.price} className="border-b border-border/20 last:border-0">
                  <td className="py-3 px-5 sm:px-3">
                    <div className="font-medium text-foreground">{tr ? r.labelTr : r.labelEn}</div>
                    <div className="text-xs text-muted-foreground">{tr ? r.contextTr : r.contextEn}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-foreground tabular-nums">
                    {fmtUsd(r.value)}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground tabular-nums">
                    {r.multiple > 0 ? `${r.multiple.toFixed(1)}x` : '—'}
                  </td>
                  <td className="py-3 px-5 sm:px-3 text-right">
                    <span className="text-xs font-medium text-primary">{r.percentile}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {tr
            ? 'ABD servet kademeleri Federal Reserve Tüketici Finansmanı Anketi 2022 net servet dilimlerine dayanmaktadır. Gelecekteki fiyatlar gösterge senaryolardır, tahmin değildir.'
            : 'US wealth tiers from Federal Reserve Survey of Consumer Finances 2022 net worth brackets. Future prices are illustrative scenarios, not forecasts.'}
        </p>
      </CardContent>
    </Card>
  );
};
