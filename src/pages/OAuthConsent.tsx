import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

const CANONICAL_URL = "https://bitcoincalculatortoolz.lovable.app/.lovable/oauth/consent";

// Typed shim: supabase.auth.oauth is beta and not in the current @supabase/supabase-js types.
type OAuthDetails = {
  redirect_url?: string;
  redirect_to?: string;
  client?: { name?: string; client_id?: string; client_uri?: string; logo_uri?: string };
  scopes?: string[];
};
type OAuthNS = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthDetails | null; error: { message: string } | null }>;
};
const oauth = (supabase.auth as unknown as { oauth: OAuthNS }).oauth;

/**
 * OAuth 2.1 consent page for the app's MCP server.
 * Mounted at /.lovable/oauth/consent. Preserves the full consent URL through
 * every unauthenticated path so callers return to complete authorization.
 */
export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = `/admin/login?next=${encodeURIComponent(next)}`;
        return;
      }
      const { data, error: e } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (e) {
        setError(e.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: e } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (e) {
      setBusy(false);
      setError(e.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const head = (
    <Helmet>
      <title>Authorize application · Bitcoin Calculator Tools</title>
      <meta name="description" content="Review and approve an application's request to access Bitcoin Calculator Tools on your behalf." />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={CANONICAL_URL} />
      <meta property="og:title" content="Authorize application · Bitcoin Calculator Tools" />
      <meta property="og:url" content={CANONICAL_URL} />
      <meta property="og:type" content="website" />
    </Helmet>
  );

  if (error) {
    return (
      <>
        {head}
        <main className="min-h-dvh flex items-center justify-center px-6">
          <div className="max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-foreground">Authorization error</h1>
            <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          </div>
        </main>
      </>
    );
  }

  if (!details) {
    return (
      <>
        {head}
        <main className="min-h-dvh flex items-center justify-center px-6">
          <p className="text-sm text-muted-foreground">Loading authorization…</p>
        </main>
      </>
    );
  }

  const clientName = details.client?.name ?? "an application";
  return (
    <>
      {head}
    <main className="min-h-dvh flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          MCP · Authorize agent
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          Connect {clientName} to your account?
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This lets <span className="font-medium text-foreground">{clientName}</span> call Bitcoin
          Calculator Tools on your behalf, including live market data and calculator functions. It
          will act as your signed-in user.
        </p>
        {details.scopes && details.scopes.length > 0 && (
          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            {details.scopes.map((s) => (
              <li key={s} className="font-mono">
                · {s}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {busy ? "Working…" : "Approve"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Deny
          </button>
        </div>
      </div>
    </main>
  );
}
