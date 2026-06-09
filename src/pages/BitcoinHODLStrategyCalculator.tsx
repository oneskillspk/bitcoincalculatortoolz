import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AffiliatePlacement } from "@/components/affiliateAI/AffiliatePlacement";
import { Breadcrumb } from '@/components/Breadcrumb';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { DatasetSchema } from '@/components/seo/DatasetSchema';
import { PageBackground } from '@/components/modern/PageBackground';
import { CompactLiveBitcoinPrice } from '@/components/CompactLiveBitcoinPrice';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HODLInputPanel } from '@/components/hodl/HODLInputPanel';
import { HODLResultsPanel } from '@/components/hodl/HODLResultsPanel';
import { StrategyComparisonChart } from '@/components/hodl/StrategyComparisonChart';
import { StrategyBreakdownTable } from '@/components/hodl/StrategyBreakdownTable';
import { PerformanceMetrics } from '@/components/hodl/PerformanceMetrics';
import { HODLHowItWorksSection } from '@/components/hodl/HODLHowItWorksSection';
import { HODLFAQSection } from '@/components/hodl/HODLFAQSection';
import { HODLContentSections } from '@/components/hodl/HODLContentSections';
import RelatedCalculators from '@/components/RelatedCalculators';
import { Card, CardContent } from '@/components/ui/card';
import { Hourglass, AlertTriangle } from 'lucide-react';
import { HODLStrategyCalculator, HODLParams, HODLResult } from '@/services/hodlStrategyCalculator';
import { QuickAnswerBox } from '@/components/calculator/QuickAnswerBox';
import { bitcoinApi } from '@/services/bitcoinApi';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from "@/contexts/LanguageContext";

