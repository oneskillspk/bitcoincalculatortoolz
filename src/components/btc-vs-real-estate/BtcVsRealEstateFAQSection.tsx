import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "Is this a fair comparison between Bitcoin and real estate?", a: "The 'Same Cash Invested' mode provides the fairest comparison — it compares the same dollar amount going into BTC vs. the down payment on a property. The 'Full Value' mode shows what happens if you skip real estate entirely and invest the whole property price in BTC." },
  { q: "How does real estate leverage affect the comparison?", a: "Real estate allows you to control a $400K asset with just $80K down (5:1 leverage). If the property appreciates 3.5% per year, your equity grows faster than 3.5% because you're earning on the full property value, not just your cash invested. This is why real estate can outperform BTC in some scenarios despite lower appreciation rates." },
  { q: "Does this calculator account for rental income?", a: "Yes. You can set an annual rental yield (as a % of property value) and a vacancy rate. Net rental income is accumulated over the holding period and added to the real estate net value." },
  { q: "What costs are included for real estate?", a: "Mortgage interest, maintenance and insurance, property tax, and closing costs for both buying and selling. These are deducted from the real estate net value to give a realistic after-cost return." },
  { q: "Why is Bitcoin more liquid than real estate?", a: "Bitcoin can be sold 24/7 on global exchanges in minutes with minimal fees. Real estate typically takes 30–90 days to sell and involves 3–6% closing costs. This liquidity difference isn't captured in ROI numbers but matters for financial planning." },
  { q: "What BTC growth rate should I use?", a: "Bitcoin's historical CAGR since 2013 is approximately 50–80%, but as the market matures, future growth is expected to be lower. Many analysts model 20–40% for conservative long-term estimates. You can adjust the slider to see how different assumptions change the outcome." },
];

const faqsTr = [
  { q: "Bu, Bitcoin ile gayrimenkul arasında adil bir karşılaştırma mı?", a: "'Aynı Yatırılan Nakit' modu en adil karşılaştırmayı sağlar — BTC'ye giren aynı dolar miktarını, bir mülkün peşinatıyla karşılaştırır. 'Tam Değer' modu, gayrimenkulü tamamen atlayıp tüm mülk fiyatını BTC'ye yatırırsanız ne olacağını gösterir." },
  { q: "Gayrimenkul kaldıracı karşılaştırmayı nasıl etkiler?", a: "Gayrimenkul, yalnızca 80.000 $ peşinatla (5:1 kaldıraç) 400.000 $ değerinde bir varlığı kontrol etmenize olanak tanır. Mülk yılda %3,5 değer kazanırsa, öz sermayeniz %3,5'ten daha hızlı büyür çünkü yalnızca yatırılan nakit değil, tam mülk değeri üzerinden kazanırsınız. Bu yüzden gayrimenkul, daha düşük değer artış oranlarına rağmen bazı senaryolarda BTC'yi geride bırakabilir." },
  { q: "Bu hesap makinesi kira gelirini hesaba katıyor mu?", a: "Evet. Yıllık kira getirisi (mülk değerinin %'si olarak) ve boşluk oranı belirleyebilirsiniz. Net kira geliri elde tutma süresi boyunca birikir ve gayrimenkul net değerine eklenir." },
  { q: "Gayrimenkul için hangi maliyetler dahildir?", a: "İpotek faizi, bakım ve sigorta, emlak vergisi ile hem alım hem de satım için kapanış masrafları. Bunlar, gerçekçi maliyet sonrası getiri sağlamak için gayrimenkul net değerinden düşülür." },
  { q: "Bitcoin neden gayrimenkulden daha likit?", a: "Bitcoin, minimum ücretlerle dakikalar içinde 7/24 küresel borsalarda satılabilir. Gayrimenkul genellikle satmak için 30-90 gün alır ve %3-6 kapanış masrafları içerir. Bu likidite farkı YYG sayılarına yansımaz, ancak finansal planlama için önem taşır." },
  { q: "Hangi BTC büyüme oranını kullanmalıyım?", a: "Bitcoin'in 2013'ten bu yana tarihsel YBBO'su yaklaşık %50-80'dir, ancak piyasa olgunlaştıkça gelecekteki büyümenin daha düşük olması beklenmektedir. Pek çok analist, muhafazakâr uzun vadeli tahminler için %20-40 modellemektedir. Farklı varsayımların sonucu nasıl değiştirdiğini görmek için kaydırıcıyı ayarlayabilirsiniz." },
];

export const BtcVsRealEstateFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-h2 font-bold text-foreground mb-6">
          {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-foreground">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
