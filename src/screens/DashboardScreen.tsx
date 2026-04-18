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

const DL = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12'];

const TOPOLOGY_SLOTS = [
  'slot-a1',
  'slot-a2',
  'slot-a3',
  'slot-b1',
  'slot-b2',
  'slot-b3',
  'slot-c1',
  'slot-c2',
  'slot-c3',
  'slot-d1',
  'slot-d2',
  'slot-d3',
] as const;

const CHECKPOINTS = [
  { id: 'gate-1', short: 'УЗЕЛ I', title: 'КОНТРОЛЬНАЯ ТОЧКА', subtitle: 'Переход к ГЛАВЕ II', slotClass: 'gate-1' },
  { id: 'gate-2', short: 'УЗЕЛ II', title: 'КОНТРОЛЬНАЯ ТОЧКА', subtitle: 'Переход к ГЛАВЕ III', slotClass: 'gate-2' },
] as const;

type CheckpointId = (typeof CHECKPOINTS)[number]['id'];
type PathEndpoint = number | CheckpointId;

const PATHWAYS: Array<{ id: string; from: PathEndpoint; to: PathEndpoint; d: string }> = [
  { id: 'p1', from: 1, to: 2, d: 'M 212 214 C 290 170, 408 118, 522 98' },
  { id: 'p2', from: 2, to: 3, d: 'M 518 110 C 470 184, 366 254, 302 346' },
  { id: 'p3', from: 3, to: 4, d: 'M 334 352 C 400 350, 472 350, 540 350' },
  { id: 'p4', from: 4, to: 'gate-1', d: 'M 548 380 C 548 412, 548 438, 548 466' },
  { id: 'p5', from: 'gate-1', to: 5, d: 'M 548 514 C 548 534, 548 554, 548 580' },
  { id: 'p6', from: 5, to: 6, d: 'M 590 604 C 654 550, 724 432, 822 346' },
  { id: 'p7', from: 6, to: 7, d: 'M 826 370 C 804 486, 520 518, 356 638' },
  { id: 'p8', from: 7, to: 8, d: 'M 402 646 C 470 646, 556 646, 648 646' },
  { id: 'p9', from: 8, to: 'gate-2', d: 'M 688 630 C 760 600, 830 532, 878 470' },
  { id: 'p10', from: 'gate-2', to: 9, d: 'M 924 414 C 962 350, 992 294, 1026 214' },
  { id: 'p11', from: 9, to: 10, d: 'M 1016 248 C 978 340, 930 412, 892 486' },
  { id: 'p12', from: 10, to: 11, d: 'M 926 486 C 968 530, 1000 580, 1038 634' },
  { id: 'p13', from: 11, to: 12, d: 'M 1030 676 C 1010 728, 986 754, 944 782' },
];

const CHAPTERS = [
  { id: 1, short: 'ГЛАВА I', title: 'ГЛАВА I — ОСНОВЫ', range: 'Модули 1–4', zoneClass: 'zone-i', delay: 'd1' },
  { id: 2, short: 'ГЛАВА II', title: 'ГЛАВА II — ВЫЧИСЛЕНИЯ', range: 'Модули 5–8', zoneClass: 'zone-ii', delay: 'd2' },
  { id: 3, short: 'ГЛАВА III', title: 'ГЛАВА III — ПРОГРАММИРОВАНИЕ', range: 'Модули 9–12', zoneClass: 'zone-iii', delay: 'd3' },
] as const;

const MAP_MARKERS = [
  { id: 'mk-1', label: 'СТАРТОВЫЙ СЕКТОР', className: 'marker-start' },
  { id: 'mk-2', label: 'АРХИВНЫЙ МАРШРУТ', className: 'marker-mid' },
  { id: 'mk-3', label: 'ФИНАЛЬНЫЙ КОНТУР', className: 'marker-final' },
] as const;

function isCheckpoint(endpoint: PathEndpoint): endpoint is CheckpointId {
  return typeof endpoint === 'string';
}

