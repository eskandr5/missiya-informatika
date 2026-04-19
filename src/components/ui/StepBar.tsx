interface Props {
  steps: string[];
  current: string;
}

export default function StepBar({ steps, current }: Props) {
  const currentIdx = steps.indexOf(current);

  return (
    <div className="step-bar" aria-hidden="true">
      {steps.map((step, index) => {
        const done = index < currentIdx;
        const active = step === current;

        return (
          <div
            key={step}
            className={`step-bar__segment${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}
          />
        );
      })}
    </div>
  );
}
