import {
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

import { MODULES } from '../data/modules';
import type { Module } from '../types/content';
import type { Progress } from '../types/progress';
import { isModuleUnlocked } from '../utils/progression';

interface Props {
  progress: Progress;
  onSelectModule: (module: Module) => void;
}

export default function DashboardScreenNew({ progress, onSelectModule }: Props) {
  const unlockedModules = MODULES.filter(module => isModuleUnlocked(module, progress, MODULES));
  const completedModules = MODULES.filter(
    module => module.missions.every(mission => progress.completedMissions.includes(mission.id)),
  ).length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const activeModule =
    unlockedModules.find(module => !module.missions.every(mission => progress.completedMissions.includes(mission.id)))
    ?? unlockedModules[unlockedModules.length - 1]
    ?? MODULES[0];

  const activeDone = activeModule.missions.filter(mission => progress.completedMissions.includes(mission.id)).length;
  const activePct = Math.round((activeDone / activeModule.missions.length) * 100);

  return (
    <div className="app-page dashboard-latest">
      <header className="dashboard-latest__intro">
        <p className="dashboard-latest__hello">Добрый день 👋</p>
        <h1 className="dashboard-latest__heading">Карта модулей</h1>
      </header>

      <section className="dashboard-latest__spotlight">
        <div className="dashboard-latest__spotlight-main">
          <span className="dashboard-latest__spotlight-pill">Активный раздел</span>
          <p className="dashboard-latest__spotlight-index">Модуль {activeModule.id}</p>
          <h2 className="dashboard-latest__spotlight-title">{activeModule.title}</h2>
          <p className="dashboard-latest__spotlight-copy">{activeModule.subtitle}</p>

          <div className="dashboard-latest__spotlight-progress">
            <div className="dashboard-latest__spotlight-progress-head">
              <span>Прогресс раздела</span>
              <strong>{activeDone}/{activeModule.missions.length} миссий · {activePct}%</strong>
            </div>

            <div className="module-card__progress-bar dashboard-latest__spotlight-bar">
              <div
                className="module-card__progress-fill dashboard-latest__spotlight-fill"
                style={{ width: `${activePct}%` }}
              />
            </div>
          </div>

          <button type="button" className="btn dashboard-latest__spotlight-cta" onClick={() => onSelectModule(activeModule)}>
            <span>Продолжить</span>
            <HiOutlineArrowRight aria-hidden="true" />
          </button>
        </div>

        <aside className="dashboard-latest__spotlight-stats">
          <article className="dashboard-latest__mini-stat">
            <span className="dashboard-latest__mini-icon is-gold" aria-hidden="true">
              <HiOutlineBolt />
            </span>
            <strong>{progress.xp.toLocaleString('en-US')}</strong>
            <span>накоплено XP</span>
          </article>

          <article className="dashboard-latest__mini-stat">
            <span className="dashboard-latest__mini-icon is-emerald" aria-hidden="true">
              <HiOutlineCheckCircle />
            </span>
            <strong>{progress.completedMissions.length}/{totalMissions}</strong>
            <span>выполнено</span>
          </article>

          <article className="dashboard-latest__mini-stat">
            <span className="dashboard-latest__mini-icon is-cyan" aria-hidden="true">
              <HiOutlineBookOpen />
            </span>
            <strong>{unlockedModules.length}/{MODULES.length}</strong>
            <span>модулей открыто</span>
          </article>

          <article className="dashboard-latest__mini-stat">
            <span className="dashboard-latest__mini-icon is-blue" aria-hidden="true">
              <HiOutlineShieldCheck />
            </span>
            <strong>{completedModules}/{MODULES.length}</strong>
            <span>модулей завершено</span>
          </article>
        </aside>
      </section>

      <section className="dashboard-latest__modules">
        <div className="dashboard-latest__modules-head">
          <div>
            <h2>Карта модулей</h2>
            <p>{MODULES.length} разделов · {completedModules} завершено</p>
          </div>

          <div className="dashboard-latest__legend">
            <span><i className="is-complete" />Завершён</span>
            <span><i className="is-active" />Активный</span>
            <span><i className="is-locked" />Закрыт</span>
          </div>
        </div>

        <div className="grid grid--3 dashboard-latest__grid">
          {MODULES.map((module) => {
            const unlocked = isModuleUnlocked(module, progress, MODULES);
            const completed = module.missions.every(m => progress.completedMissions.includes(m.id));
            const done = module.missions.filter(m => progress.completedMissions.includes(m.id)).length;
            const isActive = module.id === activeModule.id;

            return (
              <button
                key={module.id}
                type="button"
                className={`module-card${isActive ? ' is-active' : ''}`}
                onClick={() => unlocked && onSelectModule(module)}
                style={{
                  opacity: unlocked ? 1 : 0.64,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  pointerEvents: unlocked ? 'auto' : 'none',
                  textAlign: 'left',
                  padding: 0,
                }}
              >
                <div
                  className="module-card__image"
                  style={{
                    backgroundColor: module.accent,
                    backgroundImage: module.coverImage ? `url(${module.coverImage})` : undefined,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="module-card__number">{String(module.id).padStart(2, '0')}</div>

                  {completed && (
                    <div className="status-badge completed">Завершено</div>
                  )}

                  {!completed && unlocked && (
                    <div className="status-badge active">Активно</div>
                  )}

                  {!unlocked && (
                    <div className="status-badge locked">Закрыто</div>
                  )}
                </div>

                <div className="module-card__content">
                  <div className="module-card__tag">Module {module.id}</div>
                  <h3 className="module-card__title">{module.title}</h3>
                  <p className="module-card__description">
                    {module.desc || 'Изучите ключевые темы модуля через практические задания и интерактивные миссии.'}
                  </p>

                  <div className="module-card__stats">
                    <div className="module-card__stat">
                      <div className="module-card__stat-value">{done}</div>
                      <div className="module-card__stat-label">из {module.missions.length}</div>
                    </div>

                    <div className="module-card__stat">
                      <div className="module-card__stat-value">
                        {Math.round((done / module.missions.length) * 100)}%
                      </div>
                      <div className="module-card__stat-label">готово</div>
                    </div>
                  </div>

                  <div className="module-card__progress">
                    <div className="module-card__progress-bar">
                      <div
                        className="module-card__progress-fill"
                        style={{ width: `${(done / module.missions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
