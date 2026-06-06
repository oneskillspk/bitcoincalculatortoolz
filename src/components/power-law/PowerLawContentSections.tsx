import { Link } from "@/components/LocalizedLink";
import { calculatePowerLawPrice, getDaysSinceGenesis } from "@/services/powerLawCalculator";
import { useLanguage } from '@/contexts/LanguageContext';

const formatUSD = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return `$${n.toFixed(2)}`;
};

export const PowerLawContentSections = ({ currentPrice }: { currentPrice?: number }) => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const today = new Date();
  const todayResult = calculatePowerLawPrice(today);
  const days = getDaysSinceGenesis(today);
  const deviationPct = currentPrice
    ? (((currentPrice - todayResult.fairValue) / todayResult.fairValue) * 100).toFixed(1)
    : null;

  const result2030 = calculatePowerLawPrice(new Date('2030-01-01'));
  const result2035 = calculatePowerLawPrice(new Date('2035-01-01'));

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-3xl space-y-12">

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Bitcoin Güç Kanunu Nedir?" : "What Is the Bitcoin Power Law?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Bitcoin Güç Kanunu, Bitcoin'in fiyatı ile 3 Ocak 2009'daki Genesis Blok'undan bu yana geçen gün sayısı arasındaki matematiksel bir ilişkidir. Astrofizikçi Giovanni Santostasi, Bitcoin'in tüm fiyat geçmişini log-log grafikte çizdiğinizde veri noktalarının olağanüstü düz bir çizgi oluşturduğunu keşfetti. Bu düz çizgi <strong>Fiyat = A × Gün<sup>5,8</sup></strong> formülünü izler; A, regresyon analizinden türetilen bir sabit, Gün ise sıfır bloktan bu yana her günü sayar.
              </>
            ) : (
              <>
                The Bitcoin Power Law is a mathematical relationship between Bitcoin's price and the number of days since the Genesis Block on January 3, 2009. Astrophysicist Giovanni Santostasi discovered that when you plot Bitcoin's entire price history on a log-log chart, the data points form a remarkably straight line. That straight line follows the formula <strong>Price = A × Days<sup>5.8</sup></strong>, where A is a constant derived from regression analysis and Days counts every day since block zero.
              </>
            )}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? `Güç kanunları Bitcoin'e özgü değildir. Deprem büyüklüklerini, şehir nüfus dağılımlarını ve hatta yıldızların parlaklığını tanımlarlar. Bitcoin'in uyumunu olağandışı kılan, tutarlılığıdır: R² değeri, birden fazla piyasa döngüsü, yarılanma ve düzenleyici şoklara yayılan ${Math.floor(days / 365)}+ yıllık veri boyunca 0,95'i aşmaktadır.`
              : `Power laws aren't unique to Bitcoin. They describe earthquake magnitudes, city population distributions, and even the brightness of stars. What makes Bitcoin's fit unusual is its consistency: the R² value exceeds 0.95 across ${Math.floor(days / 365)}+ years of data spanning multiple market cycles, halvings, and regulatory shocks.`}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Yıla Göre Bitcoin Güç Kanunu Fiyat Tahminleri" : "Bitcoin Power Law Price Predictions by Year"}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? `Yukarıdaki formülü kullanarak model, Ocak 2030 için ${formatUSD(result2030.fairValue)} adil değerini, ${formatUSD(result2030.support)} civarında bir destek tabanını ve ${formatUSD(result2030.resistance)} yakınında bir direnç tavanını öngörmektedir. Ocak 2035'e kadar bu rakamlar ${formatUSD(result2035.fairValue)} adil değeri, ${formatUSD(result2035.support)} tabanı ve ${formatUSD(result2035.resistance)} tavanına yükselmektedir.`
              : `Using the formula above, the model projects a fair value of ${formatUSD(result2030.fairValue)} for January 2030 with a support floor around ${formatUSD(result2030.support)} and a resistance ceiling near ${formatUSD(result2030.resistance)}. By January 2035, those numbers climb to a fair value of ${formatUSD(result2035.fairValue)}, a floor of ${formatUSD(result2035.support)}, and a ceiling of ${formatUSD(result2035.resistance)}.`}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? "Bu projeksiyonlar havadan alınmamıştır. Aynı eğriyi 2009'dan bu yana Bitcoin'in fiyatını izleyerek uzatırlar. Destek bandı (adil değerin üçe bölünmesi), Bitcoin'in tarihsel olarak uzun süre altında kalmayı reddettiği fiyat seviyesini temsil eder. Direnç bandı (adil değerin üçle çarpılması), boğa piyasaları sırasında ani zirvelerin tepe noktasını işaretler. 2026'dan 2036'ya kadar her yıl için yıl bazında tam projeksiyon tablosuna aşağıdan bakın."
              : "These projections aren't pulled from thin air. They extend the same curve that has tracked Bitcoin's price since 2009. The support band (fair value divided by 3) represents the price level Bitcoin has historically refused to stay below for long. The resistance band (fair value multiplied by 3) marks where blow-off tops have peaked during bull markets. Check the full year-by-year projection table below for every year from 2026 through 2036."}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Bitcoin Şu An Güç Kanunundan Ne Kadar Uzakta?" : "How Far Is Bitcoin From the Power Law Right Now?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                {`Bugünün Güç Kanunu adil değeri ${formatUSD(todayResult.fairValue)} seviyesindedir.`}
                {currentPrice && deviationPct ? (
                  <> {`Bitcoin şu anda ${formatUSD(currentPrice)} seviyesinde işlem görmektedir; bu onu modelin adil değerinin ${parseFloat(deviationPct) >= 0 ? `%${deviationPct} üzerinde` : `%${Math.abs(parseFloat(deviationPct))} altında`} konumlandırmaktadır.`} </>
                ) : (
                  <> {" Bugün Bitcoin'in model çizgisinden tam olarak ne kadar uzakta durduğunu görmek için yukarıdaki canlı fiyat verisine bağlanın."} </>
                )}
                {" Tarihsel olarak en iyi uzun vadeli alım fırsatları Bitcoin'in adil değerin %30 veya daha fazla altında, destek bandının derinliklerinde işlem gördüğü zamanlarda gerçekleşti. Tersine, adil değerin +%100 üzerindeki okumalar 2013, 2017 ve 2021'deki döngü zirvelerine denk geldi."}
              </>
            ) : (
              <>
                Today's Power Law fair value sits at {formatUSD(todayResult.fairValue)}.
                {currentPrice && deviationPct ? (
                  <> Bitcoin is currently trading at {formatUSD(currentPrice)}, which puts it {parseFloat(deviationPct) >= 0 ? `${deviationPct}% above` : `${Math.abs(parseFloat(deviationPct))}% below`} the model's fair value. </>
                ) : (
                  <> Connect to live price data above to see exactly how far Bitcoin sits from the model line today. </>
                )}
                Historically, the best long-term buying opportunities occurred when Bitcoin traded 30% or more below fair value, deep inside the support band. Conversely, readings above +100% from fair value have aligned with cycle tops in 2013, 2017, and 2021.
              </>
            )}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Bu sapmayı hesap makinemizin sonuçlar panelinde takip edebilirsiniz. Yüzde, canlı piyasa verilerini kullanarak her 30 saniyede bir güncellenir; bu da size Bitcoin'in uzun vadeli trendine göre nerede durduğunu gösteren gerçek zamanlı bir gösterge sağlar. Derin değersizlik dönemlerinde birikim planlamak için{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">DCA hesaplayıcısı</Link> ile birleştirin.
              </>
            ) : (
              <>
                You can track this deviation in the results panel of our calculator. The percentage updates every 30 seconds using live market data, giving you a real-time gauge of where Bitcoin sits relative to its long-term trend. Pair it with the <Link to="/calculators/dca" className="text-primary hover:underline">DCA calculator</Link> to plan accumulation during periods of deep undervaluation.
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Güç Kanunu ile Stok-Akış: Hangisi Daha Doğruydu?" : "Power Law vs Stock-to-Flow: Which Was More Accurate?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? "PlanB'nin Stok-Akış (S2F) modeli 2021 yılı sonuna kadar Bitcoin'in 100 bin dolara ulaşacağını tahmin etti. Ulaşmadı. Model, 2021 döngü zirvesinden sonra bozuldu ve fiyat tahminleri o tarihten bu yana gerçeklikten önemli ölçüde saptı. S2F, fiyatı Bitcoin'in kıtlık oranına (stok bölü yıllık üretim) bağlar; bu da her yarılanmada düzgün bir eğri yerine ayrık sıçramalar yaratarak keskin şekilde sıfırlanır."
              : "PlanB's Stock-to-Flow (S2F) model predicted Bitcoin would reach $100K by the end of 2021. It didn't. The model broke down after the 2021 cycle top, and its price predictions have diverged significantly from reality since then. S2F ties price to Bitcoin's scarcity ratio (stock divided by annual production), which resets sharply at each halving, creating discrete jumps rather than a smooth curve."}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Güç Kanunu ise tam tersine, zaman ile tek girdi değişkeni olarak kullanır. Doğrudan yarılanma olaylarına veya arz dinamiklerine bağlı değildir. Sürekli eğrisi 2022 ayı piyasası boyunca ve 2026'ya kadar doğruluğunu korudu. S2F, arz kıtlığını anlamak için faydalı bir çerçeve olmaya devam ederken, Güç Kanunu tam piyasa döngüleri boyunca fiyat koridoru tahmini için daha güvenilir olduğunu kanıtladı. Hiçbir model tek başına yatırım tezi olarak kullanılmamalıdır. Herhangi bir Bitcoin pozisyonunun risk tarafını anlamak için{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dusus-analizi" className="text-primary hover:underline">düşüş hesaplayıcısını</Link> incelemeyi düşünün.
              </>
            ) : (
              <>
                The Power Law, by contrast, uses time as its only input variable. It doesn't depend on halving events or supply dynamics directly. Its continuous curve has maintained accuracy through the 2022 bear market and into 2026. While S2F remains a useful framework for understanding supply scarcity, the Power Law has proven more reliable for price corridor estimation across full market cycles. Neither model should be used as a sole investment thesis. Consider reviewing our <Link to="/calculators/drawdown" className="text-primary hover:underline">drawdown calculator</Link> to understand the risk side of any Bitcoin position.
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? "Güç Kanunu Modelinin Sınırlamaları" : "Limitations of the Power Law Model"}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr
              ? "Hiçbir model geleceği kesinlikle tahmin edemez ve Güç Kanununun gerçek kısıtlamaları vardır. Birincisi, 2009'dan bu yana geçerli olan güç kanunu ilişkisinin süresiz devam edeceğini varsayar. Bitcoin'in piyasa değeri trilyonlara yükseldiğinde, azalan getiriler eğriyi modelin beklentilerinin altına indirebilir. İkincisi model, kısa vadeli fiyat hareketi hakkında hiçbir şey söylemiyor. Bitcoin, geri dönmeden önce aylarca veya yıllarca adil değerin üzerinde veya altında kalabilir."
              : "No model predicts the future with certainty, and the Power Law has real constraints. First, it assumes the power-law relationship that held from 2009 will continue indefinitely. As Bitcoin's market cap grows into the trillions, diminishing returns could flatten the curve below the model's expectations. Second, the model says nothing about short-term price action. Bitcoin can spend months or years above or below fair value before reverting."}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Üçüncüsü, hükümet yasakları, protokol düzeyinde hatalar veya rakip teknolojiler gibi dış şoklar modelin kapsamının tamamen dışındadır. Güç Kanunu, en iyi bir ticaret sinyali değil, uzun vadeli bir değerleme pusulası olarak işlev görür. Tam bir Bitcoin stratejisi için{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-emeklilik-hesaplayicisi" className="text-primary hover:underline">emeklilik hesaplayıcısı</Link> ve{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-kar-zarar-hesaplayicisi" className="text-primary hover:underline">kâr/zarar hesaplayıcısı</Link> gibi araçlarla birlikte kullanın.
              </>
            ) : (
              <>
                Third, external shocks like government bans, protocol-level bugs, or competing technologies fall outside the model's scope entirely. The Power Law works best as a long-term valuation compass, not a trading signal. Use it alongside tools like our <Link to="/calculators/retirement" className="text-primary hover:underline">retirement calculator</Link> and <Link to="/calculators/profit-loss" className="text-primary hover:underline">profit/loss calculator</Link> for a fuller picture of your Bitcoin strategy.
              </>
            )}
          </p>
        </div>

      </div>
    </section>
  );
};
