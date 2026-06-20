import { ScrollableTable } from "@/components/ui/ScrollableTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SectionHeader } from "./SectionHeader";
import { ArrowRight } from "lucide-react";

/** Small inline callout linking to a related calculator. */
const RelatedCalloutLink = ({ to, label }: { to: string; label: string }) => (
  <LocalizedLink
    to={to}
    className="not-prose mt-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
  >
    <ArrowRight className="h-4 w-4" aria-hidden />
    <span>{label}</span>
  </LocalizedLink>
);

const withdrawalData = [
  { rule: "4% Rule (Traditional)", annual: "$40,000", monthly: "$3,333", risk: "Moderate", note: "Standard for stocks/bonds" },
  { rule: "3% Rule (BTC-Adjusted)", annual: "$30,000", monthly: "$2,500", risk: "Lower", note: "Accounts for BTC volatility" },
  { rule: "Variable % (Cycle-Aware)", annual: "$20K–$60K", monthly: "$1.7K–$5K", risk: "Active", note: "Sell more in bull, less in bear" },
  { rule: "Interest-Only (HODL)", annual: "Yield only", monthly: "Varies", risk: "Lowest drawdown", note: "Never sell principal BTC" },
];

export const RetirementContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const tWithdrawalData = tr ? [
    { rule: "%4 Kuralı (Geleneksel)", annual: "₺40,000", monthly: "₺3,333", risk: "Orta", note: "Hisse senedi/tahvil için standart" },
    { rule: "%3 Kuralı (BTC Uyumlu)", annual: "₺30,000", monthly: "₺2,500", risk: "Daha düşük", note: "BTC oynaklığını dikkate alır" },
    { rule: "Değişken % (Döngü Farkındalıklı)", annual: "₺20K–₺60K", monthly: "₺1.7K–₺5K", risk: "Aktif", note: "Boğada daha çok, ayıda daha az sat" },
    { rule: "Sadece Getiri (HODL)", annual: "Yalnızca getiri", monthly: "Değişken", risk: "En düşük düşüş", note: "Ana BTC'yi asla satma" },
  ] : withdrawalData;

  // Educational/marketing copy: historical USD examples are intentional.
  // Marked exempt from the /tr-currency audit.
  return (
    <div data-currency-exempt="true" className="container mx-auto px-6 max-w-3xl space-y-20 py-16 md:py-20">
      <section>
        <SectionHeader
          eyebrow={tr ? 'Para Çekme' : 'Withdrawal'}
          title={tr ? 'Bitcoin Para Çekme Stratejileri' : 'Withdrawal Strategies'}
        />
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Geleneksel %4 para çekme kuralı, yıllık düşüşlerin nadiren %20\'yi aştığı hisse senedi ve tahvil portföyleri için tasarlanmıştır. Bitcoin ise farklı davranır — her büyük döngüde %50-80 düşüşler görülmüştür. Bu, BTC\'yi ana varlık olarak tutan emekliler için matematiği değiştirir.'
            : 'The traditional 4% withdrawal rule was built for portfolios split between stocks and bonds, where annual drawdowns rarely exceed 20%. Bitcoin behaves differently — drawdowns of 50–80% have occurred in every major cycle. That changes the math for retirees who hold BTC as a primary asset.'}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {tr
            ? <><strong className="text-foreground">%3 para çekme kuralı</strong> daha güvenli bir yaklaşımdır ve ayı piyasalarına karşı daha büyük tampon sağlar. Alternatif olarak <strong className="text-foreground">döngü farkındalıklı değişken çekim</strong> stratejisi, coşku dönemlerinde daha fazla satar ve birikim dönemlerinde sermayeyi korur.</>
            : <><strong className="text-foreground">A safer approach for Bitcoin retirees is the 3% withdrawal rule</strong>, which provides a larger buffer against bear-market drawdowns. Alternatively, a <strong className="text-foreground">cycle-aware variable withdrawal</strong> strategy sells more during euphoria phases and preserves capital during accumulation phases.</>}
        </p>
        <ScrollableTable className="rounded-xl border border-border/50 bg-card" ariaLabel={tr ? 'Para çekme stratejisi karşılaştırması' : 'Withdrawal strategy comparison'}>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="bg-muted/40 border-b border-border/50">
                <th className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">{tr ? 'Strateji' : 'Strategy'}</th>
                <th className="text-right p-3 font-semibold text-foreground text-xs uppercase tracking-wider">{tr ? 'Yıllık' : 'Annual'}</th>
                <th className="text-right p-3 font-semibold text-foreground text-xs uppercase tracking-wider">{tr ? 'Aylık' : 'Monthly'}</th>
                <th className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">{tr ? 'Risk' : 'Risk'}</th>
                <th className="text-left p-3 font-semibold text-foreground text-xs uppercase tracking-wider">{tr ? 'Not' : 'Note'}</th>
              </tr>
            </thead>
            <tbody>
              {tWithdrawalData.map((row, i) => (
                <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">{row.rule}</td>
                  <td className="p-3 text-right font-mono text-foreground">{row.annual}</td>
                  <td className="p-3 text-right font-mono text-muted-foreground">{row.monthly}</td>
                  <td className="p-3 text-muted-foreground">{row.risk}</td>
                  <td className="p-3 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </section>

      <section>
        <SectionHeader
          eyebrow={tr ? 'DCA' : 'DCA'}
          title={tr ? 'DCA ile Bitcoin Stoku Oluşturmak' : 'Building a Stack with DCA'}
        />
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Dolar maliyet ortalaması, piyasayı zamanlama tahminini ortadan kaldırır. Dip almayı denemek yerine düzenli aralıklarla sabit dolar tutarında yatırım yaparsınız — haftalık, iki haftada bir veya aylık. 10–30 yıllık bir emeklilik ufkunda bu yaklaşım, volatiliteyi avantaja dönüştürdüğü için tarihsel olarak çoğu Bitcoin sahibi için toplu yatırımdan daha iyi performans göstermiştir.'
            : 'Dollar-cost averaging removes the guesswork from timing the market. Instead of trying to buy the dip, you invest a fixed dollar amount at regular intervals — weekly, bi-weekly, or monthly. Over a 10–30 year retirement horizon, this approach has historically outperformed lump-sum investing for most Bitcoin holders because it converts volatility into an advantage.'}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Ocak 2017\'de başlayan ve ayda 200 $ Bitcoin\'e yatıran biri, 2026 başlarında toplamda yaklaşık 21.600 $ harcayarak 2,5 BTC\'nin üzerinde birikim yapmış olurdu. BTC başına 100.000 $ fiyatla bu yığın 250.000 $+ değerinde olur.'
            : 'A person who invested $200 per month into Bitcoin starting in January 2017 would have accumulated over 2.5 BTC by early 2026 — spending roughly $21,600 in total. At a price of $100,000 per BTC, that stack is worth $250,000+.'}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {tr
            ? <>Kendi DMA senaryonuzu modellemek için yukarıdaki <strong className="text-foreground">Tahminci</strong> sekmesini kullanın.</>
            : <>Use the <strong className="text-foreground">Forecaster</strong> tab above to model your own DCA scenario. Set your monthly contribution and expected growth rate, then compare conservative vs. optimized withdrawal strategies.</>}
        </p>
        <RelatedCalloutLink to="/calculators/dca" label={tr ? 'Bitcoin DCA Hesaplayıcısı ile DCA stratejilerini karşılaştırın →' : 'Compare DCA strategies with our Bitcoin DCA Calculator →'} />
      </section>

      <section>
        <SectionHeader
          eyebrow={tr ? 'FIRE' : 'FIRE'}
          title={tr ? 'Bitcoin ve FIRE Hareketi' : 'Bitcoin and the FIRE Movement'}
        />
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Financial Independence, Retire Early (FIRE), yaşam giderlerini kalıcı olarak karşılayacak bir portföy büyüklüğüne ulaşmak için agresif tasarruf ve yatırım üzerine kurulu bir harekettir. Standart FIRE formülü basittir: yıllık giderlerinizin 25 katını biriktirin ve ardından her yıl %4 çekin.'
            : 'Financial Independence, Retire Early (FIRE) is a movement built on aggressive saving and investing to reach a portfolio that generates enough passive income to cover living expenses — permanently. The standard FIRE formula is simple: accumulate 25× your annual expenses, then withdraw 4% per year indefinitely.'}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Bitcoin, asimetrik getiri profili nedeniyle FIRE zaman çizelgesini hızlandırır. S&P 500 son yüzyılda yılda yaklaşık %10 getiri sağlarken Bitcoin 2011\'den bu yana yıllıklandırılmış olarak %100\'ün üzerinde ortalama getiri sundu. Daha muhafazakâr %15–25 ileriye dönük tahminlerle bile Bitcoin sahipleri geleneksel endeks fonu yatırımcılarından önemli ölçüde daha hızlı FIRE hedeflerine ulaşır.'
            : 'Bitcoin accelerates the FIRE timeline because of its asymmetric return profile. While the S&P 500 has averaged roughly 10% annually over the past century, Bitcoin has averaged over 100% annualized returns since 2011. Even using a more conservative 15–25% forward-looking estimate, Bitcoin holders reach their FIRE number significantly faster than traditional index fund investors.'}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {tr
            ? <>Yukarıdaki <strong className="text-foreground">FIRE Modu</strong>, dört senaryo (Ayı, Temel, Boğa ve Hiper) boyunca kişisel FIRE tarihinizi hesaplar.</>
            : <>Our <strong className="text-foreground">FIRE Mode</strong> tab calculates your personal FIRE date across four scenarios — Bear (8%), Base (15%), Bull (25%), and Hyper (35%).</>}
        </p>
      </section>

      <section>
        <SectionHeader
          eyebrow={tr ? 'Vergi & Risk' : 'Tax & Risk'}
          title={tr ? 'Vergi Sonuçları ve Risk Yönetimi' : 'Tax & Risk Management'}
        />
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Emeklilikte Bitcoin satmak sermaye kazancı vergilerini tetikler. ABD\'de uzun vadeli sermaye kazancı oranları gelirinize bağlı olarak %0 ile %20 arasındadır; yüksek gelir sahipleri için ek %3,8 Net Investment Income Tax (NIIT) de uygulanabilir.'
            : 'Selling Bitcoin in retirement triggers capital gains taxes. In the United States, long-term capital gains rates range from 0% to 20% depending on your income bracket, plus a potential 3.8% Net Investment Income Tax (NIIT) for high earners. Retirement withdrawals should be structured to stay within lower tax brackets where possible.'}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {tr
            ? 'Kendin yönetimli Bitcoin IRA\'lar vergi avantajı sunar ancak saklama gereksinimleri ve doğrudan tutmaya kıyasla daha yüksek ücretlerle gelir. Roth IRA dönüşüm stratejisi — BTC\'yi şimdi vergilendirip emeklilikte vergisiz çekim yapmak — uzun zaman ufku olan genç yatırımcılar için güçlü olabilir.'
            : 'Self-directed Bitcoin IRAs offer tax-advantaged growth, but come with custodial requirements and higher fees compared to holding Bitcoin directly. A Roth IRA conversion strategy can be powerful for younger investors with a long time horizon.'}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {tr
            ? 'Vergilerin ötesinde, en büyük risk sıralı getiri riskidir: emekliliğin ilk yıllarındaki büyük bir çöküş, ortalama getirileriniz pozitif olsa bile portföyünüzü kalıcı olarak bozabilir.'
            : 'Beyond taxes, the biggest risk in Bitcoin retirement planning is sequence-of-returns risk: a major crash in the first few years of retirement can permanently damage your portfolio if you\'re forced to sell at low prices. Mitigation: a 2-year cash buffer in stablecoins, a cycle-aware variable withdrawal, and keeping Bitcoin as one part of a diversified portfolio.'}
        </p>
        <RelatedCalloutLink to="/calculators/capital-gains-tax" label={tr ? 'Sermaye Kazancı Vergi Hesaplayıcısı ile çekim senaryonuzu modelleyin →' : 'Model your withdrawal scenario with the Capital Gains Tax Calculator →'} />
      </section>
    </div>
  );
};
