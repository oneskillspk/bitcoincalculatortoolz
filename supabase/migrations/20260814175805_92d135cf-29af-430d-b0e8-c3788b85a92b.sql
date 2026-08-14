
DROP POLICY IF EXISTS "Allow public read of contact_attachments" ON storage.objects;

CREATE POLICY "Admins can read contact_attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contact_attachments' AND has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow public uploads to contact_attachments" ON storage.objects;

CREATE POLICY "Public can upload contact attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'contact_attachments'
  AND (storage.foldername(name))[1] = 'contact'
  AND array_length(storage.foldername(name), 1) = 1
  AND lower(storage.extension(name)) IN ('pdf','jpg','jpeg','png','webp')
);

DROP POLICY IF EXISTS "Public can see if they are subscribed" ON public.newsletter_subscribers;
