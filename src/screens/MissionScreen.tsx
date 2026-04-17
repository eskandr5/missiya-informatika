import { useState, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { Mission, Module, MissionType } from '../types/content';
import type { ActivityData } from '../types/activity';
import { DL } from '../utils/helpers';
import StepBar from '../components/ui/StepBar';
import VocabCard from '../components/mission/VocabCard';
import PhraseRow from '../components/mission/PhraseRow';
import MatchingActivity      from '../activities/MatchingActivity';
import SequenceActivity      from '../activities/SequenceActivity';
import MultipleChoiceActivity from '../activities/MultipleChoiceActivity';
import DragDropActivity      from '../activities/DragDropActivity';
import ClassificationActivity from '../activities/ClassificationActivity';
import ErrorCorrectionActivity from '../activities/ErrorCorrectionActivity';

interface ActivityProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  onComplete: (score: number) => void;
}

const ACTIVITY_MAP: Partial<Record<MissionType, ComponentType<ActivityProps>>> = {
  matching:          MatchingActivity,
  sequence:          SequenceActivity,
  multiple_choice:   MultipleChoiceActivity,
  drag_drop:         DragDropActivity,
  classification:    ClassificationActivity,
  error_correction:  ErrorCorrectionActivity,
};

const FLOW_STEPS = ['briefing', 'vocab', 'phrases', 'activity'] as const;
type FlowStep = typeof FLOW_STEPS[number];

const TYPE_LABELS: Partial<Record<MissionType, string>> = {
  matching:         'Соответствие',
  sequence:         'Хронология',
  drag_drop:        'Распределение',
  classification:   'Классификация',
  error_correction: 'Исправление ошибок',
  multiple_choice:  'Тест',
};

interface Props {
  mission: Mission;
  module: Module;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function MissionScreen({ mission, module: mod, onFinish, onBack }: Props) {
  const [step,   setStep]   = useState<FlowStep>('briefing');
  const [showEn, setShowEn] = useState(false);

  const modVocab = useMemo(() => {
    const [a, b] = mission.vocabSlice;
    return mod.vocab.slice(a, b);
  }, [mission, mod]);

  const stepIdx = FLOW_STEPS.indexOf(step);
  const nextStep = () => { if (stepIdx < FLOW_STEPS.length - 1) setStep(FLOW_STEPS[stepIdx + 1]); };
  const prevStep = () => { if (stepIdx > 0) setStep(FLOW_STEPS[stepIdx - 1]); else onBack(); };

  const ActivityComp = ACTIVITY_MAP[mission.type];

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      {/* Mission header */}
      <div
        style={{
          background: 'var(--surface-nav)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          position: 'sticky',
          top: '56px',
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
                    Модуль {mod.id}
                  </span>
                  <span className="tag" style={{ background: 'var(--surface-strong)', color: 'var(--text-dim)' }}>
                    Миссия {mission.num}
                  </span>
                </div>
                <h2 className="hf text-white font-bold text-base mt-0.5 truncate">{mission.title}</h2>
              </div>
            </div>
            <div className="mission-screen__actions flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowEn(e => !e)}
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
        {/* ── BRIEFING ── */}
        {step === 'briefing' && (
          <div className="fu">
            <div className="card p-6 mb-5" style={{ border: '1px solid var(--border-accent-soft)' }}>
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)' }}
                >
                  📋
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Инструктаж</p>
                  <h3 className="hf text-white font-bold text-lg">{mission.title}</h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{mission.briefing}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  Тип: {mission.type.replace('_', ' ')}
                </div>
                <div className="tag" style={{ background: 'var(--warning-soft)', color: 'var(--warning-color)' }}>
                  ⚡ {mission.xpReward} XP
                </div>
                <div className="tag" style={{ background: 'var(--success-soft)', color: 'var(--success-color)' }}>
                  Порог: {mission.passingScore}%
                </div>
              </div>
            </div>
            <button onClick={nextStep} className="btn-p">К словарю →</button>
          </div>
        )}

        {/* ── VOCAB ── */}
        {step === 'vocab' && (
          <div className="fu">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Словарный запас</p>
                <h3 className="hf text-white font-bold text-xl">Ключевые понятия</h3>
              </div>
              <span className="tag" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {modVocab.length} слов
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
              {modVocab.map((w, i) => (
                <VocabCard key={w.id} word={w} showEn={showEn} delay={DL[i] ?? ''} />
              ))}
            </div>
            <div className="mission-screen__step-nav">
              <button onClick={prevStep} className="btn-g">← Назад</button>
              <button onClick={nextStep} className="btn-p">К фразам →</button>
            </div>
          </div>
        )}

        {/* ── PHRASES ── */}
        {step === 'phrases' && (
          <div className="fu">
            <div className="mb-4">
              <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Ключевые фразы</p>
              <h3 className="hf text-white font-bold text-xl">Запомните эти выражения</h3>
              <p className="text-slate-500 text-sm mt-1">Эти фразы встречаются в задании. Изучите их перед началом.</p>
            </div>
            <div className="space-y-2 mb-6">
              {mod.phrases.map((ph, i) => (
                <PhraseRow key={i} phrase={ph} showEn={showEn} delay={DL[i] ?? ''} />
              ))}
            </div>
            <div className="mission-screen__step-nav">
              <button onClick={prevStep} className="btn-g">← Назад</button>
              <button onClick={nextStep} className="btn-p">К заданию →</button>
            </div>
          </div>
        )}

        {/* ── ACTIVITY ── */}
        {step === 'activity' && (
          <div className="fu">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  {TYPE_LABELS[mission.type] ?? 'Задание'}
                </p>
                <h3 className="hf text-white font-bold text-xl">{mission.title}</h3>
              </div>
              <button onClick={prevStep} className="btn-g text-sm px-3 py-1.5">← Фразы</button>
            </div>
            <div className="card p-5" style={{ border: '1px solid var(--border-color)' }}>
              {ActivityComp && mission.activityData ? (
                <ActivityComp data={mission.activityData as ActivityData} onComplete={onFinish} />
              ) : (
                <div className="text-center py-14">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
                  <h4 className="hf text-white font-bold text-lg mb-2">В разработке</h4>
                  <p className="text-slate-500 text-sm">Этот модуль появится в следующем обновлении.</p>
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
