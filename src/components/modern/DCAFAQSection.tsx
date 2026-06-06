import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

export const DCAFAQSection = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const faqData = tr ? [
    {
      question: "Portföy değeri nasıl hesaplanır?",
      answer: <>Portföy değeri, toplam Bitcoin varlıklarınız ile güncel Bitcoin fiyatı çarpılarak hesaplanır. Tarihsel analizde her alım tarihindeki gerçek Bitcoin fiyatını ve bugünkü değerleme için güncel piyasa fiyatını kullanıyoruz. Geçmiş yatırımların nasıl performans gösterdiğini görmek için <Link to="/calculators/what-if" className="text-primary hover:underline">Ya Şöyle Olsaydı Hesaplayıcısı</Link>'nı deneyin.</>
    },
    {
      question: "Bu hesaplayıcı ücretleri dikkate alıyor mu?",
      answer: "Hayır, bu hesaplayıcı yalnızca Bitcoin fiyat hareketlerine dayalı ham yatırım performansını gösterir. Gerçek dünya sonuçları borsa ücretleri, işlem ücretleri ve potansiyel çekim maliyetleri nedeniyle daha düşük olacaktır. Çoğu borsa işlem başına %0,1 ile %1 arasında ücret talep eder; bu nedenle gerçek yatırım planlamanızda bunu hesaba katın."
    },
    {
      question: "DCA için en iyi sıklık nedir?",
      answer: "Evrensel olarak 'en iyi' bir sıklık yoktur — durumunuza bağlıdır. Günlük DCA oynaklığı en fazla azaltır ancak ücret maliyetlerini artırabilir. Haftalık çoğu kişi için iyi bir denge noktasıdır. Aylık DCA basittir ve maaş programlarıyla uyumludur. Önemli olan, mükemmel zamanlamadan ziyade tutarlılıktır."
    },
    {
      question: "'Sat Biriktirme' nedir?",
      answer: <>"Sat Biriktirme" (Stacking Sats), zaman içinde düzenli olarak küçük miktarlarda Bitcoin biriktirmek anlamına gelen Bitcoin jargonudur. Bir 'sat' (satoshi), Bitcoin'in en küçük birimidir (0,00000001 BTC). DCA özünde otomatik 'sat biriktirme'dir. Birikim hedeflerinizi planlamak için <Link to="/calculators/stack-sats" className="text-primary hover:underline">Sat Biriktirme Hedef Hesaplayıcısı</Link>'nı kullanın.</>
    },
    {
      question: "Bu hesaplamalar ne kadar doğrudur?",
      answer: "Hesaplamalarımız güvenilir kaynaklardan gerçek tarihsel Bitcoin fiyat verilerini ve standart finansal formülleri kullanmaktadır. Ancak bu, eğitim amaçlı bir simülasyon aracıdır. Gerçek sonuçlar ücretler, alımların kesin zamanlaması, döviz kuru farkları ve gerçek işlemleriniz sırasındaki piyasa koşulları nedeniyle farklılık gösterecektir."
    },
    {
      question: "DCA analizimi dışa aktarabilir miyim?",
      answer: "Evet! DCA sonuçlarınızı hesapladıktan sonra, analizinizi PDF raporu veya CSV verisi olarak indirmenizi sağlayan dışa aktarma işlevini arayın. Bu, kayıtlarınız veya daha fazla analiz için alım geçmişinizi, performans metriklerinizi ve görsel grafikleri içerir."
    },
    {
      question: "DCA ile tek seferlik yatırım arasındaki fark nedir?",
      answer: <>`DCA yatırımınızı zaman içinde yayarak oynaklığın etkisini azaltabilir. Tek seferlik yatırım ise tüm tutarı bir anda yatırmak demektir. Hangi stratejinin zaman diliminiz için daha iyi performans göstermiş olacağını görmek amacıyla <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Toplu Tutar - DCA Hesaplayıcısı</Link>'nı kullanarak her iki stratejiyi karşılaştırın.</>
    },
    {
      question: "Piyasa oynaklığı DCA'yı nasıl etkiler?",
      answer: "Oynaklık aslında DCA'nın parladığı yerdir! Fiyatlar yüksek olduğunda, sabit yatırım tutarınız daha az satoshi alır. Fiyatlar düştüğünde aynı parayla daha fazla satoshi alırsınız. Zamanla bu durum, piyasayı mükemmel şekilde zamanlamaya çalışmaktan daha iyi bir fiyata dengeleme eğilimi gösterir."
    },
    {
      question: "Ayı piyasasında DCA'ya devam etmeli miyim?",
      answer: "Pek çok başarılı Bitcoin yatırımcısı, paranız için en fazla Bitcoin'i biriktirdiğiniz zaman olan ayı piyasalarında DCA'ya devam eder (hatta artırır). Ancak yalnızca kaybetmeyi göze alabileceğiniz miktarda yatırım yapın ve kişisel mali durumunuza ve risk toleransınıza dayalı stratejinizi sürdürün."
    },
    {
      question: "DCA için en iyi zaman dilimleri hangileridir?",
      answer: "DCA, birden fazla piyasa döngüsü için zaman tanıdığından daha uzun sürelerde (1+ yıl) en iyi şekilde çalışır. Kısa dönemler, dolar maliyet ortalama etkisini göstermeyebilir. Hesaplayıcımız çeşitli zaman dilimlerini destekler, böylece stratejinizin farklı piyasa koşullarında nasıl performans gösterdiğini görebilirsiniz."
    },
    {
      question: "DCA ile dip alım stratejisini karşılaştırınca hangisi üstün?",
      answer: <>'Dip alma'daki tahmini ve duyguyu ortadan kaldırarak fiyattan bağımsız tutarlı biçimde yatırım yapar. Dipler doğru zamanlandığında daha kârlı olabilse de bu, piyasa hareketlerini tahmin etmeyi gerektirir. Farklı elde tutma stratejilerini keşfetmek için <Link to="/calculators/hodl-strategy" className="text-primary hover:underline">HODL Strateji Hesaplayıcısı</Link>'nı inceleyin.</>
    },
    {
      question: "DCA yeni başlayanlar için daha mı iyi?",
      answer: "Evet, DCA genellikle yeni başlayanlar için önerilir çünkü basittir, duygusal karar almayı azaltır ve piyasa analizi becerisi gerektirmez. Disiplin oluşturur ve Bitcoin'in oynaklığını büyük bir riski kötü zamanda almak yerine yönetilebilir miktarlarda deneyimlemenizi sağlar."
    },
    {
      question: "Bitcoin emekliliği için nasıl plan yapabilirim?",
      answer: <>DCA, uzun vadeli servet oluşturmak için harika bir temeldir. Emeklilik ihtiyaçlarınızı tahmin etmek ve kapsamlı bir plan oluşturmak için DCA katkılarınızı, büyüme projeksiyonlarınızı ve hedef emeklilik tarihinizi dikkate alan <Link to="/calculators/retirement" className="text-primary hover:underline">Bitcoin Emeklilik Hesaplayıcısı</Link>'nı kullanın.</>
    },
    {
      question: "Her ay ne kadar Bitcoin satın almalıyım?",
      answer: "Herhangi bir aylık alım tutarını modellemek için Bitcoin DCA hesaplayıcımızı kullanın. Aylık ne kadar yatırım yapmak istediğinizi girin ve tarihsel ortalama getirilere dayalı öngörülen Bitcoin yığınınızı ve değerini zaman içinde görün. Aylık 50 veya 100 $ gibi küçük tutarlar bile birkaç yıl içinde önemli ölçüde bileşik hale gelebilir."
    },
    {
      question: "Bitcoin maliyet ortalama hesaplayıcısı nedir?",
      answer: <>Bir Bitcoin dolar maliyet ortalama (DCA) hesaplayıcısı, tümünü bir kerede almak yerine düzenli olarak — günlük, haftalık veya aylık — sabit bir tutar satın almış olsaydınız Bitcoin yatırımınızın ne değerde olacağını gösterir. Gerçek tarihsel fiyat verilerini kullanarak ortalama alış fiyatınızı, biriken toplam Bitcoin'i ve genel yatırım getirisini hesaplar. Birden fazla alım genelindeki maliyet bazınızı hesaplamak için <Link to="/calculators/average-buy-price" className="text-primary hover:underline">Ortalama Alış Fiyatı Hesaplayıcısı</Link>'nı deneyin.</>
    },
    {
      question: "Bitcoin'e her ay 100 $ yatırırsam ne olur?",
      answer: "Güncel fiyatlarla aylık 100 $, piyasa koşullarına bağlı olarak yaklaşık 120.000-150.000 satoshi satın alır. 5 yılda toplam 6.000 $ yatırımı anlamına gelir. Tarihsel olarak, Bitcoin'e yapılan her 5 yıllık DCA penceresi pozitif sonuç vermiş; başlangıç yılına bağlı olarak tipik birikimler 0,05-0,15 BTC arasında seyretmiştir. Tam senaryonuzu modellemek için yukarıdaki hesaplayıcıyı kullanın."
    },
    {
      question: "Bitcoin için DCA mi yoksa tek seferlik yatırım mı daha iyi?",
      answer: <>Dipler civarında alım yaptığınızda tek seferlik yatırım kazanır; ancak dipleri gerçek zamanlı tespit etmek neredeyse imkânsızdır. DCA, döngü tepelerinde alımdan korunur — 2017 ve 2021 tepelerinde %75-84 düşüş yaşandı. Çoğu kişi için DCA, pişmanlık riskini ve duygusal stresi azaltır. Her iki yaklaşımı <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Toplu Tutar - DCA Hesaplayıcısı</Link> ile karşılaştırın.</>
    },
    {
      question: "Bitcoin almak için haftanın en iyi günü hangisidir?",
      answer: "2015-2024 dönemine ait geriye dönük test verileri, Pazartesi alımlarının aynı toplam yatırımla Pazar alımlarına kıyasla yaklaşık %14 daha fazla Bitcoin biriktirdiğini göstermektedir. Bu model, düşük hafta sonu hacmini ve Pazartesi kurumsal alımlarını yansıtır. Ancak tutarlılık, gün seçiminden daha önemlidir — düzenli olarak taahhüt ettiğiniz herhangi bir gün, ara sıra yapılan zamanlama girişimlerinden daha iyi sonuç verir."
    },
    {
      question: "5 yıl boyunca aylık 100 $ DCA Bitcoin getirisini nasıl etkiler?",
      answer: "Başladığınız zamana bağlıdır. 2019-2024 arasında aylık 100 $ DCA yapan biri toplam 6.000 $ yatırım yaparak yaklaşık 0,13 BTC biriktirdi; 84.000 $/BTC üzerinden bu değer yaklaşık 11.000 $ eder. 2018'de ayı piyasasında başlamak daha iyi sonuç verdi çünkü düşük fiyatlardan daha fazla BTC satın alındı. Tercih ettiğiniz tarihlerle yukarıdaki hesaplayıcıyı kullanın."
    },
    {
      question: "Ayı piyasasında Bitcoin DCA yapmalı mıyım?",
      answer: "Ayı piyasaları tarihsel olarak DCA yapmanın en iyi zamanıdır. 2018 ayı piyasasında (-%84) ve 2022 ayı piyasasında (-%77) DCA'larını sürdüren yatırımcılar, daha düşük ortalama maliyetlerle önemli ölçüde daha fazla Bitcoin biriktirdi. Bu alımlar, fiyatlar toparlandıktan sonra portföylerindeki en kârlı alımlar haline geldi. Zor olan, her şey kasvetli göründüğünde disiplinli kalmaktır."
    },
    {
      question: "Bitcoin DCA alımlarını nasıl otomatikleştiririm?",
      answer: "Çoğu borsa tekrarlayan alım özellikleri sunar. Swan Bitcoin, Strike ve River, rekabetçi ücretlerle otomatik Bitcoin DCA'da uzmanlaşmıştır. Coinbase ve Kraken da tekrarlayan alımları destekler. Tutarınızı belirleyin, haftalık veya aylık sıklık seçin, bir ödeme yöntemi bağlayın ve borsa işlemleri otomatik olarak gerçekleştirir. Güvenlik için periyodik olarak kendi gözetiminize çekin."
    },
  ] : [
    {
      question: "How is portfolio value calculated?",
      answer: (<>Portfolio value is calculated by multiplying your total Bitcoin holdings by the current Bitcoin price. For historical analysis, we use the actual Bitcoin price on each purchase date and the current market price for today's valuation. Try our <Link to="/calculators/what-if" className="text-primary hover:underline">What If Calculator</Link> to see how past investments would have performed.</>)
    },
    {
      question: "Does this account for fees?",
      answer: "No, this calculator shows the raw investment performance based on Bitcoin price movements only. Real-world results would be lower due to exchange fees, trading fees, and potential withdrawal costs. Most exchanges charge 0.1% to 1% per transaction, so factor this into your actual investment planning."
    },
    {
      question: "What is the best frequency to DCA?",
      answer: "There's no universally 'best' frequency - it depends on your situation. Daily DCA reduces volatility the most but may increase fee costs. Weekly is a good balance for most people. Monthly DCA is simple and aligns with salary schedules. The key is consistency rather than perfect timing."
    },
    {
      question: "What is 'Stacking Sats'?",
      answer: (<>"Stacking Sats" is Bitcoin slang for regularly accumulating small amounts of Bitcoin over time. A 'sat' (satoshi) is the smallest unit of Bitcoin (0.00000001 BTC). DCA is essentially automated 'sat stacking'. Use our <Link to="/calculators/stack-sats" className="text-primary hover:underline">Stack Sats Goal Calculator</Link> to plan your accumulation targets.</>)
    },
    {
      question: "How accurate are these calculations?",
      answer: "Our calculations use real historical Bitcoin price data from reliable sources and standard financial formulas. However, this is a simulation tool for educational purposes. Real results will vary due to fees, exact timing of purchases, exchange rate differences, and market conditions at the time of your actual transactions."
    },
    {
      question: "Can I export my DCA analysis?",
      answer: "Yes! After calculating your DCA results, look for the export functionality that allows you to download your analysis as a PDF report or CSV data. This includes your purchase history, performance metrics, and visual charts for your records or further analysis."
    },
    {
      question: "What's the difference between DCA and lump sum investing?",
      answer: (<>DCA spreads your investment over time, potentially reducing the impact of volatility. Lump sum means investing all at once. Compare both strategies with our <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Lump Sum vs DCA Calculator</Link> to see which would have performed better for your timeframe.</>)
    },
    {
      question: "How does market volatility affect DCA?",
      answer: "Volatility is actually where DCA shines! When prices are high, your fixed investment amount buys fewer satoshis. When prices drop, you buy more satoshis for the same money. Over time, this tends to average out to a better price than trying to time the market perfectly."
    },
    {
      question: "Should I continue DCA during bear markets?",
      answer: "Many successful Bitcoin investors continue (or even increase) their DCA during bear markets, as this is when you accumulate the most Bitcoin for your money. However, only invest what you can afford to lose and maintain your strategy based on your personal financial situation and risk tolerance."
    },
    {
      question: "What time periods work best for DCA?",
      answer: "DCA works best over longer time periods (1+ years) as it allows time for multiple market cycles. Shorter periods may not show the smoothing effect of dollar-cost averaging. Our calculator supports various timeframes so you can see how your strategy would have performed across different market conditions."
    },
    {
      question: "How does DCA compare to buying the dip?",
      answer: (<>DCA removes the guesswork and emotion from 'buying the dip' by investing consistently regardless of price. While buying dips can be more profitable if timed correctly, it requires predicting market movements. Explore different holding strategies with our <Link to="/calculators/hodl-strategy" className="text-primary hover:underline">HODL Strategy Calculator</Link>.</>)
    },
    {
      question: "Is DCA better for beginners?",
      answer: "Yes, DCA is often recommended for beginners because it's simple, reduces emotional decision-making, and doesn't require market analysis skills. It builds discipline and gives you experience with Bitcoin's volatility in manageable amounts rather than risking a large sum on poor timing."
    },
    {
      question: "How can I plan for Bitcoin retirement?",
      answer: (<>DCA is a great foundation for long-term wealth building. To project your retirement needs and create a comprehensive plan, use our <Link to="/calculators/retirement" className="text-primary hover:underline">Bitcoin Retirement Calculator</Link> which factors in your DCA contributions, growth projections, and target retirement date.</>)
    },
    {
      question: "How much Bitcoin should I buy each month?",
      answer: "Use our Bitcoin DCA calculator to model any monthly purchase amount. Enter how much you want to invest per month and see your projected Bitcoin stack and value over time based on historical average returns. Even small amounts like $50 or $100 per month can compound significantly over multiple years."
    },
    {
      question: "What is a Bitcoin cost average calculator?",
      answer: (<>A Bitcoin dollar-cost averaging (DCA) calculator shows what your Bitcoin investment would be worth if you had bought a fixed amount regularly — daily, weekly, or monthly — instead of all at once. It calculates your average buy price, total Bitcoin accumulated, and overall return on investment using real historical price data. Try our <Link to="/calculators/average-buy-price" className="text-primary hover:underline">Average Buy Price Calculator</Link> to compute your cost basis across multiple purchases.</>)
    },
    {
      question: "What happens if I invest $100 in Bitcoin every month?",
      answer: "At current prices, $100/month buys roughly 120,000-150,000 satoshis depending on market conditions. Over 5 years, that's $6,000 invested. Historically, every 5-year DCA window into Bitcoin has returned positive results, with typical accumulations of 0.05-0.15 BTC depending on the starting year. Use the calculator above to model your exact scenario."
    },
    {
      question: "Is DCA or lump sum better for Bitcoin?",
      answer: (<>Lump sum wins when you buy near bottoms, but identifying bottoms in real time is nearly impossible. DCA protects against buying at cycle tops — the 2017 and 2021 tops saw 75-84% drawdowns. For most people, DCA reduces regret risk and emotional stress. Compare both approaches with our <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">Lump Sum vs DCA Calculator</Link>.</>)
    },
    {
      question: "What is the best day of the week to buy Bitcoin?",
      answer: "Backtested data from 2015-2024 shows Monday purchases accumulated approximately 14% more Bitcoin than Sunday purchases, given the same total investment. The pattern reflects lower weekend volume and institutional buying on Mondays. However, consistency matters more than day selection — any day you commit to regularly will outperform sporadic timing attempts."
    },
    {
      question: "How much would $100/month DCA into Bitcoin return over 5 years?",
      answer: "It depends on when you start. Someone who DCA'd $100/month from 2019-2024 invested $6,000 total and accumulated roughly 0.13 BTC, worth approximately $11,000 at $84,000/BTC. Starting in 2018 during the bear market yielded even better results because you bought more BTC at lower prices. Use the calculator above with your preferred dates."
    },
    {
      question: "Should I DCA into Bitcoin during a bear market?",
      answer: "Bear markets are historically the best time to DCA. Investors who maintained their DCA through the 2018 bear market (-84%) and 2022 bear market (-77%) accumulated significantly more Bitcoin at lower average costs. Those purchases became the most profitable in their portfolios once prices recovered. The hard part is staying disciplined when everything looks bleak."
    },
    {
      question: "How do I automate Bitcoin DCA purchases?",
      answer: "Most exchanges offer recurring buy features. Swan Bitcoin, Strike, and River specialize in automated Bitcoin DCA with competitive fees. Coinbase and Kraken also support recurring buys. Set your amount, pick weekly or monthly frequency, connect a payment method, and the exchange handles execution automatically. Withdraw to self-custody periodically for security."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-h2 font-bold mb-4 text-foreground">
            {tr?'Sıkça Sorulan Sorular':'Frequently Asked Questions'}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {tr
              ? 'Dolar Maliyet Ortalama ve hesaplayıcımızın nasıl çalıştığı hakkında bilmeniz gereken her şey.'
              : 'Everything you need to know about Dollar Cost Averaging and how our calculator works.'}
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqData.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border/50 rounded-xl px-6 hover:border-primary/20 transition-all duration-300"
            >
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
