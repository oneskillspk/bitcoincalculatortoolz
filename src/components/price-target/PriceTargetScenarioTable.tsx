import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { ScenarioRow } from '@/services/priceTargetCalculator';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUsdToTryRate } from '@/hooks/useUsdToTryRate';
import { formatMoney } from '@/utils/formatMoney';

interface Props {
  rows: ScenarioRow[];
  highlightIndex: number;
}

const fmt = (v: number, dec = 0) => v.toLocaleString(undefined, { maximumFractionDigits: dec });
const fmtPrice = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${(v / 1_000).toFixed(0)}k`;
};

export const PriceTargetScenarioTable: React.FC<Props> = ({ rows, highlightIndex }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  return (
    <Card className="border-border/30 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          {tr ? 'Fiyat Senaryo Tablosu' : 'Price Scenario Table'}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">{tr ? 'Fiyat Hedefi' : 'Price Target'}</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">{tr ? 'Portföy Değeri' : 'Portfolio Value'}</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">{tr ? 'Kazanç %' : 'Gain %'}</th>
              <th className="text-right py-2 px-3 text-muted-foreground font-medium">{tr ? 'Çarpan' : 'Multiplier'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.targetPrice} className={cn("border-b border-border/20 transition-colors", i === highlightIndex && "bg-primary/10 border-primary/30")}>
                <td className={cn("py-3 px-3 font-medium font-mono", i === highlightIndex && "text-primary")}>
                  {fmtPrice(row.targetPrice)}
                  {i === highlightIndex && <span className="ml-2 text-xs text-primary">≈ {tr ? 'Canlı' : 'Live'}</span>}
                </td>
                <td className="py-3 px-3 text-right font-mono">{formatMoney(row.portfolioValue, { tr, fxRate })}</td>
                <td className={cn("py-3 px-3 text-right font-mono", row.gainPercent >= 0 ? "text-success" : "text-destructive")}>
                  {row.gainPercent >= 0 ? '+' : ''}{fmt(row.gainPercent)}%
                </td>
                <td className="py-3 px-3 text-right font-mono">{row.multiplier.toFixed(1)}x</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
