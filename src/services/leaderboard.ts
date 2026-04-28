import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  current_rank_id: string;
  badges_count: number;
}

export async function getGlobalLeaderboard(limit = 100): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc('get_global_leaderboard', {
    limit_count: limit,
  });

  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}
