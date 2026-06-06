
-- Fix 1: Set search_path on functions missing it
CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
 RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

-- Fix 2: Restrict SEO tables to service_role only (no app code uses them)
DROP POLICY IF EXISTS "Anyone can view content scores" ON public.content_scores;
CREATE POLICY "Service role can view content scores" ON public.content_scores FOR SELECT USING (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Anyone can view performance metrics" ON public.performance_metrics;
CREATE POLICY "Service role can view performance metrics" ON public.performance_metrics FOR SELECT USING (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Anyone can view SEO audits" ON public.seo_audits;
CREATE POLICY "Service role can view SEO audits" ON public.seo_audits FOR SELECT USING (auth.role() = 'service_role'::text);

DROP POLICY IF EXISTS "Anyone can view SEO issues" ON public.seo_issues;
CREATE POLICY "Service role can view SEO issues" ON public.seo_issues FOR SELECT USING (auth.role() = 'service_role'::text);

-- Fix 3: Add validation triggers for contact_submissions and newsletter_subscribers
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  -- Enforce length limits
  IF length(NEW.first_name) > 100 THEN
    RAISE EXCEPTION 'First name too long (max 100 characters)';
  END IF;
  IF length(NEW.last_name) > 100 THEN
    RAISE EXCEPTION 'Last name too long (max 100 characters)';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long (max 255 characters)';
  END IF;
  IF length(NEW.subject) > 200 THEN
    RAISE EXCEPTION 'Subject too long (max 200 characters)';
  END IF;
  IF length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Message too long (max 5000 characters)';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_contact_submission_trigger
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_contact_submission();

CREATE OR REPLACE FUNCTION public.validate_newsletter_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate email format
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  -- Enforce length limit
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long (max 255 characters)';
  END IF;
  -- Normalize
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_newsletter_email_trigger
  BEFORE INSERT ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_newsletter_email();
