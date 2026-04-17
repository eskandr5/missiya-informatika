import type { BadgeDef } from '../../types/content';

interface Props {
  badge: BadgeDef;
  earned: boolean;
  size?: 'sm' | 'md';
}

export default function Badge({ badge, earned, size = 'md' }: Props) {
  const sz = size === 'sm' ? 'w-9 h-9 text-lg' : 'w-14 h-14 text-3xl';
  return (
    <div className={`flex flex-col items-center gap-1 ${!earned ? 'badge-locked' : ''}`}>
      <div
        className={`${sz} rounded-xl flex items-center justify-center ${earned ? 'pop' : ''}`}
        style={{
          background: earned ? 'rgba(37,99,235,.2)' : 'rgba(15,25,50,.5)',
          border: `1px solid ${earned ? 'rgba(37,99,235,.45)' : 'rgba(30,41,59,.7)'}`,
        }}
      >
        {badge.icon}
      </div>
      {badge.name && (
        <span className="badge-name text-xs text-slate-500 text-center">{badge.name}</span>
      )}
    </div>
  );
}
