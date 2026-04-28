import { useCallback, useEffect, useState } from 'react';
import type { Progress } from '../types/progress';
import type { BadgeDef } from '../types/content';
import { PROGRESS_INITIAL } from '../types/progress';
import { getFullProgressState } from '../services/progress';

const STORAGE_KEY = 'mss2_prog';

function load(): Progress {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s) as Partial<Progress>;
      return {
        ...PROGRESS_INITIAL,
        ...parsed,
        currentRank: parsed.currentRank ?? PROGRESS_INITIAL.currentRank,
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

interface UseProgressOptions {
  isAuthenticated?: boolean;
  isAuthLoading?: boolean;
}

export function useProgress(options: UseProgressOptions = {}) {
  const { isAuthenticated = false, isAuthLoading = false } = options;
  const [progress, setProgress] = useState<Progress>({ ...PROGRESS_INITIAL });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      setProgress(load());
      setIsLoading(false);
      return;
    }

    let ignore = false;
    setIsLoading(true);

    getFullProgressState()
      .then(nextProgress => {
        if (!ignore) setProgress(nextProgress);
      })
      .catch(error => {
        console.error('Failed to load Supabase progress', error);
        if (!ignore) setProgress({ ...PROGRESS_INITIAL });
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isAuthLoading]);

  /** Called only when score >= passingScore — enforced by App */
  const completeMission = useCallback(
    (missionId: string, score: number, xpReward: number, badge: BadgeDef | null) => {
      if (isAuthenticated) {
        console.warn('Mission completion is not connected to Supabase yet.');
        return;
      }

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
    [isAuthenticated],
  );

  const completeCheckpoint = useCallback(
    (checkpointId: string, score: number, xpReward: number) => {
      if (isAuthenticated) {
        console.warn('Checkpoint completion is not connected to Supabase yet.');
        return;
      }

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
    [isAuthenticated],
  );

  const reset = useCallback(() => {
    if (isAuthenticated) {
      console.warn('Authenticated progress reset is not connected to Supabase yet.');
      return;
    }

    const fresh: Progress = { ...PROGRESS_INITIAL };
    save(fresh);
    setProgress(fresh);
  }, [isAuthenticated]);

  return { progress, isLoading, completeMission, completeCheckpoint, reset };
}
