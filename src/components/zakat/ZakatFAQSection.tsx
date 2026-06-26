import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: 'Do I pay Zakat on Bitcoin?', a: 'Yes, according to the majority of contemporary Islamic scholars. Bitcoin is treated as a monetary asset or trade good subject to Zakat at 2.5% of its value at your Zakat date, provided your total wealth has exceeded the Nisab threshold for a full lunar year (Hawl). This ruling is supported by scholars including the Islamic Fiqh Academy and most Islamic finance bodies.' },
  { q: 'Is BTC haram in Islam?', a: 'The majority of contemporary Islamic scholars consider Bitcoin permissible (halal) to hold and trade, viewing it as a digital monetary asset. The primary concerns raised by scholars who restrict it are extreme price speculation, use in prohibited transactions, and lack of government backing. Simply holding Bitcoin as a store of value is widely considered permissible.' },
  { q: 'How much Zakat to pay on $100,000?', a: 'Zakat on $100,000 is $2,500 (2.5% × $100,000). In PKR at current rates (~₨279/USD): approximately ₨697,500. In INR at ~₹86.5/USD: approximately ₹216,250. This applies to Bitcoin, cash, gold, or any combination of zakatable assets totaling $100,000 net of debts.' },
  { q: 'What assets are not zakatable?', a: 'Non-zakatable assets include: your primary home, personal vehicle and household items for personal use, personal jewelry up to normal wear (disputed — Hanafi scholars say gold/silver jewelry IS zakatable), tools and equipment for your profession, and assets owned for less than one Hawl.' },
  { q: 'Is Zakat 2.5% of your savings?', a: 'Not exactly. Zakat is 2.5% of your total net zakatable wealth (savings + cash + gold + silver + Bitcoin + trade goods minus debts due within 12 months) — not just savings alone. Your primary home, car, and personal belongings are excluded.' },
  { q: 'Do you pay Zakat if you have a mortgage?', a: 'You may deduct the mortgage instalment due within the next 12 months from your zakatable wealth — not the full mortgage balance. For example, if you owe $200,000 but pay $12,000 per year, deduct $12,000. Your primary home itself is not a zakatable asset.' },
  { q: 'How much Zakat to pay on a 401k?', a: 'Opinions differ. Many scholars say Zakat is due on accessible retirement funds at 2.5% of current value if you can withdraw without penalty. Others say it applies only to the employer-matched portion. For tax-locked funds, some scholars suggest paying Zakat on a lump basis when withdrawn.' },
  { q: 'Is Zakat tax-deductible?', a: 'In the United States, Zakat paid to a qualifying 501(c)(3) charity may be tax-deductible as a charitable contribution. In the UK, Zakat to a registered charity may qualify for Gift Aid. In Pakistan and many Muslim-majority countries, Zakat deducted at source is exempt from income tax.' },
  { q: 'Is a car a zakatable asset?', a: 'A car used for personal transportation is NOT zakatable. A car used for business (e.g., a taxi) is considered a trade asset and may be zakatable. Investment in classic cars for resale would be zakatable as trade goods.' },
  { q: 'What if I have gold but no money to pay Zakat?', a: 'You may sell enough gold to pay the Zakat due, pay from other savings, or with the permission of a scholar, defer payment while making a firm intention to pay when funds are available. Some scholars allow paying in kind (giving gold directly).' },
  { q: 'Do stocks count as Zakat?', a: 'Yes, stocks are generally zakatable. The most common approach is 40% of stock value as a simplified estimate, or use the full Zakatable Assets Per Share method. For index funds and ETFs, 40% of total value is widely accepted.' },
  { q: 'Can I pay my Zakat monthly?', a: 'Yes. While Zakat technically becomes due on your Hawl anniversary date, many scholars permit distributing payments monthly — particularly during Ramadan. The full 2.5% must be paid by your Hawl anniversary. Paying in advance is also permitted.' },
  { q: 'What are common mistakes in calculating Zakat?', a: 'The most common mistakes are: (1) Using Gold Nisab when Silver Nisab applies — huge difference in 2026. (2) Forgetting Bitcoin and digital assets. (3) Deducting full mortgage instead of 12-month instalment. (4) Not accounting for Hawl. (5) Using outdated Nisab values.' },
];

