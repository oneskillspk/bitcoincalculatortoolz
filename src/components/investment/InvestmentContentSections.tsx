import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, BarChart3, Target, Shield, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const profitScenarios = [
  { investment: "$500", y1_10: "$550", y3_10: "$666", y5_25: "$1,526", y5_50: "$3,797", y10_25: "$4,657" },
  { investment: "$1,000", y1_10: "$1,100", y3_10: "$1,331", y5_25: "$3,052", y5_50: "$7,594", y10_25: "$9,313" },
  { investment: "$5,000", y1_10: "$5,500", y3_10: "$6,655", y5_25: "$15,259", y5_50: "$37,969", y10_25: "$46,566" },
  { investment: "$10,000", y1_10: "$11,000", y3_10: "$13,310", y5_25: "$30,518", y5_50: "$75,938", y10_25: "$93,132" },
  { investment: "$25,000", y1_10: "$27,500", y3_10: "$33,275", y5_25: "$76,294", y5_50: "$189,844", y10_25: "$232,831" },
  { investment: "$50,000", y1_10: "$55,000", y3_10: "$66,550", y5_25: "$152,588", y5_50: "$379,688", y10_25: "$465,661" },
];

export const InvestmentContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const dcaVsLumpData = tr ? [
    { metric: 'Volatilite Maruziyeti', lumpSum: 'Yüksek — giriş fiyatında tam tutar', dca: 'Düşük — aylara yayılmış ortalama' },
    { metric: 'En İyi Piyasa Koşulu', lumpSum: 'Sürekli yükseliş trendi', dca: 'Volatil veya düşen piyasa' },
    { metric: 'Tarihsel Kazanan (BTC)', lumpSum: '4 yıllık dönemlerin ~%65\'inde', dca: '4 yıllık dönemlerin ~%35\'inde' },
    { metric: 'Psikolojik Konfor', lumpSum: 'Düşük — tüm kaynak giriyor', dca: 'Yüksek — kademeli taahhüt' },
    { metric: 'Sermaye Verimliliği', lumpSum: 'Piyasada maksimum süre', dca: 'Kısmi nakit sürüklemesi' },
  ] : [
    { metric: "Volatility Exposure", lumpSum: "High — full amount at entry price", dca: "Low — averaged over months" },
    { metric: "Best Market Condition", lumpSum: "Sustained uptrend", dca: "Volatile or declining market" },
    { metric: "Historical Winner (BTC)", lumpSum: "~65% of 4-year windows", dca: "~35% of 4-year windows" },
    { metric: "Psychological Comfort", lumpSum: "Lower — all-in commitment", dca: "Higher — gradual commitment" },
    { metric: "Capital Efficiency", lumpSum: "Maximum time in market", dca: "Partial cash drag" },
  ];

  return (
    <>
      {/* Section 1 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr?'Bitcoin Yatırım Getirilerini Anlamak':'Understanding Bitcoin Investment Returns'}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? 'Bitcoin, geçen on yılda hiçbir geleneksel varlık sınıfının yakalayamadığı bileşik yıllık büyüme oranları sundu. 2013 ile 2024 arasında al-ve-tut stratejisi yaklaşık %75 BYBBO üretirken, bireysel yıllar −%73 ile +%302 arasında değişti. Bu aşırı aralık, gelecek getirilerin tek bir rakam yerine birden fazla senaryo gerektirdiğinin tam olarak nedenidir.'
                : "Bitcoin has delivered compound annual growth rates that no traditional asset class has matched over the past decade. Between 2013 and 2024, a buy-and-hold strategy produced a CAGR of roughly 75%, though individual years ranged from −73% to +302%. That extreme range is exactly why projecting future returns requires multiple scenarios rather than a single number."}
            </p>
            <p>
              {tr
                ? 'Bitcoin yatırım hesaplayıcımız tarihsel verilere dayalı üç büyüme varsayımını modellemektedir. Muhafazakâr %10 senaryo, S&P 500\'ün uzun vadeli ortalamasını yansıtır; esasen "Bitcoin yalnızca borsayı yakalasaydı ne olurdu?" sorusunu yanıtlar. Orta %25 modeli, kurumsal analistlerin Bitcoin\'in varlık olarak olgunlaşmasıyla birlikte benimsemeye göre ayarlanmış getirisini tahmin ettiği rakamı yansıtır. Agresif %50 modeli, daha büyük piyasa değerlerinde azalan getirileri hesaba katarak Bitcoin\'in gerçek 10 yıllık BYBBO\'sunun iskontolu versiyonunu kullanır.'
                : "Our Bitcoin investment calculator models three growth assumptions grounded in historical data. The conservative 10% scenario mirrors the S&P 500's long-run average — essentially asking \"what if Bitcoin only matches stocks?\" The moderate 25% model reflects what many institutional analysts project as Bitcoin's adoption-adjusted return as the asset matures. The aggressive 50% model uses a discounted version of Bitcoin's actual 10-year CAGR to account for diminishing returns at larger market caps."}
            </p>
            <p>
              {tr
                ? <>Her senaryo bileşik faiz matematiğini kullanır: <strong>Gelecek Değer = Anapara × (1 + Yıllık Oran)^Yıl</strong>. Aylık DMA katkıları eklediğinizde, hesap makinesi her katkıyı yatırım tarihinden itibaren bileştirerek anüite gelecek değer formülünü uygular. Bu çift motorlu yaklaşım, farklı piyasa koşullarında toplu yatırım artı DMA stratejisinin nasıl performans gösterdiğine dair gerçekçi bir tablo sunar.</>
                : <>Each scenario uses compound interest math: <strong>Future Value = Principal × (1 + Annual Rate)^Years</strong>. When you add monthly DCA contributions, the calculator applies the future value of an annuity formula, compounding each contribution from its deposit date forward. This dual-engine approach gives you a realistic picture of how a combined lump-sum-plus-DCA strategy performs under different market conditions.</>}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr?'Yatırım Tutarına Göre Bitcoin Kâr Senaryoları':'Bitcoin Profit Scenarios by Investment Amount'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            {tr
              ? 'Farklı BYBBO varsayımları altında tek seferlik Bitcoin alımı için tahmini portföy değeri. Tüm rakamlar ek katkı olmadığını varsayar.'
              : 'Projected portfolio value for a one-time Bitcoin purchase under different CAGR assumptions. All figures assume no additional contributions.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Yatırım':'Investment'}</TableHead>
                  <TableHead className="font-semibold text-xs text-right">1 {tr?'Yıl':'Yr'} (10%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">3 {tr?'Yıl':'Yr'} (10%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">5 {tr?'Yıl':'Yr'} (25%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">5 {tr?'Yıl':'Yr'} (50%)</TableHead>
                  <TableHead className="font-semibold text-xs text-right">10 {tr?'Yıl':'Yr'} (25%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitScenarios.map((row) => (
                  <TableRow key={row.investment} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.investment}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y1_10}</TableCell>
                    <TableCell className="text-right text-sm font-mono">{row.y3_10}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.y5_25}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary">{row.y5_50}</TableCell>
                    <TableCell className="text-right text-sm font-mono text-primary font-semibold">{row.y10_25}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {tr
              ? 'Bileşik büyüme kullanılarak yapılan varsayımsal tahminler. Bitcoin volatildir — geçmiş performans gelecek sonuçları garanti etmez.'
              : 'Hypothetical projections using compound growth. Bitcoin is volatile — past performance does not guarantee future results.'}
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr?'Toplu Yatırım mı, Dolar Maliyet Ortalaması mı: Hangi Strateji Kazanır?':'Lump Sum vs Dollar Cost Averaging: Which Strategy Wins?'}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              {tr
                ? 'Toplu yatırım ile DMA tartışması, yeni Bitcoin yatırımcılarının en sık karşılaştığı sorulardan biridir. Hisse senetlerine ilişkin akademik araştırmalar, piyasalar yükselen bir eğilim gösterdiği ve piyasadaki para saf olmayan nakit getirisi sunduğu için toplu yatırımın DMA\'yı yaklaşık üçte iki oranında geride bıraktığını göstermektedir. Bitcoin verileri de benzer bir tablo sunar; 2014\'ten bu yana dört yıllık kayan dönemlerin yaklaşık %65\'inde sermayeyi hemen dağıtmak aylık ortalamayı geride bırakmıştır.'
                : "The lump-sum-versus-DCA debate is one of the most common questions new Bitcoin investors face. Academic research on equities shows that lump-sum investing outperforms DCA approximately two-thirds of the time because markets trend upward and money in the market earns returns that sidelined cash does not. Bitcoin data tells a similar story — deploying capital immediately has beaten monthly averaging in roughly 65% of rolling four-year windows since 2014."}
            </p>
            <p>
              {tr
                ? 'Ancak DMA, verilerin tek başına ölçemeyeceği psikolojik bir ölçütte kazanır: tutarlılık. Aylık 200 $ taahhüt eden yatırımcılar, düşüşleri satın alma fırsatı gözüyle gördüklerinden %40\'lık düşüşlerde nadiren panikle satarlar. Bu davranışsal avantaj, özellikle Bitcoin\'in volatilite döngülerine yeni olanlar için toplu yatırımın matematiksel üstünlüğünden daha önemli olabilir.'
                : "However, DCA wins on a psychological metric that data alone can't capture: consistency. Investors who commit to $200 per month rarely panic-sell during a 40% drawdown because they view dips as buying opportunities. That behavioral advantage can matter more than the mathematical edge of lump-sum investing, especially for those new to Bitcoin's volatility cycles."}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="font-semibold text-xs">{tr?'Ölçüt':'Metric'}</TableHead>
                  <TableHead className="font-semibold text-xs">{tr?'Toplu Yatırım':'Lump Sum'}</TableHead>
                  <TableHead className="font-semibold text-xs">{tr?'Dolar Maliyet Ortalaması':'Dollar Cost Averaging'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dcaVsLumpData.map((row) => (
                  <TableRow key={row.metric} className="border-border/30">
                    <TableCell className="font-medium text-sm">{row.metric}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.lumpSum}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.dca}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr?'Bitcoin Yatırımcıları İçin Risk Yönetimi':'Risk Management for Bitcoin Investors'}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? 'Pozisyon boyutu, alacağınız en önemli tek risk kararıdır. Dijital varlıkları kapsayan finansal danışmanların büyük çoğunluğu, risk toleransı ve yatırım ufkuna göre Bitcoin maruziyetini toplam portföyün %1-10\'u ile sınırlandırmanızı önermektedir. %5\'lik bir tahsis, sizi en kötü anda satmaya zorlayacak portföy genelinde düşüş riski yaratmadan anlamlı bir yükseliş fırsatı sunar.'
                : "Position sizing is the single most important risk decision you'll make. Most financial advisors who cover digital assets suggest limiting Bitcoin exposure to 1–10% of a total portfolio, depending on risk tolerance and investment horizon. A 5% allocation gives meaningful upside exposure without creating a portfolio-level drawdown that forces you to sell at the worst possible time."}
            </p>
            <p>
              {tr
                ? 'Zaman ufku her şeyi değiştirir. Bitcoin, tarihindeki hiçbir dört yıllık elde tutma döneminde negatif getiri üretmedi; tam bir yarılanma döngüsü boyunca elinde tutan her yatırımcı kârlı çıktı. Kısa vadeli yatırımcılar tamamen farklı bir olasılık dağılımıyla yüzleşir; bireysel çeyreklerin yaklaşık %45\'i negatif getiri sunar. Yatırım ufkunuz iki yılın altındaysa, olası sonuç aralığı o kadar geniştir ki önemli bir geçici kayba hazırlıklı olmanız gerekir.'
                : "Time horizon changes everything. Bitcoin has never produced a negative return over any four-year holding period in its history — every investor who held for a full halving cycle has been profitable. Short-term traders face a completely different probability distribution, with roughly 45% of individual quarters delivering negative returns. If your investment horizon is under two years, the range of outcomes is wide enough that you should be prepared for a significant temporary loss."}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr?'Bitcoin - S&P 500 - Altın: 10 Yıllık Görünüm':'Bitcoin vs S&P 500 vs Gold: 10-Year Outlook'}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? 'Önümüzdeki on yılda üç varlık sınıfı temel olarak farklı roller üstlenir. S&P 500, belgelenmiş %10 ortalama yıllık getiri ve ılımlı volatiliteyle geniş hisse senedi maruziyeti sağlar. Altın, enflasyon kalkanı ve kriz varlığı olarak işlev görür; genellikle düşük hisse senedi korelasyonuyla yıllık %5-7 getiri sağlar. Bitcoin, asimetrik yükseliş potansiyeli sunar; 10x getiri olasılığı, zirveden dibe %80\'i aşabilecek düşüşlerle dengelenir.'
                : 'Over the next decade, the three asset classes serve fundamentally different roles. The S&P 500 provides broad equity exposure with a well-documented 10% average annual return and moderate volatility. Gold functions as an inflation hedge and crisis asset, typically returning 5–7% annually with low correlation to equities. Bitcoin offers asymmetric upside potential — the possibility of 10× returns — balanced against drawdowns that can exceed 80% from peak to trough.'}
            </p>
            <p>
              {tr
                ? 'Karma bir yaklaşım, kurumsal portföylerin artık benimsediği şeydir. BlackRock, Fidelity ve diğer büyük varlık yöneticileri çeşitlendirilmiş portföyler içinde %1-5 Bitcoin tahsisi önermektedir. Gerekçe basittir: Bitcoin\'in geleneksel varlıklarla düşük korelasyonu, küçük bir tahsimin dahi portföyün genel volatilitesini dramatik biçimde artırmadan risk ayarlı getirisini (Sharpe oranı) iyileştirebileceği anlamına gelir. Hesap makinemizdeki varlık karşılaştırma geçişini kullanarak bu üç varlığın seçtiğiniz zaman diliminde nasıl ayrışacağını tam olarak görebilirsiniz.'
                : "A blended approach is what most institutional portfolios now adopt. BlackRock, Fidelity, and other major asset managers have recommended 1–5% Bitcoin allocations within diversified portfolios. The rationale is straightforward: Bitcoin's low correlation with traditional assets means even a small allocation can improve a portfolio's risk-adjusted return (Sharpe ratio) without dramatically increasing overall volatility. Use the asset comparison toggle in our calculator to see exactly how these three assets diverge over your chosen time frame."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
