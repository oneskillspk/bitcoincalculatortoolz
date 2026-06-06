import { Calculator, TrendingUp, Receipt, Target, AlertCircle } from 'lucide-react';
import { Link } from "@/components/LocalizedLink";
import { ScrollableTable } from '@/components/ui/ScrollableTable';
import { useLanguage } from '@/contexts/LanguageContext';

const exchangeFeeDrag = [
  { exchange: 'Binance', perSide: '0.10%', roundTrip: '0.20%', drag: '$20 on $10K' },
  { exchange: 'Bybit', perSide: '0.10%', roundTrip: '0.20%', drag: '$20 on $10K' },
  { exchange: 'Kraken', perSide: '0.26%', roundTrip: '0.52%', drag: '$52 on $10K' },
  { exchange: 'Gemini ActiveTrader', perSide: '0.40%', roundTrip: '0.80%', drag: '$80 on $10K' },
  { exchange: 'Coinbase Advanced', perSide: '0.60%', roundTrip: '1.20%', drag: '$120 on $10K' },
  { exchange: 'Coinbase (standard)', perSide: '~1.49%', roundTrip: '~2.98%', drag: '~$298 on $10K' },
];

export const ProfitLossContentSections = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  const profitTargets = tr ? [
    { multiple: '1,5x', priceFromEntry: '+%50', taxOnGain: '~%15-20 UZKVK', notes: 'Muhafazakâr hedef, genellikle bir yıl içinde ulaşılır' },
    { multiple: '2x', priceFromEntry: '+%100', taxOnGain: '~%15-20 UZKVK', notes: 'Yaygın döngü orta noktası' },
    { multiple: '3x', priceFromEntry: '+%200', taxOnGain: '~%15-20 UZKVK', notes: 'Güçlü boğa döngüsü getirisi' },
    { multiple: '5x', priceFromEntry: '+%400', taxOnGain: '~%20 UZKVK + eyalet', notes: 'Tam döngü zirvesi, nadir ama tarihsel' },
    { multiple: '10x', priceFromEntry: '+%900', taxOnGain: '~%20 UZKVK + NIIT', notes: 'Çok döngülü tutma, yalnızca erken girişler' },
  ] : [
    { multiple: '1.5x', priceFromEntry: '+50%', taxOnGain: '~15-20% LTCG', notes: 'Conservative target, often hit within a year' },
    { multiple: '2x', priceFromEntry: '+100%', taxOnGain: '~15-20% LTCG', notes: 'Common cycle midpoint' },
    { multiple: '3x', priceFromEntry: '+200%', taxOnGain: '~15-20% LTCG', notes: 'Strong bull-cycle return' },
    { multiple: '5x', priceFromEntry: '+400%', taxOnGain: '~20% LTCG + state', notes: 'Full-cycle peak, rare but historic' },
    { multiple: '10x', priceFromEntry: '+900%', taxOnGain: '~20% LTCG + NIIT', notes: 'Multi-cycle hold, only early entries qualify' },
  ];

  return (
    <>
      {/* Section 1 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Calculator className="w-4 h-4" />
            {tr?'Bitcoin K&Z Metodolojisi':'Bitcoin P&L Methodology'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Bitcoin Kârı Aslında Nasıl Hesaplanır':'How Bitcoin Profit Is Actually Calculated'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? <>Dürüst formül şöyledir: <strong className="text-foreground">K/Z = (Satış Fiyatı × Tutulan BTC × (1 − Satım Ücreti%)) − Toplam Yatırım</strong>. Pek çok yeni başlayan bunu "satış eksi alış" olarak kısaltır ve her kazancı sessizce olduğundan fazla gösterir. Atlanan iki unsur şunlardır: gerçekte aldığınız BTC miktarını düşüren alım ücreti ve bankaya ne girdiğini kırpan satım ücreti.</>
                : <>The honest formula is <strong className="text-foreground">P/L = (Sell Price × BTC Held × (1 − Sell Fee%)) − Total Invested</strong>. Most beginners shortcut this to "sell minus buy" and quietly overstate every win. The two pieces that get skipped are the buy fee, which lowered the BTC you actually received, and the sell fee, which trims what hits your bank.</>}
            </p>
            <p>
              {tr
                ? <><strong className="text-foreground">Maliyet bazınız</strong>, ücretler dahil BTC edinmek için harcadığınız her dolar tutarıdır. <strong className="text-foreground">Net geliriniz</strong> ise brüt satış değerinden çıkış ücretinin çıkarılmasıyla bulunur. Birini diğerinden çıkarın ve gerçeği elde edin. Maliyet bazına bölün, 100 ile çarpın ve ROI\'yi bulun.</>
                : <>Your <strong className="text-foreground">cost basis</strong> is every dollar you spent acquiring BTC, fees included. Your <strong className="text-foreground">net proceeds</strong> are gross sale value minus the exit fee. Subtract one from the other and you have the truth. Divide by cost basis, multiply by 100, and you have ROI.</>}
            </p>
            <p>
              {tr
                ? <>Birden fazla lotunuz olduğunda, yukarıdaki hesap makinesi bunları <strong className="text-foreground">ağırlıklı ortalama maliyet bazına</strong> karıştırır; bu, genel pozisyonunuzu görmenin en temiz yoludur. Vergi beyannamesi için her lotu FIFO, LIFO veya HIFO yöntemiyle ayrı ayrı takip etmeye devam edebilirsiniz. IRS, 2014 Notice 2014-21 çerçevesinden bu yana vergi yılı içinde tutarlı kalındığı sürece bunların herhangi birini kabul etmiştir.</>
                : <>When you have several lots, the calculator above blends them into a <strong className="text-foreground">weighted average cost basis</strong>, which is the cleanest way to see your overall position. For tax filing you can still track each lot under FIFO, LIFO, or HIFO. The IRS has accepted any of these since the 2014 Notice 2014-21 framework, as long as you stay consistent within a tax year.</>}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <TrendingUp className="w-4 h-4" />
            {tr?'Çalışılmış Örnek':'Worked Example'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'5.000 $ Coinbase Alımı, 68.000$\'dan Satış: Tam Hesap':'A $5,000 Coinbase Buy, Sold at $68,000: The Full Math'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? <><strong className="text-foreground">BTC başına 36.000 $</strong> fiyatından Coinbase Standard\'a <strong className="text-foreground">5.000 $</strong> gönderdiniz diyelim. Coinbase yaklaşık %1,49 alım ücreti olarak 74,50 $ keser. Kalan <strong className="text-foreground">4.925,50 $</strong> size yaklaşık <strong className="text-foreground">0,13682 BTC</strong> satın alır. Bu rakam gerçek pozisyonunuzdur; bir ekran görüntüsünün gösterebileceği yuvarlak sayı değil.</>
                : <>Say you sent <strong className="text-foreground">$5,000</strong> to Coinbase Standard at <strong className="text-foreground">$36,000 per BTC</strong>. Coinbase keeps about 1.49% as a buy fee, so $74.50 leaves the trade. The remaining <strong className="text-foreground">$4,925.50</strong> bought you roughly <strong className="text-foreground">0.13682 BTC</strong>. That number is your real position, not the round number a screenshot might show.</>}
            </p>
            <p>
              {tr
                ? <>Birkaç döngü sonra <strong className="text-foreground">68.000 $</strong>\'dan satıyorsunuz. Brüt gelir <strong className="text-foreground">9.303,62 $</strong> (0,13682 × 68.000 $). Coinbase çıkışta da yaklaşık <strong className="text-foreground">138,62 $</strong> daha keser. Net gelir <strong className="text-foreground">9.165,00 $</strong>\'a düşer.</>
                : <>A few cycles later you sell at <strong className="text-foreground">$68,000</strong>. Gross proceeds are <strong className="text-foreground">$9,303.62</strong> (0.13682 × $68,000). Coinbase trims another 1.49% on the way out, about <strong className="text-foreground">$138.62</strong>. Net proceeds settle at <strong className="text-foreground">$9,165.00</strong>.</>}
            </p>
            <p>
              {tr
                ? <>5.000 $ maliyet bazınızı çıkardığınızda net kâr <strong className="text-foreground">4.165 $</strong>, yani <strong className="text-foreground">ücretler sonrası %83,3 ROI</strong>\'dir. Binance\'te taraf başına %0,10 ücretle aynı işlem yaklaşık 4.295 $ net kazandırırdı. Bu 130 $\'lık fark, kolaylık için ödenen Coinbase\'in gidiş-dönüş "vergisi"dir. Yukarıdaki hesap makinesi bir ücret önayarını değiştirdiğinizde tam olarak bu hesabı yapar.</>
                : <>Subtract your $5,000 cost basis and the net profit is <strong className="text-foreground">$4,165</strong>, which is an <strong className="text-foreground">83.3% ROI after fees</strong>. Same trade on Binance with 0.10% per side would have netted closer to $4,295. That $130 gap is the round-trip Coinbase tax on convenience. The calculator above runs this exact math the moment you change a fee preset.</>}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Receipt className="w-4 h-4" />
            {tr?'Ücret Etkisi':'Fee Drag'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr?'Ücretler Düşündüğünüzden Daha Fazla Birikebilinir':'Fees Compound More Than You Think'}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
            {tr
              ? 'Gidiş-dönüş borsa ücretleri sessiz sedasız %5\'lik bir düşüşten daha pahalıya patlayabilir. Aşağıdaki tablo karşılaştırmayı somutlaştırmak için 2025 yılı güncel spot ücret tarifeleri ve 10.000 $\'lık bir gidiş-dönüş kullanmaktadır.'
              : 'Round-trip exchange fees can quietly cost more than a 5% drawdown. The table below uses public 2025 spot fee schedules and a $10,000 round-trip to make the comparison concrete.'}
          </p>
          <ScrollableTable className="rounded-xl border border-border/50 bg-card" ariaLabel={tr?'Borsa ücreti karşılaştırması':'Exchange fee comparison'}>
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Borsa':'Exchange'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Taraf Başına':'Per Side'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Gidiş-Dönüş':'Round-Trip'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'10.000$\'daki Etki':'Drag on $10K'}</th>
                </tr>
              </thead>
              <tbody>
                {exchangeFeeDrag.map((row) => (
                  <tr key={row.exchange} className="border-t border-border/30">
                    <td className="px-4 py-3 font-mono text-foreground">{row.exchange}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{row.perSide}</td>
                    <td className="px-4 py-3 font-mono text-primary">{row.roundTrip}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.drag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
          <p className="text-xs text-muted-foreground mt-3 italic">
            {tr
              ? 'Kaynaklar: Coinbase, Binance, Kraken, Bybit, Gemini halka açık ücret sayfaları, 2025 itibarıyla güncel. Ağ ve çekim ücretleri dahil değildir.'
              : 'Sources: Coinbase, Binance, Kraken, Bybit, Gemini public fee pages, current as of 2025. Network and withdrawal fees not included.'}
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Receipt className="w-4 h-4" />
            {tr?'Gerçekleşmiş / Gerçekleşmemiş':'Realized vs Unrealized'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Gerçekleşmiş ve Gerçekleşmemiş: Vergi Saati Gerçekte Ne Zaman Başlar':'Realized vs Unrealized: When the Tax Clock Actually Starts'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              {tr
                ? <>Bu hesap makinenin gösterdiği rakam, satış tuşuna basmadığınız sürece <strong className="text-foreground">gerçekleşmemiş K/Z</strong>\'nüzdür. Gerçekleşmemiş kazançlar ABD, İngiltere, Kanada, Avustralya veya başlıca yargı bölgelerinin çoğunda vergilendirilemez. 10x\'lik bir pozisyonda on yıl oturabilirsiniz ve işlem yapmazsanız, takas etmez veya harcamazsanız hiçbir şey borçlanmazsınız.</>
                : <>The number this calculator shows is your <strong className="text-foreground">unrealized P/L</strong> until you click sell. Unrealized gains aren't taxable in the US, the UK, Canada, Australia, or most major jurisdictions. You can sit on a 10x position for a decade and owe nothing, as long as you don't trade, swap, or spend it.</>}
            </p>
            <p>
              {tr
                ? <>BTC\'yi fiat para için sattığınız, başka bir kriptoyla takas ettiğiniz veya bir şey ödemek için kullandığınız anda <strong className="text-foreground">gerçekleşmiş kazanç</strong> tetiklersiniz. IRS, hiçbir dolar hesabınıza girmese bile BTC\'den herhangi bir şeye yapılan her işlemi piyasa değerindeki bir satış olarak değerlendirir. Üstteki paneldeki Gerçekleşmiş geçişi, hangisine baktığınızı hatırlatmak için başlığı yeniden etiketler.</>
                : <>The moment you sell BTC for fiat, swap it for another crypto, or use it to pay for something, you trigger a <strong className="text-foreground">realized gain</strong>. The IRS treats every BTC-to-anything trade as a sale at fair market value, even if no dollar ever touched your bank. The Realized toggle in the panel above relabels the headline so you remember which one you're staring at.</>}
            </p>
            <p>
              {tr
                ? <>Tam vergi hesabı için rakamlarınızı <Link to="/calculators/capital-gains-tax" className="text-primary hover:underline">Sermaye Kazancı Vergisi Hesaplayıcısı</Link>\'na girin. Mevcut rehberlik kapsamında IRS\'nin izin verdiği FIFO, LIFO ve HIFO lot seçim yöntemini, ayrıca %0/%15/%20 uzun vadeli dilimleri ve %3,8 NIIT ek yükünü işler.</>
                : <>For exact tax math, plug your numbers into the <Link to="/calculators/capital-gains-tax" className="text-primary hover:underline">Capital Gains Tax Calculator</Link>. It handles the FIFO, LIFO, and HIFO lot-method choice the IRS allows under current guidance, plus the 0/15/20 percent long-term brackets and the 3.8 percent NIIT add-on.</>}
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Target className="w-4 h-4" />
            {tr?'Başabaş & Hedefler':'Break-Even & Targets'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr?'Başabaş ve Gerçekte Peşinde Olduğunuz Katla':'Break-Even and the Multiple You\'re Actually Chasing'}
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed mb-6">
            <p>
              {tr
                ? <><strong className="text-foreground">Toplam Yatırım ÷ (Tutulan BTC × (1 − Satım Ücreti%))</strong> formülüyle başabaş fiyatı bulunur. Bu paydadaki ifade, başabaşın ortalama giriş fiyatınızın biraz üzerinde durmasını sağlayan şeydir. Coinbase Advanced\'ta %0,6 gidiş-dönüş, bunu karışık alımınızın yaklaşık %1,2 üzerine iter. Coinbase Standard %2,98 ile neredeyse %3 üstüne iter. Yukarıdaki kart bunu canlı olarak hesaplar.</>
                : <>Break-even price equals <strong className="text-foreground">Total Invested ÷ (BTC Held × (1 − Sell Fee%))</strong>. That denominator is what makes break-even sit a few percent above your average entry. A 0.6 percent round-trip on Coinbase Advanced pushes it about 1.2 percent above your blended buy. Coinbase Standard at 2.98 percent pushes it almost 3 percent above. The card above runs this live.</>}
            </p>
            <p>
              {tr
                ? <>Kâr hedefleri diğer yönde daha basittir. Tablo, en az bir yıl tuttuğunuzu ve uzun vadeli sermaye kazancı oranı ödediğinizi varsayarak yaygın katlar için BTC fiyatının ne yapması gerektiğini göstermektedir. Bu katların herhangi birini yıllık getiriye dönüştürmek için gerçek elde tutma sürenize göre getiriyi yıllıklandırmak amacıyla <Link to="/calculators/cagr" className="text-primary hover:underline">BYBBO hesaplayıcısına</Link> girin.</>
                : <>Profit targets are simpler in the other direction. The table shows what the BTC price needs to do for common multiples, assuming you hold at least a year and pay the long-term capital gains rate. To convert any of these multiples into an annual return, plug them into the <Link to="/calculators/cagr" className="text-primary hover:underline">CAGR calculator</Link> to annualize the return over your actual holding period.</>}
            </p>
          </div>
          <ScrollableTable className="rounded-xl border border-border/50 bg-card" ariaLabel={tr?'Kâr hedefi tablosu':'Profit target table'}>
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Hedef Kat':'Target Multiple'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Giriş Fiyatından Hareket':'Price Move from Entry'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Tahmini Vergi (ABD)':'Approx Tax on Gain (US)'}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{tr?'Gerçekçi Değerlendirme':'Realistic Take'}</th>
                </tr>
              </thead>
              <tbody>
                {profitTargets.map((row) => (
                  <tr key={row.multiple} className="border-t border-border/30">
                    <td className="px-4 py-3 font-mono text-primary font-semibold">{row.multiple}</td>
                    <td className="px-4 py-3 font-mono text-foreground">{row.priceFromEntry}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.taxOnGain}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </section>

      {/* Section 6 */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <AlertCircle className="w-4 h-4" />
            {tr?'Bunlardan Kaçının':'Avoid These'}
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-6">
            {tr?'Bitcoin K/Z Hesaplarken Yapılan Yaygın Hatalar':'Common Mistakes When Calculating Bitcoin P/L'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Gidiş-dönüş ücreti unutmak':'Forgetting the round-trip fee'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? '%0,5 alım ücreti artı %0,5 satım ücreti, BTC kıpırdamadan önce %1 geride olduğunuz anlamına gelir. Coinbase Standard\'da bu gidiş-dönüş yaklaşık %3\'tür.'
                  : "A 0.5% buy fee plus a 0.5% sell fee means you're already 1% in the hole before BTC moves. On Coinbase Standard, that round-trip is closer to 3%."}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Ağ ve çekim ücretlerini gözden kaçırmak':'Missing network and withdrawal fees'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? 'BTC\'yi soğuk depolama veya borsalar arasında taşımak sats\'a mal olur. Bunları maliyet bazınıza ekleyin yoksa kârı fazla tahmin edip vergiyi eksik ödersiniz.'
                  : 'Moving BTC to cold storage or between exchanges costs sats. Add those to your cost basis or you\'ll overstate profit and underpay tax.'}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Yıl ortasında muhasebe yöntemini değiştirmek':'Mixing accounting methods mid-year'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? 'Vergi yılı ortasında FIFO ile HIFO arasında geçiş yapmak beyanname döneminde kargaşa yaratır ve denetime davetiye çıkarabilir.'
                  : 'Switching between FIFO and HIFO partway through a tax year creates a mess at filing time and may invite an audit.'}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Kripto-kripto takaslarını görmezden gelmek':'Ignoring crypto-to-crypto swaps'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? 'ABD\'de BTC\'yi ETH ile takas etmek vergilendirilebilir bir olaydır. İnsanlar bunu sık sık unutur ve sürpriz vergi faturaları alır.'
                  : "Trading BTC for ETH is a taxable event in the US. People forget this all the time and end up with surprise tax bills."}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Gerçekleşmiş ile gerçekleşmemişi karıştırmak':'Confusing realized with unrealized'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? <>Kâğıt kazançları satana kadar gerçek değildir. %50\'lik bir düşüşte buharlaşabilir. Direnciniziüstrese test etmek için <Link to="/calculators/drawdown" className="text-primary hover:underline">düşüş hesaplayıcısını</Link> kullanın.</>
                  : <>Paper gains aren't real until you sell. They can vanish in a 50% drawdown. Use the <Link to="/calculators/drawdown" className="text-primary hover:underline">drawdown calculator</Link> to stress-test your conviction.</>}
              </p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-2">
                {tr?'Vergi zararı hasadını atlamak':'Skipping tax-loss harvesting'}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                {tr
                  ? 'Zarar eden pozisyonlarınız mı var? Kazançları mahsup etmek için satın, ardından hâlâ pozisyon istiyorsanız yeniden alın. Bitcoin henüz wash-sale kuralına tabi değildir.'
                  : "Got losing positions? Sell them to offset gains, then rebuy if you still want exposure. Bitcoin isn't covered by the wash-sale rule yet."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
