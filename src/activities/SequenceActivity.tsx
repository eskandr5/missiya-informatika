import { useState } from 'react';
import type { SequenceData, SequenceEvent } from '../types/activity';
import { shuffle } from '../utils/helpers';

interface Props {
  data: SequenceData;
  onComplete: (score: number) => void;
}

export default function SequenceActivity({ data, onComplete }: Props) {
  const { events } = data;
  const [pool] = useState<SequenceEvent[]>(() => shuffle([...events]));
  const [order, setOrder]       = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore]       = useState(0);

  const toggle = (ev: SequenceEvent) => {
    if (submitted) return;
    setOrder(o =>
      o.includes(ev.id) ? o.filter(x => x !== ev.id) : [...o, ev.id],
    );
  };

  const submit = () => {
    let c = 0;
    order.forEach((id, i) => {
      if (events.find(e => e.id === id)?.order === i + 1) c++;
    });
    const s = Math.round((c / events.length) * 100);
    setScore(s);
    setSubmitted(true);
    setTimeout(() => onComplete(s), 1800);
  };

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">
        Нажимайте события{' '}
        <span className="text-blue-300 font-semibold">в хронологическом порядке</span> — от раннего к позднему.
      </p>
      <div className="space-y-2 mb-4">
        {pool.map(ev => {
          const pos   = order.indexOf(ev.id);
          const isSel = pos !== -1;
          const isOk  = submitted && ev.order === pos + 1;
          const isErr = submitted && isSel && ev.order !== pos + 1;
          return (
            <button
              key={ev.id}
              onClick={() => toggle(ev)}
              className="w-full text-left px-4 py-4 rounded-xl flex items-start gap-3 transition-all"
              style={{
                background: isOk ? 'var(--success-soft)' : isErr ? 'var(--danger-soft)' : isSel ? 'var(--accent-soft)' : 'var(--surface-strong)',
                border: `1px solid ${isOk ? 'var(--success-color)' : isErr ? 'var(--danger-color)' : isSel ? 'var(--accent-ring)' : 'var(--border-color)'}`,
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold hf flex-shrink-0"
                style={{
                  background: isOk ? 'var(--success-color)' : isErr ? 'var(--danger-color)' : isSel ? 'var(--accent)' : 'var(--text-dim)',
                  color: 'var(--text-inverse)',
                }}
              >
                {isSel ? pos + 1 : '·'}
              </div>
              <div>
                <div className="text-xs text-blue-400 font-bold hf mb-0.5">{ev.year}</div>
                <div className="text-sm text-slate-200">{ev.text}</div>
              </div>
            </button>
          );
        })}
      </div>

      {order.length === events.length && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить порядок →</button>
      )}

      {submitted && (
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: score >= 70 ? 'var(--success-soft)' : 'var(--warning-soft)',
            border: `1px solid ${score >= 70 ? 'var(--success-color)' : 'var(--warning-color)'}`,
          }}
        >
          <div className="hf text-3xl font-bold mb-1" style={{ color: score >= 70 ? 'var(--success-text)' : 'var(--warning-text)' }}>
            {score}%
          </div>
          <p className="text-slate-400 text-sm">
            {score >= 70 ? 'Хронология верна!' : 'Попробуйте повторить.'} Переходим к результатам…
          </p>
        </div>
      )}
    </div>
  );
}
