import { useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineBolt,
  HiOutlineCheck,
  HiOutlineLanguage,
  HiOutlineLockClosed,
} from 'react-icons/hi2';
import { MODULES } from '../data/modules';
import {
  ARCHIVE_COPY,
  ARCHIVE_MISSION_TYPE_LABELS,
} from '../data/archiveTerminology';
import {
  getCheckpointAfterModule,
  isCheckpointUnlocked,
  isMissionUnlocked,
} from '../utils/progression';
import { DL } from '../utils/helpers';
import ProgressBar from '../components/ui/ProgressBar';
import VocabCard from '../components/mission/VocabCard';
import PhraseRow from '../components/mission/PhraseRow';
import type { Module, ProgressionStage } from '../types/content';
import type { Progress } from '../types/progress';

interface Props {
  module: Module;
  progress: Progress;
  onSelectStage: (stage: ProgressionStage) => void;
  onBack: () => void;
}

type Tab = 'missions' | 'vocab' | 'phrases';

const TAB_LABELS: Record<Tab, string> = {
  missions: 'Протоколы',
  vocab: 'Термины',
  phrases: 'Формулировки',
};

export default function ModuleScreen({ module: mod, progress, onSelectStage, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('missions');
  const [showEn, setShowEn] = useState(false);

  const doneCount = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
  const pct = Math.round((doneCount / mod.missions.length) * 100);
  const lockedCount = mod.missions.length - doneCount;
  const checkpoint = getCheckpointAfterModule(mod.id);
  const checkpointDone = checkpoint ? progress.completedCheckpoints.includes(checkpoint.id) : false;
  const checkpointScore = checkpoint ? (progress.checkpointScores[checkpoint.id] ?? 0) : 0;
  const checkpointUnlocked = checkpoint ? isCheckpointUnlocked(checkpoint, progress, MODULES) : false;

  return (
    <div className="app-page module-screen min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      <header className="module-screen__header">
        <div className="app-shell app-shell--narrow app-shell--flush" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button type="button" onClick={onBack} className="btn-g text-sm module-screen__back">
            <HiOutlineArrowLeft aria-hidden="true" />
            <span>{ARCHIVE_COPY.dashboardTitle}</span>
          </button>

          <div className="module-screen__hero-shell">
            <div className="module-screen__hero">
              <div
                className="module-screen__hero-icon"
                style={{ background: `${mod.accent}15`, border: `1px solid ${mod.accent}35` }}
              >
                {mod.icon}
              </div>

              <div className="module-screen__hero-main">
                <div className="module-screen__hero-top">
                  <div className="module-screen__hero-tags">
                    <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                      {ARCHIVE_COPY.moduleLabel} {mod.id}
                    </span>
                    {mod.chapter && (
                      <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                        {mod.chapter}
                      </span>
                    )}
                    {doneCount === mod.missions.length && (
                      <span
                        className="tag inline-flex items-center gap-1"
                        style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}
                      >
                        <HiOutlineCheck aria-hidden="true" />
                        Завершён
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEn(value => !value)}
                    className={`module-screen__lang-toggle${showEn ? ' is-active' : ''}`}
                  >
                    <HiOutlineLanguage aria-hidden="true" />
                    <span>{showEn ? 'RU + EN' : 'RU'}</span>
                  </button>
                </div>

                <h1 className="module-screen__title hf">{mod.title}</h1>
                <p className="module-screen__subtitle">{mod.subtitle}</p>
                <p className="module-screen__description">{mod.desc}</p>
                <p className="module-screen__status-line">
                  SECTION.STATUS // RESTORED={pct}% · OPEN_PROTOCOLS={lockedCount}
                </p>
              </div>
            </div>

            {(mod.moduleIdentity || mod.openingStyle || mod.specialMechanic) && (
              <section className="module-screen__info-card card">
                <div className="module-screen__info-grid">
                  <div className="module-screen__info-item">
                    <p className="module-screen__info-label">Тип модуля</p>
                    <p className="module-screen__info-value">{mod.moduleIdentity}</p>
                  </div>
                  <div className="module-screen__info-item">
                    <p className="module-screen__info-label">Начало</p>
                    <p className="module-screen__info-value">{mod.openingStyle}</p>
                  </div>
                  <div className="module-screen__info-item">
                    <p className="module-screen__info-label">Формат работы</p>
                    <p className="module-screen__info-value">{mod.specialMechanic}</p>
                  </div>
                  <div className="module-screen__info-item">
                    <p className="module-screen__info-label">Стиль</p>
                    <p className="module-screen__info-value">{mod.moduleFeel}</p>
                  </div>
                </div>

                <div className="module-screen__info-tags">
                  {mod.rewardType && (
                    <span className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
                      Награда: {mod.rewardType}
                    </span>
                  )}
                  {mod.videoMode && (
                    <span className="tag" style={{ background: 'var(--cyan-soft)', color: 'var(--accent)' }}>
                      Видео: {mod.videoMode}
                    </span>
                  )}
                </div>
              </section>
            )}

            <div className="module-screen__progress">
              <div className="module-screen__progress-head">
                <span>Прогресс модуля</span>
                <span className="module-screen__progress-value hf">
                  {doneCount}/{mod.missions.length} {ARCHIVE_COPY.missionLabelPlural} · {pct}%
                </span>
              </div>
              <ProgressBar value={doneCount} max={mod.missions.length} color={mod.accent} />
            </div>
          </div>
        </div>
      </header>

      <div className="app-shell app-shell--narrow module-screen__content" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="module-screen__tabs">
          {(['missions', 'vocab', 'phrases'] as Tab[]).map(tabName => (
            <button
              key={tabName}
              type="button"
              onClick={() => setTab(tabName)}
              className={`module-screen__tab${tab === tabName ? ' is-active' : ''}`}
            >
              {TAB_LABELS[tabName]}
            </button>
          ))}
        </div>

        {tab === 'missions' && (
          <div className="space-y-3 fu">
            {mod.missions.map((mission) => {
              const done = progress.completedMissions.includes(mission.id);
              const unlocked = isMissionUnlocked(mission, mod, progress, MODULES);
              const score = progress.missionScores[mission.id] ?? 0;

              return (
                <div
                  key={mission.id}
                  className={`card module-screen__mission-card ${unlocked ? 'lift' : ''}`}
                  style={{
                    opacity: unlocked ? 1 : 0.56,
                    border: `1px solid ${done ? 'var(--success-color)' : unlocked ? 'var(--border-accent-soft)' : 'var(--border-strong)'}`,
                  }}
                >
                  <div className="module-screen__mission-row">
                    <div
                      className="module-screen__mission-state"
                      style={{
                        background: done ? 'var(--success-soft)' : unlocked ? 'var(--accent-soft)' : 'var(--surface-contrast)',
                        border: `1px solid ${done ? 'var(--success-color)' : unlocked ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
                      }}
                    >
                      {done ? (
                        <HiOutlineCheck className="text-[1.05rem]" aria-hidden="true" />
                      ) : unlocked ? (
                        mission.num
                      ) : (
                        <HiOutlineLockClosed className="text-[1rem]" aria-hidden="true" />
                      )}
                    </div>

                    <div className="module-screen__mission-body">
                      <h3 className="module-screen__mission-title hf">{mission.title}</h3>
                      <div className="module-screen__mission-meta">
                        <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                          {ARCHIVE_MISSION_TYPE_LABELS[mission.type] ?? mission.type.replace(/_/g, ' ')}
                        </span>
                        <span className="module-screen__mission-xp">
                          <HiOutlineBolt aria-hidden="true" />
                          {mission.xpReward} XP
                        </span>
                        {!mission.implemented && (
                          <span className="tag" style={{ background: 'var(--accent-softer)', color: 'var(--accent)' }}>
                            Недоступно
                          </span>
                        )}
                        {done && (
                          <span className="module-screen__mission-score">
                            Зафиксировано: {score}%
                          </span>
                        )}
                      </div>
                    </div>

                    {unlocked && mission.implemented && (
                      <button
                        type="button"
                        onClick={() => onSelectStage(mission)}
                        className={`module-screen__mission-action ${done ? 'btn-s' : 'btn-p'}`}
                      >
                        {done ? 'Повторить' : 'Открыть'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {checkpoint && (
              <div
                className={`card module-screen__mission-card ${checkpointUnlocked ? 'lift' : ''}`}
                style={{
                  opacity: checkpointUnlocked ? 1 : 0.56,
                  border: `1px solid ${checkpointDone ? 'var(--success-color)' : checkpointUnlocked ? 'var(--warning-color)' : 'var(--border-strong)'}`,
                }}
              >
                <div className="module-screen__mission-row">
                  <div
                    className="module-screen__mission-state"
                    style={{
                      background: checkpointDone ? 'var(--success-soft)' : checkpointUnlocked ? 'var(--warning-soft)' : 'var(--surface-contrast)',
                      border: `1px solid ${checkpointDone ? 'var(--success-color)' : checkpointUnlocked ? 'var(--warning-color)' : 'var(--border-strong)'}`,
                    }}
                  >
                    {checkpointDone ? (
                      <HiOutlineCheck className="text-[1.05rem]" aria-hidden="true" />
                    ) : checkpointUnlocked ? (
                      '◎'
                    ) : (
                      <HiOutlineLockClosed className="text-[1rem]" aria-hidden="true" />
                    )}
                  </div>

                  <div className="module-screen__mission-body">
                    <h3 className="module-screen__mission-title hf">{checkpoint.title}</h3>
                    <div className="module-screen__mission-meta">
                      <span className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
                        {ARCHIVE_COPY.checkpointLabel}
                      </span>
                      <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                        После модуля {checkpoint.afterModuleId}
                      </span>
                      <span className="module-screen__mission-xp">
                        <HiOutlineBolt aria-hidden="true" />
                        {checkpoint.xpReward} XP
                      </span>
                      {checkpointDone && (
                        <span className="module-screen__mission-score">
                          Зафиксировано: {checkpointScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  {checkpointUnlocked && checkpoint.implemented && (
                    <button
                      type="button"
                      onClick={() => onSelectStage(checkpoint)}
                      className={`module-screen__mission-action ${checkpointDone ? 'btn-s' : 'btn-p'}`}
                    >
                      {checkpointDone ? 'Повторить' : 'Открыть контрольную точку'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'vocab' && (
          <div className="fu">
            <p className="module-screen__library-copy">
              {mod.vocab.length} терминов · Выберите карточку для просмотра определения
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mod.vocab.map((word, index) => (
                <VocabCard key={word.id} word={word} showEn={showEn} delay={DL[index] ?? ''} />
              ))}
            </div>
          </div>
        )}

        {tab === 'phrases' && (
          <div className="fu space-y-2">
            <p className="module-screen__library-copy">
              Короткие формулировки по теме модуля. Русская фраза остаётся основной, английская версия помогает ориентироваться в терминах.
            </p>
            {mod.phrases.map((phrase, index) => (
              <PhraseRow key={index} phrase={phrase} showEn={showEn} delay={DL[index] ?? ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
