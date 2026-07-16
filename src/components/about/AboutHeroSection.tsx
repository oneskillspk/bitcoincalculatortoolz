import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "@/components/LocalizedLink";

const getStats = (isTr: boolean) => isTr
  ? [
      { value: "15+",       label: "Bitcoin'de Yıl" },
      { value: "49+",       label: "Profesyonel Araç" },
      { value: "100%",      label: "Gizlilik Önce" },
      { value: "Ücretsiz",  label: "Gizli Ücret Yok" },
    ]
  : [
      { value: "15+",  label: "Years in Bitcoin" },
      { value: "49+",  label: "Professional Tools" },
      { value: "100%", label: "Privacy First" },
      { value: "Free", label: "No Hidden Fees" },
    ];

export const AboutHeroSection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const stats = getStats(isTr);

  return (
    <section className="relative pt-4 pb-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]"
      />

      <div className="relative container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">

          <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
            {isTr
              ? "2010'dan beri · Bitcoin yatırımcıları"
              : "Since 2010 · Built by Bitcoin investors"}
          </span>

          <h1 className="mt-6 font-light tracking-[-0.02em] leading-[1.08] text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] text-foreground">
            {isTr ? "Bitcoin Yatırımcılarına" : "Helping Bitcoin"}
            <br />
            <span className="text-foreground/55">
              {isTr ? "Her Yerde Yardım Ediyoruz" : "Investors Everywhere"}
            </span>
          </h1>

          <p className="mt-7 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty">
            {isTr ? (
              <>Daha akıllı yatırım kararları için doğru, şeffaf ve tamamen ücretsiz <Link to="/" className="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary transition-colors">Bitcoin hesaplayıcılar</Link> geliştiriyoruz.</>
            ) : (
              <>We build accurate, transparent, and completely free <Link to="/" className="underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary transition-colors">Bitcoin calculators</Link> so you can make smarter investment decisions.</>
            )}
          </p>

          <p className="mt-4 text-[12px] text-muted-foreground/70 max-w-xl mx-auto leading-relaxed">
            {isTr ? "Kurucu: " : "Founded by "}
            <a
              href="https://twitter.com/web3believers"
              target="_blank"
              rel="me noopener noreferrer"
              className="text-foreground/70 hover:text-primary underline underline-offset-4 decoration-border transition-colors"
            >
              @web3believers
            </a>
            {isTr ? " · Veri: " : " · Data from "}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-primary underline underline-offset-4 decoration-border transition-colors"
            >
              CoinGecko {isTr ? "genel API" : "public API"}
            </a>
          </p>

        </div>

        <div className="mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40 border-y border-border/50">
          {stats.map((stat, i) => (
            <div key={i} className="px-6 py-7 text-center">
              <div className="text-[1.75rem] md:text-[2rem] font-light tracking-[-0.02em] text-foreground leading-none">
                {stat.value}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
