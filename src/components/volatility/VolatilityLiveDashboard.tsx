import { Card, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp, BarChart3, Shield, ArrowUpDown, Gauge } from "lucide-react";
import type { VolatilityData } from "@/services/volatilityService";
import { cn } from "@/lib/utils";
import { VolatilityShareSnapshot } from "./VolatilityShareSnapshot";
import { useLanguage } from "@/contexts/LanguageContext";

const regimeConfig = {
  low: { en: "Low", tr: "Düşük", color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  normal: { en: "Normal", tr: "Normal", color: "text-info", bg: "bg-info/$3", border: "border-info/20" },
  high: { en: "High", tr: "Yüksek", color: "text-warning", bg: "bg-warning/$3", border: "border-warning/20" },
  extreme: { en: "Extreme", tr: "Aşırı", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

interface Props {
  data: VolatilityData | undefined;
  loading: boolean;
}

export const VolatilityLiveDashboard = ({ data, loading }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const regime = data ? regimeConfig[data.regime] : null;

  const cards = [
    { label: tr ? "7 Günlük Volatilite" : "7-Day Volatility", value: data ? `${data.vol7d.toFixed(1)}%` : "—", icon: Activity, sub: tr ? "Yıllıklaştırılmış" : "Annualized" },
    { label: tr ? "30 Günlük Volatilite" : "30-Day Volatility", value: data ? `${data.vol30d.toFixed(1)}%` : "—", icon: BarChart3, sub: tr ? "Yıllıklaştırılmış" : "Annualized" },
    { label: tr ? "60 Günlük Volatilite" : "60-Day Volatility", value: data ? `${data.vol60d.toFixed(1)}%` : "—", icon: TrendingUp, sub: tr ? "Yıllıklaştırılmış" : "Annualized" },
    { label: tr ? "90 Günlük Volatilite" : "90-Day Volatility", value: data ? `${data.vol90d.toFixed(1)}%` : "—", icon: TrendingUp, sub: tr ? "Yıllıklaştırılmış" : "Annualized" },
    { label: tr ? "1 Yıllık Volatilite" : "1-Year Volatility", value: data ? `${data.vol1y.toFixed(1)}%` : "—", icon: BarChart3, sub: tr ? "Yıllıklaştırılmış" : "Annualized" },
    {
      label: tr ? "Güncel Rejim" : "Current Regime",
      value: regime ? (tr ? regime.tr : regime.en) : "—",
      icon: Shield,
      sub: tr ? "30 günlük volatiliteye göre" : "Based on 30-day vol",
      customColor: regime?.color,
    },
  ];

  const moveCards = data ? [
    {
      label: tr ? "Beklenen Günlük Hareket" : "Expected Daily Move",
      pct: `±${data.expectedDailyMove.toFixed(2)}%`,
      usd: `±$${Math.round(data.currentPrice * data.expectedDailyMove / 100).toLocaleString()}`,
      icon: ArrowUpDown,
    },
    {
      label: tr ? "Beklenen Haftalık Hareket" : "Expected Weekly Move",
      pct: `±${data.expectedWeeklyMove.toFixed(2)}%`,
      usd: `±$${Math.round(data.currentPrice * data.expectedWeeklyMove / 100).toLocaleString()}`,
      icon: ArrowUpDown,
    },
    {
      label: tr ? "Beklenen Aylık Hareket" : "Expected Monthly Move",
      pct: `±${data.expectedMonthlyMove.toFixed(2)}%`,
      usd: `±$${Math.round(data.currentPrice * data.expectedMonthlyMove / 100).toLocaleString()}`,
      icon: ArrowUpDown,
    },
    {
      label: tr ? "Volatilite Yüzdelik" : "Volatility Percentile",
      pct: `${data.volatilityPercentile}${tr ? '.' : 'th'}`,
      usd: tr ? "1 yıllık geçmişe göre" : "vs 1-year history",
      icon: Gauge,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Share snapshot */}
      {!loading && data && <VolatilityShareSnapshot data={data} />}

      {/* Volatility metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="glass-morphism-card border-border/20 shadow-sm">
            <CardContent className="p-5">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
                  </div>
                  <p className={cn("text-2xl font-bold", c.customColor ?? "text-foreground")}>{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expected moves */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moveCards.map((c) => (
            <Card key={c.label} className="glass-morphism-card border-border/20 shadow-sm">
              <CardContent className="p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{c.pct}</p>
                  <p className="text-xs text-muted-foreground">{c.usd}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Formula transparency */}
      {!loading && (
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 space-y-1">
          <p><strong>{tr ? 'Formül:' : 'Formula:'}</strong> {tr ? 'Gerçekleşen Vol = StdDev(ln(P' : 'Realized Vol = StdDev(ln(P'}<sub>t</sub>/P<sub>t-1</sub>)) × √365</p>
          <p><strong>{tr ? 'Beklenen Günlük Hareket:' : 'Expected Daily Move:'}</strong> {tr ? 'Yıllıklaştırılmış Vol ÷ √365' : 'Annualized Vol ÷ √365'}</p>
          <p className="text-muted-foreground/70">{tr ? 'Veri kaynağı: CoinGecko günlük kapanış fiyatları • Her 5 dakikada bir güncellenir' : 'Data source: CoinGecko daily closing prices • Updated every 5 minutes'}</p>
        </div>
      )}
    </div>
  );
};
