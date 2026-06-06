import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { getHistoricalAssets } from "@/services/cagrCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

const NASDAQ_DATA = {
  name: "Nasdaq 100",
  ticker: "QQQ",
  icon: "💻",
  color: "#7C3AED",
  startPrice: 109.93,
  endPrice: 521.50,
  volatility: 22.4,
  maxDrawdown: -35.1,
};

function calc(start: number, end: number, years: number) {
  const totalReturn = ((end - start) / start) * 100;
  const cagr = (Math.pow(end / start, 1 / years) - 1) * 100;
  return { totalReturn, cagr };
}

export const CAGRAssetComparisonTab = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const assets = getHistoricalAssets();
  const nasdaq = {
    ...NASDAQ_DATA,
    ...calc(NASDAQ_DATA.startPrice, NASDAQ_DATA.endPrice, 10),
  };

  const rows = [
    ...assets.map((a) => ({
      name: a.name,
      ticker: a.ticker,
      icon: a.icon,
      color: a.color,
      cagr: a.cagr,
      totalReturn: a.totalReturn,
      volatility: a.volatility,
      maxDrawdown: a.maxDrawdown,
    })),
    {
      name: nasdaq.name,
      ticker: nasdaq.ticker,
      icon: nasdaq.icon,
      color: nasdaq.color,
      cagr: nasdaq.cagr,
      totalReturn: nasdaq.totalReturn,
      volatility: nasdaq.volatility,
      maxDrawdown: nasdaq.maxDrawdown,
    },
  ].sort((a, b) => b.cagr - a.cagr);

  const maxAbsCagr = Math.max(...rows.map((r) => Math.abs(r.cagr)));

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'BTC vs Ana Varlıklar (10Y BYBÜ)' : 'BTC vs Major Assets (10Y CAGR)'}
            </h2>
            <p className="text-sm text-muted-foreground">{tr ? 'Oca 2016 → Oca 2026 · USD bazlı' : 'Jan 2016 → Jan 2026 · USD-denominated'}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {rows.map((r) => {
            const widthPct = Math.max(4, (Math.abs(r.cagr) / maxAbsCagr) * 100);
            return (
              <div key={r.ticker} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <span>{r.icon}</span> {r.name}
                    <span className="text-xs text-muted-foreground">({r.ticker})</span>
                  </span>
                  <span className="font-bold tabular-nums" style={{ color: r.color }}>
                    {r.cagr.toFixed(1)}% {tr ? 'BYBÜ' : 'CAGR'}
                  </span>
                </div>
                <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${widthPct}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
          <table className="w-full text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-border/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">{tr ? 'Varlık' : 'Asset'}</th>
                <th className="py-2 px-2 font-medium text-right">{tr ? 'BYBÜ' : 'CAGR'}</th>
                <th className="py-2 px-2 font-medium text-right">{tr ? 'Toplam Getiri' : 'Total Return'}</th>
                <th className="py-2 px-2 font-medium text-right">{tr ? 'Oynaklık' : 'Volatility'}</th>
                <th className="py-2 pl-2 font-medium text-right">{tr ? 'Maks. Düşüş' : 'Max DD'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.ticker} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    <span className="mr-1.5">{r.icon}</span>
                    {r.name}
                  </td>
                  <td className="py-3 px-2 text-right font-bold tabular-nums" style={{ color: r.color }}>
                    {r.cagr.toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-foreground">
                    {r.totalReturn >= 1000 ? `${(r.totalReturn / 1000).toFixed(1)}K%` : `${r.totalReturn.toFixed(0)}%`}
                  </td>
                  <td className="py-3 px-2 text-right tabular-nums text-muted-foreground">
                    {r.volatility.toFixed(1)}%
                  </td>
                  <td className="py-3 pl-2 text-right tabular-nums text-destructive">
                    {r.maxDrawdown.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          {tr
            ? "Bitcoin'in 10 yıllık BYBÜ'sü, en iyi büyük hisse senedi endeksi olan Nasdaq 100'ün katları kadardır. Ancak oynaklık ve maksimum düşüş profili farklı bir kategoridedir. Gayrimenkul (VNQ) yalnızca toplam fiyat olarak gösterilmiştir; temettü yeniden yatırımı BYBÜ'yü yaklaşık 3-4 puan artırır."
            : "Bitcoin's 10-year CAGR is multiples of Nasdaq 100 — the next-best major equity index — but its volatility and drawdown profile sit in a different category. Real Estate (VNQ) is shown total-price only; dividend reinvestment would lift its CAGR by roughly 3-4 percentage points."}
        </p>
      </CardContent>
    </Card>
  );
};
