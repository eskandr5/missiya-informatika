import { useState, useCallback } from 'react';
import type { Progress } from '../types/progress';
import type { BadgeDef } from '../types/content';
import { PROGRESS_INITIAL } from '../types/progress';

const STORAGE_KEY = 'mss2_prog';

function load(): Progress {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s) as Partial<Progress>;
      return {
        ...PROGRESS_INITIAL,
        ...parsed,
        completedMissions: parsed.completedMissions ?? [],
        completedCheckpoints: parsed.completedCheckpoints ?? [],
        badges: parsed.badges ?? [],
        missionScores: parsed.missionScores ?? {},
        checkpointScores: parsed.checkpointScores ?? {},
      };
    }
  } catch { /* ignore */ }
  return { ...PROGRESS_INITIAL };
}

function save(p: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  /** Called only when score >= passingScore — enforced by App */
  const completeMission = useCallback(
    (missionId: string, score: number, xpReward: number, badge: BadgeDef | null) => {
      setProgress(prev => {
        const alreadyDone = prev.completedMissions.includes(missionId);
        const next: Progress = {
          ...prev,
          xp: alreadyDone ? prev.xp : prev.xp + xpReward,
          completedMissions: alreadyDone
            ? prev.completedMissions
            : [...prev.completedMissions, missionId],
          missionScores: {
            ...prev.missionScores,
            [missionId]: Math.max(prev.missionScores[missionId] ?? 0, score),
          },
          badges:
            badge && !prev.badges.includes(badge.id)
              ? [...prev.badges, badge.id]
              : prev.badges,
        };
        save(next);
        return next;
      });
    },
    [],
  );

  const completeCheckpoint = useCallback(
    (checkpointId: string, score: number, xpReward: number) => {
      setProgress(prev => {
        const alreadyDone = prev.completedCheckpoints.includes(checkpointId);
        const next: Progress = {
          ...prev,
          xp: alreadyDone ? prev.xp : prev.xp + xpReward,
          completedCheckpoints: alreadyDone
            ? prev.completedCheckpoints
            : [...prev.completedCheckpoints, checkpointId],
          checkpointScores: {
            ...prev.checkpointScores,
            [checkpointId]: Math.max(prev.checkpointScores[checkpointId] ?? 0, score),
          },
        };
        save(next);
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    const fresh: Progress = { ...PROGRESS_INITIAL };
    save(fresh);
    setProgress(fresh);
  }, []);

  return { progress, completeMission, completeCheckpoint, reset };
}
