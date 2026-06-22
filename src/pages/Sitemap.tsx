import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { LocalizedLink } from "@/components/LocalizedLink";
import { articlesMeta } from "@/data/articles";
import { useLanguage } from "@/contexts/LanguageContext";

type CalcItem = { slug: string; en: string; tr: string };
type CalcGroup = { en: string; tr: string; items: CalcItem[] };

// Calculator catalogue grouped by category — kept in sync with App.tsx routes.
const calculatorGroups: CalcGroup[] = [
  {
    en: "Investment & Planning",
    tr: "Yatırım ve Planlama",
    items: [
      { slug: "what-if", en: "Bitcoin What-If Calculator", tr: "Bitcoin Ya Olsaydı Hesaplayıcısı" },
      { slug: "dca", en: "Bitcoin DCA Calculator", tr: "Bitcoin DCA Hesaplayıcısı" },
      { slug: "retirement", en: "Bitcoin Retirement Calculator", tr: "Bitcoin Emeklilik Hesaplayıcısı" },
      { slug: "lump-sum-vs-dca", en: "Lump Sum vs DCA Comparison", tr: "Toplu Yatırım ile DCA Karşılaştırması" },
      { slug: "investment", en: "Bitcoin Investment Calculator", tr: "Bitcoin Yatırım Hesaplayıcısı" },
      { slug: "bitcoin-savings", en: "Bitcoin Savings Calculator", tr: "Bitcoin Birikim Hesaplayıcısı" },
      { slug: "sip", en: "Bitcoin SIP Calculator", tr: "Bitcoin SIP Hesaplayıcısı" },
      { slug: "stack-sats", en: "Stack Sats Goal Calculator", tr: "Satoshi Biriktirme Hedefi" },
      { slug: "average-buy-price", en: "Average Buy Price Calculator", tr: "Ortalama Alış Fiyatı Hesaplayıcısı" },
      { slug: "price-target", en: "Bitcoin Price Target Calculator", tr: "Bitcoin Fiyat Hedefi Hesaplayıcısı" },
      { slug: "btc-vs-real-estate", en: "BTC vs Real Estate Calculator", tr: "BTC ile Gayrimenkul Karşılaştırması" },
      { slug: "portfolio-tracker", en: "Bitcoin Portfolio Tracker", tr: "Bitcoin Portföy Takipçisi" },
      { slug: "bitcoin-accumulation-score", en: "Bitcoin Accumulation Score", tr: "Bitcoin Birikim Skoru" },
    ],
  },
  {
    en: "Strategy & Trading",
    tr: "Strateji ve İşlem",
    items: [
      { slug: "profit-loss", en: "Bitcoin Profit & Loss Calculator", tr: "Bitcoin Kâr & Zarar Hesaplayıcısı" },
      { slug: "hodl-strategy", en: "HODL Strategy Calculator", tr: "HODL Strateji Hesaplayıcısı" },
      { slug: "leverage-liquidation", en: "Leverage & Liquidation Calculator", tr: "Kaldıraç & Tasfiye Hesaplayıcısı" },
      { slug: "bitcoin-lot-size", en: "Bitcoin Lot Size Calculator", tr: "Bitcoin Lot Büyüklüğü Hesaplayıcısı" },
      { slug: "bitcoin-arbitrage", en: "Bitcoin Arbitrage Calculator", tr: "Bitcoin Arbitraj Hesaplayıcısı" },
      { slug: "bitcoin-loan", en: "Bitcoin Loan Calculator", tr: "Bitcoin Kredi Hesaplayıcısı" },
      { slug: "purchasing-power", en: "Purchasing Power Calculator", tr: "Satın Alma Gücü Hesaplayıcısı" },
    ],
  },
  {
    en: "Tax & Compliance",
    tr: "Vergi ve Uyum",
    items: [
      { slug: "capital-gains-tax", en: "Capital Gains Tax Calculator", tr: "Sermaye Kazancı Vergisi Hesaplayıcısı" },
      { slug: "inheritance-tax", en: "Inheritance Tax Calculator", tr: "Miras Vergisi Hesaplayıcısı" },
      { slug: "bitcoin-zakat", en: "Bitcoin Zakat Calculator", tr: "Bitcoin Zekât Hesaplayıcısı" },
      { slug: "transaction-fees", en: "Transaction Fee Calculator", tr: "İşlem Ücreti Hesaplayıcısı" },
    ],
  },
  {
    en: "Market Analysis",
    tr: "Piyasa Analizi",
    items: [
      { slug: "fear-greed-index", en: "Fear & Greed Index", tr: "Korku & Açgözlülük Endeksi" },
      { slug: "rainbow-chart", en: "Bitcoin Rainbow Chart", tr: "Bitcoin Gökkuşağı Grafiği" },
      { slug: "power-law", en: "Power Law Calculator", tr: "Güç Yasası Hesaplayıcısı" },
      { slug: "wealth-percentile", en: "Bitcoin Wealth Percentile", tr: "Bitcoin Servet Yüzdesi" },
      { slug: "etf", en: "Bitcoin ETF Comparison", tr: "Bitcoin ETF Karşılaştırması" },
      { slug: "cagr", en: "Bitcoin CAGR Calculator", tr: "Bitcoin Yıllık Büyüme (CAGR)" },
      { slug: "staking", en: "Bitcoin Staking Calculator", tr: "Bitcoin Staking Hesaplayıcısı" },
      { slug: "on-chain", en: "On-Chain Metrics Dashboard", tr: "Zincir Üstü Metrikler Paneli" },
      { slug: "volatility", en: "Bitcoin Volatility Calculator", tr: "Bitcoin Oynaklık Hesaplayıcısı" },
      { slug: "supply", en: "Bitcoin Supply Calculator", tr: "Bitcoin Arz Hesaplayıcısı" },
      { slug: "dominance", en: "Bitcoin Dominance Calculator", tr: "Bitcoin Dominans Hesaplayıcısı" },
      { slug: "correlation", en: "Bitcoin Correlation Calculator", tr: "Bitcoin Korelasyon Hesaplayıcısı" },
      { slug: "drawdown", en: "Bitcoin Drawdown Calculator", tr: "Bitcoin Düşüş Analizi" },
    ],
  },
  {
    en: "Mining & Network",
    tr: "Madencilik ve Ağ",
    items: [
      { slug: "mining-profitability", en: "Mining Profitability Calculator", tr: "Madencilik Kârlılığı Hesaplayıcısı" },
      { slug: "lightning", en: "Lightning Network Fee Calculator", tr: "Lightning Ağı Ücret Hesaplayıcısı" },
      { slug: "halving-countdown", en: "Bitcoin Halving Countdown", tr: "Bitcoin Yarılama Geri Sayımı" },
    ],
  },
  {
    en: "Historical & Reference",
    tr: "Tarihsel ve Referans",
    items: [
      { slug: "bitcoin-converter", en: "Bitcoin Satoshi Converter", tr: "Bitcoin Satoshi Dönüştürücü" },
      { slug: "time-machine", en: "Bitcoin Time Machine", tr: "Bitcoin Zaman Makinesi" },
      { slug: "pizza-day", en: "Bitcoin Pizza Day Calculator", tr: "Bitcoin Pizza Günü Hesaplayıcısı" },
      { slug: "obituaries-tracker", en: "Bitcoin Obituaries Tracker", tr: "Bitcoin Ölüm İlanları Takipçisi" },
      { slug: "inflation-dashboard", en: "Bitcoin Inflation Dashboard", tr: "Bitcoin Enflasyon Paneli" },
      { slug: "pi-to-bitcoin", en: "Pi to Bitcoin Calculator", tr: "Pi'den Bitcoin'e Hesaplayıcı" },
    ],
  },
];

