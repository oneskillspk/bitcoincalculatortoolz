import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export type AddressLens = 'all' | 'individual' | 'noncustodial';

interface Props {
  lens: AddressLens;
  onLensChange: (lens: AddressLens) => void;
  basePercentile: number;
}

const LENSES: { id: AddressLens; label: { en: string; tr: string }; sub: { en: string; tr: string }; adjustment: number }[] = [
  {
    id: 'all',
    label: { en: 'All addresses', tr: 'Tüm adresler' },
    sub: { en: 'On-chain raw count (BitInfoCharts)', tr: 'Zincir üstü ham sayım (BitInfoCharts)' },
    adjustment: 0,
  },
  {
    id: 'individual',
    label: { en: 'Individual wallets', tr: 'Bireysel cüzdanlar' },
    sub: { en: 'Estimated unique humans (~106M)', tr: 'Tahmini benzersiz kişi (~106M)' },
    adjustment: -2.5,
  },
  {
    id: 'noncustodial',
    label: { en: 'Non-custodial only', tr: 'Yalnızca öz-saklama' },
    sub: { en: 'Excludes exchange omnibus wallets', tr: 'Borsa toplu cüzdanlarını hariç tutar' },
    adjustment: 1.8,
  },
];

export const WealthAddressLensSlider: React.FC<Props> = ({ lens, onLensChange, basePercentile }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const active = LENSES.find((l) => l.id === lens) ?? LENSES[0];
  const adjusted = Math.max(0, Math.min(99.9999, basePercentile + active.adjustment));

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {tr ? 'Dağılım Mercekleri' : 'Distribution Lens'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tr ? 'Karşılaştırma tabanını değiştirin. Aynı varlık, farklı payda.' : 'Switch the comparison basis. Same holdings, different denominator.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {LENSES.map((l) => (
            <button
              key={l.id}
              onClick={() => onLensChange(l.id)}
              aria-pressed={lens === l.id}
              className={cn(
                'text-left p-3 rounded-lg border transition-all min-h-[44px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                lens === l.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border/30 hover:border-border/60 bg-card'
              )}
            >
              <div className="text-sm font-medium text-foreground">{tr ? l.label.tr : l.label.en}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{tr ? l.sub.tr : l.sub.en}</div>
            </button>
          ))}
        </div>

        <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {tr ? 'Bu görünümde ayarlanmış yüzdelik' : 'Adjusted percentile in this view'}
          </span>
          <span className="text-lg font-bold text-foreground tabular-nums">
            {adjusted.toFixed(2)}%
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          {tr
            ? 'Düzeltmeler sezgiseldir. Binance ve Coinbase gibi borsa cüzdanları, milyonlarca kullanıcının BTC\'sini yalnızca birkaç adreste tutarak görünür adres sayısını şişirir. Glassnode ve CoinMetrics daha ayrıntılı varlık bazlı tahminler yayımlamaktadır.'
            : 'Adjustments are heuristic. Exchange wallets like Binance and Coinbase hold BTC for millions of users in just a few addresses, which inflates the apparent address count. Glassnode and CoinMetrics publish more granular entity-adjusted estimates.'}
        </p>
      </CardContent>
    </Card>
  );
};
