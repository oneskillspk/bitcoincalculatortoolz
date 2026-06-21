import { FireModeInputsPanel, type FireModeInputs } from "@/components/retirement/FireModeInputsPanel";
import { FireModeResults, FireModeScenariosPanel } from "@/components/retirement/FireModeResults";
import { RetirementExportReport } from "@/components/retirement/RetirementExportReport";
import { FullWidthChartSection } from "@/components/charts/FullWidthChartSection";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Flame } from "lucide-react";

interface FireModeProps {
  language: string;
  fireInputs: FireModeInputs;
  onFireInputChange: (next: FireModeInputs) => void;
  onFireCalculate: () => void;
  isFireCalculating: boolean;
  hasFireCalculated: boolean;
  currentBtcPrice: number;
  fireResults: any;
}

/**
 * FIRE mode — extracted so the scenarios panel + chart visuals are only
 * downloaded when the user opens this tab.
 */
const FireMode = ({
  language,
  fireInputs,
  onFireInputChange,
  onFireCalculate,
  isFireCalculating,
  hasFireCalculated,
  currentBtcPrice,
  fireResults,
}: FireModeProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <FireModeInputsPanel
            inputs={fireInputs}
            onChange={onFireInputChange}
            currentBtcPrice={currentBtcPrice}
            onCalculate={onFireCalculate}
            loading={isFireCalculating}
          />
        </div>

        <div className="space-y-6">
          <ErrorBoundary>
            {hasFireCalculated ? (
              <>
                <FireModeResults
                  results={fireResults}
                  inputs={fireInputs}
                  currentBtcPrice={currentBtcPrice}
                  summaryOnly
                />
                <RetirementExportReport
                  mode="fire"
                  fireInputs={fireInputs}
                  fireResults={fireResults}
                  currentBtcPrice={currentBtcPrice}
                />
              </>
            ) : (
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <div className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mx-auto">
                      <Flame className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-h3 font-semibold text-foreground">
                        {language === 'tr' ? 'FIRE Tarihinizi Bulmaya Hazır mısınız?' : 'Ready to Find Your FIRE Date?'}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {language === 'tr' ? "Bitcoin'in sizi ne zaman finansal özgürlüğe kavuşturabileceğini keşfetmek için yıllık harcamalarınızı ve çekim oranınızı ayarlayın" : 'Set your annual expenses and withdrawal rate to discover when Bitcoin could make you financially independent'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </ErrorBoundary>
        </div>
      </div>

      {hasFireCalculated && fireResults && (
        <FullWidthChartSection
          ariaLabel={language === 'tr' ? 'FIRE büyüme senaryoları' : 'FIRE growth scenarios'}
          className="mt-10 lg:mt-14"
        >
          <FireModeScenariosPanel results={fireResults} inputs={fireInputs} />
        </FullWidthChartSection>
      )}
    </>
  );
};

export default FireMode;
