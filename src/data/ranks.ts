export interface Rank {
  name: string;
  en: string;
  minXP: number;
  icon: string;
  col: string;
}

export const RANKS: Rank[] = [
  { name: 'Стажёр',     en: 'Trainee',    minXP: 0,   icon: '🎯', col: '#64748b' },
  { name: 'Оператор',   en: 'Operator',   minXP: 150, icon: '🖥️', col: '#3b82f6' },
  { name: 'Аналитик',   en: 'Analyst',    minXP: 400, icon: '📊', col: '#8b5cf6' },
  { name: 'Специалист', en: 'Specialist', minXP: 900, icon: '🏆', col: '#f59e0b' },
];

export function getRank(xp: number): Rank {
  let r = RANKS[0];
  for (const rk of RANKS) if (xp >= rk.minXP) r = rk;
  return r;
}

export function getNextRank(xp: number): Rank | null {
  for (const r of RANKS) if (xp < r.minXP) return r;
  return null;
}