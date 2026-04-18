import type { Module } from '../../types/content';
import { MODULE4_MISSION_1_DATA, MODULE4_MISSION_2_DATA } from '../module4Media';

const module04: Module = {
  id: 4,
  title: 'Данные, графика и звук',
  subtitle: 'Визуальная лаборатория медиафайлов',
  desc: 'Распознавайте типы файлов, сравнивайте форматы и смотрите, как меняется изображение, звук и таблица на экране.',
  icon: '🎛️',
  accent: '#8b5cf6',
  xpReward: 150,
  badge: { id: 'creator', name: 'Кодировщик', icon: '🎨' },
  vocab: [
    { id: 'v41', ru: 'пиксель', en: 'pixel', def: 'минимальный элемент растрового изображения' },
    { id: 'v42', ru: 'разрешение', en: 'resolution', def: 'количество пикселей в изображении' },
    { id: 'v43', ru: 'кодирование', en: 'encoding', def: 'способ записи данных в цифровом виде' },
    { id: 'v44', ru: 'сжатие', en: 'compression', def: 'уменьшение размера файла' },
    { id: 'v45', ru: 'растровое изображение', en: 'raster image', def: 'изображение как сетка пикселей' },
    { id: 'v46', ru: 'векторная графика', en: 'vector graphics', def: 'изображение из линий и фигур' },
    { id: 'v47', ru: 'частота дискретизации', en: 'sampling rate', def: 'число звуковых отсчётов в секунду' },
    { id: 'v48', ru: 'амплитуда', en: 'amplitude', def: 'высота звуковой волны' },
    { id: 'v49', ru: 'формат', en: 'format', def: 'способ хранения файла' },
    { id: 'v4a', ru: 'таблица', en: 'table', def: 'данные в строках и столбцах' },
    { id: 'v4b', ru: 'строка', en: 'row', def: 'горизонтальная линия данных в таблице' },
    { id: 'v4c', ru: 'столбец', en: 'column', def: 'вертикальная группа данных в таблице' },
  ],
  phrases: [
    { ru: 'Изображение состоит из пикселей.', en: 'An image consists of pixels.' },
    { ru: 'Выберите формат файла.', en: 'Choose the file format.' },
    { ru: 'Звук показан волной.', en: 'Sound is shown as a waveform.' },
    { ru: 'Таблица состоит из строк и столбцов.', en: 'A table has rows and columns.' },
    { ru: 'Размер файла зависит от формата.', en: 'File size depends on the format.' },
  ],
  missions: [
    {
      id: '4-1',
      num: 1,
      title: 'Распредели файлы',
      type: 'media_classification',
      xpReward: 70,
      passingScore: 70,
      implemented: true,
      briefing: 'Посмотрите на файлы и распределите их по трём зонам: графика, звук и данные. На панели слева будет показано, как выглядит выбранный файл.',
      vocabSlice: [0, 8],
      activityData: MODULE4_MISSION_1_DATA,
    },
    {
      id: '4-2',
      num: 2,
      title: 'Выбери формат',
      type: 'media_format_selection',
      xpReward: 80,
      passingScore: 70,
      implemented: true,
      briefing: 'Смотрите на изображение, звуковую волну или таблицу и выбирайте подходящий формат файла. После ответа панель сразу покажет правильный или неверный результат.',
      vocabSlice: [4, 12],
      activityData: MODULE4_MISSION_2_DATA,
    },
  ],
};

export default module04;