const faqsTr = [
  { q: 'Bitcoin\'den Zekât ödemem gerekiyor mu?', a: 'Çoğunluk çağdaş İslam âlimlerine göre evet. Bitcoin, Zekât tarihinizdeki değerinin %2,5\'i üzerinden Zekâta tabi bir parasal varlık veya ticaret malı (māl) olarak değerlendirilmektedir; ancak toplam servetinizin tam bir ay takvimi yılı (Havl) boyunca Nisab eşiğini aşması gerekmektedir. Bu hüküm, İslam Fıkıh Akademisi ve çoğu İslam finans kurumu dahil pek çok âlim tarafından desteklenmektedir.' },
  { q: 'Bitcoin İslam\'da haram mı?', a: 'Çoğunluk çağdaş İslam âlimi, Bitcoin\'i dijital bir parasal varlık olarak değerlendirerek elde tutulmasının ve ticaretinin mubah (helal) olduğunu kabul etmektedir. Bitcoin\'i kısıtlayan âlimlerin öne sürdüğü başlıca endişeler; aşırı fiyat spekülasyonu, haram işlemlerde kullanım ve devlet güvencesinin olmamasıdır. Bitcoin\'i uzun vadeli bir değer saklama aracı olarak tutmak büyük ölçüde mubah sayılmaktadır.' },
  { q: '100.000 $ için ne kadar Zekât ödenir?', a: '100.000 $ üzerindeki Zekât 2.500 $\'dır (%2,5 × 100.000 $). Güncel kur üzerinden PKR\'de (~279 PKR/USD): yaklaşık 697.500 ₨. INR\'de (~86,5 INR/USD): yaklaşık 216.250 ₹. Bu oran, borçlar düşüldükten sonra toplam 100.000 $ tutarındaki Bitcoin, nakit, altın veya Zekâta tabi herhangi bir varlık kombinasyonu için geçerlidir.' },
  { q: 'Zekâta tabi olmayan varlıklar nelerdir?', a: 'Zekâta tabi olmayan varlıklar şunlardır: birincil eviniz, kişisel kullanım için araç ve ev eşyaları, normal kullanım kapsamındaki kişisel takılar (tartışmalı — Hanefi âlimler altın/gümüş takıların Zekâta tabi olduğunu söyler), mesleğiniz için kullandığınız alet-ekipman ve bir Havl\'den az süredir sahip olduğunuz varlıklar.' },
  { q: 'Zekât tasarruflarınızın %2,5\'i midir?', a: 'Tam olarak değil. Zekât, toplam net Zekât matrahınızın %2,5\'idir (tasarruf + nakit + altın + gümüş + Bitcoin + ticaret malı eksi önümüzdeki 12 ayda vadesi gelen borçlar) — yalnızca tasarrufların değil. Birincil eviniz, arabanız ve kişisel eşyalarınız bu hesaba dahil edilmez.' },
  { q: 'İpotek borcunuz varsa Zekât öder misiniz?', a: 'Önümüzdeki 12 ay içinde vadesi gelen ipotek taksitini Zekât matrahınızdan düşebilirsiniz — toplam ipotek bakiyesini değil. Örneğin, 200.000 $ borçlu olup yıllık 12.000 $ ödüyorsanız 12.000 $ düşün. Birincil evinizin kendisi Zekâta tabi bir varlık değildir.' },
  { q: '401k için ne kadar Zekât ödenir?', a: 'Görüşler farklıdır. Pek çok âlim, ceza ödemeden çekilebilen emeklilik fonlarının mevcut değerinin %2,5\'i üzerinden Zekât vacip olduğunu söyler. Bazıları yalnızca işveren katkı payı için geçerli olduğunu savunur. Vergi kilidi uygulanan fonlar için bazı âlimler, çekildiğinde toplu ödeme yapılmasını önermektedir.' },
  { q: 'Zekât vergiden düşülebilir mi?', a: 'ABD\'de, nitelikli bir 501(c)(3) kuruluşuna yapılan Zekât ödemesi hayır amaçlı bağış olarak vergiden düşülebilir. İngiltere\'de kayıtlı bir vakfa yapılan Zekât, Gift Aid kapsamına alınabilir. Pakistan ve pek çok Müslüman çoğunluklu ülkede kaynakta kesilen Zekât, gelir vergisinden muaftır.' },
  { q: 'Araba Zekâta tabi bir varlık mıdır?', a: 'Kişisel ulaşım için kullanılan araba Zekâta tabi DEĞİLDİR. Ticari amaçla kullanılan araba (örn. taksi) ticari bir varlık sayılır ve Zekâta tabi olabilir. Yeniden satış amacıyla klasik arabalara yapılan yatırım, ticaret malı olarak Zekâta tabidir.' },
  { q: 'Altınum var ama Zekât ödeyecek param yok ne yapmalıyım?', a: 'Vacip olan Zekâtı ödemek için yeterince altın satabilir, diğer tasarruflarınızdan ödeyebilir ya da âlim izniyle, imkân bulunduğunda ödeme niyetiyle erteleyebilirsiniz. Bazı âlimler ayni ödemeye (altının doğrudan verilmesine) izin vermektedir.' },
  { q: 'Hisse senetleri Zekâta dahil midir?', a: 'Evet, hisse senetleri genellikle Zekâta tabidir. En yaygın yaklaşım, basitleştirilmiş bir tahmin olarak hisse değerinin %40\'ı ya da Hisse Başına Zekâta Tabi Varlıklar yöntemidir. Endeks fonları ve ETF\'ler için toplam değerin %40\'ı geniş ölçüde kabul görmektedir.' },
  { q: 'Zekâtımı aylık ödeyebilir miyim?', a: 'Evet. Zekât teknik olarak Havl yıl dönümünde vacip olsa da pek çok âlim aylık — özellikle Ramazan\'da — taksitli ödemeye izin vermektedir. Tam %2,5 oranının Havl yıl dönümüne kadar ödenmesi gerekmektedir. Peşin ödeme de caizdir.' },
  { q: 'Zekât hesaplamada yaygın hatalar nelerdir?', a: 'En yaygın hatalar şunlardır: (1) Gümüş Nisabı uygulanması gerekirken Altın Nisabını kullanmak — 2026\'da büyük fark var. (2) Bitcoin ve dijital varlıkları unutmak. (3) Yalnızca 12 aylık taksit yerine tüm ipotek bakiyesini düşmek. (4) Havl\'i hesaba katmamak. (5) Güncel olmayan Nisab değerleri kullanmak.' },
];

