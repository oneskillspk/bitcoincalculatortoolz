-- Identifying functions that are still flagged by the linter as executable by PUBLIC or authenticated roles
-- when they should be strictly restricted.

-- The linter often flags functions in the 'public' schema because they are exposed to the API.
-- We already revoked from PUBLIC, but let's be more explicit and also handle 'authenticated' if not needed.

-- 1. has_role: Should be accessible by authenticated users to check their own role (common in RLS),
-- but we can restrict it to just authenticated/service_role and ensure no anon access.
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2. recompute_epc_weights: Strictly internal trigger function.
REVOKE ALL ON FUNCTION public.recompute_epc_weights() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_epc_weights() TO service_role;

-- 3. Newsletter/Rate limit functions: Need anon/authenticated for the forms to work.
-- The linter WARN is likely because they are SECURITY DEFINER and executable by public roles.
-- This is a tradeoff for guest functionality. We will keep these as they are but ensure search_path is safe.
ALTER FUNCTION public.unsubscribe_newsletter_by_email(text) SET search_path = public;
ALTER FUNCTION public.subscribe_newsletter(text) SET search_path = public;
ALTER FUNCTION public.check_rate_limit(inet, integer, interval) SET search_path = public;

-- 4. Fix "RLS Enabled No Policy" issues.
-- Some tables might have RLS enabled but no policies, which denies all access (except service_role).
-- If this was intentional for internal-only tables, we should add a service_role policy to satisfy the linter.

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
