-- Revoke PUBLIC execution from SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.recompute_epc_weights() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.unsubscribe_newsletter_by_email(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.subscribe_newsletter(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(inet, integer, interval) FROM PUBLIC;

-- Grant to specific roles
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.recompute_epc_weights() TO service_role;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter_by_email(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(inet, integer, interval) TO anon, authenticated, service_role;

-- Ensure all public tables have at least one policy if RLS is enabled
-- (The linter flagged "RLS Enabled No Policy", which usually means a table is locked)
-- Checking for tables that might be missing policies despite RLS being on:
-- newsletter_subscribers, impressions, affiliate_overrides, clicks, user_roles, affiliates, decisions_cache, contact_submissions, conversions, epc_live, rate_limits

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rate_limits' AND policyname = 'Service role can manage rate limits') THEN
        CREATE POLICY "Service role can manage rate limits" ON public.rate_limits FOR ALL TO service_role USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contact_submissions' AND policyname = 'Service role can manage contact submissions') THEN
        CREATE POLICY "Service role can manage contact submissions" ON public.contact_submissions FOR ALL TO service_role USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'newsletter_subscribers' AND policyname = 'Service role can manage newsletter subscribers') THEN
        CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers FOR ALL TO service_role USING (true);
    END IF;
END
$$;
