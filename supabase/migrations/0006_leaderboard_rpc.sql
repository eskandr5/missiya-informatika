create or replace function public.get_global_leaderboard(limit_count integer default 100)
returns table (
  user_id uuid,
  username text,
  display_name text,
  avatar_url text,
  xp integer,
  current_rank_id text,
  badges_count bigint
)
language sql
security definer
set search_path = public, pg_temp
as $$
  select
    up.user_id,
    p.username,
    p.display_name,
    p.avatar_url,
    up.xp,
    up.current_rank_id,
    coalesce(b.badges_count, 0::bigint) as badges_count
  from public.user_progress up
  join public.profiles p
    on p.id = up.user_id
  left join (
    select
      user_id,
      count(*)::bigint as badges_count
    from public.user_badges
    group by user_id
  ) b
    on b.user_id = up.user_id
  order by up.xp desc, up.updated_at asc
  limit least(greatest(coalesce(limit_count, 100), 1), 100);
$$;

revoke all on function public.get_global_leaderboard(integer) from PUBLIC;
revoke all on function public.get_global_leaderboard(integer) from anon;
revoke all on function public.get_global_leaderboard(integer) from authenticated;
grant execute on function public.get_global_leaderboard(integer) to authenticated;

comment on function public.get_global_leaderboard(integer)
is 'Authenticated-only safe leaderboard RPC. Returns public profile fields, XP, rank id, and aggregate badge count only; does not read auth.users or derive display names from email.';
