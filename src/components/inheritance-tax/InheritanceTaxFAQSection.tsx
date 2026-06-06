import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: 'How is inherited Bitcoin taxed in the United States?', answer: 'Inherited Bitcoin receives a "stepped-up" cost basis equal to the fair market value on the date the original owner passed away. This means you only owe capital gains tax on the appreciation from the date of death to the date you sell — not from the original purchase price. This can result in massive tax savings.' },
  { question: 'What is the step-up in basis for inherited crypto?', answer: 'The step-up in basis resets your cost basis to the fair market value at the time of death. For example, if someone bought 1 BTC for $500 and it was worth $65,000 when they passed away, your cost basis becomes $65,000 — not $500. If you sell at $70,000, you only owe tax on the $5,000 gain.' },
  { question: 'Do I owe estate tax on inherited Bitcoin?', answer: 'Federal estate tax only applies if the total estate exceeds the exemption threshold ($13.61 million per individual in 2026, or $27.22 million for married couples with portability). Most estates are below this threshold and owe zero federal estate tax. However, some states have much lower exemptions.' },
  { question: 'Which states have their own estate or inheritance tax?', answer: 'As of 2026, 13 states and DC have estate taxes with exemptions as low as $1 million (Oregon, Massachusetts). Six states (Iowa, Kentucky, Maryland, Nebraska, New Jersey, Pennsylvania) also have separate inheritance taxes. Check your state for specific rules.' },
  { question: "What happens if I inherit Bitcoin and don't sell it?", answer: "If you hold inherited Bitcoin without selling, you owe no capital gains tax. The stepped-up basis is locked in at the date-of-death value. You only trigger a taxable event when you sell, trade, or spend the Bitcoin. Holding indefinitely means no tax liability on the inheritance itself." },
  { question: 'How do I prove the cost basis of inherited Bitcoin?', answer: 'You need documentation of the fair market value on the date of death. This typically includes the Bitcoin price on major exchanges on that date, estate appraisal records, and the death certificate date. Keep records from CoinGecko, CoinMarketCap, or exchange historical data for that specific date.' },
  { question: 'Is this inheritance tax calculator free?', answer: 'Yes — our Bitcoin Inheritance & Estate Tax Calculator is completely free. No signup required. It covers federal estate tax, state-level estate taxes, step-up basis calculations, and capital gains comparisons. All calculations run locally in your browser for maximum privacy.' },
  { question: 'What is the difference between estate tax and inheritance tax?', answer: "Estate tax is paid by the estate before assets are distributed to heirs. Inheritance tax is paid by the person who receives the assets. The federal government only has an estate tax. Some states have inheritance taxes with rates based on the heir's relationship to the deceased." },
  { question: 'Can the step-up basis be eliminated in the future?', answer: 'There have been proposals to eliminate or modify the step-up basis, but as of 2026 it remains in effect. Any changes would require new legislation. This calculator reflects current law — always consult a tax professional for the most up-to-date guidance.' },
];

