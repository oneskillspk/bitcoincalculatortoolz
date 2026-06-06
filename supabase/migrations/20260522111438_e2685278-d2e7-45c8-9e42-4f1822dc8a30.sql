
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Newsletter helpers must remain callable from the public signup form (anon role).
-- These two warnings are accepted; documented in security memory.
REVOKE EXECUTE ON FUNCTION public.check_newsletter_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_newsletter_email(text) TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.reactivate_newsletter_subscriber(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reactivate_newsletter_subscriber(uuid) TO anon, authenticated;
