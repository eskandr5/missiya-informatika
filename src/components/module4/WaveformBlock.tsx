import type { MediaPreviewState } from '../../types/activity';

interface Props {
  state: MediaPreviewState;
}

const BARS = [20, 34, 52, 28, 66, 44, 72, 36, 60, 30, 48, 24];

export default function WaveformBlock({ state }: Props) {
  return (
    <svg className={`m4-waveform is-${state}`} viewBox="0 0 240 120" aria-hidden="true">
      {BARS.map((height, index) => {
        const color = state === 'error' && index % 3 === 0 ? '#ef4444' : '#38bdf8';
        const opacity = state === 'corrupted' && index % 4 === 0 ? 0.25 : 1;
        return (
          <rect
            key={index}
            x={index * 18 + 12}
            y={60 - height / 2}
            width="10"
            height={height}
            rx="5"
            fill={color}
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}