const BitcoinHODLStrategyCalculator = () => {
  const { language, t } = useLanguage();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<HODLResult | null>(null);
  const [currency, setCurrency] = useState('USD');
  const { toast } = useToast();

  const handleCalculate = async (params: HODLParams) => {
    const tr = language === 'tr';
    setIsCalculating(true);
    setCurrency(params.currency);

    try {
      const priceData = await bitcoinApi.getPriceRange(params.startDate, params.endDate, params.currency);
      const calculationResult = HODLStrategyCalculator.calculateStrategies(params, priceData);
      setResult(calculationResult);
      
      toast({
        title: tr ? 'Stratejiler Karşılaştırıldı' : 'Strategies Compared',
        description: tr
          ? `Seçilen dönemde ${params.strategies.length} strateji analiz edildi`
          : `Analyzed ${params.strategies.length} strategies over selected period`,
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: tr ? 'Hesaplama Başarısız' : 'Calculation Failed',
        description: tr
          ? 'Stratejiler hesaplanamadı. Lütfen tekrar deneyin.'
          : 'Unable to calculate strategies. Please try again.',
        variant: 'destructive'
      });
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{language==='tr'?'Bitcoin HODL Strateji Hesaplayıcısı':'Bitcoin HODL Strategy Calculator'}</title>
        <meta name="description" content={language==='tr'?'HODL, DCA veya piyasa zamanlaması — hangisi gerçekten kazanıyor? Üç stratejiyi gerçek tarihsel verilerle herhangi bir tarih aralığında karşılaştırın.':'HODL, DCA, or time the market — which strategy actually wins? Compare all three with real historical data across any date range. No opinion, just math.'} />
        <meta name="keywords" content="bitcoin hodl calculator, bitcoin holding strategy, hodl vs dca, bitcoin investment strategy, btc long-term investment, bitcoin buy and hold returns, dollar cost averaging bitcoin" />
        <link rel="canonical" href={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-hodl-stratejisi':'https://bitcoincalculator.tools/calculators/hodl-strategy'} />
        
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-hodl-stratejisi" />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/calculators/hodl-strategy" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/calculators/hodl-strategy" />
        <meta property="og:title" content={language==='tr'?'Bitcoin HODL Strateji Hesaplayıcısı':'Bitcoin HODL Strategy Calculator'} />
        <meta property="og:description" content={language==='tr'?'HODL, DCA veya piyasa zamanlaması — hangisi kazanıyor? Gerçek tarihsel verilerle karşılaştırın. Görüş yok, sadece matematik.':'HODL, DCA, or time the market — which strategy actually wins? Compare all three with real historical data across any date range. No opinion, just math.'} />
        <meta property="og:url" content={language==='tr'?'https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-hodl-stratejisi':'https://bitcoincalculator.tools/calculators/hodl-strategy'} />
        <meta property="og:type" content="website" />
        <HelmetOgImage slug="bitcoin-h-o-d-l-strategy-calculator" enAlt={`Bitcoin HODL Strategy Calculator | bitcoincalculator.tools`} />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={language==='tr'?'Bitcoin HODL Strateji Hesaplayıcısı':'Bitcoin HODL Strategy Calculator'} />
        <meta name="twitter:description" content={language==='tr'?'HODL, DCA veya piyasa zamanlaması — hangisi gerçekten kazanıyor? Görüş yok, sadece matematik.':'HODL, DCA, or time the market — which strategy actually wins? No opinion, just math.'} />
        <meta name="twitter:creator" content="@web3believers" />
        
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": language==='tr' ? "Bitcoin HODL Strateji Hesaplayıcısı" : "Bitcoin HODL Strategy Calculator",
            "description": language==='tr'
              ? "HODL, DCA veya piyasa zamanlaması — hangisi gerçekten kazanıyor? Üç stratejiyi gerçek tarihsel verilerle herhangi bir tarih aralığında karşılaştırın."
              : "HODL, DCA, or time the market — which strategy actually wins? Compare all three with real historical data across any date range. No opinion, just math.",
            "url": language==='tr'
              ? "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-hodl-stratejisi"
              : "https://bitcoincalculator.tools/calculators/hodl-strategy",
            "inLanguage": language==='tr' ? "tr" : "en",
            "applicationCategory": "FinanceApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": language==='tr' ? "TRY" : "USD"
            },
            "featureList": language==='tr' ? [
              "Çoklu strateji geri testi (HODL, DCA, Düşüşten Alım, Dengeleme)",
              "Gerçek tarihsel Bitcoin fiyat verileri",
              "10 yıllık HODL vs aktif işlem karşılaştırması",
              "HODL vs S&P 500 vs Altın kıyaslaması",
              "Düşüş senaryoları için kararlılık stres testi",
              "Sharpe oranı ve riske göre ayarlanmış getiri metrikleri"
            ] : [
              "Multi-strategy backtest (HODL, DCA, Buy-the-Dip, Rebalancing)",
              "Real historical Bitcoin price data",
              "10-year HODL vs active trader comparison",
              "HODL vs S&P 500 vs Gold benchmark",
              "Conviction stress test for drawdown scenarios",
              "Sharpe ratio and risk-adjusted return metrics"
            ],
            "provider": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" },
            "author": { "@type": "Organization", "name": "Bitcoin Calculator Tools", "url": "https://bitcoincalculator.tools" }
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": language==='tr' ? "Bitcoin HODL Stratejisi Nasıl Takip Edilir?" : "How to Track Your Bitcoin HODL Strategy",
            "inLanguage": language==='tr' ? "tr" : "en",
            "description": language==='tr' ? "Uzun vadeli Bitcoin tutma performansını izlemek için HODL Strateji Hesaplayıcısını kullanın." : "Use the HODL Strategy Calculator to track long-term Bitcoin holding performance.",
            "step": [
              { "@type": "HowToStep", "name": language==='tr' ? "Alış Tarihini Girin" : "Enter Your Buy Date", "text": language==='tr' ? "Bitcoin'i ilk ne zaman aldığınızı veya tutmaya başladığınızı seçin." : "Select when you first bought or started holding Bitcoin." },
              { "@type": "HowToStep", "name": language==='tr' ? "Yatırım Tutarını Girin" : "Enter Amount Invested", "text": language==='tr' ? "O tarihte ne kadar fiat para yatırım yaptığınızı girin." : "Input how much fiat currency you invested at that time." },
              { "@type": "HowToStep", "name": language==='tr' ? "HODL Performansını Görün" : "See HODL Performance", "text": language==='tr' ? "Toplam getiriyi, yıllıklaştırılmış kazancı görüntüleyin ve aynı dönem için geleneksel varlıklarla karşılaştırın." : "View your total return, annualized gain, and compare against traditional assets over the same period." }
            ]
          })}
        </script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": language==='tr' ? "tr" : "en",
          "mainEntity": [
            { "@type": "Question", "name": language==='tr' ? "Bitcoin'de HODL ne demek?" : "What does HODL mean in Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "HODL, Bitcoin forumundaki 'hold' yazım hatasından türemiştir. Fiyat oynaklığına bakmadan Bitcoin'i uzun vadeli tutma stratejisini ifade eder." : "HODL is a term derived from a misspelling of 'hold' in a Bitcoin forum post. It has become a popular strategy meaning to buy and hold Bitcoin long-term, regardless of price volatility, rather than trying to time the market." }},
            { "@type": "Question", "name": language==='tr' ? "HODL, dolar maliyet ortalamasından daha mı iyi?" : "Is HODL better than dollar cost averaging?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Hiçbir strateji herkes için daha iyi değildir. HODL, toplu paranız varsa ve uzun vadeli büyümeye inanıyorsanız uygundur. DCA, alımları zamana yayarak zamanlama riskini azaltır." : "Neither strategy is universally better – it depends on your situation. HODL works well when you have a lump sum to invest and believe in long-term growth. DCA reduces timing risk by spreading purchases over time, which can be psychologically easier and reduce the impact of volatility." }},
            { "@type": "Question", "name": language==='tr' ? "'Düşüşten al' stratejisi nedir?" : "What is the Buy the Dip strategy?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Düşüşten al stratejisi, alım yapmadan önce önemli fiyat düşüşlerini beklemeyi içerir. Piyasa düzeltmelerinden yararlanmayı hedefler ama sabır gerektirir." : "Buy the Dip involves waiting for significant price drops (typically 10% or more from recent peaks) before making purchases. This strategy attempts to capitalize on market corrections but requires patience and may result in fewer purchases if the price keeps rising." }},
            { "@type": "Question", "name": language==='tr' ? "Dengeleme nasıl çalışır?" : "How does rebalancing work?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Dengeleme, Bitcoin ve nakit arasında sabit bir oranı korur. Bitcoin yükselince oranı geri almak için bir miktar satarsınız; düşünce daha fazla alırsınız." : "Rebalancing maintains a fixed ratio between Bitcoin and cash (like 60/40). When Bitcoin rises, you sell some to restore the ratio. When it falls, you buy more. This forces you to buy low, sell high systematically, reducing volatility but potentially limiting upside." }},
            { "@type": "Question", "name": language==='tr' ? "Bu hesaplayıcı ücretleri içeriyor mu?" : "Does this calculator include fees?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Hayır, hesaplayıcı işlem ücretleri, borsa ücretleri veya vergileri hesaba katmadan teorik performansı gösterir. Gerçek dünyadaki getiriler bu maliyetler nedeniyle daha düşük olacaktır." : "No, the calculator shows theoretical performance without accounting for transaction fees, exchange fees, or taxes. Real-world returns will be lower due to these costs, which vary by platform and strategy complexity." }},
            { "@type": "Question", "name": language==='tr' ? "En düşük risk hangi stratejide?" : "Which strategy has the lowest risk?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Genelde dengeleme en düşük oynaklığa sahiptir çünkü hem Bitcoin hem nakitte maruziyeti korur. DCA da alımları zamana yayarak riski azaltır." : "Rebalancing typically has the lowest volatility because it maintains exposure to both Bitcoin and cash. DCA strategies also reduce risk by spreading purchases over time. Pure HODL has the highest volatility but may offer the highest returns in strong bull markets." }},
            { "@type": "Question", "name": language==='tr' ? "DCA sıklığını özelleştirebilir miyim?" : "Can I customize the DCA frequency?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Şu anda hesaplayıcı haftalık ve aylık DCA sıklıklarını destekler. Bunlar maaş dönemlerine uygun ve işlem ücretlerini makul tutan en yaygın aralıklardır." : "Currently, the calculator supports weekly and monthly DCA frequencies. These are the most common intervals that align with typical salary payments and keep transaction costs reasonable." }},
            { "@type": "Question", "name": language==='tr' ? "Sharpe oranı nedir?" : "What is a Sharpe ratio?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Sharpe oranı, riske göre ayarlanmış getiriyi ölçer; yani üstlendiğiniz risk başına ne kadar getiri aldığınızı gösterir. Yüksek Sharpe oranı daha iyidir." : "The Sharpe ratio measures risk-adjusted returns – essentially, how much return you get per unit of risk taken. A higher Sharpe ratio is better, indicating more efficient returns relative to volatility. Values above 1.0 are generally considered good." }},
            { "@type": "Question", "name": language==='tr' ? "Piyasa koşullarına göre strateji değiştirmeli miyim?" : "Should I change strategies based on market conditions?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Stratejileri sürekli değiştirmek çoğu zaman kötü zamanlama ve duygusal kararlar nedeniyle daha kötü sonuçlara yol açar. Başarılı yatırımcıların çoğu tek bir stratejiye sadık kalır." : "Constantly switching strategies often leads to worse outcomes due to poor timing and emotional decisions. Most successful investors stick to one strategy aligned with their goals and risk tolerance, rather than trying to predict market movements." }},
            { "@type": "Question", "name": language==='tr' ? "Tarihsel performans gelecekteki sonuçlar için ne kadar doğru?" : "How accurate is historical performance for future results?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Geçmiş performans gelecekteki sonuçları garanti etmez. Bitcoin'in tarihsel getirileri olağanüstüydü ama gelecekte farklı olabilir." : "Past performance does not guarantee future results. Bitcoin's historical returns have been exceptional, but future performance may differ significantly. Use this calculator as an educational tool to understand strategy differences, not as a prediction of future returns." }},
            { "@type": "Question", "name": language==='tr' ? "Zaman içinde Bitcoin alım satımını simüle edebilir miyim?" : "Can I simulate buying and selling Bitcoin over time?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Evet — HODL strateji hesaplayıcımız bir Bitcoin al-sat simülatörü gibi çalışır. Bir tarih aralığı seçin, HODL, DCA veya düşüşten al gibi stratejileri belirleyin ve her yaklaşımın nasıl performans gösterdiğini görün." : "Yes — our HODL strategy calculator acts as a Bitcoin buy/sell simulator. Set a date range, choose strategies like HODL, DCA, or buy-the-dip, and see how each approach would have performed with real historical price data." }},
            { "@type": "Question", "name": language==='tr' ? "Bitcoin'i ne zaman alıp satmalıyım?" : "When should I buy or sell Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Evrensel bir cevap yok, ancak hesaplayıcımız farklı zamanlama stratejilerini tarihsel verilerle geriye dönük test etmenizi sağlar." : "There is no universal answer, but our calculator lets you backtest different buy and sell timing strategies against historical data. Compare lump-sum buying, regular DCA purchases, and dip-buying to see which approach produced the best risk-adjusted returns." }},
            { "@type": "Question", "name": language==='tr' ? "HODL 2026'da hâlâ kârlı mı?" : "Is HODL still profitable in 2026?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Tarihsel olarak Bitcoin'deki her 4 yıllık HODL penceresi kârlı olmuştur. Gelecekte kârlılığın devamı ağın benimsenmesine bağlıdır." : "Historically, every 4-year HODL window in Bitcoin's history has been profitable, including entries at previous all-time highs. Whether HODL remains profitable going forward depends on continued network adoption, but the structural drivers are still in place." }},
            { "@type": "Question", "name": language==='tr' ? "Bitcoin'i ne kadar süre HODL etmeliyim?" : "How long should I HODL Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Tarihsel olarak en iyi sonuçlar en az bir tam Bitcoin döngüsünde, yani yaklaşık 3,5 ila 4 yıl arasında görülmüştür." : "The historical sweet spot is at least one full Bitcoin cycle, which runs roughly 3.5 to 4 years between halvings. Longer holds have produced positive returns 100% of the time in BTC's history." }},
            { "@type": "Question", "name": language==='tr' ? "HODL yaparken para kaybeden oldu mu?" : "Has anyone lost money HODLing Bitcoin?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Evet, ama genelde strateji başarısız olduğu için değil; zorunlu satış, cüzdan erişimi kaybı veya başarısız borsa nedeniyle." : "Yes, but not because the strategy failed. People who lost money HODLing usually had to sell during a drawdown for personal reasons, lost access to their wallet, or held on a failed exchange." }},
            { "@type": "Question", "name": language==='tr' ? "HODL, dolar maliyet ortalamasını yener mi?" : "Does HODL beat dollar-cost averaging?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Toplu HODL tarihsel olarak çoğu dönemde DCA'yı geride bırakır çünkü Bitcoin çok yıllı pencerelerde yükselme eğilimindedir." : "Lump-sum HODL outperforms DCA roughly 65-70% of the time historically because Bitcoin trends up over multi-year windows." }},
            { "@type": "Question", "name": language==='tr' ? "Bitcoin tarihindeki en uzun kârlı HODL dönemi nedir?" : "What is the longest profitable HODL period in Bitcoin history?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "Bitcoin tarihinde 4 yıldan uzun tüm HODL dönemleri kârlı olmuştur. En uzun kârlı tutma 2010'dan bugüne kadar sürmüştür." : "Any HODL period of 4+ years has been profitable in Bitcoin's history. The longest single profitable hold returned over 100,000,000%." }},
            { "@type": "Question", "name": language==='tr' ? "Bitcoin HODL etmeli miyim yoksa aktif işlem mi yapmalıyım?" : "Should I HODL Bitcoin or trade actively?", "acceptedAnswer": { "@type": "Answer", "text": language==='tr' ? "İstatistiksel kanıtlar güçlü biçimde HODL lehinedir. Çoğu bireysel yatırımcı ücretler, vergiler ve kaçırılan günler nedeniyle basit al-tut stratejisinin gerisinde kalır." : "Statistical evidence overwhelmingly favors HODL. Most retail traders underperform a simple buy-and-hold due to fees, taxes, and missed market days." }}
          ]
        })}</script>
      </Helmet>

      <DatasetSchema
        name="Bitcoin HODL Strategy Performance Dataset"
        description="Hold-period performance dataset showing what every Bitcoin entry date would be worth today, with realised drawdown depth and recovery time-to-new-high."
        url="https://bitcoincalculator.tools/calculators/hodl-strategy"
        temporalCoverage="2010-07-17/.."
        variableMeasured={["Entry date", "Years held", "Present value (USD)", "Max drawdown %", "Days to recover ATH"]}
        keywords={["bitcoin hodl", "btc hold strategy dataset", "bitcoin drawdown recovery"]}
      />

      <BreadcrumbSchema language={language}
        items={language==='tr' ? [
          { name: "Ana Sayfa", url: "https://bitcoincalculator.tools/tr" },
          { name: "Hesaplayıcılar", url: "https://bitcoincalculator.tools/tr/hesaplayicilar" },
          { name: "Bitcoin HODL Stratejisi", url: "https://bitcoincalculator.tools/tr/hesaplayicilar/bitcoin-hodl-stratejisi" }
        ] : [
          { name: "Home", url: "https://bitcoincalculator.tools/" },
          { name: "Calculators", url: "https://bitcoincalculator.tools/calculators" },
          { name: "HODL Strategy", url: "https://bitcoincalculator.tools/calculators/hodl-strategy" }
        ]}
      />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb
              items={[
                { label: language==='tr'?'Hesaplayıcılar':'Calculators', href: language==='tr'?'/tr/hesaplayicilar':'/calculators' },
                { label: language==='tr'?'HODL Stratejisi Hesaplayıcısı':'HODL Strategy Calculator' }
              ]}
            />
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-16 text-center">
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Hourglass className="w-4 h-4" />
                {language==='tr'?'HODL Stratejisi Hesaplayıcısı':'HODL Strategy Calculator'}
              </div>
              
              <h1 className="text-h1 font-bold text-foreground">
                {language==='tr'?<>Bitcoin <span className="text-gradient-premium">HODL Stratejisi</span> Hesaplayıcısı</>:<>Bitcoin <span className="text-gradient-premium">HODL Strategy</span> Calculator</>}
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language==='tr'?'Bitcoin alım/satım simülatörümüz, gerçek tarihsel fiyat verileri kullanarak HODL, DCA ve dip-alım stratejilerini yan yana karşılaştırmanızı sağlar — görüş değil, sadece sayılar.':'Our Bitcoin buy/sell simulator lets you compare HODL, DCA, and dip-buying side by side using real historical price data — no opinion, just numbers.'}
              </p>
              
              <CompactLiveBitcoinPrice currency="USD" />
            </div>
          </section>

          {/* Calculator Section */}
          <section className="container mx-auto px-6 pb-20">
            <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14">
              <QuickAnswerBox answer={language==='tr'
                ? "HODL — 'ne olursa olsun tut' — uzun vadeli bir Bitcoin stratejisidir: al, asla satma, gürültüyü yoksay. Hesaplayıcı, herhangi bir tarihsel giriş tarihini bugünkü BTC fiyatına karşı geri test eder; toplam getiri, BYBG, maksimum düşüş ve en uzun su altı dönemini ortaya koyar. 2013'ten bu yana her 4 yıllık dönemde HODL yapmak, ücretler ve vergiler sonrası yatırımcıların %96'sı için aktif işlemi geride bırakmıştır."
                : "HODL — 'hold on for dear life' — is a long-term Bitcoin strategy: buy, never sell, ignore the noise. The calculator backtests any historical entry date against today's BTC price, surfacing total return, CAGR, max drawdown, and the longest underwater period. Across every 4-year window since 2013, HODLing has outperformed active trading after fees and taxes for 96% of investors."
              } />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <HODLInputPanel onCalculate={handleCalculate} isCalculating={isCalculating} />
                </div>
                <div>
                  <ErrorBoundary>
                    <HODLResultsPanel
                      results={result?.strategies || null}
                      bestStrategy={result?.bestStrategy || null}
                      currency={currency}
                    />
                  </ErrorBoundary>
                </div>
              </div>

              {/* Chart Section */}
              {result && result.strategies.length > 0 && (
                <StrategyComparisonChart strategies={result.strategies} currency={currency} />
              )}

              {/* Breakdown Table */}
              {result && result.strategies.length > 0 && (
                <StrategyBreakdownTable strategies={result.strategies} currency={currency} />
              )}

              {/* Performance Metrics */}
              {result && result.strategies.length > 0 && (
                <PerformanceMetrics
                  strategies={result.strategies}
                  insights={result.comparisonInsights}
                />
              )}
            </div>
          </section>

          {/* Long-form Content */}
          <HODLContentSections />

          {/* How It Works */}
          <HODLHowItWorksSection />

          {/* FAQ */}
          <HODLFAQSection />

          {/* Related Calculators */}
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"><AffiliatePlacement slug="hodl-strategy" /></div>
          <RelatedCalculators />

          {/* Disclaimer */}
          <section className="container mx-auto px-6 pb-16">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{language==='tr'?'Önemli Sorumluluk Reddi':'Important Disclaimer'}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language==='tr'?'Bu hesaplayıcı tarihsel Bitcoin fiyat verilerini kullanır ve gelecekteki performansı tahmin etmez. Geçmiş sonuçlar gelecekteki getirileri garanti etmez. Gösterilen tüm stratejiler yalnızca eğitim amaçlıdır ve finansal tavsiye olarak değerlendirilmemelidir. Yatırım kararları vermeden önce her zaman kendi araştırmanızı yapın.':'This calculator uses historical Bitcoin price data and does not predict future performance. Past results do not guarantee future returns. All strategies shown are for educational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default BitcoinHODLStrategyCalculator;
