-- Replace always-true WITH CHECK on public insert policies with basic validation
DROP POLICY IF EXISTS contact_public_insert ON public.contact_submissions;
CREATE POLICY contact_public_insert ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(first_name) BETWEEN 1 AND 100
    AND char_length(last_name) BETWEEN 1 AND 100
    AND char_length(subject) BETWEEN 1 AND 200
    AND char_length(message) BETWEEN 1 AND 5000
  );

DROP POLICY IF EXISTS newsletter_public_insert ON public.newsletter_subscribers;
CREATE POLICY newsletter_public_insert ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(email) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );