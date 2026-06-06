import { Card, CardContent } from "@/components/ui/card";
import { Crown, DollarSign, BarChart3, Coins } from "lucide-react";
import type { DominanceData } from "@/services/dominanceService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  data: DominanceData | undefined;
  loading: boolean;
}

function fmt(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return `$${n.toLocaleString()}`;
}

export const DominanceMetricCards = ({ data, loading }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const cards = [
    { label: tr ? 'BTC Dominansı' : 'BTC Dominance', value: data ? `${data.btcDominance.toFixed(1)}%` : "—", icon: Crown, sub: tr ? 'toplam kripto piyasasının' : 'of total crypto market' },
    { label: tr ? 'BTC Piyasa Değeri' : 'BTC Market Cap', value: data ? fmt(data.btcMarketCap) : "—", icon: DollarSign, sub: tr ? 'Güncel değerleme' : 'Current valuation' },
    { label: tr ? 'Toplam Kripto Piyasası' : 'Total Crypto Market', value: data ? fmt(data.totalMarketCap) : "—", icon: BarChart3, sub: tr ? 'Tüm kripto paralar' : 'All cryptocurrencies' },
    { label: tr ? 'BTC Fiyatı' : 'BTC Price', value: data ? `$${data.btcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—", icon: Coins, sub: tr ? 'Canlı fiyat' : 'Live price' },
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
                <p className="text-2xl font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
