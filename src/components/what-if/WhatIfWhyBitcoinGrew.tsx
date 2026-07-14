import React from 'react';
import { Link } from "@/components/LocalizedLink";
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/what-if/SectionHeader';

export const WhatIfWhyBitcoinGrew = () => {
  const { language } = useLanguage();
  const tr = language==='tr';

  return (
    <div className="mt-12 md:mt-16">
      <div className="max-w-3xl mx-auto">

        <SectionHeader
          title={tr ? 'Bitcoin Neden Öne Çıktı' : 'Why Bitcoin Outperformed'}
        />

        <div className="space-y-4 text-muted-foreground leading-relaxed">
          {tr ? (
            <>
              <p>
                Bitcoin için "ya alsaydım" hesaplayıcısı kullandığınızda erken dönem yatırımların getirileri neredeyse inanılmaz görünebilir. 2010'da yapılan 100 $'lık bir yatırım bugün on milyonlarca dolar değerinde olurdu. Ancak bu rakamlar rastgele değil — bunlar Bitcoin'i hisse senetlerinden, tahvillerden ve gayrimenkulden ayıran temel ekonomik dinamiklerden kaynaklanmaktadır.
              </p>
              <p>
                <strong className="text-foreground">Sabit arz ve yarılanma döngüleri.</strong> Bitcoin'in 21 milyon coin'lik sert bir sınırı var. Yaklaşık her dört yılda bir madencilik ödülü yarıya iner — bu olaya{' '}
                <Link to="/calculators/halving-countdown" className="text-primary hover:underline">Bitcoin yarılanması</Link>{' '}
                adı verilir. Bu programatik arz azalması tarihsel olarak büyük fiyat yükselişlerinin öncüsü olmuştur: 2012 yarılanmasının ardından Bitcoin 12 $'dan 1.000 $'ın üzerine çıktı; 2016 sonrasında neredeyse 20.000 $'a ulaştı; 2020 yarılanmasının ardından ise 69.000 $'ı aştı. Her döngü, "yarılanmadan önce Bitcoin alsaydım ne olurdu" senaryolarını çalıştıran yeni yatırımcıları çekiyor — yukarıdaki hesap makinesi tam olarak bunu test etmenizi sağlıyor.
              </p>
              <p>
                <strong className="text-foreground">Kurumsal benimseme ve ETF'ler.</strong> Bitcoin artık niş bir deney değil. Ocak 2024'te spot Bitcoin ETF'lerinin onaylanması milyarlarca dolarlık kurumsal sermayeyi getirdi ve Bitcoin'i geleneksel aracılık hesapları üzerinden erişilebilir kıldı. MicroStrategy, Tesla ve Block gibi şirketler bilançolarında Bitcoin tutuyor. Bu büyüyen benimseme, giderek azalan yeni arzın karşısında sürdürülebilir bir talep yaratıyor — uzun vadeli fiyat artışını besleyen temel dinamik bu.
              </p>
              <p>
                <strong className="text-foreground">Ağ etkisi ve dijital kıtlık.</strong> Daha fazla insan, işletme ve hükümet Bitcoin'i benimsedikçe faydası ve algılanan değeri artıyor. Altından farklı olarak Bitcoin dakikalar içinde her yere gönderilebilir. Hisse senetlerinden farklı olarak aracısız 7/24 işlem görür. Bu kıtlık, taşınabilirlik ve büyüyen benimseme kombinasyonu, tarihsel getiri hesaplamalarının{' '}
                <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">S&P 500 ve diğer geleneksel varlıklara</Link>{' '}
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
                <Link to="/calculators/halving-countdown" className="text-primary hover:underline">Bitcoin halving</Link>.{' '}
                This programmatic supply reduction has historically preceded major price rallies: after the 2012 halving, Bitcoin went from $12 to over $1,000; after 2016, it reached nearly $20,000; and following the 2020 halving, it surpassed $69,000. Each cycle attracts new investors who run "what if I bought Bitcoin before the halving" scenarios — and the calculator above lets you test exactly that.
              </p>
              <p>
                <strong className="text-foreground">Institutional adoption and ETFs.</strong> Bitcoin is no longer a niche experiment. The approval of spot Bitcoin ETFs in January 2024 brought billions in institutional capital, making Bitcoin accessible through traditional brokerage accounts. Companies like MicroStrategy, Tesla, and Block hold Bitcoin on their balance sheets. This growing adoption creates sustained demand against a shrinking new supply — the core dynamic that drives long-term price appreciation.
              </p>
              <p>
                <strong className="text-foreground">Network effect and digital scarcity.</strong> As more people, businesses, and governments adopt Bitcoin, its utility and perceived value increase. Unlike gold, Bitcoin can be sent anywhere in minutes. Unlike stocks, it trades 24/7 with no intermediaries. This combination of scarcity, portability, and growing adoption explains why historical return calculations consistently show outsized gains compared to the{' '}
                <Link to="/calculators/lump-sum-vs-dca" className="text-primary hover:underline">S&P 500 and other traditional assets</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

};
