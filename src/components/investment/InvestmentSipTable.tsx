import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/retirement/SectionHeader';
import { ScrollableTable } from '@/components/ui/ScrollableTable';

const REF_PRICE = 62962;
const REF_DATE_EN = 'August 1, 2026';
const REF_DATE_TR = '1 Ağustos 2026';

/**
 * $100 invested on the 1st of every month (a SIP), ending at the reference
 * date. Computed from the monthly closes in
 * `public/data/bitcoin_prices_v1.json`.
 */
const ROWS = [
  { label: '3', months: 37, invested: 3700, value: 3711, roi: 0.3 },
  { label: '5', months: 61, invested: 6100, value: 9008, roi: 47.7 },
  { label: '10', months: 121, invested: 12100, value: 125802, roi: 939.7 },
];

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

/**
 * "Bitcoin SIP return last 3 / 5 / 10 years" — a high-volume query cluster
 * this page ranks for around position 5-7 with almost no clicks because the
 * numbers were never on the page. This block answers it outright.
 */
export const InvestmentSipTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16" aria-labelledby="btc-sip-returns">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeader
          id="btc-sip-returns"
          eyebrow={tr ? 'SIP Getirileri' : 'SIP Returns'}
          title={
            tr
              ? 'Bitcoin SIP Getirisi: Son 3, 5 ve 10 Yıl'
              : 'Bitcoin SIP Returns: Last 3, 5 and 10 Years'
          }
          lead={
            tr
              ? `Her ayın 1'inde 100 $ alım, ${REF_DATE_TR} kapanışı olan ${usd(REF_PRICE)} ile değerlenmiştir.`
              : `Investing $100 on the 1st of every month, valued at the ${REF_DATE_EN} close of ${usd(REF_PRICE)}.`
          }
          className="mb-8 md:mb-10"
        />

        <p className="text-muted-foreground leading-relaxed mb-6">
          {tr
            ? `Aylık 100 $'lık bir Bitcoin SIP'i son 10 yılda ${usd(12100)} yatırımı ${usd(125802)}'a çevirdi (+%940). Son 5 yıl +%48 getirdi. Son 3 yıl ise başa baş: piyasa 2024 zirvelerinin altında olduğu için ${usd(3700)} yatırım ${usd(3711)} değerinde.`
            : `A $100-a-month Bitcoin SIP turned ${usd(12100)} into ${usd(125802)} over the last 10 years, a 940% gain. The last 5 years returned 48%. The last 3 years are roughly break-even — ${usd(3700)} invested is worth ${usd(3711)} — because the market sits below its 2024-25 highs.`}
        </p>

        <ScrollableTable>
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">
              {tr ? 'Aylık 100 $ Bitcoin SIP getirileri' : 'Monthly $100 Bitcoin SIP returns'}
            </caption>
            <thead>
              <tr className="border-b border-border/40 text-foreground">
                <th scope="col" className="text-left py-2.5 px-3 font-medium">{tr ? 'Dönem' : 'Period'}</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Taksit' : 'Instalments'}</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Yatırılan' : 'Invested'}</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Bugünkü Değer' : 'Value Today'}</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Getiri' : 'Return'}</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-border/20">
                  <th scope="row" className="text-left py-2.5 px-3 font-medium text-foreground">
                    {tr ? `Son ${r.label} yıl` : `Last ${r.label} years`}
                  </th>
                  <td className="text-right py-2.5 px-3 tabular-nums">{r.months}</td>
                  <td className="text-right py-2.5 px-3 tabular-nums">{usd(r.invested)}</td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-foreground">{usd(r.value)}</td>
                  <td className="text-right py-2.5 px-3 tabular-nums text-primary">+{r.roi.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>

        <p className="text-xs text-muted-foreground mt-4">
          {tr
            ? 'SIP = sistematik yatırım planı (aylık sabit tutar). Ücretler ve vergiler hariçtir; geçmiş getiri gelecek performansın göstergesi değildir.'
            : 'SIP = systematic investment plan (a fixed monthly amount). Excludes fees and taxes; past returns do not predict future performance.'}
        </p>
      </div>
    </section>
  );
};
