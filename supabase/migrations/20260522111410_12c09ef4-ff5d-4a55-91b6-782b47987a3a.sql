
-- ============================================================
-- 1. ROLES (separate table, security-definer function)
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE POLICY "user_roles_self_read" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_admin_read" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_write" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 2. NEWSLETTER (restore)
-- ============================================================
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_public_insert" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.check_newsletter_email(check_email text)
RETURNS TABLE (id uuid, is_active boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id, is_active FROM public.newsletter_subscribers
  WHERE email = lower(trim(check_email));
$$;

CREATE OR REPLACE FUNCTION public.reactivate_newsletter_subscriber(subscriber_id uuid)
RETURNS void
LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public
AS $$
  UPDATE public.newsletter_subscribers
  SET is_active = true, unsubscribed_at = NULL, subscribed_at = now()
  WHERE id = subscriber_id;
$$;

-- ============================================================
-- 3. CONTACT SUBMISSIONS (restore)
-- ============================================================
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_public_insert" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "contact_admin_read" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. AFFILIATE AI — registry
-- ============================================================
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
  conversion_intent text,
  commission_rate numeric,
  commission_currency text,
  cookie_days integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "affiliates_public_read" ON public.affiliates
  FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "affiliates_admin_all" ON public.affiliates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 5. AFFILIATE AI — decisions cache
-- ============================================================
CREATE TABLE public.decisions_cache (
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  affiliate_ids text[] NOT NULL DEFAULT '{}',
  format text NOT NULL DEFAULT 'two-card-strip',
  zone text NOT NULL DEFAULT 'post-result',
  delay_ms integer NOT NULL DEFAULT 800,
  cta_override text,
  reasoning text,
  generated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (slug, lang, segment)
);
ALTER TABLE public.decisions_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "decisions_public_read" ON public.decisions_cache
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "decisions_admin_write" ON public.decisions_cache
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 6. AFFILIATE AI — impressions & clicks
-- ============================================================
CREATE TABLE public.impressions (
  id bigserial PRIMARY KEY,
  affiliate_id text NOT NULL,
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  ts timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.impressions ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_impressions_lookup ON public.impressions (slug, lang, affiliate_id, ts DESC);

CREATE POLICY "impressions_admin_read" ON public.impressions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- No public insert policy: only the service-role edge function can write.

CREATE TABLE public.clicks (
  id bigserial PRIMARY KEY,
  affiliate_id text NOT NULL,
  slug text NOT NULL,
  lang text NOT NULL,
  segment text NOT NULL DEFAULT 'default',
  ts timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_clicks_lookup ON public.clicks (slug, lang, affiliate_id, ts DESC);

CREATE POLICY "clicks_admin_read" ON public.clicks
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 7. AFFILIATE AI — manual overrides
-- ============================================================
CREATE TABLE public.affiliate_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  lang text NOT NULL,
  forced_affiliate_id text,
  forced_zone text,
  hidden boolean NOT NULL DEFAULT false,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (slug, lang)
);
ALTER TABLE public.affiliate_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "overrides_public_read" ON public.affiliate_overrides
  FOR SELECT TO anon, authenticated
  USING (expires_at IS NULL OR expires_at > now());
CREATE POLICY "overrides_admin_all" ON public.affiliate_overrides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
