import type { CSSProperties } from 'react';
import { HiOutlineBolt, HiOutlineLockClosed } from 'react-icons/hi2';
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

const DL = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12'];

export default function DashboardScreen({ progress, onSelectModule }: Props) {
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const totalModules = MODULES.length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const completedMissions = progress.completedMissions.length;
  const restoredPct = Math.round((completedMissions / totalMissions) * 100);
  const unlockedModules = MODULES.filter(mod => isModuleUnlocked(mod, progress, MODULES)).length;
  const activeModule = MODULES.find((mod) => {
    const unlocked = isModuleUnlocked(mod, progress, MODULES);
    const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
    return unlocked && done < mod.missions.length;
  }) ?? null;

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
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
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Карта модулей</p>
              <h1 className="hf text-3xl font-bold text-white">{ARCHIVE_COPY.appTitle}</h1>
              <p className="text-slate-500 mt-1 text-sm">
                {totalModules} модулей · {totalMissions} миссий · Учебный маршрут
              </p>
            </div>
            <div className="dashboard-screen__summary flex items-center gap-2 fu d2">
              {[
                { val: `${rank.icon} ${rank.name}`, sub: 'уровень' },
                { val: `${progress.xp} XP`, sub: 'опыт' },
                { val: `${completedMissions}/${totalMissions}`, sub: 'миссии' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card px-4 py-3 text-center"
                  style={{ minWidth: '90px', border: '1px solid var(--border-color)' }}
                >
                  <div className="hf text-white font-bold text-sm">{item.val}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-status fu d3 mb-4">
            Система: восстановлено {restoredPct}% · открытo модулей {unlockedModules}/{totalModules} · доступ {rank.name}
          </div>

          <div className="fu d3">
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>Общий прогресс</span>
              {nextRank && <span>До уровня «{nextRank.name}»: {nextRank.minXP - progress.xp} XP</span>}
            </div>
            <ProgressBar value={completedMissions} max={totalMissions} />
          </div>
        </div>
      </div>

      <div className="app-shell" style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <div className="dashboard-clean">
          <div className="dashboard-clean__intro card fu d2">
            <p className="dashboard-clean__intro-kicker">Маршрут обучения</p>
            <h2 className="dashboard-clean__intro-title hf">Выберите модуль</h2>
            <p className="dashboard-clean__intro-copy">
              Начните с первого доступного модуля и двигайтесь дальше по порядку. Завершённые модули сохраняют ваш результат.
            </p>
          </div>

          <div className="dashboard-clean__grid">
            {MODULES.map((mod, idx) => {
              const unlocked = isModuleUnlocked(mod, progress, MODULES);
              const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
              const modComplete = done === mod.missions.length;
              const badgeEarned = progress.badges.includes(mod.badge.id);
              const hasImpl = mod.missions.some(m => m.implemented);
              const isActive = activeModule?.id === mod.id;

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => unlocked && onSelectModule(mod)}
                  className={`card dashboard-module-simple fu ${DL[idx] ?? ''} ${unlocked ? 'lift' : ''} ${!unlocked ? 'is-locked' : ''} ${modComplete ? 'is-restored' : ''} ${isActive ? 'is-active' : ''}`}
                  style={{
                    '--module-accent': mod.accent,
                    opacity: unlocked ? 1 : 0.56,
                    border: `1px solid ${modComplete ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                    pointerEvents: unlocked ? 'auto' : 'none',
                  } as CSSProperties}
                >
                  <div className="dashboard-module-simple__head">
                    <div
                      className="dashboard-module-simple__icon"
                      style={{
                        background: unlocked ? `${mod.accent}14` : 'var(--surface-contrast)',
                        border: `1px solid ${unlocked ? `${mod.accent}30` : 'var(--border-strong)'}`,
                      }}
                    >
                      {unlocked ? mod.icon : <HiOutlineLockClosed className="text-[1.1rem] text-slate-500" aria-hidden="true" />}
                    </div>
                    <Badge badge={mod.badge} earned={badgeEarned} size="sm" />
                  </div>

                  <div className="dashboard-module-simple__tags">
                    <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)', fontSize: '.62rem' }}>
                      Модуль {mod.id}
                    </span>
                    {modComplete && (
                      <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)', fontSize: '.58rem' }}>
                        Завершён
                      </span>
                    )}
                    {isActive && (
                      <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: '.58rem' }}>
                        Текущий
                      </span>
                    )}
                    {!hasImpl && (
                      <span className="tag" style={{ background: 'var(--accent-softer)', color: 'var(--accent)', fontSize: '.58rem' }}>
                        Скоро
                      </span>
                    )}
                  </div>

                  <h3 className="dashboard-module-simple__title hf">{mod.title}</h3>
                  <p className="dashboard-module-simple__subtitle">{mod.subtitle}</p>

                  <div className="dashboard-module-simple__progress">
                    <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                      <span>{done}/{mod.missions.length} миссий</span>
                      <span className="inline-flex items-center gap-1" style={{ color: mod.accent }}>
                        <HiOutlineBolt aria-hidden="true" />
                        {mod.xpReward} XP
                      </span>
                    </div>
                    <ProgressBar value={done} max={mod.missions.length} color={mod.accent} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
