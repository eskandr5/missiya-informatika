import { useEffect, useMemo, useState } from 'react';
import '../styles/module4.css';
import type { MediaItem, MediaKitAssemblyData, MediaPreviewState } from '../types/activity';
import MediaFileCard from '../components/module4/MediaFileCard';
import MediaPreviewPanel from '../components/module4/MediaPreviewPanel';

interface Props {
  data: MediaKitAssemblyData;
  onComplete: (score: number) => void;
}

type CardState = 'idle' | 'selected' | 'correct' | 'wrong';

export default function MediaKitAssemblyActivity({ data, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeItemId, setActiveItemId] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [wrongItemIds, setWrongItemIds] = useState<string[]>([]);
  const [previewState, setPreviewState] = useState<MediaPreviewState>('neutral');
  const [feedbackText, setFeedbackText] = useState('Выберите файлы, которые подходят для задания, и проверьте набор.');
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [attemptUsed, setAttemptUsed] = useState(false);

  const currentScenario = data.scenarios[currentIndex];
  const isLastScenario = currentIndex === data.scenarios.length - 1;

  const activeItem = useMemo(
    () => currentScenario?.items.find(item => item.id === activeItemId) ?? currentScenario?.items[0] ?? null,
    [activeItemId, currentScenario],
  );

  useEffect(() => {
    if (!currentScenario) return;
    setSelectedIds([]);
    setWrongItemIds([]);
    setPreviewState('neutral');
    setAttemptUsed(false);
    setActiveItemId(currentScenario.items[0]?.id ?? '');
    setFeedbackText(currentScenario.helperText ?? 'Выберите файлы, которые подходят для задания, и проверьте набор.');
  }, [currentScenario]);

  const finishScenario = (nextFirstTryCorrectCount: number) => {
    window.setTimeout(() => {
      if (isLastScenario) {
        const score = Math.round((nextFirstTryCorrectCount / data.scenarios.length) * 100);
        onComplete(score);
        return;
      }

      setCurrentIndex(index => index + 1);
    }, 950);
  };

  const toggleItem = (item: MediaItem) => {
    if (previewState === 'restored') return;

    setActiveItemId(item.id);
    setSelectedIds(prev =>
      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id],
    );

    if (previewState === 'error') {
      setPreviewState('neutral');
      setWrongItemIds([]);
      setFeedbackText(currentScenario.helperText ?? 'Проверьте состав набора ещё раз.');
    }
  };

  const handleCheck = () => {
    if (!currentScenario || selectedIds.length === 0) {
      setPreviewState('error');
      setWrongItemIds([]);
      setFeedbackText('Сначала выберите хотя бы один файл для набора.');
      return;
    }

    const requiredIds = currentScenario.requiredItemIds;
    const missingItems = currentScenario.items.filter(
      item => requiredIds.includes(item.id) && !selectedIds.includes(item.id),
    );
    const extraItems = currentScenario.items.filter(
      item => selectedIds.includes(item.id) && !requiredIds.includes(item.id),
    );
    const isCorrect = missingItems.length === 0 && extraItems.length === 0;

    if (isCorrect) {
      const nextFirstTryCorrectCount = attemptUsed ? firstTryCorrectCount : firstTryCorrectCount + 1;
      if (!attemptUsed) setFirstTryCorrectCount(nextFirstTryCorrectCount);
      setWrongItemIds([]);
      setPreviewState('restored');
      setFeedbackText(currentScenario.readyText ?? 'Набор готов. Все файлы выбраны верно.');
      finishScenario(nextFirstTryCorrectCount);
      return;
    }

    setAttemptUsed(true);
    setPreviewState('error');
    setWrongItemIds(extraItems.map(item => item.id));

    const messageParts: string[] = ['Набор пока не готов.'];
    if (missingItems.length > 0) {
      messageParts.push(`Добавьте: ${missingItems.map(item => item.name).join(', ')}.`);
    }
    if (extraItems.length > 0) {
      messageParts.push(`Уберите: ${extraItems.map(item => item.name).join(', ')}.`);
    }
    setFeedbackText(messageParts.join(' '));
  };

  const getCardState = (item: MediaItem): CardState => {
    if (previewState === 'restored' && selectedIds.includes(item.id)) return 'correct';
    if (wrongItemIds.includes(item.id)) return 'wrong';
    if (selectedIds.includes(item.id)) return 'selected';
    return 'idle';
  };

  if (!currentScenario) return null;

  return (
    <div className="m4-activity">
      <p className="m4-activity__intro">
        Соберите подходящий набор файлов для задачи. Наведите на карточку, чтобы проверить файл на панели слева, затем отметьте нужные позиции.
      </p>

      <div className="m4-activity__layout">
        <div className="m4-activity__stack">
          <div className={`m4-kit-target is-${previewState === 'restored' ? 'restored' : previewState === 'error' ? 'error' : 'neutral'}`}>
            <div className="m4-kit-target__head">
              <div>
                <p className="m4-activity__eyebrow">Цель</p>
                <h4 className="m4-activity__title">{currentScenario.title}</h4>
              </div>
              <div className="m4-activity__counter">{currentIndex + 1}/{data.scenarios.length}</div>
            </div>

            <p className="m4-kit-target__briefing">{currentScenario.briefing}</p>

            <div className="m4-kit-target__requirements">
              {currentScenario.requirements.map(requirement => (
                <div key={requirement} className="m4-kit-target__requirement">
                  {requirement}
                </div>
              ))}
            </div>

            <div className="m4-kit-target__footer">
              <span className="m4-kit-target__label">
                Выбрано: {selectedIds.length}/{currentScenario.requiredItemIds.length}
              </span>
              <div className="m4-kit-target__chips">
                {selectedIds.length > 0 ? (
                  currentScenario.items
                    .filter(item => selectedIds.includes(item.id))
                    .map(item => (
                      <span key={item.id} className="m4-kit-target__chip">
                        {item.name}
                      </span>
                    ))
                ) : (
                  <span className="m4-kit-target__placeholder">Файлы ещё не выбраны</span>
                )}
              </div>
            </div>
          </div>

          <MediaPreviewPanel
            item={activeItem}
            state={previewState}
            helperText={currentScenario.helperText ?? 'Проверьте свойства выбранного файла.'}
          />
        </div>

        <div className="m4-activity__panel">
          <div className="m4-activity__panel-head">
            <div>
              <p className="m4-activity__eyebrow">Набор</p>
              <h4 className="m4-activity__title">Выберите подходящие файлы</h4>
            </div>
            <div className="m4-activity__counter">{selectedIds.length}</div>
          </div>

          <p className="m4-activity__hint">
            Сравнивайте тип файла, формат, размер, длительность и назначение.
          </p>

          <div className="m4-file-list">
            {currentScenario.items.map(item => (
              <MediaFileCard
                key={item.id}
                item={item}
                state={getCardState(item)}
                onClick={() => toggleItem(item)}
                onMouseEnter={() => setActiveItemId(item.id)}
              />
            ))}
          </div>

          <div className="m4-kit-actions">
            <button
              type="button"
              onClick={handleCheck}
              className="btn-p"
              disabled={previewState === 'restored'}
            >
              Проверить набор
            </button>
          </div>

          <div className={`m4-feedback m4-feedback--panel ${previewState === 'error' ? 'is-wrong' : previewState === 'restored' ? 'is-correct' : ''}`}>
            <span className="m4-feedback__mark">
              {previewState === 'error' ? '✗' : previewState === 'restored' ? '✓' : '—'}
            </span>
            <span>{feedbackText}</span>
          </div>

          <div className="m4-activity__progress-row">
            <div className="m4-activity__progress-copy">
              С первого раза: {firstTryCorrectCount}/{data.scenarios.length}
            </div>
            <div style={{ flex: 1 }}>
              <div className="pb">
                <div
                  className="pb-fill"
                  style={{
                    width: `${(currentIndex / data.scenarios.length) * 100}%`,
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
