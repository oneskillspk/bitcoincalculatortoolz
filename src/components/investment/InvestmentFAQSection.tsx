import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeInternalHtml } from '@/utils/localizeHtml';

export const InvestmentFAQSection = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const faqs = tr ? [
    { question: '5 yıl sonra 100 $\'lık Bitcoin ne kadar değer olur?', answer: 'Bu, Bitcoin\'in gelecekteki büyüme oranına bağlıdır. Hesap makinemizi orta düzey %25 yıllık büyüme modeliyle kullandığınızda, bugün yatırılan 100 $ 5 yılda yaklaşık 305 $\'a çıkabilir. Agresif %50 modeli ile yaklaşık 759 $\'a ulaşabilir. Bunlar varsayımsal büyüme oranlarına dayalı tahminlerdir; gerçek sonuçlar piyasa koşullarına göre değişecektir.' },
    { question: 'Bitcoin\'e yatırım yapmak için çok mu geç?', answer: 'Aynı soruyu insanlar Bitcoin 100 $, 1.000 $, 10.000 $ ve 50.000 $\'dayken de sordular. Bitcoin\'in uzun vadeli büyümesi, 4 yıldan fazla elinde tutanlara tutarlı biçimde ödül vermiştir. Temel içgörü, tüm bir Bitcoin almanıza gerek olmadığıdır; herhangi bir miktarda yatırım yapabilir ve bir kesrini sahip olabilirsiniz. Küçük, düzenli yatırımların bile zaman içinde nasıl büyüyebileceğini görmek için hesap makinemizi kullanın.' },
    { question: 'Bitcoin\'in ortalama yıllık getirisi (BYBBO) nedir?', answer: 'Bitcoin\'in 2010\'dan bu yana bileşik yıllık büyüme oranı (BYBBO) yaklaşık yıllık %75-100 olmuştur. Ancak Bitcoin olgunlaştıkça ve piyasa değeri büyüdükçe, analistlerin büyük çoğunluğu bu oranın düşeceğini öngörmektedir. Hesap makinemiz farklı senaryoları planlamanıza yardımcı olmak için üç model sunar: Muhafazakâr (%10), Orta (%25) ve Agresif (%50).' },
    { question: 'Bitcoin S&P 500 ile nasıl karşılaştırılır?', answer: 'S&P 500, tarihsel olarak uzun vadede yılda yaklaşık %10 getiri sağlamıştır. Bitcoin, tarihinde 4 yılı aşan her elde tutma döneminde bunu önemli ölçüde geride bırakmıştır. Hesap makinemiz aynı yatırım tutarını Bitcoin, S&P 500, Altın ve tasarruf hesapları arasında yan yana karşılaştırmanıza olanak tanır.' },
    { question: 'Bitcoin yatırım olarak altınla nasıl karşılaştırılır?', answer: 'Altın tarihsel olarak yılda yaklaşık %7 getiri sağlamış ve güvenli liman varlığı olarak kabul edilmektedir. Bitcoin, altınla bazı özellikleri paylaşır (kıtlık, değer saklama) ancak önemli ölçüde daha yüksek volatilite ve büyüme potansiyeline sahiptir. Karşılaştırma aracımız, seçtiğiniz zaman ufkunda her iki varlık için de tahmini sonuçları gösterir.' },
    { question: 'Bitcoin tahminleri için hangi büyüme oranını kullanmalıyım?', answer: 'Gelecekteki tahminler için "doğru" bir büyüme oranı yoktur. Muhafazakâr modelimiz (%10) yaklaşık olarak borsanın tarihsel getirisine eşittir. Orta model (%25) Bitcoin\'in süregelen benimsenmesi için makul bir tahmin sunar. Agresif model (%50) Bitcoin\'in tarihsel ortalamasından daha yavaş ancak güçlü büyümesini varsayar. Ayrıca özel bir oran da belirleyebilirsiniz.' },
    { question: 'Bitcoin\'e küçük miktarlarda yatırım yapabilir miyim?', answer: 'Evet! Bitcoin, satoshi adı verilen 100 milyon birime bölünebilir. Çoğu borsada birkaç dolarlık Bitcoin satın alabilirsiniz. Hesap makinemiz herhangi bir tutardan başlayan yatırımları modellemenize olanak tanır; aylık 10 veya 50 $\'ın bile zaman içinde nasıl birikebilineceğini görebilirsiniz.' },
    { question: 'Bitcoin\'e dolar maliyet ortalaması nedir?', answer: 'Dolar maliyet ortalaması (DMA), fiyattan bağımsız olarak düzenli aralıklarla (ör. aylık 100 $) sabit bir tutarda yatırım yapmak anlamına gelir. Bu strateji, fiyatlar düşükken daha fazla BTC alıp yüksekken daha az alarak volatilitenin etkisini azaltır. Hesap makinemiz tek seferlik yatırımla birlikte DMA modellemeyi destekler. Ayrıntılı DMA analizi için özel <a href="/calculators/dca" class="text-primary hover:underline">DMA Hesaplayıcımızı</a> deneyin.' },
    { question: 'Enflasyon Bitcoin yatırımımı nasıl etkiler?', answer: 'Enflasyon, paranın satın alma gücünü zamanla aşındırır. Yıllık %3 enflasyon oranı, bugünkü 100 $\'ın 10 yıl sonra yalnızca yaklaşık 74 $\'lık mal satın alabileceği anlamına gelir. Hesap makinemiz, tahmini getirilerinizi "reel" (enflasyona göre ayarlanmış) değerlerle gösteren isteğe bağlı bir enflasyon düzeltme geçişi içerir; bu sayede gerçek satın alma gücü büyümesini daha net görürsünüz.' },
    { question: 'Gelecekteki Bitcoin varlığımı nasıl hesaplarım?', answer: 'Hesap makinemiz, bugünkü fiyattan başlangıç alımınıza ve düzenli DMA katkılarınıza göre gelecekteki BTC varlığınızı tahmin eder. Her katkıyı o noktadaki tahmini Bitcoin fiyatına böler. Bu size yatırım döneminiz boyunca biriktireceğiniz toplam satoshi veya BTC\'nin bir tahminini verir.' },
    { question: 'Bitcoin kârını nasıl hesaplarım?', answer: 'Bitcoin kâr hesaplayıcımıza alış fiyatı, satış fiyatı ve miktarı girerek USD olarak kârınızı, ROI yüzdenizi ve sermaye kazancınızı anında görebilirsiniz. Yatırım hesaplayıcımız birden fazla büyüme senaryosu kullanarak herhangi bir zaman ufkunda tahmini kârı modellemektedir.' },
    { question: 'Bitcoin\'de iyi bir ROI nedir?', answer: 'Bitcoin\'in 2012\'den bu yana tarihsel ortalama yıllık getirisi (BYBBO) yaklaşık %60-80 olmuştur; ancak aşırı volatilite ile birlikte. Farklı getiri senaryolarını modellemek ve S&P 500 ile altın gibi geleneksel varlıklarla karşılaştırmak için Bitcoin ROI hesaplayıcımızı kullanın.' },
    { question: 'Ne kadar Bitcoin\'e sahip olmalıyım?', answer: 'Dijital varlıkları kapsayan finansal danışmanların büyük çoğunluğu, risk toleransınıza ve yatırım ufkunuza göre portföyünüzün %1-10\'unu Bitcoin\'e ayırmanızı önerir. %5\'lik bir tahsiste 100.000 $\'lık portföy 5.000 $ BTC barındırır. Önemli olan şu: Küçük bir pozisyon bile, büyük düşüşlerde portföy genelinde zarar yazmak zorunda kalmadan anlamlı bir yükseliş fırsatı sunabilir.' },
    { question: 'Bitcoin gayrimenkulden daha iyi bir yatırım mı?', answer: 'Bitcoin ve gayrimenkul portföyde farklı işlevler üstlenir. Gayrimenkul kira geliri, kaldıraç ve vergi avantajları sunar ancak yüksek sermaye, likit olmayan taahhüt ve aktif yönetim gerektirir. Bitcoin yüksek likidite, 7/24 piyasalar, bakım maliyetsizlik ve tarihsel olarak daha güçlü değer artışı sunar; ancak önemli ölçüde daha yüksek volatiliteye sahiptir. Pek çok yatırımcı çeşitlendirme için her ikisini de tutar.' },
    { question: 'Bitcoin yatırımım bir çöküşte ne olur?', answer: 'Bitcoin tarihinde birden fazla kez %50-85 düşüş yaşadı (2014, 2018, 2022). Her seferinde fiyat nihayetinde toparlandı ve 2-3 yıl içinde yeni tüm zamanlar yükseklerini gördü. Para kaybeden yatırımcılar düşüş sırasında satanlardı. Hesap makinemiz, volatilite döngülerini hesaba katan muhafazakâr büyüme oranlarını modelleyerek bu senaryolara hazırlanmanıza yardımcı olur.' },
    { question: 'Bitcoin mi yoksa Bitcoin ETF\'lerine mi yatırım yapmalıyım?', answer: 'Spot Bitcoin ETF\'leri (IBIT, FBTC gibi) cüzdan veya özel anahtar yönetimi gerektirmeden Bitcoin\'e borsada uygun erişim sağlar. Ancak yıllık gider oranları (%0,20-0,25) keserler, öz yetimciliğe izin vermezler ve zincir içi işlemlerde kullanılamazlar. Doğrudan Bitcoin sahipliği tam kontrol ve süregelen ücretsizlik sağlar; ancak güvenli saklama öğrenimini gerektirir. Her iki yaklaşım da hesap makinemizde modellenen aynı fiyat artışından yararlanır.' },
    { question: 'Bitcoin yatırımlarında vergiler nasıl işler?', answer: 'ABD\'de Bitcoin mülk olarak vergilendirilir. Kısa vadeli kazançlar (1 yıldan az tutulma) olağan gelir oranınızda (%10-37) vergilendirilir. Uzun vadeli kazançlar (1 yıldan fazla tutulma) gelire bağlı olarak %0, %15 veya %20 daha düşük oranlardan yararlanır. Herhangi bir yatırım senaryosu için sermaye kazancı yükümlülüğünüzü tahmin etmek amacıyla <a href="/calculators/capital-gains-tax" class="text-primary hover:underline">Bitcoin Vergi Hesaplayıcımızı</a> kullanın.' },
    { question: 'Bitcoin\'e yatırım için minimum tutar nedir?', answer: 'Minimum yoktur; Bitcoin\'i 0,00000001 BTC\'ye (1 satoshi) kadar bölünmüş şekilde satın alabilirsiniz. Çoğu borsa 1-10 $\'dan başlayan alımları destekler. Haftada 25 $ bile (aylık 100 $) dolar maliyet ortalamasıyla birkaç yıl içinde anlamlı bir pozisyon biriktirebilir. Tahmini büyümeyi görmek için hesap makinemize istediğiniz tutarı girin.' },
    { question: 'Bitcoin yarılanması yatırım getirilerini nasıl etkiler?', answer: 'Bitcoin yarılanması yeni BTC arzını yaklaşık dört yılda bir %50 oranında azaltır. Tarihsel olarak her yarılanma büyük bir boğa koşusunun habercisi olmuştur: 2012 yarılanması %9.000\'lik bir kazanca, 2016 yarılanması %2.800\'lük bir kazanca ve 2020 yarılanması %700\'lük bir kazanca yol açmıştır. Geçmiş performans gelecek sonuçları garanti etmese de arz şoku mekanizması Bitcoin\'in ekonomik modelinin temel unsurudur. En son yarılanma Nisan 2024\'te gerçekleşti.' },
  ] : [
    { question: 'How much will $100 of Bitcoin be worth in 5 years?', answer: "That depends on Bitcoin's future growth rate. Using our calculator with a moderate 25% annual growth model, $100 invested today could grow to approximately $305 in 5 years. With an aggressive 50% model, it could reach about $759. These are projections based on hypothetical growth rates — actual results will vary based on market conditions." },
    { question: 'Is it too late to invest in Bitcoin?', answer: "Many people asked this same question when Bitcoin was at $100, $1,000, $10,000, and $50,000. Bitcoin's long-term growth has consistently rewarded patient investors who held for 4+ years. The key insight is that you don't need to buy a whole Bitcoin — you can invest any amount and own a fraction. Use our calculator to see how even small, regular investments can grow over time." },
    { question: "What is Bitcoin's average annual return (CAGR)?", answer: "Bitcoin's compound annual growth rate (CAGR) since 2010 has been approximately 75-100% per year. However, as Bitcoin matures and its market cap grows, most analysts expect this rate to decrease. Our calculator offers three models: Conservative (10%), Moderate (25%), and Aggressive (50%) to help you plan for different scenarios." },
    { question: 'How does Bitcoin compare to the S&P 500?', answer: 'The S&P 500 has historically returned approximately 10% annually over the long term. Bitcoin has significantly outperformed this over every 4+ year holding period in its history. Our calculator lets you compare the same investment amount across Bitcoin, S&P 500, Gold, and savings accounts side-by-side.' },
    { question: 'How does Bitcoin compare to gold as an investment?', answer: 'Gold has historically returned approximately 7% annually and is considered a safe-haven asset. Bitcoin shares some properties with gold (scarcity, store of value) but has significantly higher volatility and growth potential. Our comparison tool shows projected outcomes for both assets over your chosen time horizon.' },
    { question: 'What growth rate should I use for Bitcoin projections?', answer: "There is no \"correct\" growth rate for future projections. Our Conservative model (10%) is roughly equal to the stock market's historical return. The Moderate model (25%) reflects a reasonable estimate for Bitcoin's continued adoption. The Aggressive model (50%) assumes Bitcoin continues strong growth but at a slower pace than its historical average. You can also set a custom rate." },
    { question: 'Can I invest small amounts in Bitcoin?', answer: 'Yes! Bitcoin is divisible into 100 million units called satoshis. You can buy as little as a few dollars worth of Bitcoin on most exchanges. Our calculator lets you model investments starting from any amount — even $10 or $50 per month — to see how they can compound over time.' },
    { question: 'What is dollar cost averaging into Bitcoin?', answer: 'Dollar cost averaging (DCA) means investing a fixed amount at regular intervals (e.g., $100/month) regardless of price. This strategy reduces the impact of volatility by buying more BTC when prices are low and less when prices are high. Our calculator supports modeling DCA alongside a lump sum investment. Try our dedicated <a href="/calculators/dca" class="text-primary hover:underline">DCA Calculator</a> for detailed DCA analysis.' },
    { question: 'How does inflation affect my Bitcoin investment?', answer: 'Inflation erodes the purchasing power of money over time. A 3% annual inflation rate means $100 today will only buy about $74 worth of goods in 10 years. Our calculator includes an optional inflation adjustment toggle that shows your projected returns in "real" (inflation-adjusted) terms, giving you a clearer picture of actual purchasing power growth.' },
    { question: 'How do I calculate my future Bitcoin holdings?', answer: "Our calculator estimates your future BTC holdings based on your initial purchase at today's price plus any recurring DCA contributions. It divides each contribution by the projected Bitcoin price at that point in time. This gives you an estimate of total satoshis or BTC you'd accumulate over your investment period." },
    { question: 'How do I calculate Bitcoin profit?', answer: 'Enter your buy price, sell price, and amount in our Bitcoin profit calculator to instantly see your profit in USD, your ROI percentage, and your capital gains. Our investment calculator models projected profit over any time horizon using multiple growth scenarios.' },
    { question: 'What is a good ROI on Bitcoin?', answer: "Bitcoin's historical average annual return (CAGR) has been approximately 60-80% since 2012, though with extreme volatility. Use our Bitcoin ROI calculator to model different return scenarios for your investment and compare against traditional assets like the S&P 500 and gold." },
    { question: 'How much Bitcoin should I own?', answer: 'Most financial advisors who cover digital assets suggest a 1–10% portfolio allocation to Bitcoin, depending on your risk tolerance and time horizon. At 5%, a $100,000 portfolio would hold $5,000 in BTC. The key is that even a small position can deliver meaningful upside without creating portfolio-level risk during drawdowns. Use our calculator to model different allocation sizes.' },
    { question: 'Is Bitcoin a better investment than real estate?', answer: 'Bitcoin and real estate serve different portfolio functions. Real estate offers rental income, leverage, and tax advantages but requires large capital, illiquid commitment, and active management. Bitcoin offers high liquidity, 24/7 markets, no maintenance costs, and historically stronger appreciation — but with significantly higher volatility. Many investors hold both for diversification.' },
    { question: 'What happens to my Bitcoin investment during a crash?', answer: "Bitcoin has experienced drawdowns of 50–85% multiple times in its history (2014, 2018, 2022). In every case, the price eventually recovered and set new all-time highs within 2–3 years. The investors who lost money were those who sold during the drawdown. Our calculator helps you plan for these scenarios by modeling conservative growth rates that account for volatility cycles." },
    { question: 'Should I invest in Bitcoin or Bitcoin ETFs?', answer: "Spot Bitcoin ETFs (like IBIT, FBTC) offer convenient stock-market exposure to Bitcoin without managing wallets or private keys. However, they charge annual expense ratios (0.20–0.25%), don't allow self-custody, and can't be used for on-chain transactions. Direct Bitcoin ownership gives full control and zero ongoing fees but requires learning about secure storage. Both approaches benefit from the same price appreciation modeled in our calculator." },
    { question: 'How do taxes work on Bitcoin investments?', answer: 'In the US, Bitcoin is taxed as property. Short-term gains (held less than 1 year) are taxed at your ordinary income rate (10–37%). Long-term gains (held over 1 year) qualify for lower rates of 0%, 15%, or 20% depending on income. Use our <a href="/calculators/capital-gains-tax" class="text-primary hover:underline">Bitcoin Tax Calculator</a> to estimate your capital gains liability for any investment scenario.' },
    { question: 'What is the minimum amount to invest in Bitcoin?', answer: 'There is no minimum — you can buy fractions of a Bitcoin down to 0.00000001 BTC (1 satoshi). Most exchanges allow purchases starting from $1–$10. Even investing $25 per week ($100/month) can accumulate a meaningful position over several years through dollar cost averaging. Enter any amount in our calculator to see projected growth.' },
    { question: 'How does the Bitcoin halving affect investment returns?', answer: "The Bitcoin halving reduces new BTC supply by 50% roughly every four years. Historically, each halving has preceded a major bull run: 2012 halving led to a 9,000% gain, 2016 to 2,800%, and 2020 to 700%. While past performance doesn't guarantee future results, the supply shock mechanism is a core part of Bitcoin's economic model. The most recent halving occurred in April 2024." },
  ];

  // FAQPage JSON-LD mirroring the visible accordion exactly (HTML stripped).
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: tr ? 'tr' : 'en',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.replace(/<[^>]+>/g, ''),
      },
    })),
  };

  return (
    <section className="py-20 bg-muted/30">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr?'SSS':'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr?'Sıkça Sorulan Sorular':'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr?'Bitcoin yatırım getirilerinizi tahmin etmek hakkında bilmeniz gereken her şey':'Everything you need to know about projecting your Bitcoin investment returns'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: localizeInternalHtml(faq.answer, language as 'en' | 'tr') }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
