import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const cycles = [
  { cycle: "2011", peakDate: { en: "Jun 2011", tr: "Haz 2011" }, peak: "$32", trough: "$2", drop: 93, monthsToTrough: 5, monthsToRecover: 18, trigger: { en: "First bubble burst", tr: "İlk balon patlaması" } },
  { cycle: "2013–14", peakDate: { en: "Dec 2013", tr: "Ara 2013" }, peak: "$1,163", trough: "$170", drop: 85, monthsToTrough: 14, monthsToRecover: 36, trigger: { en: "Mt. Gox collapse", tr: "Mt. Gox çöküşü" } },
  { cycle: "2017–18", peakDate: { en: "Dec 2017", tr: "Ara 2017" }, peak: "$19,783", trough: "$3,200", drop: 84, monthsToTrough: 12, monthsToRecover: 36, trigger: { en: "ICO bubble burst", tr: "ICO balonu patlaması" } },
  { cycle: "2021–22", peakDate: { en: "Nov 2021", tr: "Kas 2021" }, peak: "$69,000", trough: "$15,500", drop: 77, monthsToTrough: 13, monthsToRecover: 24, trigger: { en: "FTX / LUNA collapse", tr: "FTX / LUNA çöküşü" } },
  { cycle: "2025–26", peakDate: { en: "Oct 6, 2025", tr: "6 Eki 2025" }, peak: "$126,287", trough: "$80,523", drop: 36, monthsToTrough: 7, monthsToRecover: null, trigger: { en: "Post-ETF macro deleveraging", tr: "ETF sonrası makro kaldıraç çözülmesi" } },
];

export const DrawdownCycleComparison = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <Card className="glass-morphism-card border-border/20 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 border-b border-border/20 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {tr ? 'Döngü Bazlı Karşılaştırma' : 'Cycle-by-Cycle Comparison'}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {tr
                ? 'Her Bitcoin ayı piyasasının diğerleriyle karşılaştırması'
                : 'How each Bitcoin bear market stacks up against the others'}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Döngü' : 'Cycle'}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Zirve' : 'Peak'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Zirve Fiyatı' : 'Peak Price'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Dip' : 'Trough'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Max Düşüş' : 'Max Drop'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Düşüş Ayları' : 'Months Down'}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Toparlanma' : 'Recovery'}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Tetikleyici' : 'Trigger'}</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.cycle} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{c.cycle}</td>
                  <td className="px-4 py-3 text-foreground">{tr ? c.peakDate.tr : c.peakDate.en}</td>
                  <td className="px-4 py-3 text-right text-foreground">{c.peak}</td>
                  <td className="px-4 py-3 text-right text-foreground">{c.trough}</td>
                  <td className="px-4 py-3 text-right font-semibold text-destructive">-{c.drop}%</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{c.monthsToTrough}{tr ? ' ay' : 'mo'}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {c.monthsToRecover !== null
                      ? `${c.monthsToRecover}${tr ? ' ay' : 'mo'}`
                      : <span className="text-amber-500">{tr ? 'Devam ediyor' : 'Ongoing'}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{tr ? c.trigger.tr : c.trigger.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-border/20 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {tr ? 'Çöküş Şiddeti' : 'Crash Severity'}
          </p>
          {cycles.map((c) => (
            <div key={c.cycle} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16 shrink-0">{c.cycle}</span>
              <div className="flex-1 h-5 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-destructive/80 to-destructive/60 rounded-full transition-all duration-700"
                  style={{ width: `${c.drop}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-destructive w-10 text-right">-{c.drop}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
