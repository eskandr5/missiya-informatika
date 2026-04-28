import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBookOpen,
  HiOutlineBolt,
  HiOutlineMoon,
  HiOutlineSquares2X2,
  HiOutlineSun,
  HiOutlineUser,
} from 'react-icons/hi2';
import type { Progress } from '../../types/progress';

interface NavBarProps {
  progress: Progress;
  currentView: 'dashboard' | 'modules' | 'profile';
  theme: 'light' | 'dark';
  onNavigateDashboard: () => void;
  onNavigateModules: () => void;
  onNavigateProfile: () => void;
  onThemeChange: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onNavigateLogin?: () => void;
  onLogout?: () => void;
}

export default function ModernNavBar({
  progress,
  currentView,
  theme,
  onNavigateDashboard,
  onNavigateModules,
  onNavigateProfile,
  onThemeChange,
  isAuthenticated = false,
  userEmail,
  onNavigateLogin,
  onLogout,
}: NavBarProps) {
  const avatarValue = userEmail?.slice(0, 2).toUpperCase() || 'MI';

  return (
    <nav className="app-nav">
      <div className="app-nav__content">
        <button type="button" className="app-nav__brand-block" onClick={onNavigateDashboard}>
          <span className="app-nav__brand-icon" aria-hidden="true">
            <HiOutlineBolt />
          </span>
          <span className="app-nav__brand-copy">
            <strong>МИССИЯ:ИНФОРМАТИКА</strong>
            <small>Интерактивная карта обучения</small>
          </span>
        </button>

        <div className="app-nav__menu" role="tablist" aria-label="Основная навигация">
          <button
            type="button"
            className={`app-nav__menu-btn${currentView === 'dashboard' ? ' is-active' : ''}`}
            onClick={onNavigateDashboard}
          >
            <HiOutlineSquares2X2 aria-hidden="true" />
            <span>Карта</span>
          </button>

          <button
            type="button"
            className={`app-nav__menu-btn${currentView === 'modules' ? ' is-active' : ''}`}
            onClick={onNavigateModules}
          >
            <HiOutlineBookOpen aria-hidden="true" />
            <span>Разделы</span>
          </button>

          <button
            type="button"
            className={`app-nav__menu-btn${currentView === 'profile' ? ' is-active' : ''}`}
            onClick={onNavigateProfile}
          >
            <HiOutlineUser aria-hidden="true" />
            <span>Профиль</span>
          </button>
        </div>

        <div className="app-nav__actions">
          <div className="app-nav__metric">
            <HiOutlineBookOpen aria-hidden="true" />
            <span>{progress.completedMissions.length}</span>
          </div>

          <div className="app-nav__metric app-nav__metric--accent">
            <HiOutlineBolt aria-hidden="true" />
            <span>{progress.xp.toLocaleString('en-US')}</span>
          </div>

          <button
            className="app-nav__action-btn"
            type="button"
            onClick={onThemeChange}
            title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
            aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          >
            {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
          </button>

          {isAuthenticated ? (
            <button
              className="app-nav__auth-btn"
              type="button"
              onClick={onLogout}
              title="Выйти"
            >
              <HiOutlineArrowRightOnRectangle aria-hidden="true" />
              <span>Выйти</span>
            </button>
          ) : (
            <button
              className="app-nav__auth-btn"
              type="button"
              onClick={onNavigateLogin}
              title="Войти"
            >
              <HiOutlineUser aria-hidden="true" />
              <span>Войти</span>
            </button>
          )}

          <div className="app-nav__avatar" aria-hidden="true">
            {avatarValue}
          </div>
        </div>
      </div>
    </nav>
  );
}
