import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Standalone FTC-compliant affiliate & advertising disclosure page.
 *
 * Linked from the footer and referenced by `ads.txt`. The Privacy/Terms
 * pages keep their summary sections — this page is the canonical,
 * deep-linkable disclosure required by every monetized placement.
 */
const AffiliateDisclosure = () => {
  const { language } = useLanguage();
  const tr = language === "tr";

  const enUrl = "https://bitcoincalculator.tools/affiliate-disclosure";
  const trUrl = "https://bitcoincalculator.tools/tr/baglı-kurulus-aciklamasi";
  const canonical = tr ? trUrl : enUrl;

  const title = tr
    ? "Bağlı Kuruluş ve Reklam Açıklaması | Bitcoin Calculator Tools"
    : "Affiliate & Advertising Disclosure | Bitcoin Calculator Tools";
  const description = tr
    ? "Bitcoin Calculator Tools'un FTC uyumlu bağlı kuruluş ve reklam açıklaması — komisyon ilişkileri, içerik bağımsızlığı ve veri koruması."
    : "Bitcoin Calculator Tools' FTC-compliant affiliate & advertising disclosure — commission relationships, editorial independence, and data protection.";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="tr" href={trUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <Header />
      <PageBackground />

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-6 pt-6">
          <Breadcrumb
            items={[
              { label: tr ? "Ana Sayfa" : "Home", href: tr ? "/tr" : "/" },
              { label: tr ? "Bağlı Kuruluş Açıklaması" : "Affiliate Disclosure" },
            ]}
          />
        </div>

        <section className="container mx-auto px-6 py-12 max-w-4xl">
          <header className="mb-10 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
              <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-display-md font-heading mb-3">
              {tr ? "Bağlı Kuruluş ve Reklam Açıklaması" : "Affiliate & Advertising Disclosure"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {tr
                ? "ABD Federal Ticaret Komisyonu (FTC) ve Avrupa tüketici koruma yönergeleri kapsamında, içeriğimizdeki tüm ticari ilişkileri burada açıklıyoruz."
                : "In accordance with U.S. Federal Trade Commission (FTC) guidelines and EU consumer-protection rules, we disclose every commercial relationship represented on this site below."}
            </p>
          </header>

          <div className="space-y-6">
            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-heading text-display-sm">
                  {tr ? "1. Nasıl para kazanıyoruz" : "1. How we make money"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/80 leading-relaxed">
                <p>
                  {tr
                    ? "Bitcoin Calculator Tools tamamen ücretsizdir ve abonelik gerektirmez. Sitenin sürdürülebilirliğini sağlamak için seçilmiş bağlı kuruluş ortaklarımızdan (örn. borsalar, donanım cüzdanlar, vergi yazılımları, kripto kartları) komisyon kazanabiliriz."
                    : "Bitcoin Calculator Tools is completely free and requires no subscription. To keep the service sustainable we may earn a commission from selected affiliate partners (e.g. exchanges, hardware wallets, tax software, crypto cards)."}
                </p>
                <p>
                  {tr
                    ? "Bir bağlantıya tıklayıp ardından bir ürün satın aldığınızda veya hesap açtığınızda, sizden ek ücret alınmadan komisyon alabiliriz."
                    : "When you click a link and subsequently purchase a product or open an account, we may receive a commission at no additional cost to you."}
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-heading text-display-sm">
                  {tr ? "2. Bağımsızlık taahhüdü" : "2. Editorial independence"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/80 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    {tr
                      ? "Hesaplayıcı matematiği, formüller ve sonuçlar kesinlikle ticari ilişkilerden etkilenmez."
                      : "Calculator math, formulas, and results are never influenced by commercial relationships."}
                  </li>
                  <li>
                    {tr
                      ? "İçerik ve editoryal sıralamalar reklam baskısı altında değiştirilmez."
                      : "Editorial content and rankings are not altered under advertiser pressure."}
                  </li>
                  <li>
                    {tr
                      ? "Bağlı kuruluş yerleşimleri her zaman görsel olarak işaretlenir ve içerik bölümlerinden ayrı tutulur."
                      : "Affiliate placements are always visually labeled and kept separate from editorial content."}
                  </li>
                  <li>
                    {tr
                      ? 'Tüm dış bağlantılar `rel="sponsored nofollow noopener"` ile işaretlenir.'
                      : 'All outbound links are tagged with `rel="sponsored nofollow noopener"`.'}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-heading text-display-sm">
                  {tr ? "3. Mevcut ortaklarımız" : "3. Our current partners"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/80 leading-relaxed">
                <p>
                  {tr
                    ? "Şu anda aşağıdaki kuruluşlarla aktif komisyon anlaşmalarımız bulunmaktadır:"
                    : "We currently maintain active commission agreements with the following organizations:"}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Ledger</strong> — {tr ? "donanım cüzdan" : "hardware wallet"}</li>
                  <li><strong>Coinbase</strong> — {tr ? "borsa" : "exchange"}</li>
                  <li><strong>MEXC</strong> — {tr ? "borsa" : "exchange"}</li>
                  <li><strong>Bybit</strong> — {tr ? "borsa" : "exchange"}</li>
                  <li><strong>TradingView</strong> — {tr ? "grafik platformu" : "charting platform"}</li>
                  <li><strong>Koinly</strong> — {tr ? "vergi yazılımı" : "tax software"}</li>
                  <li><strong>RedotPay</strong> — {tr ? "kripto kartı" : "crypto card"}</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  {tr
                    ? "Bu liste değişebilir. Güncel ortak listesi için bu sayfayı düzenli olarak güncelliyoruz."
                    : "This list may change. We update this page regularly to reflect the current partner roster."}
                </p>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-heading text-display-sm">
                  {tr ? "4. Veri ve izleme" : "4. Data & tracking"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/80 leading-relaxed">
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    {tr
                      ? "Reklam ağı kullanmıyoruz (AdSense, header-bidding veya benzeri). Üçüncü taraf reklam çerezi düşmez."
                      : "We do not use any ad network (AdSense, header bidding, or similar). No third-party advertising cookies are dropped."}
                  </li>
                  <li>
                    {tr
                      ? "Yalnızca gösterim ve tıklama olaylarını agregate ölçmek için anonim analitik topluyoruz."
                      : "We collect only anonymous aggregate analytics to measure impression and click performance."}
                  </li>
                  <li>
                    {tr
                      ? "Kişisel verilerinizi reklamverenlere veya bağlı kuruluş ortaklarına satmıyoruz."
                      : "We do not sell your personal data to advertisers or affiliate partners."}
                  </li>
                  <li>
                    {tr
                      ? "Altbilgideki anahtar ile bağlı kuruluş bağlantılarını tek tıkla devre dışı bırakabilirsiniz."
                      : "You can disable affiliate links with a single click using the toggle in the footer."}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader>
                <CardTitle className="font-heading text-display-sm flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" aria-hidden="true" />
                  {tr ? "5. Sorumluluk reddi" : "5. Disclaimer"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/80 leading-relaxed">
                <p>
                  {tr
                    ? "Sitemizdeki hiçbir içerik yatırım, vergi veya hukuk tavsiyesi değildir. Kripto varlıklar yüksek risk içerir; kendi araştırmanızı yapın ve gerektiğinde lisanslı bir profesyonele danışın."
                    : "Nothing on this site constitutes investment, tax, or legal advice. Crypto assets carry high risk; do your own research and consult a licensed professional when appropriate."}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tr ? "Sorularınız için: " : "Questions: "}
                  <a href="mailto:BitcoinCalculatorToolkit@gmail.com" className="text-primary hover:underline inline-flex items-center gap-1">
                    BitcoinCalculatorToolkit@gmail.com
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center pt-4">
              {tr ? "Son güncelleme: 18 Haziran 2026" : "Last updated: June 18, 2026"}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AffiliateDisclosure;
