import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const cagrFaqs = [
  { question: "What is CAGR?", answer: "CAGR (Compound Annual Growth Rate) is the mean annual growth rate of an investment over a specified period longer than one year. It represents one of the most accurate ways to calculate returns that grow or decline over time, smoothing out volatility to show the average yearly return." },
  { question: "What is Bitcoin's all-time CAGR?", answer: "Since the first tradable price in mid-2010 (~$0.05), Bitcoin's CAGR through January 2026 is approximately 145% per year — making it the best-performing major asset of the last 15 years by a wide margin. Over the more recent 10-year window (2016-2026), Bitcoin's CAGR is approximately 71%, still multiples ahead of stocks, gold, and real estate." },
  { question: "What is Bitcoin's CAGR over the last 5 years?", answer: "From January 2021 to January 2026, Bitcoin's CAGR is approximately 26% per year. The 5-year window includes both the 2021 bull market peak and the 2022 bear market drawdown, which moderates the figure significantly compared to longer windows." },
  { question: "How is Bitcoin's CAGR compared to traditional assets?", answer: "Over the 2016–2026 period, Bitcoin's CAGR significantly outperformed Gold (≈9%), the S&P 500 (≈11%), Nasdaq 100 (≈17%), and Real Estate (≈1%). However, Bitcoin also exhibited much higher volatility (≈72% annualized) and larger maximum drawdowns (-77.6% in 2018), making it a higher-risk, higher-reward asset class." },
  { question: "What CAGR does Bitcoin need to reach $1 million?", answer: "Starting from approximately $93,000 today, Bitcoin would need a CAGR of roughly 80% per year to reach $1,000,000 in 3 years, 38% per year in 5 years, or 27% per year in 10 years. Bitcoin's historical CAGR since 2013 is approximately 60% annually, though past performance does not guarantee future results." },
  { question: "What CAGR does Bitcoin need to reach $500,000?", answer: "From $93,000 today, Bitcoin needs roughly a 75% CAGR over 3 years, 40% over 5 years, or 19% over 10 years to reach $500,000. This is well within Bitcoin's historical range of returns over multi-year windows, though it is by no means guaranteed." },
  { question: "Does past CAGR predict future returns?", answer: "No. Past performance does not guarantee future results. CAGR is a backward-looking metric that shows what happened historically. Future returns depend on adoption, regulation, macroeconomic conditions, and many unpredictable factors. Use CAGR as one data point among many — and always pair it with drawdown and volatility measurements." },
  { question: "What is maximum drawdown?", answer: "Maximum drawdown (Max DD) measures the largest peak-to-trough decline in an asset's price during the measurement period. For example, Bitcoin experienced a -77.6% drawdown from its 2017 peak to its 2018 bottom and a -65% drawdown from November 2021 to November 2022. This metric helps assess the worst-case scenario for each asset." },
  { question: "How do I calculate Bitcoin's CAGR myself?", answer: "Use the formula CAGR = (End Value / Start Value)^(1 / Years) − 1. For example: $10,000 invested in Bitcoin in January 2016 (at ~$434) was worth approximately $2.15M in January 2026. So CAGR = (2,150,000 / 10,000)^(1/10) − 1 ≈ 0.715, or 71.5% per year." },
  { question: "What historical data does this calculator use?", answer: "This calculator uses real historical prices from January 2016 to January 2026 (10-year window). Bitcoin prices come from CoinGecko, while Gold, S&P 500 (SPY), Nasdaq 100 (QQQ) and Real Estate (VNQ ETF) prices are sourced from market data. All prices are USD-denominated yearly opening prices." },
  { question: "What is a reverse CAGR calculator?", answer: "A reverse CAGR calculator finds the annual growth rate required to reach a target value from a starting value over a set number of years. The formula is: Required CAGR = (Target ÷ Start)^(1 ÷ Years) − 1. For Bitcoin, this tells you the annualized return needed for BTC to reach your price target by your chosen date." },
  { question: "Why is Bitcoin's CAGR shrinking over time?", answer: "As Bitcoin's market capitalization grows from billions into trillions of dollars, the same percentage gains require many more dollars of inflows. This pattern — known as 'diminishing returns' — has been visible across every halving cycle. The 1st cycle delivered ~145% CAGR, the 2nd ~102%, the 3rd ~55%, and the current 4th cycle is tracking near 48%." },
  { question: "What is Bitcoin's annualized return since 2013?", answer: "From January 2013 (~$13) to January 2026 (~$93,000), Bitcoin's annualized return is approximately 89% per year over 13 years. Formula: (93,000 / 13)^(1/13) − 1 ≈ 0.89. This beats every major asset class by more than 6× and reflects Bitcoin's transition from a fringe experiment to a $1.8T+ macro asset — but the annualized figure is compressing every cycle as the base gets larger." },
];

