import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/services/bitcoinApi';
import { Holding } from './usePortfolioStorage';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface PortfolioSummaryBarProps {
  holdings: Holding[];
  livePrice: number | null;
  currency: string;
  setCurrency: (c: string) => void;
  exchangeRate: number;
}

export const PortfolioSummaryBar = ({ holdings, livePrice, currency, setCurrency, exchangeRate }: PortfolioSummaryBarProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const totalBtc = holdings.reduce((sum, h) => sum + h.btcAmount, 0);
  const totalCostBasisUsd = holdings.reduce((sum, h) => sum + h.btcAmount * h.purchasePrice, 0);
  const currentValueUsd = livePrice ? totalBtc * livePrice : 0;
  const unrealizedPl = currentValueUsd - totalCostBasisUsd;
  const plPercent = totalCostBasisUsd > 0 ? (unrealizedPl / totalCostBasisUsd) * 100 : 0;
  const avgBuyPrice = totalBtc > 0 ? totalCostBasisUsd / totalBtc : 0;

  const rate = currency === 'USD' ? 1 : exchangeRate;
  const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');

  const fmt = (val: number, decimals = 2) =>
    formatCurrencyAmount(val * rate, currency, { locale, decimals });
  const fmtSigned = (val: number, decimals = 2) =>
    formatCurrencyAmount(val * rate, currency, { locale, decimals, signed: true });

  if (holdings.length === 0) return null;

  return (
    <Card className="border-border/40 sticky top-16 z-20 bg-background/95 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Toplam BTC' : 'Total BTC'}</p>
            <p className="text-lg font-bold text-foreground">{totalBtc.toFixed(8)} BTC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Güncel Değer' : 'Current Value'}</p>
            <p className="text-lg font-bold text-foreground">{livePrice ? fmt(currentValueUsd) : '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Maliyet Tabanı' : 'Cost Basis'}</p>
            <p className="text-sm font-medium text-muted-foreground">{fmt(totalCostBasisUsd)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Gerçekleşmemiş K&Z' : 'Unrealized P&L'}</p>
            <p className={`text-sm font-semibold ${unrealizedPl >= 0 ? 'text-success' : 'text-destructive'}`}>
              {fmtSigned(unrealizedPl)} ({plPercent >= 0 ? '+' : ''}{plPercent.toFixed(1)}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{tr ? 'Ort. Alım Fiyatı' : 'Avg Buy Price'}</p>
            <p className="text-sm font-medium text-muted-foreground">{fmt(avgBuyPrice)}</p>
          </div>
          <div className="ml-auto">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {SUPPORTED_CURRENCIES.filter(c => c.code !== 'BTC').slice(0, 30).map(c => (
                  <SelectItem key={c.code} value={c.code} className="text-xs">
                    {c.flag} {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
