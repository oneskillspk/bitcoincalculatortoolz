import { RetirementInputsPanel } from "@/components/retirement/RetirementInputsPanel";
import { RetirementResults } from "@/components/retirement/RetirementResults";
import { RetirementChart } from "@/components/retirement/RetirementChart";
import { RetirementTable } from "@/components/retirement/RetirementTable";
import { RetirementExportReport } from "@/components/retirement/RetirementExportReport";
import { FullWidthChartSection } from "@/components/charts/FullWidthChartSection";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PiggyBank } from "lucide-react";
import type { RetirementInputs } from "@/pages/BitcoinRetirementCalculator";
import type { useRetirementCalculations } from "@/components/retirement/hooks/useRetirementCalculations";

type Calculations = ReturnType<typeof useRetirementCalculations>;

interface ForecasterModeProps {
  language: string;
  inputs: RetirementInputs;
  onInputChange: (next: RetirementInputs) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  hasCalculated: boolean;
  currentBtcPrice: number;
  calculations: Calculations;
  chartView: 'chart' | 'table';
  setChartView: (v: 'chart' | 'table') => void;
}

/**
 * Forecaster mode — input panel + results + full-width projection chart.
 * Extracted from the page so the whole subtree (charts, recharts, table)
 * can ship as its own lazy chunk and only mount when the mode is active.
 */
const ForecasterMode = ({
  language,
  inputs,
  onInputChange,
  onCalculate,
  isCalculating,
  hasCalculated,
  currentBtcPrice,
  calculations,
  chartView,
  setChartView,
}: ForecasterModeProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RetirementInputsPanel
            inputs={inputs}
            onChange={onInputChange}
            currentBtcPrice={currentBtcPrice}
            onCalculate={onCalculate}
            loading={isCalculating}
          />
        </div>

        <div className="space-y-6">
          <ErrorBoundary>
            {hasCalculated ? (
              <>
                <RetirementResults
                  metrics={calculations.metrics}
                  inputs={inputs}
                  currentBtcPrice={currentBtcPrice}
                />
                <RetirementExportReport
                  mode="forecaster"
                  inputs={inputs}
                  projections={calculations.projections}
                  currentBtcPrice={currentBtcPrice}
                  chartView={chartView}
                />
              </>
            ) : (
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <div className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                      <PiggyBank className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-h3 font-semibold text-foreground">
                        {language === 'tr' ? 'Bitcoin Emekliliğinizi Planlamaya Hazır' : 'Ready to Plan Your Bitcoin Retirement'}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {language === 'tr' ? 'Parametrelerinizi yapılandırın ve kişiselleştirilmiş Bitcoin emeklilik projeksiyonlarınızı görmek için "Emeklilik Planını Hesapla"ya tıklayın' : 'Configure your parameters and click "Calculate Retirement Plan" to see your personalized Bitcoin retirement projections'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </ErrorBoundary>
        </div>
      </div>

      {hasCalculated && (
        <FullWidthChartSection
          ariaLabel={language === 'tr' ? 'Emeklilik projeksiyon grafikleri' : 'Retirement projection charts'}
          className="mt-10 lg:mt-14"
        >
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as 'chart' | 'table')} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 calc-surface-card border-0 p-1 h-auto">
              <TabsTrigger value="chart">{language === 'tr' ? 'Projeksiyon Grafiği' : 'Projection Chart'}</TabsTrigger>
              <TabsTrigger value="table">{language === 'tr' ? 'Yıl Yıl' : 'Year-by-Year'}</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-6">
              <RetirementChart projections={calculations.projections} />
            </TabsContent>
            <TabsContent value="table" className="mt-6">
              <RetirementTable projections={calculations.projections} currency={inputs.currency} />
            </TabsContent>
          </Tabs>
        </FullWidthChartSection>
      )}
    </>
  );
};

export default ForecasterMode;
