import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // Defer role check
        setTimeout(async () => {
          const { data } = await supabase.rpc("has_role", {
            _user_id: s.user.id,
            _role: "admin",
          });
          setIsAdmin(!!data);
          setLoading(false);
        }, 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: hr } = await supabase.rpc("has_role", {
          _user_id: data.session.user.id,
          _role: "admin",
        });
        setIsAdmin(!!hr);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, isAdmin, loading };
}
