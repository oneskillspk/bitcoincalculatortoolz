import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { BandStatistic } from '@/services/rainbowChartService';
import { localizeBandName } from '@/components/rainbow/bandLabels';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';
import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';

const bandStrategyEn: Record<number, { meaning: string; strategy: string }> = {
  9: { meaning: 'Extreme euphoric pricing versus the long-term curve.', strategy: 'Reduce risk, avoid leverage, document assumptions.' },
  8: { meaning: 'Historically overheated market conditions.', strategy: 'Rebalance or take profits if allocation is too large.' },
  7: { meaning: 'Momentum and attention are accelerating.', strategy: 'Avoid emotional buys; compare with drawdown history.' },
  6: { meaning: 'Above fair-value zone with rising bubble risk.', strategy: 'Use smaller buys or wait for volatility.' },
  5: { meaning: 'Middle of the model range.', strategy: 'Hold or DCA according to plan.' },
  4: { meaning: 'Below the model midpoint.', strategy: 'Long-term accumulators often add gradually here.' },
  3: { meaning: 'Historically attractive accumulation range.', strategy: 'DCA, review cash reserves, avoid over-sizing.' },
  2: { meaning: 'Deep undervaluation by this model.', strategy: 'High-conviction buyers may increase planned buys.' },
  1: { meaning: 'Rare capitulation-style pricing.', strategy: 'Check market stress, custody risk, and liquidity first.' },
};

const bandStrategyTr: Record<number, { meaning: string; strategy: string }> = {
  9: { meaning: 'Uzun vadeli eğriye kıyasla aşırı öforik fiyatlama.', strategy: 'Riski azalt, kaldıraçtan kaçın, varsayımları belgele.' },
  8: { meaning: 'Tarihsel olarak aşırı ısınmış piyasa koşulları.', strategy: 'Tahsisi yeniden dengele veya çok büyükse kar al.' },
  7: { meaning: 'Momentum ve ilgi hızlanıyor.', strategy: 'Duygusal alımlardan kaçın; düşüş geçmişiyle karşılaştır.' },
  6: { meaning: 'Artan balon riskiyle adil değer bölgesinin üstü.', strategy: 'Daha küçük alımlar yap veya volatilite için bekle.' },
  5: { meaning: 'Model aralığının ortası.', strategy: 'Plana göre tut veya DCA yap.' },
  4: { meaning: 'Model orta noktasının altı.', strategy: 'Uzun vadeli biriktiriciler genellikle burada kademeli olarak ekler.' },
  3: { meaning: 'Tarihsel olarak çekici birikim aralığı.', strategy: 'DCA yap, nakit rezervlerini gözden geçir, aşırı büyütmekten kaçın.' },
  2: { meaning: 'Bu modele göre derin düşük değerleme.', strategy: 'Yüksek ikna alıcılar planlı alımlarını artırabilir.' },
  1: { meaning: 'Nadir kapitülasyon tarzı fiyatlama.', strategy: 'Önce piyasa stresini, saklama riskini ve likiditeyi kontrol et.' },
};

interface RainbowBandLegendProps {
  bandStats: BandStatistic[];
  currentBandIndex: number;
  isLoading: boolean;
}

export const RainbowBandLegend: React.FC<RainbowBandLegendProps> = ({ bandStats, currentBandIndex, isLoading }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (isLoading) {
    return (
      <Card className="border-border/20 bg-card shadow-card">
        <CardContent className="p-6">
          <div className="space-y-3">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedStats = [...bandStats].reverse();
  const bandStrategy = tr ? bandStrategyTr : bandStrategyEn;

  return (
    <Card className="border-border/20 bg-card shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette className="w-4 h-4 text-primary" />
          </div>
          <CardTitle className="text-lg">{tr ? 'Gökkuşağı Band Açıklaması' : 'Rainbow Band Legend'}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-4">
        <div className="space-y-1">
          {sortedStats.map(stat => {
            const isCurrent = stat.index === currentBandIndex;
            return (
              <div
                key={stat.index}
                className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200', isCurrent ? 'ring-1 ring-primary/30 shadow-sm' : 'hover:bg-muted/30')}
                style={isCurrent ? { backgroundColor: `${stat.color}08` } : undefined}
              >
                <div className={cn('w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white/10 transition-transform', isCurrent && 'scale-110')} style={{ backgroundColor: stat.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-sm font-medium truncate', isCurrent ? 'text-foreground font-semibold' : 'text-foreground/80')}>
                      {localizeBandName(stat.name, tr)}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        {tr ? 'SİZ' : 'YOU'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    ${formatGroupedInt(stat.currentLower, getCurrentIntlLocale())}
                    {' – '}
                    ${formatGroupedInt(stat.currentUpper, getCurrentIntlLocale())}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 w-14">
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-8 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(stat.percentageOfHistory * 3, 100)}%`, backgroundColor: stat.color }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono tabular-nums">{stat.percentageOfHistory.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 px-2">
          {tr
            ? 'Yüzdeler Bitcoin tarihinin her bantta ne kadarını geçirdiğini gösteriyor'
            : "Percentages show how much of Bitcoin's history the price spent in each band"}
        </p>

        <section aria-labelledby="rainbow-band-table" className="mt-6 overflow-x-auto">
          <h3 id="rainbow-band-table" className="text-base font-semibold text-foreground mb-3">
            {tr ? 'Bitcoin Gökkuşağı Grafiği Band Anlamları' : 'Bitcoin Rainbow Chart Band Meanings'}
          </h3>
          <table className="w-full text-sm border border-border/40 rounded-xl overflow-hidden">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-medium">{tr ? 'Band' : 'Band'}</th>
                <th className="text-left p-3 font-medium">{tr ? 'Anlam' : 'Meaning'}</th>
                <th className="text-left p-3 font-medium">{tr ? 'Tipik Kullanım' : 'Typical use'}</th>
                <th className="text-right p-3 font-medium">{tr ? 'Tarih' : 'History'}</th>
              </tr>
            </thead>
            <tbody>
              {sortedStats.map((stat) => (
                <tr key={`table-${stat.index}`} className="border-t border-border/30">
                  <td className="p-3 min-w-48">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                      <span className="font-medium text-foreground">{localizeBandName(stat.name, tr)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground min-w-56">{bandStrategy[stat.index]?.meaning}</td>
                  <td className="p-3 text-muted-foreground min-w-56">{bandStrategy[stat.index]?.strategy}</td>
                  <td className="p-3 text-right font-mono text-muted-foreground">{stat.percentageOfHistory.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </CardContent>
    </Card>
  );
};
