-- Create a rate limiting table for public submissions
CREATE TABLE IF NOT EXISTS public.rate_limits (
    ip_address inet PRIMARY KEY,
    last_submission_at timestamptz DEFAULT now(),
    submission_count integer DEFAULT 1
);

GRANT SELECT, INSERT, UPDATE ON public.rate_limits TO anon, authenticated;
GRANT ALL ON public.rate_limits TO service_role;

-- Function to check and update rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(client_ip inet, max_requests int, window_interval interval)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    row_exists boolean;
    last_sub timestamptz;
    current_count int;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.rate_limits WHERE ip_address = client_ip) INTO row_exists;
    
    IF NOT row_exists THEN
        INSERT INTO public.rate_limits (ip_address, last_submission_at, submission_count)
        VALUES (client_ip, now(), 1);
        RETURN true;
    END IF;

    SELECT last_submission_at, submission_count INTO last_sub, current_count
    FROM public.rate_limits
    WHERE ip_address = client_ip;

    IF (now() - last_sub) > window_interval THEN
        UPDATE public.rate_limits
        SET last_submission_at = now(), submission_count = 1
        WHERE ip_address = client_ip;
        RETURN true;
    ELSIF current_count < max_requests THEN
        UPDATE public.rate_limits
        SET submission_count = submission_count + 1
        WHERE ip_address = client_ip;
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_rate_limit(inet, int, interval) TO anon, authenticated;
