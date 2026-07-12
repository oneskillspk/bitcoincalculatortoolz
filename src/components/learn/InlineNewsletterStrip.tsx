import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/contexts/LanguageContext';

export const InlineNewsletterStrip = () => {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: tr ? 'Geçersiz e-posta' : 'Invalid email', description: tr ? 'Lütfen geçerli bir e-posta adresi girin' : 'Please enter a valid email address', variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data: existing, error: checkError } = await supabase.rpc('check_newsletter_email', { check_email: trimmed });
      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        const sub = existing[0];
        if (sub.is_active) {
          toast({ title: tr ? 'Zaten abone' : 'Already subscribed', description: tr ? 'Bu e-posta zaten abone' : 'This email is already subscribed', variant: "destructive" });
          setIsLoading(false);
          return;
        }
        const { error } = await supabase.rpc('reactivate_newsletter_subscriber', { subscriber_id: sub.id });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('newsletter_subscribers').insert({ email: trimmed });
        if (error) throw error;
      }

      toast({ title: tr ? 'Abone oldunuz! 🎉' : 'Subscribed! 🎉', description: tr ? 'En son Bitcoin içgörülerini alacaksınız' : "You'll receive the latest Bitcoin insights", duration: 5000 });
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch {
      toast({ title: tr ? 'Başarısız' : 'Failed', description: tr ? 'Lütfen daha sonra tekrar deneyin' : 'Please try again later', variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-6 py-16 md:py-20">
      <div className="rounded-2xl border border-border/30 bg-gradient-to-r from-primary/5 via-background to-primary/5 p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-h3 font-semibold text-foreground">{tr ? 'Haftalık Bitcoin içgörüleri alın' : 'Get Bitcoin insights weekly'}</h3>
            <p className="text-sm text-muted-foreground">{tr ? 'Yeni rehberler, piyasa araçları ve analizler — spam yok.' : 'New guides, market tools, and analysis — no spam.'}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto md:min-w-[360px]">
            <Input
              type="email"
              placeholder="your@email.com"
              aria-label={tr ? 'E-posta adresi' : 'Email address'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-10 rounded-lg border-border/40 bg-background text-sm"
              disabled={isLoading}
              maxLength={255}
            />
            <Button
              type="submit"
              disabled={isLoading || isSubscribed}
              className="h-10 px-5 rounded-lg text-sm font-medium shrink-0"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSubscribed ? (
              <><Check className="w-4 h-4" /> {tr ? 'Tamam' : 'Done'}</>
              ) : (
                <><span className="hidden sm:inline">{tr ? 'Abone Ol' : 'Subscribe'}</span><ArrowRight className="w-4 h-4 sm:ml-1" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
