import { Helmet } from "react-helmet-async";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { Link } from "@/components/LocalizedLink";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <>
      <Helmet>
        <title>{tr ? 'Kullanım Koşulları | bitcoincalculator.tools' : 'Terms of Service | bitcoincalculator.tools'}</title>
        <meta name="description" content={tr
          ? 'bitcoincalculator.tools kullanım kuralları. Kısa özet: araçları özgürce kullanın, kötüye kullanmayın ve yalnızca bilgi amaçlı olduğunu anlayın.'
          : 'The rules for using bitcoincalculator.tools. Short version: use the tools freely, do not misuse them, and understand they are for information only.'
        } />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/kosullar" : "https://bitcoincalculator.tools/terms"} />
        <meta property="og:title" content={tr ? 'Kullanım Koşulları' : 'Terms of Service'} />
        <meta property="og:description" content={tr
          ? 'bitcoincalculator.tools kullanım kuralları.'
          : 'The rules for using bitcoincalculator.tools.'
        } />
        <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/kosullar" : "https://bitcoincalculator.tools/terms"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? 'Kullanım Koşulları' : 'Terms of Service'} />
        <meta name="twitter:description" content={tr ? 'bitcoincalculator.tools kullanım kuralları.' : 'Terms for using bitcoincalculator.tools.'} />
        
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": tr ? "Kullanım Koşulları" : "Terms of Service",
            "url": tr ? "https://bitcoincalculator.tools/tr/kosullar" : "https://bitcoincalculator.tools/terms",
          })}
        </script>
      </Helmet>
      <HelmetOgImage slug="terms" enAlt="Terms of Service | bitcoincalculator.tools" lang={tr ? 'tr' : 'en'} />

      <BreadcrumbSchema language={language} items={[
        { name: tr ? "Ana Sayfa" : "Home", url: tr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/" },
        { name: tr ? "Kullanım Koşulları" : "Terms of Service", url: tr ? "https://bitcoincalculator.tools/tr/kosullar" : "https://bitcoincalculator.tools/terms" }
      ]} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: tr ? "Kullanım Koşulları" : "Terms of Service" }]} />
          </div>

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-display-lg font-display mb-6">
                  <span className="text-gradient-premium">
                    {tr ? 'Kullanım Koşulları' : 'Terms of Service'}
                  </span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  {tr
                    ? 'Bitcoin Calculator Tools\'un hizmetlerini ve hesaplayıcılarını bitcoincalculator.tools\'ta kullanmadan önce lütfen bu koşulları dikkatlice okuyun.'
                    : "Please read these terms carefully before using Bitcoin Calculator Tools' services and calculators at bitcoincalculator.tools."}
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

                {/* Important Notice */}
                <Card className="card-premium border-warning/30/50 bg-warning-soft/50">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2 text-warning-foreground">
                      <AlertTriangle className="w-6 h-6" />
                      {tr ? 'Önemli Uyarı' : 'Important Notice'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-warning">
                    <p className="leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools yalnızca eğitim ve analitik araçlar sunar. Hesaplayıcılarımız finansal tavsiye, yatırım önerisi veya gelecekteki performans garantisi niteliği taşımaz. Yatırım kararı vermeden önce her zaman nitelikli finansal uzmanlarla görüşün.'
                        : 'Bitcoin Calculator Tools provides educational and analytical tools only. Our calculators do not constitute financial advice, investment recommendations, or guarantees of future performance. Always consult with qualified financial professionals before making investment decisions.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Acceptance of Terms */}
                <Card className="card-premium animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '1. Koşulların Kabul Edilmesi' : '1. Acceptance of Terms'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools\'a ("Hizmet") erişerek ve kullanarak, bu anlaşmanın hüküm ve koşullarını kabul etmiş sayılırsınız. Yukarıdakilere uymayı kabul etmiyorsanız lütfen bu hizmeti kullanmayın.'
                        : 'By accessing and using Bitcoin Calculator Tools ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bu Kullanım Koşulları, içerik tarayıcıları, satıcılar, müşteriler, tacirler ve/veya içerik katkıcıları dahil web sitesinin tüm kullanıcıları için geçerlidir.'
                        : 'These Terms of Service apply to all users of the website, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Use License */}
                <Card className="card-premium animate-fade-in-up animate-stagger-2">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '2. Kullanım Lisansı' : '2. Use License'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools\'u yalnızca kişisel, ticari olmayan geçici görüntüleme amacıyla geçici olarak kullanma izni verilmektedir. Bu bir lisans verilmesidir, mülkiyet devri değildir ve bu lisans kapsamında şunları yapamazsınız:'
                        : "Permission is granted to temporarily use Bitcoin Calculator Tools for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Materyalleri değiştirmek veya kopyalamak' : 'Modify or copy the materials'}</li>
                      <li>{tr ? 'Materyalleri herhangi bir ticari amaç veya kamuya açık gösterim için kullanmak' : 'Use the materials for any commercial purpose or for any public display'}</li>
                      <li>{tr ? 'Web sitesindeki yazılımları tersine mühendislik yoluyla çözmeye çalışmak' : 'Attempt to reverse engineer any software contained on the website'}</li>
                      <li>{tr ? 'Materyallerden herhangi bir telif hakkı veya diğer mülkiyet notlarını kaldırmak' : 'Remove any copyright or other proprietary notations from the materials'}</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Calculator Disclaimer */}
                <Card className="card-premium animate-fade-in-up animate-stagger-3">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '3. Hesaplayıcı Doğruluğu ve Sınırlamaları' : '3. Calculator Accuracy & Limitations'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin hesaplayıcılarımız yalnızca eğitim ve analitik amaçlarla sunulmaktadır. Doğruluğa özen göstermemize karşın şunlar için garanti vermiyoruz:'
                        : 'Our Bitcoin calculators are provided for educational and analytical purposes only. While we strive for accuracy, we make no warranties about:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Hesaplamaların doğruluğu, eksiksizliği veya güvenilirliği' : 'The accuracy, completeness, or reliability of calculations'}</li>
                      <li>{tr ? 'Sonuçların belirli bir amaç için uygunluğu' : 'The suitability of results for any particular purpose'}</li>
                      <li>{tr ? 'Bitcoin veya herhangi bir kripto paranın performansı' : 'The performance of Bitcoin or any other cryptocurrency'}</li>
                      <li>{tr ? 'Piyasa tahminleri veya yatırım sonuçları' : 'Market predictions or investment outcomes'}</li>
                    </ul>
                    <p className="text-foreground/80 leading-relaxed font-medium">
                      {tr
                        ? 'Geçmiş performans gelecekteki sonuçları garanti etmez. Kripto para yatırımları önemli riskler taşır.'
                        : 'Historical performance does not guarantee future results. Cryptocurrency investments carry significant risk.'}
                    </p>
                  </CardContent>
                </Card>

                {/* User Responsibilities */}
                <Card className="card-premium animate-fade-in-up animate-stagger-4">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '4. Kullanıcı Sorumlulukları' : '4. User Responsibilities'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools\'u sorumlu bir şekilde kullanmayı ve şunları kabul etmeyi taahhüt edersiniz:'
                        : 'You agree to use Bitcoin Calculator Tools responsibly and acknowledge that:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Tüm hesaplamaları bağımsız olarak doğrulamaktan sorumlusunuz' : 'You are responsible for verifying all calculations independently'}</li>
                      <li>{tr ? 'Hizmeti yasadışı faaliyetler için kullanmayacaksınız' : 'You will not use the service for illegal activities'}</li>
                      <li>{tr ? 'Kripto para yatırımlarıyla ilişkili riskleri anlıyorsunuz' : 'You understand the risks associated with cryptocurrency investments'}</li>
                      <li>{tr ? 'Yatırım kararı vermeden önce profesyonel finansal tavsiye alacaksınız' : 'You will seek professional financial advice before making investment decisions'}</li>
                      <li>{tr ? 'Web sitesinin düzgün çalışmasını engellemeye çalışmayacaksınız' : 'You will not attempt to interfere with the proper functioning of the website'}</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Privacy & Data */}
                <Card className="card-premium animate-fade-in-up animate-stagger-5">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '5. Gizlilik ve Veri Toplama' : '5. Privacy & Data Collection'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Gizliliğiniz bizim için önemlidir. Kişisel bilgilerinizin kullanımı, bu koşullara atıfla dahil edilen Gizlilik Politikamız tarafından düzenlenmektedir. Uygulamalarımızı anlamak için lütfen Gizlilik Politikamızı inceleyin.'
                        : 'Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our practices.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Hesaplayıcılarımızı ve hizmetlerimizi geliştirmek için anonim kullanım verileri toplayabiliriz. Hesaplayıcılara girilen finansal veya kişisel bilgiler sunucularımızda saklanmaz veya iletilmez.'
                        : 'We may collect anonymous usage data to improve our calculators and services. No financial or personal information entered into calculators is stored or transmitted to our servers.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Limitations of Liability */}
                <Card className="card-premium animate-fade-in-up animate-stagger-6">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '6. Sorumluluk Sınırlamaları' : '6. Limitations of Liability'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Hiçbir durumda Bitcoin Calculator Tools veya tedarikçileri, Bitcoin Calculator Tools web sitesindeki materyallerin kullanımından veya kullanılamamasından kaynaklanan hasarlardan (veri veya kâr kaybı ya da iş kesintisi nedeniyle oluşan hasarlar dahil, ancak bunlarla sınırlı olmamak üzere) sorumlu olmayacaktır; Bitcoin Calculator Tools veya yetkili bir temsilcisi sözel veya yazılı olarak bu tür hasar olasılığı konusunda bilgilendirilmiş olsa dahi.'
                        : "In no event shall Bitcoin Calculator Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bitcoin Calculator Tools' website, even if Bitcoin Calculator Tools or an authorized representative has been notified orally or in writing of the possibility of such damage."}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bazı yargı bölgeleri zımni garantilere ilişkin kısıtlamalara veya arızi ya da dolaylı zararlar için sorumluluk sınırlamalarına izin vermediğinden, bu sınırlamalar size uygulanmayabilir.'
                        : 'Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Modifications */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '7. Koşullarda Değişiklikler' : '7. Modifications to Terms'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools, bu kullanım koşullarını önceden haber vermeksizin herhangi bir zamanda revize edebilir. Bu web sitesini kullanarak, kullanım koşullarının o andaki güncel sürümüne bağlı kalmayı kabul etmiş sayılırsınız.'
                        : 'Bitcoin Calculator Tools may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bu koşullardaki önemli değişiklikler, güncellenmiş bir "Son değiştirilme" tarihiyle web sitemizde duyurulacaktır.'
                        : 'Material changes to these terms will be announced on our website with an updated "Last modified" date.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Affiliate Disclosure */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '8. Bağlı Kuruluş ve Reklam Açıklaması' : '8. Affiliate & Advertising Disclosure'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bitcoin Calculator Tools, üçüncü taraf hizmetlere, ürünlere veya ticari platformlara yönlendiren bağlı kuruluş (affiliate) bağlantıları içerebilir. Bu bağlantılar üzerinden yapılan nitelikli işlemlerden, size hiçbir ek ücret yansıtmadan komisyon kazanabiliriz.'
                        : 'Bitcoin Calculator Tools may include affiliate links to third-party services, products, or trading platforms. We may earn a commission on qualifying transactions made through these links at no additional cost to you.'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>{tr ? 'Bağlı kuruluş bağlantısı içerdiğini bilmeniz için içerikte uygun yerlerde bilgilendirme yapılır.' : 'Where appropriate, content is marked to indicate that it contains affiliate links.'}</li>
                      <li>{tr ? 'Bağlı kuruluş veya reklam ilişkileri hesaplayıcı sonuçlarını, sıralamaları veya editöryel görüşleri etkilemez.' : 'Affiliate or advertising relationships do not influence calculator results, rankings, or editorial opinions.'}</li>
                      <li>{tr ? 'Üçüncü taraf bir bağlı kuruluş bağlantısına tıklayarak gerçekleştirdiğiniz tüm işlemler, ilgili üçüncü tarafın kendi şart ve koşullarına tabidir.' : "Any transaction you complete after clicking a third-party affiliate link is governed solely by that third party's terms and conditions."}</li>
                      <li>{tr ? 'Üçüncü taraf hizmetlerin onaylanması veya tavsiye edilmesi anlamına gelmez; kendi araştırmanızı yapma sorumluluğu size aittir.' : 'Inclusion of an affiliate link is not an endorsement of, or recommendation for, the third party — you are responsible for your own due diligence.'}</li>
                    </ul>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bu açıklama, ABD Federal Ticaret Komisyonu (FTC) onaylar ve referanslar yönergeleri uyarınca yapılmaktadır.'
                        : 'This disclosure is made in accordance with the U.S. Federal Trade Commission (FTC) Guides Concerning the Use of Endorsements and Testimonials.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Advertising */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '9. Reklam' : '9. Advertising'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Site, üçüncü taraf reklam ağları aracılığıyla sunulan reklamlar içerebilir. Reklamların görüntülenmesi, sıralanması veya kişiselleştirilmesi bu ağların algoritmaları tarafından belirlenir ve içeriklerinden Bitcoin Calculator Tools sorumlu değildir.'
                        : 'The site may display advertisements served by third-party ad networks. Ad selection, ranking, and personalization are controlled by those networks, and Bitcoin Calculator Tools is not responsible for the content of those ads.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Reklamveren veya reklamı yapılan ürün/hizmetlerle gerçekleştireceğiniz her türlü etkileşim, satın alma veya yazışma yalnızca sizinle ilgili üçüncü taraf arasındadır. Bu tür işlemlerden kaynaklanan zararlardan sorumluluk kabul etmiyoruz.'
                        : 'Any dealings, purchases, or correspondence with an advertiser or product/service promoted in an ad are solely between you and that third party. We accept no liability for losses arising from such transactions.'}
                    </p>
                    <p className="text-foreground/80 leading-relaxed font-medium">
                      {tr
                        ? 'Reklam veya bağlı kuruluş içeriği, finansal tavsiye niteliği taşımaz. Yatırım kararı vermeden önce her zaman bağımsız profesyonel görüş alın.'
                        : 'Advertising or affiliate content does not constitute financial advice. Always seek independent professional guidance before making investment decisions.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="card-premium animate-fade-in-up animate-stagger-8">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">
                      {tr ? '10. İletişim Bilgileri' : '10. Contact Information'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      {tr
                        ? 'Bu Kullanım Koşulları hakkında sorularınız varsa lütfen bize ulaşın:'
                        : 'If you have any questions about these Terms of Service, please contact us at:'}
                    </p>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">{tr ? 'E-posta:' : 'Email:'} BitcoinCalculatorToolkit@gmail.com</p>
                        <p className="text-foreground/70 text-sm mt-1">{tr ? 'Yanıt süresi: 48 saat içinde' : 'Response time: Within 48 hours'}</p>
                      </div>

                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">{tr ? 'İletişim Formu' : 'Contact Form'}</p>
                        <p className="text-foreground/70 text-sm mt-1">
                          <Link to={tr ? "/tr/iletisim" : "/contact"} className="text-primary hover:underline">
                            {tr ? 'İletişim formumuzu kullanın' : 'Use our contact form'}
                          </Link>
                          {tr ? ' ayrıntılı sorularınız için' : ' for detailed inquiries'}
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

export default Terms;
