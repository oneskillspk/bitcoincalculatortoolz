-- 1. Add click_id + variant_id to clicks; variant_id to impressions
ALTER TABLE public.clicks ADD COLUMN IF NOT EXISTS click_id uuid;
ALTER TABLE public.clicks ADD COLUMN IF NOT EXISTS variant_id text;
CREATE INDEX IF NOT EXISTS clicks_click_id_idx ON public.clicks(click_id);
CREATE INDEX IF NOT EXISTS clicks_variant_id_idx ON public.clicks(variant_id);

ALTER TABLE public.impressions ADD COLUMN IF NOT EXISTS variant_id text;

-- 2. Conversions table (S2S postback landing zone)
CREATE TABLE IF NOT EXISTS public.conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id uuid,
  partner text NOT NULL,
  external_tx_id text NOT NULL,
  payout_usd numeric(12,4) DEFAULT 0,
  currency text DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner, external_tx_id)
);
CREATE INDEX IF NOT EXISTS conversions_click_id_idx ON public.conversions(click_id);
CREATE INDEX IF NOT EXISTS conversions_partner_idx ON public.conversions(partner);
CREATE INDEX IF NOT EXISTS conversions_created_at_idx ON public.conversions(created_at DESC);

GRANT SELECT ON public.conversions TO authenticated;
GRANT ALL ON public.conversions TO service_role;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read conversions"
  ON public.conversions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Live EPC table (populated later by refresh job; readers fall back to static)
CREATE TABLE IF NOT EXISTS public.epc_live (
  affiliate_id text PRIMARY KEY,
  epc_usd numeric(10,4) NOT NULL,
  clicks_30d integer NOT NULL DEFAULT 0,
  conversions_30d integer NOT NULL DEFAULT 0,
  revenue_30d_usd numeric(12,4) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.epc_live TO authenticated, anon;
GRANT ALL ON public.epc_live TO service_role;
ALTER TABLE public.epc_live ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read epc_live"
  ON public.epc_live FOR SELECT
  TO authenticated, anon
  USING (true);