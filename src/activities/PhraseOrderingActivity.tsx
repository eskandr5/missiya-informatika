import { useState } from 'react';
import type { PhraseOrderingData } from '../types/activity';
import type { Phrase } from '../types/content';
import { shuffle } from '../utils/helpers';

interface Props {
  data: PhraseOrderingData;
  phrases?: Phrase[];
  onComplete: (score: number) => void;
}

export default function PhraseOrderingActivity({ data, phrases = [], onComplete }: Props) {
  const [choices] = useState(() =>
    data.questions.reduce<Record<string, string[]>>((acc, question) => {
      acc[question.id] = shuffle([...question.chunks]);
      return acc;
    }, {}),
  );
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moveToAnswer = (questionId: string, chunk: string) => {
    if (submitted) return;

    setAnswers(current => {
      const selected = current[questionId] ?? [];
      const next = [...selected];
      next.push(chunk);
      return { ...current, [questionId]: next };
    });
  };

  const removeFromAnswer = (questionId: string, answerIndex: number) => {
    if (submitted) return;

    setAnswers(current => {
      const selected = current[questionId] ?? [];
      return {
        ...current,
        [questionId]: selected.filter((_, index) => index !== answerIndex),
      };
    });
  };

  const allDone = data.questions.every(question => (answers[question.id] ?? []).length === question.chunks.length);

  const submit = () => {
    let correct = 0;

    data.questions.forEach(question => {
      const attempt = answers[question.id] ?? [];
      if (question.chunks.every((chunk, index) => attempt[index] === chunk)) correct++;
    });

    const nextScore = Math.round((correct / data.questions.length) * 100);
    setScore(nextScore);
    setSubmitted(true);
    setTimeout(() => onComplete(nextScore), 1800);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Соберите короткие русские фразы из готовых частей. Это помогает закрепить выражения из миссии в игровом формате.
      </p>

      {data.questions.map((question, questionIndex) => {
        const selected = answers[question.id] ?? [];
        const remaining = [...choices[question.id]];
        const phrase = phrases[question.phraseIndex];

        selected.forEach(chunk => {
          const chunkIndex = remaining.indexOf(chunk);
          if (chunkIndex !== -1) remaining.splice(chunkIndex, 1);
        });

        const isCorrect = submitted && question.chunks.every((chunk, index) => selected[index] === chunk);
        const isWrong = submitted && !isCorrect;

        return (
          <div key={question.id} className="card p-4" style={{ border: '1px solid var(--border-color)' }}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-slate-200 font-semibold text-sm">{questionIndex + 1}. {question.prompt}</p>
                {phrase && <p className="text-slate-500 text-xs mt-0.5 italic">{phrase.en}</p>}
              </div>
              {submitted && (
                <span
                  className="tag"
                  style={{
                    background: isCorrect ? 'var(--success-soft)' : 'var(--danger-soft)',
                    color: isCorrect ? 'var(--success-text)' : 'var(--danger-text)',
                  }}
                >
                  {isCorrect ? 'Верно' : 'Есть ошибка'}
                </span>
              )}
            </div>

            <div
              className="rounded-xl px-4 py-3 mb-3"
              style={{
                background: isCorrect ? 'var(--success-soft)' : isWrong ? 'var(--warning-soft)' : 'var(--surface-strong)',
                border: `1px solid ${isCorrect ? 'var(--success-color)' : isWrong ? 'var(--warning-color)' : 'var(--border-color)'}`,
                minHeight: '4.5rem',
              }}
            >
              <div className="flex flex-wrap gap-2">
                {selected.length > 0 ? selected.map((chunk, index) => (
                  <button
                    key={`${question.id}-selected-${index}`}
                    onClick={() => removeFromAnswer(question.id, index)}
                    className="btn-s"
                    style={{ paddingInline: '.9rem', paddingBlock: '.5rem' }}
                  >
                    {chunk}
                  </button>
                )) : (
                  <p className="text-slate-500 text-sm">Добавьте части фразы сюда.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {remaining.map((chunk, index) => (
                <button
                  key={`${question.id}-choice-${index}`}
                  onClick={() => moveToAnswer(question.id, chunk)}
                  className="btn-g"
                  style={{ paddingInline: '.9rem', paddingBlock: '.5rem' }}
                >
                  {chunk}
                </button>
              ))}
            </div>

            {submitted && phrase && (
              <p className="text-slate-500 text-xs mt-3">
                Правильная фраза: <span className="text-slate-300">{phrase.ru}</span>
              </p>
            )}
          </div>
        );
      })}

      {allDone && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить фразы →</button>
      )}

      {submitted && (
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: score >= 70 ? 'var(--success-soft)' : 'var(--warning-soft)',
            border: `1px solid ${score >= 70 ? 'var(--success-color)' : 'var(--warning-color)'}`,
          }}
        >
          <div className="hf text-3xl font-bold mb-1" style={{ color: score >= 70 ? 'var(--success-text)' : 'var(--warning-text)' }}>
            {score}%
          </div>
          <p className="text-slate-400 text-sm">
            {score >= 70 ? 'Фразы собраны верно.' : 'Часть фраз пока не на своих местах.'} Переходим к результатам…
          </p>
        </div>
      )}
    </div>
  );
}
