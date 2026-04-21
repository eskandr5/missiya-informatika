import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { useRussianSpeech } from '../../hooks/useRussianSpeech';
import type { VocabWord } from '../../types/content';
import AudioButton from '../ui/AudioButton';

interface Props {
  word: VocabWord;
  isRevealed: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onToggleComplete: () => void;
  categoryLabel?: string;
}

export default function VocabListItem({
  word,
  isRevealed,
  isCompleted,
  onToggle,
  onToggleComplete,
  categoryLabel = 'Базовые понятия',
}: Props) {
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(`vocab-list:${word.id}`, word.ru);

  return (
    <article className={`vocab-list-item${isRevealed ? ' is-revealed' : ''}${isCompleted ? ' is-complete' : ''}${isPlaying ? ' is-speaking' : ''}`}>
      <button type="button" className="vocab-list-item__main" onClick={onToggle}>
        <div className="vocab-list-item__copy">
          <span className="vocab-list-item__eyebrow">{categoryLabel}</span>
          <h3 className="vocab-list-item__term">{word.ru}</h3>
          {isRevealed ? (
            <div className="vocab-list-item__details">
              <strong>{word.en}</strong>
              <p>{word.def}</p>
            </div>
          ) : (
            <p className="vocab-list-item__hint">Нажмите, чтобы открыть перевод и объяснение</p>
          )}
        </div>
      </button>

      <div className="vocab-list-item__actions">
        <AudioButton
          isPlaying={isPlaying}
          isDisabled={!isSupported}
          label={word.ru}
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
        />

        <button
          type="button"
          className={`vocab-list-item__complete${isCompleted ? ' is-active' : ''}`}
          onClick={onToggleComplete}
          aria-pressed={isCompleted}
          title={isCompleted ? 'Снять отметку изучено' : 'Отметить изученным'}
        >
          <HiOutlineCheckCircle aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
