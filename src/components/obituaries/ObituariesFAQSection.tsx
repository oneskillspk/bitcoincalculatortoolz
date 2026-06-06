import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "What counts as a Bitcoin obituary?", answer: "A Bitcoin obituary is any public statement, article, or commentary that declares Bitcoin \"dead,\" predicts it will fail, or claims it has no future. This includes statements from media, financial experts, institutions, and government officials." },
  { question: "How many times has Bitcoin been declared dead?", answer: "Bitcoin has been declared \"dead\" over 400 times since 2010, according to our comprehensive database. This number continues to grow as new critics emerge, yet Bitcoin continues to thrive and reach new adoption milestones." },
  { question: "What was the most famous Bitcoin obituary?", answer: "Some of the most famous include Jamie Dimon calling it \"a fraud\" in 2017, Warren Buffett's \"rat poison squared\" comment in 2018, and Peter Schiff's numerous predictions. Many of these critics have since softened their stance or been proven dramatically wrong by Bitcoin's performance." },
  { question: "How accurate are these obituaries?", answer: "Not accurate at all. Every single Bitcoin obituary has been proven wrong by Bitcoin's continued existence and growth. The average ROI if you had bought Bitcoin at each \"death\" declaration is over 10,000%, demonstrating how wrong the critics have been." },
  { question: "What happens to BTC price after obituaries?", answer: "Historically, Bitcoin has recovered from every price crash or criticism that prompted an obituary. Many of the largest gains have come shortly after periods when Bitcoin was declared dead, making these obituaries potential buying opportunities in retrospect." },
  { question: "Who declares Bitcoin dead most often?", answer: "Traditional financial media, economists trained in traditional finance, gold bugs, and government officials are the most frequent sources of Bitcoin obituaries. Peter Schiff and Nouriel Roubini are particularly prolific critics with multiple obituaries each." },
  { question: "Why do people keep declaring Bitcoin dead?", answer: "Critics often misunderstand Bitcoin's technology, have vested interests in traditional finance, or base their predictions on short-term price volatility rather than long-term fundamentals. Many also fail to recognize Bitcoin's unique properties and network effects." },
  { question: "Can I see ROI if I bought at each obituary?", answer: "Yes! Each obituary in our tracker shows the exact ROI you would have earned if you had bought Bitcoin at that price and held until today. The results consistently show massive gains, with many obituaries offering 10,000%+ returns." },
  { question: "Are these real quotes or paraphrased?", answer: "All quotes in our database are real statements from verified sources. We include links to original articles when available and attribute each obituary to its source. We maintain accuracy and authenticity in all our data." },
  { question: "Is the data updated regularly?", answer: "Yes, we continuously monitor news sources, social media, and public statements to add new Bitcoin obituaries as they occur. Our database is updated weekly to capture the latest critics and maintain a comprehensive historical record." },
];

const faqsTr = [
  { question: "Bitcoin nekrologu sayılmak için ne gerekir?", answer: "Bitcoin nekrologu, Bitcoin'i 'öldü' ilan eden, başarısız olacağını tahmin eden veya geleceği olmadığını iddia eden herhangi bir kamuoyu açıklaması, makale veya yorumdur. Bu, medya, finans uzmanları, kurumlar ve devlet yetkililerinden gelen açıklamaları kapsar." },
  { question: "Bitcoin kaç kez ölü ilan edildi?", answer: "Kapsamlı veri tabanımıza göre Bitcoin 2010'dan bu yana 400'den fazla kez 'ölü' ilan edildi. Yeni eleştirmenler ortaya çıktıkça bu sayı artmaya devam ederken, Bitcoin gelişmeyi ve yeni benimseme kilometre taşlarına ulaşmayı sürdürmektedir." },
  { question: "En ünlü Bitcoin nekrologu neydi?", answer: "En ünlü örnekler arasında Jamie Dimon'un 2017'de onu 'sahtekar' olarak nitelendirmesi, Warren Buffett'ın 2018'deki 'kare sıçan zehiri' yorumu ve Peter Schiff'in çok sayıda tahmini yer almaktadır. Bu eleştirmenlerin pek çoğu o tarihten bu yana tutumlarını yumuşattı veya Bitcoin'in performansıyla dramatik biçimde yanıldığı kanıtlandı." },
  { question: "Bu nekrologlar ne kadar doğru?", answer: "Hiç doğru değil. Her Bitcoin nekrologu, Bitcoin'in varlığını sürdürmesi ve büyümesiyle yanlışlandı. Her 'ölüm' ilanında Bitcoin satın alsaydınız elde edeceğiniz ortalama YG %10.000'in üzerindedir; bu da eleştirmenlerin ne kadar yanıldığını göstermektedir." },
  { question: "Nekrologlardan sonra BTC fiyatına ne olur?", answer: "Tarihsel olarak Bitcoin, nekrologa yol açan her fiyat çöküşünden veya eleştiriden kurtuldu. En büyük kazançların çoğu, Bitcoin'in ölü ilan edildiği dönemlerin hemen ardından geldi; bu da geriye dönük olarak bu nekrologları potansiyel alım fırsatları haline getirdi." },
  { question: "Bitcoin'i en sık kim ölü ilan ediyor?", answer: "Geleneksel finansal medya, geleneksel finans eğitimi almış ekonomistler, altın yanlıları ve devlet yetkilileri Bitcoin nekrologlarının en sık kaynaklarıdır. Peter Schiff ve Nouriel Roubini, her biri birden fazla nekrologla özellikle üretken eleştirmenlerdir." },
  { question: "İnsanlar neden Bitcoin'i ölü ilan etmeyi sürdürüyor?", answer: "Eleştirmenler genellikle Bitcoin'in teknolojisini yanlış anlar, geleneksel finansta çıkarları vardır veya tahminlerini uzun vadeli temeller yerine kısa vadeli fiyat oynaklığına dayandırır. Pek çoğu ayrıca Bitcoin'in benzersiz özelliklerini ve ağ etkilerini kavrayamamaktadır." },
  { question: "Her nekirologda alsaydım YG'yi görebilir miyim?", answer: "Evet! Takipçimizdeki her nekirolog, o fiyattan Bitcoin satın almış olsaydınız ve bugüne kadar tutsaydınız elde edeceğiniz tam YG'yi göstermektedir. Sonuçlar, pek çok nekrologun %10.000'in üzerinde getiri sunmasıyla sürekli olarak büyük kazançlar göstermektedir." },
  { question: "Bunlar gerçek alıntılar mı yoksa özetlenmiş mi?", answer: "Veri tabanımızdaki tüm alıntılar doğrulanmış kaynaklardan gerçek açıklamalardır. Mevcut olduğunda orijinal makalelere bağlantılar ekliyoruz ve her nekrologu kaynağına atfediyoruz. Tüm verilerimizde doğruluk ve özgünlüğü koruyoruz." },
  { question: "Veriler düzenli olarak güncelleniyor mu?", answer: "Evet, oluştukça yeni Bitcoin nekrologları eklemek için haber kaynaklarını, sosyal medyayı ve kamuoyu açıklamalarını sürekli olarak izliyoruz. Veri tabanımız, en yeni eleştirmenleri yakalamak ve kapsamlı bir tarihsel kayıt tutmak için haftalık olarak güncellenmektedir." },
];

export const ObituariesFAQSection = () => {
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
            {tr ? 'Bitcoin nekrologları hakkında bilmeniz gereken her şey' : 'Everything you need to know about Bitcoin obituaries'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-xl px-6">
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
