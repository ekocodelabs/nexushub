-- Enable UUID generation for primary keys that use gen_random_uuid().
create extension if not exists pgcrypto;

-- One profile per Supabase Auth user. The profile stores app-specific identity
-- and role data that is not kept in the auth.users table.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('creator', 'member')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatically create a profile whenever Supabase Auth creates a user.
-- Creator signups also get a community, with a unique slug derived from the
-- community name and the first part of the user's UUID.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
  profile_role text;
  community_name text;
  community_slug text;
begin
  -- Member role is recorded from the member signup flow; creator is the default.
  profile_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'New member'
  );

  profile_role := case
    when new.raw_user_meta_data ->> 'role' = 'member' then 'member'
    else 'creator'
  end;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    profile_name,
    profile_role
  )
  on conflict (id) do nothing;

  if profile_role = 'creator' then
    community_name := nullif(
      trim(new.raw_user_meta_data ->> 'community_name'),
      ''
    );

    if community_name is not null then
      community_slug := btrim(
        regexp_replace(lower(community_name), '[^a-z0-9]+', '-', 'g'),
        '-'
      );

      if community_slug = '' then
        community_slug := 'community';
      end if;

      community_slug := community_slug || '-' || left(new.id::text, 8);

      insert into public.communities (slug, name, creator_id)
      values (community_slug, community_name, new.id)
      on conflict (slug) do nothing;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Install the new-user trigger. Dropping it first makes this script rerunnable.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for Auth users that existed before this trigger was added.
-- Existing accounts are assigned the creator role by this initial backfill.
insert into public.profiles (id, email, full_name, role)
select
  users.id,
  coalesce(users.email, ''),
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(users.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    'New member'
  ),
  'creator'
from auth.users as users
where users.email is not null
on conflict (id) do nothing;

-- Communities belong to a creator. The slug is the human-readable URL segment.
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Posts belong to one community and record the profile that authored each post.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  community_id uuid not null references public.communities(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tracks member access/subscription state for each community. A member can have
-- at most one subscription row per community.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  community_id uuid not null references public.communities(id) on delete cascade,
  plan text not null default 'pro' check (plan in ('pro', 'premium')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled', 'pending')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, community_id)
);

-- Stores each creator's platform plan subscription separately from member
-- subscriptions to individual communities.
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

-- Indexes speed up common feed and membership lookups.
create index if not exists posts_community_created_at_idx
  on public.posts (community_id, created_at desc);

create index if not exists subscriptions_member_idx
  on public.subscriptions (member_id);

create index if not exists subscriptions_community_idx
  on public.subscriptions (community_id);

-- Enable row-level security so table access is governed by policies below.
alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.posts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.creator_subscriptions enable row level security;

-- Signed-in users can read profile records; users can only create/update their
-- own profile row.
create policy "Profiles are viewable by authenticated users"
on public.profiles
for select
using (auth.role() = 'authenticated');

create policy "Users can insert their own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Communities are publicly readable. Only the owning creator can create or
-- update a community.
create policy "Anyone can view communities"
on public.communities
for select
using (true);

create policy "Creators can manage their communities"
on public.communities
for insert
with check (auth.uid() = creator_id);

create policy "Creators can update their communities"
on public.communities
for update
using (auth.uid() = creator_id)
with check (auth.uid() = creator_id);

-- Signed-in users can read posts. Remove older insert policies before adding
-- the current rule so creators and members both have permission to post.
create policy "Authenticated users can view posts in visible communities"
on public.posts
for select
using (auth.role() = 'authenticated');

drop policy if exists "Creators can create posts in their communities"
on public.posts;
drop policy if exists "Creators and members can create posts"
on public.posts;

create policy "Creators and members can create posts"
on public.posts
for insert
with check (
  -- The author must be the currently authenticated user.
  auth.uid() = author_id
  -- The author's profile must use an allowed application role.
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('creator', 'member')
  )
  -- Posts must target a real community.
  and exists (
    select 1 from public.communities c
    where c.id = community_id
  )
);

-- Authors may update only their own posts.
create policy "Creators can update their own posts"
on public.posts
for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Signed-in users can read subscription rows. Creators can create/update rows
-- only for subscriptions connected to one of their own communities.
create policy "Authenticated users can view subscriptions"
on public.subscriptions
for select
using (auth.role() = 'authenticated');

create policy "Creators can manage subscriptions for their communities"
on public.subscriptions
for insert
with check (
  exists (
    select 1
    from public.communities c
    where c.id = community_id and c.creator_id = auth.uid()
  )
);

create policy "Creators can update subscriptions for their communities"
on public.subscriptions
for update
using (
  exists (
    select 1
    from public.communities c
    where c.id = community_id and c.creator_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.communities c
    where c.id = community_id and c.creator_id = auth.uid()
  )
);

-- Creators can read only their own platform billing state. Writes are made by
-- the trusted Stripe webhook using the server-only Supabase service key.
drop policy if exists "Creators can view their platform subscription"
on public.creator_subscriptions;
create policy "Creators can view their platform subscription"
on public.creator_subscriptions
for select
using (auth.uid() = creator_id);

-- Keep updated_at current whenever a row is changed.
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach the timestamp trigger to each table with an updated_at column.
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

create trigger set_communities_updated_at
before update on public.communities
for each row execute procedure public.handle_updated_at();

create trigger set_posts_updated_at
before update on public.posts
for each row execute procedure public.handle_updated_at();

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute procedure public.handle_updated_at();

create trigger set_creator_subscriptions_updated_at
before update on public.creator_subscriptions
for each row execute procedure public.handle_updated_at();
