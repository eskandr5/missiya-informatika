import { useEffect, useMemo, useState } from 'react';
import '../styles/module4.css';
import type { MediaFileType, MediaItem, MediaPreviewState, MediaTypeClassificationData } from '../types/activity';
import DataTypeZone from '../components/module4/DataTypeZone';
import MediaFileCard from '../components/module4/MediaFileCard';
import MediaPreviewPanel from '../components/module4/MediaPreviewPanel';

interface Props {
  data: MediaTypeClassificationData;
  onComplete: (score: number) => void;
}

type FileState = 'idle' | 'selected' | 'correct' | 'wrong' | 'locked';
type ZoneState = 'idle' | 'hover' | 'correct' | 'wrong';

export default function MediaTypeClassificationActivity({ data, onComplete }: Props) {
  const [activeItemId, setActiveItemId] = useState<string>(data.items[0]?.id ?? '');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [assignedZones, setAssignedZones] = useState<Record<string, MediaFileType>>({});
  const [hoverZoneId, setHoverZoneId] = useState<MediaFileType | null>(null);
  const [wrongItemId, setWrongItemId] = useState<string | null>(null);
  const [wrongZoneId, setWrongZoneId] = useState<MediaFileType | null>(null);
  const [previewState, setPreviewState] = useState<MediaPreviewState>('neutral');

  const currentItem = useMemo(
    () => data.items.find(item => item.id === activeItemId) ?? data.items[0] ?? null,
    [activeItemId, data.items],
  );

  const correctCount = Object.keys(assignedZones).length;

  useEffect(() => {
    if (correctCount === data.items.length && data.items.length > 0) {
      setPreviewState('restored');
      const timeoutId = window.setTimeout(() => onComplete(100), 700);
      return () => window.clearTimeout(timeoutId);
    }
  }, [correctCount, data.items.length, onComplete]);

  const assignItemToZone = (zoneId: MediaFileType) => {
    if (!selectedItemId) return;
    const selectedItem = data.items.find(item => item.id === selectedItemId);
    if (!selectedItem) return;

    setActiveItemId(selectedItem.id);

    if (selectedItem.fileType === zoneId) {
      setAssignedZones(prev => ({ ...prev, [selectedItem.id]: zoneId }));
      setSelectedItemId(null);
      setHoverZoneId(null);
      setPreviewState('restored');
      return;
    }

    setWrongItemId(selectedItem.id);
    setWrongZoneId(zoneId);
    setPreviewState('error');
    window.setTimeout(() => {
      setWrongItemId(null);
      setWrongZoneId(null);
      setPreviewState('neutral');
    }, 650);
  };

  const zoneItems = (zoneId: MediaFileType) =>
    data.items.filter(item => assignedZones[item.id] === zoneId);

  const getFileState = (item: MediaItem): FileState => {
    if (assignedZones[item.id]) return 'correct';
    if (wrongItemId === item.id) return 'wrong';
    if (selectedItemId === item.id) return 'selected';
    return 'idle';
  };

  const getZoneState = (zoneId: MediaFileType): ZoneState => {
    if (wrongZoneId === zoneId) return 'wrong';
    if (hoverZoneId === zoneId) return 'hover';
    if (zoneItems(zoneId).length > 0) return 'correct';
    return 'idle';
  };

  return (
    <div className="m4-activity">
      <p className="m4-activity__intro">
        Перетащите файл в нужную зону или выберите файл и нажмите на зону. Панель слева покажет, как выглядит изображение, звук или таблица.
      </p>

      <div className="m4-activity__layout">
        <MediaPreviewPanel
          item={currentItem}
          state={previewState}
          helperText={
            previewState === 'error'
              ? 'Файл не подходит к этой зоне. Попробуйте ещё раз.'
              : previewState === 'restored'
                ? 'Файл определён правильно.'
                : 'Выберите файл и посмотрите его вид.'
          }
        />

        <div className="m4-activity__panel">
          <div className="m4-activity__panel-head">
            <div>
              <p className="m4-activity__eyebrow">Шаг 1</p>
              <h4 className="m4-activity__title">Файлы для проверки</h4>
            </div>
            <div className="m4-activity__counter">{correctCount}/{data.items.length}</div>
          </div>

          <div className="m4-file-list">
            {data.items.map(item => (
              <MediaFileCard
                key={item.id}
                item={item}
                state={getFileState(item)}
                draggable={!assignedZones[item.id]}
                onClick={() => {
                  if (assignedZones[item.id]) return;
                  setSelectedItemId(value => value === item.id ? null : item.id);
                  setActiveItemId(item.id);
                  setPreviewState('neutral');
                }}
                onMouseEnter={() => {
                  setActiveItemId(item.id);
                  if (!wrongItemId) setPreviewState(assignedZones[item.id] ? 'restored' : 'neutral');
                }}
                onDragStart={(draggedItem) => {
                  if (assignedZones[draggedItem.id]) return;
                  setSelectedItemId(draggedItem.id);
                  setActiveItemId(draggedItem.id);
                  setPreviewState('neutral');
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="m4-activity__panel">
        <div className="m4-activity__panel-head">
          <div>
            <p className="m4-activity__eyebrow">Шаг 2</p>
            <h4 className="m4-activity__title">Зоны по типу файла</h4>
          </div>
          <p className="m4-activity__hint">Графика, звук, данные</p>
        </div>

        <div className="m4-zone-grid">
          {data.zones.map(zone => (
            <DataTypeZone
              key={zone.id}
              zone={zone}
              items={zoneItems(zone.id)}
              state={getZoneState(zone.id)}
              onClick={() => assignItemToZone(zone.id)}
              onDropItem={assignItemToZone}
              onDragEnter={setHoverZoneId}
              onDragLeave={() => setHoverZoneId(null)}
            />
          ))}
        </div>
      </div>

      <div className={`m4-feedback m4-feedback--panel ${previewState === 'error' ? 'is-wrong' : previewState === 'restored' ? 'is-correct' : ''}`}>
        <span className="m4-feedback__mark">
          {previewState === 'error' ? '✗' : previewState === 'restored' ? '✓' : '—'}
        </span>
        <span>
          {previewState === 'error'
            ? 'Неверная зона. Сравните вид файла и попробуйте ещё раз.'
            : previewState === 'restored'
              ? 'Файл определён правильно.'
              : `Готово: ${correctCount}/${data.items.length}`}
        </span>
      </div>
    </div>
  );
}
