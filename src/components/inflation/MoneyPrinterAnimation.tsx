import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentIntlLocale } from "@/utils/parseLocaleNumber";

interface MoneyPrinterAnimationProps {
  perSecond: number;
  currencySymbol: string;
  currency?: string;
  growthRate?: number;
  dataAsOfYear?: number;
  loading?: boolean;
}

/**
 * Enterprise-grade live M2 money supply ticker.
 * Counter advances continuously via requestAnimationFrame using elapsed
 * wall-clock time × per-second issuance derived from official annual
 * M2 growth (FRED/ECB/BoE). No fabricated demo data.
 */
export const MoneyPrinterAnimation = ({
  perSecond,
  currencySymbol,
  currency = "USD",
  growthRate,
  dataAsOfYear,
  loading,
}: MoneyPrinterAnimationProps) => {
  const { language } = useLanguage();
  const tr = language === "tr";
  const [printed, setPrinted] = useState(0);
  const startRef = useRef<number>(performance.now());
  const rafRef = useRef<number>();

  // Reset baseline whenever the per-second rate changes (e.g. currency switch)
  useEffect(() => {
    startRef.current = performance.now();
    setPrinted(0);
  }, [perSecond]);

  useEffect(() => {
    if (!perSecond || perSecond <= 0) return;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setPrinted(elapsed * perSecond);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [perSecond]);

  const locale = getCurrentIntlLocale();

  const formatCompact = (value: number) => {
    if (value >= 1_000_000_000) return `${currencySymbol}${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${currencySymbol}${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${currencySymbol}${(value / 1_000).toFixed(2)}K`;
    return `${currencySymbol}${value.toFixed(0)}`;
  };

  const formatExact = (value: number) =>
    `${currencySymbol}${value.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const perMinute = perSecond * 60;
  const perHour = perSecond * 3600;
  const perDay = perSecond * 86400;

  const labels = tr
    ? {
        title: "Para Basım Takipçisi",
        subtitle: "Bu sayfayı açtığınızdan beri yaratılan para",
        live: "Canlı",
        perSecond: "Saniyede",
        perMinute: "Dakikada",
        perHour: "Saatte",
        perDay: "Günde",
        source: (y: number, r: number) =>
          `${currency} M2 para arzı · ${y} verisi · yıllık %${r.toFixed(1)} büyüme`,
        loading: "Yükleniyor…",
      }
    : {
        title: "Money Supply Live Ticker",
        subtitle: "Created since you opened this page",
        live: "Live",
        perSecond: "Per second",
        perMinute: "Per minute",
        perHour: "Per hour",
        perDay: "Per day",
        source: (y: number, r: number) =>
          `${currency} M2 money supply · ${y} data · ${r.toFixed(1)}% annual growth`,
        loading: "Loading…",
      };

  return (
    <Card className="border border-border/60 bg-card shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-muted/60 border border-border/50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-foreground/70" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {labels.title}
              </h3>
              <p className="text-xs text-muted-foreground">{labels.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-primary opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
            </span>
            {labels.live}
          </div>
        </div>

        {/* Main counter */}
        <div className="px-6 py-8 text-center border-b border-border/50 bg-muted/20">
          {loading || perSecond <= 0 ? (
            <div className="h-12 w-64 mx-auto bg-muted animate-pulse rounded" />
          ) : (
            <div className="font-mono font-semibold text-4xl md:text-5xl text-foreground tabular-nums tracking-tight">
              {formatCompact(printed)}
            </div>
          )}
          <div className="mt-2 text-xs text-muted-foreground font-mono tabular-nums">
            {perSecond > 0 ? formatExact(printed) : labels.loading}
          </div>
        </div>

        {/* Rate breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/50">
          {[
            { label: labels.perSecond, value: perSecond, compact: false },
            { label: labels.perMinute, value: perMinute, compact: false },
            { label: labels.perHour, value: perHour, compact: true },
            { label: labels.perDay, value: perDay, compact: true },
          ].map((row) => (
            <div key={row.label} className="px-5 py-4">
              <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {row.label}
              </div>
              <div className="font-mono font-semibold text-base text-foreground tabular-nums">
                {perSecond > 0
                  ? row.compact
                    ? formatCompact(row.value)
                    : `${currencySymbol}${row.value.toLocaleString(locale, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}`
                  : "—"}
              </div>
            </div>
          ))}
        </div>

        {/* Source footer */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border/50">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {growthRate && dataAsOfYear
              ? labels.source(dataAsOfYear, growthRate)
              : labels.loading}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
