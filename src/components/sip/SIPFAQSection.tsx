import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'What is a Bitcoin SIP?', a: "A Bitcoin SIP (Systematic Investment Plan) is a strategy where you invest a fixed amount in Bitcoin at regular intervals — weekly, biweekly, or monthly. It's similar to mutual fund SIPs popular in India and other markets, but applied to Bitcoin. The goal is to reduce the impact of price volatility by averaging your purchase price over time." },
  { q: 'How is SIP different from DCA?', a: "SIP and DCA (Dollar Cost Averaging) are very similar concepts. DCA refers to the general strategy of investing fixed amounts at regular intervals. SIP is the term commonly used in India and Asian markets for the same approach, typically in the context of mutual funds. Our Bitcoin SIP Calculator focuses on forward-looking projections, while our DCA Calculator backtests with historical prices." },
  { q: 'What return rate should I expect for Bitcoin SIP?', a: "Bitcoin's historical compound annual growth rate (CAGR) has been approximately 60–80% since its inception. However, past performance does not guarantee future returns. A conservative estimate of 15–30% may be more appropriate for planning purposes, especially as Bitcoin matures as an asset class. Use our preset buttons (Conservative 15%, Moderate 30%, Aggressive 50%) for different scenarios." },
  { q: 'Is weekly or monthly SIP better for Bitcoin?', a: "Weekly SIPs provide more price averaging points, which can reduce volatility impact — particularly useful for Bitcoin's large price swings. However, monthly SIPs are simpler to manage and typically result in slightly lower transaction costs. Research shows the long-term difference between weekly and monthly DCA is minimal over 5+ year horizons." },
  { q: 'Can I do SIP in Bitcoin in the USA or India?', a: "Yes! In the USA, platforms like Swan Bitcoin, Strike, and River allow automated recurring Bitcoin purchases. In India, exchanges like WazirX, CoinDCX, and CoinSwitch offer auto-invest or SIP features for Bitcoin. Most major global exchanges support scheduled purchases that function as Bitcoin SIPs." },
  { q: 'How does inflation affect my Bitcoin SIP returns?', a: "Inflation erodes the purchasing power of your returns over time. A portfolio that grows to $100,000 over 10 years with 3% annual inflation is only worth about $74,400 in today's dollars. Toggle the inflation adjustment in our calculator to see \"real\" returns. Bitcoin is often seen as an inflation hedge due to its fixed 21 million supply cap." },
  { q: 'Is Bitcoin SIP better than mutual fund SIP?', a: "Bitcoin and mutual funds serve different purposes. Bitcoin SIP offers exposure to a high-growth, high-volatility digital asset with potential for outsized returns. Mutual fund SIPs (especially index funds) offer diversified, lower-volatility exposure to traditional markets. Many financial advisors suggest allocating 1–10% of your portfolio to Bitcoin while maintaining traditional investments for stability." },
  { q: 'What is the minimum amount for Bitcoin SIP?', a: "Most platforms allow Bitcoin purchases starting from as little as $1–$10. Our calculator supports a minimum of $10 per period. Even small amounts can grow significantly over time due to compounding. For example, a $25 weekly SIP at 30% annual return would grow to over $15,000 in just 5 years from approximately $6,500 invested." },
];

