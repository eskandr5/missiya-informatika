import { useState } from 'react';
import type { ErrorCorrectionData } from '../types/activity';

interface Props {
  data: ErrorCorrectionData;
  onComplete: (score: number) => void;
}

type UserAnswer = 'correct' | 'wrong';
interface ResultEntry { isRight: boolean }

export default function ErrorCorrectionActivity({ data, onComplete }: Props) {
  const { context, statements } = data;
  const [answers,   setAnswers]   = useState<Record<string, UserAnswer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results,   setResults]   = useState<Record<string, ResultEntry>>({});
  const allAnswered = Object.keys(answers).length === statements.length;

  const mark = (id: string, val: UserAnswer) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [id]: val }));
  };

  const submit = () => {
    let c = 0;
    const r: Record<string, ResultEntry> = {};
    statements.forEach(s => {
      const userSaysOk = answers[s.id] === 'correct';
      const isRight    = userSaysOk === s.isCorrect;
      r[s.id] = { isRight };
      if (isRight) c++;
    });
    const score = Math.round((c / statements.length) * 100);
    setResults(r);
    setSubmitted(true);
    setTimeout(() => onComplete(score), 3000);
  };

  return (
    <div>
      {context && <p className="text-slate-400 text-sm mb-4 px-1">{context}</p>}
      <div className="space-y-3 mb-4">
        {statements.map(stmt => {
          const ans     = answers[stmt.id];
          const res     = results[stmt.id];
          const correct = submitted && res?.isRight;
          const wrong   = submitted && res && !res.isRight;
          return (
            <div
              key={stmt.id}
              className="rounded-xl p-4 transition-all"
              style={{
                background: correct ? 'var(--success-soft)' : wrong ? 'var(--danger-soft)' : 'var(--surface-strong)',
                border: `1px solid ${correct ? 'var(--success-color)' : wrong ? 'var(--danger-color)' : 'var(--border-color)'}`,
              }}
            >
              <p className="text-slate-200 text-sm mb-3 leading-relaxed">«{stmt.text}»</p>
              <div className="flex gap-2 mb-2">
                {(['correct', 'wrong'] as UserAnswer[]).map(val => {
                  const label    = val === 'correct' ? '✓ Верно' : '✗ Ошибка';
                  const active   = ans === val;
                  const btnColor = val === 'correct' ? 'var(--success-color)' : 'var(--danger-color)';
                  return (
                    <button
                      key={val}
                      onClick={() => mark(stmt.id, val)}
                      disabled={submitted}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: active ? `${btnColor}20` : 'var(--surface-soft)',
                        border: `1px solid ${active ? btnColor : 'var(--border-color)'}`,
                        color: active ? btnColor : 'var(--text-muted)',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
                {submitted && (
                  correct
                    ? <span className="text-green-400 text-xs self-center font-bold ml-1">Правильно!</span>
                    : <span className="text-red-400 text-xs self-center font-bold ml-1">Неверно</span>
                )}
              </div>
              {submitted && (
                <div
                  className="text-xs text-slate-400 leading-relaxed mt-1 pt-2"
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  {!stmt.isCorrect && stmt.correction && (
                    <p className="text-amber-300 mb-1">
                      <strong>Правильно:</strong> «{stmt.correction}»
                    </p>
                  )}
                  <p>{stmt.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {allAnswered && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить ответы →</button>
      )}
    </div>
  );
}
