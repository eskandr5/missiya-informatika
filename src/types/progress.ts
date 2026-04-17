export interface Progress {
  xp: number;
  completedMissions: string[];
  badges: string[];
  missionScores: Record<string, number>;
}

export const PROGRESS_INITIAL: Progress = {
  xp: 0,
  completedMissions: [],
  badges: [],
  missionScores: {},
};