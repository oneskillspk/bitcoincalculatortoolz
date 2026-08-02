DROP POLICY IF EXISTS "Anyone reads overrides" ON public.affiliate_overrides;
DROP POLICY IF EXISTS "overrides_public_read" ON public.affiliate_overrides;
DROP POLICY IF EXISTS "Anyone reads decisions" ON public.decisions_cache;
DROP POLICY IF EXISTS "decisions_public_read" ON public.decisions_cache;

REVOKE SELECT ON public.affiliate_overrides FROM anon;
REVOKE SELECT ON public.decisions_cache FROM anon;

CREATE POLICY "Admins read overrides" ON public.affiliate_overrides
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins read decisions" ON public.decisions_cache
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));