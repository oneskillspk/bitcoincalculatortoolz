import { Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

export const WhatIfResultsPanel = ({
  language, error, isLoading, result, calculationParams, calculationStage, onRetry,
}: Props) => {
  const progress =
    calculationStage === 'fetching-current' ? 25 :
    calculationStage === 'fetching-historical' ? 50 :
    calculationStage === 'fetching-range' ? 75 :
    calculationStage === 'calculating' ? 90 : 100;

  return (
    <div>
      <ErrorBoundary>
        {error && (
          <EnhancedErrorDisplay error={error} onRetry={onRetry} context="calculation" />
        )}

        {isLoading && (
          <CalculationProgressStages stage={calculationStage} progress={progress} />
        )}

        {result && calculationParams && !isLoading && (
          <ModernResultsPanel result={result} showInBtc={calculationParams.showInBtc} />
        )}

        {!result && !isLoading && !error && (
          <Card className="glass-morphism-card border-border/20 shadow-sm">
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
