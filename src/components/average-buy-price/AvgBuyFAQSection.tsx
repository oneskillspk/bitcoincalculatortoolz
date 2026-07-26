import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'How do I calculate my average Bitcoin buy price?', a: 'Divide your total amount spent across all purchases by the total BTC you hold. For example, if you spent $1,500 on 0.05 BTC and $1,800 on 0.03 BTC, your total spent is $3,300 for 0.08 BTC — giving you an average buy price of $41,250 per BTC. This is a weighted average that accounts for different purchase sizes.' },
  { q: "What's the difference between average cost and DCA?", a: "Dollar-cost averaging (DCA) is a strategy where you invest a fixed dollar amount at regular intervals. Your average cost is simply the result of all your purchases, whether they were made using DCA or not. DCA tends to produce a lower average cost over time because you automatically buy more BTC when prices are low and less when prices are high." },
  { q: 'Does buying more Bitcoin lower my average cost?', a: 'Only if you buy at a price below your current average. This is called "averaging down." If Bitcoin drops from $60,000 to $30,000 and you buy more at $30,000, your weighted average will decrease. However, buying at prices above your current average will increase it. The size of each purchase also matters — a larger purchase at a lower price will have a bigger impact.' },
  { q: 'Should I include exchange fees?', a: 'This calculator focuses on pure cost basis without fees for simplicity. If you want to factor in exchange trading fees, withdrawal fees, or network fees, use our Profit & Loss Calculator instead, which includes exchange fee presets for Binance, Coinbase, Kraken, and custom fee inputs.' },
  { q: 'How many purchases can I include?', a: 'You can add up to 20 separate purchase entries. Each row lets you input a different BTC amount and price per BTC. This covers most individual investors who have made multiple buys over time. If you have more than 20 purchases, consider combining buys made at similar prices into single entries.' },
  { q: 'What is a good average buy price for Bitcoin?', a: "There's no universal answer — it depends on when you started buying. Long-term holders who started accumulating before 2020 likely have averages under $20,000. More recent buyers might have averages between $30,000 and $60,000. What matters most is whether your average is below the current price (you're in profit) and your long-term conviction about Bitcoin's trajectory." },
  { q: 'How do I calculate my Bitcoin break even price?', a: "Bitcoin break even price = Total Amount Spent ÷ Total BTC Purchased. For example, if you spent $10,000 to buy 0.15 BTC across multiple purchases, your break even price is $66,667 per BTC. The calculator above tracks all your entries and shows this automatically." },
  { q: "How do I know if I'm ahead of the average Bitcoin holder?", a: "Compare your average buy price against the on-chain 'realized price' — the average cost basis of every coin currently on the network. As of late 2025 the realized price sits near $47,000 while BTC trades above $100,000, so anyone whose average is below ~$47,000 is 'ahead of the average holder' by that measure. Enter your lots above; if the result is under the current realized price band we display, you are in the top half of holders by cost basis." },
  { q: "I don't know my average Bitcoin purchase price — how do I find it?", a: "Export the full trade history from every exchange and wallet you have used (Coinbase, Binance, Kraken all provide a CSV under Reports or Tax Documents). Sum the total USD spent across all buys, then divide by the total BTC that ended up in your possession. Enter each buy in the calculator above and it does the weighted average for you. If some buys are missing, use the highest plausible price from that period as a conservative placeholder for tax purposes." },
];

