import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingDown } from "lucide-react";
import { HalvingEvent } from "@/services/bitcoinSupplyService";
import { useLanguage } from "@/contexts/LanguageContext";

interface HalvingTimelineProps {
  halvings: HalvingEvent[];
}

export const HalvingTimeline = ({ halvings }: HalvingTimelineProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="border-border/50 bg-card" data-currency-exempt="true">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg">
            {tr ? 'Bitcoin Yarılanma Takvimi' : 'Bitcoin Halving Schedule'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {halvings.map((halving, index) => (
            <div
              key={halving.number}
              className={`relative pl-8 pb-4 ${index !== halvings.length - 1 ? 'border-l-2 border-border/50' : ''}`}
            >
              <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${
                halving.estimated ? 'bg-muted border-muted-foreground' : 'bg-orange-500 border-orange-500'
              }`} />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">
                      {halving.estimated ? '🔮 ' : ''}
                      {tr ? `${halving.number}. Yarılanma` : `Halving #${halving.number}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(halving.date).toLocaleDateString(tr ? 'tr-TR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {halving.estimated && (tr ? ' (Tahmini)' : ' (Estimated)')}
                    </p>
                  </div>
                  {halving.btcPrice && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{tr ? 'BTC Fiyatı' : 'BTC Price'}</p>
                      <p className="font-semibold text-sm">${halving.btcPrice.toLocaleString(getCurrentIntlLocale())}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground mb-1">{tr ? 'Blok' : 'Block'}</p>
                    <p className="font-mono font-semibold">{halving.blockHeight.toLocaleString(getCurrentIntlLocale())}</p>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-muted-foreground mb-1">{tr ? 'Ödül' : 'Reward'}</p>
                    <p className="font-semibold">{halving.rewardAfter} BTC</p>
                  </div>
                  <div className="p-2 rounded bg-success/10 flex items-center justify-center">
                    <div className="flex items-center gap-1 text-success">
                      <TrendingDown className="w-3 h-3" />
                      <span className="font-semibold">-50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tr
              ? 'Her 210.000 blokta bir (~4 yılda bir), Bitcoin\'in arz enflasyon oranı yarıya iner ve tüm 21 milyon BTC madencileneceği 2140 yılına doğru sıfıra yaklaşır.'
              : "Every 210,000 blocks (~4 years), Bitcoin's supply inflation rate is cut in half, approaching zero by 2140 when all 21 million BTC will be mined."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
