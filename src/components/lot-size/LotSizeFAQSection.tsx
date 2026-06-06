import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqsEn = [
  { question: 'How to calculate lot size on BTC?', answer: 'Lot Size = (Account Balance × Risk%) ÷ (Stop Loss Distance in USD × Tick Value). For example: $10,000 account, 1% risk ($100), stop loss $500 away = 0.2 lot. Our calculator handles this automatically with live BTC prices.' },
  { question: 'How much is 0.01 lot size in Bitcoin?', answer: '0.01 lots = 0.01 BTC (one micro lot). At a BTC price of $85,000, that equals $850. This is the minimum lot size on most MT4/MT5 forex brokers like Exness and IC Markets.' },
  { question: 'How much is 1 lot of Bitcoin?', answer: '1 standard lot of Bitcoin = 1 BTC. At $85,000 per BTC, 1 lot is worth $85,000. This is the standard contract size on most MT4/MT5 brokers. Crypto exchanges may use different contract sizes.' },
  { question: 'How much is 0.001 BTC lot size in dollars?', answer: '0.001 BTC (1 nano lot) at $85,000 BTC price = $85. Equivalent to 100,000 satoshis. This is the minimum lot size on Binance and Bybit futures.' },
  { question: 'How do I calculate my lot size?', answer: 'Use the formula: Lot Size = Risk Amount ÷ (Stop Loss Distance × Pip Value). Risk Amount = Account Balance × Risk Percentage. For example, risking 1% of a $5,000 account ($50) with a $1,000 stop loss distance gives 0.05 lots.' },
  { question: 'Is 0.01 a good lot size?', answer: '0.01 (micro lot) is recommended for beginners and small accounts under $1,000. Professional traders adjust lot size based on their account size and risk rules, typically risking 1-2% per trade.' },
  { question: 'What lot size is $10?', answer: 'At $85,000 BTC, $10 equals approximately 0.000118 BTC, or 0.000118 lots. The minimum tradeable lot on most brokers is 0.01 (micro lot), which equals ~$850. For very small amounts, consider spot buying instead of trading lots.' },
];

const faqsTr = [
  { question: "BTC'de lot büyüklüğü nasıl hesaplanır?", answer: "Lot Büyüklüğü = (Hesap Bakiyesi × Risk%) ÷ (USD cinsinden Stop Loss Mesafesi × Tick Değeri). Örneğin: 10.000 $ hesap, %1 risk (100 $), 500 $ uzaklıkta stop loss = 0,2 lot. Hesap makinemiz bunu canlı BTC fiyatlarıyla otomatik olarak halleder." },
  { question: "0,01 lot büyüklüğü Bitcoin'de ne kadar?", answer: "0,01 lot = 0,01 BTC (bir mikro lot). 85.000 $ BTC fiyatıyla bu 850 $'a eşittir. Bu, Exness ve IC Markets gibi çoğu MT4/MT5 forex aracısındaki minimum lot büyüklüğüdür." },
  { question: "1 lot Bitcoin ne kadar?", answer: "1 standart lot Bitcoin = 1 BTC. BTC başına 85.000 $'da 1 lot 85.000 $ değerindedir. Bu, çoğu MT4/MT5 aracısındaki standart sözleşme büyüklüğüdür. Kripto borsaları farklı sözleşme büyüklükleri kullanabilir." },
  { question: "0,001 BTC lot büyüklüğü dolar olarak ne kadar?", answer: "0,001 BTC (1 nano lot) 85.000 $ BTC fiyatıyla = 85 $. 100.000 satoshiye eşdeğerdir. Bu, Binance ve Bybit vadeli işlemlerindeki minimum lot büyüklüğüdür." },
  { question: "Lot büyüklüğümü nasıl hesaplarım?", answer: "Formülü kullanın: Lot Büyüklüğü = Risk Tutarı ÷ (Stop Loss Mesafesi × Pip Değeri). Risk Tutarı = Hesap Bakiyesi × Risk Yüzdesi. Örneğin, 1.000 $ stop loss mesafesiyle 5.000 $'lık bir hesabın %1'ini (50 $) riske atmanız 0,05 lot verir." },
  { question: "0,01 iyi bir lot büyüklüğü mü?", answer: "0,01 (mikro lot), 1.000 $'ın altındaki başlangıç seviyesi yatırımcılar ve küçük hesaplar için önerilir. Profesyonel yatırımcılar lot büyüklüğünü hesap büyüklüklerine ve risk kurallarına göre ayarlar, genellikle işlem başına %1-2 riske girerler." },
  { question: "10 $'lık lot büyüklüğü nedir?", answer: "85.000 $ BTC'de 10 $, yaklaşık 0,000118 BTC veya 0,000118 lot'a eşittir. Çoğu aracıdaki minimum işlem lotı ~850 $'a eşit olan 0,01 (mikro lot)'tur. Çok küçük miktarlar için işlem lotları yerine spot satın almayı düşünün." },
];

export const LotSizeFAQSection = () => {
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
            {tr ? 'Bitcoin Lot Büyüklüğü Hakkında Sık Sorulan Sorular' : 'Common Bitcoin Lot Size Questions Answered'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {tr
              ? 'Bitcoin lot büyüklükleri, pozisyon boyutlandırma ve risk yönetimi hakkında bilmeniz gereken her şey'
              : 'Everything you need to know about Bitcoin lot sizes, position sizing, and risk management'}
          </p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border/50 rounded-xl px-5">
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
