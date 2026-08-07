-- 1. Ensure public permissions (GRANTs) are present for contact_submissions
GRANT INSERT ON public.contact_submissions TO anon;
GRANT INSERT ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

-- 2. Ensure public permissions for newsletter_subscribers
GRANT SELECT, INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

-- 3. Create or replace the subscribe_newsletter RPC function
-- This ensures the frontend call to .rpc('subscribe_newsletter') works.
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(sub_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.newsletter_subscribers (email, is_active)
    VALUES (LOWER(TRIM(sub_email)), true)
    ON CONFLICT (email) 
    DO UPDATE SET is_active = true, subscribed_at = now();
END;
$$;

-- Grant execution to public roles
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT) TO authenticated;
