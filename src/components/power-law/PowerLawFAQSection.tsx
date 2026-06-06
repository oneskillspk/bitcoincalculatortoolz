import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is the Bitcoin Power Law?", a: "The Bitcoin Power Law is a mathematical model showing that Bitcoin's price follows a power-law relationship with time. It means Bitcoin's price scales as a power function of the number of days since its Genesis Block (January 3, 2009). The formula is Price = A × (days)^n, producing a straight line on a log-log chart." },
  { q: "Who created the Power Law model?", a: "The Bitcoin Power Law model was developed by astrophysicist Giovanni Santostasi. He applied techniques from physics — where power laws describe phenomena like earthquake magnitudes and city sizes — to Bitcoin's price history, discovering a remarkably consistent fit over 15+ years of data." },
  { q: "How accurate is the Power Law model?", a: "The Power Law has shown a strong historical fit with an R² above 0.95 on log-log scale since 2009. However, it is a statistical regression — not a guarantee. It works best as a long-term framework for understanding whether Bitcoin is trading above or below its historical trend, not for short-term price predictions." },
  { q: "What are the support and resistance bands?", a: "The support band represents the lower boundary — roughly the fair value divided by 3. Bitcoin has historically rarely traded below this line. The resistance band is the fair value multiplied by 3, representing the upper boundary where Bitcoin tends to peak during bull markets. Together, they form a 'confidence corridor' around the trend." },
  { q: "What are the limitations of the Power Law?", a: "The model assumes the past power-law relationship will continue indefinitely, which may not hold as Bitcoin matures. It cannot predict short-term volatility, black swan events, or regulatory changes. The model is best used as one tool among many — not as a sole basis for investment decisions." },
  { q: "What does the Bitcoin Power Law predict for 2030?", a: "The Power Law model projects a fair value, a support floor (fair value ÷ 3), and a resistance ceiling (fair value × 3) for any date. For January 2030, the fair value, support, and resistance are calculated live in the projection table above. These numbers extend the same curve that has tracked Bitcoin since 2009, but they aren't guarantees." },
  { q: "Is the Power Law more accurate than Stock-to-Flow?", a: "The Stock-to-Flow model predicted $100K Bitcoin by late 2021, which didn't materialize. Its price path has diverged significantly since. The Power Law uses time as its sole input variable, producing a continuous curve that held through the 2022 bear market and into 2026. While S2F offers insight into scarcity dynamics, the Power Law has tracked actual price corridors more reliably across full cycles." },
  { q: "What is Bitcoin's current Power Law fair value?", a: "The fair value updates in real time based on the number of days since the Genesis Block. You can see today's exact fair value, support floor, and resistance ceiling in the calculator results panel above. The deviation percentage shows whether Bitcoin is currently trading above or below this model-derived fair price." },
  { q: "What is the Power Law floor price for Bitcoin?", a: "The Power Law floor (support band) is calculated as the fair value divided by 3. Bitcoin has historically rarely traded below this line for extended periods. When it has, those moments have coincided with generational buying opportunities like March 2020 and late 2022. The current floor price is shown in the results panel and projection table above." },
];

