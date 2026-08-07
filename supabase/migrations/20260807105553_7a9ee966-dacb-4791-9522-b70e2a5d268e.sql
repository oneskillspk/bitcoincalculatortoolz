-- Fixing security linter issues

-- 1. Fix mutable search path for functions
ALTER FUNCTION public.subscribe_newsletter(text) SET search_path = public;
ALTER FUNCTION public.check_rate_limit(inet, int, interval) SET search_path = public;

-- 2. Add RLS policy for contact_submissions and newsletter_subscribers (if missing)
-- Since they are insert-only for anon, we don't necessarily need a SELECT policy, 
-- but RLS should be enabled.

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert contact submissions" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert newsletter subscribers" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can see if they are subscribed" ON public.newsletter_subscribers FOR SELECT TO anon, authenticated USING (email = LOWER(TRIM(current_setting('request.jwt.claims', true)::json->>'email')));

-- 3. The warnings about SECURITY DEFINER functions executable by public are expected for these specific features 
-- (contact form and newsletter subscription must be available to guests).
-- However, we'll ensure they are as safe as possible with the rate limiting we just added.
