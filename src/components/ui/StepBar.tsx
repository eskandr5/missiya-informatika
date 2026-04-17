interface Props {
  steps: string[];
  current: string;
}

export default function StepBar({ steps, current }: Props) {
  const currentIdx = steps.indexOf(current);
  return (
    <div className="flex gap-1.5 mt-3">
      {steps.map((s, i) => {
        const done   = i < currentIdx;
        const active = s === current;
        return (
          <div
            key={s}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '2px',
              background: done
                ? 'var(--accent-ring)'
                : active
                ? 'var(--accent)'
                : 'var(--border-strong)',
              transition: 'background .35s ease',
            }}
          />
        );
      })}
    </div>
  );
}
