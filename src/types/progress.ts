export interface Progress {
  xp: number;
  currentRank: string;
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
  missionScores: Record<string, number>;
  checkpointScores: Record<string, number>;
}

export const PROGRESS_INITIAL: Progress = {
  xp: 0,
  currentRank: 'rank_01',
  completedMissions: [],
  completedCheckpoints: [],
  badges: [],
  missionScores: {},
  checkpointScores: {},
};
