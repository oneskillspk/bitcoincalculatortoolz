import { Card, CardContent } from "@/components/ui/card";
import type { DrawdownPeriod, DrawdownSummary } from "@/services/drawdownService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  periods: DrawdownPeriod[];
  summary?: Pick<DrawdownSummary, 'asOf' | 'dataSource'>;
}

export const DrawdownTable = ({ periods, summary }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const formatDate = (d: string) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString(tr ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' });
  };

  const severityColor = (d: number) =>
    d >= 80 ? 'text-destructive' : d >= 50 ? 'text-orange-500' : 'text-warning';

  const sourceLabel = summary?.dataSource === 'coingecko' ? 'CoinGecko'
    : summary?.dataSource === 'cryptocompare' ? 'CryptoCompare'
    : summary?.dataSource === 'local' ? (tr ? 'Yerel anlık görüntü' : 'Local snapshot')
    : null;
  const asOfStr = summary?.asOf
    ? new Date(summary.asOf + 'T00:00:00').toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 border-b border-border/20 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {tr ? "Bitcoin'in En Büyük 10 Çöküşü" : 'Top 10 Bitcoin Crashes'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {tr
                ? "2010'dan bu yana tüm zamanların en yüksek seviyesinden %20'den fazla olan tüm düşüşler"
                : 'All drawdowns greater than 20% from all-time highs since 2010'}
            </p>
          </div>
          {sourceLabel && (
            <p className="text-xs text-muted-foreground sm:text-right shrink-0">
              {tr ? 'Veri kaynağı' : 'Data source'}: <span className="font-medium text-foreground">{sourceLabel}</span>
              {asOfStr && <> · {tr ? 'son güncelleme' : 'as of'} {asOfStr}</>}
            </p>
          )}
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden divide-y divide-border/40">
          {periods.map((p) => (
            <div key={p.rank} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted/40 text-xs font-semibold text-foreground">{p.rank}</span>
                  <span className="text-sm text-foreground">{formatDate(p.peakDate)} → {formatDate(p.troughDate)}</span>
                </div>
                <span className={`text-base font-bold tabular-nums ${severityColor(p.drawdownPercent)}`}>
                  −{p.drawdownPercent.toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">{tr ? 'Zirve' : 'Peak'}</p>
                  <p className="font-mono text-foreground">${p.peakPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">{tr ? 'Dip' : 'Trough'}</p>
                  <p className="font-mono text-foreground">${p.troughPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">{tr ? 'Dibe' : 'To trough'}</p>
                  <p className="text-foreground tabular-nums">{p.daysToTrough}{tr ? ' g' : 'd'}</p>
                </div>
                <div className="rounded-lg bg-muted/20 px-2 py-1.5">
                  <p className="text-muted-foreground">{tr ? 'Toparlanma' : 'Recovery'}</p>
                  <p className="text-foreground tabular-nums">
                    {p.recoveryDays !== null ? `${p.recoveryDays}${tr ? ' g' : 'd'}` : (
                      <span className="text-warning">{tr ? 'Devam ediyor' : 'Ongoing'}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Zirve' : 'Peak'}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Dip' : 'Trough'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Zirve Fiyatı' : 'Peak Price'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Dip Fiyatı' : 'Trough Price'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Düşüş' : 'Drawdown'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Dibe Gün' : 'Days to Trough'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Toparlanma' : 'Recovery'}</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p.rank} className="border-b border-border/20 even:bg-muted/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground tabular-nums">{p.rank}</td>
                  <td className="px-4 py-3 text-foreground">{formatDate(p.peakDate)}</td>
                  <td className="px-4 py-3 text-foreground">{formatDate(p.troughDate)}</td>
                  <td className="px-4 py-3 text-right text-foreground font-mono tabular-nums">${p.peakPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-right text-foreground font-mono tabular-nums">${p.troughPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className={`px-4 py-3 text-right font-semibold tabular-nums ${severityColor(p.drawdownPercent)}`}>−{p.drawdownPercent.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">{p.daysToTrough}{tr ? 'g' : 'd'}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {p.recoveryDays !== null
                      ? `${p.recoveryDays}${tr ? 'g' : 'd'}`
                      : <span className="text-warning">{tr ? 'Devam ediyor' : 'Ongoing'}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
