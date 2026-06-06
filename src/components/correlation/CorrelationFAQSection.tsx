import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { value: "faq1", q: "What does correlation mean in investing?", a: "Correlation measures how two assets move in relation to each other. A coefficient of +1 means they move perfectly together, −1 means they move in opposite directions, and 0 means no linear relationship. Investors use correlation to build diversified portfolios." },
  { value: "faq2", q: "Is Bitcoin correlated with the stock market?", a: "Bitcoin's correlation with stocks varies significantly over time. During risk-off events (like March 2020 or the 2022 crash), BTC can become highly correlated with equities. In calmer periods, Bitcoin often trades more independently, making it a potential diversifier." },
  { value: "faq3", q: "Why does Bitcoin's correlation change over time?", a: "Bitcoin's correlation shifts based on macro conditions, institutional participation, and market sentiment. As more traditional investors enter crypto, BTC may correlate more with risk assets during stress. In Bitcoin-specific events (halvings, regulatory news), it can decouple entirely." },
  { value: "faq4", q: "Is Bitcoin a good hedge against inflation like gold?", a: "Bitcoin is sometimes called \"digital gold\" but its correlation with gold is inconsistent. Over long periods, both tend to benefit from monetary debasement, but short-term correlation is often near zero. Bitcoin's inflation hedge thesis is still evolving as the asset matures." },
  { value: "faq5", q: "What is the Pearson correlation coefficient?", a: "The Pearson correlation coefficient is the standard measure of linear correlation between two variables, ranging from −1 to +1. Values above +0.7 indicate strong positive correlation, below −0.7 indicate strong negative correlation, and values near 0 indicate little linear relationship." },
];

const faqsTr = [
  { value: "faq1", q: "Yatırımda korelasyon ne anlama gelir?", a: "Korelasyon, iki varlığın birbirine göre nasıl hareket ettiğini ölçer. +1 katsayısı mükemmel birlikte hareket, −1 zıt yönde hareket, 0 ise doğrusal ilişki olmadığı anlamına gelir. Yatırımcılar çeşitlendirilmiş portföyler oluşturmak için korelasyonu kullanır." },
  { value: "faq2", q: "Bitcoin, borsa ile ilişkili mi?", a: "Bitcoin'in hisse senetleriyle korelasyonu zaman içinde önemli ölçüde değişir. Mart 2020 veya 2022 çöküşü gibi riskten kaçış olaylarında BTC, hisse senetleriyle yüksek oranda ilişkili hale gelebilir. Daha sakin dönemlerde Bitcoin çoğunlukla daha bağımsız işlem görür; bu da onu potansiyel bir çeşitlendirici yapar." },
  { value: "faq3", q: "Bitcoin'in korelasyonu neden zaman içinde değişir?", a: "Bitcoin'in korelasyonu makroekonomik koşullara, kurumsal katılıma ve piyasa duygusuna bağlı olarak kayar. Kripto piyasasına daha fazla geleneksel yatırımcı girdikçe BTC, stres dönemlerinde risk varlıklarıyla daha fazla ilişkilenebilir. Bitcoin'e özgü olaylarda (yarılanmalar, düzenleyici haberler) tamamen ayrışabilir." },
  { value: "faq4", q: "Bitcoin, altın gibi enflasyona karşı iyi bir koruma aracı mı?", a: "Bitcoin zaman zaman 'dijital altın' olarak adlandırılır, ancak altınla korelasyonu tutarsızdır. Uzun dönemler boyunca her ikisi de parasal değer kaybından fayda sağlama eğilimindedir, ancak kısa vadeli korelasyon çoğunlukla sıfıra yakındır. Bitcoin'in enflasyon koruması tezi, varlık olgunlaştıkça hâlâ gelişmektedir." },
  { value: "faq5", q: "Pearson korelasyon katsayısı nedir?", a: "Pearson korelasyon katsayısı, −1 ile +1 arasında değişen iki değişken arasındaki doğrusal korelasyonun standart ölçüsüdür. +0,7'nin üzerindeki değerler güçlü pozitif korelasyonu, −0,7'nin altındaki değerler güçlü negatif korelasyonu ve 0'a yakın değerler ise zayıf doğrusal ilişkiyi gösterir." },
];

export const CorrelationFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? faqsTr : faqsEn;

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-h2 font-bold text-foreground mb-6">
          {tr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value} className="glass-morphism-card border-border/20 rounded-xl px-5">
              <AccordionTrigger className="text-foreground font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
