-- Unique constraint so the nightly refresh can upsert on (slug, lang, segment)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'decisions_cache_slug_lang_segment_key'
  ) THEN
    ALTER TABLE public.decisions_cache
      ADD CONSTRAINT decisions_cache_slug_lang_segment_key UNIQUE (slug, lang, segment);
  END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;