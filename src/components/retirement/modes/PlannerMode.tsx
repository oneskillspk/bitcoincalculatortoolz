import { GoalPlannerInputsPanel, type GoalPlannerInputs } from "@/components/retirement/GoalPlannerInputsPanel";
import { GoalPlannerResults } from "@/components/retirement/GoalPlannerResults";
import { RetirementChart } from "@/components/retirement/RetirementChart";
import { RetirementTable } from "@/components/retirement/RetirementTable";
import { RetirementExportReport } from "@/components/retirement/RetirementExportReport";
import { FullWidthChartSection } from "@/components/charts/FullWidthChartSection";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Target } from "lucide-react";

interface PlannerModeProps {
  language: string;
  goalInputs: GoalPlannerInputs;
  onGoalInputChange: (next: GoalPlannerInputs) => void;
  onGoalCalculate: () => void;
  isGoalCalculating: boolean;
  hasGoalCalculated: boolean;
  currentBtcPrice: number;
  goalResults: any;
  chartView: 'chart' | 'table';
  setChartView: (v: 'chart' | 'table') => void;
}

/**
 * Goal Planner mode — extracted from the page so the chart + table chunks
 * only load when the user opens this tab.
 */
const PlannerMode = ({
  language,
  goalInputs,
  onGoalInputChange,
  onGoalCalculate,
  isGoalCalculating,
  hasGoalCalculated,
  currentBtcPrice,
  goalResults,
  chartView,
  setChartView,
}: PlannerModeProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <GoalPlannerInputsPanel
            inputs={goalInputs}
            onChange={onGoalInputChange}
            currentBtcPrice={currentBtcPrice}
            onCalculate={onGoalCalculate}
            loading={isGoalCalculating}
          />
        </div>

        <div className="space-y-6">
          <ErrorBoundary>
            {hasGoalCalculated ? (
              <>
                <GoalPlannerResults results={goalResults} inputs={goalInputs} currentBtcPrice={currentBtcPrice} />
                <RetirementExportReport
                  mode="planner"
                  goalInputs={goalInputs}
                  goalResults={goalResults}
                  currentBtcPrice={currentBtcPrice}
                  chartView={chartView}
                />
              </>
            ) : (
              <Card className="glass-morphism-card border-border/20 shadow-sm">
                <div className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-soft text-blue-accent flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-h3 font-semibold text-foreground">
                        {language === 'tr' ? 'Finansal Özgürlük Yolunuzu Planlamaya Hazır' : 'Ready to Plan Your Path to Financial Freedom'}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {language === 'tr' ? 'Emeklilik hayallerinizi anlatın, aylık ne kadar yatırım yapmanız gerektiğini tam olarak hesaplayalım' : "Tell us your retirement dreams and we'll calculate exactly how much you need to invest monthly to make them reality"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </ErrorBoundary>
        </div>
      </div>

      {hasGoalCalculated && goalResults?.projections && (
        <FullWidthChartSection
          ariaLabel={language === 'tr' ? 'Hedef planlayıcı projeksiyonları' : 'Goal Planner projections'}
          className="mt-10 lg:mt-14"
        >
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as 'chart' | 'table')} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 calc-surface-card border-0 p-1 h-auto">
              <TabsTrigger value="chart">{language === 'tr' ? 'Projeksiyon Grafiği' : 'Projection Chart'}</TabsTrigger>
              <TabsTrigger value="table">{language === 'tr' ? 'Yıl Yıl' : 'Year-by-Year'}</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-6">
              <RetirementChart projections={goalResults.projections} />
            </TabsContent>
            <TabsContent value="table" className="mt-6">
              <RetirementTable projections={goalResults.projections} currency={goalInputs.currency} />
            </TabsContent>
          </Tabs>
        </FullWidthChartSection>
      )}
    </>
  );
};

export default PlannerMode;
