import type { MediaItem, MediaPreviewState } from '../../types/activity';
import DataPreviewBlock from './DataPreviewBlock';
import MediaStatusBar from './MediaStatusBar';
import PixelPreview from './PixelPreview';
import WaveformBlock from './WaveformBlock';

interface Props {
  item: MediaItem | null;
  state: MediaPreviewState;
  helperText: string;
}

export default function MediaPreviewPanel({ item, state, helperText }: Props) {
  const renderPreview = () => {
    if (!item) {
      return (
        <div className="m4-preview-panel__empty">
          <div className="m4-preview-panel__empty-mark">◎</div>
          <p>Выберите файл, чтобы увидеть его вид.</p>
        </div>
      );
    }

    if (item.previewKind === 'pixel') return <PixelPreview state={state} />;
    if (item.previewKind === 'waveform') return <WaveformBlock state={state} />;
    return <DataPreviewBlock state={state} />;
  };

  return (
    <div className={`m4-preview-panel is-${state}`}>
      <div className="m4-preview-panel__head">
        <p className="m4-preview-panel__kicker">Панель просмотра</p>
        <h3 className="m4-preview-panel__title">{item?.name ?? 'Файл не выбран'}</h3>
        <p className="m4-preview-panel__copy">{helperText}</p>
      </div>
      <div className="m4-preview-panel__body">
        {renderPreview()}
      </div>
      <MediaStatusBar item={item} state={state} />
    </div>
  );
}
