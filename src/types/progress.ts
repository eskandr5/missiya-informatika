export interface Progress {
  xp: number;
  completedMissions: string[];
  completedCheckpoints: string[];
  badges: string[];
  missionScores: Record<string, number>;
  checkpointScores: Record<string, number>;
}

export const PROGRESS_INITIAL: Progress = {
  xp: 0,
  completedMissions: [],
  completedCheckpoints: [],
  badges: [],
  missionScores: {},
  checkpointScores: {},
};
