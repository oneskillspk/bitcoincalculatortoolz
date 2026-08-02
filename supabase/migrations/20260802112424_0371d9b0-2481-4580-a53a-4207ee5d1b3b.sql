DROP FUNCTION IF EXISTS public.check_newsletter_email(text);
DROP FUNCTION IF EXISTS public.reactivate_newsletter_subscriber(uuid);

CREATE OR REPLACE FUNCTION public.subscribe_newsletter(sub_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized text := lower(trim(sub_email));
BEGIN
  IF normalized !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' OR length(normalized) > 255 THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  INSERT INTO public.newsletter_subscribers (email)
  VALUES (normalized)
  ON CONFLICT (email) DO UPDATE
    SET is_active = true,
        unsubscribed_at = NULL,
        subscribed_at = CASE WHEN public.newsletter_subscribers.is_active THEN public.newsletter_subscribers.subscribed_at ELSE now() END;
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_newsletter(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(text) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.unsubscribe_newsletter_by_email(text);
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter_by_email(unsub_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized text := lower(trim(unsub_email));
BEGIN
  UPDATE public.newsletter_subscribers
     SET is_active = false,
         unsubscribed_at = now()
   WHERE email = normalized
     AND is_active = true;
END;
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_newsletter_by_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter_by_email(text) TO anon, authenticated, service_role;