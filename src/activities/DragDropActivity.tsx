import { useState } from 'react';
import type { DragDropData } from '../types/activity';

interface Props {
  data: DragDropData;
  onComplete: (score: number) => void;
}

export default function DragDropActivity({ data, onComplete }: Props) {
  const { items, zones } = data;
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selected,    setSelected]    = useState<string | null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [results,     setResults]     = useState<Record<string, boolean>>({});

  const poolItems = items.filter(it => !assignments[it.id]);
  const allPlaced = poolItems.length === 0;

  const pickItem = (id: string) => {
    if (submitted) return;
    setSelected(s => (s === id ? null : id));
  };
  const pickZone = (zoneId: string) => {
    if (!selected || submitted) return;
    setAssignments(a => ({ ...a, [selected]: zoneId }));
    setSelected(null);
  };
  const removeItem = (id: string) => {
    if (submitted) return;
    setAssignments(a => { const n = { ...a }; delete n[id]; return n; });
    setSelected(null);
  };

  const submit = () => {
    let c = 0;
    const r: Record<string, boolean> = {};
    items.forEach(it => {
      const ok = assignments[it.id] === it.correctZone;
      r[it.id] = ok;
      if (ok) c++;
    });
    const s = Math.round((c / items.length) * 100);
    setResults(r);
    setSubmitted(true);
    setTimeout(() => onComplete(s), 2000);
  };

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">
        Нажмите на <span className="text-blue-300 font-semibold">элемент</span>, затем на{' '}
        <span className="text-cyan-300 font-semibold">зону назначения</span>. Нажмите на размещённый элемент, чтобы вернуть его.
      </p>

      {/* Pool */}
      {poolItems.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Элементы для размещения</p>
          <div className="flex flex-wrap gap-2">
            {poolItems.map(it => (
              <button
                key={it.id}
                onClick={() => pickItem(it.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: selected === it.id ? 'rgba(37,99,235,.25)' : 'rgba(15,25,50,.8)',
                  border: `1px solid ${selected === it.id ? 'rgba(37,99,235,.7)' : 'rgba(30,58,138,.3)'}`,
                  color: selected === it.id ? '#93c5fd' : '#cbd5e1',
                  boxShadow: selected === it.id ? '0 0 14px rgba(37,99,235,.3)' : 'none',
                }}
              >
                <span>{it.icon}</span><span>{it.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {zones.map(zone => {
          const zoneItems = items.filter(it => assignments[it.id] === zone.id);
          const canDrop   = selected !== null;
          return (
            <div
              key={zone.id}
              onClick={() => canDrop && pickZone(zone.id)}
              className="rounded-2xl p-4 min-h-28 transition-all"
              style={{
                background: canDrop ? `${zone.color}0d` : 'rgba(10,16,32,.6)',
                border: `2px ${canDrop ? 'dashed' : 'solid'} ${canDrop ? zone.color + '60' : 'rgba(30,58,138,.22)'}`,
                cursor: canDrop ? 'pointer' : 'default',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: zone.color }} />
                <p className="hf text-sm font-bold" style={{ color: zone.color }}>{zone.label}</p>
                <span className="text-xs text-slate-600">— {zone.desc}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {zoneItems.map(it => {
                  const ok  = submitted && results[it.id];
                  const err = submitted && !results[it.id];
                  return (
                    <button
                      key={it.id}
                      onClick={e => { e.stopPropagation(); removeItem(it.id); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: ok ? 'rgba(34,197,94,.15)' : err ? 'rgba(239,68,68,.15)' : 'rgba(30,58,138,.25)',
                        border: `1px solid ${ok ? 'rgba(34,197,94,.5)' : err ? 'rgba(239,68,68,.5)' : zone.color + '50'}`,
                        color: ok ? '#86efac' : err ? '#fca5a5' : '#cbd5e1',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      <span>{it.icon}</span><span>{it.label}</span>
                      {ok  && <span className="text-green-400 text-xs">✓</span>}
                      {err && <span className="text-red-400 text-xs">✗</span>}
                    </button>
                  );
                })}
                {zoneItems.length === 0 && (
                  <p className="text-slate-700 text-xs italic">Перетащите сюда…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allPlaced && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить распределение →</button>
      )}
    </div>
  );
}