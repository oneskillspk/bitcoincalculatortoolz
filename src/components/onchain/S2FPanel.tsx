import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnChainMetrics } from "@/services/onChainMetricsService";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatGroupedInt } from "@/utils/numberFormat";

interface S2FPanelProps {
  metrics: OnChainMetrics | null;
  loading?: boolean;
}

export const S2FPanel = ({ metrics, loading }: S2FPanelProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const deviation = metrics?.s2fDeviation ?? null;
  const isAbove = deviation !== null && deviation > 0;
  const isBelow = deviation !== null && deviation < 0;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">
          {tr ? 'Stok-Akış Modeli' : 'Stock-to-Flow Model'}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {tr
            ? 'PlanB\'nin S2F oranı, Bitcoin\'in mevcut arzını yıllık yeni arzıyla karşılaştırır'
            : "PlanB's S2F ratio compares Bitcoin's existing supply to annual new issuance"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{tr ? 'S2F Oranı' : 'S2F Ratio'}</div>
                <div className="text-xl font-bold text-foreground">
                  {metrics ? metrics.s2fRatio.toFixed(1) : '—'}
                </div>
                <div className="text-xs text-muted-foreground">{tr ? 'yıllık arz' : 'years of supply'}</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{tr ? 'S2F Model Fiyatı' : 'S2F Model Price'}</div>
                <div className="text-xl font-bold text-foreground">
                  {metrics
                    ? '$' + formatGroupedInt(metrics.s2fModelPrice, tr ? 'tr-TR' : 'en-US')
                    : '—'}
                </div>
                <div className="text-xs text-muted-foreground">{tr ? 'tahmini gerçek değer' : 'projected fair value'}</div>
              </div>
            </div>

            {deviation !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{tr ? 'Fiyat vs S2F Modeli' : 'Price vs S2F Model'}</span>
                  <span className={cn(
                    "font-semibold flex items-center gap-1",
                    isAbove ? "text-warning" : isBelow ? "text-success" : "text-muted-foreground"
                  )}>
                    {isAbove ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", isAbove ? "bg-amber-500" : "bg-success")}
                    style={{ width: `${Math.min(Math.abs(deviation) / 2, 100)}%`, marginLeft: isBelow ? 'auto' : undefined }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAbove
                    ? (tr
                        ? `Bitcoin, S2F model fiyatının %${deviation.toFixed(0)} üzerinde işlem görüyor — tarihsel olarak düzeltmelere zemin hazırlamıştır.`
                        : `Bitcoin is trading ${deviation.toFixed(0)}% above the S2F model price — historically this has preceded corrections.`)
                    : (tr
                        ? `Bitcoin, S2F model fiyatının %${Math.abs(deviation).toFixed(0)} altında işlem görüyor — tarihsel olarak alım fırsatı olarak değerlendirilmiştir.`
                        : `Bitcoin is trading ${Math.abs(deviation).toFixed(0)}% below the S2F model price — historically a buying opportunity.`)}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t border-border/20 pt-2">
              <strong>{tr ? 'Not:' : 'Note:'}</strong>{' '}
              {tr
                ? 'S2F, 4. yarılanma sonrası akışa (~164.250 BTC/yıl) dayanmaktadır. Model fiyatı PlanB\'nin yayımladığı kuvvet yasası katsayılarını kullanır. Bu bir sinyal olup fiyat tahmini değildir.'
                : "S2F is based on post-4th halving flow (~164,250 BTC/year). Model price uses PlanB's published power law coefficients. This is one signal, not a price prediction."}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
