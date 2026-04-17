
import type { Module } from '../../types/content';

const module07: Module = {
  id: 7,
  title: 'Алгебра логики',
  subtitle: 'Булевы операции',
  desc: 'Логические операции И, ИЛИ, НЕ. Таблицы истинности. Логические схемы.',
  icon: '🧮',
  accent: '#14b8a6',
  xpReward: 150,
  badge: { id: 'logician', name: 'Логик', icon: '🧮' },
  vocab: [
    { id: 'v71', ru: 'конъюнкция',         en: 'AND',           def: 'логическое И: истинно, если оба операнда истинны' },
    { id: 'v72', ru: 'дизъюнкция',         en: 'OR',            def: 'логическое ИЛИ: истинно, если хотя бы один истинен' },
    { id: 'v73', ru: 'отрицание',          en: 'NOT',           def: 'логическое НЕ: инверсия значения' },
    { id: 'v74', ru: 'исключающее ИЛИ',   en: 'XOR',           def: 'истинно, если операнды различны' },
    { id: 'v75', ru: 'таблица истинности', en: 'truth table',   def: 'таблица всех значений логического выражения' },
    { id: 'v76', ru: 'высказывание',       en: 'statement',     def: 'утверждение, которое может быть истинным или ложным' },
    { id: 'v77', ru: 'истина',             en: 'true',          def: 'логическое значение 1' },
    { id: 'v78', ru: 'ложь',              en: 'false',         def: 'логическое значение 0' },
    { id: 'v79', ru: 'импликация',         en: 'implication',   def: 'если A, то B: ложна только при A=1 и B=0' },
    { id: 'v7a', ru: 'эквивалентность',   en: 'equivalence',   def: 'A=B: истинна, когда оба операнда равны' },
    { id: 'v7b', ru: 'логическое выражение',en: 'logical expression',def: 'формула с логическими операциями' },
    { id: 'v7c', ru: 'отрицание конъюнкции',en: 'NAND',        def: 'НЕ И: отрицание конъюнкции' },
  ],
  phrases: [
    { ru: 'Составьте таблицу истинности.',      en: 'Create a truth table.' },
    { ru: 'Вычислите логическое выражение.',    en: 'Evaluate the logical expression.' },
    { ru: 'А И В истинно только при А=1, В=1.', en: 'A AND B is true only when A=1, B=1.' },
    { ru: 'Найдите значение выражения.',        en: 'Find the value of the expression.' },
    { ru: 'Проверьте логическое условие.',      en: 'Check the logical condition.' },
  ],
  missions: [
    {
      id: '7-1', num: 1, title: 'Логические операции', type: 'matching',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Соедините операции с описаниями.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '7-2', num: 2, title: 'Таблицы истинности', type: 'multiple_choice',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Вычислите значения логических выражений.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module07;