const cagrFaqsTr = [
  { question: "BYBBO nedir?", answer: "BYBBO (Bileşik Yıllık Büyüme Oranı), bir yıldan uzun belirli bir dönem için bir yatırımın yıllık ortalama büyüme oranıdır. Zaman içinde büyüyen veya azalan getirileri hesaplamak için en doğru yollardan birini temsil eder; volatiliteyi yumuşatarak ortalama yıllık getiriyi gösterir." },
  { question: "Bitcoin'in tüm zamanların BYBBO'su nedir?", answer: "2010 yılı ortasındaki ilk işlem fiyatından (~0,05 $) Ocak 2026'ya kadar Bitcoin'in BYBBO'su yılda yaklaşık %145'tir; bu onu son 15 yılın büyük bir farkla en iyi performans gösteren büyük varlığı yapar. Daha yakın 10 yıllık pencerede (2016-2026) Bitcoin'in BYBBO'su yaklaşık %71'dir; bu da hisse senetleri, altın ve gayrimenkulün katları üzerindedir." },
  { question: "Bitcoin'in son 5 yıllık BYBBO'su nedir?", answer: "Ocak 2021'den Ocak 2026'ya Bitcoin'in BYBBO'su yılda yaklaşık %26'dır. 5 yıllık pencere hem 2021 boğa piyasası zirvesini hem de 2022 ayı piyasası düşüşünü kapsar; bu durum rakamı daha uzun pencerelere kıyasla önemli ölçüde ılımlı kılar." },
  { question: "Bitcoin'in BYBBO'su geleneksel varlıklarla nasıl karşılaştırılır?", answer: "2016-2026 döneminde Bitcoin'in BYBBO'su Altın (~%9), S&P 500 (~%11), Nasdaq 100 (~%17) ve Gayrimenkulü (~%1) önemli ölçüde geride bırakmıştır. Ancak Bitcoin aynı zamanda çok daha yüksek volatilite (~%72 yıllıklandırılmış) ve daha büyük maksimum düşüşler (2018'de -%77,6) sergilemiştir; bu onu daha yüksek riskli, daha yüksek ödüllü bir varlık sınıfı yapar." },
  { question: "Bitcoin'in 1 milyon dolara ulaşması için gereken BYBBO nedir?", answer: "Bugün yaklaşık 93.000 $'dan başlayan Bitcoin'in 3 yılda 1.000.000 $'a ulaşması için yaklaşık yılda %80, 5 yılda %38 veya 10 yılda %27 BYBBO'ya ihtiyacı vardır. Bitcoin'in 2013'ten bu yana tarihsel BYBBO'su yaklaşık yıllık %60'tır, ancak geçmiş performans gelecekteki sonuçları garanti etmez." },
  { question: "Bitcoin'in 500.000 dolara ulaşması için gereken BYBBO nedir?", answer: "Bugünkü 93.000 $'dan 500.000 $'a ulaşmak için Bitcoin'in 3 yıl içinde yaklaşık %75, 5 yılda %40 veya 10 yılda %19 BYBBO'ya ihtiyacı vardır. Bu, çok yıllı pencerelerde Bitcoin'in tarihsel getiri aralığı içindedir; ancak kesinlikle garanti değildir." },
  { question: "Geçmiş BYBBO gelecekteki getirileri öngörür mü?", answer: "Hayır. Geçmiş performans gelecekteki sonuçları garanti etmez. BYBBO, tarihsel olarak neler yaşandığını gösteren geriye dönük bir metriktir. Gelecekteki getiriler benimseme, düzenleme, makroekonomik koşullar ve pek çok tahmin edilemez faktöre bağlıdır. BYBBO'yu birçok veri noktasından biri olarak kullanın ve her zaman düşüş ve volatilite ölçümleriyle birleştirin." },
  { question: "Maksimum düşüş nedir?", answer: "Maksimum düşüş (Max DD), ölçüm döneminde bir varlığın fiyatındaki en büyük zirve-dip düşüşünü ölçer. Örneğin Bitcoin, 2017 zirvesinden 2018 dibine -%77,6 düşüş ve Kasım 2021'den Kasım 2022'ye -%65 düşüş yaşadı. Bu metrik, her varlık için en kötü senaryoyu değerlendirmeye yardımcı olur." },
  { question: "Bitcoin'in BYBBO'sunu kendim nasıl hesaplarım?", answer: "BYBBO = (Bitiş Değeri / Başlangıç Değeri)^(1 / Yıl) − 1 formülünü kullanın. Örneğin: Ocak 2016'da Bitcoin'e (~434 $'a) yapılan 10.000 $'lık yatırım Ocak 2026'da yaklaşık 2,15 milyon $ değerindeydi. Dolayısıyla BYBBO = (2.150.000 / 10.000)^(1/10) − 1 ≈ 0,715, yani yılda yaklaşık %71,5." },
  { question: "Bu hesap makinesi hangi tarihsel verileri kullanıyor?", answer: "Bu hesap makinesi Ocak 2016'dan Ocak 2026'ya kadar gerçek tarihsel fiyatları (10 yıllık pencere) kullanmaktadır. Bitcoin fiyatları CoinGecko'dan, Altın, S&P 500 (SPY), Nasdaq 100 (QQQ) ve Gayrimenkul (VNQ ETF) fiyatları ise piyasa verilerinden alınmaktadır. Tüm fiyatlar USD cinsinden yıllık açılış fiyatlarıdır." },
  { question: "Ters BYBBO hesaplayıcısı nedir?", answer: "Ters BYBBO hesaplayıcısı, belirli sayıda yılda bir başlangıç değerinden hedef değere ulaşmak için gereken yıllık büyüme oranını bulur. Formül: Gereken BYBBO = (Hedef ÷ Başlangıç)^(1 ÷ Yıl) − 1. Bitcoin için bu, BTC'nin seçtiğiniz tarihe kadar fiyat hedefinize ulaşması için gereken yıllıklandırılmış getiriyi söyler." },
  { question: "Bitcoin'in BYBBO'su neden zamanla azalıyor?", answer: "Bitcoin'in piyasa değeri milyarlarca dolardan trilyon dolara büyüdükçe, aynı yüzdelik kazançlar çok daha fazla dolar girişi gerektirir. 'Azalan getiriler' olarak bilinen bu örüntü, her yarılanma döngüsünde görülmüştür. 1. döngü ~%145 BYBBO sundu, 2. döngü ~%102, 3. döngü ~%55 ve mevcut 4. döngü ~%48 civarında seyrediyor." },
];

export const cagrFaqJsonLd = cagrFaqs.map((f) => ({ q: f.question, a: f.answer }));
export const cagrFaqJsonLdTr = cagrFaqsTr.map((f) => ({ q: f.question, a: f.answer }));

export const CAGRFAQSection = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const faqs = tr ? cagrFaqsTr : cagrFaqs;

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
              ? 'Bitcoin BYBBO ve varlık performans karşılaştırması hakkında her şey'
              : 'Everything about Bitcoin CAGR and asset performance comparison'}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border/50 rounded-xl px-6">
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
