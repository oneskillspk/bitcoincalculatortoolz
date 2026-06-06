import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeInternalHtml } from '@/utils/localizeHtml';

const faqsEn = [
  { question: 'How much Bitcoin can I buy with $100 per month?', answer: 'At a Bitcoin price of $100,000, $100 per month buys you approximately 100,000 satoshis (0.001 BTC). Over one year, that\'s about 1.2 million sats. Use our calculator to see exactly how much you\'d accumulate at the current live price with different growth assumptions.' },
  { question: 'Is saving in Bitcoin better than a savings account?', answer: 'Bitcoin has historically outperformed traditional savings accounts over 4+ year periods, but it comes with significantly higher volatility and no FDIC insurance. A savings account offers guaranteed returns and deposit protection. Our comparison panel shows both outcomes side-by-side so you can make an informed decision based on your risk tolerance.' },
  { question: 'How much of my paycheck should I invest in Bitcoin?', answer: 'Financial advisors generally suggest investing only what you can afford to lose, typically 1-10% of your income for volatile assets like Bitcoin. Our calculator lets you model any percentage to see projected outcomes. Start small (1-3%) and increase as you become more comfortable.' },
  { question: 'What is a Bitcoin savings plan?', answer: 'A Bitcoin savings plan is a strategy of regularly purchasing Bitcoin at set intervals — daily, weekly, or monthly — regardless of price. This approach, also known as dollar-cost averaging (DCA), reduces the impact of volatility by spreading purchases over time. Our calculator helps you plan how much to save and what you\'ll accumulate.' },
  { question: 'How many satoshis can I buy with $50?', answer: 'The number of satoshis you get for $50 depends on Bitcoin\'s current price. At $100,000 per BTC, $50 buys you 50,000 sats. At $50,000 per BTC, the same $50 gets you 100,000 sats. Our calculator shows this in real-time using the live Bitcoin price.' },
  { question: 'Can I save small amounts in Bitcoin?', answer: 'Absolutely! Bitcoin is divisible into 100 million satoshis, so you can buy fractions as small as a few cents. Many people save $25-50 per week. The key advantage of our calculator is showing how small, consistent amounts compound into meaningful holdings over time.' },
  { question: 'How long does it take to save 1 Bitcoin?', answer: 'That depends on your savings rate and Bitcoin\'s price. At $100/month with Bitcoin at $100,000 and no price growth, it would take about 83 years. However, with a 25% annual growth rate, the timeline shortens dramatically as your earlier purchases gain value. Our milestones tracker shows exactly when you\'d reach 1 BTC.' },
  { question: 'What is the best frequency to buy Bitcoin?', answer: 'Research shows that buying frequency matters less than consistency. Weekly, biweekly, or monthly purchases all perform similarly over long periods. The most important factor is sticking to your plan. Choose a frequency that matches your pay schedule. For detailed DCA analysis, try our <a href="/calculators/dca" class="text-primary hover:underline">DCA Calculator</a>.' },
  { question: 'Does Bitcoin savings earn interest?', answer: 'Bitcoin itself does not earn interest like a savings account. Your returns come from price appreciation — Bitcoin\'s value increasing over time. Some platforms offer "yield" on Bitcoin deposits, but these carry significant counterparty risk. Our calculator models returns based on price growth, not interest.' },
  { question: 'How do I start a Bitcoin savings plan?', answer: 'Step 1: Decide how much you can save regularly (use our calculator to model different amounts). Step 2: Choose a reputable exchange that supports recurring purchases (Coinbase, Swan Bitcoin, River Financial, etc.). Step 3: Set up automatic recurring buys matching your pay schedule. Step 4: Consider self-custody once your holdings grow. Start with our <a href="/calculators/stack-sats" class="text-primary hover:underline">Stack Sats Calculator</a> to set a specific BTC goal.' },
];

