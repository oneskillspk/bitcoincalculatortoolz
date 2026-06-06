import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'What is the Bitcoin Rainbow Chart?', a: "The Bitcoin Rainbow Chart is a long-term valuation tool that uses logarithmic regression to plot colored bands on top of Bitcoin's price history. Each band represents a different valuation zone, from \"Basically a Fire Sale\" (blue) at the bottom to \"Maximum Bubble Territory\" (dark red) at the top. It helps investors quickly see whether Bitcoin is cheap, fairly valued, or overpriced relative to its long-term growth trend." },
  { q: 'Is Bitcoin overvalued or undervalued right now?', a: "Check the current zone indicator on this page to see which Rainbow band Bitcoin is trading in today. Blue and green bands suggest undervaluation, yellow bands indicate fair value, and orange to red bands suggest overvaluation. Remember that the Rainbow Chart is one tool among many and should not be used in isolation for investment decisions." },
  { q: 'How accurate is the Bitcoin Rainbow Chart?', a: "The Rainbow Chart has historically captured Bitcoin's long-term growth trend well, correctly identifying cycle tops and bottoms within its bands. However, it is based on a curve fit to past data and becomes less reliable the further you project into the future. It should be used as a general guide, not a precise predictor. Past accuracy does not guarantee future accuracy." },
  { q: 'How is the Bitcoin Rainbow Chart calculated?', a: 'The chart uses a logarithmic regression formula: log₁₀(price) = a × log₁₀(days since genesis) + b, where the genesis date is January 3, 2009. The regression coefficients (a = 5.84, b = -17.01) are fitted to historical Bitcoin price data. The nine colored bands are created by offsetting the b parameter up and down, creating parallel curves on the logarithmic chart.' },
  { q: 'What do the colors on the Bitcoin Rainbow Chart mean?', a: 'From bottom to top: Blue ("Basically a Fire Sale") and Cyan ("BUY!") suggest extreme undervaluation. Green ("Accumulate") and Lime ("Still Cheap") suggest good buying opportunities. Yellow ("HODL!") represents fair value. Amber ("Is This a Bubble?") and Orange ("FOMO Intensifies") indicate caution. Red ("Sell. Seriously, SELL!") and Dark Red ("Maximum Bubble Territory") suggest extreme overvaluation.' },
  { q: "Can the Rainbow Chart predict Bitcoin's price?", a: "The Rainbow Chart does not predict specific price targets. It provides a visual framework for understanding where Bitcoin's current price sits relative to its long-term logarithmic growth trend. The forward-projected bands show where each valuation zone will be in the future, but the actual price could be anywhere within or outside these bands." },
  { q: 'When should I buy Bitcoin according to the Rainbow Chart?', a: 'Historically, the best buying opportunities have been when Bitcoin trades in the blue, cyan, and green bands (bands 1-3). The chart suggests that buying during these periods has yielded the highest long-term returns. However, Bitcoin may not always return to these lower bands, and the chart should be combined with other analysis tools for decision-making.' },
  { q: 'What is logarithmic regression in Bitcoin?', a: "Logarithmic regression is a statistical method that fits a curved line to data using the logarithm function. For Bitcoin, it captures the observation that Bitcoin's price growth has been decelerating over time — early years saw exponential gains while recent years show more moderate growth. This creates a naturally flattening curve that models Bitcoin's diminishing returns as it matures." },
  { q: 'Why does the Bitcoin Rainbow Chart use a log scale?', a: "Bitcoin's price has grown from fractions of a cent to over $100,000 — a range spanning 8+ orders of magnitude. On a linear chart, the early price history would be invisible (a flat line near zero). The logarithmic scale compresses this range so that percentage moves look the same size regardless of the absolute price, making the entire history visible and meaningful." },
  { q: 'How far into the future can the Rainbow Chart predict?', a: "The Rainbow bands can be mathematically projected indefinitely into the future since they're based on a continuous formula. However, reliability decreases with projection distance. The chart on this page projects bands 2 years forward to show where valuation zones will be. These projections assume Bitcoin's long-term growth pattern continues, which is not guaranteed." },
];

