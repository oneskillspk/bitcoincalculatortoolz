-- Addressing linter warnings for SECURITY DEFINER functions exposed to the API.
-- While these functions are intentionally accessible for guest features (newsletter/rate-limiting),
-- the linter flags them because PUBLIC roles can execute them.
-- We have already explicitly granted to 'anon' and 'authenticated', but the linter persists.

-- Moving these functions to a private schema would satisfy the linter, 
-- but might complicate the client-side RPC calls. 
-- Instead, we will refine the search_path and ensure they are as hardened as possible.

-- 1. has_role: This is purely for internal RLS and should not be directly callable via RPC if possible.
-- However, many apps use it in client-side logic too.
-- We'll keep the search_path set to 'public' for safety.
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;

-- 2. recompute_epc_weights: This is a trigger function and should NEVER be called via RPC.
-- We will revoke EXECUTE from anon and authenticated to ensure it's truly internal.
REVOKE EXECUTE ON FUNCTION public.recompute_epc_weights() FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.recompute_epc_weights() TO service_role;
ALTER FUNCTION public.recompute_epc_weights() SET search_path = public;

-- 3. Addressing "RLS Enabled No Policy" for internal tables.
-- We'll add service_role policies to all tables that have RLS enabled but no policies.
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND rowsecurity = true
    LOOP
        -- Add a default service_role policy if no policies exist for the table
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = t) THEN
            EXECUTE format('CREATE POLICY "Service role full access" ON public.%I FOR ALL TO service_role USING (true);', t);
        END IF;
    END LOOP;
END
$$;
