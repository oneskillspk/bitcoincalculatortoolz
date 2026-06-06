import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, Shield, AlertTriangle } from "lucide-react";


const Terms = () => {
  return (
    <>
<Helmet>
  {/* Primary Meta Tags */}
  <title>Terms of Service</title>
  <meta name="description" content="The rules for using bitcoincalculator.tools. Short version: use the tools freely, do not misuse them, and understand they are for information only." />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="https://bitcoincalculator.tools/terms" />

  {/* Open Graph Meta Tags */}
  <meta property="og:title" content="Terms of Service" />
  <meta property="og:description" content="The rules for using bitcoincalculator.tools. Short version: use the tools freely, do not misuse them, and understand they are for information only." />
  <meta property="og:url" content="https://bitcoincalculator.tools/terms" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://bitcoincalculator.tools/social-preview.webp" />
  <meta property="og:image:alt" content="Terms of Service | bitcoincalculator.tools" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="bitcoincalculator.tools" />

  {/* Twitter Card Meta Tags */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Terms of Service" />
  <meta name="twitter:description" content="Terms for using bitcoincalculator.tools. Free to use, information only, do not misuse." />
  <meta name="twitter:image" content="https://bitcoincalculator.tools/social-preview.webp" />
  <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
  <meta name="keywords" content="bitcoin calculator terms of service, cryptocurrency tools terms, bitcoin tools usage policy, bitcoincalculator.tools terms" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "The rules for using bitcoincalculator.tools. Use the tools freely, do not misuse them, and understand they are for information only.",
            "url": "https://bitcoincalculator.tools/terms",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://bitcoincalculator.tools"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools",
              "url": "https://bitcoincalculator.tools"
            }
          })}
        </script>
</Helmet>

      <BreadcrumbSchema items={[
        { name: "Home", url: "https://bitcoincalculator.tools/" },
        { name: "Terms of Service", url: "https://bitcoincalculator.tools/terms" }
      ]} />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: "Terms of Service" }]} />
          </div>
          
          {/* Hero Section */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-display-lg font-display mb-6">
                  <span className="text-gradient-premium">Terms of Service</span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  Please read these terms carefully before using Bitcoin Calculator Tools' services and calculators at BitcoinCalculator.Tools.
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  Last updated: February 7, 2026
                </div>
              </div>
            </div>
          </section>

          {/* Terms Content */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="space-y-8">
                
                {/* Important Notice */}
                <Card className="card-premium border-amber-200/50 bg-amber-50/50">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="w-6 h-6" />
                      Important Notice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-700">
                    <p className="leading-relaxed">
                      Bitcoin Calculator Tools provides educational and analytical tools only. 
                      Our calculators do not constitute financial advice, investment recommendations, 
                      or guarantees of future performance. Always consult with qualified financial 
                      professionals before making investment decisions.
                    </p>
                  </CardContent>
                </Card>

                {/* Acceptance of Terms */}
                <Card className="card-premium animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">1. Acceptance of Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      By accessing and using Bitcoin Calculator Tools ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      These Terms of Service apply to all users of the website, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
                    </p>
                  </CardContent>
                </Card>

                {/* Use License */}
                <Card className="card-premium animate-fade-in-up animate-stagger-2">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">2. Use License</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Permission is granted to temporarily use Bitcoin Calculator Tools for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>Modify or copy the materials</li>
                      <li>Use the materials for any commercial purpose or for any public display</li>
                      <li>Attempt to reverse engineer any software contained on the website</li>
                      <li>Remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Calculator Disclaimer */}
                <Card className="card-premium animate-fade-in-up animate-stagger-3">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">3. Calculator Accuracy & Limitations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Our Bitcoin calculators are provided for educational and analytical purposes only. While we strive for accuracy, we make no warranties about:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>The accuracy, completeness, or reliability of calculations</li>
                      <li>The suitability of results for any particular purpose</li>
                      <li>The performance of Bitcoin or any other cryptocurrency</li>
                      <li>Market predictions or investment outcomes</li>
                    </ul>
                    <p className="text-foreground/80 leading-relaxed font-medium">
                      Historical performance does not guarantee future results. Cryptocurrency investments carry significant risk.
                    </p>
                  </CardContent>
                </Card>

                {/* User Responsibilities */}
                <Card className="card-premium animate-fade-in-up animate-stagger-4">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">4. User Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">You agree to use Bitcoin Calculator Tools responsibly and acknowledge that:</p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>You are responsible for verifying all calculations independently</li>
                      <li>You will not use the service for illegal activities</li>
                      <li>You understand the risks associated with cryptocurrency investments</li>
                      <li>You will seek professional financial advice before making investment decisions</li>
                      <li>You will not attempt to interfere with the proper functioning of the website</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Privacy & Data */}
                <Card className="card-premium animate-fade-in-up animate-stagger-5">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">5. Privacy & Data Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy to understand our practices.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      We may collect anonymous usage data to improve our calculators and services. No financial or personal information entered into calculators is stored or transmitted to our servers.
                    </p>
                  </CardContent>
                </Card>

                {/* Limitations of Liability */}
                <Card className="card-premium animate-fade-in-up animate-stagger-6">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">6. Limitations of Liability</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      In no event shall Bitcoin Calculator Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bitcoin Calculator Tools' website, even if Bitcoin Calculator Tools or an authorized representative has been notified orally or in writing of the possibility of such damage.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                    </p>
                  </CardContent>
                </Card>

                {/* Modifications */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">7. Modifications to Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Bitcoin Calculator Tools may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      Material changes to these terms will be announced on our website with an updated "Last modified" date.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="card-premium animate-fade-in-up animate-stagger-8">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">8. Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">Email: BitcoinCalculatorToolkit@gmail.com</p>
                        <p className="text-foreground/70 text-sm mt-1">Response time: Within 48 hours</p>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">Contact Form</p>
                        <p className="text-foreground/70 text-sm mt-1">
                          <Link to="/contact" className="text-primary hover:underline">
                            Use our contact form
                          </Link> for detailed inquiries
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