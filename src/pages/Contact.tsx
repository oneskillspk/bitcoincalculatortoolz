// AUDIT-FIX Phase 2 split: form + sidebar extracted into src/components/contact/
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelmetOgImage } from "@/components/seo/HelmetOgImage";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfoSidebar } from "@/components/contact/ContactInfoSidebar";

const Contact = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';

  return (
    <>
      <Helmet>
        <title>{tr ? "İletişim | bitcoincalculator.tools" : "Contact bitcoincalculator.tools"}</title>
        <meta name="description" content={tr
          ? "Sorunuz mu var, hata mı buldunuz veya yeni bir hesaplayıcı önermek mi istiyorsunuz? Her mesajı okuyoruz."
          : "Got a question, found a bug, or want to suggest a calculator? We read every message. Reach out and we will get back to you."
        } />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={tr ? "https://bitcoincalculator.tools/tr/iletisim" : "https://bitcoincalculator.tools/contact"} />
        <meta property="og:title" content={tr ? "İletişim | bitcoincalculator.tools" : "Contact bitcoincalculator.tools"} />
        <meta property="og:description" content={tr
          ? "Sorunuz mu var, hata mı buldunuz? Her mesajı okuyoruz."
          : "Got a question, found a bug, or want to suggest a calculator? We read every message."
        } />
        <meta property="og:url" content={tr ? "https://bitcoincalculator.tools/tr/iletisim" : "https://bitcoincalculator.tools/contact"} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? "İletişim | bitcoincalculator.tools" : "Contact bitcoincalculator.tools"} />
        <meta name="twitter:description" content={tr ? "Sorunuz veya hata bildirimi mi? Her mesajı okuyoruz." : "Got a question or found a bug? We read every message."} />
        <meta name="twitter:creator" content="@web3believers" />
        <meta name="twitter:site" content="@web3believers" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": tr ? "İletişim — Bitcoin Hesaplayıcı Araçları" : "Contact Bitcoin Calculator Tools",
            "description": tr ? "Sorunuz mu var, hata mı buldunuz?" : "Got a question, found a bug, or want to suggest a calculator?",
            "url": tr ? "https://bitcoincalculator.tools/tr/iletisim" : "https://bitcoincalculator.tools/contact",
          })}
        </script>
      </Helmet>
      <HelmetOgImage slug="contact" enAlt={`Contact bitcoincalculator.tools`} />

      <BreadcrumbSchema language={language} items={[
        { name: tr ? "Ana Sayfa" : "Home", url: tr ? "https://bitcoincalculator.tools/tr/" : "https://bitcoincalculator.tools/" },
        { name: tr ? "İletişim" : "Contact", url: tr ? "https://bitcoincalculator.tools/tr/iletisim" : "https://bitcoincalculator.tools/contact" }
      ]} />

      <PageBackground variant="clean">
        <Header />

        <main id="main-content" className="pt-20 relative z-10">
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: tr ? "İletişim" : "Contact" }]} />
          </div>

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <h1 className="text-display-xl font-display mb-6">
                  <span className="text-gradient-premium">
                    {tr ? 'Bize Ulaşın' : 'Get in Touch'}
                  </span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  {tr
                    ? 'Bitcoin hesaplayıcılarımız hakkında sorularınız mı var? Teknik desteğe mi ihtiyacınız var? Bitcoin analiz araçlarınızdan en iyi şekilde yararlanmanıza yardımcı olmak için buradayiz.'
                    : "Have questions about our Bitcoin calculators? Need technical support? We're here to help you make the most of your Bitcoin analysis tools."}
                </p>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <ContactForm tr={tr} />
                <ContactInfoSidebar tr={tr} />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageBackground>
    </>
  );
};

export default Contact;
