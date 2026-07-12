import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Holding } from './usePortfolioStorage';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { formatSymbolAmount } from '@/utils/numberFormat';

interface PortfolioScenarioCalculatorProps {
  holdings: Holding[];
  currencySymbol?: string;
  exchangeRate?: number;
}

const PRESETS = [100_000, 150_000, 200_000, 500_000, 1_000_000];

export const PortfolioScenarioCalculator = ({ holdings, currencySymbol = '$', exchangeRate = 1 }: PortfolioScenarioCalculatorProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [targetPrice, setTargetPrice] = useState('150000');
  const target = parseFloat(targetPrice) || 0;
  const totalBtc = holdings.reduce((s, h) => s + h.btcAmount, 0);
  const totalCost = holdings.reduce((s, h) => s + h.btcAmount * h.purchasePrice, 0);
  const projectedValue = totalBtc * target;
  const projectedProfit = projectedValue - totalCost;
  const multiple = totalCost > 0 ? projectedValue / totalCost : 0;

  const fmt = (val: number) => formatSymbolAmount(val * exchangeRate, currencySymbol, 2, tr ? 'tr-TR' : 'en-US');

  if (holdings.length === 0) return null;

  return (
    <Card className="border-border/40" data-currency-exempt="true">
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {tr ? 'Bitcoin ... Ulaşırsa Ne Olur?' : 'What If Bitcoin Reaches...'}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">$</span>
          <Input type="number" inputMode="decimal" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} className="w-40" min="0" />
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map(p => (
              <Button
                key={p}
                variant={target === p ? 'default' : 'outline'}
                size="sm"
                className="text-xs h-7"
                onClick={() => setTargetPrice(p.toString())}
              >
                ${(p / 1000).toFixed(0)}K{p >= 1_000_000 ? '' : ''}
              </Button>
            ))}
          </div>
        </div>
        {target > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">{tr ? 'Portföy değeri olurdu' : 'Portfolio would be worth'}</p>
              <p className="text-xl font-bold text-foreground">{fmt(projectedValue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">{tr ? 'Maliyet tabanının katı' : 'Multiple of cost basis'}</p>
              <p className="text-xl font-bold text-foreground">{multiple.toFixed(1)}×</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">{tr ? 'Kar' : 'Profit'}</p>
              <p className={`text-xl font-bold ${projectedProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {projectedProfit >= 0 ? '+' : ''}{fmt(projectedProfit)}
              </p>
            </div>
          </div>
        )}
        <Link to={tr ? '/tr/hesaplayicilar/bitcoin-fiyat-hedef' : '/calculators/price-target'} className="text-xs text-primary hover:underline mt-3 inline-block">
          {tr ? 'Kesin bir Bitcoin fiyat hedefi belirle →' : 'Set a precise Bitcoin price target →'}
        </Link>
      </CardContent>
    </Card>
  );
};
