import { Anchor, BarChart2, Brain, Coins, AlertTriangle } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

const hodlBacktest = [
  { startYear: '2015', endYear: '2025', hodlReturn: '+38,400%', tradedReturn: '+820%', winner: 'HODL', winnerTr: 'HODL', notes: 'Pure conviction beat any active strategy', notesTr: 'Saf kararlılık her aktif stratejiyi geride bıraktı' },
  { startYear: '2017', endYear: '2025', hodlReturn: '+820%', tradedReturn: '+115%', winner: 'HODL', winnerTr: 'HODL', notes: 'Even buying near a top, holding won', notesTr: 'Zirveye yakın alım bile tutmakla kazandı' },
  { startYear: '2018', endYear: '2025', hodlReturn: '+1,180%', tradedReturn: '+240%', winner: 'HODL', winnerTr: 'HODL', notes: 'Bear market entry, patient hold', notesTr: 'Ayı piyasasına giriş, sabırlı tutma' },
  { startYear: '2020', endYear: '2025', hodlReturn: '+870%', tradedReturn: '+180%', winner: 'HODL', winnerTr: 'HODL', notes: 'COVID lows to ETF era', notesTr: 'COVID diplerinden ETF dönemine' },
  { startYear: '2021', endYear: '2025', hodlReturn: '+98%', tradedReturn: '−12%', winner: 'HODL', winnerTr: 'HODL', notes: 'Top-of-cycle entry still positive', notesTr: 'Döngü zirvesine giriş hâlâ pozitif' },
  { startYear: '2022', endYear: '2025', hodlReturn: '+260%', tradedReturn: '+75%', winner: 'HODL', winnerTr: 'HODL', notes: 'Bear-market accumulation paid off', notesTr: 'Ayı piyasası birikimi meyvesini verdi' },
];

const hodlVsAssets = [
  { decade: '2015-2025', bitcoin: '+38,400%', sp500: '+220%', gold: '+95%', winner: 'Bitcoin' },
  { decade: '2018-2025', bitcoin: '+1,180%', sp500: '+135%', gold: '+85%', winner: 'Bitcoin' },
  { decade: '2020-2025', bitcoin: '+870%', sp500: '+95%', gold: '+72%', winner: 'Bitcoin' },
  { decade: '2022-2025', bitcoin: '+260%', sp500: '+58%', gold: '+45%', winner: 'Bitcoin' },
];

