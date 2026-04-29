-- Phase 21 security hardening.
-- Keep RLS as the authorization layer, and also pin table/function grants so
-- browser roles only have the surface intentionally supported by the app.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (
    id,
    username,
    display_name,
    preferred_language
  )
  values (
    new.id,
    null,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      'Student'
    ),
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'preferred_language'), ''), 'ru')
  );

  insert into public.user_progress (
    user_id,
    xp,
    current_rank_id
  )
  values (
    new.id,
    0,
    'rank_01'
  );

  return new;
end;
$$;

create or replace function public.prevent_profile_system_field_update()
returns trigger
language plpgsql
set search_path = public, pg_temp
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

revoke all on function public.set_updated_at() from PUBLIC;
revoke all on function public.set_updated_at() from anon;
revoke all on function public.set_updated_at() from authenticated;

revoke all on function public.handle_new_user() from PUBLIC;
revoke all on function public.handle_new_user() from anon;
revoke all on function public.handle_new_user() from authenticated;

revoke all on function public.prevent_profile_system_field_update() from PUBLIC;
revoke all on function public.prevent_profile_system_field_update() from anon;
revoke all on function public.prevent_profile_system_field_update() from authenticated;

revoke all on table public.profiles from PUBLIC;
revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select on table public.profiles to authenticated;
grant update (
  username,
  display_name,
  avatar_url,
  bio,
  preferred_language
) on table public.profiles to authenticated;

revoke all on table public.user_progress from PUBLIC;
revoke all on table public.user_progress from anon;
revoke all on table public.user_progress from authenticated;
grant select on table public.user_progress to authenticated;

revoke all on table public.mission_catalog from PUBLIC;
revoke all on table public.mission_catalog from anon;
revoke all on table public.mission_catalog from authenticated;
grant select on table public.mission_catalog to authenticated;

revoke all on table public.checkpoint_catalog from PUBLIC;
revoke all on table public.checkpoint_catalog from anon;
revoke all on table public.checkpoint_catalog from authenticated;
grant select on table public.checkpoint_catalog to authenticated;

revoke all on table public.user_mission_results from PUBLIC;
revoke all on table public.user_mission_results from anon;
revoke all on table public.user_mission_results from authenticated;
grant select on table public.user_mission_results to authenticated;

revoke all on table public.user_checkpoint_results from PUBLIC;
revoke all on table public.user_checkpoint_results from anon;
revoke all on table public.user_checkpoint_results from authenticated;
grant select on table public.user_checkpoint_results to authenticated;

revoke all on table public.user_badges from PUBLIC;
revoke all on table public.user_badges from anon;
revoke all on table public.user_badges from authenticated;
grant select on table public.user_badges to authenticated;

revoke all on table public.analytics_events from PUBLIC;
revoke all on table public.analytics_events from anon;
revoke all on table public.analytics_events from authenticated;
grant select on table public.analytics_events to authenticated;

revoke all on table public.mission_validation from PUBLIC;
revoke all on table public.mission_validation from anon;
revoke all on table public.mission_validation from authenticated;

revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from PUBLIC;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_mission_internal(uuid, text, integer, jsonb) to service_role;

revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from PUBLIC;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) to service_role;

revoke all on function public.get_global_leaderboard(integer) from PUBLIC;
revoke all on function public.get_global_leaderboard(integer) from anon;
grant execute on function public.get_global_leaderboard(integer) to authenticated;
