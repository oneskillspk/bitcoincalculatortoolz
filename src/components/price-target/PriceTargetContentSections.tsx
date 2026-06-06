import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const PriceTargetContentSections: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-12">

        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Bitcoin Sizi Ne Zaman Milyoner Yapar?' : 'When Does Bitcoin Make You a Millionaire?'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
            {tr ? (
              <>
                Kripto alanında en çok sorulan sorulardan biri <strong>"milyoner olmak için ne kadar Bitcoin'e ihtiyacım var?"</strong>dır. Cevap tamamen BTC'nin gelecekteki fiyatına bağlıdır. Kesin rakamlarınızı modellemek için yukarıdaki Bitcoin Milyoner Hesaplayıcısını kullanın veya aşağıdaki hızlı referans tablosuna bakın.
              </>
            ) : (
              <>
                One of the most-asked questions in the crypto space is <strong>"how much Bitcoin do I need to be a millionaire?"</strong> The answer depends entirely on the future price of BTC. Use the Bitcoin Millionaire Calculator above to model your exact numbers, or refer to the quick-reference table below.
              </>
            )}
          </p>
          <div className="overflow-x-auto rounded-lg border border-border/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    {tr ? 'BTC Ulaşırsa…' : 'If BTC Reaches…'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    {tr ? '1 Milyon Dolar için Gereken BTC' : 'BTC Needed for $1M'}
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {[
                  ['$200,000', '5.00 BTC'],
                  ['$500,000', '2.00 BTC'],
                  ['$1,000,000', '1.00 BTC'],
                  ['$2,000,000', '0.50 BTC'],
                  ['$5,000,000', '0.20 BTC'],
                ].map(([price, btc]) => (
                  <tr key={price} className="border-b border-border/20">
                    <td className="py-2.5 px-4 text-foreground">{price}</td>
                    <td className="py-2.5 px-4 text-right text-primary font-medium">{btc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {tr ? (
              <>
                1 milyon dolarlık Bitcoin fiyatında, yalnızca 1 BTC sizi milyoner yapar. 200 bin dolarda, 5 BTC'ye ihtiyacınız olur — bir{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">dolar maliyeti ortalama stratejisi</Link> kullanan disiplinli tasarruf sahipleri için hâlâ ulaşılabilir bir hedef.
              </>
            ) : (
              <>
                At a $1 million Bitcoin price, owning just 1 BTC makes you a millionaire. At $200k, you'd need 5 BTC — still an achievable goal for disciplined savers using a{' '}
                <Link to="/calculators/dca" className="text-primary hover:underline">dollar-cost averaging strategy</Link>.
              </>
            )}
          </p>
        </div>

        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Neden Yalnızca 21 Milyon Bitcoin Var Olacak' : 'Why Only 21 Million Bitcoin Will Ever Exist'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Bitcoin'in 21 milyon coin'lik sabit arz tavanı, uzun vadeli değer teklifini yönlendiren tek en önemli özelliktir. İstediğinde basılabilen fiat para birimlerinin aksine, kimse — hiçbir hükümet, hiçbir şirket, hiçbir geliştirici — 21 milyon BTC'den fazlasını yaratamaz."
              : "Bitcoin's hard-coded supply cap of 21 million coins is the single most important feature driving its long-term value proposition. Unlike fiat currencies that can be printed at will, nobody — no government, no corporation, no developer — can create more than 21 million BTC."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Bu kıtlığın çarpıcı bir sonucu var: <strong>Bitcoin coin başına 1 milyon dolara ulaşırsa, matematiksel olarak yalnızca yaklaşık 1 milyon Bitcoin milyoneri olabilir</strong> — ve bu, kalıcı olarak kaybolduğu tahmin edilen 3–4 milyon BTC hesaba katılmadan. Olası milyoner sayısı daha da az."
              : <><strong>if Bitcoin reaches $1 million per coin, there can mathematically only be about 1 million Bitcoin millionaires worldwide</strong> — and that's before accounting for the estimated 3–4 million BTC that are permanently lost. The real number of possible millionaires is even smaller.</>}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Her{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-yarilamaılanma-geri-sayım" className="text-primary hover:underline">yarılanma olayı</Link>, yeni arz hızını yarıya indirir ve mevcut Bitcoin'i giderek daha kıt hale getirir.{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-arz" className="text-primary hover:underline">Arz ve Kıtlık hesaplayıcımızla</Link> Bitcoin'in mevcut arz dinamiklerini takip edin.
              </>
            ) : (
              <>
                Every{' '}
                <Link to="/calculators/halving-countdown" className="text-primary hover:underline">halving event</Link> cuts the rate of new supply in half, making existing Bitcoin increasingly scarce. Track Bitcoin's current supply dynamics with our{' '}
                <Link to="/calculators/supply" className="text-primary hover:underline">Supply & Scarcity calculator</Link>.
              </>
            )}
          </p>
        </div>

        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'Bitcoin Fiyat Hedefleri — Modeller Ne Öngörüyor?' : 'Bitcoin Price Targets — What Do Models Predict?'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr ? (
              <>
                Yaygın olarak takip edilen birkaç model Bitcoin'in uzun vadeli seyrini öngörmektedir.{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-guc-yasasi" className="text-primary hover:underline">Güç Kanunu modeli</Link>, Bitcoin'in tüm fiyat geçmişinde log-log regresyonunu kullanır ve BTC'nin 2028 ile 2032 arasında 500 bin ile 1 milyon dolar arasına ulaşabileceğini, adil değerin zaman içinde katlanarak büyüyeceğini öne sürer.
              </>
            ) : (
              <>
                Several widely-followed models project Bitcoin's long-term trajectory. The{' '}
                <Link to="/calculators/power-law" className="text-primary hover:underline">Power Law model</Link> uses a log-log regression on Bitcoin's entire price history and suggests BTC could reach $500k–$1M between 2028 and 2032, with fair value growing exponentially over time.
              </>
            )}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "PlanB tarafından popülerleştirilen Stok-Akış (S2F) modeli, her yarılanmadan sonra Bitcoin'in azalan enflasyon oranına odaklanır. Kesin fiyat tahminleri tartışılmış olsa da yönlü tez — azalan arz ihracının fiyat artışını sağladığı — şimdiye kadar her yarılanma döngüsünde geçerliliğini korumuştur."
              : "The Stock-to-Flow (S2F) model, popularised by PlanB, focuses on Bitcoin's decreasing inflation rate after each halving. While its exact price predictions have been debated, the directional thesis — that decreasing supply issuance drives price appreciation — has held true across every halving cycle so far."}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Hiçbir model geleceği kesinlikle tahmin edemez, ancak her iki çerçeve de uzun vadeli BTC birikimini desteklemektedir. Öngörülen fiyat koridorlarını keşfetmek ve kendi hedeflerinizle karşılaştırmak için{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-guc-yasasi" className="text-primary hover:underline">Güç Kanunu Hesaplayıcısını</Link> kullanın.
              </>
            ) : (
              <>
                No model can predict the future with certainty, but both frameworks support the case for long-term BTC accumulation. Use our{' '}
                <Link to="/calculators/power-law" className="text-primary hover:underline">Power Law Calculator</Link> to explore projected price corridors and compare with your own targets.
              </>
            )}
          </p>
        </div>

      </div>
    </section>
  );
};
