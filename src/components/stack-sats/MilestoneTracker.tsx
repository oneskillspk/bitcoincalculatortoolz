import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Flag } from "lucide-react";
import { StackSatsResult } from "@/services/stackSatsCalculator";
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface MilestoneTrackerProps {
  results: StackSatsResult | null;
}

export const MilestoneTracker = ({ results }: MilestoneTrackerProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  if (!results) return null;

  return (
    <Card className="glass-morphism-card border-border/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><div className="p-2 bg-primary/10 rounded-lg"><Flag className="w-5 h-5 text-primary" /></div>{tr ? 'Hedef Kilometre Taşları' : 'Goal Milestones'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.progressMilestones.map((milestone, index) => {
            const isCompleted = results.currentProgress >= milestone.percentage;
            const isCurrent = results.currentProgress < milestone.percentage && (index === 0 || results.currentProgress >= results.progressMilestones[index - 1].percentage);
            return (
              <div key={milestone.percentage} className="relative">
                {index < results.progressMilestones.length - 1 && <div className={`absolute left-4 top-8 w-0.5 h-12 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{isCompleted ? <CheckCircle2 className="w-8 h-8 text-primary" /> : isCurrent ? <div className="w-8 h-8 rounded-full border-2 border-primary bg-primary/10 animate-pulse" /> : <Circle className="w-8 h-8 text-muted-foreground/30" />}</div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1"><h4 className="font-semibold">{milestone.percentage}% {tr ? 'Tamamlandı' : 'Complete'}</h4>{isCurrent && <Badge variant="secondary" className="text-xs">{tr ? 'Sıradaki' : 'Next'}</Badge>}</div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.btcAmount.toFixed(4)} BTC ({formatGroupedInt(milestone.btcAmount * 100000000, tr ? 'tr-TR' : 'en-US')} sats)</p>
                    <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{milestone.estimatedDate.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' })}</Badge><span className="text-xs text-muted-foreground">({milestone.monthsFromNow} {tr ? 'ay' : 'months'})</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};