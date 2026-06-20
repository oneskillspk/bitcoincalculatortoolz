import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RetirementProjection } from "@/pages/BitcoinRetirementCalculator";
import { Calendar } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyAmount } from "@/utils/formatCurrency";

interface RetirementTableProps {
  projections: RetirementProjection[];
  currency: string;
}

export const RetirementTable = ({ projections, currency }: RetirementTableProps) => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;

  if (!projections || projections.length === 0) {
    return (
      <Card className="calc-surface-card border-0">
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{tr?'Yıl yıl projeksiyonları görmek için emeklilik parametrelerinizi ayarlayın':'Configure your retirement parameters to see year-by-year projections'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const exportToCSV = () => {
    const headers = tr
      ? ['Yıl', 'Yaş', 'Bitcoin Varlıkları', 'BTC Fiyatı', 'Portföy Değeri', 'Yıllık Bütçe', 'Aylık Bütçe']
      : ['Year', 'Age', 'Bitcoin Holdings', 'BTC Price', 'Portfolio Value', 'Annual Budget', 'Monthly Budget'];
    const csvContent = [
      headers.join(','),
      ...projections.map(p => [
        p.year,
        p.age,
        p.btcHoldings.toFixed(4),
        p.btcPrice.toFixed(0),
        p.fiatValue.toFixed(0),
        p.annualBudget.toFixed(0),
        p.monthlyBudget.toFixed(0)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bitcoin-retirement-projections.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="calc-surface-card border-0">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold tracking-tight">
                {tr ? 'Yıl Yıl Projeksiyonlar' : 'Year-by-Year Projections'}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {tr ? 'Emeklilik zaman çizelgenizin ayrıntılı dökümü' : 'Detailed breakdown of your retirement timeline'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="hidden sm:inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/40 ring-1 ring-border/60 rounded-md px-2 py-1">
              {projections.length} {tr ? 'yıl' : 'years'}
            </span>
          </div>

        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg ring-1 ring-border/60 overflow-hidden">
          <ScrollArea className="h-80 md:h-[420px]">
            <div className="min-w-[820px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 hover:bg-transparent">
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground sticky left-0 bg-card z-10 shadow-[inset_-8px_0_8px_-8px_hsl(var(--border)/0.6)]">{tr ? 'Yıl' : 'Year'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground sticky left-[60px] bg-card z-10 shadow-[inset_-8px_0_8px_-8px_hsl(var(--border)/0.6)]">{tr ? 'Yaş' : 'Age'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">{tr ? 'Bitcoin Varlıkları' : 'Bitcoin Holdings'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">{tr ? 'BTC Fiyatı' : 'BTC Price'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">{tr ? 'Portföy Değeri' : 'Portfolio Value'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">{tr ? 'Yıllık Bütçe' : 'Annual Budget'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right">{tr ? 'Aylık Bütçe' : 'Monthly Budget'}</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center">{tr ? 'Durum' : 'Status'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projections.map((projection) => (
                    <TableRow key={projection.year} className="border-b border-border/30 last:border-b-0 even:bg-muted/20 hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium text-sm sticky left-0 bg-card shadow-[inset_-8px_0_8px_-8px_hsl(var(--border)/0.6)]">
                        {projection.year}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground sticky left-[60px] bg-card shadow-[inset_-8px_0_8px_-8px_hsl(var(--border)/0.6)]">
                        {projection.age}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm">
                        {formatBtc(projection.btcHoldings)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm text-primary">
                        {formatCurrency(projection.btcPrice)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm font-medium text-foreground">
                        {formatCurrency(projection.fiatValue)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm text-success">
                        {formatCurrency(projection.annualBudget)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm text-success">
                        {formatCurrency(projection.monthlyBudget)}
                      </TableCell>
                      <TableCell className="text-center">
                        {projection.btcHoldings > 0 ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-medium">
                            {tr ? 'Aktif' : 'Active'}
                          </Badge>
                        ) : projection.fiatValue > 0 ? (
                          <Badge variant="outline" className="bg-warning/$3 text-warning border-warning/30 font-medium">
                            {tr ? 'Tükeniyor' : 'Depleting'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 font-medium">
                            {tr ? 'Tükendi' : 'Depleted'}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          <div className="md:hidden absolute bottom-2 right-2 text-[11px] text-muted-foreground bg-card ring-1 ring-border/60 px-2.5 py-1 rounded-md shadow-sm">
            {tr ? '← Yatay kaydırın →' : '← Scroll horizontally →'}
          </div>
        </div>

        {/* Summary Statistics — horizontal bar on md+ */}
        <div className="mt-5 rounded-lg ring-1 ring-border/60 bg-card grid grid-cols-2 md:grid-cols-4 md:divide-x divide-border/40">
          {[
            { label: tr ? 'Projeksiyon yılı' : 'Projected Years', value: String(projections.length) },
            { label: tr ? 'Toplam çekim' : 'Total Withdrawals', value: formatCurrency(projections.reduce((sum, p) => sum + p.annualBudget, 0)) },
            { label: tr ? 'Son BTC' : 'Final BTC', value: formatBtc(projections[projections.length - 1]?.btcHoldings || 0) },
            { label: tr ? 'Son değer' : 'Final Value', value: formatCurrency(projections[projections.length - 1]?.fiatValue || 0) },
          ].map((stat) => (
            <div key={stat.label} className="p-3 text-center">
              <div className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">{stat.label}</div>
              <div className="mt-1 text-base sm:text-lg font-bold tabular-nums text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};