const faqsTr = [
  { q: 'Ortalama Bitcoin alış fiyatımı nasıl hesaplarım?', a: 'Tüm alımlar için harcadığınız toplam tutarı elinizdeki toplam BTC\'ye bölün. Örneğin 0,05 BTC için 1.500 $ ve 0,03 BTC için 1.800 $ harcadıysanız, toplam 0,08 BTC için 3.300 $ harcamış olursunuz; bu size BTC başına 41.250 $ ortalama alış fiyatı verir. Bu, farklı alım büyüklüklerini hesaba katan ağırlıklı bir ortalamadır.' },
  { q: 'Ortalama maliyet ile DCA arasındaki fark nedir?', a: 'Dolar Maliyeti Ortalaması (DMA), düzenli aralıklarla sabit bir dolar tutarı yatırdığınız bir stratejidir. Ortalama maliyetiniz ise DMA ile yapılmış olsun ya da olmasın, tüm alımlarınızın basitçe sonucudur. DMA, fiyatlar düşükken otomatik olarak daha fazla BTC satın aldığınızdan ve fiyatlar yüksekken daha az satın aldığınızdan, zaman içinde daha düşük bir ortalama maliyet üretme eğilimindedir.' },
  { q: 'Daha fazla Bitcoin satın almak ortalama maliyetimi düşürür mü?', a: 'Yalnızca mevcut ortalamanızın altında bir fiyattan alım yaparsanız. Buna "aşağı ortalama" denir. Bitcoin 60.000 $\'dan 30.000 $\'a düşerse ve 30.000 $\'dan daha fazla alım yaparsanız, ağırlıklı ortalamanız düşer. Ancak mevcut ortalamanızın üzerindeki fiyatlardan alım yapmak bunu artırır. Her alımın büyüklüğü de önemlidir; daha düşük bir fiyattan yapılan daha büyük bir alımın etkisi daha fazla olacaktır.' },
  { q: 'Borsa ücretlerini dahil etmeli miyim?', a: 'Bu hesap makinesi sadelik amacıyla ücretsiz saf maliyet bazına odaklanır. Borsa işlem ücretlerini, çekim ücretlerini veya ağ ücretlerini hesaba katmak istiyorsanız, Binance, Coinbase, Kraken için borsa ücreti ön ayarları ve özel ücret girişleri içeren Kâr/Zarar Hesaplayıcımızı kullanın.' },
  { q: 'Kaç alımı dahil edebilirim?', a: '20 adet ayrı alım girişi ekleyebilirsiniz. Her satır farklı bir BTC miktarı ve BTC başına fiyat girmenize olanak tanır. Bu, zaman içinde birden fazla alım yapmış çoğu bireysel yatırımcıyı kapsar. 20\'den fazla alımınız varsa, benzer fiyatlardan yapılan alımları tek girişlerde birleştirmeyi düşünebilirsiniz.' },
  { q: 'Bitcoin için iyi bir ortalama alış fiyatı nedir?', a: 'Evrensel bir cevap yoktur; ne zaman alım yapmaya başladığınıza bağlıdır. 2020 öncesinde biriktirmeye başlayan uzun vadeli sahiplerin ortalamasının 20.000 $\'ın altında olması muhtemeldir. Daha yakın tarihli alıcıların ortalaması 30.000 ile 60.000 $ arasında olabilir. En önemli şey ortalamanızın güncel fiyatın altında olup olmadığı (kârdasınız) ve Bitcoin\'in seyrine dair uzun vadeli inancınızdır.' },
  { q: 'Bitcoin başabaş fiyatımı nasıl hesaplarım?', a: 'Bitcoin başabaş fiyatı = Harcanan Toplam Tutar ÷ Satın Alınan Toplam BTC. Örneğin birden fazla alımla 0,15 BTC için 10.000 $ harcadıysanız, başabaş fiyatınız BTC başına 66.667 $\'dır. Yukarıdaki hesap makinesi tüm girişlerinizi takip eder ve bunu otomatik olarak gösterir.' },
  { q: 'Ortalama Bitcoin sahibinin önünde miyim, nasıl anlarım?', a: 'Ortalama alış fiyatınızı zincir üstü "gerçekleşen fiyat" (realized price) ile karşılaştırın; bu, ağdaki her coin\'in mevcut ortalama maliyet bazıdır. 2025 sonu itibarıyla gerçekleşen fiyat yaklaşık 47.000 $ civarındayken BTC 100.000 $\'ın üzerinde işlem görüyor; yani ortalaması ~47.000 $\'ın altında olan herkes bu ölçüye göre "ortalama sahibin önünde"dir. Lotlarınızı yukarıya girin; sonuç gösterdiğimiz güncel gerçekleşen fiyat bandının altındaysa, maliyet bazı bakımından sahiplerin üst yarısındasınız.' },
  { q: 'Ortalama Bitcoin alış fiyatımı bilmiyorum, nasıl bulabilirim?', a: 'Kullandığınız her borsa ve cüzdanın tam işlem geçmişini dışa aktarın (Coinbase, Binance, Kraken hepsi Raporlar veya Vergi Belgeleri altında CSV sunar). Tüm alımlar için harcanan toplam USD\'yi toplayın, sonra elinize geçen toplam BTC\'ye bölün. Her alımı yukarıdaki hesap makinesine girin; ağırlıklı ortalamayı sizin için yapar. Bazı alımlar eksikse, muhafazakâr olmak için o dönemin makul en yüksek fiyatını yer tutucu olarak kullanın; bu vergi hesaplamasında kazancı olduğundan fazla göstermenizi sağlar.' },
];

export const AvgBuyFAQSection = () => {
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
              ? 'Bitcoin ortalama alış fiyatını hesaplama hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about calculating your Bitcoin average buy price'}
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

export const avgBuyFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en",
  mainEntity: faqsEn.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const avgBuyFaqSchemaTr = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "tr",
  mainEntity: faqsTr.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
