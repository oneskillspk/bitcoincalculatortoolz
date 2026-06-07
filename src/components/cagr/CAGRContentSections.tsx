import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Calculator, AlertCircle, History } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export const CAGRContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-h2 font-bold text-foreground">
                {tr ? "Bitcoin YBBO Size Gerçekte Ne Anlatır?" : "What Bitcoin CAGR Actually Tells You"}
              </h2>
            </div>
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-4">
              <p>
                {tr
                  ? "Bileşik Yıllık Büyüme Oranı (YBBO), yanıltıcı derecede basit bir soruyu yanıtlayan tek bir sayıdır: yatırımınız her yıl sabit bir oranda büyümüş olsaydı, gerçekte elde ettiğiniz sonucu hangi oran üretirdi? Yıllık getirilerin inişli çıkışlı gürültüsünü giderir ve altın, S&P 500 veya başka herhangi bir varlığın yanına koyabileceğiniz elma-elma karşılaştırmalı bir rakam verir."
                  : "Compound Annual Growth Rate is a single number that answers a deceptively simple question: if your investment had grown at one steady rate every year, what rate would have produced the result you actually got? It strips out the up-and-down noise of yearly returns and gives you an apples-to-apples figure you can paste next to gold, the S&P 500, or any other asset."}
              </p>
              <p>
                {tr
                  ? "Bitcoin için YBBO, neredeyse diğer herhangi bir varlık sınıfından daha fazla önem taşır; çünkü ham fiyat hareketleri yanıltıcıdır. BTC için yıllık grafik bir yıl +%300, bir sonraki yıl -%65 gösterebilir. Herhangi bir 12 aylık pencereye bakmak neredeyse kesinlikle yanlış bir sonuca götürür. Beş veya on yıllık YBBO, uzun vadeli tutucuların tezin hâlâ işe yarayıp yaramadığını değerlendirmek için kullandığı şeydir."
                  : "For Bitcoin, CAGR matters more than for almost any other asset class because raw price moves are misleading. A year-on-year chart for BTC can show +300% one year and -65% the next. Looking at any single 12-month window almost guarantees a wrong conclusion. CAGR over five or ten years is what longtime holders use to evaluate whether the thesis is still working."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-h2 font-bold text-foreground">
                {tr ? "YBBO Formülü, Adım Adım" : "The CAGR Formula, Step by Step"}
              </h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p className="text-sm sm:text-base">
                {tr ? "Matematik kağıt üzerinde yapılacak kadar basittir:" : "The math is straightforward enough to do on paper:"}
              </p>
              <div className="rounded-xl bg-background/60 border border-border/30 p-4 sm:p-5 font-mono text-sm sm:text-base text-foreground text-center">
                {tr
                  ? <>YBBO = (Bitiş Değeri / Başlangıç Değeri)<sup>1 / Yıl</sup> − 1</>
                  : <>CAGR = (End Value / Start Value)<sup>1 / Years</sup> − 1</>}
              </div>
              <p className="text-sm">
                {tr ? (
                  <>
                    Çalışılmış örnek: Ocak 2016'da ~434 $ Bitcoin fiyatıyla Bitcoin'e yatırılan 10.000 $ yaklaşık 23 BTC satın aldı. Ocak 2026'da bu coinler yaklaşık 2,15 milyon $ değerindedir. Formüle takarak: ($2.150.000 / $10.000)<sup>1/10</sup> − 1 = <span className="font-semibold text-success">≈ yıllık %71,5</span>. Bu sizin YBBO'nuzdur. 2018'de -%77 ve 2022'de -%65 düşüş dahil yolculuk hakkında hiçbir şey söylemez — ancak bileşik ortalamayı söyler.
                  </>
                ) : (
                  <>
                    Worked example: $10,000 invested in Bitcoin in January 2016 at ~$434 per BTC bought roughly 23 BTC. In January 2026 those coins are worth approximately $2.15M. Plugging into the formula: ($2,150,000 / $10,000)<sup>1/10</sup> − 1 = <span className="font-semibold text-success">≈ 71.5% per year</span>. That is your CAGR. It says nothing about the journey — including a -77% drawdown in 2018 and another -65% in 2022 — but it does tell you the compounded average.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <History className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-h2 font-bold text-foreground">
                {tr ? "Yarılanma Döngüleri Boyunca Bitcoin YBBO" : "Bitcoin CAGR Across Halving Cycles"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {tr
                ? "Bitcoin'in getirileri tarihsel olarak dört yıllık yarılanma döngüsü etrafında kümelenir. Her tamamlanmış döngü içindeki YBBO'ya bakmak, takvim yılına bakmaktan daha bilgilendiricidir."
                : "Bitcoin's returns historically cluster around the four-year halving cycle. Looking at CAGR inside each completed cycle is more informative than looking at a calendar year."}
            </p>
            <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
              <table className="w-full text-sm border-collapse min-w-[440px]">
                <thead>
                  <tr className="border-b border-border/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">{tr ? 'Döngü' : 'Cycle'}</th>
                    <th className="py-2 px-2 font-medium">{tr ? 'Pencere' : 'Window'}</th>
                    <th className="py-2 px-2 font-medium text-right">{tr ? 'Başlangıç → Bitiş' : 'Start → End'}</th>
                    <th className="py-2 pl-2 font-medium text-right">{tr ? 'Döngü YBBO' : 'Cycle CAGR'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-medium text-foreground">{tr ? '1. (1. yarılanma sonrası)' : '1st (post-halving 1)'}</td>
                    <td className="py-2 px-2 text-muted-foreground">2012-2016</td>
                    <td className="py-2 px-2 text-right tabular-nums">$12 → $434</td>
                    <td className="py-2 pl-2 text-right tabular-nums font-bold text-success">~145%</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-medium text-foreground">{tr ? '2.' : '2nd'}</td>
                    <td className="py-2 px-2 text-muted-foreground">2016-2020</td>
                    <td className="py-2 px-2 text-right tabular-nums">$434 → $7,200</td>
                    <td className="py-2 pl-2 text-right tabular-nums font-bold text-success">~102%</td>
                  </tr>
                  <tr className="border-b border-border/20">
                    <td className="py-2 pr-4 font-medium text-foreground">{tr ? '3.' : '3rd'}</td>
                    <td className="py-2 px-2 text-muted-foreground">2020-2024</td>
                    <td className="py-2 px-2 text-right tabular-nums">$7,200 → $42,258</td>
                    <td className="py-2 pl-2 text-right tabular-nums font-bold text-success">~55%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-foreground">{tr ? '4. (devam ediyor)' : '4th (in progress)'}</td>
                    <td className="py-2 px-2 text-muted-foreground">2024-2028</td>
                    <td className="py-2 px-2 text-right tabular-nums">$42,258 → $93,354*</td>
                    <td className="py-2 pl-2 text-right tabular-nums font-bold text-warning">~48%*</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic">
              {tr
                ? "*Mevcut döngü tamamlanmadı; rakam Ocak 2024'ten Ocak 2026'ya yıllıklandırıldı. Her döngü, Bitcoin'in piyasa değeri büyüdükçe tarihsel olarak bir öncekinden daha düşük zirve YBBO sağladı — genellikle azalan getiriler olarak adlandırılan bir kalıp."
                : "*Current cycle is incomplete; figure annualized from January 2024 to January 2026. Each cycle has historically delivered a lower peak CAGR than the last as Bitcoin's market cap grows — a pattern often called diminishing returns."}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism-card border-border/20 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-h2 font-bold text-foreground">
                {tr ? "YBBO Yanıltıcı Olduğu Durumlar" : "Where CAGR Misleads"}
              </h2>
            </div>
            <div className="text-muted-foreground space-y-3 text-sm sm:text-base">
              <p>
                <strong className="text-foreground">{tr ? "Yolu gizler." : "It hides the path."}</strong>{' '}
                {tr
                  ? "Yıllık %60 YBBO pürüzsüz bir yolculuk gibi geliyor. Gerçekte tutucu iki adet -%75 düşüş yaşadı. Çoğu yatırımcı yolda bir yerde satmış olurdu."
                  : "A 60% CAGR sounds like a smooth ride. In reality, the holder lived through two -75% drawdowns. Most investors would have sold somewhere along the way."}
              </p>
              <p>
                <strong className="text-foreground">{tr ? "Başlangıç ve bitiş noktaları baskın gelir." : "Start and end points dominate."}</strong>{' '}
                {tr
                  ? "Bir döngü dibinde başlayıp zirvede biten bir YBBO penceresi seçin, istediğiniz hemen hemen her sayıyı üretebilirsiniz. Dürüst YBBO analizi, eşit uzunlukta birden fazla pencere kullanır."
                  : "Pick a CAGR window that begins at a cycle bottom and ends at a top, and you can manufacture nearly any number you want. Honest CAGR analysis uses multiple windows of equal length."}
              </p>
              <p>
                <strong className="text-foreground">{tr ? "Volatilite riskini hesaba katmaz." : "It does not account for volatility risk."}</strong>{' '}
                {tr
                  ? "Aynı YBBO'ya sahip iki varlık tamamen farklı düşüş profillerine sahip olabilir. YBBO'yu her zaman maksimum düşüş ve standart sapmayla birleştirin."
                  : "Two assets with the same CAGR can have wildly different drawdown profiles. Always pair CAGR with maximum drawdown and standard deviation."}
              </p>
              <p>
                <strong className="text-foreground">{tr ? "Gelecekteki getiriler garanti değildir." : "Future returns are not guaranteed."}</strong>{' '}
                {tr
                  ? "Bitcoin'in ilk on yılı, esasen sıfır bir tabandan olağanüstü getiriler sağladı. Piyasa değeri trilyonlara büyüdükçe, aynı yüzde kazançlar çok daha fazla dolar girişi gerektirir."
                  : "Bitcoin's first decade produced extraordinary returns from a base of essentially zero. As market cap grows into the trillions, the same percentage gains require many more dollars of inflows."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
