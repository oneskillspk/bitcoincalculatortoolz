-- Cache table for BLS CPI data (CUUR0000SA0). Survives edge-function cold starts.
CREATE TABLE IF NOT EXISTS public.cpi_cache (
  id INTEGER PRIMARY KEY DEFAULT 1,
  cpi JSONB NOT NULL,
  latest_value NUMERIC NOT NULL,
  source TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ttl_until TIMESTAMPTZ NOT NULL,
  CONSTRAINT cpi_cache_singleton CHECK (id = 1)
);

ALTER TABLE public.cpi_cache ENABLE ROW LEVEL SECURITY;

-- CPI is public, non-sensitive aggregate data: anyone can read the cache.
CREATE POLICY "Anyone can read CPI cache"
  ON public.cpi_cache
  FOR SELECT
  USING (true);

-- Only the service role (edge function) can write/refresh the cache.
CREATE POLICY "Service role can insert CPI cache"
  ON public.cpi_cache
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update CPI cache"
  ON public.cpi_cache
  FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Deny delete on cpi_cache"
  ON public.cpi_cache
  FOR DELETE
  USING (false);