import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/retirement/SectionHeader';
import { ScrollableTable } from '@/components/ui/ScrollableTable';

/** Valuation price for every row (latest close in the site price dataset). */
const REF_PRICE = 62962;
const REF_DATE_EN = 'August 1, 2026';
const REF_DATE_TR = '1 Ağustos 2026';

/**
 * $500 bought on the 1st of every month from January of the start year through
 * the reference date, using the monthly closes in
 * `public/data/bitcoin_prices_v1.json`.
 */
const ROWS = [
  { year: 2017, months: 116, invested: 58000, btc: 6.329, value: 398488, avg: 9164, roi: 587.0 },
  { year: 2018, months: 104, invested: 52000, btc: 3.2114, value: 202199, avg: 16192, roi: 288.8 },
  { year: 2019, months: 92, invested: 46000, btc: 2.4111, value: 151810, avg: 19078, roi: 230.0 },
  { year: 2020, months: 80, invested: 40000, btc: 1.414, value: 89027, avg: 28289, roi: 122.6 },
  { year: 2021, months: 68, invested: 34000, btc: 0.803, value: 50561, avg: 42339, roi: 48.7 },
  { year: 2022, months: 56, invested: 28000, btc: 0.6648, value: 41859, avg: 42116, roi: 49.5 },
  { year: 2023, months: 44, invested: 22000, btc: 0.4376, value: 27552, avg: 50275, roi: 25.2 },
  { year: 2024, months: 32, invested: 16000, btc: 0.2131, value: 13420, avg: 75066, roi: -16.1 },
];

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * "$500 a month in Bitcoin since 2017" — the exact long-tail phrasing this
 * page already ranks for with zero clicks. One extractable table: months
 * bought, total invested, BTC accumulated, average entry, value today, ROI.
 */
export const DcaFiveHundredTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        eyebrow={tr ? 'Gerçek Rakamlar' : 'Real Numbers'}
        title={
          tr
            ? "Ayda 500 $ Bitcoin: 2017'den Bu Yana Ne Kadar Eder?"
            : "$500 a Month in Bitcoin Since 2017: What It's Worth Now"
        }
        lead={
          tr
            ? `Her ayın 1'inde 500 $ alım. Değerleme ${REF_DATE_TR} kapanışı olan ${usd(REF_PRICE)} üzerinden.`
            : `Buying $500 on the 1st of every month. Valued at the ${REF_DATE_EN} close of ${usd(REF_PRICE)}.`
        }
        className="mb-8 md:mb-10"
      />

      <p className="text-muted-foreground leading-relaxed mb-6">
        {tr
          ? `Ocak 2017'den bu yana her ay 500 $ Bitcoin alan biri toplam ${usd(58000)} yatırıp ${ROWS[0].btc} BTC biriktirirdi — ortalama alış maliyeti ${usd(9164)}, bugünkü değeri yaklaşık ${usd(398488)} (+%587). Aynı plana 2021'de başlamak ${usd(34000)} yatırım karşılığında ${usd(50561)} verirdi; 2024'te başlamak ise hâlâ %16 zararda olurdu.`
          : `Someone buying $500 of Bitcoin every month since January 2017 would have invested ${usd(58000)} and accumulated ${ROWS[0].btc} BTC — an average cost of ${usd(9164)} and about ${usd(398488)} today, up 587%. Starting the same plan in 2021 turns ${usd(34000)} into ${usd(50561)}; starting in 2024 is still down 16%.`}
      </p>

      <ScrollableTable>
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">
            {tr
              ? 'Başlangıç yılına göre aylık 500 $ Bitcoin DCA sonuçları'
              : 'Monthly $500 Bitcoin DCA results by start year'}
          </caption>
          <thead>
            <tr className="border-b border-border/40 text-foreground">
              <th scope="col" className="text-left py-2.5 px-3 font-medium">{tr ? 'Başlangıç' : 'Start'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Ay' : 'Months'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Yatırılan' : 'Invested'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">BTC</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Ort. Maliyet' : 'Avg Cost'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Bugünkü Değer' : 'Value Today'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">ROI</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {ROWS.map((r) => (
              <tr key={r.year} className="border-b border-border/20">
                <th scope="row" className="text-left py-2.5 px-3 font-medium text-foreground">
                  {tr ? `Oca ${r.year}` : `Jan ${r.year}`}
                </th>
                <td className="text-right py-2.5 px-3 tabular-nums">{r.months}</td>
                <td className="text-right py-2.5 px-3 tabular-nums">{usd(r.invested)}</td>
                <td className="text-right py-2.5 px-3 tabular-nums">{r.btc}</td>
                <td className="text-right py-2.5 px-3 tabular-nums">{usd(r.avg)}</td>
                <td className="text-right py-2.5 px-3 tabular-nums text-foreground">{usd(r.value)}</td>
                <td className={`text-right py-2.5 px-3 tabular-nums ${r.roi >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {r.roi >= 0 ? '+' : ''}
                  {r.roi.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      <p className="text-xs text-muted-foreground mt-4">
        {tr
          ? 'Ücretler hariç, ayın 1\'indeki kapanış fiyatları kullanılmıştır. Kendi tutarınızı ve tarih aralığınızı yukarıdaki hesaplayıcıya girebilirsiniz.'
          : 'Excludes fees; uses the 1st-of-month close for each purchase. Enter your own amount and date range in the calculator above.'}
      </p>
    </div>
  );
};
