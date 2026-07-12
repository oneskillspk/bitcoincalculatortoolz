import { Card, CardContent } from "@/components/ui/card";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import type { AssetVolatility } from "@/services/volatilityService";
import { getStockVsBtcComparison } from "@/services/volatilityService";
import { VolatilityStockComparison } from "./VolatilityStockComparison";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: AssetVolatility[];
}

function getVolColor(vol: number): string {
  if (vol < 20) return '#22c55e';
  if (vol < 40) return '#eab308';
  if (vol < 60) return '#f97316';
  return '#ef4444';
}

export const VolatilityComparisonTab = ({ data }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const chartData = data.map(a => ({ name: a.asset, vol: a.vol30d }));
  const btcVol30 = data.find(a => a.asset === 'Bitcoin')?.vol30d ?? 0;
  const stocks = getStockVsBtcComparison(btcVol30);

  return (
    <div className="space-y-6">
      {/* Hero stat strip */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{tr ? 'Altın\'a karşı' : 'vs Gold'}</div>
              <div className="text-2xl font-bold text-foreground">
                {btcVol30 > 0 ? `${(btcVol30 / 14.2).toFixed(1)}×` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">{tr ? 'Bitcoin yıllıklaştırılmış vol katsayısı' : 'Bitcoin annualized vol multiple'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{tr ? 'S&P 500\'e karşı' : 'vs S&P 500'}</div>
              <div className="text-2xl font-bold text-foreground">
                {btcVol30 > 0 ? `${(btcVol30 / 16.5).toFixed(1)}×` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">{tr ? 'Canlı BTC / kıyaslama hisse senetleri' : 'Live BTC over benchmark equities'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">{tr ? 'Ethereum\'a karşı' : 'vs Ethereum'}</div>
              <div className="text-2xl font-bold text-foreground">
                {btcVol30 > 0 ? `${(btcVol30 / 65).toFixed(2)}×` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">{tr ? 'BTC altında, ETH üstünde' : 'BTC under, ETH over'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tr ? 'Bitcoin ile Diğer Varlıklar — Volatilite Karşılaştırması' : 'Bitcoin vs Other Assets — Volatility Comparison'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">{tr ? 'Varlık' : 'Asset'}</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? '30 Günlük Vol' : '30-Day Vol'}</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? '1 Yıllık Vol' : '1-Year Vol'}</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">{tr ? 'BTC\'ye karşı' : 'vs BTC'}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a.asset} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{a.asset}</td>
                    <td className="py-3 px-4 text-right text-foreground">{a.vol30d.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-foreground">{a.annualized.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{a.vsBtc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {tr
              ? 'Not: Bitcoin verisi canlıdır. NVIDIA, Tesla, Ethereum, S&P 500 ve Altın yaklaşık referans değerleri kullanır, periyodik olarak güncellenir.'
              : 'Note: Bitcoin data is live. NVIDIA, Tesla, Ethereum, S&P 500, and Gold use approximate reference values updated periodically.'}
          </p>
        </CardContent>
      </Card>

      {/* Bar chart */}
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {tr ? 'Varlığa Göre 30 Günlük Volatilite' : '30-Day Volatility by Asset'}
          </h3>
          <PerformantResponsiveContainer height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
              <Tooltip
                contentStyle={chartTooltipStyle}
                formatter={(v: number) => [`${v.toFixed(1)}%`, tr ? 'Volatilite' : 'Volatility']}
              />
              <Bar dataKey="vol" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={getVolColor(entry.vol)} />
                ))}
              </Bar>
            </BarChart>
          </PerformantResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual stock comparison */}
      <VolatilityStockComparison data={stocks} btcVol30={btcVol30} />
    </div>
  );
};
