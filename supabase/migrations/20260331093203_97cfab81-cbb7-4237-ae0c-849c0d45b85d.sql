DELETE FROM public.suppressed_emails WHERE email = 'bitcoincalculatortoolkit@gmail.com';
UPDATE public.email_unsubscribe_tokens SET used_at = NULL WHERE email = 'bitcoincalculatortoolkit@gmail.com';