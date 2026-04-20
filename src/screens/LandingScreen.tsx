import {
  HiOutlineArrowRight,
  HiOutlineBookOpen,
  HiOutlineQueueList,
  HiOutlineRectangleStack,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { MODULES } from '../data/modules';
import { getRank } from '../data/ranks';
import { ARCHIVE_COPY } from '../data/archiveTerminology';
import type { Progress } from '../types/progress';

interface Props {
  progress: Progress;
  onStart: () => void;
}

const SUPPORT_CARDS = [
  {
    icon: HiOutlineBookOpen,
    title: 'Архив терминов',
    description: 'Ключевые понятия и краткие определения для спокойного входа в каждый учебный раздел.',
  },
  {
    icon: HiOutlineQueueList,
    title: 'Практические протоколы',
    description: 'Сопоставления, последовательности, аудио-задачи и другие форматы для закрепления материала.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Контроль и фиксация',
    description: 'Опыт, результаты и статус доступа автоматически обновляются по мере прохождения маршрута.',
  },
] as const;

export default function LandingScreen({ progress, onStart }: Props) {
  const rank = getRank(progress.xp);
  const returning = progress.completedMissions.length > 0;
  const totalModules = MODULES.length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const restoredPct = Math.round((progress.completedMissions.length / totalMissions) * 100);

  return (
    <div className="app-page landing-page">
      <section className="hero landing-page__hero">
        <div className="landing-page__hero-grid">
          <div className="hero__content landing-page__hero-copy">
            <div className="hero__kicker">{ARCHIVE_COPY.appKicker}</div>
            <h1 className="hero__title landing-page__hero-title">
              Архив: <span>Информатика</span>
            </h1>
            <p className="hero__text">
              Подготовительный курс теперь начинается в той же визуальной системе, что и весь
              реестр модулей. Здесь вы переходите в общий маршрут, где разделы, слова, формулировки
              и миссии работают как единая учебная среда.
            </p>

            <div className="landing-page__hero-actions">
              <button type="button" onClick={onStart} className="btn btn-primary landing-page__cta">
                <span>{returning ? 'Продолжить обучение' : 'Открыть учебный маршрут'}</span>
                <HiOutlineArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="landing-page__hero-panel">
            <div className="landing-page__panel landing-page__panel--glass">
              <p className="landing-page__panel-label">Текущий протокол</p>
              <h2 className="landing-page__panel-title">
                Восстановить {totalModules} {ARCHIVE_COPY.moduleLabelPlural}
              </h2>
              <p className="landing-page__panel-copy">
                Осваивайте темы последовательно, закрепляйте лексику и переходите к следующему
                уровню допуска через интерактивные задания.
              </p>

              <div className="landing-page__status-bar">
                <div className="landing-page__status-bar-head">
                  <span>Готовность маршрута</span>
                  <strong>{restoredPct}%</strong>
                </div>
                <div className="module-card__progress-bar">
                  <div
                    className="module-card__progress-fill"
                    style={{ width: `${restoredPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid--4 landing-page__stats">
        <div className="stats-card">
          <div className="stats-card__icon">🔥</div>
          <div className="stats-card__value">{progress.xp}</div>
          <div className="stats-card__label">Очки опыта</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">🏆</div>
          <div className="stats-card__value">{rank.name}</div>
          <div className="stats-card__label">Текущий доступ</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">✓</div>
          <div className="stats-card__value">{progress.completedMissions.length}</div>
          <div className="stats-card__label">Протоколов завершено</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">%</div>
          <div className="stats-card__value">{restoredPct}%</div>
          <div className="stats-card__label">Общий прогресс</div>
        </div>
      </div>

      <div className="grid grid--2 landing-page__briefing">
        <section className="landing-page__panel">
          <p className="landing-page__panel-label">Стартовая задача</p>
          <h2 className="landing-page__section-title">Соберите единый учебный контур</h2>
          <p className="landing-page__panel-copy">
            Каждый модуль сочетает базовую теорию, набор терминов, короткие формулировки и серию
            практических миссий. Благодаря этому стартовая страница и рабочие разделы теперь
            выглядят как части одного продукта.
          </p>

          <div className="landing-page__inline-stats">
            <span>
              <strong>{totalModules}</strong>
              <span>{ARCHIVE_COPY.moduleLabelPlural}</span>
            </span>
            <span>
              <strong>{totalMissions}</strong>
              <span>{ARCHIVE_COPY.missionLabelPlural}</span>
            </span>
            <span>
              <strong>{MODULES[0]?.title}</strong>
              <span>первый раздел</span>
            </span>
          </div>
        </section>

        <section className="landing-page__panel landing-page__panel--accent">
          <p className="landing-page__panel-label">Статус оператора</p>
          <h2 className="landing-page__section-title">
            {rank.icon} {rank.name}
          </h2>
          <p className="landing-page__panel-copy">
            {returning
              ? 'Прогресс уже сохранён. Можно вернуться в реестр и продолжить с открытых разделов.'
              : 'После первого задания система начнёт учитывать опыт, открытые разделы и результаты миссий.'}
          </p>

          <div className="landing-page__inline-stats">
            <span>
              <strong>{progress.xp} XP</strong>
              <span>накоплено</span>
            </span>
            <span>
              <strong>{restoredPct}%</strong>
              <span>освоено</span>
            </span>
            <span>
              <strong>{progress.completedMissions.length}</strong>
              <span>миссий закрыто</span>
            </span>
          </div>
        </section>
      </div>

      <section className="landing-page__resources">
        <div className="page-header landing-page__resources-head">
          <div className="page-header__content">
            <h2 className="page-header__title">Что внутри платформы</h2>
            <p className="page-header__subtitle">
              Страница входа теперь не выбивается из общего языка интерфейса и повторяет те же
              карточки, сетки и акценты, что и экран с модулями.
            </p>
          </div>
        </div>

        <div className="grid grid--3">
          {SUPPORT_CARDS.map(({ icon: Icon, title, description }) => (
            <article key={title} className="landing-page__resource-card">
              <div className="landing-page__resource-icon" aria-hidden="true">
                <Icon />
              </div>
              <h3 className="landing-page__resource-title">{title}</h3>
              <p className="landing-page__resource-copy">{description}</p>
            </article>
          ))}
        </div>

        <div className="landing-page__panel">
          <p className="landing-page__panel-label">Навигация по курсу</p>
          <h2 className="landing-page__section-title">Единая логика от старта до миссий</h2>
          <p className="landing-page__panel-copy">
            После входа вы попадаете в тот же реестр разделов, где каждая карточка модуля, вкладка
            с терминами и список заданий продолжают тот же визуальный ритм.
          </p>
          <div className="landing-page__inline-stats">
            <span>
              <strong>
                <HiOutlineRectangleStack aria-hidden="true" />
              </strong>
              <span>модульные карточки</span>
            </span>
            <span>
              <strong>
                <HiOutlineQueueList aria-hidden="true" />
              </strong>
              <span>структурированные вкладки</span>
            </span>
            <span>
              <strong>
                <HiOutlineShieldCheck aria-hidden="true" />
              </strong>
              <span>единый стиль прогресса</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
