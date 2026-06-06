import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PerformantResponsiveContainer } from "@/components/optimized/PerformantResponsiveContainer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { ChevronDown } from "lucide-react";
import { getHourlyVolatilityData } from "@/services/volatilityService";
import type { VolatilityData } from "@/services/volatilityService";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { chartTooltipStyle } from '@/components/calculator/chartTokens';

interface Props {
  data: VolatilityData | undefined;
}

function heatColor(val: number, max: number): string {
  const ratio = val / max;
  if (ratio < 0.4) return '#22c55e';
  if (ratio < 0.6) return '#eab308';
  if (ratio < 0.8) return '#f97316';
  return '#ef4444';
}

export const VolatilityHeatmaps = ({ data }: Props) => {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const isTr = language === 'tr';

  const hourlyData = getHourlyVolatilityData();
  const maxHourly = Math.max(...hourlyData.map(h => h.avgVol));
  const maxDow = data ? Math.max(...data.dayOfWeekVol.map(d => d.avgVol)) : 1;

  if (!data) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="glass-morphism-card border-border/20 shadow-sm">
        <CollapsibleTrigger className="w-full">
          <CardContent className="p-6 flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-foreground text-left">
                {isTr ? 'Gelişmiş: Oynaklık Örüntüleri' : 'Advanced: Volatility Patterns'}
              </h3>
              <p className="text-sm text-muted-foreground text-left">
                {isTr ? 'Haftanın günü ve günün saati analizi' : 'Day-of-week and hour-of-day analysis'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="px-6 pb-6 space-y-8">
            <div>
              <h4 className="text-base font-medium text-foreground mb-3">
                {isTr
                  ? 'Haftanın Gününe Göre Ortalama Günlük Getiri Büyüklüğü'
                  : 'Average Daily Return Magnitude by Day of Week'}
              </h4>
              <PerformantResponsiveContainer height={250}>
                <BarChart data={data.dayOfWeekVol}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(v: number) => [`${v.toFixed(2)}%`, isTr ? 'Ort. |Getiri|' : 'Avg |Return|']}
                  />
                  <Bar dataKey="avgVol" radius={[4, 4, 0, 0]}>
                    {data.dayOfWeekVol.map((entry, i) => (
                      <Cell key={i} fill={heatColor(entry.avgVol, maxDow)} />
                    ))}
                  </Bar>
                </BarChart>
              </PerformantResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">
                {isTr
                  ? 'Pazartesi ve Salı günleri tarihsel olarak daha yüksek oynaklık gösterir. Hafta sonu seansları genellikle daha sakin geçer.'
                  : 'Monday and Tuesday historically show higher volatility. Weekend sessions tend to be calmer.'}
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-foreground mb-3">
                {isTr ? 'Saate Göre Ortalama Oynaklık (UTC)' : 'Average Volatility by Hour (UTC)'}
              </h4>
              <PerformantResponsiveContainer height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    formatter={(v: number) => [`${v.toFixed(1)}%`, isTr ? 'Ort. Oynaklık' : 'Avg Vol']}
                  />
                  <Bar dataKey="avgVol" radius={[4, 4, 0, 0]}>
                    {hourlyData.map((entry, i) => (
                      <Cell key={i} fill={heatColor(entry.avgVol, maxHourly)} />
                    ))}
                  </Bar>
                </BarChart>
              </PerformantResponsiveContainer>
              <p className="text-xs text-muted-foreground mt-2">
                {isTr ? (
                  <>Tepe oynaklık: <strong>08:00–10:00 UTC</strong> (Londra açılışı + NY öncesi piyasa örtüşmesi). En düşük: 00:00–04:00 UTC (geç Asya seansı).</>
                ) : (
                  <>Peak volatility: <strong>08:00–10:00 UTC</strong> (London open + NY pre-market overlap). Lowest: 00:00–04:00 UTC (late Asian session).</>
                )}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="text-base font-medium text-foreground mb-2">
                {isTr ? 'Oynaklık Yüzdeliği' : 'Volatility Percentile'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isTr ? (
                  <>Güncel 30 günlük oynaklık, geçen yılın tüm hareketli 30 günlük okumalarının <strong className="text-foreground">{data.volatilityPercentile}. yüzdeliğindedir</strong>. {data.volatilityPercentile < 25 ? 'Bu tarihsel olarak çok düşük — genellikle büyük bir hareketten önce gelir.' : data.volatilityPercentile > 75 ? 'Bu yüksek — büyük günlük dalgalanmaların devam etmesi beklenir.' : "Bu Bitcoin için normal aralıktadır."}</>
                ) : (
                  <>Current 30-day volatility is in the <strong className="text-foreground">{data.volatilityPercentile}th percentile</strong> of all rolling 30-day readings from the past year. {data.volatilityPercentile < 25 ? "This is historically very low — often precedes a major move." : data.volatilityPercentile > 75 ? "This is elevated — expect continued large daily swings." : "This is within the normal range for Bitcoin."}</>
                )}
              </p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
