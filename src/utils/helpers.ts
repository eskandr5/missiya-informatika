export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Tailwind-style delay utility classes, index 0 = d1 … index 11 = d12 */
export const DL: string[] = [
  'd1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12',
];