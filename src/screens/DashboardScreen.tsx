import type { CSSProperties } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineChartBar,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
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

  const activeModuleDone = activeModule
    ? activeModule.missions.filter(m => progress.completedMissions.includes(m.id)).length
    : 0;

  return (
    <div className="app-page dashboard-screen min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      <header className="dashboard-header">
        <div className="app-shell">
          <div className="dashboard-overview">
            <div className="dashboard-overview__copy fu">
              <p className="dashboard-overview__kicker">{ARCHIVE_COPY.appTitle}</p>
              <h1 className="dashboard-overview__title hf">{ARCHIVE_COPY.dashboardTitle}</h1>
              <p className="dashboard-overview__text">
                {totalModules} модулей, {totalMissions} миссий и последовательный учебный маршрут по информатике.
              </p>
            </div>

            <div className="dashboard-overview__panel card fu d2">
              <div className="dashboard-overview__stats">
                <div className="dashboard-overview__stat">
                  <span className="dashboard-overview__stat-icon" aria-hidden="true">
                    <HiOutlineShieldCheck />
                  </span>
                  <span className="dashboard-overview__stat-value hf">{rank.icon} {rank.name}</span>
                  <span className="dashboard-overview__stat-label">текущий доступ</span>
                </div>
                <div className="dashboard-overview__stat">
                  <span className="dashboard-overview__stat-icon" aria-hidden="true">
                    <HiOutlineBolt />
                  </span>
                  <span className="dashboard-overview__stat-value hf">{progress.xp} XP</span>
                  <span className="dashboard-overview__stat-label">накопленный опыт</span>
                </div>
                <div className="dashboard-overview__stat">
                  <span className="dashboard-overview__stat-icon" aria-hidden="true">
                    <HiOutlineChartBar />
                  </span>
                  <span className="dashboard-overview__stat-value hf">{completedMissions}/{totalMissions}</span>
                  <span className="dashboard-overview__stat-label">выполнено миссий</span>
                </div>
              </div>

              <div className="dashboard-overview__progress">
                <div className="dashboard-overview__progress-head">
                  <span>Общий прогресс</span>
                  {nextRank ? (
                    <span>До уровня «{nextRank.name}»: {nextRank.minXP - progress.xp} XP</span>
                  ) : (
                    <span>Максимальный уровень достигнут</span>
                  )}
                </div>
                <ProgressBar value={completedMissions} max={totalMissions} />
              </div>
            </div>
          </div>

          <div className="dashboard-status-row fu d3">
            <div className="dashboard-status-item">
              <span className="dashboard-status-item__label">Восстановлено</span>
              <strong>{restoredPct}%</strong>
            </div>
            <div className="dashboard-status-item">
              <span className="dashboard-status-item__label">Открыто разделов</span>
              <strong>{unlockedModules}/{totalModules}</strong>
            </div>
            <div className="dashboard-status-item">
              <span className="dashboard-status-item__label">Статус маршрута</span>
              <strong>{activeModule ? `Раздел ${activeModule.id} активен` : 'Все доступные разделы завершены'}</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="app-shell">
          <div className="dashboard-clean">
            <section className="dashboard-clean__intro card fu d2">
              <div>
                <p className="dashboard-clean__intro-kicker">Маршрут обучения</p>
                <h2 className="dashboard-clean__intro-title hf">
                  {activeModule ? 'Продолжайте текущий раздел' : 'Выберите модуль'}
                </h2>
                <p className="dashboard-clean__intro-copy">
                  Начните с первого доступного модуля и двигайтесь дальше по порядку. Завершённые модули сохраняют ваш результат.
                </p>
              </div>

              <div className="dashboard-clean__callout">
                <p className="dashboard-clean__callout-label">
                  {activeModule ? 'Текущий фокус' : 'Состояние маршрута'}
                </p>
                <h3 className="dashboard-clean__callout-title hf">
                  {activeModule
                    ? `Модуль ${activeModule.id}. ${activeModule.title}`
                    : 'Маршрут по доступным разделам завершён'}
                </h3>
                <p className="dashboard-clean__callout-copy">
                  {activeModule
                    ? `${activeModuleDone} из ${activeModule.missions.length} миссий уже зафиксировано. Активный раздел подсвечен в сетке ниже.`
                    : 'Вы завершили все доступные задания. Можно повторять разделы и закреплять результат.'}
                </p>
              </div>
            </section>

            <div className="dashboard-section-head fu d3">
              <div>
                <p className="dashboard-section-head__kicker">Доступные разделы</p>
                <h2 className="dashboard-section-head__title hf">Карта модулей</h2>
              </div>
              <p className="dashboard-section-head__copy">
                Текущий раздел выделен для быстрого продолжения. Остальные модули сохраняют порядок маршрута.
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

                let stateLabel: string | null = null;
                let stateBackground = 'var(--surface-strong)';
                let stateColor = 'var(--text-dim)';
                let statusCopy = 'Раздел готов к изучению.';

                if (!unlocked) {
                  stateLabel = 'Закрыт';
                  statusCopy = 'Откроется после предыдущих разделов.';
                } else if (!hasImpl) {
                  stateLabel = 'Скоро';
                  stateBackground = 'var(--accent-softer)';
                  stateColor = 'var(--accent)';
                  statusCopy = 'Материалы этого раздела готовятся к публикации.';
                } else if (modComplete) {
                  stateLabel = 'Завершён';
                  stateBackground = 'var(--success-soft)';
                  stateColor = 'var(--success-color)';
                  statusCopy = 'Все задания завершены и сохранены.';
                } else if (isActive) {
                  stateLabel = 'Текущий';
                  stateBackground = 'var(--accent-soft)';
                  stateColor = 'var(--accent)';
                  statusCopy = 'Продолжайте обучение с этого раздела.';
                }

                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => unlocked && onSelectModule(mod)}
                    className={`card dashboard-module-simple fu ${DL[idx] ?? ''} ${unlocked ? 'lift' : ''} ${!unlocked ? 'is-locked' : ''} ${modComplete ? 'is-restored' : ''} ${isActive ? 'is-active' : ''}`}
                    style={{
                      '--module-accent': mod.accent,
                      opacity: unlocked ? 1 : 0.58,
                      border: `1px solid ${modComplete ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                      pointerEvents: unlocked ? 'auto' : 'none',
                    } as CSSProperties}
                  >
                    <div className="dashboard-module-simple__head">
                      <div className="dashboard-module-simple__identity">
                        <div
                          className="dashboard-module-simple__icon"
                          style={{
                            background: unlocked ? `${mod.accent}14` : 'var(--surface-contrast)',
                            border: `1px solid ${unlocked ? `${mod.accent}30` : 'var(--border-strong)'}`,
                          }}
                        >
                          {unlocked ? mod.icon : <HiOutlineLockClosed className="text-[1.1rem] text-slate-500" aria-hidden="true" />}
                        </div>
                        <div className="dashboard-module-simple__eyebrow-group">
                          <p className="dashboard-module-simple__eyebrow">Модуль {mod.id}</p>
                          <p className="dashboard-module-simple__count">{mod.missions.length} {ARCHIVE_COPY.missionLabelPlural}</p>
                        </div>
                      </div>

                      <div className="dashboard-module-simple__aside">
                        {stateLabel && (
                          <span
                            className="dashboard-module-simple__state"
                            style={{ background: stateBackground, color: stateColor }}
                          >
                            {stateLabel}
                          </span>
                        )}
                        <Badge badge={mod.badge} earned={badgeEarned} size="sm" showName={false} />
                      </div>
                    </div>

                    <div className="dashboard-module-simple__body">
                      <h3 className="dashboard-module-simple__title hf">{mod.title}</h3>
                      <p className="dashboard-module-simple__subtitle">{mod.subtitle}</p>
                    </div>

                    <div className="dashboard-module-simple__footer">
                      <p className="dashboard-module-simple__status-copy">{statusCopy}</p>
                      <div className="dashboard-module-simple__progress-row">
                        <span>{done}/{mod.missions.length} миссий</span>
                        <span className="dashboard-module-simple__xp">
                          <HiOutlineBolt aria-hidden="true" />
                          {mod.xpReward} XP
                        </span>
                      </div>
                      <ProgressBar value={done} max={mod.missions.length} color={mod.accent} />
                      {isActive && (
                        <span className="dashboard-module-simple__continue">
                          Продолжить
                          <HiOutlineArrowRight aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
