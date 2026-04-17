
import type { Module } from '../../types/content';

const module06: Module = {
  id: 6,
  title: 'Арифметика и связь систем',
  subtitle: 'Вычисления в разных системах',
  desc: 'Арифметические операции в двоичной системе. Перенос разряда, дополнительный код.',
  icon: '➕',
  accent: '#f43f5e',
  xpReward: 150,
  badge: { id: 'calculator', name: 'Вычислитель', icon: '➕' },
  vocab: [
    { id: 'v61', ru: 'сложение',          en: 'addition',        def: 'арифметическая операция суммирования' },
    { id: 'v62', ru: 'вычитание',         en: 'subtraction',     def: 'обратная операция к сложению' },
    { id: 'v63', ru: 'умножение',         en: 'multiplication',  def: 'многократное сложение' },
    { id: 'v64', ru: 'деление',           en: 'division',        def: 'нахождение того, сколько раз делитель входит в делимое' },
    { id: 'v65', ru: 'перенос',           en: 'carry',           def: 'перенос единицы в старший разряд при переполнении' },
    { id: 'v66', ru: 'переполнение',      en: 'overflow',        def: 'выход результата за допустимый диапазон' },
    { id: 'v67', ru: 'дополнительный код',en: "two's complement",def: 'способ представления отрицательных чисел' },
    { id: 'v68', ru: 'остаток',           en: 'remainder',       def: 'результат деления с неполным частным' },
    { id: 'v69', ru: 'точность',          en: 'precision',       def: 'число значимых разрядов в вычислении' },
    { id: 'v6a', ru: 'операнд',           en: 'operand',         def: 'данные, участвующие в операции' },
    { id: 'v6b', ru: 'арифметический сдвиг',en: 'arithmetic shift',def: 'сдвиг двоичного числа влево или вправо' },
    { id: 'v6c', ru: 'модуль числа',      en: 'absolute value',  def: 'расстояние числа от нуля' },
  ],
  phrases: [
    { ru: 'Выполните сложение в двоичной системе.', en: 'Perform addition in binary.' },
    { ru: 'Произошёл перенос разряда.',             en: 'A carry occurred.' },
    { ru: 'Переполнение не допускается.',           en: 'Overflow is not allowed.' },
    { ru: 'Найдите разность двух чисел.',           en: 'Find the difference of two numbers.' },
    { ru: 'Проверьте результат вычисления.',        en: 'Check the calculation result.' },
  ],
  missions: [
    {
      id: '6-1', num: 1, title: 'Двоичное сложение', type: 'multiple_choice',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Пройдите тест по двоичной арифметике.',
      vocabSlice: [0, 6], activityData: null,
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