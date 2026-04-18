import type { CSSProperties } from 'react';
import type { MediaFileType, MediaItem, MediaTypeZone } from '../../types/activity';

type ZoneState = 'idle' | 'hover' | 'correct' | 'wrong';

interface Props {
  zone: MediaTypeZone;
  items: MediaItem[];
  state: ZoneState;
  onClick?: () => void;
  onDropItem: (zoneId: MediaFileType) => void;
  onDragEnter: (zoneId: MediaFileType) => void;
  onDragLeave: () => void;
}

export default function DataTypeZone({
  zone,
  items,
  state,
  onClick,
  onDropItem,
  onDragEnter,
  onDragLeave,
}: Props) {
  return (
    <button
      type="button"
      className={`m4-zone is-${state}`}
      style={{ '--zone-accent': zone.color } as CSSProperties}
      onClick={onClick}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={() => onDragEnter(zone.id)}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault();
        onDropItem(zone.id);
      }}
    >
      <div className="m4-zone__head">
        <h4 className="m4-zone__title">{zone.label}</h4>
        <span className="m4-zone__count">{items.length}</span>
      </div>
      <p className="m4-zone__desc">{zone.desc}</p>
      <div className="m4-zone__items">
        {items.length > 0 ? (
          items.map(item => (
            <span key={item.id} className="m4-zone__chip">{item.name}</span>
          ))
        ) : (
          <span className="m4-zone__hint">Перетащите файл сюда</span>
        )}
      </div>
    </button>
  );
}
