import type { Mission, Module, BadgeDef } from '../types/content';
import { ARCHIVE_COPY } from '../data/archiveTerminology';

interface Props {
  score: number;
  mission: Mission;
  module: Module;
  passed: boolean;
  xpEarned: number;
  badgeEarned: BadgeDef | null;
  onRetry: () => void;
  onNext: (() => void) | null;
  onModulePage: () => void;
  onDashboard: () => void;
}

export default function ResultScreen({
  score, mission, module: mod, passed, xpEarned, badgeEarned,
  onRetry, onNext, onModulePage, onDashboard,
}: Props) {
  const ringColor = passed ? 'var(--success-color)' : score >= 50 ? 'var(--warning-color)' : 'var(--danger-color)';
  const circumference = 289; // 2π × 46
  const isCheckpoint = mission.stageType === 'checkpoint';

  return (
    <div className="app-page result-screen min-h-screen bg-grid flex items-center justify-center p-6">
      <div
        className="result-screen__card card p-8 fu text-center"
        style={{
          maxWidth: '480px',
          width: '100%',
          border: `1px solid ${passed ? 'var(--success-color)' : 'var(--danger-color)'}`,
        }}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '.75rem' }} className="pop">
          {passed ? (isCheckpoint ? '🏁' : '🎯') : '🔁'}
        </div>

        <h2
          className="hf text-3xl font-bold mb-1"
          style={{ color: passed ? 'var(--success-text)' : 'var(--danger-text)' }}
        >
          {passed ? (isCheckpoint ? 'Контрольный узел подтверждён' : 'Целостность протокола подтверждена') : 'Обнаружено отклонение'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">{mission.title} · {ARCHIVE_COPY.moduleLabel} {mod.id}</p>

        <div className="flex justify-center mb-5">
          <div className="relative" style={{ width: '112px', height: '112px' }}>
            <svg width="112" height="112" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="46" fill="none" stroke="var(--progress-track)" strokeWidth="9" />
              <circle
                cx="56"
                cy="56"
                r="46"
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 56 56)"
                style={{ transition: 'stroke-dasharray .75s ease' }}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="hf text-2xl font-bold text-white">{score}%</span>
              <span className="text-xs text-slate-500">индекс</span>
            </div>
          </div>
        </div>

        <p
          className="text-slate-500 text-xs mb-4"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            letterSpacing: '.04em',
          }}
        >
          VERIFY.LOG // SCORE={score}% · THRESHOLD={mission.passingScore}% · STATE={passed ? 'ACCEPTED' : 'REVIEW'}
        </p>

        <div
          className="mb-5 px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: passed ? 'var(--success-soft)' : 'var(--danger-soft)',
            border: `1px solid ${passed ? 'var(--success-color)' : 'var(--danger-color)'}`,
          }}
        >
          {passed ? (
            <span className="text-green-300">✓ Данные приняты. Минимальный порог {mission.passingScore}% выполнен</span>
          ) : (
            <span className="text-red-300">
              Зафиксированное значение ниже допустимого: {score}% при требуемом пороге {mission.passingScore}%
            </span>
          )}
        </div>

        {passed && isCheckpoint && (
          <div
            className="mb-5 px-4 py-3 rounded-xl"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent-soft)' }}
          >
            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Переход раздела</p>
            <p className="text-slate-300 text-sm font-semibold">
              {mod.chapter ?? 'Первый раздел'} закрыт без нарушений. Следующий сектор готов к активации.
            </p>
          </div>
        )}

        {passed && (
          <div className="result-screen__rewards flex justify-center gap-3 mb-5 fu d2">
            <div
              className="px-4 py-3 rounded-xl"
              style={{ background: 'var(--accent-soft)', border: '1px solid var(--border-accent-soft)' }}
            >
              <div className="hf text-xl font-bold text-blue-300">+{xpEarned}</div>
              <div className="text-xs text-slate-500 mt-0.5">XP внесено в запись</div>
            </div>
            {badgeEarned && (
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'var(--success-soft)', border: '1px solid var(--success-color)' }}
              >
                <div className="text-xl pop">{badgeEarned.icon}</div>
                <div className="text-xs text-slate-400 mt-0.5">{badgeEarned.name}</div>
              </div>
            )}
          </div>
        )}

        {!passed && (
          <p className="text-slate-500 text-xs mb-5">
            Выполните повторную сверку терминов и формулировок, затем перезапустите протокол. XP вносится только после подтверждённого результата.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {passed && onNext && (
            <button onClick={onNext} className="btn-p w-full">
              {isCheckpoint ? 'Активировать следующий раздел →' : 'Открыть следующий протокол →'}
            </button>
          )}
          <div className="result-screen__actions flex gap-2">
            <button onClick={onRetry} className="btn-s flex-1">↺ Перезапуск</button>
            <button onClick={onModulePage} className="btn-g flex-1">{ARCHIVE_COPY.moduleLabel}</button>
            <button onClick={onDashboard} className="btn-g flex-1">◈ Реестр</button>
          </div>
        </div>
      </div>
    </div>
  );
}
