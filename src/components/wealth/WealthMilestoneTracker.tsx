import { getCurrentIntlLocale } from '@/utils/parseLocaleNumber';
import { formatGroupedInt } from '@/utils/numberFormat';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import {
  DISTRIBUTION_TIERS,
  MilestoneInfo,
  PercentileResult,
} from '@/services/wealthPercentileService';
import { useLiveBitcoinPrice } from '@/hooks/useLiveBitcoinPrice';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';

interface WealthMilestoneTrackerProps {
  result: PercentileResult;
  milestone: MilestoneInfo;
}

export const WealthMilestoneTracker: React.FC<WealthMilestoneTrackerProps> = ({ result, milestone }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();
  const { price: btcPrice } = useLiveBitcoinPrice();
  const currentTierIndex = DISTRIBUTION_TIERS.indexOf(result.tier);

  return (
    <Card className="border-border/30 bg-card">
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-base">
            {tr ? 'Kademe İlerlemesi & Kilometre Taşları' : 'Tier Progress & Milestones'}
          </h3>
        </div>

        {milestone.nextTier && (
          <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{result.tier.tierEmoji} {result.tier.tierName}</span>
              <span className="text-muted-foreground">{milestone.nextTier.tierEmoji} {milestone.nextTier.tierName}</span>
            </div>
            <Progress value={milestone.currentProgress} className="h-2.5" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                {milestone.currentProgress.toFixed(1)}% {tr ? 'bir sonraki kademeye' : 'to next tier'}
              </span>
              <div className="text-foreground font-medium">
                {tr ? 'Gerekli:' : 'Need'}{' '}
                <span className="font-bold text-primary tabular-nums">
                  {milestone.btcNeeded < 1
                    ? `${milestone.btcNeeded.toFixed(4)} BTC`
                    : `${milestone.btcNeeded.toFixed(2)} BTC`}
                </span>
                {btcPrice > 0 && (
                  <span className="text-muted-foreground font-normal ml-1">
                    (≈ {formatMoney(milestone.btcNeeded * btcPrice, { tr, fxRate })})
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {milestone.nextTier && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
              <Link to={tr ? '/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi' : '/calculators/dca'}>
                <TrendingUp className="w-3.5 h-3.5" />
                DCA {tr ? 'ile' : 'to'} {milestone.nextTier.tierName}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
              <Link to={tr ? '/tr/hesaplayicilar/satoshi-biriktirme' : '/calculators/stack-sats'}>
                <Target className="w-3.5 h-3.5" />
                {tr ? 'Birikim Hedefi Belirle' : 'Set a Stacking Goal'}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
              <Link to={tr ? '/tr/hesaplayicilar/bitcoin-yatirim-hesaplayicisi' : '/calculators/investment'}>
                <ArrowRight className="w-3.5 h-3.5" />
                {tr ? 'Büyümeyi Öngör' : 'Project Growth'}
              </Link>
            </Button>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
            {tr ? 'Tüm Kademeler' : 'All Tiers'}
          </p>
          {DISTRIBUTION_TIERS.map((tier, i) => {
            const isPassed = i < currentTierIndex;
            const isCurrent = i === currentTierIndex;
            const isNext = i === currentTierIndex + 1;
            return (
              <div
                key={tier.tierName}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                  isCurrent ? 'bg-primary/5 border border-primary/20' :
                  isNext ? 'bg-muted/20 border border-border/10' :
                  'border border-transparent'
                )}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                )}
                <span className="text-sm">{tier.tierEmoji}</span>
                <span className={cn(
                  'text-sm flex-1',
                  isCurrent ? 'font-semibold text-foreground' :
                  isPassed ? 'text-muted-foreground line-through' :
                  'text-muted-foreground'
                )}>
                  {tier.tierName}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {tier.minBtc >= 1 ? `${formatGroupedInt(tier.minBtc, getCurrentIntlLocale())}+` : `${tier.minBtc}+`} BTC
                </span>
                {isCurrent && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                    {tr ? 'Siz' : 'You'}
                  </Badge>
                )}
                {isNext && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/40 text-muted-foreground">
                    {tr ? 'Sonraki' : 'Next'}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
