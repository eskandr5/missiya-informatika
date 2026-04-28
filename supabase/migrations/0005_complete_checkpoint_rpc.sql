create or replace function public.complete_checkpoint_internal(
  p_user_id uuid,
  p_checkpoint_id text,
  p_score integer,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_checkpoint public.checkpoint_catalog%rowtype;
  v_progress public.user_progress%rowtype;
  v_existing_result public.user_checkpoint_results%rowtype;
  v_after_module_order integer;
  v_passed boolean;
  v_was_passed boolean;
  v_xp_awarded boolean;
  v_xp_delta integer := 0;
  v_next_xp integer;
  v_next_rank_id text;
  v_now timestamptz := now();
  v_result jsonb;
begin
  if p_user_id is null then
    raise exception 'Missing user id';
  end if;

  if p_checkpoint_id is null or length(trim(p_checkpoint_id)) = 0 then
    raise exception 'Missing checkpoint id';
  end if;

  if p_score is null or p_score < 0 or p_score > 100 then
    raise exception 'Invalid score';
  end if;

  select *
  into v_checkpoint
  from public.checkpoint_catalog
  where checkpoint_id = p_checkpoint_id;

  if not found then
    raise exception 'Checkpoint not found';
  end if;

  if v_checkpoint.after_module_id is null or length(trim(v_checkpoint.after_module_id)) = 0 then
    raise exception 'Checkpoint is not attached to a module';
  end if;

  select max(mission.module_order)
  into v_after_module_order
  from public.mission_catalog mission
  where mission.module_id = v_checkpoint.after_module_id;

  if v_after_module_order is null then
    raise exception 'Checkpoint module not found';
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

  -- A checkpoint unlocks only after every implemented mission up to
  -- checkpoint.after_module_id has been passed. Failed attempts do not count.
  if exists (
    select 1
    from public.mission_catalog mission
    where mission.implemented = true
      and mission.module_order <= v_after_module_order
      and not exists (
        select 1
        from public.user_mission_results result
        where result.user_id = p_user_id
          and result.mission_id = mission.mission_id
          and result.passed = true
      )
  ) then
    raise exception 'Checkpoint is locked';
  end if;

  v_passed := p_score >= v_checkpoint.passing_score;

  select *
  into v_existing_result
  from public.user_checkpoint_results
  where user_id = p_user_id
    and checkpoint_id = v_checkpoint.checkpoint_id
  for update;

  v_was_passed := coalesce(v_existing_result.passed, false);
  v_xp_awarded := coalesce(v_existing_result.xp_awarded, false);

  if v_passed and not v_xp_awarded then
    v_xp_delta := v_checkpoint.xp_reward;
    v_xp_awarded := true;
  end if;

  insert into public.user_checkpoint_results (
    user_id,
    checkpoint_id,
    best_score,
    passed,
    xp_awarded,
    first_completed_at,
    last_completed_at,
    attempt_count
  )
  values (
    p_user_id,
    v_checkpoint.checkpoint_id,
    p_score,
    v_passed,
    v_xp_awarded,
    case when v_passed then v_now else null end,
    case when v_passed then v_now else null end,
    1
  )
  on conflict (user_id, checkpoint_id) do update set
    best_score = greatest(public.user_checkpoint_results.best_score, excluded.best_score),
    passed = public.user_checkpoint_results.passed or excluded.passed,
    xp_awarded = public.user_checkpoint_results.xp_awarded or excluded.xp_awarded,
    first_completed_at = case
      when excluded.passed and public.user_checkpoint_results.first_completed_at is null
        then excluded.first_completed_at
      else public.user_checkpoint_results.first_completed_at
    end,
    last_completed_at = case
      when excluded.passed then excluded.last_completed_at
      else public.user_checkpoint_results.last_completed_at
    end,
    attempt_count = public.user_checkpoint_results.attempt_count + 1,
    updated_at = v_now;

  v_next_xp := v_progress.xp + v_xp_delta;
  v_next_rank_id := case
    when v_next_xp >= 900 then 'rank_04'
    when v_next_xp >= 400 then 'rank_03'
    when v_next_xp >= 150 then 'rank_02'
    else 'rank_01'
  end;

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
    last_completed_checkpoint_id = case
      when v_passed and not v_was_passed then v_checkpoint.checkpoint_id
      else last_completed_checkpoint_id
    end,
    updated_at = v_now
  where user_id = p_user_id;

  insert into public.analytics_events (
    user_id,
    event_type,
    checkpoint_id,
    metadata
  )
  values (
    p_user_id,
    case when v_passed then 'checkpoint_completed' else 'checkpoint_failed' end,
    v_checkpoint.checkpoint_id,
    jsonb_strip_nulls(jsonb_build_object(
      'score', p_score,
      'passed', v_passed,
      'xpEarned', v_xp_delta,
      'completionTime', case
        when jsonb_typeof(coalesce(p_metadata, '{}'::jsonb) -> 'completionTime') = 'number'
          then coalesce(p_metadata, '{}'::jsonb) -> 'completionTime'
        else null
      end,
      'activityType', case
        when jsonb_typeof(coalesce(p_metadata, '{}'::jsonb) -> 'activityType') = 'string'
          then coalesce(p_metadata, '{}'::jsonb) ->> 'activityType'
        else null
      end
    ))
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
      'checkpointId', v_checkpoint.checkpoint_id,
      'score', p_score,
      'passed', v_passed,
      'passingScore', v_checkpoint.passing_score,
      'xpAwarded', v_xp_delta
    )
  )
  into v_result
  from public.user_progress up
  where up.user_id = p_user_id;

  return v_result;
end;
$$;

revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from public;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from anon;
revoke all on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) from authenticated;
grant execute on function public.complete_checkpoint_internal(uuid, text, integer, jsonb) to service_role;

comment on function public.complete_checkpoint_internal(uuid, text, integer, jsonb)
is 'Internal service-role RPC for atomic checkpoint completion. Enforces checkpoint unlock rules from trusted catalog/result tables; not callable by anon or authenticated users.';
