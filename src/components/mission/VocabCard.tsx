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
      onClick={() => setFlipped(f => !f)}
      className={`fu ${delay} card lift vocab-card${isPlaying ? ' is-speaking' : ''}`}
      style={{
        padding: '1rem',
        minHeight: '7rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0" style={{ flexWrap: 'wrap' }}>
          <span className="hf font-bold text-white text-sm leading-snug">{word.ru}</span>
          {showEn && (
            <span
              className="tag"
              style={{
                background: 'var(--cyan-soft)',
                color: 'var(--accent)',
                flexShrink: 0,
                fontSize: '.64rem',
              }}
            >
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
        <p className="text-slate-300 text-xs mt-2 leading-relaxed">{word.def}</p>
      ) : (
        <p className="text-slate-600 text-xs mt-2">Нажмите, чтобы увидеть определение</p>
      )}
    </div>
  );
}
