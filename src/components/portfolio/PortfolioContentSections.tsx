import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const PortfolioContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="space-y-10 text-foreground">
          <div>
            <h2 className="text-h2 font-bold mb-3">
              {tr ? 'Bitcoin Portföy Takipçisi Nasıl Kullanılır' : 'How to Use the Bitcoin Portfolio Tracker'}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Her Bitcoin alımını ayrı bir giriş olarak ekleyin — BTC miktarını, Bitcoin başına ödediğiniz fiyatı ve isteğe bağlı bir etiket ve tarih girin. Takipçi, canlı portföy değerinizi, toplam maliyet tabanınızı, ortalama alım fiyatınızı ve kâr veya zararınızı gerçek zamanlı olarak hesaplar. Portföyünüz otomatik olarak tarayıcınıza kaydedilir ve bir dahaki ziyaretinizde yüklenir — hesap veya kayıt gerekmez."
                : "Add each Bitcoin purchase as a separate entry — enter the BTC amount, the price you paid per Bitcoin, and an optional label and date. The tracker calculates your live portfolio value, total cost basis, average buy price, and profit or loss in real time. Your portfolio is saved automatically in your browser and loads next time you visit — no account or signup needed."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold mb-3">
              {tr ? 'Neden Kayıt Gerekmez' : 'Why No Signup Is Required'}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Çoğu portföy takipçisi, verilerinizi kaydetmek için bir hesap gerektirir. Bu Bitcoin portföy takipçisi her şeyi tarayıcınızın yerel depolama alanına kaydeder — yani varlıklarınız hiçbir zaman cihazınızı terk etmez. Sunucumuz, veritabanımız ve ne tuttuğunuz hakkında hiçbir bilgimiz yoktur. Bu, bir Bitcoin portföyünü takip etmenin en gizli yoludur: verileriniz tamamen kendi bilgisayarınızda veya telefonunuzda kalır."
                : "Most portfolio trackers require an account to save your data. This Bitcoin portfolio tracker saves everything in your browser's local storage — meaning your holdings never leave your device. We have no server, no database, and no knowledge of what you hold. This is the most private way to track a Bitcoin portfolio: your data stays entirely on your own computer or phone."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold mb-3">
              {tr ? "Bitcoin Portföy Takipçisi ile CoinMarketCap ve CoinGecko Karşılaştırması" : 'Bitcoin Portfolio Tracker vs CoinMarketCap and CoinGecko'}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  CoinMarketCap ve CoinGecko, portföyünüzü kaydetmek için hesap kaydı gerektirir. Her ikisi de binlerce coini takip eder ancak Bitcoin'e özgü sınırlı analizler sunar. Bu Bitcoin portföy takipçisi hesap gerektirmez, anında tarayıcınıza kaydeder ve özellikle Bitcoin tutanlar için tasarlanmıştır — maliyet tabanı takibi, ortalama alım fiyatı, DCA analizi, Bitcoin kilometre taşı ilerlemesi ve{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-fiyat-hedef" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">Bitcoin fiyat hedefi</Link> ve{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-servet-yuzdesi" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">servet dilimi</Link> hesaplayıcılarımızla entegrasyon. Ayrıca{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-donusturucu" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">BTC ve 100'den fazla para birimi arasında anında dönüştürme</Link> yapabilirsiniz.
                </>
              ) : (
                <>
                  CoinMarketCap and CoinGecko require account signup to save your portfolio. Both track thousands of coins but provide limited Bitcoin-specific analytics. This Bitcoin portfolio tracker requires no account, saves instantly to your browser, and is built specifically for Bitcoin holders — with cost basis tracking, average buy price, DCA analysis, Bitcoin milestone progress, and integration with our{' '}
                  <Link to="/calculators/price-target" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">Bitcoin price target</Link> and{' '}
                  <Link to="/calculators/wealth-percentile" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">wealth percentile</Link> calculators. You can also{' '}
                  <Link to="/calculators/bitcoin-converter" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">convert between BTC and 100+ currencies</Link> instantly.
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold mb-3">
              {tr ? 'Bitcoin Portföy Tahsisi Nasıl Hesaplanır' : 'How to Calculate Bitcoin Portfolio Allocation'}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Bitcoin portföy tahsisi, toplam yatırım portföyünüzün Bitcoin olarak tutulan yüzdesidir. Örneğin, toplam yatırımlarınız 100.000 $ ise ve Bitcoin'de 15.000 $ tutuyorsanız, Bitcoin tahsisiniz %15'tir. Çoğu finansal danışman ve araştırma, muhafazakâr yatırımcılar için %1 ile %10 arasında ve daha yüksek risk toleransı ile daha uzun zaman ufku olanlar için %50'ye kadar bir Bitcoin tahsisi önermektedir. Mevcut BTC değerinizi görmek için bu takipçiyi kullanın, ardından Bitcoin tahsis yüzdenizi hesaplamak için toplam portföy değerinize bölün.{' '}
                  <Link to="/learn/how-much-bitcoin-should-i-own" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">Ne kadar Bitcoin sahip olmanız gerektiği</Link> hakkında daha fazla bilgi edinin.
                </>
              ) : (
                <>
                  Bitcoin portfolio allocation is the percentage of your total investment portfolio held in Bitcoin. For example, if your total investments are $100,000 and you hold $15,000 in Bitcoin, your Bitcoin allocation is 15%. Most financial advisors and research suggests a Bitcoin allocation between 1% and 10% for conservative investors, and up to 50% for those with higher risk tolerance and longer time horizons. Use this tracker to see your current BTC value, then divide by your total portfolio value to calculate your Bitcoin allocation percentage. Read more about{' '}
                  <Link to="/learn/how-much-bitcoin-should-i-own" className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary">how much Bitcoin you should own</Link>.
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold mb-3">
              {tr ? 'Bitcoin Portföy Takipçisi Nedir?' : 'What Is a Bitcoin Portfolio Tracker?'}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Bitcoin portföy takipçisi, birden fazla alım, cüzdan veya borsa genelinde tüm Bitcoin varlıklarınızı toplayan ve size birleşik mevcut değeri, satın almadan bu yana kâr veya zararı ve ortalama alım fiyatı ve maliyet tabanı gibi temel metrikleri gösteren bir araçtır. Yalnızca bir hesabı gösteren borsa portföy görünümlerinin aksine, bağımsız bir takipçi Coinbase, Binance, donanım cüzdanları ve diğer kaynaklardaki varlıklarınızı tek bir görünümde birleştirmenize olanak tanır."
                : "A Bitcoin portfolio tracker is a tool that aggregates all your Bitcoin holdings — across multiple purchases, wallets, or exchanges — and shows you the combined current value, profit or loss since purchase, and key metrics like average buy price and cost basis. Unlike exchange portfolio views that only show one account, a standalone tracker lets you combine holdings from Coinbase, Binance, hardware wallets, and any other source into a single view."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
