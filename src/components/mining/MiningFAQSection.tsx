import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: "How does the Bitcoin mining profitability calculator work?", answer: "Our calculator uses your mining hardware specifications (hash rate, power consumption), electricity costs, and current network conditions (difficulty, block reward) to estimate your potential Bitcoin mining profits. It factors in pool fees and projects earnings over 12 months with adjustable difficulty increases." },
  { question: "What is hash rate and why does it matter?", answer: "Hash rate measures your mining hardware's computational power, expressed in Terahashes per second (TH/s). Higher hash rates mean more attempts to solve blocks per second, directly correlating with your potential earnings. Modern ASIC miners like the Antminer S21 offer 200+ TH/s." },
  { question: "How does network difficulty affect my mining profits?", answer: "Network difficulty adjusts approximately every 2 weeks to maintain a 10-minute block time. As more miners join the network, difficulty increases, reducing individual rewards. Our calculator lets you model different monthly difficulty increase scenarios (historical average is ~3.5%)." },
  { question: "What happened to Bitcoin's block reward in 2024?", answer: "In April 2024, Bitcoin experienced its fourth halving, reducing the block reward from 6.25 BTC to 3.125 BTC. This halving occurs every 210,000 blocks (~4 years) and is a key factor in Bitcoin's deflationary monetary policy. The next halving is expected around 2028." },
  { question: "What electricity cost is profitable for Bitcoin mining?", answer: "Profitability depends on multiple factors, but generally, miners need electricity costs below $0.10/kWh to be competitive. Industrial operations often secure rates of $0.03-$0.06/kWh. Our calculator helps you determine your break-even electricity rate based on current conditions." },
  { question: "Should I join a mining pool?", answer: "Yes, solo mining is virtually impossible for individual miners today due to high network difficulty. Mining pools combine hash power from many miners and distribute rewards proportionally (minus a small fee, typically 1-3%). This provides more consistent, predictable income." },
  { question: "How accurate are these mining projections?", answer: "Our calculations are based on current network conditions and mathematical formulas. However, actual results will vary due to: Bitcoin price fluctuations, difficulty adjustments, hardware downtime, and pool luck variance. Use this as a planning tool, not a guarantee of returns." },
  { question: "What are the hidden costs of Bitcoin mining?", answer: "Beyond hardware and electricity, consider: cooling/ventilation costs, hosting fees, maintenance, hardware depreciation, internet connectivity, and potential noise reduction. These can add 10-30% to your operating costs." },
  { question: "Is Bitcoin mining still profitable in 2026?", answer: "It depends on your electricity rate. At $0.05/kWh with an Antminer S21, mining generates roughly $8-10/day profit after electricity. At $0.12/kWh, margins are slim. Run the calculator above with your actual hardware specs and electricity cost to get a real answer." },
  { question: "What electricity rate do I need to mine Bitcoin profitably?", answer: "Most miners need rates below $0.10/kWh to stay profitable with current-generation hardware. The sweet spot is $0.03-$0.07/kWh, which is common in regions with hydroelectric power (Quebec, Iceland, Paraguay) or stranded natural gas operations." },
  { question: "What is the break-even BTC price shown in the results?", answer: "It is the BTC spot price at which your daily mining revenue exactly covers daily electricity (pool fee already deducted): break-even price = daily electricity cost ÷ daily BTC mined. Below that price, each day of mining loses money on power alone, before hardware payback is considered. The result card shows this alongside Hardware Payback, which answers a different question — how many days until daily profit repays your hardware cost." },
];

