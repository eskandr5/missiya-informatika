import type { Module } from '../../types/content';

const module10: Module = {
  id: 10,
  title: 'Алгоритмический язык',
  subtitle: 'Псевдокод и запись',
  desc: 'Алгоритмический язык: ключевые слова, структуры управления, запись алгоритмов.',
  icon: '◢',  // Code module
  accent: '#84cc16',
  xpReward: 150,
  badge: { id: 'coder', name: 'Кодировщик', icon: '◢' },
  vocab: [
    { id: 'va1', ru: 'переменная',  en: 'variable',   def: 'именованная ячейка памяти для хранения данных' },
    { id: 'va2', ru: 'присваивание',en: 'assignment', def: 'операция записи значения в переменную' },
    { id: 'va3', ru: 'ввод',        en: 'input',      def: 'получение данных от пользователя' },
    { id: 'va4', ru: 'вывод',       en: 'output',     def: 'отображение данных для пользователя' },
    { id: 'va5', ru: 'если',        en: 'if',         def: 'ключевое слово условного оператора' },
    { id: 'va6', ru: 'иначе',       en: 'else',       def: 'альтернативная ветвь условного оператора' },
    { id: 'va7', ru: 'пока',        en: 'while',      def: 'цикл с проверкой условия до тела' },
    { id: 'va8', ru: 'для',         en: 'for',        def: 'цикл с заданным числом повторений' },
    { id: 'va9', ru: 'конец',       en: 'end',        def: 'завершение составного блока' },
    { id: 'vaa', ru: 'функция',     en: 'function',   def: 'именованный блок повторно используемого кода' },
    { id: 'vab', ru: 'параметр',    en: 'parameter',  def: 'входное значение функции' },
    { id: 'vac', ru: 'возврат',     en: 'return',     def: 'значение, возвращаемое функцией' },
  ],
  phrases: [
    { ru: 'Объявите переменную X.',               en: 'Declare variable X.' },
    { ru: 'Используйте оператор присваивания.',   en: 'Use the assignment operator.' },
    { ru: 'Запишите условие после ЕСЛИ.',         en: 'Write the condition after IF.' },
    { ru: 'Цикл повторяется ПОКА условие истинно.',en: 'The loop repeats WHILE the condition is true.' },
    { ru: 'Введите значение переменной.',         en: 'Enter the variable value.' },
  ],
  missions: [
    {
      id: '10-1', num: 1, title: 'Ключевые слова', type: 'matching',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Соедините операторы с описаниями.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '10-2', num: 2, title: 'Структуры управления', type: 'sequence',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Упорядочьте ключевые слова.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module10;