alter table public.analytics_visits
add column if not exists site_host text;

update public.analytics_visits
set site_host = coalesce(nullif(site_host, ''), 'unknown')
where site_host is null or site_host = '';

alter table public.analytics_visits
alter column site_host set default 'unknown';

alter table public.analytics_visits
alter column site_host set not null;

create index if not exists analytics_visits_site_host_idx
  on public.analytics_visits (site_host);

create or replace view public.analytics_public_summary as
with public_visits as (
  select *
  from public.analytics_visits
  where site_host = 'tala.keel-labs.org'
),
per_visitor as (
  select
    visitor_id,
    count(*) as visit_count
  from public_visits
  group by visitor_id
)
select
  count(*)::bigint as total_visits,
  count(distinct visitor_id)::bigint as unique_visitors,
  count(*) filter (
    where created_at >= timezone('utc', now()) - interval '7 days'
  )::bigint as visits_last_7_days,
  count(distinct case
    when created_at >= timezone('utc', now()) - interval '7 days' then visitor_id
    else null
  end)::bigint as unique_visitors_last_7_days,
  coalesce((select count(*) from per_visitor where visit_count > 1), 0)::bigint as returning_visitors,
  max(created_at) as last_visit_at
from public_visits;

grant select on public.analytics_public_summary to anon, authenticated;
