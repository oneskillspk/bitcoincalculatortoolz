import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CalculatorGrid } from "@/components/CalculatorGrid";
import { PageBackground } from "@/components/modern/PageBackground";
import { CalculatorsFAQSection } from "@/components/CalculatorsFAQSection";
import { useLanguage } from "@/contexts/LanguageContext";


import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
const Calculators = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  return (
    <>
  <Helmet>
    <title>{tr ? 'Bitcoin Hesaplayıcıları | 46+ Ücretsiz Araç' : 'Bitcoin Calculators | 46+ Free Tools, Live BTC Prices'}</title>
    <meta name="description" content={tr ? 'İhtiyacınız olan tüm Bitcoin hesaplayıcıları tek yerde. DCA, kâr, emeklilik, vergi, güç yasası ve 46+ araç — hepsi ücretsiz, canlı fiyatlarla.' : 'Every Bitcoin calculator you need in one place. DCA, profit, retirement, tax, power law, on-chain and 46+ more. All free, all live prices, no account needed.'} />
    <link rel="canonical" href={tr ? 'https://bitcoincalculator.tools/tr/hesaplayicilar' : 'https://bitcoincalculator.tools/calculators'} />
    <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators" />
    <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar" />
    <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators" />

    {/* Open Graph tags */}
    <meta property="og:title" content={tr ? 'Bitcoin Hesaplayıcıları | 46+ Ücretsiz Araç' : 'Bitcoin Calculators | 46+ Free Tools, Live BTC Prices'} />
    <meta property="og:description" content={tr ? 'İhtiyacınız olan tüm Bitcoin hesaplayıcıları tek yerde. DCA, kâr, emeklilik, vergi, güç yasası, zincir üstü veriler ve 46+ daha fazlası. Hepsi ücretsiz, canlı fiyatlarla, üye olmadan.' : 'Every Bitcoin calculator you need in one place. DCA, profit, retirement, tax, power law, on-chain and 46+ more. All free, all live prices, no account needed.'} />
    <meta property="og:url" content={tr ? 'https://bitcoincalculator.tools/tr/hesaplayicilar' : 'https://bitcoincalculator.tools/calculators'} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="bitcoincalculator.tools" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={tr ? 'Bitcoin Hesaplayıcıları | 46+ Ücretsiz Araç' : 'Bitcoin Calculators | 46+ Free Tools, Live BTC Prices'} />
    <meta name="twitter:description" content={language==='tr'?'Her Bitcoin hesaplayıcısı tek bir yerde — DCA, emeklilik, vergi, güç yasası ve 46+ daha fazlası. Hepsi ücretsiz.':'Every Bitcoin calculator in one place — DCA, retirement, tax, power law and 46+ more. All free.'} />
    <meta name="twitter:creator" content="@web3believers" />

    <meta name="twitter:site" content="@web3believers" />
        {/* FAQ Page Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "inLanguage": tr ? 'tr' : 'en',
            "mainEntity": [
              {
                "@type": "Question",
                "name": tr ? "Yatırım hedeflerim için hangi hesaplayıcıyı kullanmalıyım?" : "Which calculator should I use for my investment goals?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Öncelikli hedefinize göre başlayın. Geçmiş performansı analiz etmek için Ya Olsaydı Hesaplayıcısı'nı kullanın. Düzenli yatırımları planlamak için DCA Hesaplayıcısı'nı kullanın. Uzun vadeli servet oluşturmak için Emeklilik Planlayıcısı idealdir. Stratejileri karşılaştırmak için Toplu Yatırım vs DCA aracını deneyin." : "Start based on your primary goal. To analyze past performance, use the What If Calculator. To plan recurring investments, use the DCA Calculator. For long-term wealth building, the Retirement Planner is ideal. To compare strategies, try the Lump Sum vs. DCA tool."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bu hesaplayıcılar doğru mu ve finansal verilerim güvende mi?" : "Are these calculators accurate and is my financial data safe?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Evet. Araçlarımız en yüksek doğruluk için gerçek zamanlı ve geçmiş piyasa verilerini kullanır. Tüm hesaplamalar tarayıcınızda yapılır ve kişisel finansal verilerinizi asla görmez ya da saklamayız. Gizliliğiniz en büyük önceliğimizdir." : "Yes. Our tools use real-time and historical market data for the highest possible accuracy. All calculations are performed in your browser, and we never see or store any of your personal financial data. Your privacy is our top priority."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Hesaplayıcılarınız hangi veri kaynaklarını kullanıyor?" : "What data sources do your calculators use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Hesaplayıcılarımız, güncel değerlemeler için CoinGecko API'den gerçek zamanlı fiyat akışları, geri test için kapsamlı tarihsel günlük fiyat veritabanı ve Servet Yüzdesi Hesaplayıcısı gibi araçlar için zincir üstü verilerle çalışır." : "Our calculators are powered by real-time price feeds from the CoinGecko API for current valuations, a comprehensive database of historical daily price data for backtesting, and on-chain data for tools like the Wealth Percentile Calculator."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Sistemdeki tüm araçlar ücretsiz mi?" : "Are all the tools in the suite free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Evet, kesinlikle. Bu sayfadaki 46+ hesaplayıcının tamamı gizli ücret, abonelik veya hesap açma gerektirmeden tamamen ücretsizdir." : "Yes, absolutely. All 46+ calculators on this page are completely free to use with no hidden fees, subscriptions, or account signup required."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Hesaplama sonuçlarımı kaydedebilir veya paylaşabilir miyim?" : "Can I save or share my calculation results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Evet. Birçok hesaplayıcımız Sonuçları Paylaş veya Bağlantıyı Kopyala özelliğini içerir. Bu, girdileriniz kaydedilmiş benzersiz bir URL oluşturur ve senaryolarınızı yer imlerine eklemenize ya da başkalarıyla paylaşmanıza olanak tanır. Gelişmiş araçlar PNG ve PDF rapor dışa aktarımını da destekler." : "Yes. Many of our calculators include a Share Results or Copy Link feature. This generates a unique URL with your inputs saved, allowing you to bookmark your scenarios or share them with others. Advanced tools also support PNG and PDF report exports."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "DCA ile HODL stratejisi arasındaki fark nedir?" : "What's the difference between DCA and a HODL strategy?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "DCA (Dolar Maliyet Ortalaması), belirli aralıklarla sabit bir tutarı yatırım yaptığınız bir biriktirme stratejisidir. HODL ise uzun vadeli tutma felsefesidir. DCA Hesaplayıcımız ve HODL Strateji Takipçimiz, her iki yaklaşımı da gerçek tarihsel verilerle modellemenize ve izlemenize yardımcı olur." : "DCA (Dollar-Cost Averaging) is an accumulation strategy where you invest a fixed amount at regular intervals. HODL is a long-term holding philosophy. Our DCA Calculator and HODL Strategy Tracker help you model and track both approaches with real historical data."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Toplu Yatırım vs DCA karşılaştırma aracı nasıl çalışır?" : "How does the Lump Sum vs. DCA Comparison tool work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Seçtiğiniz herhangi bir zaman aralığında her iki stratejiyi de gerçek tarihsel Bitcoin fiyatlarına karşı geri test etmenizi sağlar. Yatırım tutarınızı girin, bir tarih aralığı seçin ve hangi yaklaşımın daha iyi getiri sağlayacağını anında görün." : "It lets you backtest both strategies against actual historical Bitcoin prices for any time period you choose. Enter your investment amount, select a date range, and instantly see which approach would have yielded better returns."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Hangi piyasa analiz araçları mevcut?" : "What market analysis tools are available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Logaritmik değerleme bölgeleri için Gökkuşağı Fiyat Grafiği, gerçek zamanlı piyasa duygusu için Korku ve Açgözlülük Endeksi, varlıklarınızı küresel ölçekte sıralayan Servet Yüzdesi Hesaplayıcısı ve Bitcoin vs Geleneksel Varlıklar karşılaştırmasını sunuyoruz." : "We offer the Rainbow Price Chart for logarithmic valuation zones, the Fear & Greed Index for real-time market sentiment, the Wealth Percentile Calculator to rank your holdings globally, and the Bitcoin vs. Traditional Assets comparison."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Madencilik ve Lightning Ağı için araçlar sunuyor musunuz?" : "Do you offer tools for mining and Lightning Network?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Evet. Madencilik Kârlılığı Hesaplayıcısı hash oranı, güç tüketimi, elektrik maliyetleri ve zorluk ayarlamalarını hesaba katar. Lightning Ağı Ücreti Hesaplayıcısı yönlendirme ücretlerini tahmin eder ve en uygun ödeme kanallarını bulmaya yardımcı olur." : "Yes. The Mining Profitability Calculator factors in hash rate, power consumption, electricity costs, and difficulty adjustments. The Lightning Network Fee Calculator estimates routing fees and helps find optimal payment channels."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bitcoin kârları vergilendirilebilir mi?" : "Are profits from Bitcoin taxable?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Çoğu ülkede, Bitcoin'i kârla sattığınızda veya takas ettiğinizde sermaye kazancı vergisi ödemeniz gerekebilir. Sermaye Kazancı Vergisi Hesaplayıcımız, alış fiyatınıza, satış fiyatınıza ve elde tutma süresine göre bu yükümlülüğü tahmin etmenize yardımcı olur. Bu finansal tavsiye değildir." : "In most countries, you may owe capital gains tax when you sell or trade Bitcoin for a profit. Our Capital Gains Tax Calculator helps you estimate this liability based on your purchase price, sale price, and holding period. This is not financial advice."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Bitcoin Servet Yüzdesi Hesaplayıcısı nasıl çalışır?" : "How does the Bitcoin Wealth Percentile Calculator work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "BTC varlıklarınızı veya bunların fiat değerini girin; araç sizi Küçük Karides'ten Balina'ya kadar küresel Bitcoin adres dağılım katmanlarına göre sıralar. Zincir üstü verileri kullanarak tam yüzdelik diliminizi gösterir ve gizlilik dostu bir paylaşım kartı sunar." : "Enter your BTC holdings or their fiat value, and the tool ranks you against global Bitcoin address distribution tiers—from Shrimp to Whale. It uses on-chain data to show your exact percentile and provides a privacy-safe sharing card."
                }
              },
              {
                "@type": "Question",
                "name": tr ? "Buraya yeniyim. Bitcoin Calculator Tools nedir?" : "I'm new here. What is Bitcoin Calculator Tools?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": tr ? "Bitcoin Calculator Tools, akıllı Bitcoin yatırımcıları, uzun vadeli planlayıcılar ve kripto paraya merak duyan herkes için tasarlanmış 46 profesyonel düzey finansal araçtan oluşan ücretsiz bir pakettir. Temel kâr hesaplayıcılarından Gökkuşağı Grafiği gibi gelişmiş araçlara kadar her şey tarayıcınızda çalışır ve kayıt gerekmez." : "Bitcoin Calculator Tools is a free suite of 46 professional-grade financial tools designed for smart Bitcoin investors, long-term planners, and anyone curious about cryptocurrency. From basic profit calculators to advanced tools like the Rainbow Chart, everything runs in your browser with no signup needed."
                }
              }
            ]
          })}
        </script>

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": tr ? "Bitcoin Hesaplayıcıları" : "Bitcoin Calculators",
            "description": tr ? "İhtiyacınız olan tüm Bitcoin hesaplayıcıları tek yerde. DCA, kâr, emeklilik, vergi, güç yasası, zincir üstü veriler ve 46+ daha fazlası." : "Every Bitcoin calculator you need in one place. DCA, profit, retirement, tax, power law, on-chain and 46+ more.",
            "url": tr ? "https://bitcoincalculator.tools/tr/hesaplayicilar" : "https://bitcoincalculator.tools/calculators",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://bitcoincalculator.tools"
            }
          })}
        </script>
      </Helmet>
    <HelmetOgImage slug="calculators" enAlt={`Bitcoin Calculators | bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={[
        ...(tr?[{name:'Ana Sayfa',url:'https://bitcoincalculator.tools/'},{name:'Hesaplayıcılar',url:'https://bitcoincalculator.tools/tr/hesaplayicilar'}]:[{name:'Home',url:'https://bitcoincalculator.tools/'},{name:'Calculators',url:'https://bitcoincalculator.tools/calculators'}])
      ]} />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
        <Breadcrumb items={[{ label: tr ? 'Hesaplayıcılar' : 'Calculators' }]} />
          </div>
          
          <CalculatorGrid showOnlyFeatured={false} showExploreSection={false} showSearch={true} />
          
          <CalculatorsFAQSection />
        </main>
        <Footer />
      </PageBackground>
    </>
  );
};

export default Calculators;