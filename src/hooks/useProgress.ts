import { useCallback, useEffect, useState } from 'react';
import type { Progress } from '../types/progress';
import type { BadgeDef } from '../types/content';
import { PROGRESS_INITIAL } from '../types/progress';
import { getFullProgressState } from '../services/progress';
import {
  completeCheckpoint as completeCheckpointRemote,
  completeMission as completeMissionRemote,
  type CompletionAttempt,
  type CompletionAnswerPayload,
  type CompletionBadgeUnlocked,
} from '../services/completion';

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

export interface CompleteStageResult {
  progress: Progress;
  attempt: {
    score: number;
    passed: boolean;
    xpAwarded: number;
  };
  badgeUnlocked: CompletionBadgeUnlocked | null;
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

  const hydrateServerProgress = useCallback((serverProgress: Progress): Progress => ({
    ...PROGRESS_INITIAL,
    ...serverProgress,
    completedMissions: serverProgress.completedMissions ?? [],
    completedCheckpoints: serverProgress.completedCheckpoints ?? [],
    badges: serverProgress.badges ?? [],
    missionScores: serverProgress.missionScores ?? {},
    checkpointScores: serverProgress.checkpointScores ?? {},
  }), []);

  /** Authenticated mission attempts are recorded by the Edge Function, including failed attempts. */
  const completeMission = useCallback(
    async (missionId: string, score: number, xpReward: number, badge: BadgeDef | null): Promise<CompleteStageResult> => {
      if (isAuthenticated) {
        const serverProgress = await completeMissionRemote({
          missionId,
          score,
        });

        const nextProgress = hydrateServerProgress(serverProgress);
        const attempt = serverProgress.attempt as CompletionAttempt | undefined;

        setProgress(nextProgress);

        return {
          progress: nextProgress,
          attempt: {
            score: attempt?.score ?? score,
            passed: attempt?.passed ?? false,
            xpAwarded: attempt?.xpAwarded ?? 0,
          },
          badgeUnlocked: serverProgress.badgeUnlocked ?? attempt?.badgeUnlocked ?? null,
        };
      }

      const alreadyDone = progress.completedMissions.includes(missionId);
      const xpAwarded = alreadyDone ? 0 : xpReward;
      const badgeUnlocked = badge && !progress.badges.includes(badge.id)
        ? { badgeId: badge.id, moduleId: '' }
        : null;
      const nextProgress: Progress = {
        ...progress,
        xp: progress.xp + xpAwarded,
        completedMissions: alreadyDone
          ? progress.completedMissions
          : [...progress.completedMissions, missionId],
        missionScores: {
          ...progress.missionScores,
          [missionId]: Math.max(progress.missionScores[missionId] ?? 0, score),
        },
        badges: badgeUnlocked
          ? [...progress.badges, badgeUnlocked.badgeId]
          : progress.badges,
      };

      save(nextProgress);
      setProgress(nextProgress);

      return {
        progress: nextProgress,
        attempt: {
          score,
          passed: true,
          xpAwarded,
        },
        badgeUnlocked,
      };
    },
    [hydrateServerProgress, isAuthenticated, progress],
  );

  const completeCheckpoint = useCallback(
    async (
      checkpointId: string,
      score: number,
      xpReward: number,
      answers?: CompletionAnswerPayload,
      activityType?: string,
    ): Promise<CompleteStageResult> => {
      if (isAuthenticated) {
        const serverProgress = await completeCheckpointRemote({
          checkpointId,
          score,
          answers,
          activityType,
        });

        const nextProgress = hydrateServerProgress(serverProgress);
        const attempt = serverProgress.attempt as CompletionAttempt | undefined;

        setProgress(nextProgress);

        return {
          progress: nextProgress,
          attempt: {
            score: attempt?.score ?? score,
            passed: attempt?.passed ?? false,
            xpAwarded: attempt?.xpAwarded ?? 0,
          },
          badgeUnlocked: null,
        };
      }

      const alreadyDone = progress.completedCheckpoints.includes(checkpointId);
      const xpAwarded = alreadyDone ? 0 : xpReward;
      const nextProgress: Progress = {
        ...progress,
        xp: progress.xp + xpAwarded,
        completedCheckpoints: alreadyDone
          ? progress.completedCheckpoints
          : [...progress.completedCheckpoints, checkpointId],
        checkpointScores: {
          ...progress.checkpointScores,
          [checkpointId]: Math.max(progress.checkpointScores[checkpointId] ?? 0, score),
        },
      };

      save(nextProgress);
      setProgress(nextProgress);

      return {
        progress: nextProgress,
        attempt: {
          score,
          passed: true,
          xpAwarded,
        },
        badgeUnlocked: null,
      };
    },
    [hydrateServerProgress, isAuthenticated, progress],
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