const faqsTr = [
  { question: "Bitcoin madenciliği kârlılık hesaplayıcısı nasıl çalışır?", answer: "Hesaplayıcımız, potansiyel Bitcoin madenciliği kârlarınızı tahmin etmek için madencilik donanımı spesifikasyonlarınızı (hash hızı, güç tüketimi), elektrik maliyetlerini ve mevcut ağ koşullarını (zorluk, blok ödülü) kullanır. Havuz ücretlerini hesaba katar ve ayarlanabilir zorluk artışlarıyla 12 aylık kazançları projelendirir." },
  { question: "Hash hızı nedir ve neden önemlidir?", answer: "Hash hızı, saniye başına Terahash (TH/s) cinsinden ifade edilen madencilik donanımınızın hesaplama gücünü ölçer. Daha yüksek hash hızları, saniye başına daha fazla blok çözme girişimi anlamına gelir ve potansiyel kazançlarınızla doğrudan ilişkilidir. Antminer S21 gibi modern ASIC madenciler 200+ TH/s sunar." },
  { question: "Ağ zorluğu madencilik kârlarımı nasıl etkiler?", answer: "Ağ zorluğu, 10 dakikalık blok süresini korumak için yaklaşık her 2 haftada bir ayarlanır. Ağa daha fazla madenci katıldıkça zorluk artar ve bireysel ödüller azalır. Hesaplayıcımız farklı aylık zorluk artışı senaryolarını modellemenize olanak tanır (tarihsel ortalama yaklaşık %3,5'tir)." },
  { question: "2024'te Bitcoin'in blok ödülüne ne oldu?", answer: "Nisan 2024'te Bitcoin dördüncü yarılanmasını yaşadı ve blok ödülü 6,25 BTC'den 3,125 BTC'ye indi. Bu yarılanma her 210.000 blokta (~4 yılda bir) gerçekleşir ve Bitcoin'in deflasyonist para politikasının temel bir faktörüdür. Bir sonraki yarılanmanın 2028 civarında olması beklenmektedir." },
  { question: "Bitcoin madenciliğinde kârlı elektrik maliyeti nedir?", answer: "Kârlılık birden fazla faktöre bağlıdır, ancak genel olarak madencilerin rekabetçi olabilmesi için elektrik maliyetlerinin 0,10 $/kWh'nin altında olması gerekir. Endüstriyel operasyonlar genellikle 0,03-0,06 $/kWh oranlarını güvence altına alır. Hesaplayıcımız mevcut koşullara göre başabaş elektrik oranınızı belirlemenize yardımcı olur." },
  { question: "Madencilik havuzuna katılmalı mıyım?", answer: "Evet, yüksek ağ zorluğu nedeniyle bugün bireysel madenciler için tek başına madencilik neredeyse imkânsızdır. Madencilik havuzları birçok madencinin hash gücünü birleştirir ve ödülleri orantılı olarak dağıtır (küçük bir ücret eksi, genellikle %1-3). Bu daha tutarlı, öngörülebilir gelir sağlar." },
  { question: "Bu madencilik projeksiyonları ne kadar doğru?", answer: "Hesaplamalarımız mevcut ağ koşullarına ve matematiksel formüllere dayanmaktadır. Ancak gerçek sonuçlar Bitcoin fiyat dalgalanmaları, zorluk ayarlamaları, donanım arıza süresi ve havuz şans varyansı nedeniyle farklılık gösterecektir. Bunu getiri garantisi değil planlama aracı olarak kullanın." },
  { question: "Bitcoin madenciliğinin gizli maliyetleri nelerdir?", answer: "Donanım ve elektriğin ötesinde şunları düşünün: soğutma/havalandırma maliyetleri, barındırma ücretleri, bakım, donanım amortismanı, internet bağlantısı ve potansiyel gürültü azaltma. Bunlar işletme maliyetlerinize %10-30 ekleyebilir." },
  { question: "Bitcoin madenciliği 2026'da hâlâ kârlı mı?", answer: "Elektrik oranınıza bağlıdır. Antminer S21 ile 0,05 $/kWh'de madencilik, elektrikten sonra günde yaklaşık 8-10 dolar kâr üretir. 0,12 $/kWh'de marjlar oldukça daralmaktadır. Gerçek bir cevap almak için yukarıdaki hesaplayıcıyı gerçek donanım özellikleri ve elektrik maliyetiyle çalıştırın." },
  { question: "Bitcoin madenciliğinde kârlı olmak için hangi elektrik oranına ihtiyacım var?", answer: "Çoğu madenci, mevcut nesil donanımlarla kârlı kalmak için 0,10 $/kWh'nin altındaki oranlara ihtiyaç duyar. Tatlı nokta, hidroelektrik gücüne sahip bölgelerde (Quebec, İzlanda, Paraguay) veya atıl doğalgaz operasyonlarında yaygın olan 0,03-0,07 $/kWh'dir." },
];

export const MiningFAQSection = () => {
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
              ? 'Bitcoin madenciliği kârlılığı ve ağ koşulları hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin mining profitability and network conditions'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
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
