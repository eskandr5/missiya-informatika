import {
  LuArrowRight,
  LuCircleCheck,
  LuChevronRight,
  LuHeadphones,
  LuLock,
  LuPlay,
  LuStar,
  LuTarget,
  LuTrendingUp,
  LuZap,
} from 'react-icons/lu';
import { MODULES } from '../data/modules';
import { getNextRank, getRank } from '../data/ranks';
import type { Progress } from '../types/progress';

interface Props {
  progress: Progress;
  onStart: () => void;
}

type PreviewStatus = 'completed' | 'active' | 'locked';

const SOCIAL_COLORS = ['#059669', '#2563eb', '#7c3aed', '#d97706'] as const;

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('');
}

interface AppMockupProps {
  activeModuleTitle: string;
  activeModuleId: number;
  activeDone: number;
  activeTotal: number;
  activePct: number;
  previewModules: Array<{
    id: number;
    title: string;
    status: PreviewStatus;
  }>;
  xpReward: number;
  rankName: string;
  rankProgressPct: number;
}

function AppMockup({
  activeModuleTitle,
  activeModuleId,
  activeDone,
  activeTotal,
  activePct,
  previewModules,
  xpReward,
  rankName,
  rankProgressPct,
}: AppMockupProps) {
  return (
    <div className="landing-v2__mockup">
      <div className="landing-v2__mockup-frame">
        <div className="landing-v2__mockup-topbar">
          <div className="landing-v2__mockup-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="landing-v2__mockup-url">миссия-информатика/dashboard</div>
        </div>

        <div className="landing-v2__mockup-body">
          <div className="landing-v2__mockup-continue">
            <div className="landing-v2__mockup-pill">
              <span className="landing-v2__mockup-pill-dot" aria-hidden="true" />
              <span>АКТИВНЫЙ РАЗДЕЛ</span>
            </div>

            <p className="landing-v2__mockup-kicker">МОДУЛЬ {activeModuleId}</p>
            <h3 className="landing-v2__mockup-title">{activeModuleTitle}</h3>

            <div className="landing-v2__mockup-progress">
              <div className="landing-v2__mockup-progress-bar" aria-hidden="true">
                <div
                  className="landing-v2__mockup-progress-fill"
                  style={{ width: `${activePct}%` }}
                />
              </div>

              <div className="landing-v2__mockup-progress-meta">
                <span>{activeDone}/{activeTotal} миссии</span>
                <span>{activePct}%</span>
              </div>
            </div>

            <div className="landing-v2__mockup-button">
              <span>Продолжить</span>
              <LuArrowRight aria-hidden="true" />
            </div>
          </div>

          <div className="landing-v2__mockup-grid">
            {previewModules.map(module => (
              <div
                key={module.id}
                className={`landing-v2__mini-card is-${module.status}`}
              >
                <div className="landing-v2__mini-card-icon" aria-hidden="true">
                  {module.status === 'completed' ? (
                    <LuCircleCheck />
                  ) : module.status === 'active' ? (
                    <span className="landing-v2__mini-card-dot" />
                  ) : (
                    <LuLock />
                  )}
                </div>
                <p>{module.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="landing-v2__floating-card landing-v2__floating-card--xp">
        <div className="landing-v2__floating-top">
          <LuZap aria-hidden="true" />
          <span>+{xpReward} XP</span>
        </div>
        <p>Награда за текущий раздел</p>
        <div className="landing-v2__floating-track" aria-hidden="true">
          <div
            className="landing-v2__floating-fill"
            style={{ width: `${Math.max(rankProgressPct, 18)}%` }}
          />
        </div>
      </div>

      <div className="landing-v2__floating-card landing-v2__floating-card--rank">
        <span className="landing-v2__floating-label">УРОВЕНЬ</span>
        <div className="landing-v2__floating-rank">
          <span className="landing-v2__floating-rank-icon" aria-hidden="true">★</span>
          <strong>{rankName}</strong>
        </div>
      </div>
    </div>
  );
}

export default function LandingScreen({ progress, onStart }: Props) {
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const returning = progress.completedMissions.length > 0;

  const totalModules = MODULES.length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const totalVocabulary = MODULES.reduce((sum, mod) => sum + mod.vocab.length + mod.phrases.length, 0);
  const restoredPct = totalMissions === 0
    ? 0
    : Math.round((progress.completedMissions.length / totalMissions) * 100);

  const activeModule = MODULES.find(
    module => module.missions.some(mission => !progress.completedMissions.includes(mission.id)),
  ) ?? MODULES[MODULES.length - 1];

  const activeDone = activeModule.missions.filter(
    mission => progress.completedMissions.includes(mission.id),
  ).length;
  const activePct = Math.round((activeDone / activeModule.missions.length) * 100);

  const rankProgressPct = nextRank
    ? Math.round(((progress.xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)
    : 100;

  const previewStart = Math.min(
    Math.max(activeModule.id - 2, 0),
    Math.max(MODULES.length - 3, 0),
  );

  const previewModules = MODULES.slice(previewStart, previewStart + 3).map(module => {
    const completed = module.missions.every(mission => progress.completedMissions.includes(mission.id));
    const status: PreviewStatus = completed
      ? 'completed'
      : module.id === activeModule.id
        ? 'active'
        : module.id > activeModule.id
          ? 'locked'
          : 'completed';

    return {
      id: module.id,
      title: module.title,
      status,
    };
  });

  const socialModules = MODULES.slice(0, 4).map(module => getInitials(module.title));

  const features = [
    {
      icon: LuTarget,
      title: 'Всегда понятен следующий шаг',
      description: 'Каждый модуль выстроен по маршруту: теория, лексика, миссии и закрепление результата.',
      tone: 'emerald',
    },
    {
      icon: LuHeadphones,
      title: 'Русский язык через аудио и контекст',
      description: 'Фразы, термины и короткие задания помогают быстрее привыкнуть к профессиональной речи.',
      tone: 'blue',
    },
    {
      icon: LuTrendingUp,
      title: 'XP, звания и ощущение прогресса',
      description: 'После каждой миссии система сохраняет результат и показывает, как вы растёте по курсу.',
      tone: 'amber',
    },
  ] as const;

  const steps = [
    {
      num: '01',
      title: 'Выберите раздел',
      description: `${totalModules} модулей по информатике идут от основ к практике без разрывов между темами.`,
      tone: 'emerald',
    },
    {
      num: '02',
      title: 'Пройдите миссии',
      description: 'Сопоставления, аудио, тесты и практические сценарии удерживают внимание и закрепляют лексику.',
      tone: 'blue',
    },
    {
      num: '03',
      title: 'Закрепите результат',
      description: 'Опыт, завершённые этапы и новые звания автоматически сохраняются в вашем профиле.',
      tone: 'amber',
    },
  ] as const;

  const handleExplore = () => {
    document.getElementById('landing-v2-overview')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="app-page landing-v2">
      <section className="landing-v2__hero">
        <div className="landing-v2__container landing-v2__hero-grid">
          <div className="landing-v2__copy">
            <div className="landing-v2__eyebrow">
              <span className="landing-v2__eyebrow-dot" aria-hidden="true" />
              <span>УЧЕБНАЯ ПЛАТФОРМА · ИНФОРМАТИКА</span>
            </div>

            <h1 className="landing-v2__title">
              Освой информатику.
              <span> Шаг за шагом.</span>
            </h1>

            <p className="landing-v2__lead">
              Интерактивная платформа для иностранных студентов подготовительного отделения.
              Термины, задания, аудио и миссии собраны в одном понятном маршруте.
            </p>

            <div className="landing-v2__actions">
              <button
                type="button"
                onClick={onStart}
                className="btn landing-v2__button landing-v2__button--primary"
              >
                <span>{returning ? 'Продолжить обучение' : 'Начать бесплатно'}</span>
                <LuArrowRight aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleExplore}
                className="btn landing-v2__button landing-v2__button--secondary"
              >
                <span>Посмотреть программу</span>
                <LuChevronRight aria-hidden="true" />
              </button>
            </div>

            <div className="landing-v2__proof">
              <div className="landing-v2__proof-avatars" aria-hidden="true">
                {socialModules.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    style={{ backgroundColor: SOCIAL_COLORS[index % SOCIAL_COLORS.length] }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="landing-v2__proof-copy">
                <div className="landing-v2__proof-stars" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <LuStar key={index} />
                  ))}
                </div>

                <p>
                  <strong>{totalVocabulary}</strong> терминов и формулировок уже собраны в курсе
                </p>
              </div>
            </div>
          </div>

          <div className="landing-v2__visual">
            <AppMockup
              activeModuleTitle={activeModule.title}
              activeModuleId={activeModule.id}
              activeDone={activeDone}
              activeTotal={activeModule.missions.length}
              activePct={activePct}
              previewModules={previewModules}
              xpReward={activeModule.xpReward}
              rankName={rank.name}
              rankProgressPct={rankProgressPct}
            />
          </div>
        </div>
      </section>

      <section id="landing-v2-overview" className="landing-v2__stats-bar">
        <div className="landing-v2__container landing-v2__stats-grid">
          <article className="landing-v2__stat">
            <strong>{totalModules}</strong>
            <span>модулей курса</span>
          </article>

          <article className="landing-v2__stat">
            <strong>{totalMissions}</strong>
            <span>интерактивных миссий</span>
          </article>

          <article className="landing-v2__stat">
            <strong>{totalVocabulary}</strong>
            <span>терминов и фраз</span>
          </article>

          <article className="landing-v2__stat">
            <strong>{restoredPct}%</strong>
            <span>ваш текущий прогресс</span>
          </article>
        </div>
      </section>

      <section className="landing-v2__section landing-v2__section--support">
        <div className="landing-v2__container">
          <div className="landing-v2__support-panel">
            <div className="landing-v2__support-content">
              <div className="landing-v2__section-head landing-v2__support-head">
                <p>ПРИНЦИПЫ ПЛАТФОРМЫ</p>
                <h2>Создано для реального результата</h2>
              </div>

              <p className="landing-v2__support-copy">
                Каждый модуль объединяет лексику, аудио, видео и практические задания в понятный маршрут.
                Учитесь по шагам и видите прогресс после каждой миссии.
              </p>
            </div>
          </div>

          <div className="landing-v2__features">
            {features.map(feature => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className={`landing-v2__feature-card is-${feature.tone}`}>
                  <div className="landing-v2__feature-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>


      <section className="landing-v2__section landing-v2__section--light">
        <div className="landing-v2__container">
          <div className="landing-v2__section-head">
            <p>КАК ЭТО РАБОТАЕТ</p>
            <h2>Три шага к знаниям</h2>
          </div>

          <div className="landing-v2__steps">
            {steps.map(step => (
              <article key={step.num} className={`landing-v2__step-card is-${step.tone}`}>
                <span className="landing-v2__step-number">{step.num}</span>
                <div className="landing-v2__step-title-row">
                  <i aria-hidden="true" />
                  <h3>{step.title}</h3>
                </div>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-v2__section">
        <div className="landing-v2__container">
          <div className="landing-v2__cta">
            <div className="landing-v2__cta-icon" aria-hidden="true">
              <LuZap />
            </div>

            <h2>{returning ? 'Продолжите с того места, где остановились' : 'Начните обучение прямо сейчас'}</h2>
            <p>
              {returning
                ? `Сейчас активен модуль ${activeModule.id}. Ваше звание: ${rank.name}.`
                : `Курс уже включает ${totalModules} модулей и ${totalMissions} миссий для пошагового изучения.`}
              {nextRank ? ` До следующего звания осталось ${Math.max(nextRank.minXP - progress.xp, 0)} XP.` : ' Все звания уже открыты.'}
            </p>

            <div className="landing-v2__cta-actions">
              <button
                type="button"
                onClick={onStart}
                className="btn landing-v2__button landing-v2__button--primary"
              >
                <span>{returning ? 'Открыть карту модулей' : 'Войти в систему'}</span>
                <LuArrowRight aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleExplore}
                className="btn landing-v2__button landing-v2__button--ghost"
              >
                <LuPlay aria-hidden="true" />
                <span>Сначала посмотреть детали</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-v2__footer">
        <div className="landing-v2__container landing-v2__footer-row">
          <div className="landing-v2__footer-brand">
            <span className="landing-v2__footer-badge" aria-hidden="true">
              <LuZap />
            </span>
            <strong>МИССИЯ:ИНФОРМАТИКА</strong>
          </div>

          <p>
            Интерактивная платформа для подготовительного отделения · модуль {activeModule.id} активен
          </p>
        </div>
      </footer>
    </div>
  );
}
