import { useState } from 'react';
import { MODULES } from '../data/modules';
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
  const [tab,    setTab]    = useState<Tab>('missions');
  const [showEn, setShowEn] = useState(false);

  const doneCount = mod.missions.filter(m => progress.completedMissions.includes(m.id)).length;
  const pct       = Math.round((doneCount / mod.missions.length) * 100);

  return (
    <div className="app-page min-h-screen bg-grid" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(6,11,22,.96)',
          borderBottom: '1px solid rgba(30,58,138,.22)',
          padding: '2rem 1.5rem',
        }}
      >
        <div className="app-shell app-shell--narrow app-shell--flush" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button onClick={onBack} className="btn-g text-sm px-3 py-1.5 mb-4">← Карта модулей</button>
          <div className="module-screen__hero flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${mod.accent}15`, border: `1px solid ${mod.accent}35` }}
            >
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="tag" style={{ background: 'rgba(37,99,235,.1)', color: '#60a5fa' }}>
                  Модуль {mod.id}
                </span>
                {doneCount === mod.missions.length && (
                  <span className="tag" style={{ background: 'rgba(34,197,94,.1)', color: '#4ade80' }}>✓ Завершён</span>
                )}
              </div>
              <h1 className="hf text-2xl font-bold text-white">{mod.title}</h1>
              <p className="text-slate-400 text-sm mt-1">{mod.desc}</p>
            </div>
            <button
              onClick={() => setShowEn(e => !e)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{
                background: showEn ? 'rgba(37,99,235,.18)' : 'rgba(20,30,60,.6)',
                border: '1px solid rgba(37,99,235,.2)',
                color: showEn ? '#93c5fd' : '#475569',
                cursor: 'pointer',
              }}
            >
              {showEn ? 'RU+EN' : 'RU'}
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Прогресс модуля</span>
              <span className="hf font-semibold text-slate-400">{doneCount}/{mod.missions.length} миссий · {pct}%</span>
            </div>
            <ProgressBar value={doneCount} max={mod.missions.length} color={mod.accent} />
          </div>
        </div>
      </div>

      <div className="app-shell app-shell--narrow" style={{ maxWidth: '900px', margin: '0 auto', paddingBlock: '1.5rem' }}>
        {/* Tab bar */}
        <div
          className="module-screen__tabs mb-5 p-1 rounded-xl"
          style={{ background: 'rgba(10,16,32,.8)', border: '1px solid rgba(30,58,138,.18)' }}
        >
          {(['missions', 'vocab', 'phrases'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === t ? 'rgba(37,99,235,.22)' : 'transparent',
                color: tab === t ? '#93c5fd' : '#475569',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {t === 'missions' ? 'Миссии' : t === 'vocab' ? 'Словарь' : 'Фразы'}
            </button>
          ))}
        </div>

        {/* MISSIONS */}
        {tab === 'missions' && (
          <div className="space-y-3 fu">
            {mod.missions.map((m) => {
              const done     = progress.completedMissions.includes(m.id);
              const unlocked = isMissionUnlocked(m, mod, progress.completedMissions, MODULES);
              const sc       = progress.missionScores[m.id] ?? 0;
              return (
                <div
                  key={m.id}
                  className={`card p-5 ${unlocked ? 'lift' : ''}`}
                  style={{
                    opacity: unlocked ? 1 : 0.5,
                    border: `1px solid ${done ? 'rgba(34,197,94,.28)' : unlocked ? 'rgba(30,58,138,.3)' : 'rgba(20,30,55,.5)'}`,
                  }}
                >
                  <div className="module-screen__mission-row flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold hf flex-shrink-0 text-xl"
                      style={{
                        background: done ? 'rgba(34,197,94,.1)' : unlocked ? 'rgba(37,99,235,.1)' : 'rgba(15,25,50,.5)',
                        border: `1px solid ${done ? 'rgba(34,197,94,.3)' : unlocked ? 'rgba(37,99,235,.28)' : 'rgba(30,41,59,.4)'}`,
                      }}
                    >
                      {done ? '✓' : unlocked ? m.num : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="hf text-white font-bold">{m.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="tag" style={{ background: 'rgba(15,25,50,.8)', color: '#475569' }}>
                          {m.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-amber-400">⚡{m.xpReward} XP</span>
                        {!m.implemented && (
                          <span className="tag" style={{ background: 'rgba(37,99,235,.08)', color: '#3b82f6' }}>Скоро</span>
                        )}
                        {done && <span className="text-xs text-green-400">Лучший: {sc}%</span>}
                      </div>
                    </div>
                    {unlocked && m.implemented && (
                      <button
                        onClick={() => onSelectMission(m)}
                        className={`module-screen__mission-action ${done ? 'btn-s text-sm px-4 py-2' : 'btn-p text-sm px-4 py-2'}`}
                      >
                        {done ? 'Повторить' : 'Начать →'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VOCAB */}
        {tab === 'vocab' && (
          <div className="fu">
            <p className="text-slate-500 text-sm mb-4">{mod.vocab.length} понятий · Нажмите карточку для определения</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mod.vocab.map((w, i) => (
                <VocabCard key={w.id} word={w} showEn={showEn} delay={DL[i] ?? ''} />
              ))}
            </div>
          </div>
        )}

        {/* PHRASES */}
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
