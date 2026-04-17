import type { Phrase } from '../../types/content';

interface Props {
  phrase: Phrase;
  showEn: boolean;
  delay?: string;
}

export default function PhraseRow({ phrase, showEn, delay = '' }: Props) {
  return (
    <div
      className={`fu ${delay} flex items-start gap-3 px-4 py-3 rounded-xl`}
      style={{
        background: 'var(--accent-softer)',
        border: '1px solid var(--border-accent-soft)',
      }}
    >
      <span style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }}>›</span>
      <div>
        <p className="text-slate-200 text-sm font-semibold">{phrase.ru}</p>
        {showEn && (
          <p className="text-slate-500 text-xs mt-0.5 italic">{phrase.en}</p>
        )}
      </div>
    </div>
  );
}
