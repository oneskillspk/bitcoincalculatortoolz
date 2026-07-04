import { Check, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getTrustPoints = (isTr: boolean) => [
  {
    us: isTr ? "2010'dan beri aktif, 15+ yıl Bitcoin deneyimi" : "15+ years of Bitcoin experience, active since 2010",
    them: isTr ? "Bitcoin geçmişi olmayan genel fintech girişimleri" : "Generic fintech startups with no Bitcoin history",
  },
  {
    us: isTr ? "CoinGecko API'sinden canlı veriler, kaynaklı ve şeffaf" : "Live data from the CoinGecko API, cited and transparent",
    them: isTr ? "Listelenmemiş veya doğrulanmamış veri kaynakları" : "Data sources unlisted or unverified",
  },
  {
    us: isTr ? "Sıfır veri toplama ile istemci taraflı işlem" : "Client-side processing with zero data collection",
    them: isTr ? "Veri toplama, takip pikselleri ve hesap duvarları" : "Data harvesting, tracking pixels, account walls",
  },
  {
    us: isTr ? "Sonsuza kadar %100 ücretsiz, asla ödeme duvarı yok" : "100% free, no paywalls, no premium tiers, ever",
    them: isTr ? "Temel özellikler ödeme arkasında kilitli freemium modeller" : "Freemium models with key features locked behind payment",
  },
  {
    us: isTr ? "Her formül sayfada belgelenmiş açık metodolojiler" : "Open methodologies with every formula documented",
    them: isTr ? "Hiçbir açıklama yapılmayan kara kutu algoritmalar" : "Black-box algorithms with no explanation",
  },
  {
    us: isTr ? "Bağımsız, topluluk odaklı, VC finansmanı yok" : "Independent and community-driven, no VC funding",
    them: isTr ? "Kullanıcı verisi ürün olarak VC destekli platformlar" : "VC-funded with user data as the product",
  },
  {
    us: isTr ? "49'dan fazla amaca özel Bitcoin aracı, başka hiçbir şey değil" : "49+ purpose-built Bitcoin tools and nothing else",
    them: isTr ? "Çok varlıklı platformlarda sonradan düşünce olarak Bitcoin" : "Bitcoin as an afterthought on multi-asset platforms",
  },
];

export const AboutWhyTrustSection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const trustPoints = getTrustPoints(isTr);

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 mb-12">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
                {isTr ? "Neden Biz" : "Why Us"}
              </span>
              <h2 className="mt-4 text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] text-foreground">
                {isTr ? "Neden Bize Güvenmelisiniz" : "Why Trust Us"}
              </h2>
              <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed text-pretty">
                {isTr
                  ? "Gerçekten önemli olan konularda tipik kripto araçlarına karşı nasıl konumlandığımız."
                  : "How we stack up against typical crypto tools on the things that actually matter."}
              </p>
            </div>

            <div className="border-y border-border/50 divide-y divide-border/40">
              <div className="grid grid-cols-2 gap-6 py-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/80 font-semibold">
                  Bitcoin Calculator Tools
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-semibold">
                  {isTr ? "Diğer Araçlar" : "Other Tools"}
                </span>
              </div>

              {trustPoints.map((point, i) => (
                <div key={i} className="grid grid-cols-2 gap-6 py-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-3.5 h-3.5 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] text-foreground/85 leading-[1.55]">{point.us}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Minus className="w-3.5 h-3.5 text-muted-foreground/40 mt-1 shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] text-muted-foreground/65 leading-[1.55]">{point.them}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[12px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {isTr ? "Tüm Bitcoin fiyat verileri " : "All Bitcoin price data comes from the "}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary underline underline-offset-4 decoration-border transition-colors"
            >
              CoinGecko {isTr ? "genel API'sinden" : "public API"}
            </a>
            {isTr ? " gelmektedir. Madencilik verileri " : ". Mining data from "}
            <a
              href="https://mempool.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary underline underline-offset-4 decoration-border transition-colors"
            >
              mempool.space
            </a>
            {isTr
              ? ". Vergi referansları IRS ve uluslararası vergi otoritelerinden. Hesaplamalar eğitim amaçlıdır."
              : ". Tax references from IRS publications and international tax authorities. Calculations are for educational purposes only."}
          </p>

        </div>
      </div>
    </section>
  );
};