type FaqSchemaEntry = { '@type': 'Question'; name: string; acceptedAnswer: { '@type': 'Answer'; text: string } };
const toSchema = (list: Array<{ q: string; a: string }>): FaqSchemaEntry[] =>
  list.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }));

export const zakatFaqSchemaDataEn: FaqSchemaEntry[] = toSchema(faqsEn);
export const zakatFaqSchemaDataTr: FaqSchemaEntry[] = toSchema(faqsTr);
/** @deprecated Use zakatFaqSchemaDataEn / zakatFaqSchemaDataTr. */
const zakatFaqSchemaData = zakatFaqSchemaDataEn;

export const ZakatFAQSection = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/30 mb-4">
              <HelpCircle className="w-4 h-4" />
              {tr ? 'SSS' : 'FAQ'}
            </div>
            <h2 className="text-h2 font-bold text-foreground mb-3">
              {tr ? 'Bitcoin Zekâtı Sorularına Yanıtlar' : 'Bitcoin Zakat Questions Answered'}
            </h2>
            <p className="text-muted-foreground">
              {tr
                ? 'Bitcoin ve kripto para üzerindeki İslami Zekât yükümlülüklerine dair sık sorulan sorular'
                : 'Common questions about Islamic Zakat obligations on Bitcoin and cryptocurrency'}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border-border/50 rounded-xl px-5">
                <AccordionTrigger className="text-left text-foreground font-medium text-sm hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
