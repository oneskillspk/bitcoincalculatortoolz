import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, ArrowDown, Clock, BarChart3 } from "lucide-react";
import type { DrawdownSummary } from "@/services/drawdownService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  summary: DrawdownSummary;
}

export const DrawdownMetricCards = ({ summary }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const metrics = [
    {
      label: tr ? 'Güncel Düşüş' : 'Current Drawdown',
      value: summary.currentDrawdown > 0 ? `-${summary.currentDrawdown.toFixed(1)}%` : (tr ? 'ATH\'de' : 'At ATH'),
      sub: `ATH: $${summary.athPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: TrendingDown,
      color: summary.currentDrawdown > 20 ? "text-destructive" : summary.currentDrawdown > 0 ? "text-amber-500" : "text-success",
    },
    {
      label: tr ? 'En Kötü Çöküş' : 'Worst Crash Ever',
      value: `-${summary.maxDrawdown.toFixed(1)}%`,
      sub: tr ? `${summary.totalCrashes} büyük çöküş boyunca` : `Across ${summary.totalCrashes} major crashes`,
      icon: ArrowDown,
      color: "text-destructive",
    },
    {
      label: tr ? 'Ortalama Düşüş' : 'Average Drawdown',
      value: `-${summary.avgDrawdown.toFixed(1)}%`,
      sub: tr ? '%20+ düzeltmelerden' : 'Of 20%+ corrections',
      icon: BarChart3,
      color: "text-amber-500",
    },
    {
      label: tr ? 'Ort. Toparlanma Süresi' : 'Avg Recovery Time',
      value: tr ? `${summary.avgRecoveryDays} gün` : `${summary.avgRecoveryDays} days`,
      sub: tr ? `~${(summary.avgRecoveryDays / 30).toFixed(0)} ay` : `~${(summary.avgRecoveryDays / 30).toFixed(0)} months`,
      icon: Clock,
      color: "text-primary",
    },
  ];

  const sourceLabel = summary.dataSource === 'coingecko' ? 'CoinGecko'
    : summary.dataSource === 'cryptocompare' ? 'CryptoCompare'
    : (tr ? 'Yerel anlık görüntü' : 'Local snapshot');
  const asOfStr = summary.asOf
    ? new Date(summary.asOf + 'T00:00:00').toLocaleDateString(tr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="glass-morphism-card border-border/20 shadow-sm">
            <CardContent className="p-5 text-center space-y-2">
              <m.icon className={`w-6 h-6 mx-auto ${m.color}`} />
              <p className={`text-2xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
              <p className="text-xs font-medium text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {tr ? 'Veri kaynağı' : 'Data source'}: <span className="font-medium text-foreground">{sourceLabel}</span>
        {asOfStr && <> · {tr ? 'son güncelleme' : 'as of'} {asOfStr}</>}
      </p>
    </div>
  );
};
