import { useState } from 'react';
import type { ClassificationData } from '../types/activity';

interface Props {
  data: ClassificationData;
  onComplete: (score: number) => void;
}

export default function ClassificationActivity({ data, onComplete }: Props) {
  const { items, categories } = data;
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selected,    setSelected]    = useState<string | null>(null);
  const [submitted,   setSubmitted]   = useState(false);
  const [results,     setResults]     = useState<Record<string, boolean>>({});
  const allPlaced = Object.keys(assignments).length === items.length;

  const pickItem = (id: string) => {
    if (submitted) return;
    setSelected(s => (s === id ? null : id));
  };
  const pickCat = (catId: string) => {
    if (!selected || submitted) return;
    setAssignments(a => ({ ...a, [selected]: catId }));
    setSelected(null);
  };
  const unassign = (id: string) => {
    if (submitted) return;
    setAssignments(a => { const n = { ...a }; delete n[id]; return n; });
  };

  const submit = () => {
    let c = 0;
    const r: Record<string, boolean> = {};
    items.forEach(it => {
      const ok = assignments[it.id] === it.category;
      r[it.id] = ok;
      if (ok) c++;
    });
    const s = Math.round((c / items.length) * 100);
    setResults(r);
    setSubmitted(true);
    setTimeout(() => onComplete(s), 1800);
  };

  const unassigned = items.filter(it => !assignments[it.id]);

  return (
    <div>
      <p className="text-slate-400 text-sm mb-4">
        Нажмите на устройство, затем на нужную <span className="text-blue-300 font-semibold">категорию</span>.
      </p>

      {/* Pool */}
      <div
        className="flex flex-wrap gap-2 mb-5 p-3 rounded-xl min-h-12"
        style={{ background: 'rgba(10,16,32,.6)', border: '1px solid rgba(30,58,138,.2)' }}
      >
        {unassigned.length > 0 ? (
          unassigned.map(it => (
            <button
              key={it.id}
              onClick={() => pickItem(it.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: selected === it.id ? 'rgba(37,99,235,.22)' : 'rgba(20,30,60,.9)',
                border: `1px solid ${selected === it.id ? 'rgba(37,99,235,.65)' : 'rgba(30,58,138,.35)'}`,
                color: selected === it.id ? '#93c5fd' : '#cbd5e1',
                boxShadow: selected === it.id ? '0 0 14px rgba(37,99,235,.28)' : 'none',
              }}
            >
              <span className="text-xl">{it.icon}</span>
              <span>{it.label}</span>
            </button>
          ))
        ) : (
          <p className="text-slate-600 text-xs italic self-center ml-1">Все устройства распределены</p>
        )}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {categories.map(cat => {
          const catItems = items.filter(it => assignments[it.id] === cat.id);
          const canDrop  = selected !== null;
          return (
            <div
              key={cat.id}
              onClick={() => canDrop && pickCat(cat.id)}
              className="rounded-2xl p-4 min-h-32 transition-all"
              style={{
                background: canDrop ? `${cat.color}0c` : 'rgba(10,16,32,.55)',
                border: `2px ${canDrop ? 'dashed' : 'solid'} ${canDrop ? cat.color + '55' : 'rgba(30,58,138,.2)'}`,
                cursor: canDrop ? 'pointer' : 'default',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <p className="hf font-bold text-sm" style={{ color: cat.color }}>{cat.label}</p>
              </div>
              <p className="text-xs text-slate-600 mb-3">{cat.desc}</p>
              <div className="flex flex-wrap gap-2">
                {catItems.map(it => {
                  const ok  = submitted && results[it.id];
                  const err = submitted && !results[it.id];
                  return (
                    <button
                      key={it.id}
                      onClick={e => { e.stopPropagation(); unassign(it.id); }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold"
                      style={{
                        background: ok ? 'rgba(34,197,94,.13)' : err ? 'rgba(239,68,68,.13)' : 'rgba(30,58,138,.22)',
                        border: `1px solid ${ok ? 'rgba(34,197,94,.45)' : err ? 'rgba(239,68,68,.45)' : cat.color + '40'}`,
                        color: ok ? '#86efac' : err ? '#fca5a5' : '#e2e8f0',
                        cursor: submitted ? 'default' : 'pointer',
                      }}
                    >
                      <span>{it.icon}</span><span>{it.label}</span>
                      {ok  && <span className="text-xs">✓</span>}
                      {err && <span className="text-xs">✗</span>}
                    </button>
                  );
                })}
                {catItems.length === 0 && (
                  <p className="text-slate-700 text-xs italic">Выберите устройство выше, затем нажмите сюда…</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allPlaced && !submitted && (
        <button onClick={submit} className="btn-p w-full">Проверить классификацию →</button>
      )}
    </div>
  );
}