import type { CSSProperties } from 'react';
import { MODULES } from '../data/modules';
import { getRank, getNextRank } from '../data/ranks';
import { ARCHIVE_COPY } from '../data/archiveTerminology';
import { isModuleUnlocked } from '../utils/progression';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import type { Progress } from '../types/progress';
import type { Module } from '../types/content';

interface Props {
  progress: Progress;
  onSelectModule: (mod: Module) => void;
}

const DL = ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12'];

export default function DashboardScreen({ progress, onSelectModule }: Props) {
  const rank      = getRank(progress.xp);
  const nextRank  = getNextRank(progress.xp);
  const totalModules = MODULES.length;
  const totalM    = MODULES.reduce((s, m) => s + m.missions.length, 0);
  const doneM     = progress.completedMissions.length;
  const unlockedModules = MODULES.filter(mod => isModuleUnlocked(mod, progress.completedMissions, MODULES)).length;
  const activeModule = MODULES.find((mod) => {
    const unlocked = isModuleUnlocked(mod, progress.completedMissions, MODULES);
    const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
    return unlocked && done < mod.missions.length;
  }) ?? null;
  const restoredPct = Math.round((doneM / totalM) * 100);
  const systemState = doneM === 0
    ? 'INITIAL_SYNC'
    : doneM === totalM
    ? 'FULL_RESTORATION'
    : 'PARTIAL_RESTORATION';

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      {/* Stats strip */}
      <div
        style={{
          background: 'var(--surface-header)',
          borderBottom: '1px solid var(--border-color)',
          padding: '2rem 1.5rem',
        }}
      >
        <div className="app-shell app-shell--flush" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="fu">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Сектор восстановления</p>
              <h1 className="hf text-3xl font-bold text-white">{ARCHIVE_COPY.appTitle}</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Реестр разделов информатики · {totalModules} {ARCHIVE_COPY.moduleLabelPlural} · {totalM} {ARCHIVE_COPY.missionLabelPlural}
              </p>
            </div>
            <div className="dashboard-screen__summary flex items-center gap-2 fu d2">
              {[
                { val: `${rank.icon} ${rank.name}`, sub: ARCHIVE_COPY.rankLabel.toLowerCase() },
                { val: `${progress.xp} XP`,          sub: 'зафиксировано' },
                { val: `${doneM}/${totalM}`,        sub: ARCHIVE_COPY.missionLabelPlural },
              ].map((s, i) => (
                <div
                  key={i}
                  className="card px-4 py-3 text-center"
                  style={{ minWidth: '90px', border: '1px solid var(--border-color)' }}
                >
                  <div className="hf text-white font-bold text-sm">{s.val}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="fu d3 mb-4 px-4 py-2 rounded-xl text-xs"
            style={{
              background: 'var(--surface-strong)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-dim)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace',
              letterSpacing: '.04em',
            }}
          >
            SYS.STATUS // STATE={systemState} · ACCESS={rank.name} · RESTORED={restoredPct}% · SECTORS={unlockedModules}/{totalModules}
          </div>
          <div className="fu d3">
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Контур восстановления</span>
              {nextRank && <span>Следующий допуск: «{nextRank.name}» · {nextRank.minXP - progress.xp} XP</span>}
            </div>
            <ProgressBar value={doneM} max={totalM} />
          </div>
        </div>
      </div>

      {/* Module grid */}
      <div className="app-shell" style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((mod, idx) => {
            const unlocked    = isModuleUnlocked(mod, progress.completedMissions, MODULES);
            const done        = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
            const modComplete = done === mod.missions.length;
            const badgeEarned = progress.badges.includes(mod.badge.id);
            const hasImpl     = mod.missions.some(m => m.implemented);
            const isActive    = activeModule?.id === mod.id;
            const stateLabel  = modComplete
              ? 'RESTORED'
              : isActive
              ? 'PROCESSING'
              : unlocked
              ? 'AVAILABLE'
              : 'DEGRADED';
            return (
              <div
                key={mod.id}
                onClick={() => unlocked && onSelectModule(mod)}
                className={`card dashboard-module-card fu ${DL[idx] ?? ''} ${unlocked ? 'lift' : ''} ${!unlocked ? 'is-locked' : ''} ${modComplete ? 'is-restored' : ''} ${isActive ? 'is-active' : ''}`}
                style={{
                  '--module-accent': mod.accent,
                  opacity: unlocked ? 1 : 0.45,
                  padding: '1.25rem',
                  border: `1px solid ${modComplete ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                  pointerEvents: unlocked ? 'auto' : 'none',
                } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="dashboard-module-card__icon w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: unlocked ? `${mod.accent}14` : 'var(--surface-contrast)',
                      border: `1px solid ${unlocked ? mod.accent + '30' : 'var(--border-strong)'}`,
                    }}
                  >
                    {unlocked ? mod.icon : '🔒'}
                  </div>
                  <Badge badge={mod.badge} earned={badgeEarned} size="sm" />
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)', fontSize: '.62rem' }}>
                    {ARCHIVE_COPY.moduleLabel} {mod.id}
                  </span>
                  {modComplete && (
                    <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>восстановлен</span>
                  )}
                  {!hasImpl && (
                    <span className="tag" style={{ background: 'var(--accent-softer)', color: 'var(--accent)', fontSize: '.58rem' }}>ожидание</span>
                  )}
                </div>
                <h3 className="hf text-white font-bold text-sm leading-snug mb-0.5">{mod.title}</h3>
                <p className="text-slate-600 text-xs mb-3">{mod.subtitle}</p>
                <p className="dashboard-module-card__state mb-3">
                  STATE={stateLabel} · LOAD={done}/{mod.missions.length}
                </p>
                <div className="mb-1.5">
                  <ProgressBar value={done} max={mod.missions.length} color={mod.accent} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600">протоколы {done}/{mod.missions.length}</span>
                  <span className="text-xs font-semibold" style={{ color: mod.accent }}>⚡{mod.xpReward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
