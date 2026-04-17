import { getRank } from '../../data/ranks';

interface Props {
  xp: number;
  theme: 'light' | 'dark';
  onHome: () => void;
  onProfile: () => void;
  onToggleTheme: () => void;
}

export default function NavBar({ xp, theme, onHome, onProfile, onToggleTheme }: Props) {
  const rank = getRank(xp);
  return (
    <nav className="app-nav">
      <button
        onClick={onHome}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        className="app-nav__brand hf font-bold text-lg text-white flex items-center gap-2"
      >
        <span style={{ color: 'var(--accent)' }}>◈</span>
        <span className="app-nav__brand-text">Миссия: Информатика</span>
      </button>

      <div className="app-nav__meta flex items-center gap-2">
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: 'var(--surface-soft)',
            border: '1px solid var(--border-accent-soft)',
          }}
        >
          <span className="text-sm">{rank.icon}</span>
          <span className="hf text-blue-300 text-sm font-semibold">{rank.name}</span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="hf text-blue-400 font-bold text-sm">{xp} XP</span>
        </div>
        <button onClick={onToggleTheme} className="theme-toggle" aria-label="Переключить тему">
          <span className="theme-toggle__icon" aria-hidden="true">{theme === 'light' ? '☀' : '☾'}</span>
          <span className="theme-toggle__label">{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>
        <button onClick={onProfile} className="btn-g text-sm px-3 py-1.5">
          Профиль
        </button>
      </div>
    </nav>
  );
}
