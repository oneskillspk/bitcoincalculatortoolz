
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter_by_email(unsub_email text)
RETURNS TABLE (found boolean, was_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_was_active boolean;
BEGIN
  UPDATE public.newsletter_subscribers
     SET is_active = false,
         unsubscribed_at = COALESCE(unsubscribed_at, now())
   WHERE email = lower(trim(unsub_email))
  RETURNING (NOT (is_active = false AND unsubscribed_at < now() - interval '1 second'))
       INTO v_was_active;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, false;
  ELSE
    RETURN QUERY SELECT true, COALESCE(v_was_active, true);
  END IF;
END;
$$;
