import { useEffect, useMemo, useState } from 'react';
import {
  HiOutlineCalculator,
  HiOutlineCheckCircle,
  HiOutlineSquares2X2,
  HiOutlineViewColumns,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import type { NumberMissionData } from '../types/activity';

interface Props {
  data: NumberMissionData;
  onComplete: (score: number) => void;
}

const LETTERS = ['А', 'Б', 'В', 'Г'];

export default function NumberMissionActivity({ data, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [feedbackText, setFeedbackText] = useState(
    data.intro ?? 'Выполните текущий шаг и выберите один правильный ответ.',
  );

  const currentPrompt = data.prompts[currentIndex];
  const isLastPrompt = currentIndex === data.prompts.length - 1;

  useEffect(() => {
    if (!currentPrompt) return;
    setSelectedChoice(null);
    setStatus('idle');
    setFeedbackText(
      currentPrompt.helperText ?? data.intro ?? 'Выполните текущий шаг и выберите один правильный ответ.',
    );
  }, [currentPrompt, data.intro]);

  const stepStates = useMemo(() => {
    return Array.from({ length: data.prompts.length }, (_, index) => {
      if (index < correctAnswers) return 'done';
      if (index === currentIndex && status === 'wrong') return 'wrong';
      if (index === currentIndex) return 'current';
      return 'pending';
    });
  }, [correctAnswers, currentIndex, data.prompts.length, status]);

  const finishStep = (nextCorrectAnswers: number, nextFeedbackText: string) => {
    window.setTimeout(() => {
      if (isLastPrompt) {
        setFeedbackText(data.completeText ?? nextFeedbackText);
        const score = Math.round((nextCorrectAnswers / data.prompts.length) * 100);
        onComplete(score);
        return;
      }

      setCurrentIndex(index => index + 1);
    }, 950);
  };

  const handleChoice = (choiceIndex: number) => {
    if (!currentPrompt || selectedChoice !== null) return;

    setSelectedChoice(choiceIndex);
    const isCorrect = choiceIndex === currentPrompt.correct;

    if (isCorrect) {
      const nextCorrectAnswers = correctAnswers + 1;
      const nextFeedbackText = currentPrompt.successText ?? 'Верно. Переходим к следующему шагу.';
      setCorrectAnswers(nextCorrectAnswers);
      setStatus('correct');
      setFeedbackText(nextFeedbackText);
      finishStep(nextCorrectAnswers, nextFeedbackText);
      return;
    }

    const nextFeedbackText = `Неверно. Правильный ответ: ${currentPrompt.choices[currentPrompt.correct]}.`;
    setStatus('wrong');
    setFeedbackText(nextFeedbackText);
    finishStep(correctAnswers, nextFeedbackText);
  };

  if (!currentPrompt) return null;

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-5"
        style={{
          background:
            status === 'correct'
              ? 'var(--success-soft)'
              : status === 'wrong'
                ? 'var(--danger-soft)'
                : 'var(--surface-soft)',
          border: `1px solid ${
            status === 'correct'
              ? 'var(--success-color)'
              : status === 'wrong'
                ? 'var(--danger-color)'
                : 'var(--border-color)'
          }`,
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)' }}
            >
              <HiOutlineCalculator className="text-xl text-blue-300" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Финальная проверка</p>
              <h4 className="hf text-white font-bold text-lg">{data.title ?? 'Числовая миссия'}</h4>
              <p className="text-slate-500 text-sm mt-1">
                {data.intro ?? 'Короткая последовательность шагов по числам и системам счисления.'}
              </p>
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-400">
            {currentIndex + 1}/{data.prompts.length}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-hidden="true">
          {stepStates.map((stepState, index) => (
            <div
              key={data.prompts[index].id}
              className="rounded-xl px-3 py-2.5 text-sm"
              style={{
                background:
                  stepState === 'done'
                    ? 'var(--success-soft)'
                    : stepState === 'wrong'
                      ? 'var(--danger-soft)'
                      : stepState === 'current'
                        ? 'var(--accent-soft)'
                        : 'var(--surface-strong)',
                border: `1px solid ${
                  stepState === 'done'
                    ? 'var(--success-color)'
                    : stepState === 'wrong'
                      ? 'var(--danger-color)'
                      : stepState === 'current'
                        ? 'var(--accent-ring)'
                        : 'var(--border-color)'
                }`,
                color:
                  stepState === 'done'
                    ? 'var(--success-text)'
                    : stepState === 'wrong'
                      ? 'var(--danger-text)'
                      : stepState === 'current'
                        ? 'var(--accent)'
                        : 'var(--text-muted)',
              }}
            >
              <div className="flex items-center gap-2">
                {stepState === 'done' ? (
                  <HiOutlineCheckCircle aria-hidden="true" />
                ) : stepState === 'wrong' ? (
                  <HiOutlineXCircle aria-hidden="true" />
                ) : stepState === 'current' ? (
                  <HiOutlineViewColumns aria-hidden="true" />
                ) : (
                  <HiOutlineSquares2X2 aria-hidden="true" />
                )}
                <span className="font-semibold">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5" style={{ border: '1px solid var(--border-color)' }}>
        <div className="mb-3">
          <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {currentPrompt.stepLabel}
          </span>
        </div>
        <p className="text-slate-100 font-semibold text-base mb-4 leading-relaxed">{currentPrompt.prompt}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentPrompt.choices.map((choice, index) => {
            const chosen = selectedChoice === index;
            const isCorrect = selectedChoice !== null && index === currentPrompt.correct;
            const isWrong = selectedChoice === index && index !== currentPrompt.correct;

            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleChoice(index)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: isCorrect
                    ? 'var(--success-soft)'
                    : isWrong
                      ? 'var(--danger-soft)'
                      : chosen
                        ? 'var(--accent-soft)'
                        : 'var(--surface-soft)',
                  border: `1px solid ${
                    isCorrect
                      ? 'var(--success-color)'
                      : isWrong
                        ? 'var(--danger-color)'
                        : chosen
                          ? 'var(--accent-ring)'
                          : 'var(--border-strong)'
                  }`,
                  color: isCorrect
                    ? 'var(--success-text)'
                    : isWrong
                      ? 'var(--danger-text)'
                      : chosen
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                }}
              >
                <span className="mr-2 font-bold text-xs">{LETTERS[index] ?? `${index + 1}`}</span>
                {choice}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
        style={{
          background:
            status === 'correct'
              ? 'var(--success-soft)'
              : status === 'wrong'
                ? 'var(--danger-soft)'
                : 'var(--surface-strong)',
          border: `1px solid ${
            status === 'correct'
              ? 'var(--success-color)'
              : status === 'wrong'
                ? 'var(--danger-color)'
                : 'var(--border-color)'
          }`,
          color:
            status === 'correct'
              ? 'var(--success-text)'
              : status === 'wrong'
                ? 'var(--danger-text)'
                : 'var(--text-muted)',
        }}
      >
        {status === 'correct' ? (
          <HiOutlineCheckCircle className="text-base flex-shrink-0 mt-0.5" aria-hidden="true" />
        ) : status === 'wrong' ? (
          <HiOutlineXCircle className="text-base flex-shrink-0 mt-0.5" aria-hidden="true" />
        ) : (
          <HiOutlineViewColumns className="text-base flex-shrink-0 mt-0.5" aria-hidden="true" />
        )}
        <span>{feedbackText}</span>
      </div>

      <div className="flex items-center gap-3">
        <div style={{ flex: 1 }}>
          <div className="pb">
            <div
              className="pb-fill"
              style={{
                width: `${((currentIndex + (selectedChoice !== null ? 1 : 0)) / data.prompts.length) * 100}%`,
                background: 'linear-gradient(90deg, #f43f5e, #fb7185)',
              }}
            />
          </div>
        </div>
        <span className="text-sm text-slate-400">{correctAnswers}/{data.prompts.length}</span>
      </div>
    </div>
  );
}
