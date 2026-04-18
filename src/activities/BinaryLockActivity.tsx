import { useEffect, useMemo, useState } from 'react';
import '../styles/module5.css';
import type { BinaryLockData } from '../types/activity';

interface Props {
  data: BinaryLockData;
  onComplete: (score: number) => void;
}

export default function BinaryLockActivity({ data, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState('Выберите правильный код, чтобы открыть следующий сегмент замка.');

  const currentPrompt = data.prompts[currentIndex];
  const isLastPrompt = currentIndex === data.prompts.length - 1;

  useEffect(() => {
    if (!currentPrompt) return;
    setSelectedChoice(null);
    setStatus('idle');
    setFeedbackText(currentPrompt.helperText ?? 'Выберите правильный код, чтобы открыть следующий сегмент замка.');
  }, [currentPrompt]);

  const filledSegments = useMemo(() => {
    return Array.from({ length: data.prompts.length }, (_, index) => {
      if (index < correctAnswers) return 'open';
      if (index === currentIndex && status === 'correct') return 'open';
      if (index === currentIndex && status === 'wrong') return 'error';
      return 'closed';
    });
  }, [correctAnswers, currentIndex, data.prompts.length, status]);

  const finishStep = (nextCorrectAnswers: number) => {
    window.setTimeout(() => {
      if (isLastPrompt) {
        const score = Math.round((nextCorrectAnswers / data.prompts.length) * 100);
        onComplete(score);
        return;
      }

      setCurrentIndex(index => index + 1);
    }, 900);
  };

  const handleChoice = (choiceIndex: number) => {
    if (!currentPrompt || selectedChoice !== null) return;

    setSelectedChoice(choiceIndex);
    const isCorrect = choiceIndex === currentPrompt.correct;

    if (isCorrect) {
      const nextCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(nextCorrectAnswers);
      setStatus('correct');
      setFeedbackText(isLastPrompt ? 'Код принят. Замок открыт.' : 'Код принят. Один сегмент замка открыт.');
      finishStep(nextCorrectAnswers);
      return;
    }

    setStatus('wrong');
    setFeedbackText(isLastPrompt ? 'Последний код не подошёл. Проверьте ответы на экране результата.' : 'Код не подошёл. Переходим к следующему сегменту.');
    finishStep(correctAnswers);
  };

  if (!currentPrompt) return null;

  return (
    <div className="m5-lock">
      <div className={`m5-lock__panel is-${status === 'idle' ? 'neutral' : status}`}>
        <div className="m5-lock__head">
          <div>
            <p className="m5-lock__eyebrow">Финальный вызов</p>
            <h4 className="m5-lock__title">Бинарный замок</h4>
          </div>
          <div className="m5-lock__counter">{currentIndex + 1}/{data.prompts.length}</div>
        </div>

        <p className="m5-lock__intro">
          Откройте замок по шагам. Для каждого сегмента выберите правильный двоичный или десятичный ответ.
        </p>

        <div className="m5-lock__segments" aria-hidden="true">
          {filledSegments.map((segmentState, index) => (
            <div
              key={index}
              className={`m5-lock__segment is-${segmentState}`}
            >
              <span>{segmentState === 'open' ? '✓' : segmentState === 'error' ? '!' : index + 1}</span>
            </div>
          ))}
        </div>

        <div className="m5-lock__prompt card p-4">
          <p className="text-slate-200 font-semibold text-sm">{currentPrompt.prompt}</p>
        </div>
      </div>

      <div className="m5-lock__choices">
        {currentPrompt.choices.map((choice, index) => {
          const isChosen = selectedChoice === index;
          const isCorrect = selectedChoice !== null && index === currentPrompt.correct;
          const isWrong = selectedChoice === index && index !== currentPrompt.correct;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleChoice(index)}
              className="m5-lock__choice"
              style={{
                background: isCorrect
                  ? 'var(--success-soft)'
                  : isWrong
                    ? 'var(--danger-soft)'
                    : isChosen
                      ? 'var(--accent-soft)'
                      : 'var(--surface-soft)',
                border: `1px solid ${
                  isCorrect
                    ? 'var(--success-color)'
                    : isWrong
                      ? 'var(--danger-color)'
                      : isChosen
                        ? 'var(--accent-ring)'
                        : 'var(--border-strong)'
                }`,
                color: isCorrect
                  ? 'var(--success-text)'
                  : isWrong
                    ? 'var(--danger-text)'
                    : isChosen
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
              }}
            >
              <span className="m5-lock__choice-mark">
                {String.fromCharCode(1040 + index)}
              </span>
              <span>{choice}</span>
              {isCorrect && <span className="m5-lock__choice-result">✓</span>}
              {isWrong && <span className="m5-lock__choice-result">✗</span>}
            </button>
          );
        })}
      </div>

      <div className={`m5-lock__feedback is-${status === 'idle' ? 'neutral' : status}`}>
        <span className="m5-lock__feedback-mark">
          {status === 'correct' ? '✓' : status === 'wrong' ? '!' : '•'}
        </span>
        <span>{feedbackText}</span>
      </div>

      <div className="m5-lock__progress-row">
        <div className="m5-lock__progress-copy">
          Открыто сегментов: {correctAnswers}/{data.prompts.length}
        </div>
        <div style={{ flex: 1 }}>
          <div className="pb">
            <div
              className="pb-fill"
              style={{
                width: `${((currentIndex + (selectedChoice !== null ? 1 : 0)) / data.prompts.length) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
