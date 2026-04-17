import type { Module } from '../../types/content';

const module09: Module = {
  id: 9,
  title: 'Графический язык алгоритмов',
  subtitle: 'Блок-схемы',
  desc: 'Блок-схемы: элементы, правила построения, типовые структуры управления.',
  icon: '📊',
  accent: '#0ea5e9',
  xpReward: 150,
  badge: { id: 'designer', name: 'Схематик', icon: '📊' },
  vocab: [
    { id: 'v91', ru: 'блок-схема',          en: 'flowchart',          def: 'графическое представление алгоритма с помощью символов' },
    { id: 'v92', ru: 'блок начала/конца',   en: 'terminal',           def: 'овал — обозначает начало или конец алгоритма' },
    { id: 'v93', ru: 'блок действия',       en: 'process block',      def: 'прямоугольник — выполнение операции' },
    { id: 'v94', ru: 'блок условия',        en: 'decision block',     def: 'ромб — проверка условия с двумя выходами' },
    { id: 'v95', ru: 'стрелка',             en: 'arrow',              def: 'указывает направление выполнения алгоритма' },
    { id: 'v96', ru: 'блок ввода/вывода',   en: 'I/O block',          def: 'параллелограмм — получение или отображение данных' },
    { id: 'v97', ru: 'линия связи',         en: 'connector',          def: 'соединяет блоки схемы' },
    { id: 'v98', ru: 'подпрограмма',        en: 'subroutine block',   def: 'прямоугольник с двойными линиями' },
    { id: 'v99', ru: 'цикл с предусловием', en: 'pre-condition loop', def: 'условие проверяется до тела цикла' },
    { id: 'v9a', ru: 'цикл с постусловием', en: 'post-condition loop',def: 'условие проверяется после тела цикла' },
    { id: 'v9b', ru: 'разветвление',        en: 'branch',             def: 'альтернативный путь в алгоритме' },
    { id: 'v9c', ru: 'счётчик',             en: 'counter',            def: 'переменная для подсчёта итераций' },
  ],
  phrases: [
    { ru: 'Начертите блок-схему алгоритма.', en: 'Draw the algorithm flowchart.' },
    { ru: 'Ромб обозначает условие.',        en: 'A diamond represents a condition.' },
    { ru: 'Прямоугольник — это действие.',   en: 'A rectangle is an action block.' },
    { ru: 'Стрелки показывают направление.', en: 'Arrows show the direction.' },
    { ru: 'Блок-схема начинается с овала.',  en: 'A flowchart starts with an oval.' },
  ],
  missions: [
    {
      id: '9-1', num: 1, title: 'Элементы блок-схем', type: 'matching',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Соедините блоки с их описаниями.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '9-2', num: 2, title: 'Чтение блок-схемы', type: 'sequence',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Упорядочьте шаги блок-схемы.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module09;