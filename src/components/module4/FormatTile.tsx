import type { MediaFormat } from '../../types/activity';

type TileState = 'idle' | 'selected' | 'correct' | 'wrong';

interface Props {
  label: MediaFormat;
  state: TileState;
  onClick: () => void;
}

export default function FormatTile({ label, state, onClick }: Props) {
  return (
    <button type="button" onClick={onClick} className={`m4-format-tile is-${state}`}>
      <span className="m4-format-tile__label">{label}</span>
    </button>
  );
}
