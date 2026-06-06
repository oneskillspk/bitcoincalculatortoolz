import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useMemo } from "react";
import { calculateScenario } from "@/services/dominanceService";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  circulatingSupply: number;
  currentDominance: number;
}

export const DominanceScenarioModeler = ({ circulatingSupply, currentDominance }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [totalMcapT, setTotalMcapT] = useState(3);
  const [dominance, setDominance] = useState(Math.round(currentDominance));

  const scenario = useMemo(
    () => calculateScenario(totalMcapT, dominance, circulatingSupply),
    [totalMcapT, dominance, circulatingSupply]
  );

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm" data-currency-exempt="true">
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-foreground">
          {tr ? 'Fiyat Senaryo Modelleyici' : 'Price Scenario Modeler'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {tr
            ? 'Tahmini Bitcoin fiyatını görmek için toplam kripto piyasa değerini ve BTC dominansını ayarlayın.'
            : 'Adjust total crypto market cap and BTC dominance to see the implied Bitcoin price.'}
        </p>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">{tr ? 'Toplam Kripto Piyasa Değeri' : 'Total Crypto Market Cap'}</span>
              <span className="text-sm font-medium text-foreground">${totalMcapT}T</span>
            </div>
            <Slider value={[totalMcapT]} onValueChange={([v]) => setTotalMcapT(v)} min={1} max={20} step={0.5} />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">{tr ? 'BTC Dominansı' : 'BTC Dominance'}</span>
              <span className="text-sm font-medium text-foreground">{dominance}%</span>
            </div>
            <Slider value={[dominance]} onValueChange={([v]) => setDominance(v)} min={20} max={90} step={1} />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground mb-1">{tr ? 'Tahmini BTC Fiyatı' : 'Implied BTC Price'}</p>
          <p className="text-3xl font-bold text-foreground">
            ${scenario.impliedBtcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tr
              ? `$${totalMcapT}T toplam piyasa × %${dominance} dominans`
              : `at $${totalMcapT}T total market × ${dominance}% dominance`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
