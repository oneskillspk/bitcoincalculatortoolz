import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OnChainMetrics } from "@/services/onChainMetricsService";
import { getMVRVLabel } from "@/services/onChainMetricsService";
import { useLanguage } from "@/contexts/LanguageContext";

interface MVRVGaugeProps {
  metrics: OnChainMetrics | null;
  loading?: boolean;
}

const zones = [
  { en: "Accumulate", tr: "Birikim", range: "< 1.0", color: "bg-success", width: "25%" },
  { en: "Fair Value", tr: "Gerçek Değer", range: "1.0 – 2.5", color: "bg-blue-500", width: "37.5%" },
  { en: "Distribute", tr: "Dağıtım", range: "2.5 – 3.5", color: "bg-amber-500", width: "25%" },
  { en: "Danger Zone", tr: "Tehlike Bölgesi", range: "> 3.5", color: "bg-destructive", width: "12.5%" },
];

export const MVRVGauge = ({ metrics, loading }: MVRVGaugeProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const mvrv = metrics?.mvrvRatio ?? null;
  const signal = metrics ? getMVRVLabel(metrics.mvrvSignal) : null;

  const needlePos = mvrv !== null
    ? Math.min(Math.max((mvrv / 5) * 100, 2), 98)
    : null;

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
          {tr ? 'MVRV Oranı' : 'MVRV Ratio'}
          {signal && !loading && (
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", signal.bg, signal.color)}>
              {signal.label}
            </span>
          )}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {tr
            ? 'Piyasa Değeri / Gerçekleşen Değer — temel zincir üstü döngü göstergesi'
            : 'Market Value to Realized Value — key on-chain cycle indicator'}
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
            <div className="text-3xl font-bold text-foreground">
              {mvrv !== null ? mvrv.toFixed(2) : '—'}
              <span className="text-sm font-normal text-muted-foreground ml-2">MVRV</span>
            </div>

            <div className="relative">
              <div className="flex h-3 rounded-full overflow-hidden">
                {zones.map((z) => (
                  <div key={z.en} className={cn(z.color, "h-full")} style={{ width: z.width }} />
                ))}
              </div>
              {needlePos !== null && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-foreground rounded-sm shadow-md"
                  style={{ left: `calc(${needlePos}% - 2px)` }}
                />
              )}
            </div>

            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
              {zones.map((z) => (
                <div key={z.en} className="text-center leading-tight">
                  <div className="font-medium">{tr ? z.tr : z.en}</div>
                  <div>{z.range}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{tr ? 'Piyasa Değeri' : 'Market Cap'}</div>
                <div className="text-sm font-semibold text-foreground">
                  {metrics ? `$${(metrics.marketCap / 1e12).toFixed(2)}T` : '—'}
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{tr ? 'Gerçekleşen Değer' : 'Realized Cap'}</div>
                <div className="text-sm font-semibold text-foreground">
                  {metrics?.realizedCap ? `$${(metrics.realizedCap / 1e12).toFixed(2)}T` : '—'}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {tr
                ? 'MVRV > 3,5 tarihsel olarak döngü zirvelerini işaretledi. MVRV < 1,0 ise döngü diplerine işaret etti.'
                : 'MVRV > 3.5 has historically marked cycle tops. MVRV < 1.0 marked cycle bottoms.'}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
