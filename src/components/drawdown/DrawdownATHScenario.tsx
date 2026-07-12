import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateATHScenario, type ATHScenario, type DrawdownSummary } from "@/services/drawdownService";
import { TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatGroupedInt, formatGroupedDecimal } from "@/utils/numberFormat";

interface Props {
  summary: DrawdownSummary;
}

export const DrawdownATHScenario = ({ summary }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [investment, setInvestment] = useState(1000);
  const scenario: ATHScenario = calculateATHScenario(summary.athPrice, summary.athDate, summary.currentPrice, investment);
  const locale = tr ? 'tr-TR' : 'en-US';

  const athDateStr = new Date(summary.athDate + 'T00:00:00').toLocaleDateString(
    tr ? 'tr-TR' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  );

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {tr ? 'En Yüksek Noktada Alım Yapsaydınız' : 'If You Bought at the All-Time High'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tr
                ? `ATH ${athDateStr} tarihinde $${formatGroupedInt(summary.athPrice, 'tr-TR')} idi`
                : `ATH was $${formatGroupedInt(summary.athPrice, 'en-US')} on ${athDateStr}`}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {tr ? 'Yatırım Tutarı (USD)' : 'Investment Amount (USD)'}
          </label>
          <Input
            type="number" inputMode="decimal"
            min={1}
            value={investment || ''}
            onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
          />
          <div className="flex gap-2">
            {[500, 1000, 5000, 10000].map((amt) => (
              <Button key={amt} variant="outline" size="sm" className="text-xs" onClick={() => setInvestment(amt)}>
                ${formatGroupedInt(amt, locale)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">{tr ? 'Alınan BTC' : 'BTC Bought'}</p>
            <p className="text-sm font-bold text-foreground">{scenario.btcBought.toFixed(6)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">{tr ? 'Güncel Değer' : 'Current Value'}</p>
            <p className="text-sm font-bold text-foreground">${formatGroupedDecimal(scenario.currentValue, 2, locale)}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">{tr ? 'Kâr / Zarar' : 'Profit / Loss'}</p>
            <p className={`text-sm font-bold ${scenario.profitUsd >= 0 ? 'text-success' : 'text-destructive'}`}>
              {scenario.profitUsd >= 0 ? '+' : ''}{scenario.profitUsd < 0 ? '-' : ''}${formatGroupedDecimal(Math.abs(scenario.profitUsd), 2, locale)}
            </p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">{tr ? 'Getiri' : 'Return'}</p>
            <p className={`text-sm font-bold ${scenario.lossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {scenario.lossPercent >= 0 ? '+' : ''}{scenario.lossPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
