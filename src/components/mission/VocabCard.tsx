import { useState } from 'react';
import type { VocabWord } from '../../types/content';
import { useRussianSpeech } from '../../hooks/useRussianSpeech';
import AudioButton from '../ui/AudioButton';

interface Props {
  word: VocabWord;
  showEn: boolean;
  delay?: string;
}

export default function VocabCard({ word, showEn, delay = '' }: Props) {
  const [flipped, setFlipped] = useState(false);
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(`vocab:${word.id}`, word.ru);

  return (
    <div
      onClick={() => setFlipped(value => !value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setFlipped(value => !value);
        }
      }}
      role="button"
      tabIndex={0}
      className={`fu ${delay} card lift vocab-card text-left${isPlaying ? ' is-speaking' : ''}`}
    >
      <div className="vocab-card__head">
        <div className="vocab-card__copy">
          <p className="vocab-card__term hf">{word.ru}</p>
          {showEn && (
            <span className="vocab-card__gloss">
              {word.en}
            </span>
          )}
        </div>

        <AudioButton
          isPlaying={isPlaying}
          isDisabled={!isSupported}
          label={word.ru}
          onClick={(event) => {
            event.stopPropagation();
            togglePlayback();
          }}
        />
      </div>

      {flipped ? (
        <p className="vocab-card__definition">{word.def}</p>
      ) : (
        <div className="vocab-card__hint">
          <span className="vocab-card__hint-label">Определение</span>
          <span>Нажмите, чтобы открыть карточку</span>
        </div>
      )}
    </div>
  );
}
