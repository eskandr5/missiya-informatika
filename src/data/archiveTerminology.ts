import type { MissionStageType, MissionType } from '../types/content';

export const ARCHIVE_COPY = {
  appTitle: 'АРХИВ: ИНФОРМАТИКА',
  appKicker: 'Учебный архивный реестр',
  dashboardTitle: 'Реестр разделов',
  moduleLabel: 'Раздел',
  moduleLabelPlural: 'разделов',
  missionLabel: 'Протокол',
  missionLabelPlural: 'протоколов',
  checkpointLabel: 'Контрольный узел',
  rankLabel: 'Допуск',
  profileTitle: 'Личное дело',
  vocabLabel: 'Термины',
  phraseLabel: 'Формулировки',
} as const;

export const ARCHIVE_MISSION_TYPE_LABELS: Partial<Record<MissionType, string>> = {
  matching: 'Сопоставление',
  sequence: 'Последовательность',
  multiple_choice: 'Контроль',
  phrase_ordering: 'Сборка формулировок',
  phrase_choice: 'Выбор формулировки',
  listen_and_choose: 'Аудиоконтроль',
  listen_and_match: 'Аудиосопоставление',
  drag_drop: 'Распределение',
  classification: 'Классификация',
  error_correction: 'Коррекция',
  audio_quiz: 'Аудиорежим',
  video_quiz: 'Видеорежим',
  logic_table: 'Логическая схема',
  final_mixed: 'Сводный протокол',
  media_classification: 'Типы файлов',
  media_format_selection: 'Форматы файлов',
  media_property_check: 'Свойства файлов',
  media_kit_assembly: 'Сборка набора',
  binary_lock: 'Бинарный замок',
};

export function getArchiveStageLabel(stageType: MissionStageType | undefined, missionNum: number) {
  return stageType === 'checkpoint'
    ? ARCHIVE_COPY.checkpointLabel
    : `${ARCHIVE_COPY.missionLabel} ${missionNum}`;
}
