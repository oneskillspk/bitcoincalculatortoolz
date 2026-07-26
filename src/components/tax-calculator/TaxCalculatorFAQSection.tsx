import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const TaxCalculatorFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const faqsEN = [
    {
      question: 'How is Bitcoin taxed in the United States?',
      answer: 'In the U.S., the IRS treats Bitcoin and other cryptocurrencies as property, not currency. This means they are subject to capital gains tax. You owe taxes on the profit you make when you sell, trade, or spend your Bitcoin for more than you acquired it for.'
    },
    {
      question: "What's the difference between short-term and long-term capital gains?",
      answer: "It depends on your holding period. If you hold your Bitcoin for one year or less before selling, your profit is a short-term gain and is taxed at your higher, ordinary income tax rate. If you hold it for more than one year, it's a long-term gain and is taxed at a lower rate."
    },
    {
      question: 'How do I use this calculator to estimate my taxes?',
      answer: 'Simply enter the date and price you purchased your Bitcoin, and the date and price you sold it. Then, provide your estimated annual income and tax filing status. The tool will automatically calculate your holding period, gain type, and provide an estimate of your federal tax liability.'
    },
    {
      question: 'Do I owe taxes if I trade Bitcoin for another cryptocurrency?',
      answer: 'Yes. The IRS considers a crypto-to-crypto trade to be a taxable event. For tax purposes, you are effectively selling your Bitcoin at its market value at the time of the trade. If that value is higher than your original purchase price, you have a taxable capital gain.'
    },
    {
      question: 'How accurate is this calculator, and is my data secure?',
      answer: 'This calculator provides a strong educational estimate based on the data you provide and current U.S. federal tax brackets. Your security is guaranteed: all calculations are performed in your browser, and we never see, store, or have access to your financial data.'
    },
    {
      question: 'Is this calculator a substitute for professional tax advice?',
      answer: 'No. This tool is for informational and educational purposes only. Tax laws are complex and can change. Always consult a qualified tax professional for advice regarding your specific financial situation.'
    },
    {
      question: "Do I need to pay taxes if I only lost money on Bitcoin?",
      answer: 'If you sold Bitcoin at a loss, you can use that capital loss to offset other capital gains, potentially reducing your tax burden. You can deduct up to $3,000 in net capital losses against ordinary income per year, and any excess losses can be carried forward to future years.'
    },
    {
      question: 'How do I calculate Bitcoin losses for a tax write-off?',
      answer: 'Bitcoin loss = cost basis (buy price + buy fees) − net sale proceeds (sell price − sell fees). Example: you bought 0.1 BTC for $8,000 including fees and sold it for $5,000 after a $25 fee — realized loss = $8,000 − $4,975 = $3,025. In the US, that loss first offsets any capital gains for the year, then up to $3,000 of ordinary income, and any leftover carries forward indefinitely. Report each disposal on Form 8949 and roll the totals into Schedule D. Use the calculator above to build the per-lot loss figure before you hand it to your CPA.'
    },
    {
      question: "Are there any situations where Bitcoin gains aren't taxed?",
      answer: "For 2025, if your total taxable income is below $48,350 (single) or $96,700 (married filing jointly), you may qualify for the 0% long-term capital gains rate. However, this only applies to long-term gains (Bitcoin held more than one year), and the gain itself may push you into a higher tax bracket."
    },
    {
      question: 'What records should I keep for tax purposes?',
      answer: 'Maintain detailed records including: purchase date and price, sale date and price, transaction fees, exchange records, and wallet addresses. Good record-keeping is essential for accurate tax reporting and defending your tax position if audited.'
    },
    {
      question: 'Does this calculator include state taxes?',
      answer: "Yes! This calculator now includes an optional state tax rate field. Simply enter your state's capital gains tax rate to get a more complete estimate. State tax treatment varies significantly by state - some states have no capital gains tax, while others tax capital gains as ordinary income."
    },
    {
      question: 'What about the Net Investment Income Tax (NIIT)?',
      answer: 'High-income taxpayers may owe an additional 3.8% Net Investment Income Tax on capital gains. This applies if your modified adjusted gross income exceeds $200,000 (single) or $250,000 (married filing jointly). This calculator does not include NIIT calculations.'
    },
    {
      question: 'When do I need to report Bitcoin transactions?',
      answer: 'You must report Bitcoin sales on your tax return for the year in which the sale occurred, not when you originally purchased the Bitcoin. Use Schedule D (Capital Gains and Losses) and Form 8949 to report cryptocurrency transactions.'
    },
    {
      question: 'Can I use tax-loss harvesting with Bitcoin?',
      answer: 'Yes, you can sell Bitcoin at a loss to offset gains from other investments. However, be aware of the wash sale rule - if you buy back the same or substantially identical cryptocurrency within 30 days, the loss may be disallowed. Note that wash sale rules for crypto are still evolving.'
    },
    {
      question: 'Is this Bitcoin tax calculator free?',
      answer: 'Yes — our Bitcoin capital gains tax calculator is completely free. No signup, no subscription. It covers all US federal and state rates, short and long-term gains, and all filing statuses.'
    },
    {
      question: 'Is this crypto tax calculator accurate?',
      answer: 'Our calculator uses official IRS tax brackets and all 50 US state tax rates. It is for educational estimation purposes — always consult a tax professional for filing. All calculations run locally in your browser for maximum privacy.'
    },
    {
      question: 'How much tax do I pay on Bitcoin profits?',
      answer: 'Bitcoin profits are taxed as capital gains. Short-term gains (held under 1 year) are taxed as ordinary income at rates up to 37%. Long-term gains (held over 1 year) have lower rates of 0%, 15%, or 20% depending on your income and filing status.'
    },
    {
      question: 'How much tax will I pay on Bitcoin gains in 2026?',
      answer: 'For 2026, long-term Bitcoin gains are taxed at 0%, 15%, or 20% federally. Single filers with under $48,350 in taxable income owe nothing on long-term gains. Above $533,400 the rate jumps to 20%. Add state tax (up to 13.3% in California) and 3.8% NIIT for high earners, and the all-in rate can exceed 37%.'
    },
    {
      question: "Do I owe tax on Bitcoin if I haven't sold?",
      answer: 'No. Holding Bitcoin is not a taxable event. Tax only triggers when you sell, swap, spend, or otherwise dispose of BTC. Mining rewards, staking income, and Bitcoin received as payment are taxed when received, but simply HODLing through price moves creates zero tax liability.'
    },
    {
      question: 'Which states have no Bitcoin capital gains tax?',
      answer: 'Nine states impose no state income tax on capital gains: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington (with a 7% tax only on gains above $270K), and Wyoming. Establishing residency in one of these states before a major sale can cut your tax bill substantially.'
    },
    {
      question: 'Do I have to report every Bitcoin transaction to the IRS?',
      answer: 'Yes. Every sale, trade, or purchase made with Bitcoin must be reported on Form 8949, even if the gain is small. The IRS now requires exchanges to issue 1099-DA forms starting tax year 2025, so the agency will already have the data on most US-based trades.'
    },
    {
      question: 'When does the 2026 tax filing season open?',
      answer: 'The IRS typically opens e-filing in late January 2027 for tax year 2026. The standard filing deadline is April 15, 2027. Bitcoin transactions from January 1 through December 31, 2026 belong on that return. Extensions push filing to October 15 but do not extend the payment deadline.'
    },
    {
      question: 'Does the wash sale rule apply to Bitcoin in 2026?',
      answer: 'As of 2026, the wash sale rule does not apply to Bitcoin or other cryptocurrencies under current IRS guidance, since crypto is classified as property rather than a security. This means you can harvest losses and rebuy immediately. Congress has proposed extending wash sale rules to crypto, so this loophole could close in future years.'
    }
  ];

  const faqsTR = [
    {
      question: 'Amerika Birleşik Devletleri\'nde Bitcoin nasıl vergilendirilir?',
      answer: 'ABD\'de IRS, Bitcoin ve diğer kripto para birimlerini para birimi değil, mülk olarak değerlendirir. Bu nedenle sermaye kazancı vergisine tabidir. Bitcoin\'inizi aldığınızdan daha yüksek bir fiyata sattığınızda, takas ettiğinizde veya harcadığınızda elde ettiğiniz kâr üzerinden vergi ödersiniz.'
    },
    {
      question: 'Kısa vadeli ve uzun vadeli sermaye kazançları arasındaki fark nedir?',
      answer: 'Bu, elde tutma sürenize bağlıdır. Bitcoin\'inizi satmadan önce bir yıl veya daha kısa süre elinizde tutarsanız, kârınız kısa vadeli kazanç sayılır ve daha yüksek olan olağan gelir vergisi oranınızdan vergilendirilir. Bir yıldan uzun süre tutarsanız uzun vadeli kazanç sayılır ve daha düşük bir oran uygulanır.'
    },
    {
      question: 'Bu hesaplayıcıyı vergimi tahmin etmek için nasıl kullanırım?',
      answer: 'Bitcoin\'i satın aldığınız tarih ve fiyatı, sattığınız tarih ve fiyatı girin. Ardından tahmini yıllık gelirinizi ve vergi beyan durumunuzu belirtin. Araç, elde tutma sürenizi, kazanç türünüzü otomatik olarak hesaplayarak federal vergi yükümlülüğünüzü tahmin eder.'
    },
    {
      question: 'Bitcoin\'i başka bir kripto para birimiyle takas edersem vergi ödemem gerekir mi?',
      answer: 'Evet. IRS, kripto-kripto takasını vergiye tabi bir olay olarak kabul eder. Vergi açısından değerlendirildiğinde, Bitcoin\'inizi takas anındaki piyasa değeriyle satmış gibi işlem görürsünüz. Bu değer orijinal alış fiyatınızdan yüksekse, vergilendirilebilir bir sermaye kazancı elde etmiş olursunuz.'
    },
    {
      question: 'Bu hesaplayıcı ne kadar doğru ve verilerim güvende mi?',
      answer: 'Bu hesaplayıcı, girdiğiniz verilere ve güncel ABD federal vergi dilimlerine dayanarak güçlü bir eğitimsel tahmin sunar. Güvenliğiniz garanti altındadır: tüm hesaplamalar tarayıcınızda gerçekleştirilir, finansal verilerinizi asla görmüyor, saklamıyor veya erişmiyoruz.'
    },
    {
      question: 'Bu hesaplayıcı profesyonel vergi tavsiyesinin yerini tutabilir mi?',
      answer: 'Hayır. Bu araç yalnızca bilgilendirme ve eğitim amaçlıdır. Vergi yasaları karmaşıktır ve değişebilir. Kişisel mali durumunuza yönelik tavsiye için her zaman nitelikli bir vergi uzmanına başvurun.'
    },
    {
      question: 'Bitcoin\'den yalnızca zarar ettimse vergi ödemem gerekiyor mu?',
      answer: 'Bitcoin\'i zararına sattıysanız, bu sermaye kaybını diğer sermaye kazançlarınızla mahsup edebilirsiniz; bu da vergi yükümlülüğünüzü azaltabilir. Yılda en fazla 3.000 $ net sermaye kaybını olağan gelirden düşebilir, fazla kısım ise sonraki yıllara devredilebilir.'
    },
    {
      question: 'Vergi indirimi için Bitcoin zararını nasıl hesaplarım?',
      answer: 'Bitcoin zararı = maliyet bazı (alış fiyatı + alım ücretleri) − net satış geliri (satış fiyatı − satım ücretleri). Örnek: 0,1 BTC\'yi ücretler dahil 8.000 $\'a aldınız ve 25 $ ücretle 5.000 $\'a sattınız — gerçekleşmiş zarar = 8.000 $ − 4.975 $ = 3.025 $. ABD\'de bu zarar önce yılın sermaye kazançlarını mahsup eder, sonra 3.000 $\'a kadar olağan gelirden düşülür, kalan miktar süresiz olarak sonraki yıllara devredilir. Her satışı Form 8949\'da bildirin ve toplamları Schedule D\'ye taşıyın. CPA\'nıza vermeden önce her lot için zarar rakamını yukarıdaki hesaplayıcıda oluşturun.'
    },
    {
      question: 'Bitcoin kazançlarının vergilendirilmediği durumlar var mı?',
      answer: '2025 yılı için toplam vergilendirilebilir geliriniz 48.350 $ (bekar) veya 96.700 $ (evli ortak beyan) altındaysa uzun vadeli sermaye kazançlarında %0 orandan yararlanabilirsiniz. Ancak bu yalnızca uzun vadeli kazançlara (bir yıldan uzun süre tutulan Bitcoin) uygulanır ve kazancın kendisi sizi daha yüksek bir dilime itebilir.'
    },
    {
      question: 'Vergi amaçları için hangi kayıtları tutmalıyım?',
      answer: 'Şunları içeren ayrıntılı kayıtlar tutun: alım tarihi ve fiyatı, satım tarihi ve fiyatı, işlem ücretleri, borsa kayıtları ve cüzdan adresleri. İyi kayıt tutma, doğru vergi raporlaması ve denetim durumunda konumunuzu savunmanız için kritik öneme sahiptir.'
    },
    {
      question: 'Bu hesaplayıcı eyalet vergilerini içeriyor mu?',
      answer: 'Evet! Bu hesaplayıcıda isteğe bağlı bir eyalet vergi oranı alanı mevcuttur. Daha eksiksiz bir tahmin almak için eyaletinizin sermaye kazancı vergi oranını girin. Eyalet vergi uygulaması eyaletten eyalete önemli ölçüde farklılık gösterir; bazı eyaletlerde sermaye kazancı vergisi bulunmazken diğerleri bu kazançları olağan gelir gibi vergilendirir.'
    },
    {
      question: 'Net Yatırım Geliri Vergisi (NIIT) nedir?',
      answer: 'Yüksek gelirli vergi mükellefleri, sermaye kazançları üzerinden ek olarak %3,8 Net Yatırım Geliri Vergisi (NIIT) ödeyebilir. Bu, değiştirilmiş düzeltilmiş brüt gelirinizin 200.000 $ (bekar) veya 250.000 $ (evli ortak beyan) sınırını aşması durumunda uygulanır. Bu hesaplayıcı NIIT hesaplamalarını içermemektedir.'
    },
    {
      question: 'Bitcoin işlemlerini ne zaman raporlamam gerekiyor?',
      answer: 'Bitcoin satışlarını, Bitcoin\'i satın aldığınız yıl için değil, satışın gerçekleştiği yıl için vergi beyannamenize dahil etmeniz gerekir. Kripto para işlemlerini raporlamak için Schedule D (Sermaye Kazançları ve Kayıpları) ve Form 8949 kullanın.'
    },
    {
      question: 'Bitcoin ile vergi kaybı hasadı yapabilir miyim?',
      answer: 'Evet, diğer yatırım kazançlarınızı mahsup etmek için Bitcoin\'i zararına satabilirsiniz. Ancak wash sale kuralına dikkat edin — aynı veya esasen aynı kripto para birimini 30 gün içinde geri satın alırsanız zarar reddedilebilir. Kripto için wash sale kurallarının hâlâ gelişmekte olduğunu göz önünde bulundurun.'
    },
    {
      question: 'Bu Bitcoin vergi hesaplayıcısı ücretsiz mi?',
      answer: 'Evet — Bitcoin sermaye kazancı vergi hesaplayıcımız tamamen ücretsizdir. Kayıt veya abonelik gerekmez. Tüm ABD federal ve eyalet oranlarını, kısa ve uzun vadeli kazançları ve tüm beyan durumlarını kapsar.'
    },
    {
      question: 'Bu kripto vergi hesaplayıcısı doğru mu?',
      answer: 'Hesaplayıcımız resmi IRS vergi dilimlerini ve 50 ABD eyaletinin tamamının vergi oranlarını kullanır. Eğitim amaçlı tahmin içindir — beyanname için her zaman bir vergi uzmanına başvurun. Tüm hesaplamalar maksimum gizlilik için tarayıcınızda yerel olarak çalışır.'
    },
    {
      question: 'Bitcoin kârlarından ne kadar vergi öderim?',
      answer: 'Bitcoin kârları sermaye kazancı olarak vergilendirilir. Kısa vadeli kazançlar (1 yıldan kısa süre tutulanlar) olağan gelir olarak %37\'ye kadar vergilendirilir. Uzun vadeli kazançlar (1 yıldan uzun süre tutulanlar) gelir ve beyan durumunuza göre %0, %15 veya %20 gibi daha düşük oranlara tabidir.'
    },
    {
      question: '2026\'da Bitcoin kazançlarından ne kadar vergi öderim?',
      answer: '2026 yılında uzun vadeli Bitcoin kazançları federal düzeyde %0, %15 veya %20 oranında vergilendirilir. 48.350 $\'ın altında vergilendirilebilir geliri olan bekar mükellefler uzun vadeli kazançlar için hiçbir şey ödemez. 533.400 $\'ın üzerinde oran %20\'ye yükselir. Yüksek kazançlı mükellefler için eyalet vergisi (California\'da %13,3\'e kadar) ve %3,8 NIIT eklendiğinde toplam oran %37\'yi aşabilir.'
    },
    {
      question: 'Bitcoin\'i satmadıysam vergi ödemem gerekiyor mu?',
      answer: 'Hayır. Bitcoin tutmak vergilendirilebilir bir olay değildir. Vergi yalnızca BTC\'yi sattığınızda, takas ettiğinizde, harcadığınızda veya başka bir şekilde elden çıkardığınızda tetiklenir. Madencilik ödülleri, staking gelirleri ve ödeme olarak alınan Bitcoin alındığında vergilendirilir; ancak fiyat dalgalanmaları boyunca yalnızca HODL yapmak sıfır vergi yükümlülüğü yaratır.'
    },
    {
      question: 'Hangi eyaletlerde Bitcoin sermaye kazancı vergisi uygulanmaz?',
      answer: 'Dokuz eyalet sermaye kazançlarında eyalet gelir vergisi uygulamaz: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington (yalnızca 270.000 $\'ın üzerindeki kazançlara %7) ve Wyoming. Büyük bir satıştan önce bu eyaletlerden birinde ikamet oluşturmak, vergi faturanızı önemli ölçüde azaltabilir.'
    },
    {
      question: 'Her Bitcoin işlemini IRS\'e bildirmem gerekiyor mu?',
      answer: 'Evet. Bitcoin ile yapılan her satış, takas veya alım, kazanç küçük olsa bile Form 8949\'da raporlanmalıdır. IRS artık borsaların 2025 vergi yılından itibaren 1099-DA formu düzenlemesini zorunlu kılmaktadır; bu nedenle kurum, ABD merkezli işlemlerin büyük çoğunluğunun verilerini zaten elinde bulundurur.'
    },
    {
      question: '2026 vergi beyan sezonu ne zaman başlıyor?',
      answer: 'IRS, 2026 vergi yılı için genellikle Ocak 2027\'nin sonlarında e-beyan işlemlerini açar. Standart beyan son tarihi 15 Nisan 2027\'dir. 1 Ocak ile 31 Aralık 2026 arasındaki Bitcoin işlemleri bu beyannameye dahil edilir. Uzatmalar, beyan tarihini 15 Ekim\'e kadar öteleyebilir; ancak ödeme son tarihini uzatmaz.'
    },
    {
      question: '2026\'da Bitcoin için wash sale kuralı geçerli mi?',
      answer: '2026 itibarıyla, mevcut IRS rehberine göre kripto mülk olarak sınıflandırıldığından wash sale kuralı Bitcoin veya diğer kripto para birimleri için geçerli değildir. Bu, zararları realize edip hemen geri satın alabilmeniz anlamına gelir. Kongre, wash sale kurallarını kripto para birimlerine genişletmeyi önermiştir; bu nedenle bu boşluk gelecekte kapanabilir.'
    }
  ];

  const faqs = tr ? faqsTR : faqsEN;

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
              ? 'Bitcoin sermaye kazancı vergilendirmesi ve hesaplayıcımız hakkında sık sorulan sorular.'
              : 'Common questions about Bitcoin capital gains taxation and our calculator.'}
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
