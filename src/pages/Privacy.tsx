import { Helmet } from "react-helmet-async";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { Link } from "@/components/LocalizedLink";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Cookie, Lock, UserCheck, Globe, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { language, t } = useLanguage();
  const tr = language === 'tr';

  return (
    <>
      <Helmet>
        <title>{tr ? 'Gizlilik Politikası | bitcoincalculator.tools' : 'Privacy Policy | bitcoincalculator.tools'}</title>
        <meta name="description" content={tr
          ? 'İzleme yok, çerez yok, veri satışı yok. Bitcoin Calculator Tools\'un ücretsiz hesaplayıcılarını kullandığınızda ne topladığımızı ve toplamadığımızı açıklıyoruz.'
          : 'No tracking, no cookies, no data sold. Here is exactly what bitcoincalculator.tools does and does not collect when you use our free calculator tools.'
        } />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/gizlilik" : "https://bitcoincalculator.tools/privacy"} />
        <meta property="og:title" content={tr ? 'Gizlilik Politikası' : 'Privacy Policy'} />
        <meta property="og:description" content={tr
          ? 'İzleme yok, çerez yok, veri satışı yok.'
          : 'No tracking, no cookies, no data sold.'
        } />
        <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/gizlilik" : "https://bitcoincalculator.tools/privacy"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? 'Gizlilik Politikası' : 'Privacy Policy'} />
        <meta name="twitter:description" content={tr ? 'İzleme yok, çerez yok, veri satışı yok.' : 'No tracking, no cookies, no data sold.'} />
        
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": tr ? "Gizlilik Politikası" : "Privacy Policy",
            "url": tr ? "https://bitcoincalculator.tools/tr/gizlilik" : "https://bitcoincalculator.tools/privacy",
          })}
        </script>
      </Helmet>
      <HelmetOgImage slug="privacy" enAlt="Privacy Policy | bitcoincalculator.tools" lang={tr ? 'tr' : 'en'} />

      <BreadcrumbSchema language={language} items={[
        { name: tr ? "Ana Sayfa" : "Home", url: tr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/" },
        { name: tr ? "Gizlilik Politikası" : "Privacy Policy", url: tr ? "https://bitcoincalculator.tools/tr/gizlilik" : "https://bitcoincalculator.tools/privacy" }
      ]} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: tr ? "Gizlilik Politikası" : "Privacy Policy" }]} />
          </div>

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-display-lg font-display mb-6">
                  <span className="text-gradient-premium">
                    {tr ? 'Gizlilik Politikası' : 'Privacy Policy'}
                  </span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  {tr
                    ? 'Gizliliğiniz bizim için önemlidir. Bu politika, bitcoincalculator.tools\'u kullanırken bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.'
                    : 'Your privacy is important to us. This policy explains how we collect, use, and protect your information when using Bitcoin Calculator Tools at bitcoincalculator.tools.'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  {tr ? 'Son güncelleme: 20 Mayıs 2026' : 'Last updated: May 20, 2026'}
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="space-y-8">

                {/* Privacy Commitment */}
                <Card className="card-premium border-success/30/50 bg-success/10/50">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2 text-success">
                      <UserCheck className="w-6 h-6" />
                      {tr ? 'Gizlilik Taahhüdümüz' : 'Our Privacy Commitment'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-success">
                    <p className="leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools, gizliliğinizi ve kişisel verilerinizi korumaya kararlıdır. GDPR ve CCPA yönergelerini takip ediyor, minimal veri toplama ilkesini benimsiyoruz ve kişisel bilgilerinizi asla üçüncü taraflara satmıyoruz.'
                        : 'Bitcoin Calculator Tools is committed to protecting your privacy and personal data. We follow GDPR and CCPA guidelines, use minimal data collection practices, and never sell your personal information to third parties.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Information We Collect */}
                <Card className="card-premium animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Eye className="w-6 h-6 text-primary" />
                      {tr ? '1. Topladığımız Bilgiler' : '1. Information We Collect'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Siz Tarafından Sağlanan Bilgiler' : 'Information You Provide'}
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                        <li>{tr ? 'İletişim formu gönderileri (ad, e-posta, mesaj)' : 'Contact form submissions (name, email, message)'}</li>
                        <li>{tr ? 'Bülten aboneliği e-posta adresleri' : 'Newsletter subscription email addresses'}</li>
                        <li>{tr ? 'Geri bildirim ve destek iletişimleri' : 'Feedback and support communications'}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Otomatik Olarak Toplanan Bilgiler' : 'Automatically Collected Information'}
                      </h3>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                        <li>{tr ? 'Tarayıcı türü ve sürümü' : 'Browser type and version'}</li>
                        <li>{tr ? 'İşletim sistemi bilgisi' : 'Operating system information'}</li>
                        <li>{tr ? 'Ziyaret edilen sayfalar ve sitede geçirilen süre' : 'Pages visited and time spent on site'}</li>
                        <li>{tr ? 'Yönlendiren web sitesi adresleri' : 'Referring website addresses'}</li>
                        <li>{tr ? 'Anonim kullanım analitiği' : 'Anonymous usage analytics'}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Hesaplayıcı Verileri' : 'Calculator Data'}
                      </h3>
                      <div className="bg-info-soft border border-info/30/50 rounded-xl p-4">
                        <p className="text-info font-medium text-sm">
                          {tr
                            ? '✅ Önemli: Tüm hesaplayıcı girdileri ve sonuçları tarayıcınızda yerel olarak işlenir. Finansal hesaplamalarınızı veya kişisel yatırım verilerinizi SAKLAMIYORUZ, İLETMİYORUZ ve bunlara ERİŞİMİMİZ YOKTUR.'
                            : '✅ Important: All calculator inputs and results are processed locally in your browser. We do NOT store, transmit, or have access to your financial calculations or personal investment data.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* How We Use Information */}
                <Card className="card-premium animate-fade-in-up animate-stagger-2">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Lock className="w-6 h-6 text-primary" />
                      {tr ? '2. Bilgilerinizi Nasıl Kullanıyoruz' : '2. How We Use Your Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr ? 'Topladığımız bilgileri şu amaçlarla kullanıyoruz:' : 'We use the information we collect to:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Sorularınıza yanıt vermek ve müşteri desteği sağlamak' : 'Respond to your inquiries and provide customer support'}</li>
                      <li>{tr ? 'Bülten güncellemeleri göndermek (yalnızca abone olduysanız)' : 'Send newsletter updates (only if you subscribe)'}</li>
                      <li>{tr ? 'Web sitemizi ve hesaplayıcı işlevselliğini geliştirmek' : 'Improve our website and calculator functionality'}</li>
                      <li>{tr ? 'Web sitesi kullanım kalıplarını anonim olarak analiz etmek' : 'Analyze website usage patterns anonymously'}</li>
                      <li>{tr ? 'Yasal yükümlülükleri yerine getirmek' : 'Comply with legal obligations'}</li>
                      <li>{tr ? 'Dolandırıcılık ve güvenlik tehditlerine karşı koruma sağlamak' : 'Protect against fraud and security threats'}</li>
                    </ul>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mt-4">
                      <p className="text-foreground font-medium text-sm">
                        {tr
                          ? 'Kişisel bilgilerinizi asla pazarlama amaçlı olarak üçüncü taraflara satmayacak, kiralamayacak veya paylaşmayacağız.'
                          : 'We will never sell, rent, or share your personal information with third parties for marketing purposes.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Cookies and Tracking */}
                <Card className="card-premium animate-fade-in-up animate-stagger-3">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Cookie className="w-6 h-6 text-primary" />
                      {tr ? '3. Çerezler ve İzleme Teknolojileri' : '3. Cookies and Tracking Technologies'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Zorunlu Çerezler' : 'Essential Cookies'}
                      </h3>
                      <p className="text-foreground/80 mb-2">
                        {tr ? 'Temel web sitesi işlevselliği için gerekli:' : 'Required for basic website functionality:'}
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                        <li>{tr ? 'Oturum yönetimi ve güvenlik' : 'Session management and security'}</li>
                        <li>{tr ? 'Kullanıcı tercihleri ve ayarları' : 'User preferences and settings'}</li>
                        <li>{tr ? 'Form gönderimi ve hata yönetimi' : 'Form submission and error handling'}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Analitik Çerezler' : 'Analytics Cookies'}
                      </h3>
                      <p className="text-foreground/80 mb-2">
                        {tr ? 'Ziyaretçilerin sitemizi nasıl kullandığını anlamamıza yardımcı olur:' : 'Help us understand how visitors use our site:'}
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                        <li>{tr ? 'Sayfa görüntülemeleri ve popüler içerik' : 'Page views and popular content'}</li>
                        <li>{tr ? 'Kullanıcı yolculuğu ve gezinme kalıpları' : 'User journey and navigation patterns'}</li>
                        <li>{tr ? 'Performans optimizasyon verileri' : 'Performance optimization data'}</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">
                        {tr ? 'Reklam ve Bağlı Kuruluş Çerezleri' : 'Advertising & Affiliate Cookies'}
                      </h3>
                      <p className="text-foreground/80 mb-2">
                        {tr
                          ? 'Sitemiz, üçüncü taraf reklam ağlarına ve bağlı kuruluş (affiliate) ortaklarına ait çerezler içerebilir. Bu çerezler kişiselleştirilmiş reklam göstermek, tıklamaları takip etmek ve nitelikli alımlardan komisyon kazanmak için kullanılır.'
                          : 'Our site may include cookies from third-party ad networks and affiliate partners. These cookies are used to serve personalized ads, attribute clicks, and earn commissions on qualifying purchases.'}
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                        <li>{tr ? 'Bağlı kuruluş tıklama ve dönüşüm izleme' : 'Affiliate click and conversion tracking'}</li>
                        <li>{tr ? 'Reklam yayını ve sıklık sınırlandırma' : 'Ad serving and frequency capping'}</li>
                        <li>{tr ? 'Reklam ölçümleri ve performans raporlaması' : 'Ad measurement and performance reporting'}</li>
                      </ul>
                      <p className="text-foreground/70 text-sm mt-2">
                        {tr
                          ? 'Reklam kişiselleştirmesinden vazgeçmek için '
                          : 'You can opt out of personalized advertising via '}
                        <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label={t('aria.naiOptOut')}>NAI</a>
                        {' / '}
                        <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" aria-label={t('aria.daaOptOut')}>DAA</a>
                        {tr ? ' üzerinden çıkış yapabilirsiniz.' : '.'}
                      </p>
                    </div>

                    <div className="bg-warning-soft border border-warning/30/50 rounded-xl p-4">
                      <h4 className="font-medium text-warning-foreground mb-2">
                        {tr ? 'Çerez Kontrolü' : 'Cookie Control'}
                      </h4>
                      <p className="text-warning text-sm">
                        {tr
                          ? 'Çerezleri tarayıcı ayarlarınız üzerinden kontrol edebilirsiniz. Zorunlu çerezlerin devre dışı bırakılmasının web sitesi işlevselliğini etkileyebileceğini unutmayın.'
                          : 'You can control cookies through your browser settings. Note that disabling essential cookies may affect website functionality.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Security */}
                <Card className="card-premium animate-fade-in-up animate-stagger-4">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '4. Veri Güvenliği ve Koruması' : '4. Data Security & Protection'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Kişisel bilgilerinizi korumak için uygun teknik ve organizasyonel güvenlik önlemleri uyguluyoruz:'
                        : 'We implement appropriate technical and organizational security measures to protect your personal information:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Tüm veri iletimi için SSL şifreleme' : 'SSL encryption for all data transmission'}</li>
                      <li>{tr ? 'Düzenli güvenlik güncellemeleri ile güvenli barındırma altyapısı' : 'Secure hosting infrastructure with regular security updates'}</li>
                      <li>{tr ? 'Yönetim sistemleri için erişim kontrolleri ve kimlik doğrulama' : 'Access controls and authentication for administrative systems'}</li>
                      <li>{tr ? 'Düzenli güvenlik denetimleri ve zafiyet değerlendirmeleri' : 'Regular security audits and vulnerability assessments'}</li>
                      <li>{tr ? 'Veri minimizasyonu — yalnızca gerekli olanı topluyoruz' : "Data minimization - we only collect what's necessary"}</li>
                    </ul>
                    <div className="bg-success/10 border border-success/30/50 rounded-xl p-4">
                      <p className="text-success font-medium text-sm">
                        {tr
                          ? '🔒 Maksimum gizlilik ve güvenlik için tüm hesaplayıcı işlemleri tarayıcınızda yerel olarak gerçekleştirilir.'
                          : '🔒 All calculator operations are performed locally in your browser for maximum privacy and security.'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Rights */}
                <Card className="card-premium animate-fade-in-up animate-stagger-5">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-primary" />
                      {tr ? '5. Gizlilik Haklarınız' : '5. Your Privacy Rights'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'GDPR, CCPA ve diğer gizlilik yasaları kapsamında aşağıdaki haklara sahipsiniz:'
                        : 'Under GDPR, CCPA, and other privacy laws, you have the following rights:'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">{tr ? 'Erişim ve Taşınabilirlik' : 'Access & Portability'}</h4>
                        <p className="text-sm text-foreground/70">{tr ? 'Kişisel verilerinizin bir kopyasını talep edin' : 'Request a copy of your personal data'}</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">{tr ? 'Düzeltme' : 'Rectification'}</h4>
                        <p className="text-sm text-foreground/70">{tr ? 'Hatalı bilgileri düzeltin' : 'Correct inaccurate information'}</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">{tr ? 'Silme' : 'Erasure'}</h4>
                        <p className="text-sm text-foreground/70">{tr ? 'Verilerinizin silinmesini talep edin' : 'Request deletion of your data'}</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">{tr ? 'Vazgeçme' : 'Opt-out'}</h4>
                        <p className="text-sm text-foreground/70">{tr ? 'İstediğiniz zaman onayı geri çekin' : 'Withdraw consent at any time'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/60 mt-4">
                      {tr
                        ? 'Bu hakları kullanmak için lütfen BitcoinCalculatorToolkit@gmail.com adresinden bize ulaşın.'
                        : 'To exercise these rights, please contact us at BitcoinCalculatorToolkit@gmail.com'}
                    </p>
                  </CardContent>
                </Card>

                {/* International Users */}
                <Card className="card-premium animate-fade-in-up animate-stagger-6">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Globe className="w-6 h-6 text-primary" />
                      {tr ? '6. Uluslararası Kullanıcılar' : '6. International Users'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools Amerika Birleşik Devletleri\'nden işletilmektedir. Hizmetimize ABD dışından erişiyorsanız, bilgilerinizin Amerika Birleşik Devletleri\'ne aktarılabileceğini, orada depolanabileceğini ve işlenebileceğini lütfen unutmayın.'
                        : 'Bitcoin Calculator Tools is operated from the United States. If you are accessing our service from outside the US, please be aware that your information may be transferred to, stored, and processed in the United States.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Uluslararası veri aktarımları için uygun güvenceler sağlıyor ve AB kullanıcıları için GDPR dahil geçerli veri koruma yasalarına uyuyoruz.'
                        : 'We ensure appropriate safeguards are in place for international data transfers and comply with applicable data protection laws including GDPR for EU users.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Updates to Policy */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '7. Politika Güncellemeleri' : '7. Updates to This Policy'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Uygulamalarımızdaki veya yasal gerekliliklerdeki değişiklikleri yansıtmak için bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Bunu yaptığımızda:'
                        : 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Güncellenen politikayı bu sayfada yayınlayacağız' : 'Post the updated policy on this page'}</li>
                      <li>{tr ? '"Son değiştirilme" tarihini güncelleyeceğiz' : 'Update the "Last modified" date'}</li>
                      <li>{tr ? 'Önemli değişiklikler için kullanıcıları e-posta ile bilgilendireceğiz (e-postanız varsa)' : 'Notify users of material changes via email (if we have your email)'}</li>
                      <li>{tr ? 'Önemli değişiklikler için 30 gün önceden bildirim yapacağız' : 'Provide 30 days notice for significant changes'}</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Affiliate Links & Advertising */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '8. Bağlı Kuruluş Bağlantıları ve Reklam Açıklaması' : '8. Affiliate Links & Advertising Disclosure'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools, bağlı kuruluş (affiliate) bağlantıları içerebilir ve üçüncü taraf reklamları gösterebilir. Bu bağlantılar üzerinden yapılan nitelikli alımlardan size hiçbir ek ücret yansıtmadan komisyon kazanabiliriz. Bu komisyonlar sitemizi ücretsiz tutmaya yardımcı olur.'
                        : 'Bitcoin Calculator Tools may contain affiliate links and display third-party advertisements. We may earn a commission on qualifying purchases made through these links at no additional cost to you. These commissions help keep the site free to use.'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Bağlı kuruluş ilişkileri hesaplayıcı matematiğini, sonuçları veya sıralamaları etkilemez.' : 'Affiliate relationships do not influence calculator math, results, or rankings.'}</li>
                      <li>{tr ? 'Tüm reklam ve bağlı kuruluş bağlantıları içerik ve görüş bölümlerinden ayrı tutulur.' : 'All ad and affiliate placements are kept separate from editorial content and opinion.'}</li>
                      <li>{tr ? 'Üçüncü taraf reklam ağları kendi çerezlerini ayarlayabilir ve kendi gizlilik politikalarına tabidir.' : 'Third-party ad networks may set their own cookies and operate under their own privacy policies.'}</li>
                      <li>{tr ? 'Kişisel verilerinizi reklamverenlere veya bağlı kuruluş ortaklarına satmıyoruz.' : 'We do not sell your personal data to advertisers or affiliate partners.'}</li>
                    </ul>
                    <p className="text-sm text-foreground/60">
                      {tr
                        ? 'ABD Federal Ticaret Komisyonu (FTC) yönergelerine uygun olarak, bu açıklama tüm bağlı kuruluş ilişkilerimiz için geçerli bir bildirimdir.'
                        : 'In accordance with U.S. Federal Trade Commission (FTC) guidelines, this disclosure serves as notice of our affiliate relationships across the site.'}
                    </p>
                  </CardContent>
                </Card>

                {/* KVKK — Turkish data protection (TR only) */}
                {tr && (
                  <Card className="card-premium animate-fade-in-up animate-stagger-7">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        9. KVKK Kapsamındaki Haklarınız (Türkiye)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground/80 leading-relaxed">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, Türkiye'den siteyi kullanan ziyaretçiler için ek bilgilendirme:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                        <li><strong>Veri sorumlusu:</strong> Bitcoin Calculator Tools (BitcoinCalculatorToolkit@gmail.com).</li>
                        <li><strong>İşleme amaçları:</strong> Hizmetin sunulması, iletişim taleplerinin yanıtlanması, anonim kullanım analitiği ve yasal yükümlülüklerin yerine getirilmesi.</li>
                        <li><strong>Hukuki sebep:</strong> KVKK madde 5/2 (sözleşmenin kurulması/ifası, meşru menfaat) ve açık rızanız.</li>
                        <li><strong>Veri aktarımı:</strong> Site ABD'den işletildiğinden, verileriniz yurt dışına aktarılabilir; bu aktarım için açık rızanız esas alınır.</li>
                        <li><strong>KVKK madde 11 hakları:</strong> Kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme, aktarımın bildirilmesini isteme, otomatik karara itiraz etme ve zararın giderilmesini talep etme.</li>
                      </ul>
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground text-sm">
                          KVKK madde 11 haklarınızı kullanmak için <a href="mailto:BitcoinCalculatorToolkit@gmail.com" className="text-primary hover:underline">BitcoinCalculatorToolkit@gmail.com</a> adresine başvurabilirsiniz. Başvurunuza en geç 30 gün içinde yanıt verilir.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Information */}
                <Card className="card-premium animate-fade-in-up animate-stagger-8">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '10. Bize Ulaşın' : '9. Contact Us'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bu Gizlilik Politikası veya veri uygulamalarımız hakkında sorularınız varsa lütfen bize ulaşın:'
                        : 'If you have questions about this Privacy Policy or our data practices, please contact us:'}
                    </p>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">{tr ? 'Gizlilik Sorumlusu' : 'Privacy Officer'}</p>
                        <p className="text-foreground/70 text-sm">{tr ? 'E-posta:' : 'Email:'} BitcoinCalculatorToolkit@gmail.com</p>
                        <p className="text-foreground/60 text-xs mt-1">{tr ? 'Yanıt süresi: 48 saat içinde' : 'Response time: Within 48 hours'}</p>
                      </div>

                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">{tr ? 'İletişim Formu' : 'Contact Form'}</p>
                        <p className="text-foreground/70 text-sm">
                          <Link to={tr ? "/tr/iletisim" : "/contact"} className="text-primary hover:underline">
                            {tr ? 'İletişim formunu kullanın' : 'Use our contact form'}
                          </Link>
                          {tr ? ' gizlilikle ilgili sorularınız için' : ' for privacy-related inquiries'}
                        </p>
                        <p className="text-foreground/60 text-xs mt-1">
                          {tr ? 'Bize ulaşmanın güvenli ve pratik yolu' : 'Secure and convenient way to reach us'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default Privacy;
