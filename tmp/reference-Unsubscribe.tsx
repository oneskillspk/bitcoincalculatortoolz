import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2, MailX } from "lucide-react";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validateToken = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
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
  }, [token]);

  const handleUnsubscribe = async () => {
    setStatus("loading");
    try {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Email Preferences | Bitcoin Calculator Tools</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://bitcoincalculator.tools/unsubscribe" />
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-display-sm font-heading flex items-center justify-center gap-2">
              <MailX className="h-6 w-6 text-primary" />
              Email Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Processing...</p>
              </div>
            )}

            {status === "valid" && (
              <div className="space-y-4">
                <p className="text-foreground">
                  Are you sure you want to unsubscribe from our emails?
                </p>
                <Button onClick={handleUnsubscribe} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Confirm Unsubscribe
                </Button>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10 text-success" />
                <p className="text-foreground font-medium">You've been unsubscribed.</p>
                <p className="text-muted-foreground text-sm">
                  You will no longer receive emails from us.
                </p>
              </div>
            )}

            {status === "already" && (
              <div className="flex flex-col items-center gap-3">
                <CheckCircle className="h-10 w-10 text-muted-foreground" />
                <p className="text-foreground font-medium">Already unsubscribed.</p>
                <p className="text-muted-foreground text-sm">
                  This email address has already been unsubscribed.
                </p>
              </div>
            )}

            {status === "invalid" && (
              <div className="flex flex-col items-center gap-3">
                <XCircle className="h-10 w-10 text-destructive" />
                <p className="text-foreground font-medium">Invalid link.</p>
                <p className="text-muted-foreground text-sm">
                  This unsubscribe link is invalid or has expired.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-3">
                <XCircle className="h-10 w-10 text-destructive" />
                <p className="text-foreground font-medium">Something went wrong.</p>
                <p className="text-muted-foreground text-sm">
                  Please try again later or contact us for help.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
