DROP VIEW IF EXISTS public.epc_weights_public;

REVOKE ALL ON public.epc_live FROM anon, authenticated;
GRANT SELECT (affiliate_id, weight, clicks_30d, updated_at) ON public.epc_live TO anon, authenticated;
GRANT ALL ON public.epc_live TO service_role;

DROP POLICY IF EXISTS "Admins can read epc_live" ON public.epc_live;
CREATE POLICY "Read epc_live rotation weights"
ON public.epc_live FOR SELECT TO anon, authenticated
USING (true);
