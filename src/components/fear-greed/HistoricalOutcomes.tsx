import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type FGHistoricalOutcome } from '@/services/fearGreedService';
import { History, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface HistoricalOutcomesProps {
  outcomes: FGHistoricalOutcome[];
  isLoading?: boolean;
}

export const HistoricalOutcomes: React.FC<HistoricalOutcomesProps> = ({
  outcomes,
  isLoading,
}) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  if (isLoading) {
    return (
      <Card className="border-border/20 bg-card shadow-lg">
        <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            {tr ? 'BTC fiyat verileriyle geçmiş sonuçlar analiz ediliyor...' : 'Analyzing historical outcomes with BTC price data...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (outcomes.length === 0) return null;

  const formatReturn = (val: number) => {
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  };

  const returnRows = [
    { labelEn: '7-day avg.', labelTr: '7 günlük ort.', key: 'avgReturn7d' as const },
    { labelEn: '30-day avg.', labelTr: '30 günlük ort.', key: 'avgReturn30d' as const },
    { labelEn: '90-day avg.', labelTr: '90 günlük ort.', key: 'avgReturn90d' as const },
  ];

  return (
    <Card className="border-border/20 bg-card shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2.5 text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <History className="w-4 h-4 text-primary" />
          </div>
          {tr ? 'Sonra Ne Oldu?' : 'What Happened Next?'}
        </CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tr
            ? 'Endeks belirli duyarlılık seviyelerine ulaştığında Bitcoin\'in tarihsel ortalama getirileri.'
            : 'Historical average Bitcoin returns after the index reached specific sentiment levels.'}
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {outcomes.map((outcome) => (
            <div
              key={outcome.range}
              className="p-4 rounded-xl border border-border/20 bg-gradient-to-b from-muted/30 to-muted/10 space-y-3 hover:border-border/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-offset-1 ring-offset-card"
                  style={{ backgroundColor: outcome.color, boxShadow: `0 0 8px ${outcome.color}40` }}
                />
                <h4 className="font-bold text-sm text-foreground">{outcome.label}</h4>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {tr ? `Endeks ${outcome.range} • ${outcome.count} olay` : `Index ${outcome.range} • ${outcome.count} occurrences`}
              </p>

              <div className="space-y-2.5 pt-1">
                {returnRows.map(({ labelEn, labelTr, key }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tr ? labelTr : labelEn}</span>
                    <span
                      className={cn(
                        'text-sm font-bold flex items-center gap-1 tabular-nums',
                        outcome[key] >= 0 ? 'text-success' : 'text-destructive'
                      )}
                    >
                      {outcome[key] >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {formatReturn(outcome[key])}
                    </span>
                  </div>
                ))}
              </div>

              {outcome.medianReturn30d !== 0 && (
                <div className="pt-2 border-t border-border/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                      {tr ? '30g Medyan' : 'Median 30d'}
                    </span>
                    <span className={cn(
                      'text-xs font-semibold tabular-nums',
                      outcome.medianReturn30d >= 0 ? 'text-success' : 'text-destructive'
                    )}>
                      {formatReturn(outcome.medianReturn30d)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-warning/$3 border border-warning/15 text-xs text-warning dark:text-warning">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">
            {tr
              ? 'Geçmiş performans gelecekteki sonuçları garanti etmez. Bu analiz yalnızca eğitim amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir.'
              : 'Past performance does not guarantee future results. This analysis is for educational purposes only and should not be considered financial advice.'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
