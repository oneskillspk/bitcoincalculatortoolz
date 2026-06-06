import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { calculateCAGR, YEARLY_PRICES, YEAR_LABELS } from "@/services/cagrCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

interface PeriodCAGR {
  label: string;
  years: number;
  cagr: number;
  totalReturn: number;
  startPrice: number;
  endPrice: number;
}

const BTC_INCEPTION_PRICE = 0.05;
const BTC_INCEPTION_YEAR = 2010;

function getBtcCAGRForPeriod(years: number): PeriodCAGR {
  const prices = YEARLY_PRICES.BTC;
  let endIndex = prices.length - 1;
  while (endIndex > 0 && prices[endIndex] === prices[endIndex - 1]) {
    endIndex -= 1;
  }
  const endPrice = prices[endIndex];
  const startIndex = Math.max(0, endIndex - years);
  const startPrice = prices[startIndex];
  const availableSpan = endIndex - startIndex;
  const effectiveYears = availableSpan > 0 ? Math.min(years, availableSpan) : years;
  const cagr = startPrice > 0 ? calculateCAGR(startPrice, endPrice, effectiveYears) : 0;
  const totalReturn = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
  return { label: availableSpan < years ? `${availableSpan}Y` : `${years}Y`, years: effectiveYears, cagr, totalReturn, startPrice, endPrice };
}

function getInceptionCAGR(): PeriodCAGR {
  const prices = YEARLY_PRICES.BTC;
  const endPrice = prices[prices.length - 1];
  const endYear = YEAR_LABELS[YEAR_LABELS.length - 1];
  const years = endYear - BTC_INCEPTION_YEAR;
  const cagr = calculateCAGR(BTC_INCEPTION_PRICE, endPrice, years);
  const totalReturn = ((endPrice - BTC_INCEPTION_PRICE) / BTC_INCEPTION_PRICE) * 100;
  return { label: "Since 2010", years, cagr, totalReturn, startPrice: BTC_INCEPTION_PRICE, endPrice };
}

export const CAGRHistoricalDashboard = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const periods: PeriodCAGR[] = [
    getBtcCAGRForPeriod(1),
    getBtcCAGRForPeriod(2),
    getBtcCAGRForPeriod(3),
    getBtcCAGRForPeriod(5),
    getBtcCAGRForPeriod(10),
    getInceptionCAGR(),
  ];

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin Tarihsel BYBÜ' : 'Bitcoin Historical CAGR'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tr ? 'Doğrulanmış yıllık kapanışlardan canlı hesaplanmıştır' : 'Live-calculated from verified yearly closes'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {periods.map((p) => {
            const positive = p.cagr >= 0;
            const labelTr = p.label === 'Since 2010' ? (tr ? '2010\'dan beri' : 'Since 2010') : p.label;
            return (
              <div key={p.label} className="rounded-xl border border-border/40 bg-card/50 p-4 hover:border-primary/40 transition-colors">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{labelTr}</div>
                <div className={`text-2xl font-bold flex items-center gap-1 ${positive ? "text-success" : "text-destructive"}`}>
                  {positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {p.cagr.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {tr ? 'Toplam:' : 'Total:'}{' '}
                  {p.totalReturn >= 0 ? "+" : ""}
                  {p.totalReturn >= 1000 ? `${(p.totalReturn / 1000).toFixed(1)}K%` : `${p.totalReturn.toFixed(0)}%`}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
          {tr
            ? "Bitcoin'in yıllıklaştırılmış getirisi pencereye göre dramatik şekilde değişir. Kısa pencereler yakın dönem rejim değişikliklerini; uzun pencereler döngü gürültüsünü düzleştirir. 2010'dan-bu-yana rakamları en erken işlem gören fiyatı (~$0,05) kullanır."
            : "Bitcoin's annualized return varies dramatically by window. Short windows show recent regime shifts; longer windows smooth out cycle noise. Since-2010 figures use the earliest tradable price (~$0.05)."}
        </p>
      </CardContent>
    </Card>
  );
};
