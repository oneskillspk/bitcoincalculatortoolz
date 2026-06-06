
-- Fix 1: Remove public SELECT on newsletter_subscribers (emails were publicly readable)
-- The check_newsletter_email RPC (SECURITY DEFINER) handles subscription checks safely.
DROP POLICY IF EXISTS "Anyone can check subscription" ON public.newsletter_subscribers;

-- Fix 2: Lock down SECURITY DEFINER function execution to only the roles that need them.
-- has_role is used internally by RLS policies; keep accessible to authenticated only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- check_newsletter_email + unsubscribe_newsletter_by_email need to be callable by anon (public newsletter UX)
REVOKE EXECUTE ON FUNCTION public.check_newsletter_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_newsletter_email(text) TO anon, authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.unsubscribe_newsletter_by_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter_by_email(text) TO anon, authenticated, service_role;

-- reactivate is called from the newsletter flow when re-subscribing (anon needs it too)
REVOKE EXECUTE ON FUNCTION public.reactivate_newsletter_subscriber(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reactivate_newsletter_subscriber(uuid) TO anon, authenticated, service_role;

-- Fix 3: Tighten the always-true INSERT policies with basic format validation
-- newsletter_subscribers: enforce a sane email shape on insert
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);

-- contact_submissions: enforce non-empty fields + email shape + length caps
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  first_name IS NOT NULL AND length(first_name) BETWEEN 1 AND 100
  AND last_name  IS NOT NULL AND length(last_name)  BETWEEN 1 AND 100
  AND email      IS NOT NULL AND length(email)      BETWEEN 5 AND 254
                  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND subject    IS NOT NULL AND length(subject)    BETWEEN 1 AND 200
  AND message    IS NOT NULL AND length(message)    BETWEEN 1 AND 5000
);
