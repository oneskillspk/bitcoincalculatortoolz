import { format } from 'date-fns';
import { NisabData, SupportedCurrency, convertUsd, formatCurrency } from '@/services/zakatCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  nisab: NisabData;
  currency: SupportedCurrency;
  loading?: boolean;
}

export const ZakatNisabBanner = ({ nisab, currency, loading }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const silverNisab = convertUsd(nisab.silverNisabUsd, currency, nisab.exchangeRates);
  const goldNisab = convertUsd(nisab.goldNisabUsd, currency, nisab.exchangeRates);
  const silverPerG = convertUsd(nisab.silverPerGramUsd, currency, nisab.exchangeRates);
  const goldPerG = convertUsd(nisab.goldPerGramUsd, currency, nisab.exchangeRates);
  const btcPrice = convertUsd(nisab.btcUsd, currency, nisab.exchangeRates);

  const updatedTime = format(new Date(nisab.updatedAt), 'PPpp');
  const monthYear = new Date().toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">
            {tr ? `Anlık Nisab Eşikleri — ${monthYear}` : `Live Nisab Thresholds — ${monthYear}`}
          </h2>
          {loading && <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">🥈 {tr ? 'Gümüş Nisabı (612,36g)' : 'Silver Nisab (612.36g)'}</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(silverNisab, currency)}</p>
            <p className="text-xs text-muted-foreground">{tr ? 'Gümüş:' : 'Silver:'} {formatCurrency(silverPerG, currency)}/g</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">🥇 {tr ? 'Altın Nisabı (87,48g)' : 'Gold Nisab (87.48g)'}</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(goldNisab, currency)}</p>
            <p className="text-xs text-muted-foreground">{tr ? 'Altın:' : 'Gold:'} {formatCurrency(goldPerG, currency)}/g</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/30 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>BTC: {formatCurrency(btcPrice, currency)}</span>
          <span>{tr ? 'Güncellendi:' : 'Updated:'} {updatedTime}</span>
          {nisab.isFallback && (
            <span className="text-warning font-medium">⚠️ {tr ? 'Önbelleğe alınmış değerler kullanılıyor' : 'Using cached values'}</span>
          )}
          <span>{tr ? 'Kaynaklar: metals.dev, CoinGecko' : 'Sources: metals.dev, CoinGecko'}</span>
        </div>
      </CardContent>
    </Card>
  );
};
