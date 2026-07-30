import { Calculator } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EnhancedErrorDisplay } from "@/components/EnhancedErrorDisplay";
import { CalculationProgressStages } from "@/components/CalculationProgressStages";
import { ModernResultsPanel } from "@/components/modern/ModernResultsPanel";
import { CalculationResult } from "@/services/bitcoinApi";
import { ResultPanel, ResultsGrid, EmptyState } from "@/components/calculator";

interface Props {
  language: string;
  error: Error | null;
  isLoading: boolean;
  result: CalculationResult | undefined;
  calculationParams: { showInBtc: boolean } | null;
  calculationStage: 'fetching-current' | 'fetching-historical' | 'fetching-range' | 'calculating' | 'complete';
  onRetry: () => void;
}

const ariaProps = (language: string) => ({
  'aria-live': 'polite' as const,
  'aria-atomic': true,
  'aria-label': language === 'tr' ? 'Hesaplama sonucu' : 'Calculator result',
});

const ResultsSkeleton = ({ language }: { language: string }) => (
  <ResultPanel
    icon={<Calculator />}
    title={language === 'tr' ? 'Yatırım Sonuçları' : 'Investment Results'}
    {...ariaProps(language)}
  >
    <Skeleton className="h-28 rounded-xl" />
    <ResultsGrid cols={2}>
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </ResultsGrid>
    <ResultsGrid cols={4}>
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
    </ResultsGrid>
  </ResultPanel>
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
      aria-label={language === 'tr' ? 'Hesaplama sonucu' : 'Calculator result'}
    >
      <ErrorBoundary>
        {error && (
          <div className="animate-fade-in motion-reduce:animate-none">
            <EnhancedErrorDisplay error={error} onRetry={onRetry} context="calculation" />
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 animate-fade-in motion-reduce:animate-none">
            <CalculationProgressStages stage={calculationStage} progress={progress} />
            <ResultsSkeleton language={language} />
          </div>
        )}

        {result && calculationParams && !isLoading && (
          <div className="animate-fade-in motion-reduce:animate-none">
            <ModernResultsPanel result={result} showInBtc={calculationParams.showInBtc} />
          </div>
        )}

        {!result && !isLoading && !error && (
          <div className="animate-fade-in motion-reduce:animate-none">
            <ResultPanel
              icon={<Calculator />}
              title={language === 'tr' ? 'Yatırım Sonuçları' : 'Investment Results'}
              {...ariaProps(language)}
            >
              <EmptyState
                icon={<Calculator />}
                title={language === 'tr' ? 'Hesaplamaya Hazır' : 'Ready to Calculate'}
                description={
                  language === 'tr'
                    ? "Yatırım detaylarınızı girin ve hesapla'ya tıklayın"
                    : 'Enter your investment details and click calculate'
                }
              />
            </ResultPanel>
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};
