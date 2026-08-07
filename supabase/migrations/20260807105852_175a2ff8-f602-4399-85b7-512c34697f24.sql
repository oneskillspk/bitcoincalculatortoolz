-- Adding attachment_url to contact_submissions
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS attachment_url text;

-- Storage RLS Policies
-- Allow anyone to upload to the contact bucket
CREATE POLICY "Allow public uploads to contact_attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'contact_attachments');

-- Allow public to read if they have the link (since it's a public bucket)
CREATE POLICY "Allow public read of contact_attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'contact_attachments');
