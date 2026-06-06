import { Card, CardContent } from "@/components/ui/card";
import { ETFCalculationResult } from "@/services/etfData";
import { Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ETFComparisonTableProps {
  results: ETFCalculationResult[];
}

const formatUSD = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const ETFComparisonTable = ({ results }: ETFComparisonTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <Scale className="w-5 h-5" />
          <h3 className="font-semibold text-foreground">
            {tr ? 'Tüm ETF\'ler Karşılaştırması — En Düşük Ücrete Göre Sıralı' : 'All ETFs Compared — Sorted by Lowest Fees'}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">ETF</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">{tr ? 'İhraçcı' : 'Issuer'}</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">{tr ? 'Gider Oranı' : 'Expense Ratio'}</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">{tr ? 'Toplam Ücret' : 'Total Fees'}</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">{tr ? 'Ücret Sonrası Değer' : 'Value After Fees'}</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">{tr ? 'Ücret Etkisi' : 'Fee Drag'}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.etf.ticker} className={`border-b border-border/20 ${i === 0 ? 'bg-primary/5' : ''}`}>
                  <td className="py-3 px-2 font-semibold text-foreground">
                    {i === 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mr-1.5">
                        {tr ? 'En İyi' : 'Best'}
                      </span>
                    )}
                    {r.etf.ticker}
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{r.etf.issuer}</td>
                  <td className="py-3 px-2 text-right text-foreground">{(r.etf.expenseRatio * 100).toFixed(2)}%</td>
                  <td className="py-3 px-2 text-right text-destructive">{formatUSD(r.totalFeesPaid)}</td>
                  <td className="py-3 px-2 text-right text-foreground font-medium">{formatUSD(r.valueAfterFees)}</td>
                  <td className="py-3 px-2 text-right text-muted-foreground">-{r.feeImpactOnReturns.toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="bg-success/5">
                <td className="py-3 px-2 font-semibold text-foreground">{tr ? 'Doğrudan BTC' : 'Direct BTC'}</td>
                <td className="py-3 px-2 text-muted-foreground">{tr ? 'Öz-saklama' : 'Self-custody'}</td>
                <td className="py-3 px-2 text-right text-success font-medium">0.00%</td>
                <td className="py-3 px-2 text-right text-success">{formatUSD(0)}</td>
                <td className="py-3 px-2 text-right text-foreground font-medium">{formatUSD(results[0]?.directBtcValue || 0)}</td>
                <td className="py-3 px-2 text-right text-success">0.00%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
