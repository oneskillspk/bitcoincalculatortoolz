import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Cookie, Lock, UserCheck, Globe, Calendar } from "lucide-react";


const Privacy = () => {
  return (
    <>
  <Helmet>
    {/* Primary Meta Tags */}
    <title>Privacy Policy</title>
    <meta name="description" content="No tracking, no cookies, no data sold. Here is exactly what bitcoincalculator.tools does and does not collect when you use our free calculator tools." />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="https://bitcoincalculator.tools/privacy" />

    {/* Open Graph Meta Tags */}
    <meta property="og:title" content="Privacy Policy" />
    <meta property="og:description" content="No tracking, no cookies, no data sold. Here is exactly what bitcoincalculator.tools does and does not collect when you use our free calculator tools." />
    <meta property="og:url" content="https://bitcoincalculator.tools/privacy" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://bitcoincalculator.tools/social-preview.webp" />
    <meta property="og:image:alt" content="Privacy Policy | bitcoincalculator.tools" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="bitcoincalculator.tools" />

    {/* Twitter Card Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Privacy Policy" />
    <meta name="twitter:description" content="No tracking, no cookies, no data sold. See exactly what bitcoincalculator.tools collects." />
    <meta name="twitter:image" content="https://bitcoincalculator.tools/social-preview.webp" />
    <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
    <meta name="keywords" content="bitcoin calculator privacy policy, cryptocurrency tools privacy, bitcoin tools data policy, bitcoincalculator.tools privacy" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "No tracking, no cookies, no data sold. Here is exactly what bitcoincalculator.tools does and does not collect.",
            "url": "https://bitcoincalculator.tools/privacy",
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
        { name: "Privacy Policy", url: "https://bitcoincalculator.tools/privacy" }
      ]} />
      
      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: "Privacy Policy" }]} />
          </div>
          
          {/* Hero Section */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-display-lg font-display mb-6">
                  <span className="text-gradient-premium">Privacy Policy</span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  Your privacy is important to us. This policy explains how we collect, use, and protect your information when using Bitcoin Calculator Tools at BitcoinCalculator.Tools.
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  Last updated: February 7, 2026
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Content */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="space-y-8">
                
                {/* Privacy Commitment */}
                <Card className="card-premium border-green-200/50 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2 text-green-800">
                      <UserCheck className="w-6 h-6" />
                      Our Privacy Commitment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-green-700">
                    <p className="leading-relaxed">
                      Bitcoin Calculator Tools is committed to protecting your privacy and personal data. 
                      We follow GDPR and CCPA guidelines, use minimal data collection practices, 
                      and never sell your personal information to third parties.
                    </p>
                  </CardContent>
                </Card>

                {/* Information We Collect */}
                <Card className="card-premium animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Eye className="w-6 h-6 text-primary" />
                      1. Information We Collect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">Information You Provide</h3>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                        <li>Contact form submissions (name, email, message)</li>
                        <li>Newsletter subscription email addresses</li>
                        <li>Feedback and support communications</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">Automatically Collected Information</h3>
                      <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                        <li>Browser type and version</li>
                        <li>Operating system information</li>
                        <li>Pages visited and time spent on site</li>
                        <li>Referring website addresses</li>
                        <li>Anonymous usage analytics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">Calculator Data</h3>
                      <div className="bg-blue-50 border border-blue-200/50 rounded-xl p-4">
                        <p className="text-blue-800 font-medium text-sm">
                          ✅ Important: All calculator inputs and results are processed locally in your browser. 
                          We do NOT store, transmit, or have access to your financial calculations or personal investment data.
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
                      2. How We Use Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>Respond to your inquiries and provide customer support</li>
                      <li>Send newsletter updates (only if you subscribe)</li>
                      <li>Improve our website and calculator functionality</li>
                      <li>Analyze website usage patterns anonymously</li>
                      <li>Comply with legal obligations</li>
                      <li>Protect against fraud and security threats</li>
                    </ul>
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mt-4">
                      <p className="text-foreground font-medium text-sm">
                        We will never sell, rent, or share your personal information with third parties for marketing purposes.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Cookies and Tracking */}
                <Card className="card-premium animate-fade-in-up animate-stagger-3">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Cookie className="w-6 h-6 text-primary" />
                      3. Cookies and Tracking Technologies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">Essential Cookies</h3>
                      <p className="text-foreground/80 mb-2">Required for basic website functionality:</p>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                        <li>Session management and security</li>
                        <li>User preferences and settings</li>
                        <li>Form submission and error handling</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-heading font-semibold mb-3 text-lg">Analytics Cookies</h3>
                      <p className="text-foreground/80 mb-2">Help us understand how visitors use our site:</p>
                      <ul className="list-disc pl-6 space-y-1 text-foreground/80">
                        <li>Page views and popular content</li>
                        <li>User journey and navigation patterns</li>
                        <li>Performance optimization data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4">
                      <h4 className="font-medium text-amber-800 mb-2">Cookie Control</h4>
                      <p className="text-amber-700 text-sm">
                        You can control cookies through your browser settings. Note that disabling essential cookies may affect website functionality.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Security */}
                <Card className="card-premium animate-fade-in-up animate-stagger-4">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">4. Data Security & Protection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      We implement appropriate technical and organizational security measures to protect your personal information:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>SSL encryption for all data transmission</li>
                      <li>Secure hosting infrastructure with regular security updates</li>
                      <li>Access controls and authentication for administrative systems</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      <li>Data minimization - we only collect what's necessary</li>
                    </ul>
                    <div className="bg-green-50 border border-green-200/50 rounded-xl p-4">
                      <p className="text-green-800 font-medium text-sm">
                        🔒 All calculator operations are performed locally in your browser for maximum privacy and security.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Your Rights */}
                <Card className="card-premium animate-fade-in-up animate-stagger-5">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-primary" />
                      5. Your Privacy Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Under GDPR, CCPA, and other privacy laws, you have the following rights:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">Access & Portability</h4>
                        <p className="text-sm text-foreground/70">Request a copy of your personal data</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">Rectification</h4>
                        <p className="text-sm text-foreground/70">Correct inaccurate information</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">Erasure</h4>
                        <p className="text-sm text-foreground/70">Request deletion of your data</p>
                      </div>
                      <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                        <h4 className="font-heading font-medium mb-2">Opt-out</h4>
                        <p className="text-sm text-foreground/70">Withdraw consent at any time</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/60 mt-4">
                      To exercise these rights, please contact us at BitcoinCalculatorToolkit@gmail.com
                    </p>
                  </CardContent>
                </Card>

                {/* International Users */}
                <Card className="card-premium animate-fade-in-up animate-stagger-6">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                      <Globe className="w-6 h-6 text-primary" />
                      6. International Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      Bitcoin Calculator Tools is operated from the United States. If you are accessing our service from outside the US, please be aware that your information may be transferred to, stored, and processed in the United States.
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                      We ensure appropriate safeguards are in place for international data transfers and comply with applicable data protection laws including GDPR for EU users.
                    </p>
                  </CardContent>
                </Card>

                {/* Updates to Policy */}
                <Card className="card-premium animate-fade-in-up animate-stagger-7">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">7. Updates to This Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                      <li>Post the updated policy on this page</li>
                      <li>Update the "Last modified" date</li>
                      <li>Notify users of material changes via email (if we have your email)</li>
                      <li>Provide 30 days notice for significant changes</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="card-premium animate-fade-in-up animate-stagger-8">
                  <CardHeader>
                    <CardTitle className="text-display-sm font-heading">8. Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed">
                      If you have questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">Privacy Officer</p>
                        <p className="text-foreground/70 text-sm">Email: BitcoinCalculatorToolkit@gmail.com</p>
                        <p className="text-foreground/60 text-xs mt-1">Response time: Within 48 hours</p>
                      </div>
                      
                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                        <p className="text-foreground font-medium">Contact Form</p>
                        <p className="text-foreground/70 text-sm">
                          <Link to="/contact" className="text-primary hover:underline">
                            Use our contact form
                          </Link> for privacy-related inquiries
                        </p>
                        <p className="text-foreground/60 text-xs mt-1">Secure and convenient way to reach us</p>
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