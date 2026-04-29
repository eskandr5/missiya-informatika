import { useState } from 'react';
import type { MultipleChoiceData } from '../types/activity';

interface Props {
  data: MultipleChoiceData;
  onComplete: (score: number, answers?: Record<string, number>) => void;
}

const LETTERS = ['А', 'Б', 'В', 'Г', 'Д'];

export default function MultipleChoiceActivity({ data, onComplete }: Props) {
  const { questions } = data;
  const [answers, setAnswers]       = useState<Record<string, number>>({});
  const [submitted, setSubmitted]   = useState(false);
  const allDone = Object.keys(answers).length === questions.length;

  const submit = () => {
    let c = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct) c++; });
    const s = Math.round((c / questions.length) * 100);
    setSubmitted(true);
    setTimeout(() => onComplete(s, answers), 1600);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="card p-4" style={{ border: '1px solid var(--border-color)' }}>
          <p className="text-slate-200 font-semibold mb-3 text-sm">{qi + 1}. {q.q}</p>
          <div className="space-y-2">
            {q.opts.map((opt, oi) => {
              const chosen = answers[q.id] === oi;
              const isOk   = submitted && oi === q.correct;
              const isErr  = submitted && chosen && oi !== q.correct;
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: oi }))}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    background: isOk ? 'var(--success-soft)' : isErr ? 'var(--danger-soft)' : chosen ? 'var(--accent-soft)' : 'var(--surface-soft)',
                    border: `1px solid ${isOk ? 'var(--success-color)' : isErr ? 'var(--danger-color)' : chosen ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
                    color: isOk ? 'var(--success-text)' : isErr ? 'var(--danger-text)' : chosen ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: submitted ? 'default' : 'pointer',
                  }}
                >
                  <span className="mr-2 font-bold text-xs">{LETTERS[oi]}.</span>
                  {opt}
                  {isOk && ' ✓'}{isErr && ' ✗'}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {allDone && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить ответы →</button>
      )}
    </div>
  );
}
