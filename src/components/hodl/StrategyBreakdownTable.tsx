import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StrategyResult } from '@/services/hodlStrategyCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrencyAmount } from '@/utils/formatCurrency';
import { formatGroupedInt, formatGroupedDecimal } from '@/utils/numberFormat';

interface StrategyBreakdownTableProps {
  strategies: StrategyResult[];
  currency: string;
}

export const StrategyBreakdownTable = ({ strategies, currency }: StrategyBreakdownTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  if (strategies.length === 0) return null;

  const formatCurrency = (value: number) => formatCurrencyAmount(value, currency, { locale });
  const pct = (n: number) => formatGroupedDecimal(n, 1, locale);
  const btc = (n: number) => formatGroupedDecimal(n, 4, locale);
  const intFmt = { format: (n: number) => formatGroupedInt(n, locale) };




  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{tr ? 'Strateji Dökümü' : 'Strategy Breakdown'}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/50">
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground py-3">{tr ? 'Strateji' : 'Strategy'}</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">{tr ? 'Yatırım' : 'Invested'}</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">{tr ? 'Son Değer' : 'Final Value'}</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">ROI</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">BTC</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">{tr ? 'Ort. Fiyat' : 'Avg Price'}</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">{tr ? 'Alım Sayısı' : 'Purchases'}</th>
                <th className="text-right text-sm font-medium text-muted-foreground py-3">{tr ? 'Maks DD' : 'Max DD'}</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy.type} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="py-3 text-sm font-medium text-foreground">{strategy.name}</td>
                  <td className="py-3 text-sm text-right text-muted-foreground">{formatCurrency(strategy.totalInvested)}</td>
                  <td className="py-3 text-sm text-right font-semibold text-foreground">{formatCurrency(strategy.finalValue)}</td>
                  <td className={`py-3 text-sm text-right font-semibold ${strategy.roiPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {strategy.roiPercentage >= 0 ? '+' : ''}{pct(strategy.roiPercentage)}%
                  </td>
                  <td className="py-3 text-sm text-right text-muted-foreground">{btc(strategy.btcAcquired)}</td>
                  <td className="py-3 text-sm text-right text-muted-foreground">{formatCurrency(strategy.averageBuyPrice)}</td>
                  <td className="py-3 text-sm text-right text-muted-foreground">{intFmt.format(strategy.numberOfPurchases)}</td>
                  <td className="py-3 text-sm text-right text-destructive">-{pct(strategy.maxDrawdown)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {strategies.map((strategy) => (
            <div key={strategy.type} className="p-4 rounded-lg border border-border/30 bg-muted/20 space-y-3">
              <h4 className="font-semibold text-foreground">{strategy.name}</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{tr ? 'Son Değer' : 'Final Value'}</p>
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(strategy.finalValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className={`text-sm font-semibold ${strategy.roiPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {strategy.roiPercentage >= 0 ? '+' : ''}{pct(strategy.roiPercentage)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{tr ? 'Edinilen BTC' : 'BTC Acquired'}</p>
                  <p className="text-sm font-semibold text-foreground">{btc(strategy.btcAcquired)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{tr ? 'Alım Sayısı' : 'Purchases'}</p>
                  <p className="text-sm font-semibold text-foreground">{intFmt.format(strategy.numberOfPurchases)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{tr ? 'Ort. Fiyat' : 'Avg Price'}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(strategy.averageBuyPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{tr ? 'Maks Düşüş' : 'Max Drawdown'}</p>
                  <p className="text-sm text-destructive">-{pct(strategy.maxDrawdown)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
