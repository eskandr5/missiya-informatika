import type {
  MediaFormatSelectionData,
  MediaItem,
  MediaTypeClassificationData,
} from '../types/activity';

const MODULE4_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'm4-image-poster',
    name: 'poster.png',
    fileType: 'image',
    format: 'PNG',
    previewKind: 'pixel',
    sizeLabel: '2.4 MB',
    resolutionLabel: '1920 × 1080',
    accent: '#8b5cf6',
  },
  {
    id: 'm4-image-logo',
    name: 'logo.jpg',
    fileType: 'image',
    format: 'JPG',
    previewKind: 'pixel',
    sizeLabel: '1.1 MB',
    resolutionLabel: '1280 × 720',
    accent: '#a855f7',
  },
  {
    id: 'm4-audio-intro',
    name: 'intro.wav',
    fileType: 'audio',
    format: 'WAV',
    previewKind: 'waveform',
    sizeLabel: '5.8 MB',
    durationLabel: '00:12',
    accent: '#06b6d4',
  },
  {
    id: 'm4-audio-voice',
    name: 'voice.mp3',
    fileType: 'audio',
    format: 'MP3',
    previewKind: 'waveform',
    sizeLabel: '1.9 MB',
    durationLabel: '00:24',
    accent: '#0891b2',
  },
  {
    id: 'm4-data-table',
    name: 'results.csv',
    fileType: 'data',
    format: 'CSV',
    previewKind: 'data',
    sizeLabel: '84 KB',
    rowsLabel: '24',
    columnsLabel: '5',
    accent: '#10b981',
  },
  {
    id: 'm4-data-report',
    name: 'colors.csv',
    fileType: 'data',
    format: 'CSV',
    previewKind: 'data',
    sizeLabel: '52 KB',
    rowsLabel: '12',
    columnsLabel: '4',
    accent: '#14b8a6',
  },
];

export const MODULE4_MISSION_1_DATA: MediaTypeClassificationData = {
  items: MODULE4_MEDIA_ITEMS,
  zones: [
    { id: 'image', label: 'Графика', desc: 'Изображения и рисунки', color: '#8b5cf6' },
    { id: 'audio', label: 'Звук', desc: 'Записи и аудиофайлы', color: '#06b6d4' },
    { id: 'data', label: 'Данные', desc: 'Таблицы и наборы данных', color: '#10b981' },
  ],
};

export const MODULE4_MISSION_2_DATA: MediaFormatSelectionData = {
  prompts: [
    {
      id: 'm4-format-1',
      prompt: 'Посмотрите на файл и выберите подходящий формат.',
      item: MODULE4_MEDIA_ITEMS[0],
      choices: ['PNG', 'MP3', 'CSV', 'WAV'],
      correctFormat: 'PNG',
      helperText: 'Это изображение с прозрачностью и высоким качеством.',
    },
    {
      id: 'm4-format-2',
      prompt: 'Какой формат подходит для звуковой дорожки?',
      item: MODULE4_MEDIA_ITEMS[2],
      choices: ['JPG', 'WAV', 'CSV', 'PNG'],
      correctFormat: 'WAV',
      helperText: 'На панели видна звуковая волна и длительность файла.',
    },
    {
      id: 'm4-format-3',
      prompt: 'Выберите формат для таблицы с результатами.',
      item: MODULE4_MEDIA_ITEMS[4],
      choices: ['MP3', 'CSV', 'PNG', 'JPG'],
      correctFormat: 'CSV',
      helperText: 'В таблице есть строки и столбцы.',
    },
    {
      id: 'm4-format-4',
      prompt: 'Какой формат соответствует сжатому аудиофайлу?',
      item: MODULE4_MEDIA_ITEMS[3],
      choices: ['MP3', 'SVG', 'CSV', 'PNG'],
      correctFormat: 'MP3',
      helperText: 'Это аудиофайл с меньшим размером.',
    },
  ],
};
