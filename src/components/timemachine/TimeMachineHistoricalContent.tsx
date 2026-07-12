import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Database, Download, ExternalLink, FileText, Link as LinkIcon } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { buildExportFilename } from '@/utils/exportFilename';
import { formatGroupedInt, formatGroupedDecimal } from '@/utils/numberFormat';

interface HistoricalDate {
  date: string;
  event: string;
  eventTr?: string;
  price?: number;
  priceMode?: "historical" | "current";
  context: string;
  contextTr?: string;
}

const historicalDates: HistoricalDate[] = [
  { date: "2010-05-22", event: "Bitcoin Pizza Day", eventTr: "Bitcoin Pizza Günü", price: 0.004, context: "First known real-world Bitcoin purchase: 10,000 BTC for two pizzas.", contextTr: "İlk bilinen gerçek dünya Bitcoin alımı: iki pizza için 10.000 BTC." },
  { date: "2011-02-09", event: "First $1", eventTr: "İlk 1 Dolar", price: 1, context: "Bitcoin reached dollar parity for the first time.", contextTr: "Bitcoin ilk kez dolar paritesine ulaştı." },
  { date: "2013-04-01", event: "First $100", eventTr: "İlk 100 Dolar", price: 100, context: "Bitcoin crossed a major early mainstream milestone.", contextTr: "Bitcoin önemli bir erken ana akım kilometre taşını aştı." },
  { date: "2013-11-29", event: "2013 Cycle Peak", eventTr: "2013 Döngü Zirvesi", price: 1163, context: "The first four-digit Bitcoin bull-market peak.", contextTr: "İlk dört haneli Bitcoin boğa piyasası zirvesi." },
  { date: "2017-12-17", event: "2017 Bull Peak", eventTr: "2017 Boğa Zirvesi", price: 19891, context: "Retail-driven cycle high near $20,000.", contextTr: "Perakende odaklı döngü zirvesi, 20.000 $ civarı." },
  { date: "2020-03-12", event: "COVID Crash", eventTr: "COVID Çöküşü", price: 3858, context: "Black Thursday liquidity shock across global markets.", contextTr: "Küresel piyasalarda Kara Perşembe likidite şoku." },
  { date: "2021-11-10", event: "2021 ATH", eventTr: "2021 TZY", price: 68991, context: "Cycle high before the 2022 bear market.", contextTr: "2022 ayı piyasasından önce döngü zirvesi." },
  { date: "2022-11-09", event: "FTX Collapse", eventTr: "FTX Çöküşü", price: 15460, context: "Major exchange failure marked a deep bear-market low.", contextTr: "Büyük borsa iflası derin ayı piyasası dibini işaretledi." },
  { date: "2024-01-11", event: "Spot ETF Launch", eventTr: "Spot ETF Lansmanı", price: 46300, context: "US spot Bitcoin ETFs began trading after years of regulatory debate.", contextTr: "ABD spot Bitcoin ETF'leri yıllarca süren düzenleyici tartışmanın ardından işlem görmeye başladı." },
  { date: "2024-04-19", event: "2024 Halving", eventTr: "2024 Yarılanması", price: 63700, context: "Block reward fell to 3.125 BTC.", contextTr: "Blok ödülü 3.125 BTC'ye düştü." },
  { date: "2026-04-27", event: "2026 Live Price Checkpoint", eventTr: "2026 Canlı Fiyat Kontrol Noktası", priceMode: "current", context: "A current-cycle benchmark row using the same live BTC price feed as the calculator.", contextTr: "Hesap makinesiyle aynı canlı BTC fiyat beslemesini kullanan mevcut döngü karşılaştırma satırı." },
];

const createMilestoneId = (item: HistoricalDate) =>
  `${item.event.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${item.date}`;

const formatCurrency = (value: number) =>
  value >= 1_000_000
    ? `$${(value / 1_000_000).toFixed(2)}M`
    : `$${formatGroupedInt(value, 'en-US')}`;

const formatPrice = (value: number) =>
  `$${value < 1 ? formatGroupedDecimal(value, 3, 'en-US') : formatGroupedInt(value, 'en-US')}`;

const escapeCsvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

interface Props {
  currentPrice?: number;
  isLoading?: boolean;
}

