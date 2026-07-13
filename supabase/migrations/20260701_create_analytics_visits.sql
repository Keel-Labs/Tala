create table if not exists public.analytics_visits (
  id bigint generated always as identity primary key,
  visitor_id text not null,
  session_id text not null,
  path text not null default '/',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists analytics_visits_created_at_idx
  on public.analytics_visits (created_at desc);

create index if not exists analytics_visits_visitor_id_idx
  on public.analytics_visits (visitor_id);

alter table public.analytics_visits enable row level security;

drop policy if exists "Anyone can insert analytics visits" on public.analytics_visits;
create policy "Anyone can insert analytics visits"
on public.analytics_visits
for insert
to anon, authenticated
with check (true);

revoke all on table public.analytics_visits from anon, authenticated;
grant insert on table public.analytics_visits to anon, authenticated;
grant usage, select on sequence public.analytics_visits_id_seq to anon, authenticated;

create or replace view public.analytics_summary as
with per_visitor as (
  select
    visitor_id,
    count(*) as visit_count
  from public.analytics_visits
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
from public.analytics_visits;

grant select on public.analytics_summary to anon, authenticated;
