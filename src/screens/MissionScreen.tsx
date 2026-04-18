import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import type { ActivityData } from '../types/activity';
import type { Mission, MissionType, Module, Phrase } from '../types/content';
import { DL } from '../utils/helpers';
import MatchingActivity from '../activities/MatchingActivity';
import SequenceActivity from '../activities/SequenceActivity';
import MultipleChoiceActivity from '../activities/MultipleChoiceActivity';
import PhraseOrderingActivity from '../activities/PhraseOrderingActivity';
import PhraseChoiceActivity from '../activities/PhraseChoiceActivity';
import ListenAndChooseActivity from '../activities/ListenAndChooseActivity';
import ListenAndMatchActivity from '../activities/ListenAndMatchActivity';
import DragDropActivity from '../activities/DragDropActivity';
import ClassificationActivity from '../activities/ClassificationActivity';
import ErrorCorrectionActivity from '../activities/ErrorCorrectionActivity';
import {
  ARCHIVE_COPY,
  ARCHIVE_MISSION_TYPE_LABELS,
  getArchiveStageLabel,
} from '../data/archiveTerminology';
import PhraseRow from '../components/mission/PhraseRow';
import VocabCard from '../components/mission/VocabCard';
import StepBar from '../components/ui/StepBar';

interface ActivityProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onComplete: (score: number) => void;
  phrases?: Phrase[];
}

const ACTIVITY_MAP: Partial<Record<MissionType, ComponentType<ActivityProps>>> = {
  matching: MatchingActivity,
  sequence: SequenceActivity,
  multiple_choice: MultipleChoiceActivity,
  phrase_ordering: PhraseOrderingActivity,
  phrase_choice: PhraseChoiceActivity,
  listen_and_choose: ListenAndChooseActivity,
  listen_and_match: ListenAndMatchActivity,
  drag_drop: DragDropActivity,
  classification: ClassificationActivity,
  error_correction: ErrorCorrectionActivity,
};

const FLOW_STEPS = ['briefing', 'vocab', 'phrases', 'activity'] as const;
type FlowStep = typeof FLOW_STEPS[number];

