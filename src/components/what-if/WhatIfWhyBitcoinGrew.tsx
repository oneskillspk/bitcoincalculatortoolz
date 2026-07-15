import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/what-if/SectionHeader';

export const WhatIfWhyBitcoinGrew = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 mt-12 md:mt-16">
      <div>

        <SectionHeader
          title={tr ? 'Bitcoin Neden Öne Çıktı' : 'Why Bitcoin Outperformed'}
        />

        <div className="text-base text-muted-foreground leading-relaxed space-y-4 max-w-3xl mx-auto">
          {tr ? (
            <>
              <p>
                Bitcoin için "ya alsaydım" hesaplayıcısı kullandığınızda erken dönem yatırımların getirileri neredeyse inanılmaz görünebilir. 2010'da yapılan 100 $'lık bir yatırım bugün on milyonlarca dolar değerinde olurdu. Ancak bu rakamlar rastgele değil — bunlar Bitcoin'i hisse senetlerinden, tahvillerden ve gayrimenkulden ayıran temel ekonomik dinamiklerden kaynaklanmaktadır.
              </p>
              <p>
                <strong className="text-foreground">Sabit arz ve yarılanma döngüleri.</strong> Bitcoin'in 21 milyon coin'lik sert bir sınırı var. Yaklaşık her dört yılda bir madencilik ödülü yarıya iner — bu olaya{' '}
                <Link to="/calculators/halving-countdown" className="text-primary underline underline-offset-2 decoration-primary/50 hover:decoration-primary">Bitcoin yarılanması</Link>{' '}
                adı verilir. Bu programatik arz azalması tarihsel olarak büyük fiyat yükselişlerinin öncüsü olmuştur: 2012 yarılanmasının ardından Bitcoin 12 $'dan 1.000 $'ın üzerine çıktı; 2016 sonrasında neredeyse 20.000 $'a ulaştı; 2020 yarılanmasının ardından ise 69.000 $'ı aştı. En son Nisan 2024 yarılanması blok ödülünü 3,125 BTC'ye düşürdü ve Bitcoin\'i Ekim 2025\'te 126.198 $\'lık yeni bir tüm zamanların en yükseğine taşıyan döngüyü başlattı. Her döngü, "yarılanmadan önce Bitcoin alsaydım ne olurdu" senaryolarını çalıştıran yeni yatırımcıları çekiyor — yukarıdaki hesap makinesi tam olarak bunu test etmenizi sağlıyor.
              </p>
              <p>
                <strong className="text-foreground">Kurumsal benimseme ve ETF'ler.</strong> Bitcoin artık niş bir deney değil. Ocak 2024'te spot Bitcoin ETF'lerinin onaylanması milyarlarca dolarlık kurumsal sermayeyi getirdi ve Bitcoin'i geleneksel aracılık hesapları üzerinden erişilebilir kıldı. Temmuz 2026 itibarıyla ABD spot ETF'lerine kümülatif net girişler 80 milyar $'ı aştı; BlackRock\'ın IBIT\'i tek başına 700.000 BTC\'nin üzerinde tutuyor. MicroStrategy, Tesla ve Block gibi şirketler bilançolarında Bitcoin tutmaya devam ediyor. Bu büyüyen benimseme, giderek azalan yeni arzın karşısında sürdürülebilir bir talep yaratıyor — uzun vadeli fiyat artışını besleyen temel dinamik bu.
              </p>
              <p>
                <strong className="text-foreground">Ağ etkisi ve dijital kıtlık.</strong> Daha fazla insan, işletme ve hükümet Bitcoin'i benimsedikçe faydası ve algılanan değeri artıyor. Altından farklı olarak Bitcoin dakikalar içinde her yere gönderilebilir. Hisse senetlerinden farklı olarak aracısız 7/24 işlem görür. Bu kıtlık, taşınabilirlik ve büyüyen benimseme kombinasyonu, tarihsel getiri hesaplamalarının{' '}
                <Link to="/calculators/lump-sum-vs-dca" className="text-primary underline underline-offset-2 decoration-primary/50 hover:decoration-primary">S&P 500 ve diğer geleneksel varlıklara</Link>{' '}
                kıyasla neden tutarlı biçimde olağanüstü kazançlar gösterdiğini açıklıyor.
              </p>
            </>
          ) : (
            <>
              <p>
                When you use a "what if" calculator for Bitcoin, the returns from early investments can seem almost unbelievable. A $100 investment in 2010 would be worth tens of millions today. But these numbers aren't random — they're driven by fundamental economic mechanics that set Bitcoin apart from stocks, bonds, and real estate.
              </p>
              <p>
                <strong className="text-foreground">Fixed supply and halving cycles.</strong> Bitcoin has a hard cap of 21 million coins. Roughly every four years, the mining reward is cut in half — an event called the{' '}
                <Link to="/calculators/halving-countdown" className="text-primary underline underline-offset-2 decoration-primary/50 hover:decoration-primary">Bitcoin halving</Link>.{' '}
                This programmatic supply reduction has historically preceded major price rallies: after the 2012 halving, Bitcoin went from $12 to over $1,000; after 2016, it reached nearly $20,000; and following the 2020 halving, it surpassed $69,000. The most recent April 2024 halving cut the block reward to 3.125 BTC and kicked off the cycle that carried Bitcoin to a fresh all-time high of $126,198 in October 2025. Each cycle attracts new investors who run "what if I bought Bitcoin before the halving" scenarios — and the calculator above lets you test exactly that.
              </p>
              <p>
                <strong className="text-foreground">Institutional adoption and ETFs.</strong> Bitcoin is no longer a niche experiment. The approval of spot Bitcoin ETFs in January 2024 brought billions in institutional capital, making Bitcoin accessible through traditional brokerage accounts. Cumulative net inflows into US spot ETFs surpassed $80 billion by July 2026, with BlackRock's IBIT alone holding more than 700,000 BTC. Companies like MicroStrategy, Tesla, and Block continue to hold Bitcoin on their balance sheets. This growing adoption creates sustained demand against a shrinking new supply — the core dynamic that drives long-term price appreciation.
              </p>
              <p>
                <strong className="text-foreground">Network effect and digital scarcity.</strong> As more people, businesses, and governments adopt Bitcoin, its utility and perceived value increase. Unlike gold, Bitcoin can be sent anywhere in minutes. Unlike stocks, it trades 24/7 with no intermediaries. This combination of scarcity, portability, and growing adoption explains why historical return calculations consistently show outsized gains compared to the{' '}
                <Link to="/calculators/lump-sum-vs-dca" className="text-primary underline underline-offset-2 decoration-primary/50 hover:decoration-primary">S&P 500 and other traditional assets</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

};
