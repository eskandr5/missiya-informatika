import { useEffect, useMemo, useState } from 'react';
import '../styles/module4.css';
import type { MediaPreviewState, MediaPropertyCheckData } from '../types/activity';
import FormatTile from '../components/module4/FormatTile';
import MediaFileCard from '../components/module4/MediaFileCard';
import MediaPreviewPanel from '../components/module4/MediaPreviewPanel';

interface Props {
  data: MediaPropertyCheckData;
  onComplete: (score: number) => void;
}

type TileState = 'idle' | 'selected' | 'correct' | 'wrong';

export default function MediaPropertyCheckActivity({ data, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<MediaPreviewState>('neutral');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedbackText, setFeedbackText] = useState('Посмотрите на файл и выберите верное свойство.');

  const currentPrompt = data.prompts[currentIndex];
  const isLastPrompt = currentIndex === data.prompts.length - 1;
  const isAnswered = selectedChoiceId !== null;

  useEffect(() => {
    if (!currentPrompt) return;
    setSelectedChoiceId(null);
    setPreviewState('neutral');
    setFeedbackText(currentPrompt.helperText ?? 'Посмотрите на файл и выберите верное свойство.');
  }, [currentPrompt]);

  const finishStep = (nextCorrectCount: number) => {
    window.setTimeout(() => {
      if (isLastPrompt) {
        const score = Math.round((nextCorrectCount / data.prompts.length) * 100);
        onComplete(score);
        return;
      }

      setCurrentIndex(index => index + 1);
    }, 950);
  };

  const handleChoice = (choiceId: string) => {
    if (!currentPrompt || isAnswered) return;

    setSelectedChoiceId(choiceId);
    const isCorrect = choiceId === currentPrompt.correctChoiceId;

    if (isCorrect) {
      const nextCorrectCount = correctAnswers + 1;
      setCorrectAnswers(nextCorrectCount);
      setPreviewState('restored');
      setFeedbackText(currentPrompt.successText ?? 'Верно. Свойство выбрано правильно.');
      finishStep(nextCorrectCount);
      return;
    }

    const correctChoice = currentPrompt.choices.find(choice => choice.id === currentPrompt.correctChoiceId);
    setPreviewState('error');
    setFeedbackText(`Неверно. Правильный ответ: ${correctChoice?.label ?? 'смотрите подсказку'}.`);
    finishStep(correctAnswers);
  };

  const tileState = useMemo(() => {
    return (choiceId: string): TileState => {
      if (!selectedChoiceId) return 'idle';
      if (choiceId === currentPrompt.correctChoiceId) return 'correct';
      if (choiceId === selectedChoiceId) return 'wrong';
      return 'idle';
    };
  }, [currentPrompt.correctChoiceId, selectedChoiceId]);

  if (!currentPrompt) return null;

  return (
    <div className="m4-activity">
      <p className="m4-activity__intro">
        Смотрите на файл и выбирайте свойство, которое подходит именно ему. Панель слева помогает быстро сравнить изображение, звук и таблицу.
      </p>

      <div className="m4-activity__layout">
        <MediaPreviewPanel
          item={currentPrompt.item}
          state={previewState}
          helperText={currentPrompt.prompt}
        />

        <div className="m4-activity__panel">
          <div className="m4-activity__panel-head">
            <div>
              <p className="m4-activity__eyebrow">Проверка</p>
              <h4 className="m4-activity__title">Выберите свойство файла</h4>
            </div>
            <div className="m4-activity__counter">{currentIndex + 1}/{data.prompts.length}</div>
          </div>

          <div className="m4-activity__file-focus">
            <MediaFileCard item={currentPrompt.item} state="selected" />
          </div>

          <p className="m4-activity__hint">
            Ориентируйтесь на вид файла, формат и подписи на панели просмотра.
          </p>

          <div className="m4-format-grid">
            {currentPrompt.choices.map(choice => (
              <FormatTile
                key={choice.id}
                label={choice.label}
                state={tileState(choice.id)}
                onClick={() => handleChoice(choice.id)}
              />
            ))}
          </div>

          <div className={`m4-feedback m4-feedback--panel ${previewState === 'error' ? 'is-wrong' : previewState === 'restored' ? 'is-correct' : ''}`}>
            <span className="m4-feedback__mark">
              {previewState === 'error' ? '!' : previewState === 'restored' ? '✓' : '•'}
            </span>
            <span>{feedbackText}</span>
          </div>

          <div className="m4-activity__progress-row">
            <div className="m4-activity__progress-copy">
              Верных ответов: {correctAnswers}/{data.prompts.length}
            </div>
            <div style={{ flex: 1 }}>
              <div className="pb">
                <div
                  className="pb-fill"
                  style={{
                    width: `${((currentIndex + (selectedChoiceId ? 1 : 0)) / data.prompts.length) * 100}%`,
                    background: 'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 65%, #22c55e))',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
