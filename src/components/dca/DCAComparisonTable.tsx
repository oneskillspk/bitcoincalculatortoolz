import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from '@/contexts/LanguageContext';

export const DCAComparisonTable = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="max-w-4xl mx-auto">
      <>
        <></>
          <h2 className="text-h2 font-bold text-foreground mb-2 text-center">
            {tr?'Aylık Yatırım Miktarına Göre Bitcoin DCA Getirileri':'Bitcoin DCA Returns by Monthly Investment'}
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            {tr
              ? 'Tutarlı aylık alımlar varsayımıyla farklı dönemler boyunca Bitcoin\'e dolar maliyet ortalama yapmanın tarihsel getirileri. Veri kaynağı: CoinGecko tarihsel fiyatlar.'
              : 'Historical returns for dollar-cost averaging into Bitcoin over different time periods, assuming consistent monthly purchases. Data source: CoinGecko historical prices.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Aylık Tutar':'Monthly Amount'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'1 Yıllık Toplam Yatırım':'1-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'3 Yıllık Toplam Yatırım':'3-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'5 Yıllık Toplam Yatırım':'5-Year Total Invested'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">{tr?'5 Yıllık Ort. Biriken BTC*':'5-Year Avg. BTC Accumulated*'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { amount: "$50", y1: "$600", y3: "$1,800", y5: "$3,000", btc: "~0.035 BTC" },
                  { amount: "$100", y1: "$1,200", y3: "$3,600", y5: "$6,000", btc: "~0.070 BTC" },
                  { amount: "$250", y1: "$3,000", y3: "$9,000", y5: "$15,000", btc: "~0.175 BTC" },
                  { amount: "$500", y1: "$6,000", y3: "$18,000", y5: "$30,000", btc: "~0.350 BTC" },
                  { amount: "$1,000", y1: "$12,000", y3: "$36,000", y5: "$60,000", btc: "~0.700 BTC" },
                ].map((row) => (
                  <TableRow key={row.amount} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.amount}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y1}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y3}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y5}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.btc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {tr
              ? '*Biriken BTC, tarihsel ortalama fiyatlara dayalı yaklaşık değerlerdir. Gerçek sonuçlar piyasa koşullarına göre değişir. Kesin tahminler için yukarıdaki hesaplayıcıyı kullanın.'
              : '*BTC accumulated is approximate based on historical average prices. Actual results vary by market conditions. Use the calculator above for precise projections.'}
          </p>
        </div>
      </div>
    </section>
  );
};
