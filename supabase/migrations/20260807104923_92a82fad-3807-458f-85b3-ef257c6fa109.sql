-- Grant permissions for new function if needed (already granted in previous step, but ensuring standard)
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.subscribe_newsletter(TEXT) TO service_role;