const faqsTr = [
  { q: "Bitcoin SIP nedir?", a: "Bitcoin SIP (Sistematik Yatırım Planı), Bitcoin'e düzenli aralıklarla — haftalık, iki haftada bir veya aylık — sabit miktarda yatırım yaptığınız bir stratejidir. Hindistan ve diğer piyasalarda popüler olan yatırım fonu SIP'lerine benzer, ancak Bitcoin'e uygulanır. Amaç, satın alma fiyatınızı zaman içinde ortalamayla fiyat oynaklığının etkisini azaltmaktır." },
  { q: "SIP ile DCA arasındaki fark nedir?", a: "SIP ve DCA (Dolar Maliyeti Ortalama) çok benzer kavramlardır. DCA, düzenli aralıklarla sabit miktarlarda yatırım yapmanın genel stratejisini ifade eder. SIP, Hindistan ve Asya piyasalarında genellikle yatırım fonları bağlamında aynı yaklaşım için kullanılan terimdir. Bitcoin SIP Hesaplayıcımız geleceğe yönelik projeksiyonlara odaklanırken, DCA Hesaplayıcımız tarihsel fiyatlarla geriye dönük test yapar." },
  { q: "Bitcoin SIP için hangi getiri oranını beklemeliyim?", a: "Bitcoin'in tarihsel bileşik yıllık büyüme oranı (YBBO) başlangıcından bu yana yaklaşık %60-80 olmuştur. Ancak geçmiş performans gelecekteki getirileri garanti etmez. Bitcoin varlık sınıfı olarak olgunlaştıkça planlama amacıyla %15-30'luk muhafazakâr bir tahmin daha uygun olabilir. Farklı senaryolar için ön ayar düğmelerimizi kullanın (Muhafazakâr %15, Orta %30, Agresif %50)." },
  { q: "Bitcoin için haftalık mı aylık mı SIP daha iyidir?", a: "Haftalık SIP'ler daha fazla fiyat ortalama noktası sağlar; bu da volatilite etkisini azaltabilir — Bitcoin'in büyük fiyat dalgalanmaları için özellikle kullanışlıdır. Ancak aylık SIP'ler yönetmesi daha basittir ve genellikle biraz daha düşük işlem maliyetlerine yol açar. Araştırmalar, 5+ yıllık ufuklarda haftalık ve aylık DCA arasındaki uzun vadeli farkın minimal olduğunu göstermektedir." },
  { q: "ABD veya Hindistan'da Bitcoin SIP yapabilir miyim?", a: "Evet! ABD'de Swan Bitcoin, Strike ve River gibi platformlar otomatik yinelenen Bitcoin alımlarına izin verir. Hindistan'da WazirX, CoinDCX ve CoinSwitch gibi borsalar Bitcoin için otomatik yatırım veya SIP özellikleri sunar. Büyük küresel borsaların çoğu, Bitcoin SIP işlevi gören planlanmış alımları destekler." },
  { q: "Enflasyon Bitcoin SIP getirilerimi nasıl etkiler?", a: "Enflasyon, getirilerinizin satın alma gücünü zaman içinde aşındırır. Yıllık %3 enflasyonla 10 yıl içinde 100.000 $'a büyüyen bir portföy, bugünün dolarıyla yalnızca yaklaşık 74.400 $ değerindedir. 'Gerçek' getirileri görmek için hesap makinemizdeki enflasyon düzeltmesini açın. Bitcoin, sabit 21 milyon arz tavanı nedeniyle çoğunlukla bir enflasyon koruması olarak görülmektedir." },
  { q: "Bitcoin SIP, yatırım fonu SIP'inden daha iyi midir?", a: "Bitcoin ve yatırım fonları farklı amaçlara hizmet eder. Bitcoin SIP, olağandışı getiri potansiyeline sahip yüksek büyüme, yüksek volatilite gösteren bir dijital varlığa maruz kalma sağlar. Yatırım fonu SIP'leri (özellikle endeks fonları) geleneksel piyasalara çeşitlendirilmiş, düşük volatiliteli maruz kalma sağlar. Pek çok finansal danışman, istikrar için geleneksel yatırımları korurken portföyünüzün %1-10'unu Bitcoin'e tahsis etmeyi önermektedir." },
  { q: "Bitcoin SIP için minimum tutar nedir?", a: "Çoğu platform, 1-10 $ kadar düşük tutarlardan Bitcoin alımına izin verir. Hesap makinemiz dönem başına minimum 10 $'ı destekler. Küçük miktarlar bile bileşik büyüme sayesinde zaman içinde önemli ölçüde büyüyebilir. Örneğin, yıllık %30 getiriyle 25 $'lık haftalık SIP, yaklaşık 6.500 $ yatırımdan yalnızca 5 yılda 15.000 $'ın üzerine çıkardı." },
];

export const SIPFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr ? 'Bitcoin SIP ve sistematik yatırım hakkında bilmeniz gereken her şey' : 'Everything you need to know about Bitcoin SIP and systematic investing'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
