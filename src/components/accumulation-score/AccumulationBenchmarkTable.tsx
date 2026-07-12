import { BENCHMARK_TABLE_DATA } from '@/services/accumulationScoreService';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatGroupedInt } from '@/utils/numberFormat';

interface Props {
  btcPrice: number;
}

export const AccumulationBenchmarkTable = ({ btcPrice }: Props) => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const locale = tr ? 'tr-TR' : 'en-US';

  return (
    <div className="space-y-4">
      <h2 className="text-h2 font-bold text-foreground">
        {tr ? 'Yaşa Göre Bitcoin Birikim Hedefi' : 'Bitcoin Accumulation Target by Age'}
      </h2>
      <p className="text-muted-foreground">
        {tr
          ? "Bu tablo, Bitcoin Yaşam Döngüsü Modeli'ne dayalı olarak her yaş için ideal Bitcoin birikim referansını gösterir — Güç Yasası değer artışı ile tipik yaşam döngüsü gelir çan eğrisinin çarpımı. En yüksek birikim yaklaşık 40 yaşında gerçekleşir."
          : "This table shows the ideal Bitcoin accumulation benchmark for each age based on the Bitcoin Lifecycle Model — a Power Law appreciation curve multiplied by a typical lifecycle income bell curve. Peak accumulation occurs around age 40."}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">{tr ? 'Yaş' : 'Age'}</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">{tr ? 'Hedef BTC' : 'Target BTC'}</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">{tr ? 'USD Değeri' : 'USD Value'}</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">{tr ? 'Yaşam Aşaması' : 'Life Phase'}</th>
            </tr>
          </thead>
          <tbody>
            {BENCHMARK_TABLE_DATA.map((row, i) => (
              <tr key={row.age} className={`border-b border-border/30 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                <td className="px-4 py-3 font-medium text-foreground">{row.age}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{row.btc.toFixed(4)}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">
                  ${formatGroupedInt(row.btc * btcPrice, locale)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.phase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        {tr
          ? `USD değerleri, güncel canlı Bitcoin fiyatı olan $${formatGroupedInt(btcPrice, locale)} üzerinden hesaplanmıştır. Veri kaynağı: Bitcoin Yaşam Döngüsü Birikim Modeli (Güç Yasası × gelir eğrisi). Nisan 2026 güncellemesi.`
          : `USD values based on current live Bitcoin price of $${formatGroupedInt(btcPrice, locale)}. Data source: Bitcoin Lifecycle Accumulation Model (Power Law × income curve). Updated April 2026.`}
      </p>
    </div>
  );
};
