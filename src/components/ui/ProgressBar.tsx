interface Props {
  value: number;
  max: number;
  color?: string;
}

export default function ProgressBar({ value, max, color = 'var(--accent)' }: Props) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className="pb">
      <div
        className="pb-fill"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color})`,
        }}
      />
    </div>
  );
}
