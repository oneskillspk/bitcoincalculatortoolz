import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What topics does the Bitcoin Learning Hub cover?", answer: "Our learning hub covers Bitcoin investing strategies (DCA, lump sum), market analysis (Fear & Greed Index, Bitcoin vs traditional assets), mining profitability, tax implications, Bitcoin basics (satoshis, halving), and retirement planning with Bitcoin." },
  { question: "Are these articles written by financial advisors?", answer: "Our articles are educational content created by Bitcoin analysts and researchers. They are not financial advice. Always consult a qualified financial advisor before making investment decisions." },
  { question: "How often is the content updated?", answer: "We regularly update our articles to reflect the latest market data, regulatory changes, and Bitcoin network updates. Each article displays its last updated date." },
  { question: "Can I use the calculators mentioned in the articles?", answer: "Yes! Every article links directly to the relevant free calculator tools on our site. These interactive tools let you model scenarios discussed in the articles with your own numbers." },
  { question: "Is this content free to access?", answer: "Yes, all articles and calculators on Bitcoin Calculator Tools are completely free to use. No account or subscription required." },
];

const faqsTr = [
  { question: "Bitcoin Öğrenme Merkezi hangi konuları kapsar?", answer: "Öğrenme merkezimiz Bitcoin yatırım stratejilerini (DCA, toplu yatırım), piyasa analizini (Korku & Açgözlülük Endeksi, Bitcoin ile geleneksel varlıklar), madencilik karlılığını, vergi sonuçlarını, Bitcoin temellerini (satoshi, yarılanma) ve Bitcoin ile emeklilik planlamayı kapsamaktadır." },
  { question: "Bu makaleler finansal danışmanlar tarafından mı yazıldı?", answer: "Makalelerimiz Bitcoin analistleri ve araştırmacılar tarafından oluşturulan eğitim içerikleridir. Finansal tavsiye niteliği taşımazlar. Yatırım kararları vermeden önce her zaman nitelikli bir finansal danışmana başvurun." },
  { question: "İçerik ne sıklıkla güncelleniyor?", answer: "Makalelerimizi en son piyasa verilerini, düzenleyici değişiklikleri ve Bitcoin ağı güncellemelerini yansıtmak için düzenli olarak güncelliyoruz. Her makale son güncellenme tarihini göstermektedir." },
  { question: "Makalelerde bahsedilen hesap makinelerini kullanabilir miyim?", answer: "Evet! Her makale, sitemizdeki ilgili ücretsiz hesap makinesi araçlarına doğrudan bağlantı vermektedir. Bu etkileşimli araçlar, makalelerde tartışılan senaryoları kendi rakamlarınızla modellemanize olanak tanır." },
  { question: "Bu içeriğe erişim ücretsiz mi?", answer: "Evet, Bitcoin Hesaplayıcı Araçlar'daki tüm makaleler ve hesap makineleri tamamen ücretsizdir. Hesap veya abonelik gerekmez." },
];

export const LearnFAQSection = () => {
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
            {tr ? 'Bitcoin Öğrenme Merkezi hakkında sık sorulan sorular' : 'Common questions about the Bitcoin Learning Hub'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
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
