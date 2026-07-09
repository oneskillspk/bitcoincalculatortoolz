import { Twitter, ExternalLink } from "lucide-react";
import { Twitter, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getTeam = (isTr: boolean) => [
  {
    name: "Web3Believer",
    role: isTr ? "Kurucu & Bitcoin Uzmanı" : "Creator & Bitcoin Expert",
    avatar: "/web3believer-photo.png",
    bio: isTr
      ? "Asya merkezli bir Bitcoin yatırımcısı ve çok zincirli trader. Çoğu borsanın bile var olmadığı 2010'dan beri Bitcoin ekosisteminde, 2011'den beri Twitter'da @web3believers olarak aktif."
      : "An Asia-based Bitcoin investor and multi-chain trader. In the Bitcoin ecosystem since 2010 — before most exchanges existed — and active on Twitter as @web3believers since 2011.",
    pseudonymNote: isTr
      ? "Web3Believer, 2011'den beri kullanılan tutarlı bir takma addır. 15 yıllık doğrulanabilir bir sicilin arkasındaki kimliktir."
      : "Web3Believer is a consistent pseudonym used since 2011, attached to a 15-year verifiable track record.",
    social: "https://twitter.com/web3believers",
    handle: "@web3believers",
    relMe: true,
  },
  {
    name: "Webio",
    role: isTr ? "Kurucu Ortak & İçerik Başkanı" : "Co-creator & Head of Content",
    avatar: "/webio-photo.png",
    bio: isTr
      ? "Finansal yazar, Web3 araştırmacısı ve içerik stratejisti. 49'dan fazla hesaplayıcının eğitim makalelerini ve 'Nasıl Çalışır?' rehberlerini yazıyor."
      : "Financial writer, Web3 researcher, and content strategist. Writes the educational articles and 'How It Works' guides across all 49+ calculators.",
    pseudonymNote: null,
    social: "https://x.com/webio",
    handle: "@webio",
    relMe: false,
  },
];

const getDataSources = (isTr: boolean) => [
  {
    label: isTr ? "Canlı Bitcoin Fiyatı" : "Live Bitcoin Price",
    source: "CoinGecko Public API",
    url: "https://www.coingecko.com/en/api",
    detail: isTr ? "30 saniyede bir güncellenir" : "Updated every 30 seconds",
  },
  {
    label: isTr ? "Geçmiş BTC Fiyat Verisi" : "Historical BTC Price Data",
    source: "CoinGecko Historical API",
    url: "https://www.coingecko.com/en/api",
    detail: isTr ? "2010'a kadar eksiksiz veri" : "Complete data back to 2010",
  },
  {
    label: isTr ? "Madencilik & Ücret Verisi" : "Mining & Fee Data",
    source: "mempool.space API",
    url: "https://mempool.space",
    detail: isTr ? "Gerçek zamanlı hash oranı ve ücretler" : "Real-time hash rate and fees",
  },
  {
    label: isTr ? "Vergi Referans Verisi" : "Tax Reference Data",
    source: isTr ? "IRS + Uluslararası Otoriteler" : "IRS + International Authorities",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/virtual-currencies",
    detail: isTr ? "Yıllık olarak gözden geçirilir" : "Reviewed annually",
  },
];

export const AboutTeamSection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const team = getTeam(isTr);
  const dataSources = getDataSources(isTr);

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
              {isTr ? "Ekibimiz" : "Our Team"}
            </span>
            <h2 className="mt-4 mb-5 text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] text-foreground">
              {isTr ? "Bitcoinciler Tarafından İnşa Edildi" : "Built by Bitcoiners"}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
              {isTr
                ? "Bu alanda Bitcoin yatırımcılarının gerçekten neye ihtiyacı olduğunu bilecek kadar uzun süredir olan iki kişi."
                : "Two people who have been in this space long enough to know what Bitcoin investors actually need."}
            </p>
          </div>

          <div className="divide-y divide-border/40 border-y border-border/50 mb-20">
            {team.map((member, i) => (
              <article key={i} className="py-10">


                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
                    {member.role}
                  </div>
                  <h3 className="mt-1.5 text-[1.25rem] font-light tracking-[-0.01em] text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-3 text-[14px] text-muted-foreground leading-[1.65] text-pretty max-w-2xl">
                    {member.bio}
                  </p>
                  {member.pseudonymNote && (
                    <p className="mt-3 text-[12px] text-muted-foreground/65 leading-[1.6] max-w-2xl italic">
                      {member.pseudonymNote}
                    </p>
                  )}
                  <a
                    href={member.social}
                    target="_blank"
                    rel={member.relMe ? "me noopener noreferrer" : "noopener noreferrer"}
                    className="group mt-4 inline-flex items-center gap-2 text-[13px] text-foreground/70 hover:text-primary transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    <span className="underline underline-offset-4 decoration-border group-hover:decoration-primary/40">
                      {member.handle}
                    </span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.18em] text-foreground/80 font-semibold">
                {isTr ? "Veri Kaynakları" : "Data Sources"}
              </h3>
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {isTr ? "Doğrulandı · Düzenli güncellenir" : "Verified · Updated regularly"}
              </span>
            </div>

            <div className="border-y border-border/50 divide-y divide-border/40">
              {dataSources.map((ds, i) => (
                <div key={i} className="grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-8 py-4">
                  <div>
                    <p className="text-[14px] font-medium text-foreground">{ds.label}</p>
                    <p className="text-[12px] text-muted-foreground/70 mt-0.5">{ds.detail}</p>
                  </div>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-foreground/70 hover:text-primary font-mono tracking-tight underline underline-offset-4 decoration-border transition-colors whitespace-nowrap self-center"
                  >
                    {ds.source}
                  </a>
                </div>
              ))}
            </div>

            <p className="mt-6 text-[12px] text-muted-foreground leading-relaxed max-w-3xl">
              {isTr
                ? "Tüm hesaplamalar yalnızca eğitim amaçlıdır ve finansal tavsiye niteliği taşımaz. Bitcoin yatırımları önemli riskler içerir. Geçmiş performans gelecekteki sonuçları garanti etmez."
                : "All calculations are for educational purposes only and do not constitute financial advice. Bitcoin investments carry significant risk. Past performance does not guarantee future results."}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
