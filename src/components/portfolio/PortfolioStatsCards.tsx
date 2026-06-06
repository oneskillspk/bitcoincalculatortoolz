import { Card, CardContent } from '@/components/ui/card';
import { Holding } from './usePortfolioStorage';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';

interface PortfolioStatsCardsProps {
  holdings: Holding[];
  livePrice: number | null;
  currencySymbol?: string;
  currency?: string;
  exchangeRate?: number;
}

export const PortfolioStatsCards = ({ holdings, livePrice, currencySymbol = '$', currency = 'USD', exchangeRate = 1 }: PortfolioStatsCardsProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (holdings.length === 0 || !livePrice) return null;

  const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const fmt = (val: number) => formatCurrencyAmount(val * exchangeRate, currency, { locale, decimals: 2 });

  const totalBtc = holdings.reduce((s, h) => s + h.btcAmount, 0);
  const totalSats = Math.round(totalBtc * 100_000_000);
  const totalCost = holdings.reduce((s, h) => s + h.btcAmount * h.purchasePrice, 0);
  const avgBuyPrice = totalBtc > 0 ? totalCost / totalBtc : 0;
  const currentValue = totalBtc * livePrice;
  const plDollar = currentValue - totalCost;
  const aboveBelow = livePrice > avgBuyPrice
    ? (tr ? 'üzerinde' : 'above')
    : (tr ? 'altında' : 'below');
  const aboveBelowPct = avgBuyPrice > 0 ? Math.abs(((livePrice - avgBuyPrice) / avgBuyPrice) * 100) : 0;

  const withPl = holdings.map(h => ({
    ...h,
    plPct: h.purchasePrice > 0 ? ((livePrice - h.purchasePrice) / h.purchasePrice) * 100 : 0,
  }));
  const best = withPl.reduce((a, b) => a.plPct > b.plPct ? a : b);
  const worst = withPl.reduce((a, b) => a.plPct < b.plPct ? a : b);

  const progressTo1 = Math.min(totalBtc / 1, 1) * 100;
  const progressTo01 = Math.min(totalBtc / 0.1, 1) * 100;
  const remaining1 = Math.max(1 - totalBtc, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border/40">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">{tr ? 'Toplam Varlıklar' : 'Total Holdings'}</h3>
          <p className="text-xl font-bold text-foreground">{totalBtc.toFixed(8)} BTC</p>
          <p className="text-sm text-muted-foreground mt-1">= {totalSats.toLocaleString()} {tr ? 'satoshi' : 'satoshis'}</p>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">{tr ? 'Ortalama Alım Fiyatı' : 'Average Buy Price'}</h3>
          <p className="text-xl font-bold text-foreground">{fmt(avgBuyPrice)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {tr
              ? `Güncel fiyat ortalamanızın %${aboveBelowPct.toFixed(1)} ${aboveBelow}`
              : `Current price is ${aboveBelowPct.toFixed(1)}% ${aboveBelow} your average`}
          </p>
          <p className={`text-sm font-medium mt-0.5 ${plDollar >= 0 ? 'text-success' : 'text-destructive'}`}>
            {tr
              ? `${plDollar >= 0 ? 'Karda' : 'Zararda'} ${fmt(Math.abs(plDollar))}`
              : `You are ${plDollar >= 0 ? 'in profit' : 'in loss'} by ${fmt(Math.abs(plDollar))}`}
          </p>
          <Link to={tr ? '/tr/hesaplayicilar/bitcoin-ortalama-alis' : '/calculators/average-buy-price'} className="text-xs text-primary hover:underline mt-2 inline-block">
            {tr ? 'Tam ortalama alım fiyatını hesapla →' : 'Calculate your exact average buy price →'}
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">{tr ? 'En İyi & En Kötü Giriş' : 'Best & Worst Entry'}</h3>
          <div className="space-y-1.5">
            <p className="text-sm">
              <span className="text-success font-medium">{tr ? 'En İyi:' : 'Best:'}</span>{' '}
              {fmt(best.purchasePrice)} ({best.plPct >= 0 ? '+' : ''}{best.plPct.toFixed(1)}%)
            </p>
            <p className="text-sm">
              <span className="text-destructive font-medium">{tr ? 'En Kötü:' : 'Worst:'}</span>{' '}
              {fmt(worst.purchasePrice)} ({worst.plPct >= 0 ? '+' : ''}{worst.plPct.toFixed(1)}%)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardContent className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">{tr ? 'Kilometre Taşları' : 'Milestones'}</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>{tr ? '1 BTC\'ye İlerleme' : 'Progress to 1 BTC'}</span>
                <span>{progressTo1.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressTo1}%` }} />
              </div>
              {remaining1 > 0 && <p className="text-xs text-muted-foreground mt-0.5">{remaining1.toFixed(8)} BTC {tr ? 'kaldı' : 'remaining'}</p>}
            </div>
            {progressTo01 >= 100 && <p className="text-xs text-success">✓ 0.1 BTC {tr ? 'kilometre taşına ulaşıldı' : 'milestone reached'}</p>}
            <p className="text-xs text-muted-foreground">{totalSats.toLocaleString()} {tr ? 'satoshi biriktirildi' : 'sats accumulated'}</p>
          </div>
          <Link to={tr ? '/tr/hesaplayicilar/bitcoin-servet-yuzdesi' : '/calculators/wealth-percentile'} className="text-xs text-primary hover:underline mt-2 inline-block">
            {tr ? 'Stack\'ınızın dünya sıralamasını gör →' : "See where your stack ranks globally →"}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
