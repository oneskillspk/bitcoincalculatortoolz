import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle2, Clock } from 'lucide-react';
import { MilestoneResult } from '@/services/bitcoinSavingsCalculator';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface SavingsMilestonesTrackerProps {
  milestones: MilestoneResult[];
}

export const SavingsMilestonesTracker = ({ milestones }: SavingsMilestonesTrackerProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  return (
    <Card className="border border-border/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-primary" />
          {tr ? 'Tasarruf Kilometre Taşları' : 'Savings Milestones'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((ms) => (
            <div
              key={ms.name}
              className={cn(
                "border rounded-xl p-4 space-y-3 transition-all",
                ms.isReachable ? "border-primary/30 bg-primary/5" : "border-border/30 bg-muted/20 opacity-70"
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">{ms.name}</h4>
                {ms.isReachable ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {formatGroupedInt(ms.targetSats, locale)} sats ({ms.targetBtc} BTC)
              </p>

              <Progress value={Math.min(ms.progress, 100)} className="h-2" />

              <div className="text-xs text-muted-foreground space-y-0.5">
                {ms.monthsToReach !== null ? (
                  <>
                    <p>
                      <span className="font-medium text-foreground">{ms.monthsToReach}</span>{' '}
                      {tr ? `ay (${(ms.monthsToReach / 12).toFixed(1)} yıl)` : `months (${(ms.monthsToReach / 12).toFixed(1)} years)`}
                    </p>
                    {ms.estimatedDate && (
                      <p>{tr ? 'Hedef:' : 'Target:'} {format(ms.estimatedDate, 'MMM yyyy')}</p>
                    )}
                    {ms.totalFiatInvested !== null && (
                      <p>{tr ? 'Yatırım:' : 'Investment:'} ${formatGroupedInt(ms.totalFiatInvested, locale)}</p>
                    )}
                  </>
                ) : (
                  <p className="italic">{tr ? 'Çok uzun vadeli hedef' : 'Very long-term goal'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
