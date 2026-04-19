import type { Phrase } from '../../types/content';
import { useRussianSpeech } from '../../hooks/useRussianSpeech';
import AudioButton from '../ui/AudioButton';

interface Props {
  phrase: Phrase;
  showEn: boolean;
  delay?: string;
}

export default function PhraseRow({ phrase, showEn, delay = '' }: Props) {
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(`phrase:${phrase.ru}`, phrase.ru);

  return (
    <div
      className={`fu ${delay} phrase-row flex items-start justify-between gap-3 px-4 py-2.5 rounded-xl${isPlaying ? ' is-speaking' : ''}`}
      style={{
        background: 'var(--accent-softer)',
        border: '1px solid var(--border-accent-soft)',
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>{'›'}</span>
        <div>
          <p className="text-slate-200 text-sm font-semibold">{phrase.ru}</p>
          {showEn && (
            <p className="text-slate-500 text-xs mt-0.5 italic">{phrase.en}</p>
          )}
        </div>
      </div>
      <AudioButton
        isPlaying={isPlaying}
        isDisabled={!isSupported}
        label={phrase.ru}
        onClick={togglePlayback}
      />
    </div>
  );
}