const totalCalculators = calculatorGroups.reduce((sum, g) => sum + g.items.length, 0);

const Sitemap = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const siteUrl = tr ? 'https://bitcoincalculator.tools/tr/site-haritasi' : 'https://bitcoincalculator.tools/sitemap';
  const homeUrl = tr ? 'https://bitcoincalculator.tools/tr' : 'https://bitcoincalculator.tools/';
  return (
    <>
      <Helmet>
        <title>{tr ? 'Site Haritası — Tüm Hesaplayıcılar | Bitcoin Calc Tools' : 'Sitemap — All Calculators & Guides | Bitcoin Calculator Tools'}</title>
        <meta
          name="description"
          content={tr ? 'bitcoincalculator.tools üzerindeki tüm Bitcoin hesaplayıcılarını ve eğitim rehberlerini, 49+ hesaplayıcı ve tüm öğrenme makaleleriyle birlikte inceleyin.' : 'Browse every Bitcoin calculator and educational guide on bitcoincalculator.tools, including 49+ calculators and all learning articles.'}
        />
        <link rel="canonical" href={siteUrl} />
        <link rel="alternate" hrefLang="en" href="https://bitcoincalculator.tools/sitemap" />
        <link rel="alternate" hrefLang="tr" href="https://bitcoincalculator.tools/tr/site-haritasi" />
        <link rel="alternate" hrefLang="x-default" href="https://bitcoincalculator.tools/sitemap" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={tr ? 'Site Haritası — Bitcoin Calculator Tools' : 'Sitemap — Bitcoin Calculator Tools'} />
        <meta
          property="og:description"
          content={tr ? '49+ Bitcoin hesaplayıcısı ve eğitim rehberinin HTML site haritası.' : 'HTML sitemap of all 49+ Bitcoin calculators and educational guides.'}
        />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? 'Site Haritası — Bitcoin Calculator Tools' : 'Sitemap — Bitcoin Calculator Tools'} />
        <meta
          name="twitter:description"
          content={tr ? 'bitcoincalculator.tools üzerindeki tüm hesaplayıcılar ve rehberler tek yerde.' : 'Every calculator and guide on bitcoincalculator.tools, in one place.'}
        />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
      </Helmet>

      <BreadcrumbSchema language={language}
        items={[
          { name: tr ? 'Ana Sayfa' : 'Home', url: homeUrl },
          { name: tr ? 'Site Haritası' : 'Sitemap', url: siteUrl },
        ]}
      />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: tr ? 'Site Haritası' : 'Sitemap' }]} />
          </div>

          <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
            <header className="mb-12">
              <h1 className="text-h1 font-bold mb-4">
                {tr ? 'Site Haritası' : 'Site Map'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {tr
                  ? `bitcoincalculator.tools üzerindeki her sayfanın tam dizini — 6 kategoride ${totalCalculators} ücretsiz hesaplayıcı ve ${articlesMeta.filter(a => a.language === 'tr').length} eğitim rehberi.`
                  : `A complete index of every page on bitcoincalculator.tools — ${totalCalculators} free calculators across 6 categories and ${articlesMeta.filter(a => (a.language ?? 'en') === 'en').length} educational guides.`}
              </p>
            </header>

            {/* Core pages */}
            <section className="mb-12">
              <h2 className="text-h2 font-semibold mb-4">{tr ? 'Ana Sayfalar' : 'Main Pages'}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <li><LocalizedLink to="/" className="text-primary hover:underline">{tr ? 'Ana Sayfa' : 'Home'}</LocalizedLink></li>
                <li><LocalizedLink to="/calculators" className="text-primary hover:underline">{tr ? 'Tüm Hesaplayıcılar' : 'All Calculators'}</LocalizedLink></li>
                <li><LocalizedLink to="/learn" className="text-primary hover:underline">{tr ? 'Öğrenme Merkezi' : 'Learning Hub'}</LocalizedLink></li>
                <li><LocalizedLink to="/about" className="text-primary hover:underline">{tr ? 'Hakkında' : 'About'}</LocalizedLink></li>
                <li><LocalizedLink to="/contact" className="text-primary hover:underline">{tr ? 'İletişim' : 'Contact'}</LocalizedLink></li>
                <li><LocalizedLink to="/tools" className="text-primary hover:underline">{tr ? 'Araçlar' : 'Tools'}</LocalizedLink></li>
              </ul>
            </section>

            {/* Calculators by category */}
            <section className="mb-12">
              <h2 className="text-h2 font-semibold mb-6">
                {tr ? `Hesaplayıcılar (${totalCalculators})` : `Calculators (${totalCalculators})`}
              </h2>
              <div className="space-y-8">
                {calculatorGroups.map((group) => (
                  <div key={group.en}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground/90">
                      {tr ? group.tr : group.en}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      {group.items.map((calc) => (
                        <li key={calc.slug}>
                          <LocalizedLink
                            to={`/calculators/${calc.slug}`}
                            className="text-primary hover:underline"
                          >
                            {tr ? calc.tr : calc.en}
                          </LocalizedLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Educational guides — locale-scoped so TR-slug articles don't
                ship under /learn/* (which 404s) and EN viewers don't see
                TR titles mixed in. */}
            {(() => {
              const localizedArticles = articlesMeta.filter(
                (a) => (a.language ?? 'en') === (tr ? 'tr' : 'en'),
              );
              const articleBase = tr ? '/tr/ogrenin' : '/learn';
              return (
                <section className="mb-12">
                  <h2 className="text-h2 font-semibold mb-6">
                    {tr ? `Eğitici Rehberler (${localizedArticles.length})` : `Educational Guides (${localizedArticles.length})`}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {localizedArticles.map((a) => (
                      <li key={a.slug}>
                        <LocalizedLink
                          to={`${articleBase}/${a.slug}`}
                          className="text-primary hover:underline"
                        >
                          {a.title}
                        </LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })()}

            {/* Legal */}
            <section>
              <h2 className="text-h2 font-semibold mb-4">{tr ? 'Yasal' : 'Legal'}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <li><LocalizedLink to="/privacy" className="text-primary hover:underline">{tr ? 'Gizlilik Politikası' : 'Privacy Policy'}</LocalizedLink></li>
                <li><LocalizedLink to="/terms" className="text-primary hover:underline">{tr ? 'Kullanım Şartları' : 'Terms of Service'}</LocalizedLink></li>
              </ul>
            </section>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default Sitemap;