const faqsTr = [
  { q: 'Bitcoin Gökkuşağı Grafiği nedir?', a: "Bitcoin Gökkuşağı Grafiği, Bitcoin'in fiyat tarihinin üzerine renkli bantlar çizmek için logaritmik regresyon kullanan uzun vadeli bir değerleme aracıdır. Her bant farklı bir değerleme bölgesini temsil eder; en altta 'Neredeyse Yangından Mal Kaçırır Gibi' (mavi) ile en üstte 'Maksimum Balon Bölgesi' (koyu kırmızı) arasında değişir. Yatırımcıların Bitcoin'in uzun vadeli büyüme trendine göre ucuz, adil değerde mi yoksa pahalı mı olduğunu hızlıca görmelerine yardımcı olur." },
  { q: 'Bitcoin şu anda aşırı değerli mi, değersiz mi?', a: "Bitcoin'in bugün hangi Gökkuşağı bandında işlem gördüğünü görmek için bu sayfadaki mevcut bölge göstergesini kontrol edin. Mavi ve yeşil bantlar düşük değerlemeyi, sarı bantlar adil değeri ve turuncu ile kırmızı bantlar aşırı değerlemeyi önerir. Gökkuşağı Grafiği'nin pek çok araçtan biri olduğunu ve yatırım kararları için tek başına kullanılmaması gerektiğini unutmayın." },
  { q: 'Bitcoin Gökkuşağı Grafiği ne kadar doğru?', a: "Gökkuşağı Grafiği tarihsel olarak Bitcoin'in uzun vadeli büyüme trendini iyi yakalamış ve döngü tepelerini ile diplerini bantları içinde doğru tespit etmiştir. Ancak geçmiş verilere uydurulan bir eğriye dayanır ve gelecekteki proyeksiyonlar uzadıkça güvenilirliği azalır. Genel bir kılavuz olarak kullanılmalı, kesin bir tahmin aracı olarak değil. Geçmişteki doğruluk gelecekteki doğruluğu garanti etmez." },
  { q: 'Bitcoin Gökkuşağı Grafiği nasıl hesaplanır?', a: 'Grafik, log₁₀(fiyat) = a × log₁₀(genesis\'ten bu yana geçen gün) + b logaritmik regresyon formülünü kullanır; genesis tarihi 3 Ocak 2009\'dur. Regresyon katsayıları (a = 5.84, b = -17.01) geçmiş Bitcoin fiyat verilerine uyarlanmıştır. Dokuz renkli bant, b parametresi yukarı ve aşağı kaydırılarak logaritmik grafikte paralel eğriler oluşturulmasıyla yaratılır.' },
  { q: 'Bitcoin Gökkuşağı Grafiği\'ndeki renkler ne anlama gelir?', a: 'Alttan üste: Mavi ("Neredeyse Yangından Mal Kaçırır Gibi") ve Camgöbeği ("AL!") aşırı düşük değerlemeyi önerir. Yeşil ("Biriktir") ve Limon Yeşili ("Hâlâ Ucuz") iyi alım fırsatlarını önerir. Sarı ("HODL!") adil değeri temsil eder. Kehribar ("Bu Bir Balon mu?") ve Turuncu ("FOMO Yoğunlaşıyor") dikkatli olmayı işaret eder. Kırmızı ("Sat. Cidden, SAT!") ve Koyu Kırmızı ("Maksimum Balon Bölgesi") aşırı yüksek değerlemeyi önerir.' },
  { q: "Gökkuşağı Grafiği Bitcoin'in fiyatını tahmin edebilir mi?", a: "Gökkuşağı Grafiği belirli fiyat hedeflerini tahmin etmez. Bitcoin'in mevcut fiyatının uzun vadeli logaritmik büyüme trendine göre nerede durduğunu anlamak için görsel bir çerçeve sağlar. İleriye dönük proyekte edilen bantlar, her değerleme bölgesinin gelecekte nerede olacağını gösterir; ancak gerçek fiyat bu bantların içinde veya dışında herhangi bir yerde olabilir." },
  { q: 'Gökkuşağı Grafiği\'ne göre Bitcoin\'i ne zaman almalıyım?', a: 'Tarihsel olarak en iyi alım fırsatları, Bitcoin\'in mavi, camgöbeği ve yeşil bantlarda (1-3 arası bantlar) işlem gördüğü dönemler olmuştur. Grafik, bu dönemlerde satın almanın en yüksek uzun vadeli getirileri sağladığını önerir. Ancak Bitcoin her zaman bu alt bantlara dönmeyebilir ve grafik karar alma sürecinde diğer analiz araçlarıyla birleştirilmelidir.' },
  { q: 'Bitcoin\'de logaritmik regresyon nedir?', a: "Logaritmik regresyon, logaritma fonksiyonunu kullanarak verilere eğri bir çizgi uyduran istatistiksel bir yöntemdir. Bitcoin için, Bitcoin'in fiyat büyümesinin zamanla yavaşladığı gözlemini yakalar — erken yıllar üstel kazançlar görürken son yıllar daha ılımlı büyüme gösterir. Bu, Bitcoin olgunlaştıkça azalan getirilerini modelleyen doğal olarak düzleşen bir eğri oluşturur." },
  { q: 'Bitcoin Gökkuşağı Grafiği neden logaritmik ölçek kullanır?', a: "Bitcoin'in fiyatı kuruşun altından 100.000 doların üzerine çıktı — 8'den fazla büyüklük sırası kapsayan bir aralık. Doğrusal bir grafikte, erken fiyat tarihi görünmez olurdu (sıfıra yakın düz bir çizgi). Logaritmik ölçek bu aralığı sıkıştırır, böylece yüzde hareketler mutlak fiyattan bağımsız olarak aynı boyutta görünür ve tüm tarih görünür ve anlamlı hale gelir." },
  { q: 'Gökkuşağı Grafiği geleceği ne kadar ileriye tahmin edebilir?', a: "Gökkuşağı bantları sürekli bir formüle dayandığından matematiksel olarak süresiz ileriye doğru projekteed edilebilir. Ancak projeksiyon mesafesi uzadıkça güvenilirlik azalır. Bu sayfadaki grafik, değerleme bölgelerinin nerede olacağını göstermek için bantları 2 yıl ileriye doğru projeksiyon yapar. Bu projeksiyonlar Bitcoin'in uzun vadeli büyüme örüntüsünün devam edeceğini varsayar ki bu garanti değildir." },
];

export const RainbowFAQSection: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="bg-card border border-border/20 rounded-2xl px-4 sm:px-6 data-[state=open]:bg-card/80 data-[state=open]:shadow-sm transition-all duration-200"
            >
              <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:text-primary py-4 text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