const faqsTr = [
  { q: "Bitcoin Güç Yasası nedir?", a: "Bitcoin Güç Yasası, Bitcoin'in fiyatının zamanla bir güç yasası ilişkisini izlediğini gösteren matematiksel bir modeldir. Bitcoin'in fiyatının Genesis Block'undan (3 Ocak 2009) itibaren geçen gün sayısının güç fonksiyonu olarak ölçeklendiği anlamına gelir. Formül Fiyat = A × (gün)^n şeklindedir ve log-log grafikte düz bir çizgi üretir." },
  { q: "Güç Yasası modelini kim oluşturdu?", a: "Bitcoin Güç Yasası modeli astrofizikçi Giovanni Santostasi tarafından geliştirildi. Deprem büyüklükleri ve şehir boyutları gibi olguları tanımlayan güç yasalarının fizikten tekniklerini Bitcoin'in fiyat tarihine uygulayarak 15+ yıllık veri boyunca dikkat çekici tutarlı bir uyum keşfetti." },
  { q: "Güç Yasası modeli ne kadar doğru?", a: "Güç Yasası, 2009'dan bu yana log-log ölçeğinde 0,95'in üzerinde R² ile güçlü bir tarihsel uyum gösterdi. Ancak bu istatistiksel bir regresyondur — bir garanti değildir. En iyi kısa vadeli fiyat tahminleri için değil, Bitcoin'in tarihsel trendinin üzerinde mi yoksa altında mı işlem gördüğünü anlamak için uzun vadeli bir çerçeve olarak işe yarar." },
  { q: "Destek ve direnç bantları nedir?", a: "Destek bandı, yaklaşık adil değerin üçte birine eşit alt sınırı temsil eder. Bitcoin tarihsel olarak nadiren bu çizginin altında işlem gördü. Direnç bandı, Bitcoin'in boğa piyasaları sırasında zirve yapmaya eğilimli olduğu üst sınırı temsil eden adil değerin üç katıdır. Birlikte trend çevresinde bir 'güven koridoru' oluştururlar." },
  { q: "Güç Yasasının sınırlamaları nelerdir?", a: "Model, geçmiş güç yasası ilişkisinin süresiz devam edeceğini varsayar; bu Bitcoin olgunlaştıkça geçerli olmayabilir. Kısa vadeli volatiliteyi, siyah kuğu olaylarını veya düzenleyici değişiklikleri tahmin edemez. Model, yatırım kararlarının tek temeli olarak değil, birçok araçtan biri olarak kullanılmak üzere en iyi şekilde işe yarar." },
  { q: "Bitcoin Güç Yasası 2030 için ne öngörüyor?", a: "Güç Yasası modeli herhangi bir tarih için adil değer, destek tabanı (adil değer ÷ 3) ve direnç tavanı (adil değer × 3) projelendirir. Ocak 2030 için adil değer, destek ve direnç yukarıdaki projeksiyon tablosunda canlı olarak hesaplanır. Bu sayılar 2009'dan bu yana Bitcoin'i izleyen aynı eğriyi uzatır, ancak garanti değildir." },
  { q: "Güç Yasası, Stok-Akış'tan daha mı doğru?", a: "Stok-Akış modeli 2021 sonunda 100.000 $ Bitcoin öngörmüştü, ancak bu gerçekleşmedi. Fiyat yolu o zamandan beri önemli ölçüde saptı. Güç Yasası, tek girdi değişkeni olarak zamanı kullanır ve 2022 ayı piyasasında ve 2026'ya kadar süregelen kesintisiz bir eğri üretir. S2F kıtlık dinamiklerine içgörü sunarken, Güç Yasası tam döngüler boyunca gerçek fiyat koridorlarını daha güvenilir biçimde takip etti." },
  { q: "Bitcoin'in mevcut Güç Yasası adil değeri nedir?", a: "Adil değer, Genesis Block'undan bu yana geçen gün sayısına göre gerçek zamanlı güncellenir. Bugünün tam adil değerini, destek tabanını ve direnç tavanını yukarıdaki hesap makinesi sonuç panelinde görebilirsiniz. Sapma yüzdesi, Bitcoin'in şu anda bu modelden türetilen adil fiyatın üzerinde mi yoksa altında mı işlem gördüğünü gösterir." },
  { q: "Bitcoin için Güç Yasası taban fiyatı nedir?", a: "Güç Yasası tabanı (destek bandı) adil değerin üçe bölünmesiyle hesaplanır. Bitcoin tarihsel olarak uzun süreler bu çizginin altında nadiren işlem gördü. Bu durum gerçekleştiğinde, bu anlar Mart 2020 ve 2022 sonları gibi nesiller boyu alım fırsatlarıyla örtüştü. Güncel taban fiyat yukarıdaki sonuç panelinde ve projeksiyon tablosunda gösterilmektedir." },
];

export const PowerLawFAQSection = () => {
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
            {tr
              ? 'Bitcoin Güç Yasası modeli ve fiyat projeksiyonları hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about the Bitcoin Power Law model and price projections'}
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
