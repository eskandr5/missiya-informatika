import type { Module } from '../../types/content';

const module05: Module = {
  id: 5,
  title: 'Системы счисления: основы',
  subtitle: 'Числа в разных системах',
  desc: 'Двоичная, восьмеричная и шестнадцатеричная системы счисления. Перевод чисел.',
  icon: '🔢',
  accent: '#f59e0b',
  xpReward: 150,
  badge: { id: 'mathematician', name: 'Математик', icon: '🔢' },
  vocab: [
    { id: 'v51', ru: 'основание',              en: 'base/radix',      def: 'количество различных цифр в системе счисления' },
    { id: 'v52', ru: 'двоичная система',       en: 'binary',          def: 'система с основанием 2, цифры 0 и 1' },
    { id: 'v53', ru: 'восьмеричная система',   en: 'octal',           def: 'система с основанием 8, цифры 0–7' },
    { id: 'v54', ru: 'шестнадцатеричная',      en: 'hexadecimal',     def: 'система с основанием 16, цифры 0–9 и A–F' },
    { id: 'v55', ru: 'десятичная система',     en: 'decimal',         def: 'привычная система с основанием 10' },
    { id: 'v56', ru: 'разряд',                 en: 'digit position',  def: 'место цифры в записи числа' },
    { id: 'v57', ru: 'перевод чисел',          en: 'number conversion',def: 'преобразование числа из одной системы в другую' },
    { id: 'v58', ru: 'бит',                    en: 'bit',             def: 'двоичная цифра: 0 или 1' },
    { id: 'v59', ru: 'тетрада',                en: 'nibble',          def: 'четыре бита — одна шестнадцатеричная цифра' },
    { id: 'v5a', ru: 'степень',                en: 'power',           def: 'произведение числа на само себя N раз' },
    { id: 'v5b', ru: 'весовой коэффициент',    en: 'place value',     def: 'значение позиции в записи числа' },
    { id: 'v5c', ru: 'цифра',                  en: 'digit',           def: 'символ для записи числового значения' },
  ],
  phrases: [
    { ru: 'Переведите число в двоичную систему.', en: 'Convert the number to binary.' },
    { ru: 'Основание системы счисления.',        en: 'The base of the numeral system.' },
    { ru: 'Двоичное число содержит 0 и 1.',      en: 'A binary number contains 0 and 1.' },
    { ru: 'Найдите значение разряда.',            en: 'Find the place value.' },
    { ru: 'Выполните перевод числа.',             en: 'Perform the number conversion.' },
  ],
  missions: [
    {
      id: '5-1', num: 1, title: 'Двоичная система', type: 'multiple_choice',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Пройдите тест по двоичной системе.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '5-2', num: 2, title: 'Перевод чисел', type: 'sequence',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Упорядочьте шаги перевода числа.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module05;