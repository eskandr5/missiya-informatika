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
    description: 'Ключевые понятия и английские соответствия для поэтапного восстановления разделов',
  },
  {
    icon: HiOutlineQueueList,
    title: 'Исполнительные контуры',
    description: 'Сопоставление, последовательности, классификация, коррекция и другие рабочие режимы',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Допуск и фиксация',
    description: 'XP, уровни допуска, архивные знаки и сводка состояния по всему реестру',
  },
] as const;

export default function LandingScreen({ progress, onStart }: Props) {
  const rank = getRank(progress.xp);
  const returning = progress.completedMissions.length > 0;
  const totalModules = MODULES.length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const restoredPct = Math.round((progress.completedMissions.length / totalMissions) * 100);

  return (
    <div className="app-page landing-screen min-h-screen bg-grid">
      <section className="landing-hero">
        <div className="app-shell app-shell--narrow">
          <div className="landing-hero__panel">
            <div className="landing-hero__badge fu">
              <span className="landing-hero__badge-mark" aria-hidden="true" />
              <span>{ARCHIVE_COPY.appKicker}</span>
            </div>

            <div className="landing-hero__copy fu d1">
              <h1 className="landing-hero__title hf">
                АРХИВ:
                <span className="landing-hero__title-accent"> Информатика</span>
              </h1>
              <p className="landing-hero__lead">
                Интерфейс восстановления архивного корпуса по информатике. Разделы возвращаются в рабочее состояние последовательно: через термины, формулировки и исполнительные протоколы.
              </p>
            </div>

            <div className="landing-hero__support fu d2">
              <div className="landing-hero__task card">
                <p className="landing-hero__task-label">Текущая задача</p>
                <p className="landing-hero__task-copy">
                  Восстановить {totalModules} {ARCHIVE_COPY.moduleLabelPlural}, зафиксировать результаты и расширить уровень допуска оператора по мере ввода разделов в рабочий контур.
                </p>
              </div>

              <div className="landing-hero__stats">
                <div className="landing-hero__stat card">
                  <span className="landing-hero__stat-icon" aria-hidden="true">
                    <HiOutlineRectangleStack />
                  </span>
                  <span className="landing-hero__stat-value hf">{totalModules}</span>
                  <span className="landing-hero__stat-label">{ARCHIVE_COPY.moduleLabelPlural}</span>
                </div>
                <div className="landing-hero__stat card">
                  <span className="landing-hero__stat-icon" aria-hidden="true">
                    <HiOutlineQueueList />
                  </span>
                  <span className="landing-hero__stat-value hf">{totalMissions}</span>
                  <span className="landing-hero__stat-label">{ARCHIVE_COPY.missionLabelPlural}</span>
                </div>
                <div className="landing-hero__stat card">
                  <span className="landing-hero__stat-icon" aria-hidden="true">
                    <HiOutlineShieldCheck />
                  </span>
                  <span className="landing-hero__stat-value hf">{totalModules}</span>
                  <span className="landing-hero__stat-label">архивных знаков</span>
                </div>
              </div>
            </div>

            <div className="landing-hero__actions fu d3">
              <button type="button" onClick={onStart} className="btn-p landing-hero__cta glow">
                <span>{returning ? 'Вернуться к восстановлению' : 'Инициализировать доступ'}</span>
                <HiOutlineArrowRight aria-hidden="true" />
              </button>
            </div>

            {returning && (
              <div className="landing-hero__status card fu d4">
                <div className="landing-hero__status-copy">
                  <p className="landing-hero__status-label">Статус оператора</p>
                  <p className="landing-hero__status-main hf">{rank.icon} {rank.name}</p>
                </div>
                <div className="landing-hero__status-metrics">
                  <span className="landing-hero__status-metric">
                    <strong>{progress.xp} XP</strong>
                    <span>текущий опыт</span>
                  </span>
                  <span className="landing-hero__status-metric">
                    <strong>{restoredPct}%</strong>
                    <span>восстановлено</span>
                  </span>
                  <span className="landing-hero__status-metric">
                    <strong>{progress.completedMissions.length}</strong>
                    <span>{ARCHIVE_COPY.missionLabelPlural}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="landing-support">
        <div className="app-shell app-shell--narrow">
          <div className="landing-support__grid">
            {SUPPORT_CARDS.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className={`landing-support__card card fu d${index + 5}`}>
                <div className="landing-support__icon" aria-hidden="true">
                  <Icon />
                </div>
                <h2 className="landing-support__title hf">{title}</h2>
                <p className="landing-support__copy">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