const faqsTr = [
  { question: 'Amerika Birleşik Devletleri\'nde miras alınan Bitcoin nasıl vergilendirilir?', answer: 'Miras alınan Bitcoin, asıl sahibin vefat ettiği tarihteki gerçeğe uygun piyasa değerine eşit "yükseltilmiş" bir maliyet tabanı alır. Bu, yalnızca vefat tarihinden satış tarihine kadar olan değer artışı için sermaye kazancı vergisi borçlu olduğunuz anlamına gelir — asıl satın alma fiyatından değil. Bu çok büyük vergi tasarrufuna yol açabilir.' },
  { question: 'Miras alınan kripto için maliyet tabanı yükseltmesi nedir?', answer: 'Maliyet tabanı yükseltmesi, maliyet tabanınızı vefat anındaki gerçeğe uygun piyasa değerine sıfırlar. Örneğin biri 1 BTC\'yi 500 $\'a satın aldıysa ve vefat ettiğinde 65.000 $ değerindeyse, maliyet tabanınız 500 $ değil 65.000 $ olur. 70.000 $\'a satarsanız, yalnızca 5.000 $\'lık kazanç için vergi ödersiniz.' },
  { question: 'Miras alınan Bitcoin üzerinden vergi miras vergisi borçlu muyum?', answer: 'Federal veraset vergisi yalnızca toplam miras muafiyet eşiğini aşarsa uygulanır (2026\'da kişi başına 13,61 milyon dolar veya portabilite ile evli çiftler için 27,22 milyon dolar). Çoğu miras bu eşiğin altındadır ve sıfır federal veraset vergisi borçlanır. Ancak bazı eyaletlerin çok daha düşük muafiyetleri vardır.' },
  { question: 'Hangi eyaletlerin kendi veraset veya miras vergileri var?', answer: '2026 itibarıyla, 13 eyalet ve DC\'de 1 milyon dolar (Oregon, Massachusetts) kadar düşük muafiyetlerle veraset vergileri bulunmaktadır. Altı eyalette (Iowa, Kentucky, Maryland, Nebraska, New Jersey, Pennsylvania) ayrıca ayrı miras vergileri de vardır. Belirli kurallar için eyaletinizi kontrol edin.' },
  { question: 'Miras alınan Bitcoin\'i satmazsam ne olur?', answer: 'Satmadan miras alınan Bitcoin\'i tutarsanız sermaye kazancı vergisi ödemezsiniz. Yükseltilmiş maliyet tabanı vefat tarihindeki değerde sabitlenir. Yalnızca Bitcoin\'i sattığınızda, takas ettiğinizde veya harcadığınızda vergiye tabi bir olay tetiklenmiş olur. Süresiz tutmak, mirasın kendisinde sıfır vergi yükümlülüğü anlamına gelir.' },
  { question: 'Miras alınan Bitcoin\'in maliyet tabanını nasıl kanıtlarım?', answer: 'Vefat tarihindeki gerçeğe uygun piyasa değerini belgeleyen kanıt gerekir. Bu tipik olarak o tarihteki büyük borsalardaki Bitcoin fiyatını, miras değerleme kayıtlarını ve ölüm belgesi tarihini içerir. O belirli tarih için CoinGecko, CoinMarketCap veya borsa tarihsel verilerinden kayıtları saklayın.' },
  { question: 'Bu miras vergisi hesaplayıcısı ücretsiz mi?', answer: 'Evet — Bitcoin Miras ve Veraset Vergisi Hesaplayıcımız tamamen ücretsizdir. Kayıt gerekmez. Federal veraset vergisi, eyalet düzeyinde veraset vergileri, yükseltilmiş maliyet tabanı hesaplamaları ve sermaye kazancı karşılaştırmalarını kapsar. Tüm hesaplamalar maksimum gizlilik için tarayıcınızda yerel olarak çalışır.' },
  { question: 'Veraset vergisi ile miras vergisi arasındaki fark nedir?', answer: 'Veraset vergisi, varlıklar mirasçılara dağıtılmadan önce miras tarafından ödenir. Miras vergisi ise varlıkları alan kişi tarafından ödenir. Federal hükümetin yalnızca veraset vergisi vardır. Bazı eyaletlerin, mirasçının merhuma olan ilişkisine dayalı oranlarla miras vergileri vardır.' },
  { question: 'Yükseltilmiş maliyet tabanı gelecekte kaldırılabilir mi?', answer: 'Yükseltilmiş maliyet tabanını ortadan kaldırmaya veya değiştirmeye yönelik teklifler olmuştur, ancak 2026 itibarıyla yürürlükte kalmaya devam etmektedir. Herhangi bir değişiklik yeni mevzuat gerektirir. Bu hesap makinesi mevcut yasayı yansıtır — en güncel rehberlik için her zaman nitelikli bir vergi uzmanına danışın.' },
];

export const InheritanceTaxFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            {tr ? 'SSS' : 'FAQ'}
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tr
              ? 'Miras alınan Bitcoin vergilendirmesi ve miras planlaması hakkında sık sorulan sorular.'
              : 'Common questions about inherited Bitcoin taxation and estate planning.'}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border/50 rounded-xl px-6 hover:border-primary/20 transition-all duration-300"
            >
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
