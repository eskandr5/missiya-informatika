import type { MediaPreviewState } from '../../types/activity';

interface Props {
  state: MediaPreviewState;
}

export default function DataPreviewBlock({ state }: Props) {
  const rows = [
    ['id', 'тип', 'значение'],
    ['01', 'цвет', 'синий'],
    ['02', 'звук', '24 кГц'],
    ['03', 'размер', '1920×1080'],
  ];

  return (
    <div className={`m4-data-preview is-${state}`} aria-hidden="true">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="m4-data-preview__row">
          {row.map((cell, cellIndex) => {
            const isError = state === 'error' && rowIndex === 2 && cellIndex === 1;
            const isFaded = state === 'corrupted' && rowIndex > 0 && cellIndex === 2;
            return (
              <span
                key={`${rowIndex}-${cellIndex}`}
                className={`m4-data-preview__cell ${rowIndex === 0 ? 'is-head' : ''} ${isError ? 'is-error' : ''}`}
                style={{ opacity: isFaded ? 0.3 : 1 }}
              >
                {isError ? '??' : cell}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
