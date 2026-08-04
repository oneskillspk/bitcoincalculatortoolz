import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/retirement/SectionHeader';
import { ScrollableTable } from '@/components/ui/ScrollableTable';

/**
 * Regime bands rather than invented per-year decimals. Each band is defined by
 * the annualized-vol reading itself, with the historical episodes that sat in
 * it — factual, and directly usable for sizing.
 */
const BANDS = [
  {
    band: '< 30%',
    daily: '1.6%',
    en: 'Rare for BTC — only seen in the quietest post-halving consolidations',
    tr: 'BTC için nadir — yalnızca en sakin halving sonrası konsolidasyonlarda',
  },
  {
    band: '30–45%',
    daily: '1.6–2.4%',
    en: 'Calm regime; comparable to a high-beta tech stock',
    tr: 'Sakin rejim; yüksek beta bir teknoloji hissesiyle karşılaştırılabilir',
  },
  {
    band: '45–60%',
    daily: '2.4–3.1%',
    en: 'The most common Bitcoin regime of the ETF era',
    tr: 'ETF döneminin en yaygın Bitcoin rejimi',
  },
  {
    band: '60–80%',
    daily: '3.1–4.2%',
    en: 'Elevated — trending bull phases and post-halving expansion',
    tr: 'Yükselmiş — trendli boğa evreleri ve halving sonrası genişleme',
  },
  {
    band: '> 80%',
    daily: '> 4.2%',
    en: 'Crisis regime — March 2020, May 2021, the 2022 FTX collapse',
    tr: 'Kriz rejimi — Mart 2020, Mayıs 2021, 2022 FTX çöküşü',
  },
];

/**
 * Answers the "bitcoin standard deviation daily returns" / "annualized
 * volatility historical range" / "volatility vs S&P 500" query cluster with
 * the formula, a worked example, and the regime table — the content those
 * impressions were landing on a page that never stated it.
 */
export const VolatilityStdDevSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <div className="space-y-6" id="standard-deviation">
      <SectionHeader
        eyebrow={tr ? 'Formül' : 'The Formula'}
        title={
          tr
            ? 'Bitcoin Günlük Getirilerinin Standart Sapması ve Yıllık Volatilite Aralığı'
            : 'Bitcoin Standard Deviation of Daily Returns and Annualized Volatility Range'
        }
        className="mb-6"
      />

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
        <p>
          {tr
            ? "Bitcoin'in günlük getirilerinin standart sapması, günlük logaritmik getirilerin (ln(bugünkü kapanış ÷ dünkü kapanış)) ortalamalarından sapmasıdır. Bunu yıllıklandırmak için √365 ile çarpın; tersine çevirmek için yıllık okumayı √365'e (≈19,1) bölerek beklenen günlük hareketi bulun."
            : 'The standard deviation of Bitcoin daily returns is the dispersion of daily log returns — ln(today\'s close ÷ yesterday\'s close) — around their mean. Multiply it by √365 to annualize. Reverse it by dividing the annualized reading by √365 (≈19.1) to get the expected daily move.'}
        </p>
        <p className="font-mono text-xs bg-muted/40 border border-border/40 rounded-lg p-3 not-prose text-foreground">
          {tr
            ? 'Yıllık vol = günlük getirilerin std. sapması × √365 · Günlük hareket = yıllık vol ÷ 19,1'
            : 'Annualized vol = stdev(daily log returns) × √365 · Daily move = annualized vol ÷ 19.1'}
        </p>
        <p>
          {tr
            ? "Örnek: günlük standart sapma %2,6 ise yıllık volatilite %2,6 × 19,1 ≈ %49,7 olur. Bu, ortalama bir günde her iki yönde de yaklaşık %2,6'lık bir hareket ve günlerin yaklaşık üçte ikisinde bu aralıkta kalan bir kapanış demektir. Yukarıdaki canlı panel bu hesabı 7, 30, 60, 90 ve 365 günlük pencerelerde gerçek fiyat verisiyle çalıştırır."
            : 'Worked example: a daily standard deviation of 2.6% annualizes to 2.6% × 19.1 ≈ 49.7%. That means an average day moves about 2.6% in either direction, and roughly two-thirds of days close inside that band. The live dashboard above runs this same calculation over 7, 30, 60, 90 and 365-day windows using real price data.'}
        </p>
      </div>

      <ScrollableTable>
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">
            {tr
              ? 'Bitcoin yıllık volatilite rejim aralıkları'
              : 'Bitcoin annualized volatility regime bands'}
          </caption>
          <thead>
            <tr className="border-b border-border/40 text-foreground">
              <th scope="col" className="text-left py-2.5 px-3 font-medium">{tr ? 'Yıllık Vol' : 'Annualized Vol'}</th>
              <th scope="col" className="text-right py-2.5 px-3 font-medium">{tr ? 'Beklenen Günlük Hareket' : 'Expected Daily Move'}</th>
              <th scope="col" className="text-left py-2.5 px-3 font-medium">{tr ? 'Rejim' : 'Regime'}</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {BANDS.map((b) => (
              <tr key={b.band} className="border-b border-border/20">
                <th scope="row" className="text-left py-2.5 px-3 font-medium text-foreground whitespace-nowrap">{b.band}</th>
                <td className="text-right py-2.5 px-3 tabular-nums whitespace-nowrap">{b.daily}</td>
                <td className="py-2.5 px-3">{tr ? b.tr : b.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
        <p>
          {tr
            ? "S&P 500 uzun vadede yaklaşık %16 yıllık volatilite ile işlem görür; bu da ortalama %0,84'lük bir günlük harekettir. %50'lik bir Bitcoin okuması, günlük bazda S&P 500'ün yaklaşık üç katı hareket demektir — aynı dolar riski için yaklaşık üçte bir pozisyon büyüklüğü gerekir."
            : 'The S&P 500 trades near 16% annualized volatility over the long run, an average daily move of about 0.84%. A 50% Bitcoin reading therefore moves roughly three times as much per day — which means roughly one-third the position size for the same dollar risk.'}
        </p>
      </div>
    </div>
  );
};
