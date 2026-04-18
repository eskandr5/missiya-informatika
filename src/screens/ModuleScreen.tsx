import { useState } from 'react';
import { MODULES } from '../data/modules';
import {
  ARCHIVE_COPY,
  ARCHIVE_MISSION_TYPE_LABELS,
} from '../data/archiveTerminology';
import { isMissionUnlocked } from '../utils/progression';
import { DL } from '../utils/helpers';
import ProgressBar from '../components/ui/ProgressBar';
import VocabCard from '../components/mission/VocabCard';
import PhraseRow from '../components/mission/PhraseRow';
import type { Module, Mission } from '../types/content';
import type { Progress } from '../types/progress';

interface Props {
  module: Module;
  progress: Progress;
  onSelectMission: (m: Mission) => void;
  onBack: () => void;
}

type Tab = 'missions' | 'vocab' | 'phrases';

export default function ModuleScreen({ module: mod, progress, onSelectMission, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('missions');
  const [showEn, setShowEn] = useState(false);

  const doneCount = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
  const pct = Math.round((doneCount / mod.missions.length) * 100);
  const lockedCount = mod.missions.length - doneCount;

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      <div
        style={{
          background: 'var(--surface-header)',
          borderBottom: '1px solid var(--border-color)',
          padding: '2rem 1.5rem',
        }}
      >
        <div className="app-shell app-shell--narrow app-shell--flush" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={onBack} className="btn-g text-sm px-3 py-1.5 mb-4">← {ARCHIVE_COPY.dashboardTitle}</button>
          <div className="module-screen__hero flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${mod.accent}15`, border: `1px solid ${mod.accent}35` }}
            >
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {ARCHIVE_COPY.moduleLabel} {mod.id}
                </span>
                {mod.chapter && (
                  <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                    {mod.chapter}
                  </span>
                )}
                {doneCount === mod.missions.length && (
                  <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
                    ✓ Восстановлен
                  </span>
                )}
              </div>
              <h1 className="hf text-2xl font-bold text-white">{mod.title}</h1>
              <p className="text-slate-500 text-sm mt-1">{mod.subtitle}</p>
              <p className="text-slate-400 text-sm mt-2">{mod.desc}</p>
              <p
                className="text-slate-500 text-xs mt-3"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  letterSpacing: '.04em',
                }}
              >
                SECTION.STATUS // RESTORED={pct}% · OPEN_PROTOCOLS={lockedCount}
              </p>
            </div>
            <button
              onClick={() => setShowEn(e => !e)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{
                background: showEn ? 'var(--accent-soft)' : 'var(--surface-soft)',
                border: '1px solid var(--border-accent-soft)',
                color: showEn ? 'var(--accent)' : 'var(--text-dim)',
                cursor: 'pointer',
              }}
            >
              {showEn ? 'RU+EN' : 'RU'}
            </button>
          </div>

          {(mod.moduleIdentity || mod.openingStyle || mod.specialMechanic) && (
            <div className="card p-4 mt-4" style={{ border: '1px solid var(--border-color)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Идентификатор сектора</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.moduleIdentity}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Входной режим</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.openingStyle}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Контур обработки</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.specialMechanic}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Состояние сектора</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.moduleFeel}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {mod.rewardType && (
                  <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
                    Разблокировка: {mod.rewardType}
                  </span>
                )}
                {mod.videoMode && (
                  <span className="tag" style={{ background: 'var(--cyan-soft)', color: 'var(--accent)' }}>
                    Канал: {mod.videoMode}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Состояние восстановления</span>
              <span className="hf font-semibold text-slate-400">{doneCount}/{mod.missions.length} {ARCHIVE_COPY.missionLabelPlural} · {pct}%</span>
            </div>
            <ProgressBar value={doneCount} max={mod.missions.length} color={mod.accent} />
          </div>
        </div>
      </div>

      <div className="app-shell app-shell--narrow" style={{ maxWidth: '900px', margin: '0 auto', paddingBlock: '1.5rem' }}>
        <div
          className="module-screen__tabs mb-5 p-1 rounded-xl"
          style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-color)' }}
        >
          {(['missions', 'vocab', 'phrases'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'var(--accent-soft)' : 'transparent',
                color: tab === t ? 'var(--accent)' : 'var(--text-dim)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t === 'missions' ? 'Протоколы' : t === 'vocab' ? 'Термины' : 'Формулировки'}
            </button>
          ))}
        </div>

        {tab === 'missions' && (
          <div className="space-y-3 fu">
            {mod.missions.map((m) => {
              const done = progress.completedMissions.includes(m.id);
              const unlocked = isMissionUnlocked(m, mod, progress.completedMissions, MODULES);
              const sc = progress.missionScores[m.id] ?? 0;
              const isCheckpoint = m.stageType === 'checkpoint';

              return (
                <div
                  key={m.id}
                  className={`card p-5 ${unlocked ? 'lift' : ''}`}
                  style={{
                    opacity: unlocked ? 1 : 0.5,
                    border: `1px solid ${done ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                  }}
                >
                  <div className="module-screen__mission-row flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold hf flex-shrink-0 text-xl"
                      style={{
                        background: done ? 'var(--success-soft)' : unlocked ? 'var(--accent-soft)' : 'var(--surface-contrast)',
                        border: `1px solid ${done ? 'var(--success-color)' : unlocked ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
                      }}
                    >
                      {done ? '✓' : unlocked ? m.num : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="hf text-white font-bold">{m.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                          {ARCHIVE_MISSION_TYPE_LABELS[m.type] ?? m.type.replace(/_/g, ' ')}
                        </span>
                        {isCheckpoint && (
                          <span className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
                            {ARCHIVE_COPY.checkpointLabel}
                          </span>
                        )}
                        <span className="text-xs text-amber-400">⚡{m.xpReward} XP</span>
                        {!m.implemented && (
                          <span className="tag" style={{ background: 'var(--accent-softer)', color: 'var(--accent)' }}>
                            Недоступно
                          </span>
                        )}
                        {done && <span className="text-xs text-green-400">Зафиксировано: {sc}%</span>}
                      </div>
                    </div>
                    {unlocked && m.implemented && (
                      <button
                        onClick={() => onSelectMission(m)}
                        className={`module-screen__mission-action ${done ? 'btn-s text-sm px-4 py-2' : 'btn-p text-sm px-4 py-2'}`}
                      >
                        {done ? 'Запустить повторно' : isCheckpoint ? 'Перейти к узлу →' : 'Открыть протокол →'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="fu">
            <p className="text-slate-500 text-sm mb-4">{mod.vocab.length} терминов · Выберите карточку для просмотра зафиксированного определения</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mod.vocab.map((w, i) => (
                <VocabCard key={w.id} word={w} showEn={showEn} delay={DL[i] ?? ''} />
              ))}
            </div>
          </div>
        )}

        {tab === 'phrases' && (
          <div className="fu space-y-2">
            {mod.phrases.map((ph, i) => (
              <PhraseRow key={i} phrase={ph} showEn={showEn} delay={DL[i] ?? ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
