import { MODULES } from '../data/modules';
import { getRank } from '../data/ranks';
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
            Цифровая академия · Учебный симулятор
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
          Миссия:<br />
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
          Учебная платформа для студентов подготовительного факультета. Прогрессируйте через {totalModules} модулей информатики.
        </p>

        <div className="fu d3 flex flex-wrap gap-3 justify-center text-slate-500 text-sm mb-8">
          <span>📚 {totalModules} модулей</span><span>·</span>
          <span>⚡ {totalMissions} миссий</span><span>·</span>
          <span>🏆 Рейтинг</span><span>·</span>
          <span>🎖️ Значки</span>
        </div>

        <div className="fu d4">
          <button onClick={onStart} className="btn-p text-lg px-8 py-4 glow">
            {returning ? 'Продолжить обучение →' : 'Начать миссию →'}
          </button>
        </div>

        {returning && (
          <div
            className="fu d5 mt-5 px-5 py-3 rounded-xl text-sm"
            style={{ background: 'var(--surface-strong)', border: '1px solid var(--border-color)' }}
          >
            <span className="text-slate-400">Прогресс: </span>
            <span className="hf text-blue-300 font-bold">{rank.icon} {rank.name}</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="hf text-amber-400 font-bold">{progress.xp} XP</span>
            <span className="text-slate-600 mx-2">·</span>
            <span className="text-slate-400">{progress.completedMissions.length} миссий завершено</span>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🗂️', t: 'Словарный запас',        d: 'Карточки с русскими понятиями и английскими глоссами для каждого модуля' },
            { icon: '🎯', t: 'Интерактивные задания',   d: 'Соответствия, хронология, классификация, исправление ошибок и другие типы' },
            { icon: '🏆', t: 'Прогресс и достижения',  d: 'Система XP, звания, значки за каждый модуль и карта прогресса' },
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
