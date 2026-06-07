import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from "@/components/LocalizedLink";
import { Receipt, MapPin, Clock, Scissors, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const TaxContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 max-w-5xl space-y-16">
        {/* Section 1 */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'ABD\'de Bitcoin Nasıl Vergilendirilir (2026 Kuralları)' : 'How Bitcoin Is Taxed in the US (2026 Rules)'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>
                  IRS, Bitcoin\'i para birimi değil, mülk olarak nitelendirmektedir. Bu tek sınıflandırma her şeyi belirler: BTC ile yapılan her satış, takas veya alım vergiye tabi bir olaydır; kazanç (veya kayıp) Form 8949 ve Schedule D üzerinde raporlanır. 2026 yılında aynı çerçeve geçerli olmakla birlikte dilim eşikleri enflasyona paralel olarak hafifçe değişmektedir.
                </p>
                <p>
                  Bir Bitcoin satışına aynı anda üç tür vergi birden isabet edebilir: federal sermaye kazancı vergisi, eyalet geliri veya sermaye kazancı vergisi ve yüksek gelirli mükellefler için %3,8 Net Yatırım Geliri Vergisi (NIIT). Kısa vadeli bir satışla California gibi yüksek vergi eyaletlerinde bu vergiler üst üste eklendiğinde efektif oran %50'yi aşabilir. Bir yıllık süreyi geçmek bu faturayı önemli ölçüde azaltır.
                </p>
                <p>
                  Satmadan önce hasarı ölçmek ister misiniz? <Link to="/calculators/profit-loss" className="text-primary hover:underline font-medium">Bitcoin Kâr/Zarar Hesaplayıcımız</Link> gerçekleşen kazançları gösterir; tam tablo <Link to="/learn/bitcoin-tax-guide-capital-gains" className="text-primary hover:underline font-medium">Bitcoin vergi rehberimizle</Link> birleştirildiğinde daha derin bir okuma sunar.
                </p>
              </>
            ) : (
              <>
                <p>
                  The IRS treats Bitcoin as property, not currency. That single classification drives everything: every sale, swap, or purchase made with BTC is a taxable event, and the gain (or loss) gets reported on Form 8949 and Schedule D. For 2026, the same framework applies, but bracket thresholds shift slightly to keep pace with inflation.
                </p>
                <p>
                  Three flavors of tax can hit a Bitcoin sale at once: federal capital gains tax, state income or capital gains tax, and the 3.8% Net Investment Income Tax (NIIT) for higher earners. Stack those on top of a short-term sale and the effective rate can climb above 50% in high-tax states like California. Holding past the one-year mark cuts that bill dramatically.
                </p>
                <p>
                  Need help quantifying the damage before you sell? Our <Link to="/calculators/profit-loss" className="text-primary hover:underline font-medium">Bitcoin Profit/Loss Calculator</Link> shows realized gains, and the full picture pairs nicely with our <Link to="/learn/bitcoin-tax-guide-capital-gains" className="text-primary hover:underline font-medium">Bitcoin tax guide</Link> for a deeper read.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Section 2 - Federal Brackets */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? '2026 Federal Uzun Vadeli Sermaye Kazancı Dilimleri' : 'Federal Long-Term Capital Gains Brackets 2026'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-prose">
            {tr
              ? 'Uzun vadeli kazançlar (365 günden fazla tutulan BTC) tercihli oranlara hak kazanır. 2026 eşiklerinin beyan durumuna göre dağılımı şöyledir.'
              : "Long-term gains (BTC held over 365 days) qualify for preferential rates. Here's how 2026 thresholds break down by filing status."}
          </p>
          <Card className="glass-morphism-card border-border/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Oran' : 'Rate'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Bekar' : 'Single'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Evli Ortak Beyan' : 'Married Filing Jointly'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Hane Reisi' : 'Head of Household'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-success">0%</TableCell>
                    <TableCell>{tr ? '48.350 $\'a kadar' : 'Up to $48,350'}</TableCell>
                    <TableCell>{tr ? '96.700 $\'a kadar' : 'Up to $96,700'}</TableCell>
                    <TableCell>{tr ? '64.750 $\'a kadar' : 'Up to $64,750'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-warning">15%</TableCell>
                    <TableCell>{tr ? '48.351 $ – 533.400 $' : '$48,351 – $533,400'}</TableCell>
                    <TableCell>{tr ? '96.701 $ – 600.050 $' : '$96,701 – $600,050'}</TableCell>
                    <TableCell>{tr ? '64.751 $ – 566.700 $' : '$64,751 – $566,700'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-destructive">20%</TableCell>
                    <TableCell>{tr ? '533.400 $\'ın üzeri' : 'Over $533,400'}</TableCell>
                    <TableCell>{tr ? '600.050 $\'ın üzeri' : 'Over $600,050'}</TableCell>
                    <TableCell>{tr ? '566.700 $\'ın üzeri' : 'Over $566,700'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            {tr
              ? 'Kısa vadeli kazançlar (bir yıldan kısa süre tutulanlar), 2026 için %37\'ye ulaşan olağan gelir oranlarından vergilendirilir. Kısa ve uzun vadeli vergi uygulaması arasındaki fark, çoğu zaman vergi faturanızdaki en büyük tek değişken olmaktadır.'
              : 'Short-term gains (held under one year) are taxed at ordinary income rates, which top out at 37% for 2026. The spread between short and long-term treatment is often the single biggest variable in your tax bill.'}
          </p>
        </div>

        {/* Section 3 - State Comparison */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Eyalete Göre Bitcoin Vergi Karşılaştırması' : 'State-by-State Bitcoin Tax Comparison'}
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-prose">
            {tr
              ? 'Beyanname verdiğiniz yer, ne kadar süre tuttuğunuz kadar önemlidir. Bu on eyalet; sıfır eyalet vergisinden yüksek gelirli bireyler için %13\'ün üzerine kadar uzanan tam spektrumu kapsamaktadır.'
              : 'Where you file matters as much as how long you held. These ten states span the full spectrum, from zero state tax to over 13% on top earners.'}
          </p>
          <Card className="glass-morphism-card border-border/20">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">{tr ? 'Eyalet' : 'State'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'En Yüksek Sermaye Kazancı Oranı' : 'Top Capital Gains Rate'}</TableHead>
                    <TableHead className="font-semibold">{tr ? 'Uygulama' : 'Treatment'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-medium">California</TableCell><TableCell className="text-destructive">13.3%</TableCell><TableCell>{tr ? 'Olağan gelir olarak vergilendirilir' : 'Taxed as ordinary income'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">New York</TableCell><TableCell className="text-destructive">10.9%</TableCell><TableCell>{tr ? 'Olağan gelir olarak vergilendirilir' : 'Taxed as ordinary income'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">New Jersey</TableCell><TableCell className="text-warning">10.75%</TableCell><TableCell>{tr ? 'Olağan gelir olarak vergilendirilir' : 'Taxed as ordinary income'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Oregon</TableCell><TableCell className="text-warning">9.9%</TableCell><TableCell>{tr ? 'Olağan gelir olarak vergilendirilir' : 'Taxed as ordinary income'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Massachusetts</TableCell><TableCell className="text-warning">9.0%</TableCell><TableCell>{tr ? 'Kısa vadeli kazançlara daha yüksek oran' : 'Higher rate on short-term gains'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Washington</TableCell><TableCell className="text-warning">7.0%</TableCell><TableCell>{tr ? 'Yalnızca 270.000 $\'ın üzerindeki kazançlara' : 'Only on gains over $270K'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Texas</TableCell><TableCell className="text-success">0%</TableCell><TableCell>{tr ? 'Eyalet gelir vergisi yok' : 'No state income tax'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Florida</TableCell><TableCell className="text-success">0%</TableCell><TableCell>{tr ? 'Eyalet gelir vergisi yok' : 'No state income tax'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Tennessee</TableCell><TableCell className="text-success">0%</TableCell><TableCell>{tr ? 'Eyalet gelir vergisi yok' : 'No state income tax'}</TableCell></TableRow>
                  <TableRow><TableCell className="font-medium">Wyoming</TableCell><TableCell className="text-success">0%</TableCell><TableCell>{tr ? 'Eyalet gelir vergisi yok' : 'No state income tax'}</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4">
            {tr
              ? 'Dokuz eyalet sermaye kazançları üzerinden kişisel gelir vergisi uygulamaz: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington (yüksek gelir istisnasıyla) ve Wyoming. Büyük kazançların söz konusu olduğu Bitcoin sahipleri için ikamet planlaması gerçek bir kaldıraç işlevi görebilir.'
              : 'Nine states impose no personal income tax on capital gains: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington (with the high-income exception), and Wyoming. For Bitcoin holders sitting on large gains, residency planning is a real lever.'}
          </p>
        </div>

        {/* Section 4 - 365 Day Rule */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Kısa Vadeli ve Uzun Vadeli: 365 Günlük Kural' : 'Short-Term vs Long-Term: The 365-Day Rule'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>
                  IRS saati, Bitcoin\'i satın aldığınız günden sonraki günde başlar ve sattığınız günü kapsar. 366 gün veya daha uzun süre elde tutarsanız uzun vadeli işlem statüsüne hak kazanırsınız. 365. günde satarsanız, kazancın tamamı olağan gelir oranından vergilendirilir; bu oran en yüksek dilimler için %15\'lik uzun vadeli orandan 22 puan daha yüksektir.
                </p>
                <p>
                  50.000 $\'lık bir kazanç üzerinde bu zamanlama farkı, 7.500 $\'lık bir çek yazmak (uzun vadeli, %15) ile 18.500 $\'lık bir çek yazmak (kısa vadeli, %37) arasındaki fark anlamına gelebilir. Satmak için tıklamadan önce her lot için alım tarihini kontrol edin. <Link to="/calculators/hodl-strategy" className="text-primary hover:underline font-medium">HODL Strateji Hesaplayıcımız</Link>, beklemenin matematiksel karşılığını modellemektedir.
                </p>
              </>
            ) : (
              <>
                <p>
                  The IRS clock starts the day after you acquire Bitcoin and includes the day you sell. Hold for 366 days or more and you qualify for long-term treatment. Sell on day 365 and the entire gain gets taxed at your ordinary income rate, which for top earners is 22 percentage points higher than the 15% long-term rate.
                </p>
                <p>
                  On a $50,000 gain, that timing difference can mean the difference between writing a $7,500 check (long-term, 15%) and one for $18,500 (short-term, 37%). Before you click sell, check the acquisition date on every lot. Our <Link to="/calculators/hodl-strategy" className="text-primary hover:underline font-medium">HODL Strategy Calculator</Link> models the math of waiting.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Section 5 - Tax-Loss Harvesting */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-h2 font-bold text-foreground">
              {tr ? 'Bitcoin ile Vergi Kaybı Hasadı' : 'Tax-Loss Harvesting With Bitcoin'}
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tr ? (
              <>
                <p>
                  İşte kripto para biriminin hisse senetlerine karşı hâlâ bir avantajı olduğu alan: mevcut IRS rehberi kapsamında wash sale kuralı teknik olarak Bitcoin için geçerli değildir. Bu, zarar eden bir BTC lotunu sermaye kaybını realize etmek için satabilir, ardından aynı coinleri dakikalar içinde geri satın alabilirsiniz anlamına gelir. Kayıp gerçek ve indirilebilirdir.
                </p>
                <p>
                  Net sermaye kayıplarının 3.000 $\'a kadar olan kısmı her yıl olağan gelirden mahsup edilebilir; fazla kayıplar süresiz olarak sonraki yıllara devredilir. 20.000 $ zarar realize eden bir yatırımcı bu tutarı gelecekteki Bitcoin kazançlarıyla mahsup edebilir, ardından kuyu kuruyuncaya kadar yılda 3.000 $ olarak ücret gelirine karşı kullanmayı sürdürebilir. Kongre bu açığı yıllardır kapatmayı teklif etmektedir; ancak 2026 itibarıyla açık kalmaya devam etmektedir. Maliyet esasınızı <Link to="/calculators/portfolio-tracker" className="text-primary hover:underline font-medium">Portföy Takipçimizle</Link> dikkatle takip edin.
                </p>
              </>
            ) : (
              <>
                <p>
                  Here's where crypto still has an edge over stocks: the wash sale rule does not technically apply to Bitcoin under current IRS guidance. That means you can sell a losing BTC lot to lock in the capital loss, then buy back the same coins minutes later. The loss is real and deductible.
                </p>
                <p>
                  Up to $3,000 of net capital losses can offset ordinary income each year, and excess losses carry forward indefinitely. A trader who realized $20,000 in losses can offset $20,000 of future Bitcoin gains, then keep using $3,000 per year against W-2 wages until the well runs dry. Congress has floated closing this loophole for years, but as of 2026 it remains open. Track your cost basis carefully with our <Link to="/calculators/portfolio-tracker" className="text-primary hover:underline font-medium">Portfolio Tracker</Link>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
