-- Lock down raw affiliate revenue metrics to admins only
DROP POLICY IF EXISTS "Public read epc_live" ON public.epc_live;
REVOKE SELECT ON public.epc_live FROM anon;
REVOKE SELECT ON public.epc_live FROM authenticated;
GRANT SELECT ON public.epc_live TO authenticated;

CREATE POLICY "Admins read epc_live"
  ON public.epc_live FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public-safe view: normalized weights only, no dollar or revenue figures
CREATE OR REPLACE VIEW public.epc_weights
WITH (security_invoker = off) AS
SELECT
  affiliate_id,
  clicks_30d,
  CASE
    WHEN (SELECT max(epc_usd) FROM public.epc_live) > 0
      THEN round((epc_usd / (SELECT max(epc_usd) FROM public.epc_live))::numeric, 4)
    ELSE 0
  END AS weight
FROM public.epc_live;

GRANT SELECT ON public.epc_weights TO anon, authenticated;
GRANT ALL ON public.epc_weights TO service_role;