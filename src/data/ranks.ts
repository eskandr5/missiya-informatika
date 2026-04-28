export interface Rank {
  id: string;
  name: string;
  en: string;
  minXP: number;
  icon: string;
  col: string;
}

export const RANKS: Rank[] = [
  { id: 'rank_01', name: 'Оператор-1', en: 'Operator-1', minXP: 0, icon: '◈', col: '#64748b' },
  { id: 'rank_02', name: 'Оператор-2', en: 'Operator-2', minXP: 150, icon: '⌘', col: '#3b82f6' },
  { id: 'rank_03', name: 'Аналитик', en: 'Analyst', minXP: 400, icon: '◆', col: '#8b5cf6' },
  { id: 'rank_04', name: 'Архивист', en: 'Archivist', minXP: 900, icon: '⬡', col: '#f59e0b' },
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

export function getRankById(rankId: string | null | undefined): Rank {
  return RANKS.find(rank => rank.id === rankId) ?? RANKS[0];
}
