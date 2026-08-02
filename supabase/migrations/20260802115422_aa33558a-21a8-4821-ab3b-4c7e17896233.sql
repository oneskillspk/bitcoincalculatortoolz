CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.cron_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE private.cron_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cron_config FROM anon, authenticated;
GRANT ALL ON private.cron_config TO service_role;

INSERT INTO private.cron_config (key, value)
VALUES ('refresh_decisions_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

SELECT cron.unschedule(jobname) FROM cron.job WHERE jobname IN ('refresh-affiliate-decisions', 'aggregate-slot-stats');

SELECT cron.schedule(
  'refresh-affiliate-decisions',
  '17 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://fyquklzfhkeiybhdnccb.supabase.co/functions/v1/refresh-decisions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT value FROM private.cron_config WHERE key = 'refresh_decisions_secret')
    ),
    body := '{"source":"pg_cron"}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'aggregate-slot-stats',
  '7 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fyquklzfhkeiybhdnccb.supabase.co/functions/v1/aggregate-slot-stats',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{"source":"pg_cron"}'::jsonb
  );
  $$
);

DELETE FROM public.impressions WHERE segment = 'audit-probe';