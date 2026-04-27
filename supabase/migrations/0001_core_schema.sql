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

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text check (username is null or username ~ '^[A-Za-z0-9_]{3,24}$'),
  display_name text,
  avatar_url text,
  bio text,
  preferred_language text not null default 'ru',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_username_lower_unique
on public.profiles (lower(username))
where username is not null;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  current_rank_id text not null default 'rank_01',
  completed_missions_count integer not null default 0 check (completed_missions_count >= 0),
  completed_checkpoints_count integer not null default 0 check (completed_checkpoints_count >= 0),
  last_completed_mission_id text,
  last_completed_checkpoint_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_user_progress_updated_at
before update on public.user_progress
for each row execute function public.set_updated_at();

create table public.mission_catalog (
  mission_id text primary key,
  module_id text not null,
  module_order integer not null check (module_order > 0),
  mission_order integer not null check (mission_order > 0),
  passing_score integer not null check (passing_score between 0 and 100),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  implemented boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, mission_order)
);

create index mission_catalog_module_order_idx
on public.mission_catalog (module_order, mission_order);

create trigger set_mission_catalog_updated_at
before update on public.mission_catalog
for each row execute function public.set_updated_at();

create table public.checkpoint_catalog (
  checkpoint_id text primary key,
  order_index integer not null check (order_index > 0),
  after_module_id text,
  before_module_id text,
  passing_score integer not null default 70 check (passing_score between 0 and 100),
  xp_reward integer not null default 0 check (xp_reward >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_checkpoint_catalog_updated_at
before update on public.checkpoint_catalog
for each row execute function public.set_updated_at();

create table public.user_mission_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id text not null references public.mission_catalog(mission_id) on delete cascade,
  best_score integer not null default 0 check (best_score between 0 and 100),
  passed boolean not null default false,
  xp_awarded boolean not null default false,
  first_completed_at timestamptz,
  last_completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id)
);

create index user_mission_results_user_idx
on public.user_mission_results (user_id);

create index user_mission_results_user_passed_idx
on public.user_mission_results (user_id, passed);

create trigger set_user_mission_results_updated_at
before update on public.user_mission_results
for each row execute function public.set_updated_at();

create table public.user_checkpoint_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkpoint_id text not null references public.checkpoint_catalog(checkpoint_id) on delete cascade,
  best_score integer not null default 0 check (best_score between 0 and 100),
  passed boolean not null default false,
  xp_awarded boolean not null default false,
  first_completed_at timestamptz,
  last_completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkpoint_id)
);

create index user_checkpoint_results_user_idx
on public.user_checkpoint_results (user_id);

create trigger set_user_checkpoint_results_updated_at
before update on public.user_checkpoint_results
for each row execute function public.set_updated_at();

create table public.user_badges (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create index user_badges_user_idx
on public.user_badges (user_id);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null,
  module_id text,
  mission_id text,
  checkpoint_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index analytics_events_user_idx
on public.analytics_events (user_id);

create index analytics_events_type_idx
on public.analytics_events (event_type);

create index analytics_events_created_at_idx
on public.analytics_events (created_at);
