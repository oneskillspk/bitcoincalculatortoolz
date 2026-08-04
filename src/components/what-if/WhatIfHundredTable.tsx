import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/what-if/SectionHeader';

/** Reference valuation price — Bitcoin's all-time high close. */
const REF_PRICE = 126198;
const REF_DATE_EN = 'October 6, 2025';
const REF_DATE_TR = '6 Ekim 2025';

/** January 1 opening price for each year (USD, daily close data). */
const JAN1: Array<[number, number]> = [
  [2011, 0.3],
  [2012, 5.27],
  [2013, 13.3],
  [2014, 770],
  [2015, 314],
  [2016, 434],
  [2017, 998],
  [2018, 13880],
  [2019, 3746],
  [2020, 7200],
  [2021, 29374],
  [2022, 46306],
  [2023, 16547],
  [2024, 44167],
  [2025, 93429],
];

const usd = (n: number) =>
  n >= 1000
    ? `$${Math.round(n).toLocaleString('en-US')}`
    : `$${n.toFixed(2)}`;

/**
 * "What if I invested $100 in Bitcoin" — year-by-year answer table.
 *
 * Targets the highest-volume long-tail variant of the what-if query
 * ("$100 in bitcoin in 2010/2013/2020") with a single extractable answer
 * block: buy date, BTC bought, value at the reference price, and multiple.
 */
export const WhatIfHundredTable = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const rows = JAN1.map(([year, price]) => {
    const btc = 100 / price;
    const value = btc * REF_PRICE;
    return { year, price, btc, value, multiple: value / 100 };
  }).reverse();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <SectionHeader
        title={
          tr
            ? "Bitcoin'e 100 Dolar Yatırsaydım Ne Olurdu? (Yıla Göre)"
            : 'What If I Invested $100 in Bitcoin? (Year by Year)'
        }
        lead={
          tr
            ? `Her yılın 1 Ocak fiyatından alınan 100 $, Bitcoin'in ${REF_DATE_TR} tarihli ${usd(REF_PRICE)} rekor seviyesinde ne değerde olurdu.`
            : `What $100 bought on January 1 of each year would be worth at Bitcoin's record ${usd(REF_PRICE)} close on ${REF_DATE_EN}.`
        }
        className="mb-6 md:mb-8"
      />

      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        {tr
          ? `Kısa cevap: 2013'te Bitcoin'e yatırılan 100 $ (BTC ${usd(13.3)}) 7,52 BTC alırdı ve rekor seviyede yaklaşık ${usd(948857)} değerinde olurdu. 2020'de yatırılan aynı 100 $ ${usd(1753)}, 2024'te yatırılan ise ${usd(286)} olurdu. Kendi tarihinizi ve tutarınızı yukarıdaki hesaplayıcıya girin.`
          : `Short answer: $100 put into Bitcoin on January 1, 2013 (BTC at ${usd(13.3)}) bought 7.52 BTC — about ${usd(948857)} at the all-time high. The same $100 invested in 2020 would be ${usd(1753)}, and in 2024 about ${usd(286)}. Enter your own date and amount in the calculator above for an exact figure.`}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <caption className="sr-only">
            {tr
              ? '$100 Bitcoin yatırımının yıla göre değeri'
              : 'Value of a $100 Bitcoin investment by year'}
          </caption>
          <thead className="bg-muted/40 text-left">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-semibold">{tr ? 'Yatırım tarihi' : 'Invested on'}</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">{tr ? 'BTC fiyatı' : 'BTC price'}</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">{tr ? 'Alınan BTC' : 'BTC bought'}</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">{tr ? 'Rekor seviyedeki değeri' : 'Worth at ATH'}</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">{tr ? 'Kat' : 'Multiple'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-t border-border/50">
                <th scope="row" className="px-3 py-2.5 font-medium text-foreground text-left">
                  {tr ? `1 Oca ${r.year}` : `Jan 1, ${r.year}`}
                </th>
                <td className="px-3 py-2.5 text-muted-foreground">{usd(r.price)}</td>
                <td className="px-3 py-2.5 text-muted-foreground">
                  {r.btc >= 1 ? r.btc.toFixed(2) : r.btc.toFixed(5)} BTC
                </td>
                <td className="px-3 py-2.5 font-semibold text-foreground">{usd(r.value)}</td>
                <td className="px-3 py-2.5 text-primary font-medium">{Math.round(r.multiple).toLocaleString('en-US')}×</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        {tr
          ? 'Fiyatlar günlük kapanış verisidir; ücretler ve vergiler hariçtir. Geçmiş getiriler gelecek getirileri garanti etmez.'
          : 'Prices are daily closes and exclude fees and taxes. Past returns do not guarantee future returns.'}
      </p>
    </div>
  );
};
