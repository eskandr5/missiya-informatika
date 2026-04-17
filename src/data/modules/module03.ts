import type { Module } from '../../types/content';

const module03: Module = {
  id: 3,
  title: 'Файлы и папки',
  subtitle: 'Файловая система',
  desc: 'Организация данных: файлы, папки, расширения, пути и операции с файловой системой.',
  icon: '📁',
  accent: '#10b981',
  xpReward: 150,
  badge: { id: 'organizer', name: 'Организатор', icon: '📂' },
  vocab: [
    { id: 'v31', ru: 'файл',            en: 'file',           def: 'именованная область данных на носителе' },
    { id: 'v32', ru: 'папка',           en: 'folder',         def: 'контейнер для группировки файлов' },
    { id: 'v33', ru: 'расширение',      en: 'extension',      def: 'суффикс имени файла, указывающий его тип' },
    { id: 'v34', ru: 'путь',            en: 'path',           def: 'адрес файла в файловой системе' },
    { id: 'v35', ru: 'директория',      en: 'directory',      def: 'раздел файловой иерархии' },
    { id: 'v36', ru: 'копирование',     en: 'copy',           def: 'создание дубликата файла или папки' },
    { id: 'v37', ru: 'перемещение',     en: 'move',           def: 'перенос файла в другое место' },
    { id: 'v38', ru: 'удаление',        en: 'delete',         def: 'уничтожение файла или папки' },
    { id: 'v39', ru: 'архив',           en: 'archive',        def: 'сжатый контейнер с набором файлов' },
    { id: 'v3a', ru: 'тип файла',       en: 'file type',      def: 'категория, определяемая расширением' },
    { id: 'v3b', ru: 'имя файла',       en: 'filename',       def: 'уникальный идентификатор файла в папке' },
    { id: 'v3c', ru: 'корневой каталог',en: 'root directory', def: 'верхний уровень файловой системы' },
  ],
  phrases: [
    { ru: 'Файл имеет имя и расширение.', en: 'A file has a name and extension.' },
    { ru: 'Папка содержит файлы.',        en: 'A folder contains files.' },
    { ru: 'Укажите путь к файлу.',        en: 'Specify the file path.' },
    { ru: 'Скопируйте файл в папку.',     en: 'Copy the file to the folder.' },
    { ru: 'Выберите тип файла.',          en: 'Choose the file type.' },
  ],
  missions: [
    {
      id: '3-1', num: 1, title: 'Файловая система', type: 'matching',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Изучите понятия файловой системы.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '3-2', num: 2, title: 'Типы файлов', type: 'classification',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Классифицируйте файлы по типам.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module03;