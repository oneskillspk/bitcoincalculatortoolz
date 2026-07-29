import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: 'What is leverage trading in Bitcoin?', answer: 'Leverage trading allows you to control a larger position than your initial investment by borrowing funds. For example, with 10x leverage and $1,000 margin, you control a $10,000 position. While this amplifies potential profits, it equally amplifies potential losses.' },
  { question: 'How is the liquidation price on a leveraged Bitcoin position calculated?', answer: 'For long positions: Liquidation Price = Entry Price × (1 - 1/Leverage + Maintenance Margin). For short positions: Liquidation Price = Entry Price × (1 + 1/Leverage - Maintenance Margin). When the market price reaches your liquidation price, the exchange automatically closes your position to prevent further losses.' },
  { question: 'What is maintenance margin and why does it matter?', answer: 'Maintenance margin is the minimum equity percentage you must maintain in your position (typically 0.5% - 1%). When your position value drops to this level, you receive a margin call or face liquidation. Different exchanges have different maintenance margin requirements.' },
  { question: "What's the difference between isolated and cross margin?", answer: 'Isolated margin limits your risk to the margin allocated to that specific position - only that amount can be liquidated. Cross margin uses your entire account balance as collateral, which provides more buffer before liquidation but puts your whole account at risk.' },
  { question: 'How does leverage affect my profit and loss?', answer: 'Leverage multiplies both gains and losses proportionally. With 10x leverage, a 5% price increase means 50% profit on your margin, but a 5% decrease means 50% loss. Higher leverage means smaller price movements can result in liquidation.' },
  { question: 'What is the maximum safe leverage for Bitcoin trading?', answer: 'Most experienced traders recommend 2x-5x leverage for Bitcoin due to its volatility. Higher leverage (20x+) significantly increases liquidation risk. Many beginners get liquidated using excessive leverage. Start low and only increase as you gain experience.' },
  { question: 'How can I avoid getting liquidated?', answer: 'Key strategies include: 1) Use lower leverage (2x-5x), 2) Set stop-loss orders above your liquidation price, 3) Monitor your margin ratio regularly, 4) Keep extra margin in your account, 5) Avoid overleveraging during high volatility, 6) Never invest more than you can afford to lose.' },
  { question: 'What happens when I get liquidated?', answer: 'When liquidated, the exchange forcefully closes your position at the current market price. You lose your entire margin (collateral) for that position. Some exchanges charge additional liquidation fees. The position is closed automatically - you cannot wait for price recovery.' },
  { question: 'How do I calculate Bitcoin leverage liquidation price?', answer: 'Enter your entry price, leverage multiplier, and position size in our Bitcoin liquidation calculator to find your exact liquidation price before you open a trade. The formula accounts for maintenance margin requirements specific to each exchange.' },
  { question: 'What is a crypto leverage calculator?', answer: 'A crypto leverage calculator shows your liquidation price, required margin, and maximum loss for leveraged Bitcoin positions — essential before opening any trade. Our tool supports presets for major exchanges including Binance, Bybit, and OKX.' },
];

