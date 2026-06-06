import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableIcon, TrendingUp, TrendingDown } from "lucide-react";
import { MonthlyProjection } from "@/services/miningProfitabilityCalculator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUsdToTryRate } from "@/hooks/useUsdToTryRate";
import { formatMoney } from "@/utils/formatMoney";

interface MiningBreakdownTableProps {
  projections: MonthlyProjection[];
  currency: string;
}

export const MiningBreakdownTable = ({ projections, currency }: MiningBreakdownTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const fxRate = useUsdToTryRate();

  const formatCurrency = (value: number) =>
    tr
      ? formatMoney(value, { tr: true, fxRate, decimals: 2 })
      : new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const formatBtc = (value: number) => {
    if (value < 0.001) return `${(value * 100000000).toFixed(0)} sats`;
    return `${value.toFixed(6)} BTC`;
  };

  const formatDifficulty = (value: number) => `${(value / 1e12).toFixed(2)}T`;

  return (
    <Card className="bg-card border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TableIcon className="w-5 h-5 text-primary" />
          </div>
          {tr ? 'Aylık Döküm' : 'Monthly Breakdown'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead className="text-muted-foreground">{tr ? 'Ay' : 'Month'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Kazılan BTC' : 'BTC Mined'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Gelir' : 'Revenue'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Elektrik' : 'Electricity'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Kâr' : 'Profit'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Kümülatif' : 'Cumulative'}</TableHead>
                <TableHead className="text-muted-foreground text-right">{tr ? 'Zorluk' : 'Difficulty'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projections.map((projection) => (
                <TableRow key={projection.month} className="border-border/20 hover:bg-muted/20">
                  <TableCell className="font-medium">
                    {tr ? 'Ay' : 'Month'} {projection.month}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatBtc(projection.btcMined)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-foreground">{formatCurrency(projection.revenue)}</TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">-{formatCurrency(projection.electricityCost)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={projection.profit >= 0 ? "default" : "destructive"}
                      className={`font-mono ${projection.profit >= 0 ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
                    >
                      <span className="flex items-center gap-1">
                        {projection.profit >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {formatCurrency(projection.profit)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-mono text-sm ${projection.cumulativeProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(projection.cumulativeProfit)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs text-muted-foreground">{formatDifficulty(projection.difficulty)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