interface Props {
  mission: Mission;
  module: Module;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function MissionScreen({ mission, module: mod, onFinish, onBack }: Props) {
  const [step, setStep] = useState<FlowStep>('briefing');
  const [showEn, setShowEn] = useState(false);

  const modVocab = useMemo(() => {
    const [a, b] = mission.vocabSlice;
    return mod.vocab.slice(a, b);
  }, [mission, mod]);

  const stepIdx = FLOW_STEPS.indexOf(step);
  const isCheckpoint = mission.stageType === 'checkpoint';
  const ActivityComp = ACTIVITY_MAP[mission.type];

  const nextStep = () => {
    if (stepIdx < FLOW_STEPS.length - 1) setStep(FLOW_STEPS[stepIdx + 1]);
  };

  const prevStep = () => {
    if (stepIdx > 0) setStep(FLOW_STEPS[stepIdx - 1]);
    else onBack();
  };

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      <div
        style={{
          background: 'var(--surface-nav)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          position: 'sticky',
          top: 'var(--nav-height)',
          zIndex: 30,
        }}
      >
        <div className="app-shell app-shell--narrow app-shell--flush" style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div className="mission-screen__topbar flex items-center justify-between gap-3">
            <div className="mission-screen__actions flex items-center gap-3 min-w-0">
              <button onClick={prevStep} className="btn-g text-sm px-3 py-1.5 flex-shrink-0">← Назад</button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tag" style={{ background: 'var(--cyan-soft)', color: 'var(--accent)' }}>
                    {ARCHIVE_COPY.moduleLabel} {mod.id}
                  </span>
                  <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                    {getArchiveStageLabel(mission.stageType, mission.num)}
                  </span>
                  {mod.chapter && (
                    <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                      {mod.chapter}
                    </span>
                  )}
                </div>
                <h2 className="hf text-white font-bold text-base mt-0.5 truncate">{mission.title}</h2>
              </div>
            </div>
            <div className="mission-screen__actions flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowEn(value => !value)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                style={{
                  background: showEn ? 'var(--accent-soft)' : 'var(--surface-soft)',
                  border: '1px solid var(--border-accent-soft)',
                  color: showEn ? 'var(--accent)' : 'var(--text-dim)',
                  cursor: 'pointer',
                }}
              >
                {showEn ? 'RU+EN' : 'RU'}
              </button>
              <span className="text-xs font-bold text-amber-400">⚡ {mission.xpReward} XP</span>
            </div>
          </div>
          <StepBar steps={[...FLOW_STEPS]} current={step} />
        </div>
      </div>

      <div className="app-shell app-shell--narrow" style={{ maxWidth: '880px', margin: '0 auto', paddingBlock: '2rem' }}>
        {step === 'briefing' && (
          <div className="fu">
            <div className="card p-6 mb-5" style={{ border: '1px solid var(--border-accent-soft)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)' }}
                >
                  {isCheckpoint ? '🏁' : mod.icon}
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                    {isCheckpoint ? ARCHIVE_COPY.checkpointLabel : 'Сводка'}
                  </p>
                  <h3 className="hf text-white font-bold text-lg">{mission.title}</h3>
                  {mod.moduleIdentity && (
                    <p className="text-slate-500 text-xs mt-1">{mod.moduleIdentity}</p>
                  )}
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">{mission.briefing}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Режим</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.openingStyle ?? 'Стандартный ввод'}</p>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'var(--surface-soft)', border: '1px solid var(--border-color)' }}
                >
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Контур</p>
                  <p className="text-slate-300 text-sm font-semibold">{mod.specialMechanic ?? 'Практика по теме раздела'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  Тип: {ARCHIVE_MISSION_TYPE_LABELS[mission.type] ?? mission.type.replace(/_/g, ' ')}
                </div>
                {isCheckpoint && (
                  <div className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
                    Переход к следующему разделу
                  </div>
                )}
                <div className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
                  ⚡ {mission.xpReward} XP
                </div>
                <div className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
                  Порог: {mission.passingScore}%
                </div>
              </div>
            </div>
            <button onClick={nextStep} className="btn-p">К терминам →</button>
          </div>
        )}

        {step === 'vocab' && (
          <div className="fu">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{ARCHIVE_COPY.vocabLabel}</p>
                <h3 className="hf text-white font-bold text-xl">
                  {isCheckpoint ? 'Краткое восстановление' : 'Ключевые термины'}
                </h3>
              </div>
              <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {modVocab.length} терминов
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {modVocab.map((word, index) => (
                <VocabCard key={word.id} word={word} showEn={showEn} delay={DL[index] ?? ''} />
              ))}
            </div>
            <div className="mission-screen__step-nav">
              <button onClick={prevStep} className="btn-g">← Назад</button>
              <button onClick={nextStep} className="btn-p">К формулировкам →</button>
            </div>
          </div>
        )}

        {step === 'phrases' && (
          <div className="fu">
            <div className="mb-4">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{ARCHIVE_COPY.phraseLabel}</p>
              <h3 className="hf text-white font-bold text-xl">
                {isCheckpoint ? 'Финальная настройка перед узлом' : 'Опорные формулировки'}
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                {isCheckpoint
                  ? 'Проверьте знакомые команды и переходите к контрольному проходу.'
                  : 'Эти формулировки встретятся в протоколе. Зафиксируйте их перед началом.'}
              </p>
            </div>
            <div className="space-y-2 mb-6">
              {mod.phrases.map((phrase, index) => (
                <PhraseRow key={index} phrase={phrase} showEn={showEn} delay={DL[index] ?? ''} />
              ))}
            </div>
            <div className="mission-screen__step-nav">
              <button onClick={prevStep} className="btn-g">← Назад</button>
              <button onClick={nextStep} className="btn-p">{isCheckpoint ? 'К узлу →' : 'К протоколу →'}</button>
            </div>
          </div>
        )}

        {step === 'activity' && (
          <div className="fu">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  {isCheckpoint ? ARCHIVE_COPY.checkpointLabel : ARCHIVE_MISSION_TYPE_LABELS[mission.type] ?? ARCHIVE_COPY.missionLabel}
                </p>
                <h3 className="hf text-white font-bold text-xl">{mission.title}</h3>
                {mod.moduleFeel && (
                  <p className="text-slate-500 text-sm mt-1">{mod.moduleFeel}</p>
                )}
              </div>
              <button onClick={prevStep} className="btn-g text-sm px-3 py-1.5">← Формулировки</button>
            </div>
            <div className="card p-5" style={{ border: '1px solid var(--border-color)' }}>
              {ActivityComp && mission.activityData ? (
                <ActivityComp
                  data={mission.activityData as ActivityData}
                  onComplete={onFinish}
                  phrases={mod.phrases}
                />
              ) : (
                <div className="text-center py-14">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                  <h4 className="hf text-white font-bold text-lg mb-2">Раздел готовится</h4>
                  <p className="text-slate-500 text-sm">Этот режим будет добавлен в следующем обновлении реестра.</p>
                  <div className="tag mt-4" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Скоро</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
