import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';

export const WealthContentSections: React.FC = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <article className="prose prose-sm sm:prose-base prose-invert max-w-none">
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? "Bitcoin Serveti Gerçekte Nasıl Dağılıyor" : "How Bitcoin Wealth Is Actually Distributed"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Çoğu insan Bitcoin sahipliğini uzun, düzgün bir tutucu sırası olarak hayal eder. Zincir üstü gerçek daha diktir. 2026 başı BitInfoCharts verilerine göre bakiyeli tüm adreslerin yaklaşık %58'i 0,001 BTC'den az tutarken, 2.000'den az adres 1.000 BTC'den fazlasını elinde bulundurmaktadır. En üst %0,03'lük adresler, dolaşımdaki arzın %60'ından fazlasını kontrol etmektedir; bu konsantrasyon eğrisi, geleneksel para birimlerinden çok erken aşama teknoloji hisselerini andırmaktadır. Hesap makinemizin sizi eğri üzerinde konumlandırmak için kullandığı veriler budur."
              : "Most people imagine Bitcoin ownership as a long, even line of holders. The on-chain reality is steeper. According to BitInfoCharts data from early 2026, roughly 58 percent of all addresses with a balance hold less than 0.001 BTC, while fewer than 2,000 addresses hold more than 1,000 BTC. The top 0.03 percent of addresses control over 60 percent of the circulating supply, a concentration curve that resembles early-stage tech equity more than traditional currency. This is the data the calculator above uses to place you on the curve."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
            {tr ? (
              <>
                Bu konsantrasyonun zaman içinde nasıl değiştiğini daha iyi anlamak için, düzenli birikimin sizi kademeler arasında nasıl yukarı taşıdığını görmek amacıyla{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">Bitcoin DCA hesaplayıcısını</Link> bu araçla eşleştirin veya kademe bazlı birikim hedefi belirlemek için{' '}
                <Link to="/tr/hesaplayicilar/satoshi-biriktirme" className="text-primary hover:underline">Sat Yığınla Hedef hesaplayıcısını</Link> kullanın.
              </>
            ) : (
              <>
                For a fuller picture of how this concentration shifts over time, pair this tool with our{' '}
                <Link to="/calculators/dca" className="text-primary hover:underline">Bitcoin DCA calculator</Link>{' '}
                to see how steady accumulation moves you up the tiers, or use the{' '}
                <Link to="/calculators/stack-sats" className="text-primary hover:underline">Stack Sats Goal calculator</Link>{' '}
                to set a tier-based accumulation target.
              </>
            )}
          </p>

          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? "Adres Kademeleri, Tutucu Sayıları ve Arz Payları" : "Address Tiers, Holder Counts, and Supply Share"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Okyanus temalı kademe adları yalnızca kültür değil. Her kademe, analitik sağlayıcılar tarafından takip edilen gerçek bir adres dilimini karşılar. Aşağıdaki tablo, yüzdeliğinizin puanlandığı dağılımı özetlemektedir."
              : "The ocean-themed tier names are not just culture. Each tier corresponds to a real address bracket tracked by analytics providers. The table below summarizes the distribution your percentile is scored against."}
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0 mb-8">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-border/30 text-xs text-muted-foreground">
                  <th className="text-left font-medium py-2 px-4 sm:px-3">{tr ? 'Kademe' : 'Tier'}</th>
                  <th className="text-left font-medium py-2 px-3">{tr ? 'BTC Aralığı' : 'BTC Range'}</th>
                  <th className="text-right font-medium py-2 px-3">{tr ? 'Adresler' : 'Addresses'}</th>
                  <th className="text-right font-medium py-2 px-4 sm:px-3">{tr ? 'Arz Payı' : 'Supply Share'}</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">Plankton</td><td className="py-2 px-3">&lt; 0.001</td><td className="py-2 px-3 text-right tabular-nums">33.5M</td><td className="py-2 px-4 sm:px-3 text-right">0.04%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">Karides</td><td className="py-2 px-3">0.001 – 0.01</td><td className="py-2 px-3 text-right tabular-nums">11.9M</td><td className="py-2 px-4 sm:px-3 text-right">0.21%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">Yengeç</td><td className="py-2 px-3">0.01 – 0.1</td><td className="py-2 px-3 text-right tabular-nums">8.15M</td><td className="py-2 px-4 sm:px-3 text-right">1.41%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">Ahtapot</td><td className="py-2 px-3">0.1 – 1</td><td className="py-2 px-3 text-right tabular-nums">3.49M</td><td className="py-2 px-4 sm:px-3 text-right">5.30%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">{tr ? 'Balık (Tam Bitcoin Sahibi)' : 'Fish (Wholecoiner)'}</td><td className="py-2 px-3">1 – 10</td><td className="py-2 px-3 text-right tabular-nums">823K</td><td className="py-2 px-4 sm:px-3 text-right">11.87%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">{tr ? 'Yunus' : 'Dolphin'}</td><td className="py-2 px-3">10 – 100</td><td className="py-2 px-3 text-right tabular-nums">131K</td><td className="py-2 px-4 sm:px-3 text-right">19.95%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">{tr ? 'Köpekbalığı' : 'Shark'}</td><td className="py-2 px-3">100 – 1,000</td><td className="py-2 px-3 text-right tabular-nums">17.7K</td><td className="py-2 px-4 sm:px-3 text-right">24.60%</td></tr>
                <tr className="border-b border-border/20"><td className="py-2 px-4 sm:px-3">{tr ? 'Balina' : 'Whale'}</td><td className="py-2 px-3">1,000 – 10,000</td><td className="py-2 px-3 text-right tabular-nums">1,941</td><td className="py-2 px-4 sm:px-3 text-right">23.48%</td></tr>
                <tr><td className="py-2 px-4 sm:px-3">{tr ? 'Dev Balina + Kambur Balina' : 'Mega Whale + Humpback'}</td><td className="py-2 px-3">10,000+</td><td className="py-2 px-3 text-right tabular-nums">89</td><td className="py-2 px-4 sm:px-3 text-right">13.13%</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mb-8">
            {tr
              ? "Kaynak: BitInfoCharts ve Glassnode adres dağılımı anlık görüntüleri, Şubat 2026. Sıfırdan farklı bakiyeli toplam adresler: ~57,97 milyon. Toplam madencilik arzı: ~19,8 milyon BTC."
              : "Source: BitInfoCharts and Glassnode address distribution snapshots, February 2026. Total addresses with non-zero balance: ~57.97 million. Total mined supply: ~19.8 million BTC."}
          </p>

          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? "Adresler İnsan Değildir" : "Addresses Are Not People"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Zincir üstü verilerle yapılan en kolay hatalardan biri bir adresi bir kişi olarak ele almaktır. Bunlar aynı şey değildir. Tek bir kullanıcı, bir cüzdan aracılığıyla birçok adres genelinde yüzlerce UTXO'yu kontrol edebilirken, merkezi bir borsa milyonlarca kullanıcı için Bitcoin'i bir avuç soğuk depolama adresinde tutabilir. Coinbase, Binance ve Bitfinex, elli'den az kamuya bilinen adres genelinde toplam BTC arzının %5'inden fazlasını toplu olarak tutar. Bu nedenle Dağılım Lensi, ham adres sayısı, tahmini bireysel görünüm ve yalnızca gözetim altında olmayan görünüm arasında geçiş yapmanıza olanak tanır."
              : "One of the easiest mistakes to make with on-chain data is treating an address as a person. They are not the same thing. A single user can control hundreds of UTXOs across many addresses through one wallet, while a centralized exchange can custody Bitcoin for millions of users in a handful of cold-storage addresses. Coinbase, Binance, and Bitfinex collectively custody more than 5 percent of all BTC supply across fewer than fifty publicly known addresses. That is why our Distribution Lens lets you switch between the raw address count, an estimated unique-individual view, and a non-custodial-only view."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
            {tr
              ? "Glassnode, 2026 başı itibarıyla dünya genelinde yaklaşık 106 milyon kişinin herhangi bir BTC tuttuğunu ve bakiyeli yaklaşık 58 milyon adres bulunduğunu tahmin etmektedir. Bu iki rakam birbirini çelişmez. Farklı paydaları tanımlarlar."
              : "Glassnode estimates roughly 106 million people worldwide hold any BTC as of early 2026, against roughly 58 million addresses with a balance. The two numbers do not contradict each other. They describe different denominators."}
          </p>

          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? "Bir Bitcoin Bile Ulaşılabilir mi?" : "Is One Bitcoin Even Achievable?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Tam bir Bitcoin sahibi olma sorusu, hesap makinemizde gördüğümüz en yaygın hedef. Matematik hem güven verici hem de rahatsız edici. Yaklaşık 823.000 adres 1 BTC veya daha fazlasını tutuyor. Birden fazla adres kullanan bireyler için tekilleştirme yapıldıktan sonra bile, gerçekçi tam Bitcoin sahibi sayısı dünya genelinde 500.000 ile 800.000 kişi arasındadır. Bu, dünya nüfusunun %0,01'inin oldukça altındadır."
              : "The wholecoiner question, owning a full BTC, is the most common goal we see in the calculator. The math is reassuring and uncomfortable at the same time. Approximately 823,000 addresses hold 1 BTC or more. Even after deduplicating for individuals using multiple addresses, the realistic wholecoiner count sits between 500,000 and 800,000 people globally. That is well under 0.01 percent of the world population."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-prose">
            {tr ? (
              <>
                DCA yoluyla 1 BTC'ye ulaşmak matematiksel olarak basit, ancak sabır gerektiriyor. Aylık 5.000 $ birikim hızı ve mevcut spot seviyelerde, tam Bitcoin sahibi pozisyonu giriş fiyatına bağlı olarak yaklaşık on iki ile on sekiz ay uzaktadır.{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dca-hesaplayicisi" className="text-primary hover:underline">DCA hesaplayıcısı</Link> bunu doğrudan modellemektedir. Hedefe dayalı bir plan için{' '}
                <Link to="/tr/hesaplayicilar/satoshi-biriktirme" className="text-primary hover:underline">Sat Yığınla Hedef hesaplayıcısına</Link> bakın.
              </>
            ) : (
              <>
                Reaching 1 BTC through DCA is mathematically straightforward but takes patience. At a $5,000 per month accumulation rate and current spot levels, a wholecoiner position is roughly twelve to eighteen months away depending on entry price. The{' '}
                <Link to="/calculators/dca" className="text-primary hover:underline">DCA calculator</Link> models this directly. For a goal-based plan, see the{' '}
                <Link to="/calculators/stack-sats" className="text-primary hover:underline">Stack Sats Goal calculator</Link>.
              </>
            )}
          </p>

          <h2 className="text-h2 font-bold text-foreground mb-4">
            {tr ? "Daha Yüksek BTC Fiyatlarında Yığınınız Nasıl Görünür" : "What Your Stack Looks Like at Higher BTC Prices"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 max-w-prose">
            {tr
              ? "Bitcoin serveti, fiat cinsinden doğrusal değildir. Yukarıdaki Gelecek Fiyat Senaryoları paneli, varlıklarınızı alarak BTC başına 200.000 $, 500.000 $ ve 1.000.000 $'daki dolar değerini öngörür. Bunlar, Fidelity, ARK Invest ve Standard Chartered'daki analistler tarafından döngü sonu ve uzun vadeli hedefler olarak kullanılan açıklayıcı kontrol noktalarıdır. Panelin amacı fiyatları tahmin etmek değil. Bugünün yığınını, Federal Rezerv Tüketici Finansmanı Anketi dilimleri gibi fiat para birimlerinden servet yöneticilerinin kullandığı servet kademelerine çevirmektir."
              : "Bitcoin wealth is non-linear in fiat terms. The Future-Price Scenarios panel above takes your holdings and projects the dollar value at $200,000, $500,000, and $1,000,000 per BTC. These are illustrative checkpoints used by analysts at Fidelity, ARK Invest, and Standard Chartered as cycle-end and long-horizon targets. The point of the panel is not to predict prices. It is to translate today's stack into the wealth tiers that fiat-denominated wealth managers use, like the Federal Reserve Survey of Consumer Finances brackets."}
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            {tr ? (
              <>
                Coin başına 1 milyon $ değerinde 1 BTC pozisyonu, ABD hanehalkı net servetinin en üst %10'una girer. Aynı fiyatta 0,1 BTC yığını bile ABD ortalamasını geniş bir marjla aşar. Asimetri tüm tezdir. Sabit arz sınırı ve büyüyen küresel talebe sahip bir varlıktaki küçük bir pozisyon, geleneksel varlık sınıflarına yatırılan eşdeğer sermayeden çok daha hızlı şekilde yüzdeliğinizi yeniden şekillendirebilir. Olumsuz senaryoyu stres testine tabi tutmak için yukarıdaki senaryoları{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-dusus-analizi" className="text-primary hover:underline">düşüş hesaplayıcısı</Link> ve{' '}
                <Link to="/tr/hesaplayicilar/bitcoin-oynaklik" className="text-primary hover:underline">volatilite hesaplayıcısı</Link> ile eşleştirin.
              </>
            ) : (
              <>
                A 1 BTC position at $1M per coin lands in the top 10 percent of US household net worth. A 0.1 BTC stack at the same price still clears the US median by a wide margin. The asymmetry is the entire thesis. A small position in an asset with a hard supply cap and growing global demand can reshape your percentile faster than equivalent capital deployed in traditional asset classes. To stress test the downside, pair the scenarios above with our{' '}
                <Link to="/calculators/drawdown" className="text-primary hover:underline">drawdown calculator</Link>{' '}
                and the{' '}
                <Link to="/calculators/volatility" className="text-primary hover:underline">volatility calculator</Link>.
              </>
            )}
          </p>
        </article>
      </div>
    </section>
  );
};
