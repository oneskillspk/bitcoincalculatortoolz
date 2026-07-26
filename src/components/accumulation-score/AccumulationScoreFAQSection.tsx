import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is the Bitcoin Accumulation Score?", a: "The Bitcoin Accumulation Score is a letter grade (A+ to F) that measures your current Bitcoin holdings against an age-adjusted benchmark. It uses the Bitcoin Lifecycle Model — a Power Law appreciation curve multiplied by a typical lifecycle income bell curve — to calculate how much BTC you should ideally have accumulated by your current age." },
  { q: "How is the Bitcoin accumulation grade calculated?", a: "Your grade is based on the ratio of your actual BTC holdings to the model's target for your age. A+ = 150%+ of target (elite), A = 110–150% (ahead), B+ = 90–110% (on track), B = 75–90% (almost there), C = 50–75% (room to grow), D = 25–50% (getting started), F = below 25% (start stacking)." },
  { q: "How much Bitcoin should an 18-year-old have?", a: "According to the Bitcoin Lifecycle Model, an 18-year-old in the 'Young Adult' phase should have approximately 0.102 BTC. At this age, the time advantage is enormous — even small regular purchases compound dramatically over decades." },
  { q: "How much Bitcoin should a 25-year-old have?", a: "A 25-year-old in the 'Prime Accumulator' phase has a target of approximately 2.45 BTC. This is the quarter-century mark where career income is growing and the compound time advantage remains very strong." },
  { q: "How much Bitcoin should a 30-year-old have?", a: "A 30-year-old in the 'Peak Builder' phase has a target of approximately 13.59 BTC. This is a critical benchmark — income is at career-level, and accumulation velocity should be accelerating toward the 40-year peak." },
  { q: "How much Bitcoin should a 35-year-old have?", a: "A 35-year-old should have approximately 47.56 BTC according to the lifecycle model. This is halfway to the peak accumulation target at age 40 (144 BTC) and represents the top earning decade." },
  { q: "How much Bitcoin should a 40-year-old have?", a: "Age 40 is the peak of the Bitcoin Lifecycle Model with a target of approximately 144 BTC. This represents maximum lifetime accumulation — the intersection of peak earning power and sufficient time having been in the Bitcoin market." },
  { q: "Is it too late to buy Bitcoin at 45 or 50?", a: "No. While the lifecycle model shows declining targets after 40 (reflecting natural spending), it's never too late to start. A consistent DCA strategy at any age builds wealth. The key is starting — even small amounts compound over time. Use the DCA Calculator to model your strategy." },
  { q: "How is this different from the Bitcoin Retirement Calculator?", a: "The Retirement Calculator answers 'When can I retire on Bitcoin?' — it's forward-looking with complex inputs like retirement age, spending, and income. The Accumulation Score answers 'What grade is my stack right now?' — it's present-tense with just two inputs (age + BTC). The Retirement Calculator plans your future; the Accumulation Score grades your present." },
  { q: "What is the average age of a Bitcoin holder?", a: "According to on-chain data and survey research, the average Bitcoin holder is approximately 38 years old, with the median age around 34. Bitcoin adoption skews toward the 25–44 age demographic, though adoption among older demographics has grown significantly since the introduction of spot Bitcoin ETFs." },
  { q: "Should a 70-year-old invest in Bitcoin?", a: "The lifecycle model suggests a 70-year-old would have approximately 45 BTC in an ideal accumulation path — but this reflects a lifetime of accumulation, not a starting point. For someone new to Bitcoin at 70, a small allocation (1–5% of portfolio) can provide inflation hedging. Consult our Retirement Calculator for detailed planning." },
  { q: "Is my data private when using this calculator?", a: "Yes. All calculations happen entirely in your browser. We never see, store, or transmit your age or Bitcoin holdings. No account, signup, or personal data is required. Your privacy is our top priority." },
  { q: "How do I know if I'm behind on Bitcoin accumulation?", a: "You are behind if your current stack is under 75% of the age-adjusted lifecycle target — a B grade or lower. For example, a 30-year-old holding under 10.2 BTC is trailing the model's 13.59 BTC benchmark. The DCA catch-up panel above shows the exact weekly $ needed to reach an A grade by age 40." },
];

