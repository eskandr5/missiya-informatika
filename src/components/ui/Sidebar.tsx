import { HiOutlineBars3, HiOutlineBookOpen, HiOutlineHome, HiOutlineUser } from 'react-icons/hi2';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRank: string;
  userBadge: string;
}

export default function Sidebar({
  currentView,
  onNavigate,
  isOpen,
  onToggle,
  userRank,
  userBadge,
}: SidebarProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const menuItems = [
    { id: 'dashboard', label: 'Панель', icon: <HiOutlineHome /> },
    { id: 'modules', label: 'Модули', icon: <HiOutlineBookOpen /> },
    { id: 'profile', label: 'Профиль', icon: <HiOutlineUser /> },
  ];

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="app-sidebar__header">
          <div className="app-sidebar__logo">
            <span>◆</span>
            <span>Архив информатики</span>
          </div>
        </div>

        <nav className="app-sidebar__nav" aria-label="Основная навигация">
          {menuItems.map(item => (
            <button
              key={item.id}
              type="button"
              className={`app-sidebar__item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                if (isMobile) onToggle();
              }}
            >
              <span className="app-sidebar__icon">{item.icon}</span>
              <span className="app-sidebar__label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-sidebar__user">
            <div className="app-sidebar__avatar">{userBadge}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.85rem', color: 'rgba(248, 250, 252, .96)', fontWeight: 600 }}>
                {userRank}
              </div>
              <div style={{ fontSize: '.72rem', color: 'rgba(203, 213, 225, .72)' }}>
                Текущий доступ
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isMobile && !isOpen && (
        <button
          className="mobile-sidebar-toggle"
          type="button"
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: '14px',
            left: '14px',
            zIndex: 220,
            background: 'linear-gradient(135deg, #1d4ed8, #0f172a)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(30, 64, 175, .22)',
            display: 'flex',
          }}
          aria-label="Открыть боковое меню"
        >
          <HiOutlineBars3 size={22} />
        </button>
      )}

      {isMobile && isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, .52)',
            zIndex: 180,
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
