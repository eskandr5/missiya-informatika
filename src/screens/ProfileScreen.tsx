import { useState } from 'react';
import { MODULES } from '../data/modules';
import { getRank, getNextRank } from '../data/ranks';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import type { Progress } from '../types/progress';

interface Props {
  progress: Progress;
  onBack: () => void;
  onReset: () => void;
}

export default function ProfileScreen({ progress, onBack, onReset }: Props) {
  const rank     = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const [confirmReset, setConfirmReset] = useState(false);

  const xpSince  = progress.xp - rank.minXP;
  const range    = nextRank ? nextRank.minXP - rank.minXP : 1;
  const startedModules = MODULES.filter(m =>
    m.missions.some(ms => progress.completedMissions.includes(ms.id)),
  ).length;
  const totalProtocols = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const restoredPct = Math.round((progress.completedMissions.length / totalProtocols) * 100);

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      <div className="app-shell app-shell--compact" style={{ maxWidth: '680px', margin: '0 auto', paddingBlock: '2rem' }}>
        <div className="profile-screen__header flex items-center justify-between gap-3 mb-6">
          <button onClick={onBack} className="btn-g text-sm px-3 py-1.5">← К разделам</button>
          <h2 className="hf text-white font-bold text-xl">Профиль</h2>
          <div className="profile-screen__header-spacer" />
        </div>

        {/* Rank card */}
        <div className="card p-6 mb-4 fu" style={{ border: '1px solid var(--border-accent-soft)' }}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)' }}
            >
              {rank.icon}
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider">Текущий уровень</p>
              <h3 className="hf text-white font-bold text-2xl">{rank.name}</h3>
              <p className="text-blue-400 text-sm font-semibold">{progress.xp} XP</p>
            </div>
          </div>
          <p
            className="text-slate-500 text-xs mb-3"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              letterSpacing: '.04em',
            }}
          >
            ПРОФИЛЬ // ОСВОЕНО={restoredPct}% · АКТИВНЫЕ_РАЗДЕЛЫ={startedModules}
          </p>
          {nextRank ? (
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                <span>Следующий уровень: «{nextRank.name}»</span>
                <span>{nextRank.minXP - progress.xp} XP</span>
              </div>
              <ProgressBar value={xpSince} max={range} />
            </div>
          ) : (
            <p className="text-amber-400 text-sm font-semibold">⬡ Максимальный уровень достигнут</p>
          )}
        </div>

        {/* Stats */}
        <div className="profile-screen__stats grid gap-3 mb-4 fu d2">
          {[
            { val: progress.completedMissions.length, sub: 'Заданий' },
            { val: progress.badges.length,            sub: 'Знаков' },
            { val: startedModules,                    sub: 'Модулей' },
          ].map((s, i) => (
            <div key={i} className="card p-4 text-center" style={{ border: '1px solid var(--border-color)' }}>
              <div className="hf text-2xl font-bold text-white">{s.val}</div>
              <div className="text-xs text-slate-600 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="card p-5 mb-4 fu d3" style={{ border: '1px solid var(--border-color)' }}>
          <h3 className="hf text-white font-semibold mb-4">Знаки</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {MODULES.map(mod => (
              <Badge
                key={mod.id}
                badge={mod.badge}
                earned={progress.badges.includes(mod.badge.id)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Module progress list */}
        <div className="card p-5 mb-5 fu d4" style={{ border: '1px solid var(--border-color)' }}>
          <h3 className="hf text-white font-semibold mb-4">Прогресс по модулям</h3>
          <div className="space-y-3">
            {MODULES.map((mod) => {
              const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
              return (
                <div key={mod.id}>
                  <div className="profile-screen__module-row flex justify-between items-start text-xs mb-1">
                    <span className="text-slate-400">{mod.icon} {mod.title}</span>
                    <span className="text-slate-600 font-semibold hf">{done}/{mod.missions.length}</span>
                  </div>
                  <ProgressBar value={done} max={mod.missions.length} color={mod.accent} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="btn-g w-full text-sm"
            style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
          >
            Сбросить прогресс
          </button>
        ) : (
          <div className="card p-4 text-center" style={{ border: '1px solid var(--danger-color)' }}>
            <p className="text-slate-300 text-sm mb-3">Весь прогресс будет удалён. Продолжить?</p>
            <div className="mission-screen__step-nav justify-center">
              <button onClick={() => setConfirmReset(false)} className="btn-g">Отмена</button>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: 'var(--danger-soft)',
                  border: '1px solid var(--danger-color)',
                  color: 'var(--danger-text)',
                  cursor: 'pointer',
                }}
              >
                Да, сбросить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
