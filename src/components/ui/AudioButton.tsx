import type { MouseEventHandler } from 'react';

interface Props {
  isPlaying: boolean;
  isDisabled?: boolean;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function AudioButton({ isPlaying, isDisabled = false, label, onClick }: Props) {
  const actionLabel = isDisabled
    ? `Озвучка недоступна: ${label}`
    : `${isPlaying ? 'Остановить озвучку' : 'Прослушать'}: ${label}`;

  return (
    <button
      type="button"
      className={`audio-trigger${isPlaying ? ' is-playing' : ''}`}
      aria-label={actionLabel}
      aria-pressed={isPlaying}
      title={actionLabel}
      onClick={onClick}
      disabled={isDisabled}
    >
      <svg
        className="audio-trigger__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 10.5V13.5H8.2L12.4 17V7L8.2 10.5H5Z" />
        <path d={isPlaying ? 'M16 8.25C17.55 9.3 18.5 11.05 18.5 12.95C18.5 14.85 17.55 16.6 16 17.65' : 'M15.5 9.25C16.6 10.1 17.25 11.45 17.25 12.95C17.25 14.45 16.6 15.8 15.5 16.65'} />
        <path d={isPlaying ? 'M18.6 5.5C20.85 7.2 22 10.05 22 12.95C22 15.85 20.85 18.7 18.6 20.4' : 'M18 7.25C19.5 8.6 20.3 10.7 20.3 12.95C20.3 15.2 19.5 17.3 18 18.65'} />
      </svg>
    </button>
  );
}
