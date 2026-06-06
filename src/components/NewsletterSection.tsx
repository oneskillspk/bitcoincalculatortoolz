import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { LazyLottie } from "@/components/motion/LazyLottie";
import { successCheck } from "@/components/motion/lottieAnimations";

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const isTurkish = language === 'tr';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

      if (checkError) {
        console.error('Email check error:', checkError);
        throw checkError;
      }

      if (existing && existing.length > 0) {
        const subscriber = existing[0];
        if (subscriber.is_active) {
          toast({
            title: isTurkish ? 'Zaten abone oldunuz' : 'Already subscribed',
            description: isTurkish
              ? 'Bu e-posta zaten bültenimize abone'
              : 'This email is already subscribed to our newsletter',
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const { error: reactivateError } = await supabase
          .rpc('reactivate_newsletter_subscriber', { subscriber_id: subscriber.id });

        if (reactivateError) throw reactivateError;
      } else {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({ email: normalizedEmail });

        if (error) throw error;
      }

      toast({
        title: isTurkish ? 'Başarıyla abone oldunuz! 🎉' : 'Successfully subscribed! 🎉',
        description: isTurkish
          ? 'En yeni Bitcoin araçları ve içgörüleri için bildirim alacaksınız'
          : "You'll receive the latest Bitcoin tools and insights",
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
    <section className="section-y bg-[hsl(var(--surface-warm))]">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl mb-5 sm:mb-6">
            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>

          <h2 className="text-h2 font-semibold mb-4 sm:mb-6 text-foreground px-2">
            {isTurkish ? 'Bitcoin Araçlarında Güncel Kalın' : 'Stay Updated on Bitcoin Tools'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            {isTurkish
              ? 'Yeni hesaplayıcılar, piyasa içgörüleri ve özel Bitcoin analiz araçları hakkında bildirim alın'
              : 'Get notified about new calculators, market insights, and exclusive Bitcoin analysis tools'}
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-slide-up px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 bg-background/50 rounded-2xl border border-border/50 shadow-lg">
              <Input
                type="email"
                placeholder={isTurkish ? 'E-posta adresinizi girin' : 'Enter your email address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input flex-1 border-0 bg-transparent text-base sm:text-sm placeholder:text-foreground/50 focus:ring-0 focus:ring-offset-0 h-12 px-3"
                disabled={isLoading}
                maxLength={255}
                aria-label={isTurkish ? 'Bülten için e-posta adresi' : 'Email address for newsletter'}
              />
              <Button
                type="submit"
                disabled={isLoading || isSubscribed}
                className={`h-12 min-h-[48px] px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shrink-0 transition-all duration-300 ${
                  isSubscribed
                    ? 'bg-success hover:bg-success/90 text-success-foreground'
                    : 'btn-premium'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <>
                    <LazyLottie
                      animationData={successCheck}
                      mountDelayMs={0}
                      loop={false}
                      className="w-5 h-5"
                      ariaLabel="Subscribed"
                    />
                    {isTurkish ? 'Abone Olundu' : 'Subscribed'}
                  </>
                ) : (
                  <>
                    {isTurkish ? 'Abone Ol' : 'Subscribe'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 px-4">
            {isTurkish
              ? 'Spam yok, istediğiniz zaman aboneliği iptal edin. Gizliliğinize saygı duyuyor ve GDPR kurallarına uyuyoruz.'
              : 'No spam, unsubscribe at any time. We respect your privacy and follow GDPR guidelines.'}
          </p>
        </div>
      </div>
    </section>
  );
};
