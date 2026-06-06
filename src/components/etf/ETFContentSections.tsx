import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from "@/components/LocalizedLink";
import { BarChart3, TrendingDown, Shield, Receipt, Wallet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ETFContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">

        {/* Section 1 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin ETF\'leri Açıklandı: Spot ve Vadeli İşlemler' : 'Bitcoin ETFs Explained: Spot vs Futures'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Spot Bitcoin ETF\'i, Coinbase veya BitGo gibi bir saklama kurumunda soğuk depoda gerçek BTC tutar. IBIT\'in bir hissesini satın aldığınızda, fon orantılı bir gerçek Bitcoin dilimi satın alır. Vadeli işlem ETF\'i (2021\'de piyasaya çıkan BITO gibi) ise bunun yerine CME Bitcoin vadeli işlem sözleşmeleri tutar; bu da taşıma maliyetleri ve takip hatası getirir.'
                : "A spot Bitcoin ETF holds actual BTC in cold storage with a custodian like Coinbase or BitGo. When you buy one share of IBIT, the fund buys a proportional slice of real Bitcoin. A futures ETF (like BITO, launched in 2021) holds CME Bitcoin futures contracts instead, which introduces roll costs and tracking error."}
            </p>
            <p>
              {tr
                ? 'SEC, ilk ABD spot Bitcoin ETF\'lerini Ocak 2024\'te onayladı ve kategori o zamandan bu yana 50 milyar doların üzerinde net para girişi emdi. BlackRock\'un IBIT\'i tek başına 30 milyar doların üzerinde AUM\'a, tarihin herhangi bir ETF\'inden daha hızlı ulaştı. Bir aracı kurum hesabı içinde temiz Bitcoin maruziyeti isteyen çoğu yatırımcı için spot ETF\'ler doğru araçtır.'
                : "The SEC approved the first US spot Bitcoin ETFs in January 2024, and the category has since absorbed over $50 billion in net inflows. BlackRock's IBIT alone crossed $30 billion in AUM faster than any ETF in history. For most investors who want clean Bitcoin exposure inside a brokerage account, spot ETFs are the right tool."}
            </p>
            <p>
              {tr
                ? <>ETF\'leri doğrudan sahiplikle karşılaştırmak mı istiyorsunuz? Bu hesap makinesini <Link to="/calculators/dca" className="text-primary hover:underline font-medium">Bitcoin DCA Hesaplayıcısı</Link> veya daha kapsamlı <Link to="/learn/bitcoin-etf-guide-ibit-fbtc-arkb" className="text-primary hover:underline font-medium">IBIT, FBTC, ARKB kılavuzu</Link> ile birleştirin.</>
                : <>Want to see ETFs against direct ownership? Pair this calculator with our <Link to="/calculators/dca" className="text-primary hover:underline font-medium">Bitcoin DCA Calculator</Link> or the deeper <Link to="/learn/bitcoin-etf-guide-ibit-fbtc-arkb" className="text-primary hover:underline font-medium">IBIT, FBTC, ARKB guide</Link>.</>}
            </p>
          </div>
        </div>

        {/* Section 2 - ETF Comparison Table */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'En İyi Spot Bitcoin ETF\'lerinin Karşılaştırması (2026)' : 'Comparing Top Spot Bitcoin ETFs (2026)'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-prose">
            {tr
              ? 'Dört büyük spot Bitcoin ETF\'i de gerçek BTC tutar, ancak ücretler, saklama kurumu ve AUM bakımından farklılık gösterirler. İşte çoğu yatırımcının önem verdiği özet.'
              : "All four major spot Bitcoin ETFs hold real BTC, but they differ in fees, custodian, and AUM. Here's the snapshot most investors care about."}
          </p>
          <Card className="glass-morphism-card border-border/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Ticker' : 'Ticker'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'İhraççı' : 'Issuer'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Gider Oranı' : 'Expense Ratio'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Saklama Kurumu' : 'Custodian'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">IBIT</TableCell><TableCell>BlackRock</TableCell><TableCell className="text-amber-500">0.25%</TableCell><TableCell>Coinbase Custody</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">FBTC</TableCell><TableCell>Fidelity</TableCell><TableCell className="text-amber-500">0.25%</TableCell><TableCell>Fidelity Digital Assets</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">ARKB</TableCell><TableCell>ARK / 21Shares</TableCell><TableCell className="text-amber-500">0.21%</TableCell><TableCell>Coinbase Custody</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">BITB</TableCell><TableCell>Bitwise</TableCell><TableCell className="text-success">0.20%</TableCell><TableCell>Coinbase Custody</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">BTC</TableCell><TableCell>Grayscale Mini</TableCell><TableCell className="text-success">0.15%</TableCell><TableCell>Coinbase Custody</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">GBTC</TableCell><TableCell>Grayscale Trust</TableCell><TableCell className="text-destructive">1.50%</TableCell><TableCell>Coinbase Custody</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            {tr
              ? 'Grayscale\'in eski GBTC\'si %1,50 ile rakiplerinin ücretinin yaklaşık 10 katıdır. GBTC\'yi uzun vadeli tutan herkes anlamlı bir getiri kaybı yaşamaktadır. Mini Trust (BTC) %0,15 ile 2026 itibarıyla en ucuz seçenektir.'
              : "Grayscale's legacy GBTC at 1.50% is roughly 10x the fee of competitors. Anyone still holding GBTC for a long horizon is bleeding meaningful return. The Mini Trust (BTC) at 0.15% is the cheapest option as of 2026."}
          </p>
        </div>

        {/* Section 3 - Fee Drag */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? '10 Yılda ETF Ücretlerinin Gerçek Maliyeti' : 'The True Cost of ETF Fees Over 10 Years'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-prose">
            {tr
              ? 'Ücret sürüklenmesi bileşik büyür. BTC\'nin yıllık ortalama %25 getiri sağladığı 10 yıl boyunca tutulan 10.000 $\'lık yatırımda, her ücret kademesinin gerçek maliyeti şöyledir.'
              : "Fee drag compounds. On a $10,000 investment held while BTC averages 25% annual returns, here's what each fee tier actually costs."}
          </p>
          <Card className="glass-morphism-card border-border/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Gider Oranı' : 'Expense Ratio'}</TableHead>
                    <TableHead className="font-semibold">{tr ? '1 Yıl Sonra' : 'After 1 Year'}</TableHead>
                    <TableHead className="font-semibold">{tr ? '5 Yıl Sonra' : 'After 5 Years'}</TableHead>
                    <TableHead className="font-semibold">{tr ? '10 Yıl Sonra' : 'After 10 Years'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium text-success">0.15% (BTC Mini)</TableCell><TableCell>$19</TableCell><TableCell>$229</TableCell><TableCell>$1,395</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-success">0.20% (BITB)</TableCell><TableCell>$25</TableCell><TableCell>$305</TableCell><TableCell>$1,855</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-amber-500">0.25% (IBIT/FBTC)</TableCell><TableCell>$31</TableCell><TableCell>$381</TableCell><TableCell>$2,316</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium text-destructive">1.50% (GBTC)</TableCell><TableCell>$188</TableCell><TableCell>$2,250</TableCell><TableCell>$13,200</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            {tr
              ? 'En ucuz ETF ile en pahalısı arasındaki fark, tek bir 10.000 $\'lık yatırımda 10 yılda yaklaşık 11.800 $\'dır. Bunu 100.000 $\'lık bir portföye ölçeklendirin ve yalnızca GBTC cezası, bileşik değerdeki kayıplar bakımından 118.000 $\'ı aşar.'
              : "The gap between the cheapest ETF and the most expensive is roughly $11,800 over 10 years on a single $10K stake. Scale that to a $100K portfolio and the GBTC penalty alone exceeds $118,000 in lost compounded value."}
          </p>
        </div>

        {/* Section 4 - ETF vs Self-Custody */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'ETF ve Öz Saklama: Gerçek Dengeler' : 'ETF vs Self-Custody: The Real Tradeoffs'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Spot Bitcoin ETF\'leri gerçek bir sorunu çözüyor: emeklilik hesaplarının, mali danışmanların ve yalnızca aracı kurum kullanan yatırımcıların cüzdana dokunmadan BTC maruziyeti elde etmesine olanak tanıyorlar. Takas, ağırlıklı olarak bir veya iki firmada (çoğunlukla Coinbase) yoğunlaşan saklama riski ve gider oranlarının yavaş damlasıdır.'
                : "Spot Bitcoin ETFs solve a real problem: they let retirement accounts, financial advisors, and brokerage-only investors gain BTC exposure without touching a wallet. The tradeoff is custody risk concentrated at one or two firms (mostly Coinbase) and the slow drip of expense ratios."}
            </p>
            <p>
              {tr
                ? 'Doğrudan Bitcoin sahipliği ücretleri sonsuza kadar ortadan kaldırır, kontrol ettiğiniz anahtarlar sağlar ve kimsenin izni olmadan işlem yapan bir ağda çalışır. Maliyet operasyoneldir: donanım cüzdanları, güvenlik ifadesi yedekleri ve kendi bankanız olmanın sorumluluğu. 2026 yılında bir donanım cüzdanı bir kez 80 ila 200 $ arasındadır. Bir ETF ise tam bakiyenizin %0,20-0,25\'ine sonsuza kadar, her yıl mal olur.'
                : "Direct Bitcoin ownership eliminates fees forever, gives you keys you control, and works on a network that does not need anyone's permission to settle. The cost is operational: hardware wallets, seed phrase backups, and the responsibility of being your own bank. A 2026 hardware wallet costs $80 to $200 once. An ETF costs 0.20-0.25% of your full balance every single year, forever."}
            </p>
            <p>
              {tr
                ? <>Doğrudan varlıklarınızı <Link to="/calculators/portfolio-tracker" className="text-primary hover:underline font-medium">Portföy Takipçisi</Link> ile özel olarak takip edin (yalnızca localStorage, hesap gerekmez) veya <Link to="/calculators/hodl-strategy" className="text-primary hover:underline font-medium">HODL Strateji Hesaplayıcısı</Link> ile uzun vadeli bir yığın modelleyin.</>
                : <>Track your direct holdings privately with our <Link to="/calculators/portfolio-tracker" className="text-primary hover:underline font-medium">Portfolio Tracker</Link> (localStorage only, no account required), or model a long-term stack with the <Link to="/calculators/hodl-strategy" className="text-primary hover:underline font-medium">HODL Strategy Calculator</Link>.</>}
            </p>
          </div>
        </div>

        {/* Section 5 - Tax Treatment */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'ETF Vergi Muamelesi ile Doğrudan Bitcoin Karşılaştırması' : 'ETF Tax Treatment vs Direct Bitcoin'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            <p>
              {tr
                ? 'Spot Bitcoin ETF hisseleri, ABD vergi amaçları bakımından herhangi bir hisse senedi gibi ele alınır: bir yılın altında kısa vadeli kazançlar, bir yılın üzerinde uzun vadeli kazançlar ve Form 8949\'da raporlanır. Bu onları takip etmeyi doğrudan BTC\'den daha basit kılar; burada her takas ayrı bir vergiye tabi olayı tetikler.'
                : "Spot Bitcoin ETF shares get treated like any other stock for US tax purposes: short-term gains under one year, long-term gains over one year, reported on Form 8949. That makes them simpler to track than direct BTC, where every swap triggers a separate taxable event."}
            </p>
            <p>
              {tr
                ? <>ETF\'lerin büyük avantajı, vergi avantajlı hesaplara erişimdir. IBIT\'i Roth IRA içinde tutmak, BTC ne kadar yükselirse yükselsin çıkışta sıfır sermaye kazancı vergisi anlamına gelir. Kendi yönettiğiniz IRA'daki doğrudan Bitcoin teknik olarak mümkündür, ancak operasyonel açıdan zahmetlidir. Emeklilik hesabı olan çoğu yatırımcı için bir ETF sarmalayıcısı, vergisiz Bitcoin maruziyetine en temiz yoldur. Sayıları <Link to="/calculators/capital-gains-tax" className="text-primary hover:underline font-medium">Sermaye Kazancı Vergisi Hesaplayıcısı</Link> ile hesaplayın.</>
                : <>The big advantage of ETFs is access to tax-advantaged accounts. Holding IBIT inside a Roth IRA means zero capital gains tax on the way out, regardless of how high BTC climbs. Direct Bitcoin in a self-directed IRA is technically possible but operationally painful. For most investors with a retirement account, an ETF wrapper is the cleanest path to tax-free Bitcoin exposure. Run the numbers with our <Link to="/calculators/capital-gains-tax" className="text-primary hover:underline font-medium">Capital Gains Tax Calculator</Link>.</>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
