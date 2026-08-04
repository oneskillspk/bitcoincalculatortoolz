import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/retirement/SectionHeader';
import { ScrollableTable } from '@/components/ui/ScrollableTable';

/** 1 BTC = 100,000,000 satoshis (fixed by the protocol). */
const ROWS: Array<[string, string, string]> = [
  ['1 BTC', '100,000,000 sats', '1,000 mBTC'],
  ['0.1 BTC', '10,000,000 sats', '100 mBTC'],
  ['0.01 BTC', '1,000,000 sats', '10 mBTC'],
  ['0.0045 BTC', '450,000 sats', '4.5 mBTC'],
  ['0.001 BTC', '100,000 sats', '1 mBTC'],
  ['0.0001 BTC', '10,000 sats', '0.1 mBTC'],
  ['0.00000001 BTC', '1 sat', '0.00001 mBTC'],
];

/**
 * "Stacking sats" / "0.1 BTC to satoshi" query cluster. These rank at
 * position 11-19 with zero clicks because the page never used the word
 * "stacking sats" and had no fixed conversion reference table.
 */
export const StackingSatsSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20" aria-labelledby="stacking-sats">
      <div className="container mx-auto px-6 max-w-3xl">
        <SectionHeader
          id="stacking-sats"
          eyebrow={tr ? 'Sats' : 'Sats'}
          title={tr ? 'Stacking Sats Ne Demek?' : 'What Does Stacking Sats Mean?'}
          lead={
            tr
              ? '1 BTC = 100.000.000 satoshi. Sabit dönüşüm tablosu aşağıda.'
              : '1 BTC = 100,000,000 satoshis. Fixed conversion table below.'
          }
          className="mb-8 md:mb-10"
        />

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 mb-8">
          <p>
            {tr
              ? '"Stacking sats", tam bir coin hedeflemek yerine Bitcoin\'i satoshi cinsinden — protokolün en küçük birimi, bir BTC\'nin yüz milyonda biri — küçük ve düzenli miktarlarda biriktirmek anlamına gelir. 50 $\'lık bir alım bugün yaklaşık 79.000 sat eder, dolayısıyla ifade fiyat seviyesinden bağımsız olarak birikimi somut kılar.'
              : '"Stacking sats" means accumulating Bitcoin in small, regular amounts denominated in satoshis — the protocol\'s smallest unit, one hundred-millionth of a BTC — instead of aiming for a whole coin. A $50 buy is roughly 79,000 sats today, so the phrase keeps accumulation tangible at any price level.'}
          </p>
          <p>
            {tr
              ? 'Satoshi sayısı fiyattan bağımsızdır: dönüşüm protokolde sabittir. Değişen tek şey, aynı doların kaç sat aldığıdır — bu yüzden sat biriktirenler dolar bakiyesini değil, sat sayısını takip eder.'
              : 'The satoshi count is independent of price: the conversion is fixed in the protocol. Only how many sats a given dollar buys changes — which is why sat stackers track sat count rather than a dollar balance.'}
          </p>
        </div>

        <ScrollableTable>
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">
              {tr ? 'Bitcoin, satoshi ve mBTC dönüşüm tablosu' : 'Bitcoin, satoshi and mBTC conversion table'}
            </caption>
            <thead>
              <tr className="border-b border-border/40 text-foreground">
                <th scope="col" className="text-left py-2.5 px-3 font-medium">Bitcoin</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Satoshi' : 'Satoshis'}</th>
                <th scope="col" className="text-right py-2.5 px-3 font-medium">mBTC</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {ROWS.map(([btc, sats, mbtc]) => (
                <tr key={btc} className="border-b border-border/20">
                  <th scope="row" className="text-left py-2.5 px-3 font-medium text-foreground whitespace-nowrap">{btc}</th>
                  <td className="text-right py-2.5 px-3 tabular-nums whitespace-nowrap">{sats}</td>
                  <td className="text-right py-2.5 px-3 tabular-nums whitespace-nowrap">{mbtc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>

        <p className="text-xs text-muted-foreground mt-4">
          {tr
            ? 'Herhangi bir tutarı canlı fiyatla çevirmek için yukarıdaki dönüştürücüyü kullanın.'
            : 'Use the converter above to price any amount at the live rate.'}
        </p>
      </div>
    </section>
  );
};
