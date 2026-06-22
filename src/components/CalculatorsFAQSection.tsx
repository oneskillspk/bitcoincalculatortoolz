import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const faqDataEn = [
  {
    question: "Which calculator should I use for my investment goals?",
    answer: "Start based on your primary goal. To analyze past performance, use the What If Calculator. To plan recurring investments, use the DCA Calculator. For long-term wealth building, the Retirement Planner is ideal. To compare strategies, try the Lump Sum vs. DCA tool."
  },
  {
    question: "Are these calculators accurate and is my financial data safe?",
    answer: "Yes. Our tools use real-time and historical market data for the highest possible accuracy. All calculations are performed in your browser, and we never see or store any of your personal financial data. Your privacy is our top priority."
  },
  {
    question: "What data sources do your calculators use?",
    answer: "Our calculators are powered by real-time price feeds from the CoinGecko API for current valuations, a comprehensive database of historical daily price data for backtesting, and on-chain data for tools like the Wealth Percentile Calculator."
  },
  {
    question: "Are all the tools in the suite free to use?",
    answer: "Yes, absolutely. All 49+ calculators are completely free to use with no hidden fees, subscriptions, or account signup required."
  },
  {
    question: "Can I save or share my calculation results?",
    answer: "Yes. Many of our calculators include a Share Results or Copy Link feature. This generates a unique URL with your inputs saved, allowing you to bookmark your scenarios or share them with others. Advanced tools also support PNG and PDF report exports."
  },
  {
    question: "What's the difference between DCA and a HODL strategy?",
    answer: "DCA (Dollar-Cost Averaging) is an accumulation strategy where you invest a fixed amount at regular intervals. HODL is a long-term holding philosophy. Our DCA Calculator and HODL Strategy Tracker help you model and track both approaches with real historical data."
  },
  {
    question: "How does the Lump Sum vs. DCA Comparison tool work?",
    answer: "It lets you backtest both strategies against actual historical Bitcoin prices for any time period you choose. Enter your investment amount, select a date range, and instantly see which approach would have yielded better returns."
  },
  {
    question: "What market analysis tools are available?",
    answer: "We offer the Rainbow Price Chart for logarithmic valuation zones, the Fear & Greed Index for real-time market sentiment, the Wealth Percentile Calculator to rank your holdings globally, and the Bitcoin vs. Traditional Assets comparison."
  },
  {
    question: "Do you offer tools for mining and Lightning Network?",
    answer: "Yes. The Mining Profitability Calculator factors in hash rate, power consumption, electricity costs, and difficulty adjustments. The Lightning Network Fee Calculator estimates routing fees and helps find optimal payment channels."
  },
  {
    question: "Are profits from Bitcoin taxable?",
    answer: "In most countries, you may owe capital gains tax when you sell or trade Bitcoin for a profit. Our Capital Gains Tax Calculator helps you estimate this liability based on your purchase price, sale price, and holding period. This is not financial advice."
  },
  {
    question: "How does the Bitcoin Wealth Percentile Calculator work?",
    answer: "Enter your BTC holdings or their fiat value, and the tool ranks you against global Bitcoin address distribution tiers—from Shrimp to Whale. It uses on-chain data to show your exact percentile and provides a privacy-safe sharing card."
  },
  {
    question: "I'm new here. What is Bitcoin Calculator Tools?",
    answer: "Bitcoin Calculator Tools is a free suite of 49+ professional-grade financial tools designed for smart Bitcoin investors, long-term planners, and anyone curious about cryptocurrency. From basic profit calculators to advanced tools like the Rainbow Chart, everything runs in your browser with no signup needed."
  }
];

