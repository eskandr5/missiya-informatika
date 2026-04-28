create or replace function public.complete_mission_internal(
  p_user_id uuid,
  p_mission_id text,
  p_score integer,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_mission public.mission_catalog%rowtype;
  v_progress public.user_progress%rowtype;
  v_existing_result public.user_mission_results%rowtype;
  v_previous_mission_id text;
  v_previous_module_id text;
  v_previous_module_order integer;
  v_checkpoint_id text;
  v_passed boolean;
  v_was_passed boolean;
  v_xp_awarded boolean;
  v_xp_delta integer := 0;
  v_next_xp integer;
  v_next_rank_id text;
  v_badge_id text;
  v_badge_awarded boolean := false;
  v_badge_insert_count integer := 0;
  v_now timestamptz := now();
  v_result jsonb;
begin
  if p_user_id is null then
    raise exception 'Missing user id';
  end if;

  if p_mission_id is null or length(trim(p_mission_id)) = 0 then
    raise exception 'Missing mission id';
  end if;

  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Invalid score';
  end if;

  select *
  into v_mission
  from public.mission_catalog
  where mission_id = p_mission_id;

  if not found then
    raise exception 'Mission not found';
  end if;

  if not v_mission.implemented then
    raise exception 'Mission is not implemented';
  end if;

  insert into public.user_progress (
    user_id,
    xp,
    current_rank_id
  )
  values (
    p_user_id,
    0,
    'rank_01'
  )
  on conflict (user_id) do nothing;

  select *
  into v_progress
  from public.user_progress
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'Progress row not found';
  end if;

  -- Backend unlock policy:
  -- 1. The first implemented mission in module_order 1 is open by default.
  -- 2. Later missions require the previous implemented mission in the same module.
  -- 3. The first implemented mission in a later module requires the previous module,
  --    plus any checkpoint between the modules, to be passed.
  -- This intentionally ignores frontend-only unlock helpers such as UNLOCK_ALL_FOR_TESTING.
  select previous_mission.mission_id
  into v_previous_mission_id
  from public.mission_catalog previous_mission
  where previous_mission.module_id = v_mission.module_id
    and previous_mission.implemented = true
    and previous_mission.mission_order < v_mission.mission_order
  order by previous_mission.mission_order desc
  limit 1;

  if v_previous_mission_id is not null then
    if not exists (
      select 1
      from public.user_mission_results previous_result
      where previous_result.user_id = p_user_id
        and previous_result.mission_id = v_previous_mission_id
        and previous_result.passed = true
    ) then
      raise exception 'Mission is locked';
    end if;
  elsif v_mission.module_order = 1 then
    null;
  else
    select max(previous_module.module_order)
    into v_previous_module_order
    from public.mission_catalog previous_module
    where previous_module.module_order < v_mission.module_order;

    if v_previous_module_order is null then
      raise exception 'Mission is locked';
    end if;

    select previous_module.module_id
    into v_previous_module_id
    from public.mission_catalog previous_module
    where previous_module.module_order = v_previous_module_order
    order by previous_module.module_id
    limit 1;

    if v_previous_module_id is null then
      raise exception 'Mission is locked';
    end if;

    if exists (
      select 1
      from public.mission_catalog previous_module_mission
      where previous_module_mission.module_id = v_previous_module_id
        and previous_module_mission.implemented = true
        and not exists (
          select 1
          from public.user_mission_results previous_module_result
          where previous_module_result.user_id = p_user_id
            and previous_module_result.mission_id = previous_module_mission.mission_id
            and previous_module_result.passed = true
        )
    ) then
      raise exception 'Mission is locked';
    end if;

    select checkpoint.checkpoint_id
    into v_checkpoint_id
    from public.checkpoint_catalog checkpoint
    where checkpoint.after_module_id = v_previous_module_id
      and checkpoint.before_module_id = v_mission.module_id
    order by checkpoint.order_index
    limit 1;

    if v_checkpoint_id is not null and not exists (
      select 1
      from public.user_checkpoint_results checkpoint_result
      where checkpoint_result.user_id = p_user_id
        and checkpoint_result.checkpoint_id = v_checkpoint_id
        and checkpoint_result.passed = true
    ) then
      raise exception 'Mission is locked';
    end if;
  end if;

  v_passed := p_score >= v_mission.passing_score;

  select *
  into v_existing_result
  from public.user_mission_results
  where user_id = p_user_id
    and mission_id = v_mission.mission_id
  for update;

  v_was_passed := coalesce(v_existing_result.passed, false);
  v_xp_awarded := coalesce(v_existing_result.xp_awarded, false);

  if v_passed and not v_xp_awarded then
    v_xp_delta := v_mission.xp_reward;
    v_xp_awarded := true;
  end if;

  insert into public.user_mission_results (
    user_id,
    mission_id,
    best_score,
    passed,
    xp_awarded,
    first_completed_at,
    last_completed_at,
    attempt_count
  )
  values (
    p_user_id,
    v_mission.mission_id,
    p_score,
    v_passed,
    v_xp_awarded,
    case when v_passed then v_now else null end,
    case when v_passed then v_now else null end,
    1
  )
  on conflict (user_id, mission_id) do update set
    best_score = greatest(public.user_mission_results.best_score, excluded.best_score),
    passed = public.user_mission_results.passed or excluded.passed,
    xp_awarded = public.user_mission_results.xp_awarded or excluded.xp_awarded,
    first_completed_at = case
      when excluded.passed and public.user_mission_results.first_completed_at is null
        then excluded.first_completed_at
      else public.user_mission_results.first_completed_at
    end,
    last_completed_at = case
      when excluded.passed then excluded.last_completed_at
      else public.user_mission_results.last_completed_at
    end,
    attempt_count = public.user_mission_results.attempt_count + 1,
    updated_at = v_now;

  v_next_xp := v_progress.xp + v_xp_delta;
  v_next_rank_id := case
    when v_next_xp >= 900 then 'rank_04'
    when v_next_xp >= 400 then 'rank_03'
    when v_next_xp >= 150 then 'rank_02'
    else 'rank_01'
  end;

  v_badge_id := 'module:' || v_mission.module_id || ':complete';

  if v_passed and not exists (
    select 1
    from public.mission_catalog module_mission
    where module_mission.module_id = v_mission.module_id
      and module_mission.implemented = true
      and not exists (
        select 1
        from public.user_mission_results module_result
        where module_result.user_id = p_user_id
          and module_result.mission_id = module_mission.mission_id
          and module_result.passed = true
      )
  ) then
    insert into public.user_badges (
      user_id,
      badge_id
    )
    values (
      p_user_id,
      v_badge_id
    )
    on conflict (user_id, badge_id) do nothing;

    get diagnostics v_badge_insert_count = row_count;
    v_badge_awarded := v_badge_insert_count > 0;
  end if;

  update public.user_progress
  set
    xp = v_next_xp,
    current_rank_id = v_next_rank_id,
    completed_missions_count = (
      select count(*)::integer
      from public.user_mission_results result
      where result.user_id = p_user_id
        and result.passed = true
    ),
    completed_checkpoints_count = (
      select count(*)::integer
      from public.user_checkpoint_results result
      where result.user_id = p_user_id
        and result.passed = true
    ),
    last_completed_mission_id = case
      when v_passed and not v_was_passed then v_mission.mission_id
      else last_completed_mission_id
    end,
    updated_at = v_now
  where user_id = p_user_id;

  insert into public.analytics_events (
    user_id,
    event_type,
    module_id,
    mission_id,
    metadata
  )
  values (
    p_user_id,
    'mission_attempt',
    v_mission.module_id,
    v_mission.mission_id,
    jsonb_build_object(
      'score', p_score,
      'passed', v_passed,
      'passingScore', v_mission.passing_score,
      'xpAwarded', v_xp_delta,
      'badgeAwarded', case when v_badge_awarded then v_badge_id else null end,
      'attempt', coalesce(p_metadata, '{}'::jsonb)
    )
  );

  select jsonb_build_object(
    'xp', up.xp,
    'currentRank', up.current_rank_id,
    'completedMissions', coalesce((
      select jsonb_agg(result.mission_id order by result.mission_id)
      from public.user_mission_results result
      where result.user_id = p_user_id
        and result.passed = true
    ), '[]'::jsonb),
    'completedCheckpoints', coalesce((
      select jsonb_agg(result.checkpoint_id order by result.checkpoint_id)
      from public.user_checkpoint_results result
      where result.user_id = p_user_id
        and result.passed = true
    ), '[]'::jsonb),
    'badges', coalesce((
      select jsonb_agg(badge.badge_id order by badge.earned_at, badge.badge_id)
      from public.user_badges badge
      where badge.user_id = p_user_id
    ), '[]'::jsonb),
    'missionScores', coalesce((
      select jsonb_object_agg(result.mission_id, result.best_score)
      from public.user_mission_results result
      where result.user_id = p_user_id
    ), '{}'::jsonb),
    'checkpointScores', coalesce((
      select jsonb_object_agg(result.checkpoint_id, result.best_score)
      from public.user_checkpoint_results result
      where result.user_id = p_user_id
    ), '{}'::jsonb),
    'attempt', jsonb_build_object(
      'missionId', v_mission.mission_id,
      'score', p_score,
      'passed', v_passed,
      'passingScore', v_mission.passing_score,
      'xpAwarded', v_xp_delta,
      'badgeAwarded', case when v_badge_awarded then v_badge_id else null end
    )
  )
  into v_result
  from public.user_progress up
  where up.user_id = p_user_id;

  return v_result;
end;
$$;

revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from public;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_mission_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_mission_internal(uuid, text, integer, jsonb) to service_role;

comment on function public.complete_mission_internal(uuid, text, integer, jsonb)
is 'Internal service-role RPC for atomic mission completion. Enforces backend unlock rules from mission_catalog, checkpoint_catalog, user_mission_results, and user_checkpoint_results; not callable by anon or authenticated users.';
