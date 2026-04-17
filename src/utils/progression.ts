import type { Module, Mission } from '../types/content';

// Temporary developer override for QA/review sessions.
// Set to false to restore normal progression gates.
const UNLOCK_ALL_FOR_TESTING = true;

export function isModuleUnlocked(
  mod: Module,
  completedMissions: string[],
  allModules: Module[],
): boolean {
  if (UNLOCK_ALL_FOR_TESTING) return true;
  if (mod.id === 1) return true;
  const prev = allModules.find(m => m.id === mod.id - 1);
  if (!prev) return false;
  return prev.missions.every(m => completedMissions.includes(m.id));
}

export function isMissionUnlocked(
  mission: Mission,
  mod: Module,
  completedMissions: string[],
  allModules: Module[],
): boolean {
  if (UNLOCK_ALL_FOR_TESTING) return true;
  if (!isModuleUnlocked(mod, completedMissions, allModules)) return false;
  const idx = mod.missions.findIndex(m => m.id === mission.id);
  if (idx === 0) return true;
  return completedMissions.includes(mod.missions[idx - 1].id);
}