const faqsTr = [
  { question: 'Ayda 100 $ ile ne kadar Bitcoin alabilirim?', answer: 'Bitcoin fiyatı 100.000 $ olduğunda, aylık 100 $ size yaklaşık 100.000 satoshi (0,001 BTC) alır. Bir yılda bu yaklaşık 1,2 milyon satoshi eder. Farklı büyüme varsayımlarıyla canlı fiyatı kullanarak tam olarak ne biriktirebileceğinizi görmek için hesap makinemizi kullanın.' },
  { question: 'Bitcoin\'de tasarruf etmek tasarruf hesabından daha iyi mi?', answer: 'Bitcoin, 4 yılı aşan sürelerde tarihsel olarak geleneksel tasarruf hesaplarını geride bırakmıştır; ancak çok daha yüksek volatilite içerir ve FDIC sigortası sunmaz. Tasarruf hesabı garantili getiri ve mevduat güvencesi sağlar. Karşılaştırma panelimiz her iki sonucu yan yana göstererek risk toleransınıza göre bilinçli bir karar almanıza yardımcı olur.' },
  { question: 'Maaşımın ne kadarını Bitcoin\'e yatırmalıyım?', answer: 'Finansal danışmanlar genellikle yalnızca kaybetmeyi göze alabileceğiniz miktarı yatırmanızı önerir; Bitcoin gibi volatil varlıklar için bu tipik olarak gelirinizin %1-10\'udur. Hesap makinemiz tahmini sonuçları görmek için herhangi bir yüzdeyi modellemek için kullanabilirsiniz. Küçük başlayın (%1-3) ve rahatladıkça artırın.' },
  { question: 'Bitcoin tasarruf planı nedir?', answer: 'Bitcoin tasarruf planı, fiyattan bağımsız olarak belirli aralıklarla (günlük, haftalık veya aylık) düzenli Bitcoin alımı stratejisidir. Dolar maliyet ortalaması (DMA) olarak da bilinen bu yaklaşım, satın almaları zamana yayarak volatilitenin etkisini azaltır. Hesap makinemiz ne kadar tasarruf edeceğinizi ve ne biriktirebileceğinizi planlamanıza yardımcı olur.' },
  { question: '50 $ ile kaç satoshi alabilirim?', answer: '50 $ için alacağınız satoshi sayısı Bitcoin\'in güncel fiyatına bağlıdır. BTC başına 100.000 $\'da, 50 $ size 50.000 satoshi alır. BTC başına 50.000 $\'da aynı 50 $ 100.000 satoshi eder. Hesap makinemiz bunu canlı Bitcoin fiyatını kullanarak gerçek zamanlı gösterir.' },
  { question: 'Küçük miktarlarda Bitcoin tasarrufu yapabilir miyim?', answer: 'Kesinlikle! Bitcoin, satoshi adı verilen 100 milyon birime bölünebilir; bu nedenle birkaç sent değerinde kesir satın alabilirsiniz. Pek çok kişi haftada 25-50 $ tasarruf eder. Hesap makinemizin temel avantajı, küçük ve tutarlı miktarların zaman içinde nasıl anlamlı birikimler oluşturabileceğini göstermesidir.' },
  { question: '1 Bitcoin biriktirmek ne kadar sürer?', answer: 'Bu, tasarruf oranınıza ve Bitcoin\'in fiyatına bağlıdır. Bitcoin 100.000 $\'dayken aylık 100 $ ile ve fiyat artışı olmadan bu yaklaşık 83 yıl sürer. Ancak yıllık %25\'lik büyüme oranıyla, önceki alımlarınız değer kazandıkça süre dramatik biçimde kısalır. Kilometre taşı takipçimiz 1 BTC\'ye tam olarak ne zaman ulaşacağınızı gösterir.' },
  { question: 'Bitcoin almak için en iyi sıklık nedir?', answer: 'Araştırmalar, alım sıklığından çok tutarlılığın önemli olduğunu göstermektedir. Haftalık, iki haftada bir veya aylık alımlar uzun dönemde benzer performans sergiler. En önemli faktör planınıza sadık kalmaktır. Maaş takviminize uyan bir sıklık seçin. Ayrıntılı DMA analizi için <a href="/calculators/dca" class="text-primary hover:underline">DMA Hesaplayıcımızı</a> deneyin.' },
  { question: 'Bitcoin tasarrufu faiz kazandırır mı?', answer: 'Bitcoin\'in kendisi tasarruf hesabı gibi faiz kazandırmaz. Getirileriniz fiyat artışından, yani Bitcoin\'in değerinin zaman içinde artmasından gelir. Bazı platformlar Bitcoin mevduatı üzerinde "getiri" sunar; ancak bunlar önemli karşı taraf riski taşır. Hesap makinemiz getirileri faiz değil fiyat artışına göre modellemektedir.' },
  { question: 'Bitcoin tasarruf planına nasıl başlarım?', answer: 'Adım 1: Ne kadar düzenli tasarruf edebileceğinize karar verin (farklı miktarları modellemek için hesap makinemizi kullanın). Adım 2: Tekrar eden alımları destekleyen güvenilir bir borsa seçin (Coinbase, Swan Bitcoin, River Financial vb.). Adım 3: Maaş takviminize uyan otomatik tekrar eden alımlar ayarlayın. Adım 4: Varlıklarınız büyüdükçe öz saklama seçeneğini düşünün. Belirli bir BTC hedefi belirlemek için <a href="/calculators/stack-sats" class="text-primary hover:underline">Satoshi Biriktirme Hesaplayıcımızla</a> başlayın.' },
];

export const SavingsFAQSection = () => {
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
              ? 'Bitcoin tasarruf planınızı oluşturmak hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about planning your Bitcoin savings'}
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
