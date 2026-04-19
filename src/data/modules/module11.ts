import type { Module } from '../../types/content';

const module11: Module = {
  id: 11,
  title: 'Языки программирования',
  subtitle: 'Обзор и классификация',
  desc: 'История и виды языков программирования. Компиляция vs интерпретация.',
  icon: '◇',  // Programming module
  accent: '#7c3aed',
  xpReward: 150,
  badge: { id: 'programmer', name: 'Программист', icon: '◇' },
  vocab: [
    { id: 'vb1', ru: 'язык программирования', en: 'programming language', def: 'формальный язык для записи алгоритмов' },
    { id: 'vb2', ru: 'компилятор',            en: 'compiler',             def: 'программа перевода в машинный код целиком' },
    { id: 'vb3', ru: 'интерпретатор',         en: 'interpreter',          def: 'программа пошагового выполнения кода' },
    { id: 'vb4', ru: 'синтаксис',             en: 'syntax',               def: 'правила написания конструкций языка' },
    { id: 'vb5', ru: 'семантика',             en: 'semantics',            def: 'смысловое значение конструкций языка' },
    { id: 'vb6', ru: 'машинный код',          en: 'machine code',         def: 'набор команд в двоичном виде' },
    { id: 'vb7', ru: 'высокоуровневый язык',  en: 'high-level language',  def: 'язык, близкий к естественному' },
    { id: 'vb8', ru: 'низкоуровневый язык',   en: 'low-level language',   def: 'язык, близкий к машинным командам' },
    { id: 'vb9', ru: 'программа',             en: 'program',              def: 'набор инструкций для выполнения на компьютере' },
    { id: 'vba', ru: 'исходный код',          en: 'source code',          def: 'текст программы, написанный программистом' },
    { id: 'vbb', ru: 'отладка',              en: 'debugging',            def: 'поиск и исправление ошибок в программе' },
    { id: 'vbc', ru: 'библиотека',           en: 'library',              def: 'набор готовых функций для использования' },
  ],
  phrases: [
    { ru: 'Python — язык высокого уровня.',  en: 'Python is a high-level language.' },
    { ru: 'Компилятор переводит весь код.',  en: 'A compiler translates all the code.' },
    { ru: 'Выберите язык программирования.', en: 'Choose a programming language.' },
    { ru: 'Синтаксис языка строгий.',        en: 'The language syntax is strict.' },
    { ru: 'Найдите ошибку в коде.',          en: 'Find the error in the code.' },
  ],
  missions: [
    {
      id: '11-1', num: 1, title: 'Виды языков', type: 'classification',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Классифицируйте языки программирования.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '11-2', num: 2, title: 'Компилятор vs Интерпретатор', type: 'matching',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Соедините компоненты с описаниями.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module11;