const faqsTr = [
  { question: 'Bitcoin kaldıraçlı işlem nedir?', answer: 'Kaldıraçlı işlem, fon borçlanarak başlangıç yatırımınızdan daha büyük bir pozisyonu kontrol etmenizi sağlar. Örneğin 10x kaldıraç ve 1.000 $ marjla 10.000 $ pozisyonu kontrol edersiniz. Bu, potansiyel kârları ampliye ederken potansiyel zararları da eşit ölçüde artırır.' },
  { question: 'Kaldıraçlı Bitcoin pozisyonunda tasfiye fiyatı nasıl hesaplanır?', answer: 'Long pozisyonlar için: Tasfiye Fiyatı = Giriş Fiyatı × (1 - 1/Kaldıraç + Bakım Marjı). Short pozisyonlar için: Tasfiye Fiyatı = Giriş Fiyatı × (1 + 1/Kaldıraç - Bakım Marjı). Piyasa fiyatı tasfiye fiyatınıza ulaştığında, borsa daha fazla kayıpları önlemek için pozisyonunuzu otomatik olarak kapatır.' },
  { question: 'Bakım marjı nedir ve neden önemlidir?', answer: 'Bakım marjı, pozisyonunuzda sürdürmeniz gereken minimum öz sermaye yüzdesidir (genellikle %0,5 - %1). Pozisyon değeriniz bu seviyeye düştüğünde, marj çağrısı alır veya tasfiye ile karşı karşıya kalırsınız. Farklı borsaların farklı bakım marjı gereksinimleri vardır.' },
  { question: 'İzole ve çapraz marj arasındaki fark nedir?', answer: 'İzole marj, riskinizi o belirli pozisyona tahsis edilen marjla sınırlar — yalnızca bu tutar tasfiye edilebilir. Çapraz marj, tüm hesap bakiyenizi teminat olarak kullanır; bu tasfiyeden önce daha fazla tampon sağlar, ancak tüm hesabınızı riske atar.' },
  { question: 'Kaldıraç kâr ve zararımı nasıl etkiler?', answer: 'Kaldıraç, kazançları ve zararları orantılı olarak çarpar. 10x kaldıraçla %5 fiyat artışı, marjınızda %50 kâr anlamına gelir, ancak %5 düşüş %50 zarar demektir. Daha yüksek kaldıraç, daha küçük fiyat hareketlerinin tasfiyelere yol açabileceği anlamına gelir.' },
  { question: 'Bitcoin işlemleri için maksimum güvenli kaldıraç nedir?', answer: 'Deneyimli yatırımcıların çoğu, Bitcoin\'in volatilitesi nedeniyle 2x-5x kaldıraç önerir. Daha yüksek kaldıraç (20x+) tasfiye riskini önemli ölçüde artırır. Pek çok başlangıç seviyesi yatırımcı aşırı kaldıraç kullanarak tasfiye edilmektedir. Düşükten başlayın ve yalnızca deneyim kazandıkça artırın.' },
  { question: 'Tasfiye edilmekten nasıl kaçınabilirim?', answer: 'Temel stratejiler şunlardır: 1) Daha düşük kaldıraç kullanın (2x-5x), 2) Tasfiye fiyatınızın üzerinde stop-loss emirleri belirleyin, 3) Marj oranınızı düzenli olarak izleyin, 4) Hesabınızda ekstra marj bulundurun, 5) Yüksek volatilite dönemlerinde aşırı kaldıraçtan kaçının, 6) Kaybetmeyi göze alamayacağınızdan fazlasını asla yatırmayın.' },
  { question: 'Tasfiye edildiğimde ne olur?', answer: 'Tasfiye edildiğinde borsa, mevcut piyasa fiyatında pozisyonunuzu zorla kapatır. O pozisyon için tüm marjınızı (teminatı) kaybedersiniz. Bazı borsalar ek tasfiye ücretleri talep eder. Pozisyon otomatik olarak kapatılır — fiyat toparlanmasını bekleyemezsiniz.' },
  { question: 'Bitcoin kaldıraç tasfiye fiyatını nasıl hesaplarım?', answer: 'İşlem açmadan önce tam tasfiye fiyatınızı bulmak için Bitcoin tasfiye hesaplayıcımıza giriş fiyatınızı, kaldıraç çarpanınızı ve pozisyon büyüklüğünüzü girin. Formül, her borsaya özgü bakım marjı gereksinimlerini hesaba katar.' },
  { question: 'Kripto kaldıraç hesaplayıcısı nedir?', answer: 'Kripto kaldıraç hesaplayıcısı, kaldıraçlı Bitcoin pozisyonları için tasfiye fiyatınızı, gerekli marjı ve maksimum zararı gösterir — herhangi bir işlem açmadan önce zorunludur. Aracımız Binance, Bybit ve OKX dahil büyük borsalar için ön ayarları destekler.' },
];

export const LeverageFAQSection = () => {
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
              ? 'Kaldıraçlı işlem ve tasfiye riskleri hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about leverage trading and liquidation risks'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
              <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
