import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqs = {
tr: [
  { question: 'Bitcoin’de HODL ne demek?', answer: 'HODL, Bitcoin forumundaki “hold” yazım hatasından türemiştir. Fiyat dalgalanmasına aldırmadan uzun vadeli tutma stratejisini ifade eder.' },
  { question: 'HODL, maliyet ortalamasından daha mı iyi?', answer: 'Hiçbiri her durumda “daha iyi” değildir. HODL toplu para ile yatırım yapıp uzun vadeli büyümeye inanıyorsanız uygundur. DCA ise zamanlama riskini azaltır.' },
  { question: '"Düşüşten al" stratejisi nedir?', answer: 'Bu strateji, alım yapmadan önce önemli fiyat düşüşlerini bekler. Piyasa düzeltmelerinden yararlanmayı hedefler.' },
  { question: 'Dengeleme nasıl çalışır?', answer: 'Bitcoin ve nakit arasında sabit bir oranı korur. Bitcoin yükselince biraz satılır, düşünce biraz alınır.' },
  { question: 'Bu hesaplayıcı ücretleri içeriyor mu?', answer: 'Hayır. İşlem ücretleri, borsa ücretleri ve vergiler dahil değildir.' },
  { question: 'En düşük risk hangi stratejide?', answer: 'Genelde dengeleme en düşük oynaklığa sahiptir. DCA da riski azaltır.' },
  { question: 'DCA sıklığını özelleştirebilir miyim?', answer: 'Şimdilik haftalık ve aylık DCA desteklenir.' },
  { question: 'Sharpe oranı nedir?', answer: 'Risk başına getiriyi ölçen bir orandır. Yüksek olması daha iyidir.' },
  { question: 'Piyasa koşullarına göre strateji değiştirmeli miyim?', answer: 'Sürekli strateji değiştirmek genellikle kötü sonuç verir.' },
  { question: 'Tarihsel performans geleceği ne kadar iyi yansıtır?', answer: 'Geçmiş performans geleceği garanti etmez.' },
  { question: 'Zaman içinde Bitcoin alım satımını simüle edebilir miyim?', answer: 'Evet, farklı stratejileri tarihsel verilerle geriye dönük test edebilirsiniz.' },
  { question: 'Bitcoin’i ne zaman alıp satmalıyım?', answer: 'Evrensel bir cevap yok; hesaplayıcı farklı zamanlama yaklaşımlarını test etmenizi sağlar.' },
  { question: 'HODL 2026’da hâlâ kârlı mı?', answer: 'Tarihsel olarak evet, ancak gelecekteki sonuçlar piyasa koşullarına bağlıdır.' },
  { question: 'Bitcoin’i ne kadar süre HODL etmeliyim?', answer: 'Tarihsel olarak en az bir tam döngü, yani yaklaşık 3.5-4 yıl.' },
  { question: 'Bitcoin HODL ederek para kaybeden oldu mu?', answer: 'Evet, genellikle zorunlu satış, anahtar kaybı veya borsa çöküşü nedeniyle.' },
  { question: 'HODL, DCA’yı yener mi?', answer: 'Tarihsel olarak toplu alım çoğu dönemde DCA’yı geride bırakır.' },
  { question: 'Bitcoin tarihindeki en uzun kârlı HODL süresi nedir?', answer: 'Bitcoin tarihinde 4+ yıllık tüm HODL dönemleri kârlı olmuştur.' },
  { question: 'Bitcoin HODL etmeli miyim yoksa aktif işlem mi yapmalıyım?', answer: 'İstatistiksel olarak HODL, çoğu bireysel yatırımcı için daha iyi risk-getiri sunar.' }
],
en: [
  { question: 'What does HODL mean in Bitcoin?', answer: 'HODL is a term derived from a misspelling of "hold" in a Bitcoin forum post. It has become a popular strategy meaning to buy and hold Bitcoin long-term, regardless of price volatility, rather than trying to time the market.' },
  { question: 'Is HODL better than dollar cost averaging?', answer: 'Neither strategy is universally "better" – it depends on your situation. HODL works well when you have a lump sum to invest and believe in long-term growth. DCA reduces timing risk by spreading purchases over time, which can be psychologically easier and reduce the impact of volatility.' },
  { question: 'What is the "Buy the Dip" strategy?', answer: 'Buy the Dip involves waiting for significant price drops (typically 10% or more from recent peaks) before making purchases. This strategy attempts to capitalize on market corrections but requires patience and may result in fewer purchases if the price keeps rising.' },
  { question: 'How does rebalancing work?', answer: 'Rebalancing maintains a fixed ratio between Bitcoin and cash (like 60/40). When Bitcoin rises, you sell some to restore the ratio. When it falls, you buy more. This forces you to "buy low, sell high" systematically, reducing volatility but potentially limiting upside.' },
  { question: 'Does this calculator include fees?', answer: 'No, the calculator shows theoretical performance without accounting for transaction fees, exchange fees, or taxes. Real-world returns will be lower due to these costs, which vary by platform and strategy complexity.' },
  { question: 'Which strategy has the lowest risk?', answer: 'Rebalancing typically has the lowest volatility because it maintains exposure to both Bitcoin and cash. DCA strategies also reduce risk by spreading purchases over time. Pure HODL has the highest volatility but may offer the highest returns in strong bull markets.' },
  { question: 'Can I customize the DCA frequency?', answer: 'Currently, the calculator supports weekly and monthly DCA frequencies. These are the most common intervals that align with typical salary payments and keep transaction costs reasonable.' },
  { question: 'What is a Sharpe ratio?', answer: 'The Sharpe ratio measures risk-adjusted returns – essentially, how much return you get per unit of risk taken. A higher Sharpe ratio is better, indicating more efficient returns relative to volatility. Values above 1.0 are generally considered good.' },
  { question: 'Should I change strategies based on market conditions?', answer: 'Constantly switching strategies often leads to worse outcomes due to poor timing and emotional decisions. Most successful investors stick to one strategy aligned with their goals and risk tolerance, rather than trying to predict market movements.' },
  { question: 'How accurate is historical performance for future results?', answer: "Past performance does not guarantee future results. Bitcoin's historical returns have been exceptional, but future performance may differ significantly. Use this calculator as an educational tool to understand strategy differences, not as a prediction of future returns." },
  { question: 'Can I simulate buying and selling Bitcoin over time?', answer: 'Yes — our HODL strategy calculator acts as a Bitcoin buy/sell simulator. Set a date range, choose strategies like HODL, DCA, or buy-the-dip, and see how each approach would have performed with real historical price data.' },
  { question: 'When should I buy or sell Bitcoin?', answer: 'There is no universal answer, but our calculator lets you backtest different buy and sell timing strategies against historical data. Compare lump-sum buying, regular DCA purchases, and dip-buying to see which approach produced the best risk-adjusted returns.' },
  { question: 'Is HODL still profitable in 2026?', answer: 'Historically, every 4-year HODL window in Bitcoin\'s history has been profitable, including entries at previous all-time highs. Whether HODL remains profitable going forward depends on continued network adoption, but the structural drivers (fixed supply, halvings, ETF demand) are still in place.' },
  { question: 'How long should I HODL Bitcoin?', answer: 'The historical sweet spot is at least one full Bitcoin cycle, which runs roughly 3.5 to 4 years between halvings. Longer holds (5+ years) have produced positive returns 100% of the time in BTC\'s history. The shorter your horizon, the more your outcome depends on lucky timing.' },
  { question: 'Has anyone lost money HODLing Bitcoin?', answer: 'Yes, but not because the strategy failed. People who lost money HODLing usually had to sell during a drawdown for personal reasons, lost access to their wallet, or held on a failed exchange (Mt. Gox, FTX, Celsius). The strategy itself has produced positive returns in every multi-year window.' },
  { question: 'Does HODL beat dollar-cost averaging?', answer: 'Lump-sum HODL outperforms DCA roughly 65-70% of the time historically because Bitcoin trends up over multi-year windows. DCA wins in deep bear markets and when starting near cycle tops. Use our calculator above to backtest both for your specific date range.' },
  { question: 'What is the longest profitable HODL period in Bitcoin history?', answer: 'Any HODL period of 4+ years has been profitable in Bitcoin\'s history. The longest single profitable hold (2010 to today) returned over 100,000,000%. Even shorter 3-year holds starting at cycle peaks have eventually turned positive within the next cycle.' },
  { question: 'Should I HODL Bitcoin or trade actively?', answer: 'Statistical evidence overwhelmingly favors HODL. Most retail traders underperform a simple buy-and-hold by 3-8 percentage points annually due to fees, taxes, and missed market days. Unless you have institutional-grade tools and discipline, HODL produces better risk-adjusted returns.' }
]
};

export const HODLFAQSection = () => (
  <HODLFAQSectionInner />
);

const HODLFAQSectionInner = () => {
  const { language } = useLanguage();
  const tr = language==='tr';
  const currentFaqs = tr ? faqs.tr : faqs.en;
  return (
  <section className="py-20 bg-muted/30">
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <HelpCircle className="w-4 h-4" />
          {tr ? 'SSS' : 'FAQ'}
        </div>
        <h2 className="text-h2 font-bold mb-4 text-foreground">
          {tr ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {tr ? 'Bitcoin yatırım stratejileri hakkında sık sorulan sorular' : 'Common questions about Bitcoin investment strategies'}
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {currentFaqs.map((faq, index) => (
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
