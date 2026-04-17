import { useState } from 'react';
import type { PhraseChoiceData } from '../types/activity';
import type { Phrase } from '../types/content';

interface Props {
  data: PhraseChoiceData;
  phrases?: Phrase[];
  onComplete: (score: number) => void;
}

export default function PhraseChoiceActivity({ data, phrases = [], onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allDone = Object.keys(answers).length === data.questions.length;

  const submit = () => {
    let correct = 0;

    data.questions.forEach(question => {
      const selectedOption = answers[question.id];
      if (question.optionIndexes[selectedOption] === question.phraseIndex) correct++;
    });

    const nextScore = Math.round((correct / data.questions.length) * 100);
    setScore(nextScore);
    setSubmitted(true);
    setTimeout(() => onComplete(nextScore), 1600);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Выберите фразу, которая лучше всего подходит к ситуации или переводу. Так полезные короткие выражения становятся частью самой миссии.
      </p>

      {data.questions.map((question, questionIndex) => {
        const targetPhrase = phrases[question.phraseIndex];
        const mode = question.mode ?? 'ru_to_en';

        return (
          <div key={question.id} className="card p-4" style={{ border: '1px solid var(--border-color)' }}>
            <p className="text-slate-200 font-semibold mb-1 text-sm">{questionIndex + 1}. {question.prompt}</p>
            {targetPhrase && (
              <p className="text-slate-500 text-xs mb-3 italic">
                {mode === 'ru_to_en' ? targetPhrase.ru : targetPhrase.en}
              </p>
            )}

            <div className="space-y-2">
              {question.optionIndexes.map((optionIndex, optionPosition) => {
                const phrase = phrases[optionIndex];
                const chosen = answers[question.id] === optionPosition;
                const isCorrect = submitted && optionIndex === question.phraseIndex;
                const isWrong = submitted && chosen && optionIndex !== question.phraseIndex;

                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    onClick={() => !submitted && setAnswers(current => ({ ...current, [question.id]: optionPosition }))}
                    className="w-full text-left px-4 py-3 rounded-xl transition-all"
                    style={{
                      background: isCorrect ? 'var(--success-soft)' : isWrong ? 'var(--danger-soft)' : chosen ? 'var(--accent-soft)' : 'var(--surface-soft)',
                      border: `1px solid ${isCorrect ? 'var(--success-color)' : isWrong ? 'var(--danger-color)' : chosen ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
                      color: isCorrect ? 'var(--success-text)' : isWrong ? 'var(--danger-text)' : chosen ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: submitted ? 'default' : 'pointer',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="hf text-xs font-bold" style={{ minWidth: '1.5rem' }}>
                        {optionPosition + 1}.
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{mode === 'ru_to_en' ? phrase?.en : phrase?.ru}</div>
                        <div className="text-xs mt-0.5 text-slate-500">{mode === 'ru_to_en' ? phrase?.ru : phrase?.en}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {allDone && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить выбор →</button>
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
            {score >= 70 ? 'Фразы распознаны верно.' : 'Стоит ещё раз сверить команды и переводы.'} Переходим к результатам…
          </p>
        </div>
      )}
    </div>
  );
}
