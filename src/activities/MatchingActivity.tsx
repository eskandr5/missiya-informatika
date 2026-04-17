import { useState, useEffect } from 'react';
import type { MatchingData } from '../types/activity';
import { shuffle } from '../utils/helpers';

interface Props {
  data: MatchingData;
  onComplete: (score: number) => void;
}

export default function MatchingActivity({ data, onComplete }: Props) {
  const { pairs } = data;
  const [shuffledDefs] = useState(() =>
    shuffle(pairs.map((p, i) => ({ ...p, origIdx: i }))),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrong, setWrong] = useState<number | null>(null);

  const correct = Object.keys(matched).length;

  useEffect(() => {
    if (correct > 0 && correct === pairs.length) {
      setTimeout(() => onComplete(100), 700);
    }
  }, [correct, pairs.length, onComplete]);

  const pickTerm = (idx: number) => {
    if (matched[idx] !== undefined) return;
    setSelected(s => (s === idx ? null : idx));
  };

  const pickDef = (def: { origIdx: number }) => {
    if (selected === null) return;
    if (Object.values(matched).includes(def.origIdx)) return;
    if (def.origIdx === selected) {
      setMatched(m => ({ ...m, [selected]: def.origIdx }));
      setSelected(null);
    } else {
      setWrong(selected);
      setTimeout(() => { setWrong(null); setSelected(null); }, 600);
    }
  };

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">
        Нажмите на <span className="text-blue-300 font-semibold">термин</span>, затем на его{' '}
        <span className="text-cyan-300 font-semibold">определение</span>.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Terms */}
        <div>
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Термины</p>
          <div className="space-y-2">
            {pairs.map((_, idx) => {
              const isDone  = matched[idx] !== undefined;
              const isSel   = selected === idx;
              const isWrong = wrong === idx;
              return (
                <button
                  key={idx}
                  onClick={() => pickTerm(idx)}
                  disabled={isDone}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all hf ${isWrong ? 'shake' : ''}`}
                  style={{
                    background: isDone ? 'var(--success-soft)' : isWrong ? 'var(--danger-soft)' : isSel ? 'var(--accent-soft)' : 'var(--surface-strong)',
                    border: `1px solid ${isDone ? 'var(--success-color)' : isWrong ? 'var(--danger-color)' : isSel ? 'var(--accent-ring)' : 'var(--border-color)'}`,
                    color: isDone ? 'var(--success-text)' : isWrong ? 'var(--danger-text)' : isSel ? 'var(--accent)' : 'var(--text-secondary)',
                    boxShadow: isSel ? '0 0 16px var(--accent-glow)' : 'none',
                    cursor: isDone ? 'default' : 'pointer',
                  }}
                >
                  {pairs[idx].term}
                  {isDone && (
                    <span className="float-right text-green-400 checkIn" style={{ display: 'inline-block' }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Definitions */}
        <div>
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Определения</p>
          <div className="space-y-2">
            {shuffledDefs.map((def, i) => {
              const used    = Object.values(matched).includes(def.origIdx);
              const canPick = selected !== null && !used;
              return (
                <button
                  key={i}
                  onClick={() => pickDef(def)}
                  disabled={used}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: used ? 'var(--success-soft)' : canPick ? 'var(--cyan-soft)' : 'var(--surface-soft)',
                    border: `1px solid ${used ? 'var(--success-color)' : canPick ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
                    color: used ? 'var(--success-text)' : canPick ? 'var(--accent)' : 'var(--text-muted)',
                    cursor: used ? 'default' : canPick ? 'pointer' : 'default',
                  }}
                >
                  {def.def} {used && <span className="float-right text-green-400">✓</span>}
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
              style={{ width: `${pairs.length > 0 ? (correct / pairs.length) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent))' }}
            />
          </div>
        </div>
        <span className="text-sm text-slate-400">{correct}/{pairs.length}</span>
      </div>
    </div>
  );
}
