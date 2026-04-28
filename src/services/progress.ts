import { supabase } from '../lib/supabase';
import { PROGRESS_INITIAL, type Progress } from '../types/progress';

export interface UserProgressRow {
  xp: number;
  current_rank_id: string;
}

export interface MissionResultRow {
  mission_id: string;
  best_score: number;
  passed: boolean;
}

export interface CheckpointResultRow {
  checkpoint_id: string;
  best_score: number;
  passed: boolean;
}

export interface UserBadgeRow {
  badge_id: string;
}

export async function getMyProgress(): Promise<UserProgressRow | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('xp, current_rank_id')
    .maybeSingle<UserProgressRow>();

  if (error) throw error;
  return data;
}

export async function getMyMissionResults(): Promise<MissionResultRow[]> {
  const { data, error } = await supabase
    .from('user_mission_results')
    .select('mission_id, best_score, passed')
    .order('mission_id');

  if (error) throw error;
  return data ?? [];
}

export async function getMyCheckpointResults(): Promise<CheckpointResultRow[]> {
  const { data, error } = await supabase
    .from('user_checkpoint_results')
    .select('checkpoint_id, best_score, passed')
    .order('checkpoint_id');

  if (error) throw error;
  return data ?? [];
}

export async function getMyBadges(): Promise<UserBadgeRow[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .order('earned_at');

  if (error) throw error;
  return data ?? [];
}

export async function getFullProgressState(): Promise<Progress> {
  const [progressRow, missionRows, checkpointRows, badgeRows] = await Promise.all([
    getMyProgress(),
    getMyMissionResults(),
    getMyCheckpointResults(),
    getMyBadges(),
  ]);

  const missionScores = missionRows.reduce<Record<string, number>>((scores, row) => {
    scores[row.mission_id] = row.best_score;
    return scores;
  }, {});

  const checkpointScores = checkpointRows.reduce<Record<string, number>>((scores, row) => {
    scores[row.checkpoint_id] = row.best_score;
    return scores;
  }, {});

  return {
    ...PROGRESS_INITIAL,
    xp: progressRow?.xp ?? PROGRESS_INITIAL.xp,
    currentRank: progressRow?.current_rank_id ?? PROGRESS_INITIAL.currentRank,
    completedMissions: missionRows
      .filter(row => row.passed)
      .map(row => row.mission_id),
    completedCheckpoints: checkpointRows
      .filter(row => row.passed)
      .map(row => row.checkpoint_id),
    badges: badgeRows.map(row => row.badge_id),
    missionScores,
    checkpointScores,
  };
}
