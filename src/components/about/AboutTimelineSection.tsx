import { useLanguage } from "@/contexts/LanguageContext";

const getMilestones = (isTr: boolean) => [
  {
    year: "2010",
    title: isTr ? "Bitcoin Yolculuğu Başlıyor" : "Bitcoin Journey Begins",
    description: isTr
      ? "Web3Believer, ana akım borsalardan ve 'blok zinciri' kelimesi yaygınlaşmadan önce erken benimseyici olarak Bitcoin'e giriyor."
      : "Web3Believer gets into Bitcoin as an early adopter, before mainstream exchanges and before 'blockchain' was a common word.",
  },
  {
    year: "2011",
    title: isTr ? "Topluluk Kimliği Oluşturuldu" : "Community Identity Established",
    description: isTr
      ? "@web3believers Twitter hesabı yayına girerek bugün hâlâ aktif olan bir Bitcoin kimliği kuruluyor."
      : "The @web3believers Twitter account goes live, establishing a Bitcoin identity that is still active today.",
  },
  {
    year: "2020",
    title: isTr ? "Fikir Şekilleniyor" : "The Idea Takes Shape",
    description: isTr
      ? "Yıllarca spreadsheet'lerde DCA ve emeklilik hesaplamalarından sonra ihtiyaç netleşiyor: bu araçlar herkese ücretsiz olmalı."
      : "After years of running DCA and retirement calculations in spreadsheets, the need becomes obvious: these tools should be free for everyone.",
  },
  {
    year: "2024",
    title: isTr ? "İlk Hesaplayıcılar Yayında" : "First Calculators Launch",
    description: isTr
      ? "Ya-Olsaydı, DCA ve Emeklilik hesaplayıcıları, gerçek geçmiş fiyat verileriyle yayına giriyor."
      : "The What-If, DCA, and Retirement calculators go live, built on real historical price data.",
  },
  {
    year: "2025",
    title: isTr ? "Araçlar Genişliyor" : "Expanding the Tools",
    description: isTr
      ? "Vergi, HODL Stratejisi, Madencilik Kârlılığı, Lightning, Güç Yasası, Gökkuşağı Grafiği ve daha fazlası ekleniyor."
      : "Tax, HODL Strategy, Mining Profitability, Lightning, Power Law, Rainbow Chart, and more are added to the suite.",
  },
  {
    year: "2026",
    title: isTr ? "46'dan Fazla Araç & Tam Cilalama" : "49+ Tools & Full Polish",
    description: isTr
      ? "100'den fazla fiat para birimi, modernize arayüz, 46'dan fazla profesyonel hesaplayıcı ve 30'dan fazla rehber."
      : "100+ fiat currencies, a modernized interface, 49+ professional calculators, and 30+ educational guides.",
  },
];

export const AboutTimelineSection = () => {
  const { language } = useLanguage();
  const isTr = language === 'tr';
  const milestones = getMilestones(isTr);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.18em]">
              {isTr ? "Yolculuğumuz" : "Our Journey"}
            </span>
            <h2 className="mt-4 mb-5 text-[1.875rem] sm:text-[2.25rem] md:text-[2.5rem] font-light tracking-[-0.01em] leading-[1.12] text-foreground">
              {isTr ? "İlk Günden Bugüne" : "From Day One to Today"}
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
              {isTr
                ? "Erken Bitcoin benimsemesinden internetteki en kapsamlı ücretsiz hesaplayıcı paketine."
                : "From early Bitcoin adoption to the most comprehensive free calculator suite on the internet."}
            </p>
          </div>

          <ol className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[5px] top-1 bottom-1 w-px bg-border"
            />

            {milestones.map((m, i) => (
              <li key={i} className={`relative pl-10 ${i < milestones.length - 1 ? 'pb-10' : ''}`}>
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full bg-background ring-1 ring-border flex items-center justify-center"
                >
                  <span className="w-[5px] h-[5px] rounded-full bg-primary" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-primary">
                  {m.year}
                </span>
                <h3 className="mt-1.5 text-[15px] font-semibold text-foreground">
                  {m.title}
                </h3>
                <p className="mt-2 text-[14px] text-muted-foreground leading-[1.65] text-pretty max-w-xl">
                  {m.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
