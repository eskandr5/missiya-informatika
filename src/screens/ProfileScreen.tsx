import { useState } from 'react';
import { motion } from 'motion/react';
import {
  HiOutlineArrowLeft,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineTrash,
} from 'react-icons/hi2';

import { MODULES } from '../data/modules';
import { getNextRank, getRank, RANKS } from '../data/ranks';
import type { Progress } from '../types/progress';

interface Props {
  progress: Progress;
  onBack: () => void;
  onReset: () => void;
}

const TEXT = '#0C1628';
const TEXT2 = '#4A5568';
const MUTED = '#8C9CB4';
const EMERALD = '#059669';
const BLUE = '#2563EB';
const GOLD = '#F59E0B';
const BORDER = 'rgba(12,22,40,0.07)';
const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfileScreen({ progress, onBack, onReset }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const totalProtocols = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const completedModules = MODULES.filter(
    module => module.missions.every(mission => progress.completedMissions.includes(mission.id)),
  ).length;
  const startedModules = MODULES.filter(
    module => module.missions.some(mission => progress.completedMissions.includes(mission.id)),
  ).length;
  const totalCheckpoints = MODULES.length > 0 ? MODULES.length - 1 : 0;
  const allScores = [
    ...Object.values(progress.missionScores),
    ...Object.values(progress.checkpointScores),
  ];
  const accuracyPct = allScores.length > 0
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
    : 0;
  const archivePct = totalProtocols > 0
    ? Math.round((progress.completedMissions.length / totalProtocols) * 100)
    : 0;
  const xpSinceRank = progress.xp - rank.minXP;
  const xpRange = nextRank ? nextRank.minXP - rank.minXP : 1;
  const xpFill = nextRank ? Math.max(8, Math.min(100, Math.round((xpSinceRank / xpRange) * 100))) : 100;
  const currentRankIndex = RANKS.findIndex(item => item.id === rank.id);
  const earnedBadges = MODULES
    .map(module => module.badge)
    .filter(badge => progress.badges.includes(badge.id));
  const upcomingBadges = MODULES.filter(module => !progress.badges.includes(module.badge.id)).slice(0, 3);
  const moduleBars = MODULES.slice(0, 7).map((module) => {
    const done = module.missions.filter(mission => progress.completedMissions.includes(mission.id)).length;
    const percent = module.missions.length > 0 ? Math.round((done / module.missions.length) * 100) : 0;
    return {
      id: module.id,
      percent,
      title: module.title,
    };
  });

  const stats = [
    {
      icon: HiOutlineBolt,
      iconColor: GOLD,
      iconBg: '#FEF3C7',
      value: progress.xp.toLocaleString('en-US'),
      label: 'Всего XP',
    },
    {
      icon: HiOutlineSparkles,
      iconColor: '#F97316',
      iconBg: '#FFEDD5',
      value: `${progress.completedMissions.length}/${totalProtocols}`,
      label: 'Протоколов',
    },
    {
      icon: HiOutlineBookOpen,
      iconColor: EMERALD,
      iconBg: '#DCFCE7',
      value: `${startedModules}/${MODULES.length}`,
      label: 'Разделов открыто',
    },
    {
      icon: HiOutlineShieldCheck,
      iconColor: BLUE,
      iconBg: '#DBEAFE',
      value: `${progress.completedCheckpoints.length}/${totalCheckpoints}`,
      label: 'Узлов закрыто',
    },
    {
      icon: HiOutlineStar,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      value: `${accuracyPct}%`,
      label: 'Точность',
    },
    {
      icon: HiOutlineCheckBadge,
      iconColor: '#0891B2',
      iconBg: '#CFFAFE',
      value: `${earnedBadges.length}/${MODULES.length}`,
      label: 'Значков',
    },
  ] as const;

  const profileRows = [
    { icon: HiOutlineGlobeAlt, label: 'Язык интерфейса', value: 'Русский' },
    { icon: HiOutlineChartBar, label: 'Прогресс архива', value: `${archivePct}%` },
    { icon: HiOutlineClock, label: 'Следующий ранг', value: nextRank ? nextRank.name : 'Максимальный' },
    { icon: HiOutlineShieldCheck, label: 'Уровень допуска', value: `${currentRankIndex + 1}/${RANKS.length}` },
  ] as const;

  return (
    <div
      className="app-page"
      style={{
        minHeight: '100vh',
        paddingBottom: '3rem',
        background: 'linear-gradient(180deg, #F3F7FF 0%, #EEF4FF 45%, #F8FBFF 100%)',
      }}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.4rem' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '999px',
              border: `1px solid ${BORDER}`,
              background: '#fff',
              color: TEXT2,
              fontSize: '0.88rem',
              fontWeight: 700,
              padding: '0.7rem 1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
            }}
          >
            <HiOutlineArrowLeft aria-hidden="true" />
            <span>К разделам</span>
          </button>

          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, color: MUTED, letterSpacing: '0.08em' }}>
              ЛИЧНОЕ ДЕЛО
            </p>
            <h1 style={{ margin: '0.25rem 0 0', fontSize: '1.65rem', fontWeight: 900, color: TEXT, letterSpacing: '-0.03em' }}>
              Профиль архива
            </h1>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          style={{
            borderRadius: '1.85rem',
            padding: '1.6rem',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #0D1B36 0%, #14254A 58%, #10203E 100%)',
            boxShadow: '0 22px 54px rgba(15,23,42,0.16)',
            border: '1px solid rgba(100,116,139,0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.35rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '1.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #14B8A6, #2563EB)',
                  color: '#fff',
                  fontSize: '1.9rem',
                  fontWeight: 900,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                }}
              >
                {rank.icon}
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
                  Курсант архива
                </h2>
                <p style={{ margin: '0.22rem 0 0.75rem', fontSize: '0.92rem', color: '#7E93B3' }}>
                  @mission.informatika
                </p>

                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '999px',
                      padding: '0.42rem 0.75rem',
                      background: 'rgba(5,150,105,0.16)',
                      border: '1px solid rgba(16,185,129,0.18)',
                      color: '#34D399',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                    }}
                  >
                    Уровень {currentRankIndex + 1} · {rank.name}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '999px',
                      padding: '0.42rem 0.75rem',
                      background: 'rgba(148,163,184,0.14)',
                      border: '1px solid rgba(148,163,184,0.14)',
                      color: '#A5B4CF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {startedModules}/{MODULES.length} разделов в работе
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                minWidth: '9rem',
                padding: '0.9rem 1rem',
                borderRadius: '1.1rem',
                background: 'rgba(52,76,128,0.44)',
                border: '1px solid rgba(148,163,184,0.12)',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#8EA3C4', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                АРХИВНЫЙ СТАТУС
              </div>
              <div style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 900, lineHeight: 1.1 }}>
                {archivePct}%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#91A3BE', marginTop: '0.25rem' }}>
                заполнено материалов
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
            <p style={{ margin: 0, color: '#FBBF24', fontWeight: 800, fontSize: '0.95rem' }}>
              ⚡ {progress.xp.toLocaleString('en-US')} XP
            </p>
            <p style={{ margin: 0, color: '#7E93B3', fontSize: '0.82rem', fontWeight: 700 }}>
              {nextRank ? `До уровня ${nextRank.name}: ${nextRank.minXP - progress.xp} XP` : 'Максимальный ранг достигнут'}
            </p>
          </div>

          <div
            style={{
              height: '0.38rem',
              borderRadius: '999px',
              overflow: 'hidden',
              background: 'rgba(148,163,184,0.18)',
              marginBottom: '0.55rem',
            }}
          >
            <div
              style={{
                width: `${xpFill}%`,
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
              }}
            />
          </div>

          <p style={{ margin: 0, color: '#7E93B3', fontSize: '0.78rem' }}>
            {nextRank ? `${xpFill}% до следующего ранга` : 'Дальнейший XP сохраняется как архивный запас'}
          </p>
        </motion.section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          {stats.map(({ icon: Icon, iconColor, iconBg, value, label }, index) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35, ease: EASE }}
              style={{
                borderRadius: '1.2rem',
                padding: '1rem',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                boxShadow: '0 8px 22px rgba(15,23,42,0.05)',
              }}
            >
              <div
                style={{
                  width: '2.15rem',
                  height: '2.15rem',
                  borderRadius: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: iconBg,
                  color: iconColor,
                  marginBottom: '0.9rem',
                }}
              >
                <Icon size={16} aria-hidden="true" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: TEXT, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                {value}
              </div>
              <div style={{ marginTop: '0.3rem', fontSize: '0.78rem', color: MUTED, fontWeight: 700 }}>
                {label}
              </div>
            </motion.article>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <section
            style={{
              borderRadius: '1.45rem',
              padding: '1.1rem 1.2rem 1.25rem',
              background: '#fff',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 10px 28px rgba(15,23,42,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: MUTED, fontWeight: 800, letterSpacing: '0.08em' }}>
                  АКТИВНОСТЬ
                </p>
                <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.45rem', color: TEXT, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Прогресс по разделам
                </h3>
              </div>
              <div style={{ color: EMERALD, fontWeight: 800, fontSize: '0.88rem' }}>
                {completedModules}/{MODULES.length} завершено
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.8rem', alignItems: 'end', minHeight: '8rem' }}>
              {moduleBars.map((item) => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem' }}>
                  <div
                    title={item.title}
                    style={{
                      width: '1.25rem',
                      height: `${Math.max(14, Math.round(item.percent * 0.8))}px`,
                      borderRadius: '0.45rem 0.45rem 0 0',
                      background: item.percent > 0
                        ? item.percent >= 100
                          ? 'linear-gradient(180deg, #10B981, #059669)'
                          : 'linear-gradient(180deg, #BFDBFE, #60A5FA)'
                        : '#E8EEF8',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.percent > 0 ? TEXT2 : MUTED }}>
                    М{item.id}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              borderRadius: '1.45rem',
              padding: '1.1rem 1.2rem 1.2rem',
              background: '#fff',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 10px 28px rgba(15,23,42,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: MUTED, fontWeight: 800, letterSpacing: '0.08em' }}>
                  ДОСТИЖЕНИЯ
                </p>
                <h3 style={{ margin: '0.3rem 0 0', fontSize: '1.4rem', color: TEXT, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Значки архива
                </h3>
              </div>
              <div
                style={{
                  borderRadius: '999px',
                  padding: '0.4rem 0.7rem',
                  background: '#ECFDF5',
                  color: EMERALD,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}
              >
                {earnedBadges.length}/{MODULES.length}
              </div>
            </div>

            {earnedBadges.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.7rem',
                  marginBottom: '1rem',
                }}
              >
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      borderRadius: '1rem',
                      padding: '0.95rem 0.85rem',
                      background: '#ECFDF5',
                      border: '1px solid rgba(16,185,129,0.14)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.7rem', marginBottom: '0.4rem' }}>{badge.icon}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: EMERALD, letterSpacing: '0.04em' }}>
                      {badge.name.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  background: '#F8FAFC',
                  border: `1px solid ${BORDER}`,
                  color: TEXT2,
                  marginBottom: '1rem',
                }}
              >
                Значки появятся после завершения модулей.
              </div>
            )}

            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '0.95rem' }}>
              <p style={{ margin: '0 0 0.7rem', fontSize: '0.74rem', color: MUTED, fontWeight: 800, letterSpacing: '0.08em' }}>
                ПРЕДСТОЯЩИЕ ДОСТИЖЕНИЯ
              </p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {upcomingBadges.length > 0 ? (
                  upcomingBadges.map((module) => (
                    <div
                      key={module.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        borderRadius: '1rem',
                        padding: '0.85rem 0.95rem',
                        background: '#F8FAFC',
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '2.25rem',
                            height: '2.25rem',
                            borderRadius: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#E2E8F0',
                            color: TEXT2,
                            fontSize: '1rem',
                          }}
                        >
                          {module.badge.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: TEXT }}>{module.badge.name}</div>
                          <div style={{ fontSize: '0.76rem', color: MUTED }}>
                            Завершить модуль {module.id}: {module.title}
                          </div>
                        </div>
                      </div>
                      <HiOutlineChevronRight style={{ color: MUTED }} aria-hidden="true" />
                    </div>
                  ))
                ) : (
                  <div style={{ color: TEXT2, fontSize: '0.9rem' }}>
                    Все архивные значки уже собраны.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section
            style={{
              borderRadius: '1.45rem',
              overflow: 'hidden',
              background: '#fff',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 10px 28px rgba(15,23,42,0.05)',
            }}
          >
            {profileRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.15rem',
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '2.1rem',
                      height: '2.1rem',
                      borderRadius: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#EFF6FF',
                      color: BLUE,
                    }}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <span style={{ fontSize: '0.96rem', fontWeight: 700, color: TEXT }}>{label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: MUTED }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{value}</span>
                  <HiOutlineChevronRight size={16} aria-hidden="true" />
                </div>
              </div>
            ))}

            <div style={{ padding: '1rem 1.15rem' }}>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  style={{
                    width: '100%',
                    borderRadius: '1rem',
                    border: '1px solid rgba(220,38,38,0.18)',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    padding: '0.95rem 1rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <HiOutlineTrash aria-hidden="true" />
                  <span>Сбросить прогресс</span>
                </button>
              ) : (
                <div
                  style={{
                    borderRadius: '1rem',
                    padding: '1rem',
                    background: '#FEF2F2',
                    border: '1px solid rgba(220,38,38,0.18)',
                  }}
                >
                  <p style={{ margin: '0 0 0.8rem', color: '#7F1D1D', fontSize: '0.9rem', lineHeight: 1.55 }}>
                    Весь архивный прогресс будет удалён: XP, результаты миссий, контрольные узлы и значки.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      style={{
                        flex: '1 1 10rem',
                        borderRadius: '0.95rem',
                        border: `1px solid ${BORDER}`,
                        background: '#fff',
                        color: TEXT2,
                        fontWeight: 700,
                        padding: '0.85rem 1rem',
                        cursor: 'pointer',
                      }}
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={onReset}
                      style={{
                        flex: '1 1 10rem',
                        borderRadius: '0.95rem',
                        border: '1px solid rgba(220,38,38,0.25)',
                        background: '#DC2626',
                        color: '#fff',
                        fontWeight: 800,
                        padding: '0.85rem 1rem',
                        cursor: 'pointer',
                      }}
                    >
                      Да, сбросить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
