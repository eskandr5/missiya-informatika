
import type { Module } from '../../types/content';

const module06: Module = {
  id: 6,
  title: 'Арифметика и связь систем',
  subtitle: 'Вычисления в разных системах',
  desc: 'Сначала сравните записи одного значения в разных системах, а затем переходите к простым вычислениям.',
  icon: '➕',
  accent: '#f43f5e',
  xpReward: 150,
  badge: { id: 'calculator', name: 'Вычислитель', icon: '➕' },
  vocab: [
    { id: 'v61', ru: 'система счисления', en: 'numeral system', def: 'способ записи чисел с помощью набора цифр' },
    { id: 'v62', ru: 'значение',          en: 'value',          def: 'то, что обозначает запись числа' },
    { id: 'v63', ru: 'число',             en: 'number',         def: 'запись количества или значения' },
    { id: 'v64', ru: 'сравнение',         en: 'comparison',     def: 'сопоставление двух записей или чисел' },
    { id: 'v65', ru: 'запись',            en: 'notation',       def: 'форма, в которой представлено число' },
    { id: 'v66', ru: 'двоичный',          en: 'binary',         def: 'относящийся к системе с цифрами 0 и 1' },
    { id: 'v67', ru: 'десятичный',        en: 'decimal',        def: 'относящийся к системе с цифрами от 0 до 9' },
    { id: 'v68', ru: 'сложение',          en: 'addition',       def: 'арифметическая операция суммирования' },
    { id: 'v69', ru: 'сумма',             en: 'sum',            def: 'результат сложения' },
    { id: 'v6a', ru: 'разряд',            en: 'place',          def: 'место цифры в записи числа' },
    { id: 'v6b', ru: 'перенос',           en: 'carry',          def: 'переход единицы в следующий разряд' },
    { id: 'v6c', ru: 'результат',         en: 'result',         def: 'ответ после вычисления или сравнения' },
  ],
  phrases: [
    { ru: 'Сравните записи в разных системах.',         en: 'Compare the notations in different systems.' },
    { ru: 'Найдите одинаковое значение.',              en: 'Find the same value.' },
    { ru: 'Одна и та же величина может иметь разную запись.', en: 'The same value can have different notations.' },
    { ru: 'Сравните двоичную и десятичную запись.',    en: 'Compare binary and decimal notation.' },
    { ru: 'Выберите правильную пару.',                 en: 'Choose the correct pair.' },
  ],
  missions: [
    {
      id: '6-1', num: 1, title: 'Сравни системы', type: 'matching',
      xpReward: 60, passingScore: 70, implemented: true,
      briefing: 'Сравните небольшие числа в десятичной и двоичной записи. Найдите пары, где значение одинаковое, хотя запись выглядит по-разному.',
      vocabSlice: [0, 7],
      activityData: {
        pairs: [
          { term: '2 (десятичная)', def: '10 (двоичная)' },
          { term: '3 (десятичная)', def: '11 (двоичная)' },
          { term: '4 (десятичная)', def: '100 (двоичная)' },
          { term: '5 (десятичная)', def: '101 (двоичная)' },
          { term: '6 (десятичная)', def: '110 (двоичная)' },
          { term: '7 (десятичная)', def: '111 (двоичная)' },
        ],
      },
    },
    {
      id: '6-2', num: 2, title: 'Связь систем', type: 'matching',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Соедините операции с описаниями.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module06;
