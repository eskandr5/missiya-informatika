import type { Module } from '../../types/content';

const module04: Module = {
  id: 4,
  title: 'Данные, графика и звук',
  subtitle: 'Кодирование данных',
  desc: 'Цифровое кодирование текста, изображений и звука. Форматы, разрешение, сжатие.',
  icon: '🎨',
  accent: '#8b5cf6',
  xpReward: 150,
  badge: { id: 'creator', name: 'Кодировщик', icon: '🎨' },
  vocab: [
    { id: 'v41', ru: 'пиксель',              en: 'pixel',          def: 'минимальный элемент растрового изображения' },
    { id: 'v42', ru: 'разрешение',            en: 'resolution',     def: 'количество пикселей на единицу площади' },
    { id: 'v43', ru: 'кодирование',           en: 'encoding',       def: 'преобразование данных в заданный формат' },
    { id: 'v44', ru: 'сжатие',               en: 'compression',    def: 'уменьшение объёма файла' },
    { id: 'v45', ru: 'растровое изображение', en: 'raster image',   def: 'изображение как сетка пикселей' },
    { id: 'v46', ru: 'векторная графика',     en: 'vector graphics',def: 'описание форм математическими кривыми' },
    { id: 'v47', ru: 'глубина цвета',         en: 'color depth',    def: 'количество бит на один пиксель' },
    { id: 'v48', ru: 'частота дискретизации', en: 'sampling rate',  def: 'количество отсчётов звука в секунду' },
    { id: 'v49', ru: 'амплитуда',             en: 'amplitude',      def: 'максимальное значение звукового колебания' },
    { id: 'v4a', ru: 'формат',               en: 'format',         def: 'способ организации и хранения данных' },
    { id: 'v4b', ru: 'палитра',              en: 'palette',        def: 'набор используемых цветов' },
    { id: 'v4c', ru: 'оцифровка',            en: 'digitization',   def: 'преобразование аналоговых данных в цифровые' },
  ],
  phrases: [
    { ru: 'Изображение состоит из пикселей.', en: 'An image consists of pixels.' },
    { ru: 'Звук можно оцифровать.',           en: 'Sound can be digitized.' },
    { ru: 'Данные кодируются в байты.',       en: 'Data is encoded in bytes.' },
    { ru: 'Выберите формат файла.',           en: 'Choose the file format.' },
    { ru: 'Разрешение влияет на качество.',   en: 'Resolution affects quality.' },
  ],
  missions: [
    {
      id: '4-1', num: 1, title: 'Цифровое изображение', type: 'multiple_choice',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Ответьте на вопросы о цифровых изображениях.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '4-2', num: 2, title: 'Кодирование звука', type: 'matching',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Соедините термины кодирования звука с определениями.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module04;