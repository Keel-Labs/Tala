create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null unique,
  provider text not null default 'lemon_squeezy',
  lifetime_saves_unlocked boolean not null default false,
  lemon_order_id text unique,
  lemon_order_identifier text,
  lemon_customer_id text,
  lemon_variant_id integer,
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists entitlements_user_id_idx on public.entitlements(user_id);

drop trigger if exists entitlements_set_updated_at on public.entitlements;
create trigger entitlements_set_updated_at
before update on public.entitlements
for each row
execute function public.set_updated_at();

alter table public.entitlements enable row level security;

drop policy if exists "Users can read their own entitlements" on public.entitlements;
create policy "Users can read their own entitlements"
on public.entitlements
for select
to authenticated
using (
  user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);
