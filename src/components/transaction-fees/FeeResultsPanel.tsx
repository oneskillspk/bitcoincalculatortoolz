import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Clock, Zap, Leaf, TrendingDown, CheckCircle2, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { FeeEstimate, AllFeeEstimates, Priority } from "@/services/transactionFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultPanel, ResultsGrid, ResultCard } from "@/components/calculator";

interface FeeResultsPanelProps {
  selectedEstimate: FeeEstimate | null;
  allEstimates: AllFeeEstimates | null;
  selectedPriority: Priority;
  savingsVsLegacy: number;
  transactionSize: number;
  isLoading: boolean;
}

export const FeeResultsPanel = ({
  selectedEstimate, allEstimates, selectedPriority, savingsVsLegacy, transactionSize, isLoading,
}: FeeResultsPanelProps) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const getPriorityIcon = (p: string) => {
    switch (p) {
      case 'fastest': return <Zap className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'halfHour': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'hour': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'economy': return <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return null;
    }
  };

  const getPriorityLabel = (p: string, short = false) => {
    const labels: Record<string, { full: string; short: string; fullTr: string; shortTr: string }> = {
      fastest: { full: 'Fastest', short: 'Fast', fullTr: 'En Hızlı', shortTr: 'Hızlı' },
      halfHour: { full: '30 min', short: '30m', fullTr: '30 dk', shortTr: '30d' },
      hour: { full: '1 hour', short: '1hr', fullTr: '1 saat', shortTr: '1s' },
      economy: { full: 'Economy', short: 'Eco', fullTr: 'Ekonomik', shortTr: 'Eko' },
    };
    if (tr) return short ? (labels[p]?.shortTr ?? p) : (labels[p]?.fullTr ?? p);
    return short ? (labels[p]?.short ?? p) : (labels[p]?.full ?? p);
  };

  if (isLoading) {
    return (
      <ResultPanel title={tr ? 'Yükleniyor' : 'Loading'}
      aria-live="polite"
      aria-atomic="true"
      aria-label={tr ? "Hesaplama sonucu" : "Calculator result"}>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 sm:h-24" />)}</div>
        <Skeleton className="h-48" />
      </ResultPanel>
    );
  }

  if (!selectedEstimate || !allEstimates) {
    return (
      <ResultPanel>
        <p className="text-center text-muted-foreground py-8">{tr ? 'Ücret tahminleri yükleniyor...' : 'Loading fee estimates...'}</p>
      </ResultPanel>
    );
  }

  return (
    <ResultPanel
      icon={<DollarSign />}
      title={tr ? 'Ücret Tahmini' : 'Fee Estimate'}
      accentBar="primary"
      action={
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
          {getPriorityIcon(selectedPriority)}
          <span className="ml-1">{isMobile ? getPriorityLabel(selectedPriority, true) : getPriorityLabel(selectedPriority)}</span>
        </Badge>
      }
    >
      <ResultsGrid cols={4}>
        <ResultCard
          label={tr ? 'Ücret Oranı' : 'Fee Rate'}
          value={selectedEstimate.satsPerVbyte}
          sub="sat/vB"
          tone="primary"
          size="lg"
        />
        <ResultCard
          label={tr ? 'Toplam Ücret' : 'Total Fee'}
          value={selectedEstimate.totalFeeSats.toLocaleString()}
          sub={tr ? 'satoshi' : 'satoshis'}
          size="lg"
        />
        <ResultCard
          label={tr ? 'USD Değeri' : 'USD Value'}
          value={`$${selectedEstimate.totalFeeUsd < 0.01 ? selectedEstimate.totalFeeUsd.toFixed(4) : selectedEstimate.totalFeeUsd.toFixed(2)}`}
          sub={tr ? 'güncel fiyatta' : 'at current price'}
          size="lg"
        />
        <ResultCard
          label={tr ? 'Tahmini Süre' : 'Est. Time'}
          value={selectedEstimate.confirmationTime}
          sub={`~${selectedEstimate.confirmationBlocks} ${tr ? 'blok' : selectedEstimate.confirmationBlocks > 1 ? 'blocks' : 'block'}`}
          size="lg"
        />
      </ResultsGrid>

      <ResultsGrid cols={3}>
        <ResultCard icon={<Info />} label={tr ? 'TX Boyutu' : 'TX Size'} value={`${transactionSize} vB`} size="sm" />
        {savingsVsLegacy > 0 && (
          <ResultCard icon={<TrendingDown />} label={tr ? 'Eski\'ye karşı' : 'vs Legacy'} value={`-${savingsVsLegacy}%`} tone="positive" size="sm" />
        )}
        {selectedEstimate.feePercentage > 0 && (
          <ResultCard
            icon={<DollarSign />}
            label={tr ? 'Ücret %' : 'Fee %'}
            value={selectedEstimate.feePercentage < 0.01 ? '<0.01%' : `${selectedEstimate.feePercentage.toFixed(2)}%`}
            size="sm"
          />
        )}
      </ResultsGrid>

      <div className="space-y-2 sm:space-y-3">
        <h3 className="calc-text-label flex items-center gap-2 text-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          {tr ? 'Tüm Öncelik Seviyelerini Karşılaştır' : 'Compare All Priority Levels'}
        </h3>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="rounded-lg border border-border/50 overflow-hidden min-w-[360px] sm:min-w-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-[10px] sm:text-xs">{tr ? 'Öncelik' : 'Priority'}</TableHead>
                  <TableHead className="text-[10px] sm:text-xs text-right">{tr ? 'Oran' : 'Rate'}</TableHead>
                  <TableHead className="text-[10px] sm:text-xs text-right">Sats</TableHead>
                  <TableHead className="text-[10px] sm:text-xs text-right">USD</TableHead>
                  <TableHead className="text-[10px] sm:text-xs text-right">{tr ? 'Süre' : 'Time'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(['fastest', 'halfHour', 'hour', 'economy'] as const).map((p) => {
                  const estimate = allEstimates[p];
                  const isSelected = p === selectedPriority;
                  return (
                    <TableRow key={p} className={isSelected ? 'bg-primary/10' : 'hover:bg-muted/20'}>
                      <TableCell className="font-medium py-2 sm:py-3">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {getPriorityIcon(p)}
                          <span className={`text-xs sm:text-sm ${isSelected ? 'text-primary' : ''}`}>
                            {isMobile ? getPriorityLabel(p, true) : getPriorityLabel(p)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs sm:text-sm py-2 sm:py-3">
                        {estimate.satsPerVbyte}<span className="hidden sm:inline"> sat/vB</span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs sm:text-sm py-2 sm:py-3">{estimate.totalFeeSats.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">
                        ${estimate.totalFeeUsd < 0.01 ? estimate.totalFeeUsd.toFixed(4) : estimate.totalFeeUsd.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm text-muted-foreground py-2 sm:py-3">{estimate.confirmationTime}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="calc-surface-subtle border-info/20 bg-info/$3 flex items-start gap-2 p-3 cursor-help">
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info mt-0.5 shrink-0" />
              <p className="calc-text-small text-info">
                <strong>{tr ? 'İpucu:' : 'Tip:'}</strong>{' '}
                {tr ? 'İşleminiz acil değilse, düşük ağ yoğunluğunu beklemek ücretleri %50+ azaltabilir.' : "If your transaction isn't urgent, waiting for lower network congestion can reduce fees by 50% or more."}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tr ? 'Ağ yoğunluğu gün boyunca değişir' : 'Network congestion varies throughout the day'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ResultPanel>
  );
};
