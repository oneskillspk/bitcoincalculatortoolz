import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { MempoolBlock } from "@/services/transactionFeeCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";

interface MempoolVisualizationProps {
  blocks: MempoolBlock[];
  userFeeRate: number;
  isLoading: boolean;
}

export const MempoolVisualization = ({
  blocks,
  userFeeRate,
  isLoading
}: MempoolVisualizationProps) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  const getBlockColor = (medianFee: number) => {
    if (medianFee >= 50) return 'from-destructive to-destructive';
    if (medianFee >= 30) return 'from-primary to-primary';
    if (medianFee >= 15) return 'from-primary to-primary-glow';
    return 'from-success to-success';
  };

  const getBlockBorderColor = (medianFee: number) => {
    if (medianFee >= 50) return 'border-destructive/50';
    if (medianFee >= 30) return 'border-primary/50';
    if (medianFee >= 15) return 'border-primary/50';
    return 'border-success/50';
  };

  const findUserBlockIndex = () => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.feeRange.length > 0) {
        const minFee = Math.min(...block.feeRange);
        if (userFeeRate >= minFee) {
          return i;
        }
      }
    }
    return blocks.length; // User's tx would be in later blocks
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-28 sm:h-32 w-20 sm:w-24 shrink-0" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (blocks.length === 0) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">Unable to load mempool blocks</p>
        </CardContent>
      </Card>
    );
  }

  const userBlockIndex = findUserBlockIndex();

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Box className="w-5 h-5 text-primary" />
          <span className="hidden sm:inline">{t('txfee.mempool.projectedNextBlocks')}</span>
          <span className="sm:hidden">{t('txfee.mempool.nextBlocksShort')}</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">See where your transaction would land based on current fee rate</span>
          <span className="sm:hidden">Your TX placement by fee rate</span>
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Mobile scroll hint */}
        <div className="sm:hidden text-center mb-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            ← Scroll to see more blocks →
          </span>
        </div>

        {/* Scroll container with gradient indicators */}
        <div className="relative">
          {/* Left fade indicator */}
          <div className="absolute left-0 top-0 bottom-4 w-6 bg-gradient-to-r from-card/90 to-transparent pointer-events-none z-10 sm:hidden" />
          {/* Right fade indicator */}
          <div className="absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-card/90 to-transparent pointer-events-none z-10 sm:hidden" />
          
          <div className="flex gap-1.5 sm:gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent px-1">
            {blocks.map((block, index) => {
              const isUserBlock = index === userBlockIndex;
              const feeMin = block.feeRange.length > 0 ? Math.round(Math.min(...block.feeRange)) : 0;
              const feeMax = block.feeRange.length > 0 ? Math.round(Math.max(...block.feeRange)) : 0;
              
              return (
                <div
                  key={index}
                  className={`
                    relative shrink-0 min-w-[68px] w-[72px] sm:w-28 
                    p-1.5 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300
                    ${isUserBlock 
                      ? 'ring-1 ring-primary/60 ring-offset-1 ring-offset-background scale-[1.03] shadow-sm' 
                      : 'hover:scale-[1.02]'
                    }
                    ${getBlockBorderColor(block.medianFee)}
                    bg-gradient-to-br ${getBlockColor(block.medianFee)} shadow-sm
                  `}
                >
                  {/* Block Number - Single identifier */}
                  <div className="text-center mb-1 sm:mb-2">
                    <p className="text-sm sm:text-lg font-bold text-white leading-tight">
                      +{index + 1}
                    </p>
                    <span className="text-[8px] sm:text-[10px] sm:text-xs text-white/80">
                      <span className="hidden sm:inline">Next Block</span>
                      <span className="sm:hidden">Block</span>
                    </span>
                  </div>

                  {/* Fee Range */}
                  <div className="text-center space-y-0.5">
                    <p className="text-[9px] sm:text-xs text-white/75">Range</p>
                    <p className="text-xs sm:text-sm font-mono font-semibold leading-tight truncate text-white">
                      {feeMin}-{feeMax}
                    </p>
                    <p className="text-[7px] sm:text-xs text-white/75">sat/vB</p>
                  </div>

                  {/* Transaction Count */}
                  <div className="mt-1 sm:mt-2 text-center">
                    <Badge variant="outline" className="text-[7px] sm:text-[10px] sm:text-xs px-1 sm:px-1.5 py-0 border-white/40 text-white bg-white/10">
                      {isMobile 
                        ? `${(block.nTx / 1000).toFixed(1)}k` 
                        : `${block.nTx.toLocaleString()} txs`
                      }
                    </Badge>
                  </div>

                  {/* User Indicator */}
                  {isUserBlock && (
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Zap className="w-2 h-2 sm:w-3 sm:h-3" />
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Later blocks indicator */}
            {userBlockIndex >= blocks.length && (
              <div className="shrink-0 min-w-[68px] w-[72px] sm:w-28 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">Later</p>
                  <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5">
                    <span className="hidden sm:inline">Future block</span>
                    <span className="sm:hidden">Future</span>
                  </p>
                  <div className="mt-1 sm:mt-2 bg-primary text-primary-foreground rounded-full p-0.5 inline-block">
                    <Zap className="w-2 h-2 sm:w-3 sm:h-3" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/30">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-success to-success" />
            <span className="text-[9px] sm:text-xs text-muted-foreground">&lt;15</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow" />
            <span className="text-[9px] sm:text-xs text-muted-foreground">15-30</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-primary to-primary" />
            <span className="text-[9px] sm:text-xs text-muted-foreground">30-50</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-destructive to-destructive" />
            <span className="text-[9px] sm:text-xs text-muted-foreground">&gt;50</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
