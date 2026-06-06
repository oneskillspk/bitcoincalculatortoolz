
-- Fix 1: Replace broad SELECT policy on newsletter_subscribers with a SECURITY DEFINER function
-- This prevents email harvesting while still allowing duplicate checks

-- Drop the existing broad SELECT policy
DROP POLICY IF EXISTS "Anyone can check existing subscriptions" ON public.newsletter_subscribers;

-- Create a SECURITY DEFINER function to check if an email exists (returns only boolean + id/is_active for a specific email)
CREATE OR REPLACE FUNCTION public.check_newsletter_email(check_email TEXT)
RETURNS TABLE(id UUID, is_active BOOLEAN) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ns.id, ns.is_active 
  FROM public.newsletter_subscribers ns 
  WHERE ns.email = lower(trim(check_email))
  LIMIT 1;
$$;

-- Create a restrictive UPDATE policy so the reactivation logic works via the RPC/function
-- We need a policy that allows updating is_active for the specific subscriber
-- Since this is a public form (no auth), we use a restrictive approach via the SECURITY DEFINER function

-- Create rate_limits table for contact form rate limiting
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limits
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- No direct access policies needed - accessed only via SECURITY DEFINER functions

-- Create a function to check and record rate limits
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(client_identifier TEXT, max_requests INT DEFAULT 5, window_seconds INT DEFAULT 3600)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INT;
BEGIN
  -- Clean up old entries (older than window)
  DELETE FROM public.contact_rate_limits 
  WHERE created_at < now() - (window_seconds || ' seconds')::interval;
  
  -- Count recent requests
  SELECT COUNT(*) INTO recent_count 
  FROM public.contact_rate_limits 
  WHERE identifier = client_identifier 
    AND created_at > now() - (window_seconds || ' seconds')::interval;
  
  -- If under limit, record and allow
  IF recent_count < max_requests THEN
    INSERT INTO public.contact_rate_limits (identifier) VALUES (client_identifier);
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Create a SECURITY DEFINER function for newsletter reactivation
CREATE OR REPLACE FUNCTION public.reactivate_newsletter_subscriber(subscriber_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.newsletter_subscribers 
  SET is_active = true 
  WHERE id = subscriber_id;
$$;
