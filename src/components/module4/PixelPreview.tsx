import type { MediaPreviewState } from '../../types/activity';

interface Props {
  state: MediaPreviewState;
}

const PIXELS = [
  ['#a855f7', '#c084fc', '#f59e0b', '#fbbf24', '#8b5cf6', '#7c3aed'],
  ['#9333ea', '#d8b4fe', '#fcd34d', '#fde68a', '#a855f7', '#8b5cf6'],
  ['#7c3aed', '#a855f7', '#f59e0b', '#fbbf24', '#14b8a6', '#0ea5e9'],
  ['#6d28d9', '#9333ea', '#e879f9', '#c084fc', '#06b6d4', '#0284c7'],
  ['#7c3aed', '#a855f7', '#f472b6', '#f9a8d4', '#22c55e', '#14b8a6'],
  ['#8b5cf6', '#c084fc', '#f59e0b', '#facc15', '#38bdf8', '#0ea5e9'],
];

export default function PixelPreview({ state }: Props) {
  return (
    <svg className={`m4-pixel-preview is-${state}`} viewBox="0 0 120 120" aria-hidden="true">
      {PIXELS.flatMap((row, rowIndex) =>
        row.map((color, colIndex) => {
          const key = `${rowIndex}-${colIndex}`;
          const shouldFade = state === 'corrupted' && (rowIndex + colIndex) % 3 === 0;
          const shouldError = state === 'error' && (rowIndex + colIndex) % 4 === 0;
          return (
            <rect
              key={key}
              x={colIndex * 18 + 6}
              y={rowIndex * 18 + 6}
              width="16"
              height="16"
              rx="2"
              fill={shouldError ? '#ef4444' : color}
              opacity={shouldFade ? 0.28 : 1}
            />
          );
        }),
      )}
    </svg>
  );
}
