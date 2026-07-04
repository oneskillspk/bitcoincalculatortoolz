import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { CalculationProgressStages } from "@/components/CalculationProgressStages";
import { ModernResultsPanel } from "@/components/modern/ModernResultsPanel";
import { CalculationResult } from "@/services/bitcoinApi";

interface Props {
  language: string;
  error: Error | null;
  isLoading: boolean;
  result: CalculationResult | undefined;
  calculationParams: { showInBtc: boolean } | null;
  calculationStage: 'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete';
  onRetry: () => void;
}

const ResultsSkeleton = () => (
  <Card className="glass-morphism-card border-border/20 shadow-sm animate-fade-in motion-reduce:animate-none">
    <CardContent className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-48 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-16 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

export const WhatIfResultsPanel = ({
  language, error, isLoading, result, calculationParams, calculationStage, onRetry,
}: Props) => {
  const progress =
    calculationStage === 'fetching-current' ? 25 :
    calculationStage === 'fetching-historical' ? 50 :
    calculationStage === 'fetching-range' ? 75 :
    calculationStage === 'calculating' ? 90 : 100;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      aria-label={language === 'tr' ? 'Hesaplama sonucu' : 'Calculator result'}>
      <ErrorBoundary>
        {error && (
          <div className="animate-fade-in motion-reduce:animate-none">
            <EnhancedErrorDisplay error={error} onRetry={onRetry} context="calculation" />
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 animate-fade-in motion-reduce:animate-none">
            <CalculationProgressStages stage={calculationStage} progress={progress} />
            <ResultsSkeleton />
          </div>
        )}

        {result && calculationParams && !isLoading && (
          <div className="animate-fade-in motion-reduce:animate-none">
            <ModernResultsPanel result={result} showInBtc={calculationParams.showInBtc} />
          </div>
        )}

        {!result && !isLoading && !error && (
          <Card className="glass-morphism-card border-border/20 shadow-sm animate-fade-in motion-reduce:animate-none">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {language === 'tr' ? 'Hesaplamaya Hazır' : 'Ready to Calculate'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'tr' ? 'Yatırım detaylarınızı girin ve hesapla\'ya tıklayın' : 'Enter your investment details and click calculate'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </ErrorBoundary>
    </div>
  );
};
