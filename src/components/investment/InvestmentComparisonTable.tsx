import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

export const InvestmentComparisonTable = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const rows = [
    { inv: "$1,000", y1: "$1,100", y3: "$1,331", y5_m: "$3,052", y5_o: "$7,594" },
    { inv: "$5,000", y1: "$5,500", y3: "$6,655", y5_m: "$15,259", y5_o: "$37,969" },
    { inv: "$10,000", y1: "$11,000", y3: "$13,310", y5_m: "$30,518", y5_o: "$75,938" },
    { inv: "$25,000", y1: "$27,500", y3: "$33,275", y5_m: "$76,294", y5_o: "$189,844" },
    { inv: "$50,000", y1: "$55,000", y3: "$66,550", y5_m: "$152,588", y5_o: "$379,688" },
  ];

  return (
    <section data-currency-exempt="true">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-h2 font-bold text-foreground mb-2 text-center">
            {tr?'Bitcoin Yatırım Büyüme Senaryoları':'Bitcoin Investment Growth Scenarios'}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {tr
              ? 'Muhafazakâr (%10), orta (%25) ve iyimser (%50) yıllık büyüme varsayımları altında tek seferlik Bitcoin yatırımı için tahmini portföy değeri.'
              : 'Projected portfolio value for a one-time Bitcoin investment under conservative (10%), moderate (25%), and optimistic (50%) annual growth assumptions.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Başlangıç Yatırımı':'Initial Investment'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">1 {tr?'Yıl':'Year'} (10%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">3 {tr?'Yıl':'Years'} (10%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">5 {tr?'Yıl':'Years'} (25%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">5 {tr?'Yıl':'Years'} (50%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.inv} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.inv}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y1}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y3}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.y5_m}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.y5_o}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr
              ? 'Büyüme oranları varsayımsaldır. Bitcoin volatildir ve geçmiş performans gelecek sonuçları garanti etmez. Özel senaryolar için yukarıdaki hesap makinesini kullanın.'
              : 'Growth rates are hypothetical. Bitcoin is volatile and past performance does not guarantee future results. Use the calculator above for custom scenarios.'}
          </p>
        </div>
      </div>
    </section>
  );
};
