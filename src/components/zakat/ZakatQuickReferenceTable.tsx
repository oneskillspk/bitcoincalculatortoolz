import { NisabData, SupportedCurrency, convertUsd, formatCurrency, ZAKAT_RATE, getQuickReferenceAmounts } from '@/services/zakatCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  nisab: NisabData;
  currency: SupportedCurrency;
}

export const ZakatQuickReferenceTable = ({ nisab, currency }: Props) => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const amounts = getQuickReferenceAmounts();

  return (
    <div className="space-y-4">
      <h2 className="text-h2 font-bold text-foreground">
        {tr ? 'Hızlı Başvuru — Miktara Göre Bitcoin Zekâtı' : 'Quick Reference — Bitcoin Zakat by Amount'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {tr
          ? 'Tüm değerler güncel BTC fiyatı ve döviz kurlarıyla anlık güncellenmektedir.'
          : 'All values update live with current BTC price and exchange rates.'}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left py-3 px-2 text-muted-foreground font-medium">{tr ? 'Tutulan BTC' : 'BTC Held'}</th>
              <th className="text-right py-3 px-2 text-muted-foreground font-medium">USD {tr ? 'Değeri' : 'Value'}</th>
              <th className="text-right py-3 px-2 text-muted-foreground font-medium">{currency} {tr ? 'Değeri' : 'Value'}</th>
              <th className="text-right py-3 px-2 text-muted-foreground font-medium">{tr ? 'Zekât (%2,5)' : 'Zakat (2.5%)'}</th>
            </tr>
          </thead>
          <tbody>
            {amounts.map(btc => {
              const usd = btc * nisab.btcUsd;
              const local = convertUsd(usd, currency, nisab.exchangeRates);
              const zakat = usd * ZAKAT_RATE;
              const zakatLocal = convertUsd(zakat, currency, nisab.exchangeRates);
              return (
                <tr key={btc} className="border-b border-border/20 hover:bg-muted/20">
                  <td className="py-3 px-2 font-medium text-foreground">{btc} BTC</td>
                  <td className="py-3 px-2 text-right text-foreground">{formatCurrency(usd, 'USD')}</td>
                  <td className="py-3 px-2 text-right text-foreground">{currency !== 'USD' ? formatCurrency(local, currency) : '—'}</td>
                  <td className="py-3 px-2 text-right text-primary font-semibold">{formatCurrency(zakatLocal, currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
