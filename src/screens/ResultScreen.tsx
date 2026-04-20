import type { CSSProperties } from 'react';
import {
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { ARCHIVE_COPY } from '../data/archiveTerminology';
import { getNextRank, getRank } from '../data/ranks';
import type { BadgeDef, Module, ProgressionStage } from '../types/content';
import type { Progress } from '../types/progress';

interface Props {
  score: number;
  stage: ProgressionStage;
  module: Module;
  passed: boolean;
  xpEarned: number;
  badgeEarned: BadgeDef | null;
  progress: Progress;
  onRetry: () => void;
  onNext: (() => void) | null;
  onModulePage: () => void;
  onDashboard: () => void;
}

interface ConfettiPiece {
  left: string;
  top: string;
  width: string;
  height: string;
  rotate: string;
  tone: 'blue' | 'mint' | 'gold';
  round?: boolean;
}

const CONFETTI_PIECES: ConfettiPiece[] = [
  { left: '6%', top: '8%', width: '0.42rem', height: '0.18rem', rotate: '-14deg', tone: 'blue' },
  { left: '18%', top: '14%', width: '0.18rem', height: '0.6rem', rotate: '12deg', tone: 'mint' },
  { left: '29%', top: '7%', width: '0.48rem', height: '0.18rem', rotate: '-18deg', tone: 'gold' },
  { left: '41%', top: '11%', width: '0.34rem', height: '0.34rem', rotate: '0deg', tone: 'mint', round: true },
  { left: '54%', top: '6%', width: '0.18rem', height: '0.7rem', rotate: '10deg', tone: 'blue' },
  { left: '67%', top: '9%', width: '0.5rem', height: '0.18rem', rotate: '20deg', tone: 'mint' },
  { left: '82%', top: '13%', width: '0.18rem', height: '0.58rem', rotate: '-10deg', tone: 'gold' },
  { left: '91%', top: '7%', width: '0.32rem', height: '0.32rem', rotate: '0deg', tone: 'blue', round: true },
  { left: '12%', top: '28%', width: '0.18rem', height: '0.54rem', rotate: '16deg', tone: 'gold' },
  { left: '24%', top: '31%', width: '0.36rem', height: '0.36rem', rotate: '0deg', tone: 'mint', round: true },
  { left: '37%', top: '26%', width: '0.48rem', height: '0.18rem', rotate: '26deg', tone: 'blue' },
  { left: '59%', top: '30%', width: '0.18rem', height: '0.56rem', rotate: '-6deg', tone: 'mint' },
  { left: '73%', top: '25%', width: '0.34rem', height: '0.34rem', rotate: '0deg', tone: 'blue', round: true },
  { left: '86%', top: '29%', width: '0.46rem', height: '0.18rem', rotate: '-22deg', tone: 'gold' },
  { left: '14%', top: '46%', width: '0.48rem', height: '0.18rem', rotate: '-24deg', tone: 'blue' },
  { left: '31%', top: '52%', width: '0.18rem', height: '0.56rem', rotate: '14deg', tone: 'mint' },
  { left: '48%', top: '43%', width: '0.34rem', height: '0.34rem', rotate: '0deg', tone: 'gold', round: true },
  { left: '66%', top: '49%', width: '0.5rem', height: '0.18rem', rotate: '18deg', tone: 'mint' },
  { left: '81%', top: '44%', width: '0.18rem', height: '0.62rem', rotate: '-12deg', tone: 'blue' },
  { left: '90%', top: '50%', width: '0.38rem', height: '0.38rem', rotate: '0deg', tone: 'mint', round: true },
];

const COUNT_KEYS = ['questions', 'pairs', 'events', 'items', 'statements', 'prompts', 'scenarios'] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getStageUnitCount(stage: ProgressionStage) {
  const data = stage.activityData as Record<string, unknown> | null;
  if (!data) return 0;

  for (const key of COUNT_KEYS) {
    const value = data[key];
    if (Array.isArray(value)) return value.length;
  }

  return 0;
}

export default function ResultScreen({
  score,
  stage,
  module: mod,
  passed,
  xpEarned,
  badgeEarned,
  progress,
  onRetry,
  onNext,
  onModulePage,
  onDashboard,
}: Props) {
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const isCheckpoint = stage.stageType === 'checkpoint';
  const totalUnits = getStageUnitCount(stage);
  const solvedUnits = totalUnits > 0 ? clamp(Math.round((score / 100) * totalUnits), 0, totalUnits) : null;
  const qualityScore = score >= 95 ? 3 : score >= Math.max(stage.passingScore, 75) ? 2 : 1;
  const progressRatio = clamp(score / 100, 0, 1);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const ringLength = `${progressRatio * circumference} ${circumference}`;
  const progressTotal = nextRank ? nextRank.minXP - rank.minXP : 1;
  const progressInsideRank = nextRank ? progress.xp - rank.minXP : progressTotal;
  const rankFill = nextRank ? clamp((progressInsideRank / progressTotal) * 100, 6, 100) : 100;

  const headline = passed
    ? (isCheckpoint ? 'Контрольная точка пройдена' : 'Отлично!')
    : 'Почти получилось';
  const subtitle = passed
    ? (isCheckpoint
      ? 'Раздел закрыт успешно. Можно переходить дальше без потери темпа.'
      : 'Безупречный результат. Продолжай в том же духе.')
    : `Нужно не меньше ${stage.passingScore}% для принятия результата. Повтори миссию и закрепи материал.`;
  const primaryAction = passed ? (onNext ?? onModulePage) : onRetry;
  const primaryLabel = passed
    ? (onNext
      ? (isCheckpoint ? 'Следующий раздел' : 'Следующая миссия')
      : 'К разделу')
    : 'Повторить миссию';
  const scoreLabel = passed ? 'точность' : 'результат';
  const unitMetricValue = solvedUnits !== null ? `${solvedUnits}/${totalUnits}` : `${score}%`;
  const unitMetricLabel = solvedUnits !== null ? 'выполнено' : 'точность';
  const gradeLabel = isCheckpoint ? 'доступ' : 'оценка';
  const xpHeading = passed
    ? `+${xpEarned} XP добавлено к профилю`
    : 'XP будет начислен после успешного прохождения';
  const xpMeta = nextRank
    ? `Уровень: ${rank.name} · ${progress.xp} / ${nextRank.minXP} XP до следующего`
    : `Уровень: ${rank.name} · максимальный ранг достигнут`;

  return (
    <div className={`app-page result-screen ${passed ? 'result-screen--passed' : 'result-screen--failed'}`}>
      <div className="result-screen__shell">
        <section className="result-screen__card">
          {passed && (
            <div className="result-screen__confetti" aria-hidden="true">
              {CONFETTI_PIECES.map((piece, index) => (
                <span
                  key={`${piece.left}-${piece.top}-${index}`}
                  className={`result-screen__confetti-piece is-${piece.tone}${piece.round ? ' is-round' : ''}`}
                  style={{
                    left: piece.left,
                    top: piece.top,
                    width: piece.width,
                    height: piece.height,
                    '--piece-rotate': piece.rotate,
                    '--confetti-dx': `${((index % 5) - 2) * 11}px`,
                    '--confetti-dy': `${14 + (index % 4) * 9}px`,
                    '--confetti-delay': `${index * 70}ms`,
                  } as CSSProperties}
                />
              ))}
            </div>
          )}

          <div className="result-screen__ring-wrap">
            <div className="result-screen__ring">
              <svg viewBox="0 0 112 112" className="result-screen__ring-svg" aria-hidden="true">
                <circle className="result-screen__ring-track" cx="56" cy="56" r={radius} fill="none" strokeWidth="8" />
                <circle
                  className="result-screen__ring-progress"
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={ringLength}
                  strokeLinecap="round"
                />
              </svg>
              <div className="result-screen__ring-copy">
                <strong>{score}%</strong>
                <span>{scoreLabel}</span>
              </div>
            </div>
          </div>

          <div className="result-screen__copy">
            <p className="result-screen__eyebrow">
              {stage.title} · {ARCHIVE_COPY.moduleLabel} {mod.id}
            </p>
            <h1 className="result-screen__title">{headline}</h1>
            <p className="result-screen__subtitle">{subtitle}</p>
          </div>

          <div className="result-screen__stats">
            <article className="result-screen__stat result-screen__stat--mint">
              <span className="result-screen__stat-icon" aria-hidden="true">
                <HiOutlineCheckCircle />
              </span>
              <strong>{unitMetricValue}</strong>
              <span>{unitMetricLabel}</span>
            </article>

            <article className="result-screen__stat result-screen__stat--gold">
              <span className="result-screen__stat-icon" aria-hidden="true">
                <HiOutlineBolt />
              </span>
              <strong>+{xpEarned} XP</strong>
              <span>{passed ? 'заработано' : 'в резерве'}</span>
            </article>

            <article className="result-screen__stat result-screen__stat--sky">
              <span className="result-screen__stat-icon" aria-hidden="true">
                <HiOutlineShieldCheck />
              </span>
              <strong>{qualityScore}/3</strong>
              <span>{gradeLabel}</span>
            </article>
          </div>

          {(badgeEarned || isCheckpoint) && (
            <div className="result-screen__tag-row">
              {badgeEarned && (
                <div className="result-screen__badge-chip">
                  <span className="result-screen__badge-icon" aria-hidden="true">{badgeEarned.icon}</span>
                  <span>{badgeEarned.name}</span>
                </div>
              )}
              {isCheckpoint && passed && (
                <div className="result-screen__badge-chip result-screen__badge-chip--soft">
                  <span className="result-screen__badge-icon" aria-hidden="true">
                    <HiOutlineBookOpen />
                  </span>
                  <span>{mod.chapter ?? 'Раздел завершен'}</span>
                </div>
              )}
            </div>
          )}

          <div className="result-screen__actions">
            <button type="button" onClick={primaryAction} className="btn result-screen__cta">
              <span>{primaryLabel}</span>
              <HiOutlineArrowRight aria-hidden="true" />
            </button>

            <div className="result-screen__secondary">
              <button type="button" onClick={onModulePage} className="btn result-screen__secondary-btn">
                <HiOutlineBookOpen aria-hidden="true" />
                <span>К разделу</span>
              </button>
              <button type="button" onClick={onRetry} className="btn result-screen__secondary-btn">
                <span aria-hidden="true">↺</span>
                <span>Повторить</span>
              </button>
            </div>

            <button type="button" onClick={onDashboard} className="result-screen__link-btn">
              Ко всем разделам
            </button>
          </div>
        </section>

        <aside className="result-screen__xp-strip">
          <div className="result-screen__xp-icon" aria-hidden="true">
            <HiOutlineBolt />
          </div>
          <div className="result-screen__xp-copy">
            <div className="result-screen__xp-head">{xpHeading}</div>
            <div className="result-screen__xp-meta">{xpMeta}</div>
            <div className="result-screen__xp-track" aria-hidden="true">
              <span className="result-screen__xp-fill" style={{ width: `${rankFill}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
