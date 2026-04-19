import type { Module } from '../../types/content';

const module12: Module = {
  id: 12,
  title: 'Ветвления, циклы и финальная миссия',
  subtitle: 'Итоговый модуль',
  desc: 'Финальный модуль: ветвления, циклы и итоговое повторение всего курса.',
  icon: '⬡',  // Specialist module
  accent: '#f59e0b',
  xpReward: 200,
  badge: { id: 'graduate', name: 'Специалист', icon: '⬡' },
  vocab: [
    { id: 'vc1', ru: 'ветвление',      en: 'branching',       def: 'выбор пути выполнения программы' },
    { id: 'vc2', ru: 'цикл',           en: 'loop',            def: 'повторяющийся блок команд' },
    { id: 'vc3', ru: 'счётчик цикла',  en: 'loop counter',    def: 'переменная для подсчёта итераций' },
    { id: 'vc4', ru: 'итерация',       en: 'iteration',       def: 'один проход тела цикла' },
    { id: 'vc5', ru: 'вложенный цикл', en: 'nested loop',     def: 'цикл, расположенный внутри другого цикла' },
    { id: 'vc6', ru: 'break',          en: 'break',           def: 'оператор прерывания цикла' },
    { id: 'vc7', ru: 'continue',       en: 'continue',        def: 'переход к следующей итерации цикла' },
    { id: 'vc8', ru: 'условие выхода', en: 'exit condition',  def: 'условие завершения цикла' },
    { id: 'vc9', ru: 'тело цикла',     en: 'loop body',       def: 'команды, выполняемые при каждой итерации' },
    { id: 'vca', ru: 'накопление суммы',en: 'accumulation',   def: 'суммирование значений в цикле' },
    { id: 'vcb', ru: 'массив',         en: 'array',           def: 'структура данных из однотипных элементов' },
    { id: 'vcc', ru: 'индекс',         en: 'index',           def: 'номер позиции элемента в массиве' },
  ],
  phrases: [
    { ru: 'Цикл выполняется N раз.',        en: 'The loop executes N times.' },
    { ru: 'Проверьте условие выхода.',       en: 'Check the exit condition.' },
    { ru: 'Вложенный цикл — цикл в цикле.', en: 'A nested loop is a loop within a loop.' },
    { ru: 'Накопите сумму элементов.',       en: 'Accumulate the sum of elements.' },
    { ru: 'Завершите финальную миссию!',     en: 'Complete the final mission!' },
  ],
  missions: [
    {
      id: '12-1', num: 1, title: 'Ветвления в задачах', type: 'multiple_choice',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Ответьте на вопросы о ветвлениях.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '12-2', num: 2, title: 'Циклы в программах', type: 'sequence',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Упорядочьте выполнение цикла.',
      vocabSlice: [6, 12], activityData: null,
    },
    {
      id: '12-3', num: 3, title: '🏆 Финальная миссия', type: 'final_mixed',
      xpReward: 200, passingScore: 80, implemented: false,
      briefing: 'Итоговое задание по всему курсу.',
      vocabSlice: [0, 12], activityData: null,
    },
  ],
};

export default module12;