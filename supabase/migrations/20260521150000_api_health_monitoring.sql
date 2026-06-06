-- Phase 1: API uptime monitoring

-- 1. Log table
create table if not exists public.api_health_log (
  id bigserial primary key,
  endpoint_id text not null,
  endpoint_url text not null,
  status text not null check (status in ('ok','degraded','down','timeout','error')),
  http_status int,
  latency_ms int,
  error text,
  checked_at timestamptz not null default now()
);

create index if not exists api_health_log_endpoint_time_idx
  on public.api_health_log (endpoint_id, checked_at desc);
create index if not exists api_health_log_checked_at_idx
  on public.api_health_log (checked_at desc);

alter table public.api_health_log enable row level security;

-- Public read for the status page (no sensitive data: only endpoint id, status, latency).
drop policy if exists "Public can read api health" on public.api_health_log;
create policy "Public can read api health"
  on public.api_health_log
  for select
  using (true);

-- Writes happen only via the edge function using service role; no insert policy needed.

-- 2. Retention: keep 14 days
create or replace function public.prune_api_health_log()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.api_health_log
  where checked_at < now() - interval '14 days';
$$;

-- 3. Schedule via pg_cron + pg_net
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove prior schedule if present (idempotent)
do $$
declare jid bigint;
begin
  select jobid into jid from cron.job where jobname = 'check-api-health';
  if jid is not null then perform cron.unschedule(jid); end if;
  select jobid into jid from cron.job where jobname = 'prune-api-health-log';
  if jid is not null then perform cron.unschedule(jid); end if;
end $$;

select cron.schedule(
  'check-api-health',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://yrvovpakdxxymmvniuxr.supabase.co/functions/v1/check-api-health',
    headers := jsonb_build_object('Content-Type','application/json'),
    body := '{}'::jsonb
  );
  $$
);

select cron.schedule(
  'prune-api-health-log',
  '17 3 * * *',
  $$ select public.prune_api_health_log(); $$
);
