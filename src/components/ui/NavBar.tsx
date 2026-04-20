import { getRank } from '../../data/ranks';
import { ARCHIVE_COPY } from '../../data/archiveTerminology';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

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
        type="button"
        onClick={onHome}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        className="app-nav__brand hf text-lg flex items-center gap-2"
        aria-label="Перейти к списку модулей"
      >
        <span style={{ color: 'var(--accent)' }}>◈</span>
        <span className="app-nav__brand-text">{ARCHIVE_COPY.appTitle}</span>
      </button>

      <div className="app-nav__meta flex items-center gap-2">
        <div className="app-nav__status hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl">
          <span className="text-sm">{rank.icon}</span>
          <span className="hf text-blue-300 text-sm font-semibold">{rank.name}</span>
          <span className="text-slate-600 text-xs">•</span>
          <span className="hf text-blue-400 font-bold text-sm">{xp} XP</span>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="theme-toggle"
          aria-label="Переключить тему"
        >
          <span className="theme-toggle__icon inline-flex items-center justify-center text-base" aria-hidden="true">
            {theme === 'light' ? <HiOutlineSun /> : <HiOutlineMoon />}
          </span>
          <span className="theme-toggle__label">{theme === 'light' ? 'Светлая' : 'Тёмная'}</span>
        </button>

        <button type="button" onClick={onProfile} className="btn-g text-sm px-3 py-1.5">
          Профиль
        </button>
      </div>
    </nav>
  );
}
