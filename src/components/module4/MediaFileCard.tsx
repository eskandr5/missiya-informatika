import type { MediaItem } from '../../types/activity';

type CardState = 'idle' | 'selected' | 'correct' | 'wrong' | 'locked';

interface Props {
  item: MediaItem;
  state: CardState;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: (item: MediaItem) => void;
  onMouseEnter?: () => void;
}

function getTypeLabel(fileType: MediaItem['fileType']) {
  if (fileType === 'image') return 'Графика';
  if (fileType === 'audio') return 'Звук';
  return 'Данные';
}

export default function MediaFileCard({
  item,
  state,
  draggable = false,
  onClick,
  onDragStart,
  onMouseEnter,
}: Props) {
  return (
    <button
      type="button"
      draggable={draggable}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onDragStart={() => onDragStart?.(item)}
      className={`m4-file-card is-${state}`}
    >
      <div className="m4-file-card__head">
        <span className="m4-file-card__icon">{item.fileType === 'image' ? '◼' : item.fileType === 'audio' ? '◉' : '≡'}</span>
        <span className="m4-file-card__format">{item.format}</span>
      </div>
      <h4 className="m4-file-card__title">{item.name}</h4>
      <div className="m4-file-card__meta">
        <span>{getTypeLabel(item.fileType)}</span>
        {item.sizeLabel && <span>{item.sizeLabel}</span>}
      </div>
    </button>
  );
}
