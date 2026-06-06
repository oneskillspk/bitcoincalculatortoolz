
ALTER TABLE public.affiliates
  ADD COLUMN IF NOT EXISTS creatives jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS creative_html text,
  ADD COLUMN IF NOT EXISTS default_format text;