export const TimeMachineHistoricalContent = ({ currentPrice = 0, isLoading = false }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const hasLivePrice = currentPrice > 0;
  const price = hasLivePrice ? currentPrice : 0;

  const exportRows = historicalDates.map((item) => {
    const rowPrice = item.priceMode === "current" ? price : item.price ?? 0;
    const value100 = rowPrice > 0 ? (100 / rowPrice) * price : 0;
    const value1000 = value100 * 10;
    return {
      ...item,
      id: createMilestoneId(item),
      rowPrice,
      value100,
      value1000,
    };
  });

  const handleExportCSV = () => {
    const headers = tr
      ? ["Tarih", "Kilometre Taşı", "Çıpa Kimliği", "BTC Fiyatı USD", "Bugün 100$", "Bugün 1.000$", "Bağlam"]
      : ["Date", "Milestone", "Anchor ID", "BTC Price USD", "$100 Value Today", "$1,000 Value Today", "Context"];
    const csv = [
      headers.map(escapeCsvCell).join(","),
      ...exportRows.map((row) => [
        row.date,
        tr ? (row.eventTr ?? row.event) : row.event,
        `#${row.id}`,
        row.rowPrice.toFixed(row.rowPrice < 1 ? 6 : 2),
        row.value100.toFixed(2),
        row.value1000.toFixed(2),
        tr ? (row.contextTr ?? row.context) : row.context,
      ].map(escapeCsvCell).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = buildExportFilename({ en: 'bitcoin-time-machine-milestones', tr: 'bitcoin-zaman-makinesi-kilometre-taslari' }, 'csv', language);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 16;
    pdf.setFontSize(16);
    pdf.text(
      tr ? "Bitcoin Zaman Makinesi Tarihsel Fiyatlar" : "Bitcoin Time Machine Historical Prices",
      12, y
    );
    y += 8;
    pdf.setFontSize(9);
    pdf.text(
      `${tr ? "Canlı BTC referans fiyatı" : "Live BTC reference price"}: ${formatPrice(price)} • ${tr ? "Oluşturulma" : "Generated"} ${new Date().toLocaleDateString()}`,
      12, y
    );
    y += 8;

    exportRows.forEach((row) => {
      if (y > 272) {
        pdf.addPage();
        y = 16;
      }
      pdf.setFontSize(11);
      pdf.text(`${row.date} — ${tr ? (row.eventTr ?? row.event) : row.event}`, 12, y);
      y += 5;
      pdf.setFontSize(9);
      pdf.text(
        `${tr ? "BTC fiyatı" : "BTC price"}: ${formatPrice(row.rowPrice)} | ${tr ? "100$ bugün" : "$100 today"}: ${formatCurrency(row.value100)} | ${tr ? "1.000$ bugün" : "$1,000 today"}: ${formatCurrency(row.value1000)}`,
        12, y
      );
      y += 5;
      pdf.text(pdf.splitTextToSize(tr ? (row.contextTr ?? row.context) : row.context, 180), 12, y);
      y += 10;
    });

    pdf.save(buildExportFilename({ en: 'bitcoin-time-machine-milestones', tr: 'bitcoin-zaman-makinesi-kilometre-taslari' }, 'pdf', language));
  };

  const HistoricalTableSkeleton = () => (
    <Card className="glass-morphism-card border-border/20 overflow-hidden" aria-label={tr ? "Tarihsel Bitcoin fiyat kilometre taşları yükleniyor" : "Loading historical Bitcoin price milestones"}>
      <CardContent className="p-0">
        <div className="space-y-0">
          <div className="grid grid-cols-5 gap-3 bg-muted/30 px-4 py-3">
            {Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-4 w-full" />)}
          </div>
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-border/30 px-4 py-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2 sm:col-span-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="hidden sm:block h-4 w-20 justify-self-end" />
              <Skeleton className="hidden sm:block h-4 w-24 justify-self-end" />
              <Skeleton className="hidden sm:block h-4 w-24 justify-self-end" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const RelatedCardsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label={tr ? "İlgili Bitcoin araçları yükleniyor" : "Loading related Bitcoin tools"}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="border-border/30 bg-card/70">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section id="historical-bitcoin-prices" className="container mx-auto px-6 pb-20" aria-labelledby="historical-bitcoin-prices-heading">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
            <CalendarDays className="w-3.5 h-3.5 mr-1" />
            {tr ? "Tarihsel fiyat tablosu" : "Historical price table"}
          </Badge>
          <h2 id="historical-bitcoin-prices-heading" className="text-h2 font-bold text-foreground">
            {tr ? "Bitcoin'in En Ünlü Tarihsel Fiyatları" : "Bitcoin's Most Famous Historical Prices"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tr ? (
              <>
                Önemli Bitcoin tarihlerini bugünün canlı fiyatıyla karşılaştırın. Daha derin getiri analizi için{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-ya-olsaydi" className="text-primary hover:underline">Bitcoin Ya Eğer Hesaplayıcısı</Link>,{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">Bitcoin DCA Hesaplayıcısı</Link> veya{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-pizza-gunu" className="text-primary hover:underline">Pizza Günü Hesaplayıcısı</Link> ile bu kilometre taşı örneklerini kullanın.
              </>
            ) : (
              <>
                Compare landmark Bitcoin dates against today's live price. Use these crawl-friendly milestone examples with the{' '}
                <Link to="/calculators/what-if" className="text-primary hover:underline">Bitcoin What-If Calculator</Link>,{' '}
                <Link to="/calculators/dca" className="text-primary hover:underline">Bitcoin DCA Calculator</Link>, or{' '}
                <Link to="/calculators/pizza-day" className="text-primary hover:underline">Pizza Day Calculator</Link> for deeper return analysis.
              </>
            )}
          </p>
          {hasLivePrice && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-3">
              <Button type="button" variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
                <Download className="w-4 h-4" /> {tr ? "CSV'ye Aktar" : "Export CSV"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
                <FileText className="w-4 h-4" /> {tr ? "PDF'e Aktar" : "Export PDF"}
              </Button>
            </div>
          )}
        </div>

        {isLoading || !hasLivePrice ? (
          <HistoricalTableSkeleton />
        ) : (
          <Card className="glass-morphism-card border-border/20 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">{tr ? 'Tarih' : 'Date'}</th>
                      <th className="text-left font-medium px-4 py-3">{tr ? 'Kilometre Taşı' : 'Milestone'}</th>
                      <th className="text-right font-medium px-4 py-3">{tr ? 'BTC Fiyatı' : 'BTC Price'}</th>
                      <th className="text-right font-medium px-4 py-3">{tr ? 'Bugün 100$' : '$100 Today'}</th>
                      <th className="text-right font-medium px-4 py-3">{tr ? 'Bugün 1.000$' : '$1,000 Today'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {exportRows.map((item) => (
                      <tr id={item.id} key={`${item.date}-${item.event}`} className="scroll-mt-28 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{item.date}</td>
                        <td className="px-4 py-4 min-w-[220px]">
                          <h3 className="font-semibold text-foreground text-sm">
                            <a href={`#${item.id}`} className="inline-flex items-center gap-1 hover:text-primary">
                              {tr ? (item.eventTr ?? item.event) : item.event} <LinkIcon className="w-3 h-3" aria-hidden="true" />
                            </a>
                          </h3>
                          <div className="text-xs text-muted-foreground mt-1">
                            {tr ? (item.contextTr ?? item.context) : item.context}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-mono text-foreground">{formatPrice(item.rowPrice)}</td>
                        <td className="px-4 py-4 text-right font-mono font-semibold text-primary">{formatCurrency(item.value100)}</td>
                        <td className="px-4 py-4 text-right font-mono font-semibold text-primary">{formatCurrency(item.value1000)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading || !hasLivePrice ? (
          <RelatedCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/30 bg-card/70">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-foreground">
                  {tr ? "Bitcoin Pizza Günü hesaplaması" : "Bitcoin Pizza Day calculation"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tr
                    ? `Laszlo Hanyecz, 22 Mayıs 2010'da iki pizza için 10.000 BTC ödedi. Bugünün fiyatıyla bu işlem ${formatCurrency(price * 10000)}'ye eşittir.`
                    : `Laszlo Hanyecz paid 10,000 BTC for two pizzas on May 22, 2010. At today's price, that transaction equals ${formatCurrency(price * 10000)}.`}
                </p>
                <Link
                  to={tr ? "/tr/hesaplayicilar/bitcoin-pizza-gunu" : "/calculators/pizza-day"}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {tr ? "Pizza Günü hesaplayıcısını aç" : "Open Pizza Day calculator"} <ExternalLink className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-card/70">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-foreground">
                  {tr ? "Zaman Makinesi ile Ya Eğer Karşılaştırması" : "Time Machine vs What-If"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tr
                    ? "Zaman Makinesi ünlü tarihler ve hızlı fiyat araması için tasarlanmıştır. Tam özel Bitcoin getiri analizi için Ya Eğer Hesaplayıcısını kullanın."
                    : "Time Machine is built for famous dates and quick price lookup. Use the What-If Calculator for full custom Bitcoin return analysis."}
                </p>
                <Link
                  to={tr ? "/tr/hesaplayicilar/bitcoin-ya-olsaydi" : "/calculators/what-if"}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {tr ? "Tam Ya Eğer analizini çalıştır" : "Run full What-If analysis"} <ExternalLink className="w-3 h-3" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-card/70">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    {tr ? "Veri sınırlamaları" : "Data limits"}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tr
                    ? "2013 öncesi Bitcoin fiyatları borsalar arasında daha az standartlaştırılmıştır, bu nedenle erken kilometre taşları tarihsel tahminler olarak değerlendirilmelidir."
                    : "Bitcoin prices before 2013 are less standardized across exchanges, so early milestones should be treated as historical estimates."}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};
