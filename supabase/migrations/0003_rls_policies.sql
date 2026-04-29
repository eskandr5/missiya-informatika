-- 0003_rls_policies.sql
-- Enable and enforce Row Level Security policies for Mission: Informatics v1.

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.mission_catalog enable row level security;
alter table public.checkpoint_catalog enable row level security;
alter table public.user_mission_results enable row level security;
alter table public.user_checkpoint_results enable row level security;
alter table public.user_badges enable row level security;
alter table public.analytics_events enable row level security;

alter table public.profiles force row level security;
alter table public.user_progress force row level security;
alter table public.mission_catalog force row level security;
alter table public.checkpoint_catalog force row level security;
alter table public.user_mission_results force row level security;
alter table public.user_checkpoint_results force row level security;
alter table public.user_badges force row level security;
alter table public.analytics_events force row level security;

-- Prevent authenticated clients from changing protected profile system fields.
create or replace function public.prevent_profile_system_field_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.id is distinct from old.id then
    raise exception 'profiles.id cannot be changed';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'profiles.created_at cannot be changed';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_system_field_update on public.profiles;

create trigger prevent_profile_system_field_update
before update of id, created_at on public.profiles
for each row
execute function public.prevent_profile_system_field_update();

-- Drop existing policies so this file can be safely re-run manually.
drop policy if exists "Authenticated users can read mission catalog" on public.mission_catalog;
drop policy if exists "Authenticated users can read checkpoint catalog" on public.checkpoint_catalog;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Users can read own progress" on public.user_progress;

drop policy if exists "Users can read own mission results" on public.user_mission_results;
drop policy if exists "Users can read own checkpoint results" on public.user_checkpoint_results;
drop policy if exists "Users can read own badges" on public.user_badges;
drop policy if exists "Users can read own analytics events" on public.analytics_events;

-- Catalog tables are readable by authenticated users.
-- No insert/update/delete policies are created for browser clients.
create policy "Authenticated users can read mission catalog"
on public.mission_catalog
for select
to authenticated
using (true);

create policy "Authenticated users can read checkpoint catalog"
on public.checkpoint_catalog
for select
to authenticated
using (true);

-- Profiles:
-- Users can read and update only their own profile row.
-- Protected fields such as id and created_at are guarded by the trigger above.
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- User progress:
-- Users can read only their own progress.
-- No direct insert/update/delete policies are created.
create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Mission results:
-- Users can read only their own mission results.
-- Completion writes must go through Edge Functions/internal RPC.
create policy "Users can read own mission results"
on public.user_mission_results
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Checkpoint results:
-- Users can read only their own checkpoint results.
-- Completion writes must go through Edge Functions/internal RPC.
create policy "Users can read own checkpoint results"
on public.user_checkpoint_results
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Badges:
-- Users can read only their own badges.
-- Badge writes must go through Edge Functions/internal RPC.
create policy "Users can read own badges"
on public.user_badges
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Analytics:
-- Users can read only their own analytics events if needed.
-- No direct browser insert/update/delete policies are created.
create policy "Users can read own analytics events"
on public.analytics_events
for select
to authenticated
using ((select auth.uid()) = user_id);