alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.mission_catalog enable row level security;
alter table public.checkpoint_catalog enable row level security;
alter table public.user_mission_results enable row level security;
alter table public.user_checkpoint_results enable row level security;
alter table public.user_badges enable row level security;
alter table public.analytics_events enable row level security;

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

create trigger prevent_profile_system_field_update
before update on public.profiles
for each row execute function public.prevent_profile_system_field_update();

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

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read own mission results"
on public.user_mission_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read own checkpoint results"
on public.user_checkpoint_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read own badges"
on public.user_badges
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can read own analytics events"
on public.analytics_events
for select
to authenticated
using (auth.uid() = user_id);
