DROP VIEW IF EXISTS public.epc_weights;

ALTER TABLE public.epc_live
  ADD COLUMN IF NOT EXISTS weight numeric(6,4) NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.recompute_epc_weights()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_epc numeric;
BEGIN
  SELECT max(epc_usd) INTO max_epc FROM public.epc_live;
  IF max_epc IS NULL OR max_epc <= 0 THEN
    UPDATE public.epc_live SET weight = 0 WHERE weight <> 0;
  ELSE
    UPDATE public.epc_live t
       SET weight = round((t.epc_usd / max_epc)::numeric, 4)
     WHERE t.weight IS DISTINCT FROM round((t.epc_usd / max_epc)::numeric, 4);
  END IF;
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.recompute_epc_weights() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_recompute_epc_weights ON public.epc_live;
CREATE TRIGGER trg_recompute_epc_weights
AFTER INSERT OR UPDATE OF epc_usd OR DELETE ON public.epc_live
FOR EACH STATEMENT EXECUTE FUNCTION public.recompute_epc_weights();

-- Column-level access: visitors never see money columns
REVOKE SELECT ON public.epc_live FROM anon, authenticated;
GRANT SELECT (affiliate_id, clicks_30d, weight, updated_at) ON public.epc_live TO anon, authenticated;
GRANT ALL ON public.epc_live TO service_role;

DROP POLICY IF EXISTS "Admins read epc_live" ON public.epc_live;
CREATE POLICY "Read epc_live rows" ON public.epc_live
  FOR SELECT TO anon, authenticated
  USING (true);