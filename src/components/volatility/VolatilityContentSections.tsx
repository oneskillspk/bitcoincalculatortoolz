import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { VolatilityStdDevSection } from '@/components/volatility/VolatilityStdDevSection';

export const VolatilityContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">

        <VolatilityStdDevSection />


        <VolatilityStdDevSection />

        {/* Section A */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Bitcoin Volatilitesinin Gerçekte Neyi Ölçtüğü' : 'What Bitcoin Volatility Actually Measures'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr
                ? 'Volatilite, Bitcoin\'in günlük getirilerinin ortalamaları etrafında ne kadar geniş salınım yaptığını gösteren istatistiksel bir okumadır. Bu sayfada alıntılanan rakam gerçekleşen volatilitedir; 365\'in karekökü ile çarpılarak yıllıklandırılan günlük logaritmik getirilerin standart sapması olarak hesaplanır. %60\'lık yıllıklandırılmış bir okuma, her iki yönde de yaklaşık %3,1\'lik beklenen bir günlük harekete çevrilir; bu da tipik bir BTC işlem gününün nasıl hissettirdiğiyle örtüşür.'
                : "Volatility is a statistical reading of how widely Bitcoin's daily returns swing around their average. The number quoted on this page is realized volatility, calculated as the standard deviation of daily log returns annualized by multiplying by the square root of 365. A 60% annualized reading translates to an expected daily move of roughly 3.1% in either direction, which lines up with how a typical BTC trading day actually feels."}
            </p>
            <p>
              {tr
                ? 'İki lezzet önemlidir. Gerçekleşen vol geriye bakar ve ne olduğunu söyler. Opsiyon piyasalarından türetilen zımni vol ise tüccarlar tarafından fiyatlanan ileriye dönük bir tahmindir. 2024\'te yayımlanan JPMorgan araştırmasına göre, ikisi arasındaki fark genellikle konumlanma aşırılıklarına işaret eder. Zımni, gerçekleşenin çok üzerinde işlem gördüğünde piyasa koruma için prim ödüyor demektir. Zımni, gerçekleşenin altına çöktüğünde ise yönlü bir hareketten kısa süre sonra rehavet eğilimi görülür.'
                : "Two flavors matter. Realized vol looks backward and tells you what already happened. Implied vol, derived from options markets, is a forward-looking estimate priced in by traders. Per JPMorgan research published in 2024, the gap between the two often signals positioning extremes. When implied trades well above realized, the market is paying up for protection. When implied collapses below realized, complacency tends to follow shortly after a directional move."}
            </p>
            <p>
              {tr
                ? <>Beklenen hareketlere karşı pozisyon boyutlandırmak için, stop yerleşiminizin gerçekte işlem yaptığınız rejimle eşleşmesi amacıyla bu hesap makinesini <Link to="/calculators/bitcoin-lot-size" className="text-primary hover:underline">Bitcoin Lot Büyüklüğü Hesaplayıcısı</Link> ile eşleştirin. Tüm lot formülleri ve broker özellikleri için <Link to="/learn/how-to-calculate-bitcoin-lot-size" className="text-primary hover:underline">Bitcoin lot büyüklüğü hesaplama rehberimize</Link> bakın.</>
                : <>For sizing positions against expected moves, pair this calculator with the <Link to="/calculators/bitcoin-lot-size" className="text-primary hover:underline">Bitcoin Lot Size Calculator</Link> so your stop placement matches the regime you are actually trading in. See our <Link to="/learn/how-to-calculate-bitcoin-lot-size" className="text-primary hover:underline">how to calculate Bitcoin lot size</Link> guide for the full formulas and broker specifics.</>}
            </p>
          </div>
        </div>

        {/* Section B */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Bitcoin ile Altın, Hisse Senetleri ve Tek Hisseler' : 'Bitcoin vs Gold, Equities and Single Stocks'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr
                ? 'Fidelity Digital Assets, 2024 kurumsal araştırmasında Bitcoin\'in yıllıklandırılmış volatilitesinin altının yaklaşık 3,6 katı ve geniş hisse senedi piyasasının yaklaşık 5,1 katı olduğuna dikkat çekti. Bu çarpanlar dramatik görünse de Bitcoin\'i çeşitlendirilmiş endeksler yerine tek hisselerle karşılaştırdığınızda hızla küçülür. NVIDIA, yapay zeka döngüleri sırasında %45 ile %55 arasında gerçekleşen vol ile işlem yaptı. Tesla düzenli olarak %55\'in üzerinde basar. Her ikisi de aynı pencerelerde Bitcoin ile eşleşiyor veya aşıyor.'
                : "Fidelity Digital Assets, in its 2024 institutional research, noted that Bitcoin's annualized volatility sat near 3.6 times that of gold and roughly 5.1 times that of the broad equity market. Those multiples sound dramatic, but they shrink fast once you compare BTC to single equities rather than diversified indexes. NVIDIA has run with realized vol in the 45 to 55 percent range during AI cycles. Tesla regularly prints over 55 percent. Both line up with or exceed Bitcoin during the same windows."}
            </p>
            <p>
              {tr
                ? 'BlackRock, 2024\'teki iShares Bitcoin Trust dosyalarında benzer bir noktaya değindi; BTC\'yi ayrı bir kategori olarak değil, yüksek beta\'lı bir teknoloji hissesiyle karşılaştırılabilir risk olarak çerçeveledi. Bu sayfadaki karşılaştırma tablosu bunu yan yana görünür kılıyor.'
                : "BlackRock made a similar point in its iShares Bitcoin Trust filings in 2024, framing BTC as comparable in risk to a high-beta tech name rather than a category of its own. The comparison table on this page makes that visible side by side."}
            </p>
            <table className="w-full text-sm border-collapse my-3">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-2 px-3 text-foreground font-medium">{tr ? 'Varlık' : 'Asset'}</th>
                  <th className="text-right py-2 px-3 text-foreground font-medium">{tr ? 'Tipik Yıllık Vol' : 'Typical Annualized Vol'}</th>
                  <th className="text-right py-2 px-3 text-foreground font-medium">{tr ? 'Altına Göre Çarpan' : 'Multiple vs Gold'}</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="py-2 px-3">{tr ? 'Altın' : 'Gold'}</td><td className="text-right py-2 px-3">~15%</td><td className="text-right py-2 px-3">1.0×</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-3">S&amp;P 500</td><td className="text-right py-2 px-3">~16%</td><td className="text-right py-2 px-3">1.1×</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-3">NVIDIA</td><td className="text-right py-2 px-3">~50%</td><td className="text-right py-2 px-3">3.3×</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-3">Bitcoin</td><td className="text-right py-2 px-3">~52%</td><td className="text-right py-2 px-3">3.5×</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-3">Tesla</td><td className="text-right py-2 px-3">~55%</td><td className="text-right py-2 px-3">3.7×</td></tr>
                <tr><td className="py-2 px-3">MSTR</td><td className="text-right py-2 px-3">~95%</td><td className="text-right py-2 px-3">6.3×</td></tr>
              </tbody>
            </table>
            <p>
              {tr
                ? 'Kaynaklar: Fidelity Digital Assets 2024 görünümü, BlackRock iShares 2024 ETF belgeleri, periyodik olarak güncellenen kamu 30 günlük gerçekleşen volatilite kıyaslamaları.'
                : 'Sources: Fidelity Digital Assets 2024 outlook, BlackRock iShares 2024 ETF documentation, public 30-day realized volatility benchmarks updated periodically.'}
            </p>
          </div>
        </div>

        {/* Section C */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Bitcoin İçin Bir VIX Var Mı? DVOL, BVX ve BVIV' : 'Is There a VIX for Bitcoin? DVOL, BVX and BVIV'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr
                ? "Bitcoin'in üç güvenilir zımni volatilite kıyaslaması vardır. Deribit tarafından yayımlanan DVOL, en uzun süre işleyen ve piyasadaki en derin BTC opsiyon kitabından çeker. BVX, Bitcoin için ilk düzenlenmiş volatilite kıyaslaması olarak 9 Nisan 2024'te piyasaya çıkan CME CF Bitcoin Volatilite Endeksi'dir. Volmex'in BVIV'i ise 30 günlük sabit vadeli zımni vol'u takip eder ve hem gerçek zamanlı hem de tarihsel serileri yansıtır."
                : "Bitcoin has three credible implied-volatility benchmarks. DVOL, published by Deribit, is the longest running and pulls from the deepest BTC options book in the market. BVX is the CME CF Bitcoin Volatility Index, launched April 9, 2024 as the first regulated volatility benchmark for Bitcoin. BVIV from Volmex tracks 30-day constant-maturity implied vol and exposes both real-time and historical series."}
            </p>
            <p>
              {tr
                ? 'Bu göstergeleri korku göstergeleri yerine aksiyon göstergeleri olarak ele alın. Hisse senedi VIX\'inden farklı olarak, burada yükselen zımni vol neredeyse her zaman aşağı yönlü korunma sinyali verir, Bitcoin\'in zımni vol\'u bandın her iki tarafında da yükselme yapabilir. 2024 ETF onay penceresi zımni vol\'un yükselirken fırlamasını gördü. Mart 2020\'deki COVID şoku ise aşağı yönlü düşerken fırlamasını gördü. Kullanışlı bir kısa yol: beklenen günlük hareket, zımni vol rakamının yaklaşık 20\'ye bölümüdür. 60\'lık bir DVOL, tipik bir günün yaklaşık %3 civarında olduğunu ima eder.'
                : "Treat these gauges as action indicators rather than fear indicators. Unlike the equity VIX, where rising implied vol almost always signals downside hedging, Bitcoin's implied vol can spike on either side of the tape. The 2024 ETF approval window saw implied vol rip on the way up. The COVID shock in March 2020 saw it rip on the way down. A useful shorthand: expected daily move is roughly the implied vol number divided by 20. A DVOL of 60 implies a typical day around 3 percent."}
            </p>
          </div>
        </div>

        {/* Section D */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Bitcoin Ne Zaman Hareket Ediyor — Saat, Gün ve Döngü Örüntüleri' : 'When Bitcoin Moves — Hour, Day and Cycle Patterns'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr
                ? 'Bitcoin saat başı işlem görür, ancak hacim ve volatilite kümelenir. Londra açılışını ve New York ön piyasasını kapsayan 08:00-10:00 UTC penceresi, geçen yılda en yüksek ortalama saatlik vol\'u gösterir. En sessiz dilim, geç Asya seansı sırasında 00:00-04:00 UTC arasında yer alır.'
                : "Bitcoin trades around the clock, but volume and volatility cluster. The 08:00 to 10:00 UTC window, which spans the London open and the New York pre-market, shows the highest average hourly vol over the past year. The quietest stretch sits between 00:00 and 04:00 UTC during the late Asia session."}
            </p>
            <p>
              {tr
                ? 'Haftanın günü itibarıyla Pazartesi ve Salı günleri, kısmen TÜFE ve FOMC kararları gibi ABD makro açıklamalarıyla örtüşmeleri nedeniyle en fazla hareketi taşır. Döngüye göre, yarılanma sonrası yıllar tarihsel olarak en büyük yıllıklandırılmış vol genişlemelerini sağlar. 2012, 2016 ve 2020 yarılanmalarının ardından, yeni yüksekler basıldıkça izleyen 12 aylık vol altı ila on iki ay içinde yükseldi.'
                : "By weekday, Mondays and Tuesdays carry the most movement, partly because they overlap with US macro releases such as CPI and FOMC decisions. By cycle, post-halving years deliver the largest annualized vol expansions historically. After the 2012, 2016, and 2020 halvings, the trailing 12-month vol stepped up within six to twelve months as new highs printed."}
            </p>
            <p>
              {tr
                ? <>Uzun vadeli biriktiriciler için günlük içi zamanlama çoğunlukla gürültüdür. <Link to="/calculators/dca" className="text-primary hover:underline">Bitcoin DMA Hesaplayıcısı</Link>, hem sakin hem de fırtınalı pencerelerde satın almanın gerçekçi sonucunu modellemektedir.</>
                : <>For long-term accumulators, intraday timing is mostly noise. The <Link to="/calculators/dca" className="text-primary hover:underline">Bitcoin DCA Calculator</Link> models the realistic outcome of buying through both calm and stormy windows.</>}
            </p>
          </div>
        </div>

        {/* Section E */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Tüccarlar ve Yatırımcılar Bu Sayıyı Gerçekte Nasıl Kullanıyor' : 'How Traders and Investors Actually Use This Number'}
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              {tr
                ? 'Üç gerçek dünya kullanımı öne çıkıyor. Pozisyon boyutlandırması birinci sıradadır: tek bir tipik günün sizi dışarı atmaması için stop mesafeyi beklenen günlük harekete bölün. Risk bütçelemesi ikinci sıradadır: %60\'lık yıllıklandırılmış bir okuma, bir standart sapmalık ayın yaklaşık %17 olduğu anlamına gelir. Bu aralık rahatsız edici hissettiriyorsa, pozisyon rejim için çok büyük demektir. Rejim tespiti üçüncü sıradadır: 30 günlük vol alt çeyreğinde olduğunda, tarih istatistiksel olarak başka bir sakin dönemden daha fazla bir genişlemenin olası olduğunu gösterir.'
                : "Three real-world uses dominate. Position sizing comes first: split your stop distance by the expected daily move so a single typical day cannot take you out. Risk budgeting comes second: a 60 percent annualized reading means a one-standard-deviation month is roughly 17 percent. If that range is uncomfortable, the position is too large for the regime. Regime detection comes third: when 30-day vol sits in its bottom quartile, history shows an expansion is statistically more likely than another quiet stretch."}
            </p>
            <p>
              {tr
                ? 'Glassnode\'un volatilite rejimleri üzerine yaptığı 2024 çalışması üçüncü kullanımı güçlendiriyor. Bitcoin\'deki süregelen düşük vol pencereleri, aylar yerine haftalar içinde her iki yönde yönlü hareketlerin önünde tekrar tekrar yer aldı. Yukarıdaki yüzdelik ölçeği, mevcut okumayı bu tarihsel bağlama yerleştiriyor.'
                : "Glassnode's 2024 work on volatility regimes reinforces the third use. Sustained low-vol windows in Bitcoin have repeatedly preceded directional moves in either direction within weeks rather than months. The percentile gauge above puts the current reading in that historical context."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
