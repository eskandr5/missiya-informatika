import { CHECKPOINTS } from '../data/checkpoints';
import type { Checkpoint, Module, Mission } from '../types/content';
import type { Progress } from '../types/progress';

// Temporary developer override for QA/review sessions.
// Set to false to restore normal progression gates.
const UNLOCK_ALL_FOR_TESTING = false;

export function getCheckpointAfterModule(moduleId: number): Checkpoint | undefined {
  return CHECKPOINTS.find(checkpoint => checkpoint.afterModuleId === moduleId);
}

export function getCheckpointBeforeModule(moduleId: number): Checkpoint | undefined {
  return CHECKPOINTS.find(checkpoint => checkpoint.beforeModuleId === moduleId);
}

export function isCheckpointUnlocked(
  checkpoint: Checkpoint,
  progress: Progress,
  allModules: Module[],
): boolean {
  if (UNLOCK_ALL_FOR_TESTING) return true;
  const prevModule = allModules.find(mod => mod.id === checkpoint.afterModuleId);
  if (!prevModule) return false;
  return prevModule.missions.every(mission => progress.completedMissions.includes(mission.id));
}

export function isCheckpointCompleted(checkpoint: Checkpoint, progress: Progress): boolean {
  return progress.completedCheckpoints.includes(checkpoint.id);
}

export function isModuleUnlocked(
  mod: Module,
  progress: Progress,
  allModules: Module[],
): boolean {
  if (UNLOCK_ALL_FOR_TESTING) return true;
  if (mod.id === 1) return true;
  const checkpointBefore = getCheckpointBeforeModule(mod.id);
  if (checkpointBefore) return isCheckpointCompleted(checkpointBefore, progress);
  const prev = allModules.find(m => m.id === mod.id - 1);
  if (!prev) return false;
  return prev.missions.every(m => progress.completedMissions.includes(m.id));
}

export function isMissionUnlocked(
  mission: Mission,
  mod: Module,
  progress: Progress,
  allModules: Module[],
): boolean {
  if (!isModuleUnlocked(mod, progress, allModules)) return false;
  const idx = mod.missions.findIndex(m => m.id === mission.id);
  if (idx === 0) return true;
  return progress.completedMissions.includes(mod.missions[idx - 1].id);
}
