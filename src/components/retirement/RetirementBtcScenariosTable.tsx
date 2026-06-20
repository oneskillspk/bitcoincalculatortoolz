import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocale } from "@/hooks/useLocale";
import { formatCurrencyAmount } from "@/utils/formatCurrency";
import { SectionHeader } from "./SectionHeader";

const scenarios = [{ btc: 1, label: "1 BTC" }, { btc: 5, label: "5 BTC" }, { btc: 10, label: "10 BTC" }];
const priceTargets = [100000, 250000, 500000, 1000000];

export const RetirementBtcScenariosTable = () => {
  const { language } = useLanguage();
  const { defaultCurrency } = useLocale();
  const tr = language === 'tr';
  const numLocale = tr ? 'tr-TR' : (defaultCurrency === 'TRY' ? 'tr-TR' : 'en-US');
  const formatCurrency = (value: number) =>
    formatCurrencyAmount(value, defaultCurrency, { compact: value >= 1_000_000, locale: numLocale, decimals: value >= 1_000_000 ? 1 : 0 });
  const formatMonthly = (annual: number) => formatCurrencyAmount(Math.round(annual / 12), defaultCurrency, { locale: numLocale });
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeader
          eyebrow={tr ? 'Emeklilik Senaryoları' : 'Retirement Scenarios'}
          title={tr ? 'Emekli Olmak İçin Ne Kadar Bitcoin?' : 'How Much Bitcoin to Retire?'}
          lead={tr
            ? 'Farklı BTC fiyat hedeflerinde %4 çekim kuralının nasıl göründüğü.'
            : 'What the 4% withdrawal rule looks like at different BTC price targets.'}
        />

        <ScrollableTable className="rounded-xl border border-border/50 bg-card" fadeFromClass="from-card" ariaLabel={tr ? 'Bitcoin emeklilik senaryoları' : 'Bitcoin retirement scenarios'}>
          <table className="w-full border-collapse min-w-[640px] text-sm">
            <caption className="sr-only">{tr ? 'BTC sahipliğine ve fiyat hedefine göre emeklilik portföy değeri ve %4 çekim geliri.' : 'Retirement portfolio value and 4% withdrawal income by BTC holdings and price target.'}</caption>
            <thead>
              <tr className="bg-muted/40 border-b border-border/50">
                <th scope="col" className="sticky left-0 z-10 bg-muted/40 text-left py-3 px-3 sm:px-4 text-xs font-semibold text-foreground uppercase tracking-wider">{tr ? 'BTC Sahipliği' : 'BTC Held'}</th>
                {priceTargets.map(price => (
                  <th key={price} scope="col" className="text-right py-3 px-3 sm:px-4 text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">BTC @ {formatCurrency(price)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scenarios.map(({ btc, label }) => (
                <tr key={btc} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <th scope="row" className="sticky left-0 z-10 bg-card py-4 px-3 sm:px-4 font-medium text-foreground text-left whitespace-nowrap">{label}</th>
                  {priceTargets.map(price => {
                    const portfolioValue = btc * price;
                    const annualWithdrawal = portfolioValue * 0.04;
                    return (
                      <td key={price} className="py-4 px-3 sm:px-4 text-right whitespace-nowrap">
                        <div className="font-mono text-foreground tabular-nums">{formatCurrency(portfolioValue)}</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono tabular-nums">
                          {formatCurrency(annualWithdrawal)}/{tr ? 'yıl' : 'yr'} · {formatMonthly(annualWithdrawal)}/{tr ? 'ay' : 'mo'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>

        <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          {tr ? 'Açıklayıcı senaryolar (%4 güvenli çekim kuralı). Kişisel planınız için yukarıdaki hesap makinesini kullanın.' : 'Illustrative scenarios using the 4% safe withdrawal rule. Use the calculator above for your personalized plan.'}
        </p>
      </div>
    </section>
  );
};