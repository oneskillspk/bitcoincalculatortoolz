import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionTerminalStrip } from "@/components/cinematic/SectionTerminalStrip";
import { SectionHeading } from "@/components/calculator/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Instrument Panel newsletter — hairline card, mono rails, ember submit.
 */
export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isTurkish = language === 'tr';
  const privacyHref = isTurkish ? '/tr/gizlilik' : '/privacy';

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: isTurkish ? 'E-posta gerekli' : 'Email required',
        description: isTurkish ? 'Lütfen e-posta adresinizi girin' : 'Please enter your email address',
        variant: "destructive",
      });
      return;
    }
    if (!validateEmail(email)) {
      toast({
        title: isTurkish ? 'Geçersiz e-posta' : 'Invalid email',
        description: isTurkish ? 'Lütfen geçerli bir e-posta adresi girin' : 'Please enter a valid email address',
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: existing, error: checkError } = await supabase
        .rpc('check_newsletter_email', { check_email: normalizedEmail });
      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        const subscriber = existing[0];
        if (subscriber.is_active) {
          toast({
            title: isTurkish ? 'Zaten abone oldunuz' : 'Already subscribed',
            description: isTurkish ? 'Bu e-posta zaten bültenimize abone' : 'This email is already subscribed to our newsletter',
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const { error: reactivateError } = await supabase
          .rpc('reactivate_newsletter_subscriber', { subscriber_id: subscriber.id });
        if (reactivateError) throw reactivateError;
      } else {
        const { error } = await supabase.from('newsletter_subscribers').insert({ email: normalizedEmail });
        if (error) throw error;
      }

      toast({
        title: isTurkish ? 'Başarıyla abone oldunuz! 🎉' : 'Successfully subscribed! 🎉',
        description: isTurkish ? 'En yeni Bitcoin araçları ve içgörüleri için bildirim alacaksınız' : "You'll receive the latest Bitcoin tools and insights",
        duration: 5000,
      });

      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: isTurkish ? 'Abonelik başarısız' : 'Subscription failed',
        description: isTurkish ? 'Lütfen daha sonra tekrar deneyin' : 'Please try again later',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-12 md:py-20 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal as="article" blur={4} y={12} className="bg-card border border-border/70 rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
            <SectionTerminalStrip
              moduleId="SIGNAL-01"
              context={isTurkish ? 'BÜLTEN' : 'NEWSLETTER'}
              status={isTurkish ? 'HAFTALIK' : 'WEEKLY'}
              className="border-t-0"
            />

            <div className="p-6 sm:p-8 md:p-10">
              <SectionHeading
                title={isTurkish ? 'Bitcoin Araçlarında Güncel Kalın' : 'Stay Updated on Bitcoin Tools'}
                description={isTurkish
                  ? 'Yeni hesaplayıcılar, piyasa içgörüleri ve özel Bitcoin analiz araçları hakkında bildirim alın.'
                  : 'Get notified about new calculators, market insights, and exclusive Bitcoin analysis tools.'}
                className="mb-6"
              />

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:border sm:border-border/70 sm:rounded-lg sm:overflow-hidden sm:bg-background/50">
                  <Input
                    type="email"
                    placeholder={isTurkish ? 'E-posta adresinizi girin' : 'Enter your email address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input flex-1 h-12 sm:h-[52px] px-4 text-[14.5px] bg-background border border-border/70 sm:border-0 sm:bg-transparent rounded-lg sm:rounded-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:ring-offset-0"
                    disabled={isLoading}
                    maxLength={255}
                    aria-label={isTurkish ? 'Bülten için e-posta adresi' : 'Email address for newsletter'}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || isSubscribed}
                    className="group min-h-[48px] sm:h-[52px] px-5 inline-flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-60 rounded-lg sm:rounded-none border border-primary sm:border-0 transition-colors"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : isSubscribed ? (
                      <>{isTurkish ? 'ABONE OLUNDU' : 'SUBSCRIBED'}</>
                    ) : (
                      <>
                        {isTurkish ? 'ABONE OL' : 'SUBSCRIBE'}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.75} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <footer className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border/60 bg-background/30">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground">
                {isTurkish ? 'GİZLİLİK · GDPR' : 'PRIVACY · GDPR'}
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-foreground text-right">
                {isTurkish ? 'SPAM YOK · İSTEDİĞİNİZ ZAMAN ÇIKIN' : 'NO SPAM · UNSUBSCRIBE ANYTIME'}
              </span>
            </footer>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
