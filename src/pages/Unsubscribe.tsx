import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");
  const [emailInput, setEmailInput] = useState(emailParam ?? "");
  const { language } = useLanguage();
  const tr = language === 'tr';

  // Newsletter flow: only ?email= present (or neither). Token flow: ?token= present.
  const mode: "token" | "newsletter" = token ? "token" : "newsletter";

  useEffect(() => {
    if (mode === "newsletter") {
      // Show the email-entry / confirm UI; nothing to validate up-front.
      setStatus("valid");
      return;
    }

    const validateToken = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token!)}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();

        if (res.ok && data.valid === true) {
          setStatus("valid");
        } else if (data.reason === "already_unsubscribed") {
          setStatus("already");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };

    validateToken();
  }, [token, mode]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
      if (mode === "newsletter") {
        const email = emailInput.trim().toLowerCase();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailOk) {
          setStatus("invalid");
          return;
        }
        const { error } = await supabase.rpc("unsubscribe_newsletter_by_email", {
          unsub_email: email,
        });
        if (error) throw error;
        setStatus("success");
        return;
      }

      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });

      if (error) throw error;

      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Helmet>
        <title>{tr ? 'E-posta Tercihleri | Bitcoin Hesaplayıcı Araçları' : 'Email Preferences | Bitcoin Calculator Tools'}</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://bitcoincalculator.tools/unsubscribe" />
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-display-sm font-heading flex items-center justify-center gap-2">
              <MailX className="h-6 w-6 text-primary" />
              {tr ? 'E-posta Tercihleri' : 'Email Preferences'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">{tr ? 'İşleniyor...' : 'Processing...'}</p>
              </div>
            )}

            {status === "valid" && (
              <div className="space-y-4">
                <p className="text-foreground">
                  {mode === "newsletter"
                    ? (tr
                        ? 'Bültenimizden çıkmak istediğiniz e-posta adresini onaylayın.'
                        : 'Confirm the email address to unsubscribe from our newsletter.')
                    : (tr
                        ? 'E-postalarımızdan aboneliğinizi iptal etmek istediğinizden emin misiniz?'
                        : 'Are you sure you want to unsubscribe from our emails?')}
                </p>
                {mode === "newsletter" && (
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={tr ? 'eposta@ornek.com' : 'you@example.com'}
                    maxLength={254}
                    className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={tr ? 'E-posta adresi' : 'Email address'}
                  />
                )}
                <Button
                  onClick={handleUnsubscribe}
                  disabled={mode === "newsletter" && !emailInput.trim()}
                  className="w-full bg-destructive hover:bg-destructive text-white"
                >
                  {tr ? 'Aboneliği İptal Et' : 'Confirm Unsubscribe'}
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10 text-success" />
                <p className="text-foreground font-medium">
                  {tr ? 'Aboneliğiniz iptal edildi.' : "You've been unsubscribed."}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tr
                    ? 'Artık bizden e-posta almayacaksınız.'
                    : 'You will no longer receive emails from us.'}
                </p>
              </div>
            )}

            {status === "already" && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10 text-muted-foreground" />
                <p className="text-foreground font-medium">
                  {tr ? 'Zaten aboneliğiniz iptal edilmiş.' : 'Already unsubscribed.'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tr
                    ? 'Bu e-posta adresi zaten abonelikten çıkarılmış.'
                    : 'This email address has already been unsubscribed.'}
                </p>
              </div>
            )}

            {status === "invalid" && (
              <div className="flex flex-col items-center gap-3">
                <XCircle className="h-10 w-10 text-destructive" />
                <p className="text-foreground font-medium">
                  {tr ? 'Geçersiz bağlantı.' : 'Invalid link.'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tr
                    ? 'Bu abonelik iptal bağlantısı geçersiz veya süresi dolmuş.'
                    : 'This unsubscribe link is invalid or has expired.'}
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3">
                <XCircle className="h-10 w-10 text-destructive" />
                <p className="text-foreground font-medium">
                  {tr ? 'Bir şeyler yanlış gitti.' : 'Something went wrong.'}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tr
                    ? 'Lütfen daha sonra tekrar deneyin veya yardım için bize ulaşın.'
                    : 'Please try again later or contact us for help.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {/* Footer intentionally omitted: page is noindex,nofollow — removing the global footer prevents it from being counted as a nofollow source of internal links to TR pillar pages. */}
    </div>
  );
};

export default Unsubscribe;