export const HODLContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <>
      {/* Section 1: What HODL Means */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Anchor className="w-4 h-4" />
            {tr ? 'HODL Tanımı' : 'HODL Defined'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr ? 'HODL Ne Demek ve Neden Ticareti Geride Bırakır' : 'What HODL Means and Why It Beats Trading'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? 'HODL, 2013\'te bir Bitcoin forumundaki yazım hatası olarak başladı. GameKyuubi adlı bir kullanıcı BTC bir günde %40 düşerken "I AM HODLING" yazdı. Yazım hatası kaldı ve bir meme, ölçülmüş en kârlı Bitcoin stratejisine dönüştü.'
                : 'HODL started as a typo on a Bitcoin forum in 2013. A drunk holder named GameKyuubi posted "I AM HODLING" while BTC was crashing 40% in a day. The misspelling stuck, and a meme became the most profitable Bitcoin strategy ever measured.'}
            </p>
            <p>
              {tr
                ? 'Bitcoin alıp sattığınızda gerçekte olan şudur: her giriş ve çıkışta ücret ödersiniz (genelde taraf başına %0,1 ile %1,5), her satış vergilendirilebilir bir olay yaratır ve daha iyi bilgiye ve daha hızlı uygulamaya sahip algoritmik trader\'larla yarışırsınız. Çoğu bireysel yatırımcı, basit bir al-tut stratejisinin yıllık getirinin 3 ila 8 puan gerisinde kalır. On yıl boyunca bu, ciddi bir fırsat maliyetine dönüşür.'
                : 'Here\'s what actually happens when you trade Bitcoin: you pay fees on every entry and exit (typically 0.1% to 1.5% per side), you trigger a taxable event on every sale, and you compete against algorithmic traders with better information and faster execution. Most retail traders underperform a simple buy-and-hold by 3 to 8 percentage points per year. Over a decade, that compounds into a brutal opportunity cost.'}
            </p>
            <p>
              {tr ? (
                <><strong className="text-foreground">HODL işe yarar çünkü Bitcoin asimetriktir.</strong> BTC tarihindeki en büyük tek günlük hareketler aşağı değil yukarı yönlüdür. Bir yıldaki en iyi 10 günü kaçırırsanız, yıllık getiri oranınız yarıdan fazla düşer. Al-sat yapmak piyasaya girip çıkmak demektir — ve istatistiksel olarak bu günlerin çoğunu kaçırırsınız.</>
              ) : (
                <><strong className="text-foreground">HODL works because Bitcoin is asymmetric.</strong> The biggest single-day price moves in BTC's history are upside, not downside. If you miss the 10 best days in any given year, your annualized return drops by more than half. Trading means stepping in and out of the market — and statistically, you'll miss most of those days.</>
              )}
            </p>
            <p>
              {tr ? (
                <>Yukarıdaki simülatör, toplu HODL ile <Link to="/calculators/dca" className="text-primary hover:underline">DCA</Link> ve düşüşten alımı gerçek tarihsel fiyat verileriyle karşılaştırmanızı sağlar. 2015'e kadar herhangi bir başlangıç tarihi seçin ve her stratejinin gerçekte ne getirdiğini görün.</>
              ) : (
                <>The simulator above lets you compare lump-sum HODL against <Link to="/calculators/dca" className="text-primary hover:underline">DCA</Link> and dip-buying using real historical price data. Pick any start date back to 2015 and see what each strategy actually returned.</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: HODL vs Trading Backtest Table */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <BarChart2 className="w-4 h-4" />
            {tr ? '10 Yıllık Geri Test' : '10-Year Backtest'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'HODL vs Aktif İşlem: 10 Yıllık Geri Test' : 'HODL vs Active Trading: 10-Year Backtest'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
            {tr
              ? '"Aktif işlem" burada tipik bir bireysel yatırımcıyı taklit eder: aylık dengeleme, düşüşten alım denemeleri ve zirve sanılan noktalarda kısmi çıkışlar. Ücretler ve vergiler eklendiğinde gerçek sonuçlar genelde daha kötüdür. HODL her dönemde kazandı.'
              : '"Active trading" here approximates a typical retail trader: monthly rebalancing, buy-the-dip attempts, and partial exits at perceived tops. Real-world numbers are usually worse once you add fees and taxes. HODL won every single window.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Dönem' : 'Period'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'HODL Getirisi' : 'HODL Return'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Aktif İşlem Getirisi' : 'Active Trader Return'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Kazanan' : 'Winner'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Notlar' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody>
                {hodlBacktest.map((row) => (
                  <tr key={row.startYear} className="border-t border-border/30">
                    <td className="px-4 py-3 font-mono text-foreground">{row.startYear}–{row.endYear}</td>
                    <td className="px-4 py-3 font-mono text-primary font-semibold">{row.hodlReturn}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{row.tradedReturn}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{tr ? row.winnerTr : row.winner}</td>
                    <td className="px-4 py-3 text-muted-foreground">{tr ? row.notesTr : row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3 italic">
            {tr
              ? 'Yıllık ortalama BTC fiyatına dayalı yaklaşık değerlerdir. Aktif işlem getirileri, gerçekçi ücret varsayımları ve kaçırılan piyasa zamanlamasını içeren ortalama bir bireysel stratejiyi modeller.'
              : 'Approximations based on average BTC price by year. Active-trader returns model an average retail strategy with realistic fee assumptions and missed market timing.'}
          </p>
        </div>
      </section>

      {/* Section 3: Psychology of Holding */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Brain className="w-4 h-4" />
            {tr ? 'Kararlılık Stres Testi' : 'Conviction Stress Test'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr ? 'Düşüşlerde Tutmanın Psikolojisi' : 'The Psychology of Holding Through Drawdowns'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? 'HODL\'ın matematiği kolaydır. Uygulaması zordur. Bitcoin birçok kez %70 ve üzeri düşüşler yaşadı ve her biri buna hazır olmayanları piyasadan eledi. 2021 sonlarında 69.000 $ seviyesinden aldıysanız ve 15.500 $ civarında dibi gördüğünü izlediyseniz, bir yıldan fazla süreyle %78 kâğıt zararda kaldınız.'
                : 'HODL math is easy. HODL execution is hard. Bitcoin has experienced multiple drawdowns of 70% or more, and each one shook out the people who weren\'t ready for it. If you bought at $69,000 in late 2021 and watched it bottom near $15,500, you sat on a 78% paper loss for over a year.'}
            </p>
            <p>
              {tr ? (
                <>Her HODL yapanın cevaplaması gereken dürüst soru şudur: <strong className="text-foreground">Pozisyonunuz yarın %80 düşse yine de tutar mıydınız?</strong> Cevap hayırsa, pozisyon boyutunuz fazladır. Çöküş başlamadan önce <Link to="/calculators/drawdown" className="text-primary hover:underline">düşüş hesaplayıcımızda</Link> hesap yapın.</>
              ) : (
                <>The honest question every HODLer needs to answer: <strong className="text-foreground">Would you still hold if your position was down 80% tomorrow?</strong> If the answer is no, your size is too big. Run the numbers in our <Link to="/calculators/drawdown" className="text-primary hover:underline">drawdown calculator</Link> before you commit, not after the crash starts.</>
              )}
            </p>
            <p>
              {tr
                ? 'Her döngüyü atlatan HODL yapanlarda ortak bir desen vardır: 4 yıl içinde ihtiyaç duyacakları parayı asla yatırmazlar, panik satışı önlemek için coin\'lerini kendi saklamalarında tutarlar ve haftalarca fiyatı umursamazlar. Ekran süresini azaltmak bir meme değil; bu piyasadaki en az konuşulan avantajdır.'
                : 'The HODLers who survived every cycle share a pattern: they never invested money they needed within 4 years, they kept their coins in self-custody to avoid panic-selling on exchanges, and they ignored price for weeks at a time. Reducing your screen time isn\'t a meme. It\'s the most under-discussed alpha in this market.'}
            </p>
            <p>
              {tr ? (
                <>Uzun vadeli tutmanın tarihsel gerekçesine daha derin bir bakış için <Link to="/learn/bitcoin-hodl-strategy-explained" className="text-primary hover:underline">tam HODL strateji rehberimize</Link> göz atın.</>
              ) : (
                <>For a deeper look at the historical case for long-term holding, see our <Link to="/learn/bitcoin-hodl-strategy-explained" className="text-primary hover:underline">complete HODL strategy guide</Link>.</>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: HODL vs Gold vs S&P 500 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Coins className="w-4 h-4" />
            {tr ? 'Varlık Karşılaştırması' : 'Asset Comparison'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? 'HODL vs Altın vs S&P 500: Dönemlere Göre Getiriler' : 'HODL vs Gold vs S&P 500: Returns by Period'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
            {tr
              ? 'Bitcoin, ortaya çıktığından beri tüm çok yıllı dönemlerde her büyük varlık sınıfını geride bıraktı. Altın ve S&P 500 kötü yatırımlar değildir; sadece aynı ligde değiller.'
              : 'Bitcoin has outperformed every major asset class in every multi-year window since its inception. Gold and the S&P 500 are not bad investments. They just aren\'t in the same league.'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/50 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Dönem' : 'Period'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Bitcoin (HODL)' : 'Bitcoin (HODL)'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'S&P 500' : 'S&P 500'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Altın' : 'Gold'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr ? 'Kazanan' : 'Winner'}</th>
                </tr>
              </thead>
              <tbody>
                {hodlVsAssets.map((row) => (
                  <tr key={row.decade} className="border-t border-border/30">
                    <td className="px-4 py-3 font-mono text-foreground">{row.decade}</td>
                    <td className="px-4 py-3 font-mono text-primary font-semibold">{row.bitcoin}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{row.sp500}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{row.gold}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{row.winner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground leading-relaxed mt-6 max-w-prose">
            {tr ? (
              <>Tam varlık karşılaştırması için <Link to="/learn/bitcoin-vs-gold-sp500" className="text-primary hover:underline">Bitcoin, altın ve S&amp;P 500</Link> analizimize bakın.</>
            ) : (
              <>For a full asset comparison, see our deep-dive on <Link to="/learn/bitcoin-vs-gold-sp500" className="text-primary hover:underline">Bitcoin vs gold vs the S&amp;P 500</Link>.</>
            )}
          </p>
        </div>
      </section>

      {/* Section 5: When HODL Strategies Fail */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <AlertTriangle className="w-4 h-4" />
            {tr ? 'Dürüst Başarısızlık Modları' : 'Honest Failure Modes'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr ? 'HODL Stratejileri Ne Zaman Başarısız Olur' : 'When HODL Strategies Fail'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Paraya ihtiyaç duydunuz' : 'You needed the money'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? 'Sağlık giderleri, iş kaybı veya boşanma nedeniyle dipte zorunlu satış yapmak asimetrik yukarı potansiyelini yok eder. 4 yıl içinde gerekebilecek parayla asla HODL etmeyin.' : 'Forced selling at a low because of medical bills, job loss, or a divorce wipes out the asymmetric upside. Never HODL with funds you might need within 4 years.'}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Borsanız battı' : 'Your exchange went under'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? 'Mt. Gox, FTX, Celsius, BlockFi. Borsada HODL edenler bazen hiçbir şey alamadı. Kendi saklama stratejinin bir parçasıdır, seçenek değil.' : 'Mt. Gox, FTX, Celsius, BlockFi. People who HODLed on exchanges sometimes got nothing back. Self-custody is part of the strategy, not optional.'}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Anahtarlarınızı kaybettiniz' : 'You lost your keys'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? 'Tahminen 3 ila 4 milyon BTC kalıcı olarak kayıp. Seed ifadenizi çeliğe yedekleyin, iki farklı yerde saklayın ve ihtiyaç duymadan önce kurtarmayı test edin.' : 'An estimated 3 to 4 million BTC are permanently lost. Backup your seed phrase to steel, store it in two locations, and test your recovery before you need it.'}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Tabanda panikle sattınız' : 'You panic-sold the bottom'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? <>'%70 düşüşlerde teslim olmak en yaygın HODL hatasıdır. Volatiliteye dayanamıyorsanız daha küçük bir pozisyon alın veya bunun yerine <Link to="/calculators/dca" className="text-primary hover:underline">DCA</Link> kullanın.</> : <>Capitulation at 70% drawdowns is the single most common HODL failure. If you can't stomach the volatility, run a smaller position or use <Link to="/calculators/dca" className="text-primary hover:underline">DCA</Link> instead.</>}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Kaldıraçla tümden girdiniz' : 'You went all-in on leverage'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? "BTC'nizi teminat gösterip daha fazla BTC almak, çalışmadığı ana kadar işe yarar. Likidasyon zincirleri her döngüde kaldıraçlı HODL yapanları silip süpürdü." : "Borrowing against your BTC to buy more BTC works until it doesn't. Liquidation cascades have wiped out leveraged HODLers in every cycle."}</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">{tr ? 'Zaman ufku çok kısaydı' : 'Time horizon was too short'}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{tr ? 'HODL\'ın güvenilir çalışması için en az bir tam döngü (3-4 yıl) gerekir. Daha kısa süreler fiyat hareketi açısından yazı-tura gibidir.' : "HODL needs at least one full cycle (3-4 years) to work reliably. Anything shorter is a coin-flip on price action."}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
