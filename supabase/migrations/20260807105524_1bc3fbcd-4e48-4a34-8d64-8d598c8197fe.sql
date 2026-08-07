-- Revoke execute from public roles and then grant specifically to anon/authenticated
-- This is a standard security practice to prevent accidental exposure
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(inet, int, interval) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(inet, int, interval) TO anon, authenticated;

-- Ensure RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow anon/authenticated to select their own IP if they need to, 
-- but actually for this RPC we don't strictly need a policy if we use SECURITY DEFINER.
-- However, let's add a policy for safety.
CREATE POLICY "Anyone can see their own rate limit" ON public.rate_limits
    FOR SELECT USING (ip_address = (select current_setting('request.headers', true)::json->>'x-real-ip')::inet);
