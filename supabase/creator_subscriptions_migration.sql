-- Apply this additive migration to an existing Supabase database to store
-- Pro/Premium membership tiers and creator subscriptions to platform plans.
alter table public.subscriptions
  add column if not exists plan text not null default 'pro'
  check (plan in ('pro', 'premium'));

create table if not exists public.creator_subscriptions (
  creator_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null check (plan in ('pro', 'premium')),
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Webhooks write using the service role; a signed-in creator may only read
-- their own subscription details.
alter table public.creator_subscriptions enable row level security;

drop policy if exists "Creators can view their platform subscription"
on public.creator_subscriptions;
create policy "Creators can view their platform subscription"
on public.creator_subscriptions
for select
to authenticated
using (auth.uid() = creator_id);

-- Keep the subscription's updated_at timestamp current after updates.
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_creator_subscriptions_updated_at
on public.creator_subscriptions;
create trigger set_creator_subscriptions_updated_at
before update on public.creator_subscriptions
for each row execute procedure public.handle_updated_at();
