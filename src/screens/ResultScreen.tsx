import { useEffect, useRef, useState, type CSSProperties } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  HiOutlineArrowPath,
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineStar,
} from 'react-icons/hi2';

import { ARCHIVE_COPY, getArchiveStageLabel } from '../data/archiveTerminology';
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

const TEXT = '#0C1628';
const TEXT2 = '#4A5568';
const MUTED = '#8C9CB4';
const EMERALD = '#059669';
const GOLD = '#F59E0B';
const BLUE = '#2563EB';
const BORDER = 'rgba(12,22,40,0.08)';
const EASE = [0.22, 1, 0.36, 1] as const;

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

function getScoreCopy(score: number, passingScore: number) {
  if (score >= 90) {
    return {
      title: 'Отлично!',
      subtitle: 'Сильный результат. Темп отличный, можно идти дальше без паузы.',
    };
  }

  if (score >= passingScore) {
    return {
      title: 'Хорошо!',
      subtitle: 'Миссия закрыта успешно. При желании можно повторить и добрать максимум.',
    };
  }

  return {
    title: 'Можно лучше',
    subtitle: `Для зачета нужно не меньше ${passingScore}%. Повтори миссию и закрепи материал.`,
  };
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
  const [ringProgress, setRingProgress] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRingProgress(clamp(score / 100, 0, 1));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [score]);

  useEffect(() => {
    if (fired.current) return;

    const timer = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#059669', '#10B981', '#2563EB', '#3B82F6', '#F59E0B'],
        ticks: 200,
        zIndex: 9999,
        disableForReducedMotion: false,
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, []);

  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const isCheckpoint = stage.stageType === 'checkpoint';
  const totalUnits = getStageUnitCount(stage);
  const solvedUnits = totalUnits > 0 ? clamp(Math.round((score / 100) * totalUnits), 0, totalUnits) : null;
  const isPerfect = passed && score === 100;
  const scoreCopy = getScoreCopy(score, stage.passingScore);
  const scoreTone = isPerfect ? EMERALD : passed ? BLUE : GOLD;
  const stageLabel = getArchiveStageLabel(stage.stageType, stage.num);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ringProgress);
  const qualityScore = score >= 95 ? '★ 3/3' : score >= Math.max(stage.passingScore, 75) ? '★ 2/3' : '★ 1/3';
  const primaryAction = passed ? (onNext ?? onModulePage) : onRetry;
  const primaryLabel = passed
    ? (onNext ? (isCheckpoint ? 'Следующий раздел' : 'Следующая миссия') : 'К разделу')
    : 'Повторить миссию';
  const headerLabel = passed ? (isCheckpoint ? 'КОНТРОЛЬНЫЙ УЗЕЛ ПРОЙДЕН' : 'МИССИЯ ЗАВЕРШЕНА') : 'ПОПЫТКА ЗАВЕРШЕНА';
  const progressTotal = nextRank ? nextRank.minXP - rank.minXP : 1;
  const progressInsideRank = nextRank ? progress.xp - rank.minXP : progressTotal;
  const rankFill = nextRank ? clamp((progressInsideRank / progressTotal) * 100, 8, 100) : 100;
  const xpHeading = passed
    ? `+${xpEarned} XP добавлено к профилю`
    : 'XP будет начислен после успешного прохождения';
  const xpMeta = nextRank
    ? `Уровень: ${rank.name} · ${progress.xp} / ${nextRank.minXP} XP до следующего`
    : `Уровень: ${rank.name} · максимальный ранг достигнут`;

  const shellStyle: CSSProperties = {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #F4F8FF 0%, #EEF4FB 45%, #F8FBFF 100%)',
    position: 'relative',
    overflow: 'hidden',
  };

  const statCards = [
    {
      label: solvedUnits !== null ? 'Правильно' : 'Точность',
      value: solvedUnits !== null ? `${solvedUnits}/${totalUnits}` : `${score}%`,
      icon: HiOutlineCheckCircle,
      color: EMERALD,
      bg: '#ECFDF5',
    },
    {
      label: passed ? 'Заработано' : 'В резерве',
      value: `+${xpEarned} XP`,
      icon: HiOutlineBolt,
      color: GOLD,
      bg: '#FEF3C7',
    },
    {
      label: isCheckpoint ? 'Доступ' : 'Оценка',
      value: qualityScore,
      icon: HiOutlineStar,
      color: BLUE,
      bg: '#EFF6FF',
    },
  ] as const;

  return (
    <div className="app-page result-screen" style={shellStyle}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28rem),
            radial-gradient(circle at top right, rgba(37,99,235,0.12), transparent 26rem)
          `,
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            maxWidth: '52rem',
            margin: '0 auto',
            padding: '0 1.25rem',
            minHeight: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span
              aria-hidden="true"
              style={{
                width: '0.45rem',
                height: '0.45rem',
                borderRadius: '999px',
                background: passed ? EMERALD : GOLD,
                boxShadow: `0 0 0 6px ${passed ? 'rgba(16,185,129,0.14)' : 'rgba(245,158,11,0.14)'}`,
              }}
            />
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: passed ? EMERALD : GOLD,
              }}
            >
              {headerLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onModulePage}
            style={{
              border: 'none',
              background: 'transparent',
              color: MUTED,
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Вернуться к разделу
          </button>
        </div>
      </header>

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem 3rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '34rem' }}>
          <motion.section
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.75rem',
              background: '#FFFFFF',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 20px 64px rgba(12,22,40,0.12)',
              marginBottom: passed ? '1rem' : 0,
            }}
          >
            <div
              style={{
                height: '0.38rem',
                background: passed
                  ? 'linear-gradient(90deg, #059669, #10B981, #2563EB)'
                  : 'linear-gradient(90deg, #F59E0B, #F97316, #2563EB)',
              }}
            />

            <div style={{ padding: '2rem 1.5rem 1.6rem', textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  position: 'relative',
                  width: '8.6rem',
                  height: '8.6rem',
                  margin: '0 auto 1.7rem',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <svg viewBox="0 0 132 132" width="132" height="132" aria-hidden="true">
                  <circle cx="66" cy="66" r={radius} fill="none" stroke="#E8EEF7" strokeWidth="8" />
                  <circle
                    cx="66"
                    cy="66"
                    r={radius}
                    fill="none"
                    stroke={scoreTone}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 66 66)"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
                  />
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    inset: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      maxWidth: '100%',
                      fontSize: '1.75rem',
                      lineHeight: 1,
                      fontWeight: 900,
                      color: TEXT,
                      letterSpacing: '-0.04em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {score}%
                  </strong>
                  <span
                    style={{
                      marginTop: '0.38rem',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      color: MUTED,
                      letterSpacing: '0.08em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ТОЧНОСТЬ
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4, ease: EASE }}
                style={{ marginBottom: '1.6rem' }}
              >
                <p
                  style={{
                    margin: '0 0 0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: scoreTone,
                  }}
                >
                  {stageLabel.toUpperCase()} · {ARCHIVE_COPY.moduleLabel.toUpperCase()} {mod.id}
                </p>
                <h1
                  style={{
                    margin: '0 0 0.45rem',
                    fontSize: 'clamp(1.9rem, 5vw, 2.3rem)',
                    fontWeight: 900,
                    color: TEXT,
                    letterSpacing: '-0.035em',
                  }}
                >
                  {scoreCopy.title}
                </h1>
                <p
                  style={{
                    margin: '0 auto',
                    maxWidth: '28rem',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    color: TEXT2,
                  }}
                >
                  {scoreCopy.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4, ease: EASE }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                  <article
                    key={label}
                    style={{
                      borderRadius: '1.15rem',
                      padding: '0.95rem 0.65rem',
                      background: bg,
                      textAlign: 'center',
                    }}
                  >
                    <Icon style={{ margin: '0 auto 0.4rem', color, fontSize: '1rem' }} aria-hidden="true" />
                    <div
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 900,
                        color,
                        letterSpacing: '-0.01em',
                        marginBottom: '0.15rem',
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color,
                        opacity: 0.74,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {label.toUpperCase()}
                    </div>
                  </article>
                ))}
              </motion.div>

              {(badgeEarned || (isCheckpoint && passed)) && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  {badgeEarned && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem 0.8rem',
                        borderRadius: '999px',
                        background: '#F8FAFC',
                        border: `1px solid ${BORDER}`,
                        color: TEXT2,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <span aria-hidden="true">{badgeEarned.icon}</span>
                      <span>{badgeEarned.name}</span>
                    </div>
                  )}

                  {isCheckpoint && passed && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem 0.8rem',
                        borderRadius: '999px',
                        background: '#EFF6FF',
                        border: '1px solid rgba(37,99,235,0.12)',
                        color: BLUE,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      <HiOutlineBookOpen aria-hidden="true" />
                      <span>{mod.chapter ?? 'Раздел завершен'}</span>
                    </div>
                  )}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.4, ease: EASE }}
                style={{ display: 'grid', gap: '0.75rem' }}
              >
                <button
                  type="button"
                  onClick={primaryAction}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.55rem',
                    width: '100%',
                    border: 'none',
                    borderRadius: '1.1rem',
                    padding: '0.95rem 1rem',
                    background: passed
                      ? 'linear-gradient(135deg, #059669, #10B981)'
                      : 'linear-gradient(135deg, #2563EB, #3B82F6)',
                    color: '#FFFFFF',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: passed
                      ? '0 10px 28px rgba(5,150,105,0.28)'
                      : '0 10px 28px rgba(37,99,235,0.22)',
                  }}
                >
                  <span>{primaryLabel}</span>
                  <HiOutlineArrowRight aria-hidden="true" />
                </button>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={onModulePage}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      borderRadius: '0.95rem',
                      padding: '0.9rem 0.8rem',
                      background: '#F8FAFC',
                      border: `1px solid ${BORDER}`,
                      color: TEXT2,
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <HiOutlineBookOpen aria-hidden="true" />
                    <span>К разделу</span>
                  </button>

                  <button
                    type="button"
                    onClick={onRetry}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      borderRadius: '0.95rem',
                      padding: '0.9rem 0.8rem',
                      background: '#F8FAFC',
                      border: `1px solid ${BORDER}`,
                      color: TEXT2,
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    <HiOutlineArrowPath aria-hidden="true" />
                    <span>Повторить</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onDashboard}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: MUTED,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <HiOutlineHome aria-hidden="true" />
                  <span>Ко всем разделам</span>
                </button>
              </motion.div>
            </div>
          </motion.section>

          {passed && (
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.45, ease: EASE }}
              style={{
                borderRadius: '1.35rem',
                padding: '1rem 1rem 1.05rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.9rem',
                background: 'linear-gradient(135deg, #070D1C, #0E1F3A)',
                border: '1px solid rgba(37,99,235,0.18)',
                boxShadow: '0 14px 36px rgba(7,13,28,0.22)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: '2.6rem',
                  height: '2.6rem',
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '0.9rem',
                  background: 'rgba(245,158,11,0.16)',
                  color: GOLD,
                }}
              >
                <HiOutlineSparkles style={{ fontSize: '1.1rem' }} />
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <p
                  style={{
                    margin: '0 0 0.18rem',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: '#F8FAFC',
                  }}
                >
                  {xpHeading}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.78rem',
                    lineHeight: 1.5,
                    color: '#8EA6C8',
                  }}
                >
                  {xpMeta}
                </p>

                <div
                  aria-hidden="true"
                  style={{
                    marginTop: '0.8rem',
                    height: '0.28rem',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div
                    style={{
                      width: `${rankFill}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
                    }}
                  />
                </div>
              </div>
            </motion.aside>
          )}

          {!passed && (
            <aside
              style={{
                marginTop: '1rem',
                borderRadius: '1.2rem',
                padding: '0.95rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.7rem',
                background: 'rgba(255,255,255,0.72)',
                border: `1px solid ${BORDER}`,
                color: TEXT2,
              }}
            >
              <HiOutlineShieldCheck style={{ color: GOLD, fontSize: '1.1rem', flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <p style={{ margin: '0 0 0.18rem', fontSize: '0.9rem', fontWeight: 800, color: TEXT }}>
                  Попробуй еще раз
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.55 }}>
                  Ошибка не фиксируется как провал. Повторная попытка откроет те же материалы без потери прогресса.
                </p>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
