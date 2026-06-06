import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const DrawdownContentSections = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-12">

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "Bitcoin Kaç Kez %80'den Fazla Düştü?" : "How Many Times Has Bitcoin Dropped More Than 80%?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Dört kez. Bitcoin, tüm zamanların en yüksek değerinden %80'den fazla dört ayrı kez geriledi: 2011 (-%93), 2014 (-%84), 2018 (-%83) ve 2022 (-%77). Her çöküş sonun geldiği gibi hissettirdi. Her seferinde fiyat sonunda bir önceki zirveyi geçerek yeni bir rekor kırdı."
                : "Four times. Bitcoin has fallen more than 80% from its all-time high on four separate occasions: 2011 (-93%), 2014 (-84%), 2018 (-83%), and 2022 (-77%). Each crash felt like the end. Each time, the price eventually broke past the previous peak and set a new record."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "2011 çöküşü en derin olanıdır. BTC yaklaşık beş ayda 32 dolardan yaklaşık 2 dolara düştü. O dönemde tutanların çoğu 2017'ye kadar erken milyoner oldu. 2014 çöküşü Mt. Gox borsasının çökmesinin ardından geldi ve toparlanması iki yılı aştı. 2018'de ICO balonu patladı ve BTC 20.000 dolar seviyesinden 3.200 dolara geriledi. 2022 düşüşü 69.000 dolarlık zirvenin ardından başladı ve FTX'in çöküşünün ardından 15.500 dolar seviyelerinde dip yaptı."
                : "The 2011 crash remains the deepest. BTC dropped from $32 to roughly $2 in about five months. Most people who held through that period became early millionaires by 2017. The 2014 crash followed the Mt. Gox exchange collapse and took over two years to recover. In 2018, the ICO bubble burst and BTC fell from nearly $20,000 to $3,200. The 2022 drawdown started after the $69,000 peak and bottomed near $15,500 following the FTX implosion."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Bu çöküşleri dikkat çekici kılan yalnızca derinlikleri değil. Bitcoin'in her seferinde toparlanmasıdır. Finansal tarihte başka hiçbir varlık dört kez %80'den fazla düşüp her olayın ardından daha güçlü geri gelmedi. Bu kalıp gelecekteki toparlanmaları garanti etmez, ancak Bitcoin'i hisse senetleri, emtialar ve çöküp hiç toparlanamayan diğer kripto paralardan ayırır."
                : "What makes these crashes notable isn't just the depth. It's that Bitcoin recovered every single time. No other asset in financial history has dropped 80%+ four times and come back stronger after each event. That pattern doesn't guarantee future recoveries, but it does set Bitcoin apart from stocks, commodities, and other cryptocurrencies that crashed and never returned."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "2011'den Bu Yana %50'yi Aşan Tüm Bitcoin Çöküşleri" : "All Bitcoin Crashes Over 50% Since 2011"}
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">{tr ? 'Yıl' : 'Year'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Zirve' : 'Peak'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Dip' : 'Trough'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Düşüş' : 'Drop'}</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">{tr ? 'Toparlanma' : 'Recovery'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { year: "2011", peak: "$32", trough: "$2", drop: "-93%", recovery: tr ? "~18 ay" : "~18 months" },
                    { year: "2013 (Nis)" , peak: "$266", trough: "$54", drop: "-80%", recovery: tr ? "~6 ay" : "~6 months" },
                    { year: "2013 (Ara)", peak: "$1,163", trough: "$170", drop: "-85%", recovery: tr ? "~36 ay" : "~36 months" },
                    { year: "2017–18", peak: "$19,783", trough: "$3,200", drop: "-84%", recovery: tr ? "~36 ay" : "~36 months" },
                    { year: "2021–22", peak: "$69,000", trough: "$15,500", drop: "-77%", recovery: tr ? "~24 ay" : "~24 months" },
                    { year: "2025–26", peak: "$126,287", trough: "$80,523", drop: "-36%", recovery: tr ? "Devam ediyor" : "Ongoing" },
                  ].map((row) => (
                    <tr key={row.year} className="border-t border-border/20">
                      <td className="px-4 py-2.5 text-foreground font-medium">{row.year}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.peak}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{row.trough}</td>
                      <td className="px-4 py-2.5 text-right text-destructive font-semibold">{row.drop}</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">{row.recovery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr
                ? "Yukarıdaki tablo, önceki tüm zamanlar en yüksek değerinden %50'yi aşan her Bitcoin düşüşünü kapsamaktadır. %20-40 arasındaki daha küçük düzeltmeler çok daha sık gerçekleşir; genellikle tek bir boğa döngüsü içinde birden çok kez. Bitcoin, tek başına 2017 boğa koşusu sırasında altı ayrı %30'dan fazla düzeltme yaşadı."
                : "The table above covers every Bitcoin drawdown exceeding 50% from the prior all-time high. Smaller corrections of 20-40% happen far more frequently, often multiple times within a single bull cycle. Bitcoin experienced six separate 30%+ corrections during the 2017 bull run alone."}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "Bitcoin Toparlanma Süreleri: Her Çöküşten Sonra Ne Kadar Sürdü?" : "Bitcoin Recovery Times: How Long After Each Crash?"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Toparlanma süreleri büyük farklılıklar gösterir. Büyük bir çöküşten en hızlı toparlanma yaklaşık 6 ay sürdü (266 dolardan 54 dolara Nisan 2013 ani çöküşü). En yavaşı yaklaşık 3 yıl aldı. Hem 2014 hem de 2018 ayı piyasaları Bitcoin bir önceki tüm zamanlar en yüksek değerini yeniden ele geçirmeden önce yaklaşık 36 aya ihtiyaç duydu."
                : "Recovery times vary wildly. The fastest recovery from a major crash took about 6 months (the April 2013 flash crash from $266 to $54). The slowest took roughly 3 years. Both the 2014 and 2018 bear markets needed approximately 36 months before Bitcoin reclaimed its previous all-time high."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Dikkat edilmesi gereken bir kalıp var: toparlanma süreleri kısalmıyor. 2022 çöküşünün toparlanması yaklaşık 24 ay sürdü; bu 2014 veya 2018'den daha hızlı ama yine de önemli bir süre. Kasım 2021'de 69.000 dolarlık zirve noktasında aldıysanız, başa baş noktasına ulaşmak için Mart 2024'e kadar beklediniz."
                : "Here's the pattern worth noting: recovery times haven't been getting shorter. The 2022 crash took around 24 months to recover, which is faster than 2014 or 2018 but still a significant period. If you bought at the $69,000 peak in November 2021, you waited until March 2024 to break even."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Bu yüzden{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">dolar maliyeti ortalaması</Link>, genellikle zirvelerde toplu alımı geride bırakır. Alımları bir düşüş dönemine yaymanız, ortalama maliyet tabanınızın önemli ölçüde düşmesi ve başa baş noktanıza, zirve noktasında tümüne giren birinin çok daha erken ulaşmanız anlamına gelir.
                </>
              ) : (
                <>
                  This is why{' '}
                  <Link to="/calculators/dca" className="text-primary hover:underline">dollar-cost averaging</Link> tends to outperform lump-sum buying at peaks. Spreading purchases across a drawdown period means your average cost basis drops significantly, and your breakeven point arrives much earlier than someone who went all-in at the top.
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              {tr ? "2025-2026 Düşüşü Tarihsel Bağlamda" : "The 2025-2026 Drawdown in Historical Context"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Bitcoin 6 Ekim 2025'te 126.287 dolar ile yeni bir tüm zamanlar yüksek belirledi ve Mayıs 2026'ya kadar yaklaşık 80.500 dolara geri çekildi — yaklaşık %36'lık bir düşüş. Önceki döngülerle karşılaştırıldığında bu düzeltme görece hafiftir: 2022 ayı piyasası %77, 2018 çöküşü ise %84 düştü."
                : "Bitcoin set a fresh all-time high of $126,287 on October 6, 2025 and pulled back to roughly $80,500 by May 2026 — a drawdown of about 36%. Compared to previous cycles this correction is relatively mild: the 2022 bear market saw a 77% decline and the 2018 crash reached 84%."}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3 max-w-prose">
              {tr
                ? "Bu döngüyü yapısal olarak farklı kılan birkaç faktör var. Spot Bitcoin ETF'leri artık 100 milyar doları aşan varlıklar tutarak sürekli kurumsal talep yaratıyor. Nisan 2024 yarılanması günlük yeni arzı 900'den 450 BTC'ye indirdi. Şirket hazineleri (MicroStrategy, Tesla, Block) birikim yapmayı sürdürüyor."
                : "Several factors make this cycle structurally different. Spot Bitcoin ETFs now hold over $100 billion in assets, creating constant institutional demand. The April 2024 halving reduced daily new supply from 900 to 450 BTC. Corporate treasuries (MicroStrategy, Tesla, Block) continue accumulating."}
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              {tr ? (
                <>
                  Bu, düzeltmelerin ilerleyen dönemlerde daha hafif olacağı anlamına mı geliyor? Mutlaka değil. Ancak taban her döngüde yükselir görünüyor. 2022'nin 15.500 dolarlık dibi, 2017'nin 19.783 dolarlık zirvesinden yüksekti. Bu kalıp geçerliliğini korursa, gelecekteki düşüşler dolar miktarları büyüdükçe yüzde olarak daha az sert olabilir. Güncel düşüşü canlı takip etmek için{' '}
                  <Link to="/tr/hesaplayicilar/bitcoin-guc-yasasi" className="text-primary hover:underline">Güç Kanunu modelini</Link> kullanarak BTC'nin adil değere göre nerede durduğunu görün.
                </>
              ) : (
                <>
                  Does that mean corrections will be shallower going forward? Not necessarily. But the floor seems to be rising each cycle. The 2022 bottom of $15,500 was higher than the 2017 peak of $19,783. If that pattern holds, future drawdowns may be less severe in percentage terms even as the dollar amounts grow larger. Track the current drawdown live using the{' '}
                  <Link to="/calculators/power-law" className="text-primary hover:underline">Power Law model</Link> to see where BTC sits relative to fair value.
                </>
              )}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
