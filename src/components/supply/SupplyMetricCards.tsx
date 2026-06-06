import { Card, CardContent } from "@/components/ui/card";
import { Coins, TrendingDown, Percent, Clock } from "lucide-react";
import type { BitcoinSupplyData } from "@/services/bitcoinSupplyService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  data: BitcoinSupplyData | undefined;
  loading: boolean;
  userBtc: number;
}

export const SupplyMetricCards = ({ data, loading, userBtc }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const userPercent = data ? (userBtc / data.currentSupply) * 100 : 0;

  const cards = [
    {
      label: tr ? 'Dolaşımdaki Arz' : 'Circulating Supply',
      value: data ? data.currentSupply.toLocaleString() + " BTC" : "—",
      icon: Coins,
      sub: `${data?.percentageMined ?? 0}% of 21M ${tr ? 'madenciliği yapıldı' : 'mined'}`
    },
    {
      label: tr ? 'Madenciliği Kalan' : 'Remaining to Mine',
      value: data ? data.remainingToMine.toLocaleString() + " BTC" : "—",
      icon: TrendingDown,
      sub: tr ? '21.000.000 tavanına kadar' : 'Until 21,000,000 cap'
    },
    {
      label: tr ? 'Güncel Enflasyon Oranı' : 'Current Inflation Rate',
      value: data ? `${data.currentInflationRate}%/${tr ? 'yıl' : 'year'}` : "—",
      icon: Percent,
      sub: tr ? 'Yıllık yeni BTC / arz' : 'New BTC per year / supply'
    },
    {
      label: tr ? 'Stack\'ınızın %' : 'Your Stack %',
      value: userBtc > 0 ? `${userPercent.toFixed(8)}%` : (tr ? 'Aşağıya BTC girin' : 'Enter BTC below'),
      icon: Clock,
      sub: userBtc > 0
        ? `${userBtc} BTC / ${data?.currentSupply.toLocaleString()}`
        : (tr ? 'toplam arzın' : 'of total supply')
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <p className="text-xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
