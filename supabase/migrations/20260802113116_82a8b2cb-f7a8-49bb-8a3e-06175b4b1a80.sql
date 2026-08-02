DROP POLICY IF EXISTS "Read epc_live rows" ON public.epc_live;
REVOKE SELECT ON public.epc_live FROM anon;
GRANT SELECT ON public.epc_live TO authenticated;
GRANT ALL ON public.epc_live TO service_role;

CREATE POLICY "Admins can read epc_live"
ON public.epc_live FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE VIEW public.epc_weights_public
WITH (security_invoker = off) AS
SELECT affiliate_id, weight, clicks_30d, updated_at
FROM public.epc_live;

GRANT SELECT ON public.epc_weights_public TO anon, authenticated;
