import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "./SectionHeader";

export const RetirementComparisonTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const yr = tr ? 'yıl' : 'yr';
  const c = tr ? '₺' : '$'; // currency-audit-allow
  const rows = [
    { btc: "0.5 BTC", p100: `${c}2,000/${yr}`, p250: `${c}5,000/${yr}`, p500: `${c}10,000/${yr}`, p1m: `${c}20,000/${yr}` },
    { btc: "1 BTC", p100: `${c}4,000/${yr}`, p250: `${c}10,000/${yr}`, p500: `${c}20,000/${yr}`, p1m: `${c}40,000/${yr}` },
    { btc: "2 BTC", p100: `${c}8,000/${yr}`, p250: `${c}20,000/${yr}`, p500: `${c}40,000/${yr}`, p1m: `${c}80,000/${yr}` },
    { btc: "5 BTC", p100: `${c}20,000/${yr}`, p250: `${c}50,000/${yr}`, p500: `${c}100,000/${yr}`, p1m: `${c}200,000/${yr}` },
    { btc: "10 BTC", p100: `${c}40,000/${yr}`, p250: `${c}100,000/${yr}`, p500: `${c}200,000/${yr}`, p1m: `${c}400,000/${yr}` },
  ];
  return (
    <section className="bg-muted/30 pt-10 pb-14 md:pt-12 md:pb-16 lg:pb-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={tr ? 'Karşılaştırma' : 'Comparison'}
            title={tr ? 'BTC Varlığı ve Fiyata Göre Emeklilik Geliri' : 'Retirement Income by Holdings & Price'}
            className="mb-8 md:mb-10"
            lead={tr
              ? 'Farklı BTC varlıkları ve fiyat seviyelerinde %4 çekim kuralıyla tahmini yıllık gelir.'
              : 'Estimated annual income using the 4% withdrawal rule across different holdings and price levels.'}
          />
          <ScrollableTable className="rounded-xl border border-border/50 bg-card" fadeFromClass="from-card" ariaLabel={tr ? 'Bitcoin emeklilik gelir karşılaştırma tablosu' : 'Bitcoin retirement income comparison table'}>
            <Table className="min-w-[560px]">
              <caption className="sr-only">{tr ? 'Farklı BTC varlıkları ve fiyatlarına göre %4 çekim kuralıyla yıllık emeklilik geliri.' : 'Annual retirement income via the 4% rule across BTC holdings and price levels.'}</caption>
              <TableHeader>
                <TableRow className="border-border/50 bg-muted/40 hover:bg-muted/40">
                  <TableHead scope="col" className="sticky left-0 z-10 bg-muted/40 font-semibold text-xs uppercase tracking-wider text-foreground">{tr ? 'BTC Varlığı' : 'BTC Holdings'}</TableHead>
                  <TableHead scope="col" className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">BTC @ {c}100K</TableHead>
                  <TableHead scope="col" className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">BTC @ {c}250K</TableHead>
                  <TableHead scope="col" className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">BTC @ {c}500K</TableHead>
                  <TableHead scope="col" className="font-semibold text-xs uppercase tracking-wider text-foreground text-right whitespace-nowrap">BTC @ {c}1M</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.btc} className="border-border/30">
                    <TableHead scope="row" className="font-medium text-sm text-foreground text-left whitespace-nowrap h-auto">{row.btc}</TableHead>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.p100}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.p250}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.p500}</TableCell>
                    <TableCell className="text-right text-sm font-mono tabular-nums text-foreground whitespace-nowrap">{row.p1m}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableTable>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr ? '%4 güvenli çekim kuralına dayanır (yıllık çekim = portföy değerinin %4\'ü).' : 'Based on the 4% safe withdrawal rule (annual withdrawal = 4% × portfolio value).'}
          </p>
        </div>
      </div>
    </section>
  );
};
