import { useEffect, useMemo, useState } from 'react';
import '../styles/module4.css';
import type { MediaFormat, MediaFormatSelectionData, MediaPreviewState } from '../types/activity';
import FormatTile from '../components/module4/FormatTile';
import MediaPreviewPanel from '../components/module4/MediaPreviewPanel';

interface Props {
  data: MediaFormatSelectionData;
  onComplete: (score: number) => void;
}

type TileState = 'idle' | 'selected' | 'correct' | 'wrong';

export default function MediaFormatSelectionActivity({ data, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<MediaFormat | null>(null);
  const [previewState, setPreviewState] = useState<MediaPreviewState>('corrupted');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedbackText, setFeedbackText] = useState('Посмотрите на файл и выберите подходящий формат.');

  const currentPrompt = data.prompts[currentIndex];
  const isLastPrompt = currentIndex === data.prompts.length - 1;
  const isAnswered = selectedFormat !== null;

  useEffect(() => {
    if (!currentPrompt) return;
    setSelectedFormat(null);
    setPreviewState('corrupted');
    setFeedbackText(currentPrompt.helperText ?? 'Посмотрите на файл и выберите подходящий формат.');
  }, [currentPrompt]);

  const finishStep = (nextCorrectCount: number) => {
    window.setTimeout(() => {
      if (isLastPrompt) {
        const score = Math.round((nextCorrectCount / data.prompts.length) * 100);
        onComplete(score);
        return;
      }
      setCurrentIndex(index => index + 1);
    }, 850);
  };

  const handleChoice = (format: MediaFormat) => {
    if (!currentPrompt || isAnswered) return;

    setSelectedFormat(format);
    const isCorrect = format === currentPrompt.correctFormat;

    if (isCorrect) {
      const nextCorrectCount = correctAnswers + 1;
      setCorrectAnswers(nextCorrectCount);
      setPreviewState('restored');
      setFeedbackText(`Верно. Формат файла: ${currentPrompt.correctFormat}.`);
      finishStep(nextCorrectCount);
      return;
    }

    setPreviewState('error');
    setFeedbackText(`Неверно. Подходящий формат: ${currentPrompt.correctFormat}.`);
    finishStep(correctAnswers);
  };

  const tileState = useMemo(() => {
    return (choice: MediaFormat): TileState => {
      if (!selectedFormat) return 'idle';
      if (choice === currentPrompt.correctFormat) return 'correct';
      if (choice === selectedFormat) return 'wrong';
      return 'idle';
    };
  }, [currentPrompt.correctFormat, selectedFormat]);

  if (!currentPrompt) return null;

  return (
    <div className="m4-activity">
      <p className="m4-activity__intro">
        Смотрите на панель просмотра и выбирайте формат. После ответа вид файла и служебная строка сразу изменятся.
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
              <p className="m4-activity__eyebrow">Ответ</p>
              <h4 className="m4-activity__title">Выберите формат</h4>
            </div>
            <div className="m4-activity__counter">{currentIndex + 1}/{data.prompts.length}</div>
          </div>

          <p className="m4-activity__hint">
            Ориентируйтесь на вид файла и на данные под панелью просмотра.
          </p>

          <div className="m4-format-grid">
            {currentPrompt.choices.map(choice => (
              <FormatTile
                key={choice}
                label={choice}
                state={tileState(choice)}
                onClick={() => handleChoice(choice)}
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
                    width: `${((currentIndex + (selectedFormat ? 1 : 0)) / data.prompts.length) * 100}%`,
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
