import { MODULES } from '../data/modules';
import { getRank } from '../data/ranks';
import { ARCHIVE_COPY } from '../data/archiveTerminology';
import type { Progress } from '../types/progress';

interface Props {
  progress: Progress;
  onStart: () => void;
}

export default function LandingScreen({ progress, onStart }: Props) {
  const rank      = getRank(progress.xp);
  const returning = progress.completedMissions.length > 0;
  const totalModules = MODULES.length;
  const totalMissions = MODULES.reduce((sum, mod) => sum + mod.missions.length, 0);
  const restoredPct = Math.round((progress.completedMissions.length / totalMissions) * 100);

  return (
    <div className="min-h-screen bg-grid" style={{ paddingBottom: '4rem' }}>
      {/* Hero */}
      <div
        style={{
          minHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4.5rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}
      >
        <div
          className="fu inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-ring)' }}
        >
          <span style={{ color: 'var(--accent)', fontSize: '.78rem' }}>●</span>
          <span className="text-blue-300 text-xs font-bold tracking-wider uppercase">
            Система учебного восстановления
          </span>
        </div>

        <h1
          className="hf fu d1"
          style={{
            fontSize: 'clamp(2.7rem, 6.4vw, 4.9rem)',
            fontWeight: 900,
            lineHeight: 1.04,
            color: 'var(--text-primary)',
            marginBottom: '1.15rem',
          }}
        >
          АРХИВ:<br />
          <span
            style={{
              background: 'var(--hero-title-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Информатика
          </span>
        </h1>

        <p
          className="fu d2 text-slate-400 text-lg mb-4"
          style={{ maxWidth: '560px', lineHeight: 1.72 }}
        >
          Интерфейс восстановления архивного корпуса по информатике. Разделы возвращаются в рабочее
          состояние последовательно: через термины, формулировки и исполнительные протоколы.
        </p>

        <p className="fu d3 text-slate-500 text-sm mb-8" style={{ maxWidth: '620px', lineHeight: 1.8 }}>
          Текущая задача: восстановить {totalModules} {ARCHIVE_COPY.moduleLabelPlural}, зафиксировать
          результаты и расширить уровень допуска оператора по мере ввода разделов в рабочий контур.
        </p>

        <div className="fu d4 flex flex-wrap gap-3 justify-center text-slate-500 text-sm mb-8">
          <span>📚 {totalModules} {ARCHIVE_COPY.moduleLabelPlural}</span><span>·</span>
          <span>⚡ {totalMissions} {ARCHIVE_COPY.missionLabelPlural}</span><span>·</span>
          <span>◈ {ARCHIVE_COPY.rankLabel}</span><span>·</span>
          <span>🎖️ Знаки</span>
        </div>

        <div className="fu d5">
          <button onClick={onStart} className="btn-p text-lg px-8 py-4 glow">
            {returning ? 'Вернуться к восстановлению →' : 'Инициализировать доступ →'}
          </button>
        </div>

        {returning && (
          <div
            className="fu d6 mt-5 px-5 py-3 rounded-xl text-sm"
            style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-color)' }}
          >
            <span className="text-slate-400">Статус оператора: </span>
            <span className="hf text-blue-300 font-bold">{rank.icon} {rank.name}</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="hf text-amber-400 font-bold">{progress.xp} XP</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="text-slate-400">
              восстановлено {restoredPct}% · {progress.completedMissions.length} {ARCHIVE_COPY.missionLabelPlural}
            </span>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🗂️', t: 'Архив терминов', d: 'Ключевые понятия и английские соответствия для поэтапного восстановления разделов' },
            { icon: '◈', t: 'Исполнительные контуры', d: 'Сопоставление, последовательности, классификация, коррекция и другие рабочие режимы' },
            { icon: '⬡', t: 'Допуск и фиксация', d: 'XP, уровни доступа, архивные знаки и сводка состояния по всему реестру' },
          ].map((f, i) => (
            <div
              key={i}
              className={`card fu d${i + 5} p-5`}
              style={{ border: '1px solid var(--border-color)' }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="hf text-white font-bold mb-1 text-sm">{f.t}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
