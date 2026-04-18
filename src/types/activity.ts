export interface MatchingPair {
  term: string;
  def: string;
}
export interface MatchingData {
  pairs: MatchingPair[];
}

export interface SequenceEvent {
  id: number;
  year: string;
  text: string;
  order: number;
}
export interface SequenceData {
  events: SequenceEvent[];
}

export interface MCQuestion {
  id: string;
  q: string;
  opts: string[];
  correct: number;
}
export interface MultipleChoiceData {
  questions: MCQuestion[];
}

export type PhrasePromptMode = 'ru_to_en' | 'en_to_ru';

export interface PhraseOrderingQuestion {
  id: string;
  prompt: string;
  phraseIndex: number;
  chunks: string[];
}
export interface PhraseOrderingData {
  questions: PhraseOrderingQuestion[];
}

export interface PhraseChoiceQuestion {
  id: string;
  prompt: string;
  phraseIndex: number;
  optionIndexes: number[];
  mode?: PhrasePromptMode;
}
export interface PhraseChoiceData {
  questions: PhraseChoiceQuestion[];
}

export interface ListenAndChooseQuestion {
  id: string;
  prompt: string;
  audioText: string;
  choices: string[];
  correct: number;
  helperText?: string;
  revealText?: string;
}
export interface ListenAndChooseData {
  questions: ListenAndChooseQuestion[];
}

export interface ListenAndMatchPair {
  id: string;
  label: string;
  audioText: string;
  matchText: string;
  helperText?: string;
}
export interface ListenAndMatchData {
  pairs: ListenAndMatchPair[];
}

export interface DragDropItem {
  id: string;
  label: string;
  icon: string;
  correctZone: string;
}
export interface DragDropZone {
  id: string;
  label: string;
  desc: string;
  color: string;
}
export interface DragDropData {
  items: DragDropItem[];
  zones: DragDropZone[];
}

export interface ClassificationItem {
  id: string;
  label: string;
  icon: string;
  category: string;
}
export interface ClassificationCategory {
  id: string;
  label: string;
  desc: string;
  color: string;
  icon: string;
}
export interface ClassificationData {
  items: ClassificationItem[];
  categories: ClassificationCategory[];
}

export interface ErrorStatement {
  id: string;
  text: string;
  isCorrect: boolean;
  correction?: string;
  explanation: string;
}
export interface ErrorCorrectionData {
  context?: string;
  statements: ErrorStatement[];
}

export type MediaFileType = 'image' | 'audio' | 'data';
export type MediaFormat = 'PNG' | 'JPG' | 'SVG' | 'MP3' | 'WAV' | 'CSV';
export type MediaPreviewKind = 'pixel' | 'waveform' | 'data';
export type MediaPreviewState = 'neutral' | 'corrupted' | 'restored' | 'error';

export interface MediaItem {
  id: string;
  name: string;
  fileType: MediaFileType;
  format: MediaFormat;
  previewKind: MediaPreviewKind;
  previewState?: MediaPreviewState;
  sizeLabel?: string;
  resolutionLabel?: string;
  durationLabel?: string;
  rowsLabel?: string;
  columnsLabel?: string;
  accent?: string;
}

export interface MediaTypeZone {
  id: MediaFileType;
  label: string;
  desc: string;
  color: string;
}

export interface MediaTypeClassificationData {
  items: MediaItem[];
  zones: MediaTypeZone[];
}

export interface MediaFormatPrompt {
  id: string;
  prompt: string;
  item: MediaItem;
  choices: MediaFormat[];
  correctFormat: MediaFormat;
  helperText?: string;
}

export interface MediaFormatSelectionData {
  prompts: MediaFormatPrompt[];
}

export type ActivityData =
  | MatchingData
  | SequenceData
  | MultipleChoiceData
  | PhraseOrderingData
  | PhraseChoiceData
  | ListenAndChooseData
  | ListenAndMatchData
  | DragDropData
  | ClassificationData
  | ErrorCorrectionData
  | MediaTypeClassificationData
  | MediaFormatSelectionData;
