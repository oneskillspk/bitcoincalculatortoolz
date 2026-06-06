import { Card, CardContent } from "@/components/ui/card";
import type { StockVsBtc } from "@/services/volatilityService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  data: StockVsBtc[];
  btcVol30: number;
}

export const VolatilityStockComparison = ({ data, btcVol30 }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {tr ? 'Bitcoin ile Bireysel Hisseler Karşılaştırması' : 'Bitcoin vs Individual Stocks'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {tr
              ? `Tek isimli hisseler, canlı BTC 30 günlük volatiliteye (${btcVol30.toFixed(1)}%) göre sıralandı. Hisse verileri Q1 2025 dönemine ait referans değerleridir.`
              : `Single-name equities ranked against live BTC 30-day vol (${btcVol30.toFixed(1)}%). Stock readings are rolling reference figures from Q1 2025.`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{tr ? 'Sembol' : 'Ticker'}</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">{tr ? 'İsim' : 'Name'}</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? '30 Günlük Vol' : '30-Day Vol'}</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? '1 Yıllık Vol' : '1-Year Vol'}</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? 'BTC\'ye karşı' : 'vs BTC'}</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">{tr ? 'Bağlam' : 'Context'}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.ticker} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">{s.ticker}</td>
                  <td className="py-3 px-4 text-foreground">{s.name}</td>
                  <td className="py-3 px-4 text-right text-foreground">{s.vol30d.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-foreground">{s.vol1y.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right font-medium text-foreground">{s.ratioVsBtc}</td>
                  <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{s.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {tr
            ? 'MSTR ve COIN genellikle BTC\'den daha yüksek volatilite gösterir; çünkü kripto varlıklarına doğrudan maruziyetleri veya kaldıraç kullanımları vardır. NFLX ise olgunlaşmış bir büyüme hissesinin görünümünü yansıtır.'
            : 'MSTR and COIN routinely run hotter than BTC because they are levered or operationally tied to crypto. NFLX shows what a maturing growth equity looks like by comparison.'}
        </p>
      </CardContent>
    </Card>
  );
};
