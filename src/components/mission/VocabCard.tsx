import type { VocabWord } from '../../types/content';

interface Props {
  word: VocabWord;
  isRevealed: boolean;
  onToggle: () => void;
  categoryLabel?: string;
  delay?: string;
}

export default function VocabCard({
  word,
  isRevealed,
  onToggle,
  categoryLabel = 'Базовые понятия',
  delay = '',
}: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`fu ${delay} vocab-card vocab-card--bank${isRevealed ? ' is-revealed' : ''}`}
    >
      <div className="vocab-card__flip">
        <div className="vocab-card__face vocab-card__face--front">
          <span className="vocab-card__eyebrow">{categoryLabel}</span>
          <div className="vocab-card__body">
            <div className="vocab-card__copy">
              <p className="vocab-card__term hf">{word.ru}</p>
              <span className="vocab-card__hint-copy">Нажмите, чтобы увидеть перевод</span>
            </div>
          </div>
        </div>

        <div className="vocab-card__face vocab-card__face--back">
          <span className="vocab-card__eyebrow">Перевод и определение</span>
          <div className="vocab-card__body">
            <div className="vocab-card__copy">
              <p className="vocab-card__term hf">{word.en}</p>
              <span className="vocab-card__hint-copy">{word.def}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
