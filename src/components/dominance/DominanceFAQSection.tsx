import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "What is Bitcoin dominance?", a: "Bitcoin dominance is the percentage of Bitcoin's market capitalization relative to the total cryptocurrency market cap. A 60% dominance means BTC accounts for 60 cents of every dollar in crypto." },
  { q: "Why does BTC dominance matter?", a: 'Rising dominance suggests capital flowing into Bitcoin over altcoins — a "flight to quality." Falling dominance indicates an "alt season" where altcoins outperform BTC. It\'s a key indicator for portfolio rotation decisions.' },
  { q: "What causes dominance to change?", a: "Dominance shifts when capital rotates between BTC and altcoins. During bull runs, altcoins often pump harder than BTC (lowering dominance). During corrections, money flows back to BTC as the safest crypto asset (raising dominance)." },
  { q: "How does the scenario modeler work?", a: 'Set a hypothetical total crypto market cap and BTC dominance %. The tool calculates: Implied BTC Price = (Total Market Cap × Dominance %) ÷ Circulating Supply. This helps model "what if" price scenarios.' },
  { q: "Is high or low dominance better for Bitcoin?", a: "Neither is inherently better. High dominance means BTC is the preferred crypto asset. Low dominance can mean a healthy, growing ecosystem — or that speculative altcoins are inflating total market cap. Context matters." },
];

const faqsTr = [
  { q: "Bitcoin hakimiyeti nedir?", a: "Bitcoin hakimiyeti, Bitcoin'in piyasa değerinin toplam kripto para piyasası değerine oranıdır. %60 hakimiyet, BTC'nin kripto alandaki her 1 doların 60 sentini oluşturduğu anlamına gelir." },
  { q: "BTC hakimiyeti neden önemli?", a: 'Yükselen hakimiyet, altcoinler yerine Bitcoin\'e akan sermayeyi gösterir; bu "kaliteye kaçış" olarak adlandırılır. Düşen hakimiyet ise altcoinlerin BTC\'yi geride bıraktığı bir "altcoin sezonuna" işaret eder. Portföy rotasyon kararları için temel bir göstergedir.' },
  { q: "Hakimiyet neden değişir?", a: "Hakimiyet, sermaye BTC ile altcoinler arasında döndüğünde kayar. Boğa piyasasında altcoinler genellikle BTC'den daha sert yükselir (hakimiyeti düşürür). Düzeltmelerde ise para en güvenli kripto varlığı olarak BTC'ye geri döner (hakimiyeti yükseltir)." },
  { q: "Senaryo modelleyici nasıl çalışır?", a: 'Varsayımsal bir toplam kripto piyasa değeri ve BTC hakimiyet yüzdesi belirleyin. Araç şunu hesaplar: Öngörülen BTC Fiyatı = (Toplam Piyasa Değeri × Hakimiyet %) ÷ Dolaşımdaki Arz. Bu, "ya olsaydı" fiyat senaryolarını modellemeye yardımcı olur.' },
  { q: "Yüksek mi yoksa düşük hakimiyet mi Bitcoin için daha iyidir?", a: "Hiçbirinin özünde üstünlüğü yoktur. Yüksek hakimiyet, BTC'nin tercih edilen kripto varlığı olduğu anlamına gelir. Düşük hakimiyet, sağlıklı, büyüyen bir ekosistemi veya spekülatif altcoinlerin toplam piyasa değerini şişirdiğini gösterebilir. Bağlam önemlidir." },
];

export const DominanceFAQSection = () => {
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
              ? 'Bitcoin hakimiyet analizi hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin dominance analysis'}
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