export default function DashboardScreen({ progress, onSelectModule }: Props) {
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const totalModules = MODULES.length;
  const totalM = MODULES.reduce((s, m) => s + m.missions.length, 0);
  const doneM = progress.completedMissions.length;
  const unlockedModules = MODULES.filter(mod => isModuleUnlocked(mod, progress.completedMissions, MODULES)).length;
  const activeModule = MODULES.find((mod) => {
    const unlocked = isModuleUnlocked(mod, progress.completedMissions, MODULES);
    const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
    return unlocked && done < mod.missions.length;
  }) ?? null;

  const completedByModule = Object.fromEntries(
    MODULES.map((mod) => [
      mod.id,
      mod.missions.every(m => progress.completedMissions.includes(m.id)),
    ]),
  ) as Record<number, boolean>;

  const chapterOneComplete = MODULES.filter(mod => mod.id <= 4).every(mod => completedByModule[mod.id]);
  const chapterTwoComplete = MODULES.filter(mod => mod.id >= 5 && mod.id <= 8).every(mod => completedByModule[mod.id]);
  const activeChapter = activeModule ? (activeModule.id <= 4 ? 1 : activeModule.id <= 8 ? 2 : 3) : null;
  const restoredPct = Math.round((doneM / totalM) * 100);
  const systemState = doneM === 0
    ? 'INITIAL_SYNC'
    : doneM === totalM
      ? 'FULL_RESTORATION'
      : 'PARTIAL_RESTORATION';

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
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Сектор восстановления</p>
              <h1 className="hf text-3xl font-bold text-white">{ARCHIVE_COPY.appTitle}</h1>
              <p className="text-slate-500 mt-1 text-sm">
                Реестр разделов информатики · {totalModules} {ARCHIVE_COPY.moduleLabelPlural} · {totalM} {ARCHIVE_COPY.missionLabelPlural}
              </p>
            </div>
            <div className="dashboard-screen__summary flex items-center gap-2 fu d2">
              {[
                { val: `${rank.icon} ${rank.name}`, sub: ARCHIVE_COPY.rankLabel.toLowerCase() },
                { val: `${progress.xp} XP`, sub: 'зафиксировано' },
                { val: `${doneM}/${totalM}`, sub: ARCHIVE_COPY.missionLabelPlural },
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
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
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

      <div className="app-shell" style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <section className="dashboard-map-shell card">
          <div className="dashboard-map-shell__header">
            <div>
              <p className="dashboard-map-shell__kicker">ПРОГРЕССИОННАЯ КАРТА</p>
              <h2 className="dashboard-map-shell__title hf">Маршрут восстановления архива</h2>
              <p className="dashboard-map-shell__copy">
                Последовательность секторов ведет от стартового доступа к финальному контуру. Каждый маршрутный узел
                раскрывает следующий участок карты.
              </p>
            </div>
            <div className="dashboard-map-shell__legend">
              <span className="dashboard-map-shell__legend-item"><i className="state-dot is-restored" /> восстановлено</span>
              <span className="dashboard-map-shell__legend-item"><i className="state-dot is-active" /> активный маршрут</span>
              <span className="dashboard-map-shell__legend-item"><i className="state-dot is-locked" /> закрытый сектор</span>
            </div>
          </div>

          <div className="dashboard-topology">
            <div className="dashboard-topology__backdrop" aria-hidden="true">
              {MAP_MARKERS.map((marker) => (
                <div key={marker.id} className={`dashboard-topology__marker ${marker.className}`}>
                  {marker.label}
                </div>
              ))}
            </div>

            <svg
              className="dashboard-topology__conduits"
              viewBox="0 0 1200 860"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              {PATHWAYS.map((pathway) => {
                const gateOneLive = chapterOneComplete && activeChapter === 2;
                const gateTwoLive = chapterTwoComplete && activeChapter === 3;
                const routeState = (() => {
                  if (pathway.to === activeModule?.id) return 'is-active';
                  if (pathway.from === 'gate-1' || pathway.to === 'gate-1') {
                    return chapterOneComplete ? (gateOneLive ? 'is-active' : 'is-restored') : 'is-inactive';
                  }
                  if (pathway.from === 'gate-2' || pathway.to === 'gate-2') {
                    return chapterTwoComplete ? (gateTwoLive ? 'is-active' : 'is-restored') : 'is-inactive';
                  }
                  return !isCheckpoint(pathway.from) && completedByModule[pathway.from] ? 'is-restored' : 'is-inactive';
                })();

                return (
                  <path
                    key={pathway.id}
                    d={pathway.d}
                    className={`dashboard-topology__conduit ${routeState}`}
                  />
                );
              })}
            </svg>

            {CHAPTERS.map((chapter) => (
              <div
                key={chapter.id}
                className={`dashboard-topology__chapter ${chapter.zoneClass} fu ${chapter.delay}`}
              >
                <p className="dashboard-topology__chapter-kicker">{chapter.short}</p>
                <h2 className="dashboard-topology__chapter-title hf">{chapter.title}</h2>
                <p className="dashboard-topology__chapter-range">{chapter.range}</p>
              </div>
            ))}

            {CHECKPOINTS.map((checkpoint, index) => {
              const isFirst = checkpoint.id === 'gate-1';
              const restored = isFirst ? chapterOneComplete : chapterTwoComplete;
              const active = isFirst ? activeChapter === 2 : activeChapter === 3;
              const stateLabel = restored ? (active ? 'ACTIVE_GATE' : 'VERIFIED') : 'STANDBY';

              return (
                <div
                  key={checkpoint.id}
                  className={`dashboard-checkpoint-node ${checkpoint.slotClass} fu d${index + 4} ${restored ? 'is-restored' : ''} ${active ? 'is-active' : ''}`}
                >
                  <span className="dashboard-checkpoint-node__short">{checkpoint.short}</span>
                  <h3 className="dashboard-checkpoint-node__title hf">{checkpoint.title}</h3>
                  <p className="dashboard-checkpoint-node__subtitle">{checkpoint.subtitle}</p>
                  <p className="dashboard-checkpoint-node__state">STATE={stateLabel}</p>
                </div>
              );
            })}

            {MODULES.map((mod, idx) => {
              const unlocked = isModuleUnlocked(mod, progress.completedMissions, MODULES);
              const done = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
              const modComplete = done === mod.missions.length;
              const badgeEarned = progress.badges.includes(mod.badge.id);
              const hasImpl = mod.missions.some(m => m.implemented);
              const isActive = activeModule?.id === mod.id;
              const isFinal = mod.id === MODULES[MODULES.length - 1].id;
              const chapterId = mod.id <= 4 ? 1 : mod.id <= 8 ? 2 : 3;
              const chapter = CHAPTERS[chapterId - 1];
              const stateLabel = modComplete
                ? 'RESTORED'
                : isActive
                  ? 'PROCESSING'
                  : unlocked
                    ? 'AVAILABLE'
                    : 'DEGRADED';

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => unlocked && onSelectModule(mod)}
                  className={`card dashboard-module-card dashboard-topology__node chapter-${chapterId} ${TOPOLOGY_SLOTS[idx] ?? ''} fu ${DL[idx] ?? ''} ${unlocked ? 'lift' : ''} ${!unlocked ? 'is-locked' : ''} ${modComplete ? 'is-restored' : ''} ${isActive ? 'is-active' : ''} ${isFinal ? 'is-final' : ''}`}
                  style={{
                    '--module-accent': mod.accent,
                    opacity: unlocked ? 1 : 0.45,
                    padding: '1.25rem',
                    border: `1px solid ${modComplete ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                    pointerEvents: unlocked ? 'auto' : 'none',
                  } as CSSProperties}
                >
                  <div className="dashboard-module-card__halo" aria-hidden="true" />
                  <div className="dashboard-module-card__head">
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

                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)', fontSize: '.62rem' }}>
                      {ARCHIVE_COPY.moduleLabel} {mod.id}
                    </span>
                    <span className="tag dashboard-module-card__chapter-tag">
                      {chapter.short}
                    </span>
                    {isFinal && (
                      <span className="tag dashboard-module-card__destination-tag">
                        ФИНАЛ
                      </span>
                    )}
                    {modComplete && (
                      <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>восстановлен</span>
                    )}
                    {!hasImpl && (
                      <span className="tag" style={{ background: 'var(--accent-softer)', color: 'var(--accent)', fontSize: '.58rem' }}>ожидание</span>
                    )}
                  </div>

                  <h3 className="dashboard-module-card__title hf">{mod.title}</h3>
                  <p className="dashboard-module-card__subtitle">{mod.subtitle}</p>
                  <p className="dashboard-module-card__state mb-3">
                    STATE={stateLabel} · LOAD={done}/{mod.missions.length}
                  </p>
                  <div className="dashboard-module-card__progress mb-2">
                    <ProgressBar value={done} max={mod.missions.length} color={mod.accent} />
                  </div>
                  <div className="dashboard-module-card__foot">
                    <span className="dashboard-module-card__metric">протоколы {done}/{mod.missions.length}</span>
                    <span className="dashboard-module-card__metric" style={{ color: mod.accent }}>⚡ {mod.xpReward}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
