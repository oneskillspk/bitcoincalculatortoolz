// AUDIT-FIX [NEW-001] 2026-06-05 — Add Zod server-side-style validation before Supabase insert
// AUDIT-FIX [NEW-003] 2026-06-05 — maxLength already present on inputs; add to Textarea + enforce in schema
// AUDIT-FIX [NEW-004] 2026-06-05 — Add submission cooldown (30s) to prevent spam / rate-abuse
// Before: Raw .trim() values inserted directly into Supabase with no validation.
//         No maxLength on Textarea. No cooldown between submissions.
// After:  Zod schema validates & sanitizes all fields before any DB/email call.
//         30-second client-side cooldown prevents rapid re-submission.

import { Helmet } from "react-helmet-async";
import { Link } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Mail, Clock, Send, MessageSquare, MapPin } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

// AUDIT-FIX [NEW-001]: Zod schema — validates & sanitizes all contact fields.
// Mirrors server-side constraints so malformed/oversized payloads never reach Supabase.
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50).trim(),
  lastName:  z.string().min(1, "Last name is required").max(50).trim(),
  email:     z.string().email("Invalid email address").max(254).trim().toLowerCase(),
  subject:   z.string().min(1, "Subject is required").max(100).trim(),
  message:   z.string().min(10, "Message must be at least 10 characters").max(2000).trim(),
});

type ContactForm = z.infer<typeof contactSchema>;

