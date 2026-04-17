import { useState } from 'react';
import type { VocabWord } from '../../types/content';

interface Props {
  word: VocabWord;
  showEn: boolean;
  delay?: string;
}

export default function VocabCard({ word, showEn, delay = '' }: Props) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped(f => !f)}
      className={`fu ${delay} card lift`}
      style={{
        padding: '1rem',
        minHeight: '6.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="hf font-bold text-white text-sm leading-snug">{word.ru}</span>
        {showEn && (
          <span
            className="tag"
            style={{
              background: 'var(--cyan-soft)',
              color: 'var(--accent)',
              flexShrink: 0,
              fontSize: '.62rem',
            }}
          >
            {word.en}
          </span>
        )}
      </div>
      {flipped ? (
        <p className="text-slate-300 text-xs mt-2 leading-relaxed">{word.def}</p>
      ) : (
        <p className="text-slate-600 text-xs mt-2">Нажмите, чтобы увидеть определение</p>
      )}
    </div>
  );
}
