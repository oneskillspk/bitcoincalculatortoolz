import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { q: "How much Bitcoin is left to mine?", a: "As of 2026, approximately 1.2 million BTC remain unmined out of the 21 million hard cap. The last bitcoin will be mined around the year 2140." },
  { q: "How many bitcoins are lost forever?", a: "Estimates range from 3 to 4 million BTC lost permanently due to forgotten passwords, lost hardware, and Satoshi's unmoved coins. This reduces the effective supply significantly." },
  { q: "What happens when all Bitcoin is mined?", a: "Miners will rely entirely on transaction fees for revenue. Since block rewards decrease by 50% every ~4 years, this transition is gradual. Transaction fee markets are expected to sustain network security." },
  { q: "What is Bitcoin's current inflation rate?", a: "After the 4th halving (April 2024), Bitcoin's annual inflation rate dropped to approximately 0.85%. This is lower than gold's ~1.5% annual supply increase, making BTC the scarcest major asset by stock-to-flow." },
  { q: "Can the 21 million cap be changed?", a: "Technically, a consensus change could modify the cap, but it would require agreement from the vast majority of node operators, miners, and developers — something considered virtually impossible as it would destroy Bitcoin's core value proposition." },
  { q: "How many Bitcoin are there in total?", a: "Bitcoin has a fixed maximum supply of 21 million coins. As of today, approximately 19.8 million BTC have been mined. Our Bitcoin supply calculator shows live circulating supply, estimated lost coins, and coins yet to be mined." },
  { q: "Is Bitcoin equivalent to money?", a: "Bitcoin functions as a store of value and medium of exchange, but differs from fiat money in that it has a fixed supply of 21 million coins — it cannot be inflated by any government or central bank." },
];

const faqsTr = [
  { q: "Madenciliği yapılacak kaç Bitcoin kaldı?", a: "2026 itibarıyla 21 milyon sert tavanın 1,2 milyonu kadar BTC henüz madenciliği yapılmamış durumdadır. Son bitcoin 2140 yılı civarında madenciliği yapılacak." },
  { q: "Kaç bitcoin sonsuza kadar kayboldu?", a: "Tahminler, unutulan şifreler, kaybolan donanım ve Satoshi'nin hareket ettirilmemiş coinleri nedeniyle kalıcı olarak kaybolmuş 3 ila 4 milyon BTC arasında değişmektedir. Bu, etkin arzı önemli ölçüde azaltır." },
  { q: "Tüm Bitcoin madenciliği yapıldığında ne olur?", a: "Madenciler gelir için tamamen işlem ücretlerine güvenecek. Blok ödülleri her ~4 yılda bir %50 azaldığından, bu geçiş kademeli olur. İşlem ücreti piyasalarının ağ güvenliğini sürdürmesi beklenmektedir." },
  { q: "Bitcoin'in güncel enflasyon oranı nedir?", a: "4. yarılanmadan (Nisan 2024) sonra Bitcoin'in yıllık enflasyon oranı yaklaşık %0,85'e düştü. Bu, altının ~%1,5 yıllık arz artışından düşüktür ve BTC'yi stok-akış oranıyla en kıt büyük varlık haline getirir." },
  { q: "21 milyon sınırı değiştirilebilir mi?", a: "Teknik olarak, bir konsensüs değişikliği sınırı değiştirebilir, ancak düğüm operatörlerinin, madencilerin ve geliştiricilerin büyük çoğunluğunun anlaşmasını gerektirir — bu, Bitcoin'in temel değer önerisini yok edeceğinden neredeyse imkânsız olarak kabul edilir." },
  { q: "Toplamda kaç Bitcoin var?", a: "Bitcoin'in sabit maksimum arzı 21 milyon coindir. Bugün itibarıyla yaklaşık 19,8 milyon BTC madenciliği yapılmıştır. Bitcoin arz hesaplayıcımız canlı dolaşımdaki arzı, tahmini kayıp coinleri ve henüz madenciliği yapılmamış coinleri gösterir." },
  { q: "Bitcoin para ile eşdeğer midir?", a: "Bitcoin bir değer deposu ve değişim aracı olarak işlev görür, ancak fiat paradan 21 milyon coin sabit arzına sahip olmasıyla farklılaşır — herhangi bir hükümet veya merkez bankası tarafından enflasyona tabi tutulamamaktadır." },
];

export const SupplyFAQSection = () => {
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
              ? 'Bitcoin arzı ve madenciliği hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin supply and mining'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
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
