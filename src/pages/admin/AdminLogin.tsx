// AUDIT-FIX [SEC-002] 2026-06-05 — Remove open admin self-registration
// Before: AdminLogin had a public "Sign up" toggle + supabase.auth.signUp() call.
//         Any visitor at /admin/login could register a Supabase account,
//         enabling account enumeration, auth pool spam, and future escalation.
// After:  Sign-in ONLY. Admin accounts must be provisioned via Supabase
//         Dashboard → Authentication → Invite User. No self-registration.
// SECURITY: Never expose signUp() on an admin route.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  // AUDIT-FIX [SEC-002]: Removed "mode" state (signin/signup toggle).
  // Only sign-in is permitted on this route.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading && session && isAdmin) navigate("/admin", { replace: true });
  }, [loading, session, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    // SECURITY: signInWithPassword only — signUp() removed entirely.
    // To provision new admin accounts use:
    // Supabase Dashboard → Authentication → Users → Invite User
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      return toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
    toast({ title: "Signed in" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border border-border rounded-lg p-6 bg-card"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Authorised personnel only. To request access, contact the site owner.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>

        {/* AUDIT-FIX [SEC-002]: Sign-up link removed.
            Admin accounts are created via Supabase Dashboard invite only.
            No self-registration is permitted on any admin route. */}

        {session && !isAdmin && (
          <p className="text-sm text-destructive">
            Signed in as {session.user.email} but not yet an admin.
            Share this email with the site owner to be granted access.
          </p>
        )}
      </form>
    </main>
  );
}
