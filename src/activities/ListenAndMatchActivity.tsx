import { useEffect, useState } from 'react';
import type { ListenAndMatchData, ListenAndMatchPair } from '../types/activity';
import { useRussianSpeech } from '../hooks/useRussianSpeech';
import AudioButton from '../components/ui/AudioButton';
import { shuffle } from '../utils/helpers';

interface Props {
  data: ListenAndMatchData;
  onComplete: (score: number) => void;
}

interface PromptCardProps {
  pair: ListenAndMatchPair;
  isSelected: boolean;
  isWrong: boolean;
  isDone: boolean;
  showTranscript: boolean;
  onSelect: () => void;
}

function MatchPromptCard({
  pair,
  isSelected,
  isWrong,
  isDone,
  showTranscript,
  onSelect,
}: PromptCardProps) {
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(
    `listen-and-match:${pair.id}`,
    pair.audioText,
  );

  return (
    <div
      className={`listening-card${isPlaying ? ' is-speaking' : ''}`}
      style={{
        background: isDone
          ? 'var(--success-soft)'
          : isWrong
            ? 'var(--danger-soft)'
            : isSelected
              ? 'var(--accent-soft)'
              : 'var(--surface-strong)',
        border: `1px solid ${
          isDone
            ? 'var(--success-color)'
            : isWrong
              ? 'var(--danger-color)'
              : isSelected
                ? 'var(--accent-ring)'
                : 'var(--border-color)'
        }`,
        borderRadius: '1rem',
        boxShadow: isSelected ? '0 0 16px var(--accent-glow)' : 'none',
        padding: '.95rem 1rem',
      }}
    >
      <div className="listening-audio-row">
        <button
          type="button"
          onClick={onSelect}
          disabled={isDone}
          className="w-full text-left"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'inherit',
            cursor: isDone ? 'default' : 'pointer',
          }}
        >
          <p className="text-slate-200 font-semibold text-sm">{pair.label}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {showTranscript ? pair.audioText : pair.helperText ?? 'Прослушайте и найдите правильное значение.'}
          </p>
        </button>
        <AudioButton
          isPlaying={isPlaying}
          isDisabled={!isSupported}
          label={pair.audioText}
          onClick={togglePlayback}
        />
      </div>
    </div>
  );
}

export default function ListenAndMatchActivity({ data, onComplete }: Props) {
  const { pairs } = data;
  const [options] = useState(() =>
    shuffle(pairs.map(pair => ({ id: pair.id, matchText: pair.matchText }))),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const correct = Object.keys(matched).length;

  useEffect(() => {
    if (pairs.length === 0 || correct !== pairs.length) return;

    const nextScore = Math.max(
      0,
      Math.round((pairs.length / Math.max(pairs.length + mistakes, 1)) * 100),
    );

    const timer = window.setTimeout(() => onComplete(nextScore), 900);
    return () => window.clearTimeout(timer);
  }, [correct, mistakes, onComplete, pairs.length]);

  const pickPrompt = (pairId: string) => {
    if (matched[pairId] !== undefined) return;
    setSelected(current => (current === pairId ? null : pairId));
  };

  const pickOption = (optionId: string) => {
    if (selected === null) return;
    if (Object.values(matched).includes(optionId)) return;

    if (selected === optionId) {
      setMatched(current => ({ ...current, [selected]: optionId }));
      setSelected(null);
      return;
    }

    setMistakes(current => current + 1);
    setWrong(selected);
    window.setTimeout(() => {
      setWrong(null);
      setSelected(null);
    }, 600);
  };

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">
        Слушайте каждую фразу слева и сопоставляйте её с правильным значением справа. Когда совпадение найдено, текст фразы открывается для закрепления.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Аудиофразы</p>
          <div className="space-y-2">
            {pairs.map(pair => (
              <MatchPromptCard
                key={pair.id}
                pair={pair}
                isSelected={selected === pair.id}
                isWrong={wrong === pair.id}
                isDone={matched[pair.id] !== undefined}
                showTranscript={matched[pair.id] !== undefined || correct === pairs.length}
                onSelect={() => pickPrompt(pair.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Значения</p>
          <div className="space-y-2">
            {options.map(option => {
              const used = Object.values(matched).includes(option.id);
              const canPick = selected !== null && !used;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => pickOption(option.id)}
                  disabled={used}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: used
                      ? 'var(--success-soft)'
                      : canPick
                        ? 'var(--cyan-soft)'
                        : 'var(--surface-soft)',
                    border: `1px solid ${
                      used ? 'var(--success-color)' : canPick ? 'var(--accent-ring)' : 'var(--border-strong)'
                    }`,
                    color: used
                      ? 'var(--success-text)'
                      : canPick
                        ? 'var(--accent)'
                        : 'var(--text-muted)',
                    cursor: used ? 'default' : canPick ? 'pointer' : 'default',
                  }}
                >
                  {option.matchText}
                  {used && <span className="float-right text-green-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div style={{ flex: 1 }}>
          <div className="pb">
            <div
              className="pb-fill"
              style={{
                width: `${pairs.length > 0 ? (correct / pairs.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent))',
              }}
            />
          </div>
        </div>
        <span className="text-sm text-slate-400">{correct}/{pairs.length}</span>
      </div>

      <p className="text-slate-500 text-xs mt-3">
        Ошибки при сопоставлении: <span className="text-slate-300">{mistakes}</span>
      </p>
    </div>
  );
}
