import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RetirementProjection } from "@/pages/BitcoinRetirementCalculator";
import { Calendar, ChevronsRight } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyAmount } from "@/utils/formatCurrency";
import { cn } from "@/lib/utils";

interface RetirementTableProps {
  projections: RetirementProjection[];
  currency: string;
}

const thBase =
  "h-10 px-3 text-left align-middle text-[11px] uppercase tracking-wider font-semibold text-muted-foreground bg-card sticky top-0";
const tdBase = "px-3 py-2 align-middle";
const stickyShadow = "shadow-[inset_-8px_0_8px_-8px_hsl(var(--border)/0.6)]";

export const RetirementTable = ({ projections, currency }: RetirementTableProps) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : (currency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (amount: number) => formatCurrencyAmount(amount, currency, { locale });
  const formatBtc = (amount: number) => `₿${amount.toFixed(4)}`;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  // Show swipe hint only when the table actually overflows horizontally.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowHint(el.scrollWidth - el.clientWidth > 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    const dismiss = () => setShowHint(false);
    el.addEventListener('scroll', dismiss, { once: true, passive: true });
    el.addEventListener('pointerdown', dismiss, { once: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', dismiss);
      el.removeEventListener('pointerdown', dismiss);
    };
  }, [projections.length]);

  if (!projections || projections.length === 0) {
    return (
      <Card className="calc-surface-card border-0">
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{tr ? 'Yıl yıl projeksiyonları görmek için emeklilik parametrelerinizi ayarlayın' : 'Configure your retirement parameters to see year-by-year projections'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="calc-surface-card border-0 overflow-hidden">
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
          <span className="hidden sm:inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/40 ring-1 ring-border/60 rounded-md px-2 py-1 self-start sm:self-auto">
            {projections.length} {tr ? 'yıl' : 'years'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="relative rounded-lg ring-1 ring-border/60 overflow-hidden bg-card">
          <div
            ref={scrollRef}
            className="h-80 md:h-[420px] w-full overflow-auto overscroll-contain touch-pan-x touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
            role="region"
            tabIndex={0}
            aria-label={tr ? 'Yıl yıl projeksiyonlar tablosu' : 'Year-by-year projections table'}
          >
            <table className="w-full min-w-[640px] sm:min-w-[820px] border-collapse text-sm">
              <thead>
                <tr>
                  <th scope="col" className={cn(thBase, "sticky left-0 z-30", stickyShadow)}>
                    {tr ? 'Yıl' : 'Year'}
                  </th>
                  <th scope="col" className={cn(thBase, "hidden xs:table-cell sm:table-cell sticky left-[56px] z-30", stickyShadow)}>
                    {tr ? 'Yaş' : 'Age'}
                  </th>
                  <th scope="col" className={cn(thBase, "text-right z-20")}>{tr ? 'BTC' : 'BTC'}</th>
                  <th scope="col" className={cn(thBase, "text-right z-20 hidden md:table-cell")}>{tr ? 'BTC Fiyatı' : 'BTC Price'}</th>
                  <th scope="col" className={cn(thBase, "text-right z-20")}>{tr ? 'Portföy' : 'Portfolio'}</th>
                  <th scope="col" className={cn(thBase, "text-right z-20 hidden sm:table-cell")}>{tr ? 'Yıllık Bütçe' : 'Annual'}</th>
                  <th scope="col" className={cn(thBase, "text-right z-20")}>{tr ? 'Aylık' : 'Monthly'}</th>
                  <th scope="col" className={cn(thBase, "text-center z-20 hidden md:table-cell")}>{tr ? 'Durum' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((projection) => (
                  <tr key={projection.year} className="border-b border-border/30 last:border-b-0 even:bg-muted/20 hover:bg-muted/40 transition-colors">
                    <td className={cn(tdBase, "font-medium sticky left-0 z-10 bg-card even:bg-muted/20", stickyShadow)}>
                      {projection.year}
                    </td>
                    <td className={cn(tdBase, "text-muted-foreground hidden xs:table-cell sm:table-cell sticky left-[56px] z-10 bg-card even:bg-muted/20", stickyShadow)}>
                      {projection.age}
                    </td>
                    <td className={cn(tdBase, "text-right font-mono tabular-nums")}>
                      {formatBtc(projection.btcHoldings)}
                    </td>
                    <td className={cn(tdBase, "text-right font-mono tabular-nums text-primary hidden md:table-cell")}>
                      {formatCurrency(projection.btcPrice)}
                    </td>
                    <td className={cn(tdBase, "text-right font-mono tabular-nums font-medium text-foreground")}>
                      {formatCurrency(projection.fiatValue)}
                    </td>
                    <td className={cn(tdBase, "text-right font-mono tabular-nums text-success hidden sm:table-cell")}>
                      {formatCurrency(projection.annualBudget)}
                    </td>
                    <td className={cn(tdBase, "text-right font-mono tabular-nums text-success")}>
                      {formatCurrency(projection.monthlyBudget)}
                    </td>
                    <td className={cn(tdBase, "text-center hidden md:table-cell")}>
                      {projection.btcHoldings > 0 ? (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-medium">
                          {tr ? 'Aktif' : 'Active'}
                        </Badge>
                      ) : projection.fiatValue > 0 ? (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 font-medium">
                          {tr ? 'Tükeniyor' : 'Depleting'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 font-medium">
                          {tr ? 'Tükendi' : 'Depleted'}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Animated swipe hint — auto-fades on first interaction */}
          <div
            aria-hidden="true"
            className={cn(
              "md:hidden pointer-events-none absolute top-1/2 right-2 -translate-y-1/2",
              "flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground",
              "px-2.5 py-1 text-[11px] font-medium shadow-md",
              "transition-opacity duration-500",
              showHint ? "opacity-100 animate-pulse" : "opacity-0",
            )}
          >
            <ChevronsRight className="w-3.5 h-3.5" />
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
