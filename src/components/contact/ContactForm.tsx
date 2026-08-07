import { useState, useRef } from "react";
import { z } from "zod";
import { Link } from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50).trim(),
  lastName: z.string().min(1, "Last name is required").max(50).trim(),
  email: z.string().email("Invalid email address").max(254).trim().toLowerCase(),
  subject: z.string().min(1, "Subject is required").max(100).trim(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000).trim(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SUBMIT_COOLDOWN_MS = 30_000;

interface ContactFormProps {
  tr: boolean;
}

export const ContactForm = ({ tr }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const lastSubmitAt = useRef<number>(0);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

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

    const parseResult = contactSchema.safeParse({ firstName, lastName, email, subject, message });
    if (!parseResult.success) {
      const errors: Partial<Record<keyof ContactFormData, string>> = {};
      parseResult.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      toast({
        title: tr ? "Lütfen tüm alanları doğru doldurun" : "Please fix the highlighted fields",
        variant: "destructive",
      });
      return;
    }

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
        throw dbError; // Fix: Actually throw so we catch and show failure
      }

      // 2. Try to trigger Edge Functions for notifications (non-blocking)
      try {
        await supabase.functions.invoke('send-transactional-email', {
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
        
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'contact-confirmation',
            recipientEmail: safe.email,
            idempotencyKey: `contact-confirm-${submissionId}`,
            templateData: { firstName: safe.firstName, subject: safe.subject },
          },
        });
      } catch (fnErr) {
        console.warn('Edge Function invocation failed (non-critical):', fnErr);
      }


      lastSubmitAt.current = Date.now();

      toast({
        title: tr ? "Mesaj Başarıyla Gönderildi!" : "Message Sent Successfully!",
        description: tr
          ? "24 saat içinde size geri döneceğiz. Onay e-postası için gelen kutunuzu kontrol edin."
          : "We'll get back to you within 24 hours. Check your inbox for a confirmation email.",
      });

      setFirstName(''); setLastName(''); setEmail(''); setSubject(''); setMessage('');
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
                <p className="text-xs text-muted-foreground">{message.length}/2000</p>
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
  );
};