const faqsTr = [
  { q: "Bitcoin Birikim Skoru nedir?", a: "Bitcoin Birikim Skoru, mevcut Bitcoin varlıklarınızı yaşa uyarlanmış bir kıyasla ölçen bir harf notudur (A+'dan F'ye). Mevcut yaşınıza kadar idealin BTC birikimini hesaplamak için Bitcoin Yaşam Döngüsü Modelini kullanır — Güç Yasası değer artış eğrisi ile tipik yaşam döngüsü gelir çan eğrisinin çarpımı." },
  { q: "Bitcoin birikim notu nasıl hesaplanır?", a: "Notunuz, gerçek BTC varlıklarınızın yaşınız için modelin hedefine oranına dayanır. A+ = hedefin %150+'si (seçkin), A = %110–150 (önde), B+ = %90–110 (yolda), B = %75–90 (neredeyse orada), C = %50–75 (büyüme payı var), D = %25–50 (başlangıç aşaması), F = %25'in altında (biriktirmeye başla)." },
  { q: "18 yaşında ne kadar Bitcoin sahibi olunmalıdır?", a: "Bitcoin Yaşam Döngüsü Modeline göre, 'Genç Yetişkin' aşamasındaki 18 yaşındaki birinin yaklaşık 0.102 BTC'ye sahip olması beklenir. Bu yaşta zaman avantajı muazzamdır — küçük düzenli alımlar bile onlarca yıl boyunca dramatik şekilde bileşik faiz yapar." },
  { q: "25 yaşında ne kadar Bitcoin sahibi olunmalıdır?", a: "'Prime Birikim' aşamasındaki 25 yaşındaki birinin hedefi yaklaşık 2.45 BTC'dir. Bu, kariyer gelirinin büyüdüğü ve bileşik zaman avantajının hâlâ çok güçlü olduğu çeyrek yüzyıl dönüm noktasıdır." },
  { q: "30 yaşında ne kadar Bitcoin sahibi olunmalıdır?", a: "'Zirve Oluşturucu' aşamasındaki 30 yaşındaki birinin hedefi yaklaşık 13.59 BTC'dir. Bu kritik bir kilometre taşıdır — gelir kariyer düzeyindedir ve birikim hızının 40 yaş zirvesine doğru ivme kazanması gerekir." },
  { q: "35 yaşında ne kadar Bitcoin sahibi olunmalıdır?", a: "Yaşam döngüsü modeline göre 35 yaşındaki birinin yaklaşık 47.56 BTC'ye sahip olması gerekir. Bu, 40 yaşındaki zirve birikim hedefinin (144 BTC) yarısında olup en yüksek kazanç on yılını temsil eder." },
  { q: "40 yaşında ne kadar Bitcoin sahibi olunmalıdır?", a: "40 yaş, Bitcoin Yaşam Döngüsü Modelinin zirvesidir ve hedef yaklaşık 144 BTC'dir. Bu, maksimum yaşam boyu birikimi temsil eder — zirve kazanç gücü ile Bitcoin piyasasında yeterli süredir bulunmanın kesişimi." },
  { q: "45 veya 50 yaşında Bitcoin satın almak için çok geç mi?", a: "Hayır. Yaşam döngüsü modeli 40'tan sonra azalan hedefler gösterse de (doğal harcamaları yansıtarak) başlamak için hiçbir zaman geç değildir. Herhangi bir yaşta tutarlı bir DCA stratejisi servet inşa eder. Önemli olan başlamaktır — küçük miktarlar bile zamanla bileşik faiz yapar." },
  { q: "Bu, Bitcoin Emeklilik Hesaplayıcısı'ndan nasıl farklıdır?", a: "Emeklilik Hesaplayıcısı 'Bitcoin ile ne zaman emekli olabilirim?' sorusunu yanıtlar — emeklilik yaşı, harcama ve gelir gibi karmaşık girdilerle ileriye dönüktür. Birikim Skoru 'Yığınım şu anda ne notu alıyor?' sorusunu yanıtlar — yalnızca iki giriş (yaş + BTC) ile şimdiki zamana yöneliktir. Emeklilik Hesaplayıcısı geleceğinizi planlar; Birikim Skoru şimdiki durumunuzu notlandırır." },
  { q: "Bitcoin sahibinin ortalama yaşı nedir?", a: "Zincir üstü veriler ve anket araştırmalarına göre, ortalama Bitcoin sahibi yaklaşık 38 yaşındadır ve medyan yaş 34 civarındadır. Bitcoin benimsenimi 25–44 yaş demografisine doğru eğimlidir, ancak spot Bitcoin ETF'lerinin tanıtılmasından bu yana yaşlı demografiler arasındaki benimseme önemli ölçüde artmıştır." },
  { q: "70 yaşındaki biri Bitcoin'e yatırım yapmalı mı?", a: "Yaşam döngüsü modeli, 70 yaşındaki birinin ideal bir birikim yolunda yaklaşık 45 BTC'ye sahip olacağını önerir — ancak bu, bir başlangıç noktasını değil, bir yaşam boyu birikimi yansıtır. 70'inde Bitcoin'e yeni başlayan biri için küçük bir tahsis (%1–5) enflasyon koruması sağlayabilir. Ayrıntılı planlama için Emeklilik Hesaplayıcımıza başvurun." },
  { q: "Bu hesaplayıcıyı kullanırken verilerim gizli mi?", a: "Evet. Tüm hesaplamalar tamamen tarayıcınızda gerçekleşir. Yaşınızı veya Bitcoin varlıklarınızı asla görmez, depolamaz veya iletmeyiz. Hesap, kayıt veya kişisel veri gerekmez. Gizliliğiniz en öncelikli konumuzdur." },
];

export const accumulationScoreFaqSchemaData = faqsEn.map(f => ({
  "@type": "Question",
  "name": f.q,
  "acceptedAnswer": { "@type": "Answer", "text": f.a }
}));

export const AccumulationScoreFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/30 mb-4">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold text-foreground">
            {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-muted-foreground mt-3">
            {tr
              ? 'Bitcoin Birikim Skoru hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about the Bitcoin Accumulation Score'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
