import type { MediaItem, MediaPreviewState } from '../../types/activity';

interface Props {
  item: MediaItem | null;
  state: MediaPreviewState;
}

export default function MediaStatusBar({ item, state }: Props) {
  if (!item) {
    return (
      <div className="m4-status-bar">
        <span>Файл не выбран</span>
        <span>Состояние: ожидание</span>
      </div>
    );
  }

  return (
    <div className={`m4-status-bar is-${state}`}>
      <span>Тип: {item.fileType === 'image' ? 'графика' : item.fileType === 'audio' ? 'звук' : 'данные'}</span>
      <span>Формат: {state === 'corrupted' ? 'неясно' : item.format}</span>
      {item.resolutionLabel && <span>Размер: {item.resolutionLabel}</span>}
      {item.durationLabel && <span>Длительность: {item.durationLabel}</span>}
      {item.rowsLabel && item.columnsLabel && <span>Таблица: {item.rowsLabel} × {item.columnsLabel}</span>}
      {item.sizeLabel && <span>Файл: {item.sizeLabel}</span>}
    </div>
  );
}