const faqDataTr = [
  {
    question: "Yatırım hedeflerim için hangi hesaplayıcıyı kullanmalıyım?",
    answer: "Birincil hedefinize göre başlayın. Geçmiş performansı analiz etmek için Ya Olsaydı Hesaplayıcısı'nı kullanın. Düzenli yatırım planlamak için DCA Hesaplayıcısı'nı tercih edin. Uzun vadeli servet oluşturmak için Emeklilik Planlayıcısı idealdir. Stratejileri karşılaştırmak için Toplu Yatırım vs. DCA aracını deneyin."
  },
  {
    question: "Bu hesaplayıcılar doğru mu ve finansal verilerim güvende mi?",
    answer: "Evet. Araçlarımız en yüksek doğruluk için gerçek zamanlı ve tarihsel piyasa verileri kullanır. Tüm hesaplamalar tarayıcınızda yapılır; kişisel finansal verilerinizi asla görmez veya saklamayız. Gizliliğiniz önceliğimizdir."
  },
  {
    question: "Hesaplayıcılarınız hangi veri kaynaklarını kullanıyor?",
    answer: "Hesaplayıcılarımız güncel değerlemeler için CoinGecko API'sinden gerçek zamanlı fiyat verileri, geriye dönük test için kapsamlı tarihsel günlük fiyat veritabanı ve Servet Yüzdesi Hesaplayıcısı gibi araçlar için zincir üstü verilerle çalışır."
  },
  {
    question: "Paketteki tüm araçlar ücretsiz mi?",
    answer: "Evet, kesinlikle. 46'dan fazla hesaplayıcının tamamı gizli ücret, abonelik veya hesap kaydı olmaksızın tamamen ücretsiz kullanılabilir."
  },
  {
    question: "Hesaplama sonuçlarımı kaydedebilir veya paylaşabilir miyim?",
    answer: "Evet. Hesaplayıcılarımızın çoğu Sonuçları Paylaş veya Bağlantı Kopyala özelliği sunar. Bu, girişlerinizin kaydedildiği benzersiz bir URL oluşturarak senaryolarınızı yer imlerine eklemenizi veya başkalarıyla paylaşmanızı sağlar. Gelişmiş araçlar PNG ve PDF rapor dışa aktarmayı da destekler."
  },
  {
    question: "DCA ile HODL stratejisi arasındaki fark nedir?",
    answer: "DCA (Dolar Maliyet Ortalaması), belirli aralıklarla sabit miktarda yatırım yapılan bir birikim stratejisidir. HODL ise uzun vadeli tutma felsefesidir. DCA Hesaplayıcımız ve HODL Strateji Takipçimiz, her iki yaklaşımı gerçek tarihsel verilerle modellemenize ve takip etmenize yardımcı olur."
  },
  {
    question: "Toplu Yatırım vs. DCA Karşılaştırma aracı nasıl çalışır?",
    answer: "Seçtiğiniz herhangi bir dönem için her iki stratejiyi gerçek tarihsel Bitcoin fiyatlarına göre geriye dönük test etmenizi sağlar. Yatırım tutarınızı girin, bir tarih aralığı seçin ve hangi yaklaşımın daha iyi getiri sağlayacağını anında görün."
  },
  {
    question: "Hangi piyasa analiz araçları mevcut?",
    answer: "Logaritmik değerleme bölgeleri için Gökkuşağı Fiyat Grafiği, gerçek zamanlı piyasa duyarlılığı için Korku ve Açgözlülük Endeksi, varlıklarınızı küresel ölçekte sıralamak için Servet Yüzdesi Hesaplayıcısı ve Bitcoin ile Geleneksel Varlıklar karşılaştırmasını sunuyoruz."
  },
  {
    question: "Madencilik ve Lightning Network için araçlar sunuyor musunuz?",
    answer: "Evet. Madencilik Karlılık Hesaplayıcısı hash hızı, güç tüketimi, elektrik maliyetleri ve zorluk ayarlamalarını dikkate alır. Lightning Network Ücret Hesaplayıcısı yönlendirme ücretlerini tahmin eder ve en uygun ödeme kanallarını bulmaya yardımcı olur."
  },
  {
    question: "Bitcoin'den elde edilen kazançlar vergilendirilebilir mi?",
    answer: "Çoğu ülkede, Bitcoin'i kâr amacıyla satarsanız veya takas ederseniz sermaye kazancı vergisi ödemeniz gerekebilir. Sermaye Kazancı Vergi Hesaplayıcımız, alış fiyatı, satış fiyatı ve elde tutma sürenize göre bu yükümlülüğü tahmin etmenize yardımcı olur. Bu finansal tavsiye değildir."
  },
  {
    question: "Bitcoin Servet Yüzdesi Hesaplayıcısı nasıl çalışır?",
    answer: "BTC varlıklarınızı veya fiat değerlerini girin; araç sizi Karides'ten Balina'ya uzanan küresel Bitcoin adres dağılımı katmanlarına göre sıralar. Kesin yüzdenizi göstermek için zincir üstü verileri kullanır ve gizliliği koruyan bir paylaşım kartı sunar."
  },
  {
    question: "Yeniyim. Bitcoin Calculator Tools nedir?",
    answer: "Bitcoin Calculator Tools, akıllı Bitcoin yatırımcıları, uzun vadeli planlayıcılar ve kripto para birimine merak duyanlar için tasarlanmış 46'dan fazla profesyonel düzeyde finansal araçtan oluşan ücretsiz bir pakettir. Temel kâr hesaplayıcılardan Gökkuşağı Grafiği gibi gelişmiş araçlara kadar her şey tarayıcınızda kayıt gerekmeden çalışır."
  }
];

export const CalculatorsFAQSection = () => {
  const { language } = useLanguage();
  const faqData = language === 'tr' ? faqDataTr : faqDataEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {language === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {language === 'tr'
              ? 'Hesaplayıcı araçlarımız ve Bitcoin yatırım stratejileri hakkında sık sorulan soruların yanıtlarını bulun.'
              : 'Get answers to common questions about our calculator tools and Bitcoin investment strategies.'}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border/30 rounded-xl px-5 bg-card"
            >
              <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
