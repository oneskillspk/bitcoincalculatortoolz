
-- Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- =========================
-- user_roles + has_role
-- =========================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- newsletter_subscribers
-- =========================
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);
GRANT SELECT, INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can check subscription" ON public.newsletter_subscribers
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage subscribers" ON public.newsletter_subscribers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.check_newsletter_email(check_email text)
RETURNS TABLE (id uuid, is_active boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, is_active FROM public.newsletter_subscribers
  WHERE email = lower(trim(check_email))
$$;

CREATE OR REPLACE FUNCTION public.reactivate_newsletter_subscriber(subscriber_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.newsletter_subscribers
  SET is_active = true, unsubscribed_at = NULL, subscribed_at = now()
  WHERE id = subscriber_id
$$;

-- =========================
-- contact_submissions
-- =========================
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read contact" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage contact" ON public.contact_submissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- affiliates
-- =========================
CREATE TABLE public.affiliates (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  tier integer NOT NULL DEFAULT 2,
  priority integer NOT NULL DEFAULT 5,
  enabled boolean NOT NULL DEFAULT true,
  url_en text,
  url_tr text,
  cta_short_en text,
  cta_short_tr text,
  cta_long_en text,
  cta_long_tr text,
  description_en text,
  description_tr text,
  badge_en text,
  badge_tr text,
  logo_color text,
  target_pages text[] NOT NULL DEFAULT '{}',
  target_results text[] NOT NULL DEFAULT '{}',
  language_restriction text[] NOT NULL DEFAULT '{}',
  commission_rate numeric,
  commission_currency text,
  cookie_days integer,
  conversion_intent text,
  creatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  creative_html text,
  default_format text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.affiliates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliates TO authenticated;
GRANT ALL ON public.affiliates TO service_role;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads enabled affiliates" ON public.affiliates
  FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Admins manage affiliates" ON public.affiliates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- affiliate_overrides
-- =========================
CREATE TABLE public.affiliate_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  lang text NOT NULL,
  forced_affiliate_id text,
  forced_zone text,
  hidden boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, lang)
);
GRANT SELECT ON public.affiliate_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_overrides TO authenticated;
GRANT ALL ON public.affiliate_overrides TO service_role;
ALTER TABLE public.affiliate_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads overrides" ON public.affiliate_overrides
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage overrides" ON public.affiliate_overrides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- impressions / clicks
-- =========================
CREATE TABLE public.impressions (
  id bigserial PRIMARY KEY,
  affiliate_id text NOT NULL,
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  ts timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impressions TO authenticated;
GRANT ALL ON public.impressions TO service_role;
ALTER TABLE public.impressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read impressions" ON public.impressions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.clicks (
  id bigserial PRIMARY KEY,
  affiliate_id text NOT NULL,
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  ts timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clicks TO authenticated;
GRANT ALL ON public.clicks TO service_role;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read clicks" ON public.clicks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================
-- decisions_cache
-- =========================
CREATE TABLE public.decisions_cache (
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  affiliate_ids text[] NOT NULL DEFAULT '{}',
  format text NOT NULL DEFAULT 'single-card',
  zone text NOT NULL DEFAULT 'post-result',
  delay_ms integer NOT NULL DEFAULT 800,
  cta_override text,
  reasoning text,
  generated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (slug, lang, segment)
);
GRANT SELECT ON public.decisions_cache TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.decisions_cache TO authenticated;
GRANT ALL ON public.decisions_cache TO service_role;
ALTER TABLE public.decisions_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads decisions" ON public.decisions_cache
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage decisions" ON public.decisions_cache
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
