import { supabase } from '../lib/supabase';
import type { Progress } from '../types/progress';

export interface CompletionBadgeUnlocked {
  badgeId: string;
  moduleId: string;
}

export interface CompletionAttempt {
  missionId?: string;
  checkpointId?: string;
  score: number;
  passed: boolean;
  passingScore: number;
  xpAwarded: number;
  badgeAwarded?: string | null;
  badgeUnlocked?: CompletionBadgeUnlocked | null;
}

export interface CompletionProgressResponse extends Progress {
  badgeUnlocked?: CompletionBadgeUnlocked | null;
  attempt?: CompletionAttempt;
}

export class CompletionError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'CompletionError';
    this.status = status;
  }
}

async function getFunctionErrorMessage(error: unknown): Promise<string> {
  if (
    typeof error === 'object'
    && error !== null
    && 'context' in error
    && error.context instanceof Response
  ) {
    try {
      const body = await error.context.clone().json() as { error?: unknown };
      if (typeof body.error === 'string') return body.error;
    } catch {
      return error.context.statusText || 'Completion failed';
    }
  }

  return error instanceof Error ? error.message : 'Completion failed';
}

function getFunctionErrorStatus(error: unknown): number | undefined {
  if (
    typeof error === 'object'
    && error !== null
    && 'context' in error
    && error.context instanceof Response
  ) {
    return error.context.status;
  }

  return undefined;
}

export async function completeMission(params: {
  missionId: string;
  score: number;
  completionTime?: number;
  activityType?: string;
  attemptMeta?: Record<string, unknown>;
}): Promise<CompletionProgressResponse> {
  const { data, error } = await supabase.functions.invoke('complete-mission', {
    body: params,
  });

  if (error) {
    throw new CompletionError(
      await getFunctionErrorMessage(error),
      getFunctionErrorStatus(error),
    );
  }

  return data as CompletionProgressResponse;
}

export async function completeCheckpoint(params: {
  checkpointId: string;
  score: number;
  completionTime?: number;
  activityType?: string;
  attemptMeta?: Record<string, unknown>;
}): Promise<CompletionProgressResponse> {
  const { data, error } = await supabase.functions.invoke('complete-checkpoint', {
    body: params,
  });

  if (error) {
    throw new CompletionError(
      await getFunctionErrorMessage(error),
      getFunctionErrorStatus(error),
    );
  }

  return data as CompletionProgressResponse;
}