// AUDIT-FIX [NEW-004]: 30-second cooldown between submissions (milliseconds)
const SUBMIT_COOLDOWN_MS = 30_000;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  // AUDIT-FIX [NEW-001]: field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  // AUDIT-FIX [NEW-004]: track last successful submission timestamp
  const lastSubmitAt = useRef<number>(0);
  const { toast } = useToast();
  const { language } = useLanguage();
  const tr = language === 'tr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // AUDIT-FIX [NEW-004]: Enforce cooldown between submissions
    const now = Date.now();
    const elapsed = now - lastSubmitAt.current;
    if (elapsed < SUBMIT_COOLDOWN_MS) {
      const secondsLeft = Math.ceil((SUBMIT_COOLDOWN_MS - elapsed) / 1000);
      toast({
        title: tr ? `Lütfen ${secondsLeft} saniye bekleyin` : `Please wait ${secondsLeft}s before resubmitting`,
        variant: "destructive",
      });
      return;
    }

    // AUDIT-FIX [NEW-001]: Validate with Zod before touching Supabase
    const parseResult = contactSchema.safeParse({ firstName, lastName, email, subject, message });
    if (!parseResult.success) {
      const errors: Partial<Record<keyof ContactForm, string>> = {};
      parseResult.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      toast({
        title: tr ? "Lütfen tüm alanları doğru doldurun" : "Please fix the highlighted fields",
        variant: "destructive",
      });
      return;
    }

    // All fields now safely sanitized by Zod
    const safe = parseResult.data;
    setIsSubmitting(true);

    try {
      const submissionId = crypto.randomUUID();

      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          id: submissionId,
          first_name: safe.firstName,
          last_name: safe.lastName,
          email: safe.email,
          subject: safe.subject,
          message: safe.message,
        });

      if (dbError) {
        console.error('DB insert error:', dbError);
      }

      const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-notification',
          idempotencyKey: `contact-notify-${submissionId}`,
          templateData: {
            firstName: safe.firstName,
            lastName: safe.lastName,
            email: safe.email,
            subject: safe.subject,
            message: safe.message,
          },
        },
      });

      if (emailError) {
        console.warn('Email notification failed (non-critical):', emailError);
      }

      const { error: confirmError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-confirmation',
          recipientEmail: safe.email,
          idempotencyKey: `contact-confirm-${submissionId}`,
          templateData: {
            firstName: safe.firstName,
            subject: safe.subject,
          },
        },
      });

      if (confirmError) {
        console.warn('Confirmation email failed (non-critical):', confirmError);
      }

      // AUDIT-FIX [NEW-004]: Record successful submission time for cooldown
      lastSubmitAt.current = Date.now();

      toast({
        title: tr ? "Mesaj Başarıyla Gönderildi!" : "Message Sent Successfully!",
        description: tr
          ? "24 saat içinde size geri döneceğiz. Onay e-postası için gelen kutunuzu kontrol edin."
          : "We'll get back to you within 24 hours. Check your inbox for a confirmation email.",
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: tr ? "Mesaj Gönderilemedi" : "Failed to send message",
        description: tr
          ? "Lütfen tekrar deneyin veya doğrudan BitcoinCalculatorToolkit@gmail.com adresine e-posta gönderin."
          : "Please try again or email us directly at BitcoinCalculatorToolkit@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <meta property="og:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
        <meta property="og:image:alt" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'Bitcoin Hesaplayıcıları — 45+ Ücretsiz Araç | bitcoincalculator.tools' : 'Contact bitcoincalculator.tools'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tr ? "İletişim | bitcoincalculator.tools" : "Contact bitcoincalculator.tools"} />
        <meta name="twitter:description" content={tr ? "Sorunuz veya hata bildirimi mi? Her mesajı okuyoruz." : "Got a question or found a bug? We read every message."} />
        <meta name="twitter:image" content={(typeof window !== 'undefined' && window.location.pathname.startsWith('/tr')) ? 'https://bitcoincalculator.tools/bitcoin-kar-hesaplayici-og.webp' : 'https://bitcoincalculator.tools/social-preview.webp'} />
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

                {/* Contact Form */}
                <div className="animate-fade-in-up">
                  <Card className="card-premium h-full">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        {tr ? 'Mesaj Gönderin' : 'Send us a Message'}
                      </CardTitle>
                      <CardDescription>
                        {tr
                          ? 'Aşağıdaki formu doldurun, 24 saat içinde yanıt vereceğiz'
                          : "Fill out the form below and we'll respond within 24 hours"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                              {tr ? 'Ad *' : 'First Name *'}
                            </label>
                            <Input
                              id="firstName"
                              required
                              placeholder={tr ? 'Ali' : 'John'}
                              className={`w-full ${fieldErrors.firstName ? 'border-destructive' : ''}`}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              maxLength={50}
                            />
                            {fieldErrors.firstName && (
                              <p className="text-xs text-destructive mt-1">{fieldErrors.firstName}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                              {tr ? 'Soyad *' : 'Last Name *'}
                            </label>
                            <Input
                              id="lastName"
                              required
                              placeholder={tr ? 'Yılmaz' : 'Doe'}
                              className={`w-full ${fieldErrors.lastName ? 'border-destructive' : ''}`}
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              maxLength={50}
                            />
                            {fieldErrors.lastName && (
                              <p className="text-xs text-destructive mt-1">{fieldErrors.lastName}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            {tr ? 'E-posta Adresi *' : 'Email Address *'}
                          </label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder={tr ? 'ornek@email.com' : 'john@example.com'}
                            className={`w-full ${fieldErrors.email ? 'border-destructive' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={254}
                          />
                          {fieldErrors.email && (
                            <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                            {tr ? 'Konu *' : 'Subject *'}
                          </label>
                          <Input
                            id="subject"
                            required
                            placeholder={tr ? 'Size nasıl yardımcı olabiliriz?' : 'How can we help you?'}
                            className={`w-full ${fieldErrors.subject ? 'border-destructive' : ''}`}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            maxLength={100}
                          />
                          {fieldErrors.subject && (
                            <p className="text-xs text-destructive mt-1">{fieldErrors.subject}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                            {tr ? 'Mesaj *' : 'Message *'}
                          </label>
                          {/* AUDIT-FIX [NEW-003]: maxLength={2000} added to Textarea */}
                          <Textarea
                            id="message"
                            required
                            placeholder={tr ? 'Sorgunuzu bize anlatın...' : 'Tell us about your inquiry...'}
                            className={`w-full min-h-32 resize-y ${fieldErrors.message ? 'border-destructive' : ''}`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={2000}
                          />
                          <div className="flex justify-between items-center mt-1">
                            {fieldErrors.message ? (
                              <p className="text-xs text-destructive">{fieldErrors.message}</p>
                            ) : <span />}
                            <p className="text-xs text-foreground/40">{message.length}/2000</p>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn-premium w-full text-base font-medium py-3 group"
                        >
                          {isSubmitting ? (
                            <>{tr ? 'Gönderiliyor...' : 'Sending Message...'}</>
                          ) : (
                            <>
                              {tr ? 'Mesajı Gönder' : 'Send Message'}
                              <Send className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </Button>

                        <p className="text-sm text-foreground/60 text-center">
                          {tr ? (
                            <>
                              Bu formu göndererek{' '}
                              <Link to="/tr/gizlilik" className="text-primary hover:underline">Gizlilik Politikamızı</Link>
                              {' '}ve{' '}
                              <Link to="/tr/kosullar" className="text-primary hover:underline">Kullanım Koşullarımızı</Link>
                              {' '}kabul etmiş olursunuz.
                            </>
                          ) : (
                            <>
                              By submitting this form, you agree to our{' '}
                              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                              {' '}and{' '}
                              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                            </>
                          )}
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-8 animate-fade-in-up animate-stagger-2">

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading">
                        {tr ? 'İletişim Bilgileri' : 'Contact Information'}
                      </CardTitle>
                      <CardDescription>
                        {tr
                          ? 'Destek ekibimize ulaşmanın birden fazla yolu'
                          : 'Multiple ways to reach our support team'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">{tr ? 'E-posta Desteği' : 'Email Support'}</h3>
                          <p className="text-foreground/70 mb-1">support@bitcoincalculator.tools</p>
                          <p className="text-sm text-foreground/60">
                            {tr ? 'Teknik destek ve genel sorular için' : 'For technical support and general inquiries'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">{tr ? 'Yanıt Süresi' : 'Response Time'}</h3>
                          <p className="text-foreground/70 mb-1">{tr ? '24 saat içinde' : 'Within 24 hours'}</p>
                          <p className="text-sm text-foreground/60">
                            {tr ? 'Pazartesi - Cuma, 09:00 - 18:00 EST' : 'Monday - Friday, 9 AM - 6 PM EST'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">{tr ? 'Konum' : 'Location'}</h3>
                          <p className="text-foreground/70 mb-1">{tr ? 'Bitcoin Her Yerde' : 'Bitcoin is Everywhere'}</p>
                          <p className="text-sm text-foreground/60">
                            {tr ? 'Dünya genelindeki Bitcoin meraklılarına hizmet ediyoruz' : 'Serving Bitcoin enthusiasts worldwide'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading">
                        {tr ? 'Hızlı Yardım' : 'Quick Help'}
                      </CardTitle>
                      <CardDescription>
                        {tr ? 'Sık sorulan sorular ve kaynaklar' : 'Common questions and resources'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">
                            {tr ? 'Hesaplayıcı Sorunları?' : 'Calculator Issues?'}
                          </h4>
                          <p className="text-sm text-foreground/70">
                            {tr
                              ? 'Yaygın hesaplayıcı sorunları ve çözümleri için SSS bölümümüzü inceleyin.'
                              : 'Check our FAQ section for common calculator problems and solutions.'}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">
                            {tr ? 'Özellik İstekleri' : 'Feature Requests'}
                          </h4>
                          <p className="text-sm text-foreground/70">
                            {tr
                              ? 'Yeni bir hesaplayıcı fikriniz mi var? Sizden duymayı çok isteriz!'
                              : "Have an idea for a new calculator? We'd love to hear from you!"}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">
                            {tr ? 'Ortaklık Talepleri' : 'Partnership Inquiries'}
                          </h4>
                          <p className="text-sm text-foreground/70">
                            {tr
                              ? 'Araçlarımızı entegre etmekle mi ilgileniyorsunuz? Fırsatları konuşalim.'
                              : "Interested in integrating our tools? Let's discuss opportunities."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
