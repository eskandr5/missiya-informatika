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
    <div className={`fu ${delay} phrase-row${isPlaying ? ' is-speaking' : ''}`}>
      <div className="phrase-row__main">
        <span className="phrase-row__marker" aria-hidden="true" />
        <div className="phrase-row__copy">
          <p className="phrase-row__ru">{phrase.ru}</p>
          {showEn && (
            <p className="phrase-row__en">{phrase.en}</p>
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
