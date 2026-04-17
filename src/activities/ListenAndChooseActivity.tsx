import { useState } from 'react';
import type { ListenAndChooseData, ListenAndChooseQuestion } from '../types/activity';
import { useRussianSpeech } from '../hooks/useRussianSpeech';
import AudioButton from '../components/ui/AudioButton';

interface Props {
  data: ListenAndChooseData;
  onComplete: (score: number) => void;
}

interface QuestionCardProps {
  question: ListenAndChooseQuestion;
  questionIndex: number;
  selectedChoice: number | undefined;
  submitted: boolean;
  onSelect: (choiceIndex: number) => void;
}

function ChooseQuestionCard({
  question,
  questionIndex,
  selectedChoice,
  submitted,
  onSelect,
}: QuestionCardProps) {
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(
    `listen-and-choose:${question.id}`,
    question.audioText,
  );

  return (
    <div
      className={`card p-4 listening-card${isPlaying ? ' is-speaking' : ''}`}
      style={{ border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-slate-200 font-semibold text-sm">
            {questionIndex + 1}. {question.prompt}
          </p>
          {question.helperText && (
            <p className="text-slate-500 text-xs mt-0.5">{question.helperText}</p>
          )}
        </div>
        <span
          className="tag"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          Аудио
        </span>
      </div>

      <div
        className="listening-audio-row mb-3"
        style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border-color)',
          borderRadius: '1rem',
          padding: '.9rem 1rem',
        }}
      >
        <div>
          <p className="text-slate-200 text-sm font-semibold">Прослушайте фразу</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {submitted ? question.audioText : 'Сначала опирайтесь на слух, а не на текст.'}
          </p>
        </div>
        <AudioButton
          isPlaying={isPlaying}
          isDisabled={!isSupported}
          label={question.audioText}
          onClick={togglePlayback}
        />
      </div>

      <div className="space-y-2">
        {question.choices.map((choice, choiceIndex) => {
          const chosen = selectedChoice === choiceIndex;
          const isCorrect = submitted && choiceIndex === question.correct;
          const isWrong = submitted && chosen && choiceIndex !== question.correct;

          return (
            <button
              key={`${question.id}-${choiceIndex}`}
              type="button"
              onClick={() => !submitted && onSelect(choiceIndex)}
              className="w-full text-left px-4 py-3 rounded-xl transition-all"
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
                cursor: submitted ? 'default' : 'pointer',
              }}
            >
              <span className="hf text-xs font-bold" style={{ minWidth: '1.5rem', display: 'inline-block' }}>
                {choiceIndex + 1}.
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {submitted && question.revealText && (
        <p className="text-slate-500 text-xs mt-3">
          Подсказка для закрепления: <span className="text-slate-300">{question.revealText}</span>
        </p>
      )}
    </div>
  );
}

export default function ListenAndChooseActivity({ data, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allDone = Object.keys(answers).length === data.questions.length;

  const submit = () => {
    let correct = 0;

    data.questions.forEach(question => {
      if (answers[question.id] === question.correct) correct++;
    });

    const nextScore = Math.round((correct / data.questions.length) * 100);
    setScore(nextScore);
    setSubmitted(true);
    setTimeout(() => onComplete(nextScore), 1600);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Слушайте короткие русские фразы и выбирайте правильный смысл. Текст открывается только после проверки, чтобы аудио было частью самого задания.
      </p>

      {data.questions.map((question, questionIndex) => (
        <ChooseQuestionCard
          key={question.id}
          question={question}
          questionIndex={questionIndex}
          selectedChoice={answers[question.id]}
          submitted={submitted}
          onSelect={(choiceIndex) => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))}
        />
      ))}

      {allDone && !submitted && (
        <button type="button" onClick={submit} className="btn-p w-full">
          Проверить, что удалось услышать →
        </button>
      )}

      {submitted && (
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: score >= 70 ? 'var(--success-soft)' : 'var(--warning-soft)',
            border: `1px solid ${score >= 70 ? 'var(--success-color)' : 'var(--warning-color)'}`,
          }}
        >
          <div
            className="hf text-3xl font-bold mb-1"
            style={{ color: score >= 70 ? 'var(--success-text)' : 'var(--warning-text)' }}
          >
            {score}%
          </div>
          <p className="text-slate-400 text-sm">
            {score >= 70
              ? 'Фразы распознаны уверенно.'
              : 'Есть смысл ещё раз прослушать фразы и сверить значения.'} Переходим к результатам…
          </p>
        </div>
      )}
    </div>
  );
}
