-- Remove public/anon read access to the affiliates table to hide commission terms.
-- Edge functions (log-event, refresh-decisions) use the service role and bypass RLS,
-- so internal reads continue to work. Admins retain full access via affiliates_admin_all.
DROP POLICY IF EXISTS affiliates_public_read ON public.affiliates;