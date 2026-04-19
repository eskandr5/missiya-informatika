import type { BadgeDef } from '../../types/content';

interface Props {
  badge: BadgeDef;
  earned: boolean;
  size?: 'sm' | 'md';
  showName?: boolean;
}

export default function Badge({ badge, earned, size = 'md', showName = true }: Props) {
  const sizeClass = size === 'sm' ? 'w-10 h-10 text-xl' : 'w-16 h-16 text-3xl';

  return (
    <div className={`flex flex-col items-center gap-1.5 ${!earned ? 'badge-locked' : ''}`}>
      <div
        className={`${sizeClass} rounded-2xl flex items-center justify-center ${earned ? 'pop' : ''}`}
        style={{
          background: earned ? 'var(--accent-soft)' : 'var(--surface-contrast)',
          border: `1px solid ${earned ? 'var(--accent-ring)' : 'var(--border-strong)'}`,
          boxShadow: earned ? '0 8px 18px rgba(37, 99, 235, .1)' : 'none',
        }}
      >
        {badge.icon}
      </div>
      {showName && badge.name && (
        <span className="badge-name text-xs text-slate-500 text-center">{badge.name}</span>
      )}
    </div>
  );
}
