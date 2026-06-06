import { Bitcoin } from "lucide-react";
import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrencyAmount } from "@/utils/formatCurrency";

const scenarios = [{ btc: 1, label: "1 BTC" }, { btc: 5, label: "5 BTC" }, { btc: 10, label: "10 BTC" }];
const priceTargets = [100000, 250000, 500000, 1000000];

export const RetirementBtcScenariosTable = () => {
  const { language } = useLanguage();
  const { defaultCurrency } = useLocale();
  const tr = language==='tr';
  const numLocale = tr ? 'tr-TR' : (defaultCurrency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (value: number) =>
    formatCurrencyAmount(value, defaultCurrency, { compact: value >= 1_000_000, locale: numLocale, decimals: value >= 1_000_000 ? 1 : 0 });
  const formatMonthly = (annual: number) => formatCurrencyAmount(Math.round(annual / 12), defaultCurrency, { locale: numLocale });
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Bitcoin className="w-4 h-4" />
            {tr?'Emeklilik Senaryoları':'Retirement Scenarios'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr?'Emekli Olmak İçin Ne Kadar Bitcoin Gerekir?':'How Much Bitcoin Do You Need to Retire?'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr?'Cevap Bitcoin’in gelecekteki fiyatına ve yıllık ne kadar gelire ihtiyacınız olduğuna bağlıdır. Bu tablo, farklı BTC fiyat hedeflerinde %4 çekim kuralının nasıl göründüğünü gösterir.':'The answer depends on Bitcoin\'s future price and how much annual income you need. This table shows what the 4% withdrawal rule looks like at different BTC price targets.'}
          </p>
        </div>

        <ScrollableTable ariaLabel={tr?'Bitcoin emeklilik senaryoları':'Bitcoin retirement scenarios'}>
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">{tr?'BTC Sahipliği':'BTC Held'}</th>
                {priceTargets.map(price => (
                  <th key={price} className="text-center py-4 px-4 text-sm font-semibold text-foreground">BTC @ {formatCurrency(price)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map(({ btc, label }) => (
                <tr key={btc} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                  <td className="py-5 px-4">
                    <span className="font-semibold text-foreground text-base">{label}</span>
                  </td>
                  {priceTargets.map(price => {
                    const portfolioValue = btc * price;
                    const annualWithdrawal = portfolioValue * 0.04;
                    return (
                      <td key={price} className="py-5 px-4 text-center">
                        <div className="text-foreground font-medium">{formatCurrency(portfolioValue)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(annualWithdrawal)}/{tr?'yıl':'yr'} · {formatMonthly(annualWithdrawal)}/{tr?'ay':'mo'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>

        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          {tr?'Bunlar %4 güvenli çekim kuralını kullanan açıklayıcı senaryolardır. Gerçek emeklilik geliriniz zamanlama, vergiler ve harcama ihtiyaçlarına bağlıdır.':'These are illustrative scenarios using the 4% safe withdrawal rule. Your actual retirement income depends on timing, taxes, and spending needs.'}
          <strong className="text-foreground"> {tr?'Kişisel planınız için yukarıdaki hesap makinesini kullanın.':'Use the calculator above for your personalized plan.'}</strong>
        </p>
      </div>
    </section>
  );
};