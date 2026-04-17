import type { Module, Mission } from '../types/content';

export function isModuleUnlocked(
  mod: Module,
  completedMissions: string[],
  allModules: Module[],
): boolean {
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
  if (!isModuleUnlocked(mod, completedMissions, allModules)) return false;
  const idx = mod.missions.findIndex(m => m.id === mission.id);
  if (idx === 0) return true;
  return completedMissions.includes(mod.missions[idx - 1].id);
}