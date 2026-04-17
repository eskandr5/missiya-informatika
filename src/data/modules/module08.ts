import type { Module } from '../../types/content';

const module08: Module = {
  id: 8,
  title: 'Понятие алгоритма',
  subtitle: 'Основы алгоритмизации',
  desc: 'Что такое алгоритм, его свойства: дискретность, детерминированность, результативность, массовость.',
  icon: '⚙️',
  accent: '#6366f1',
  xpReward: 150,
  badge: { id: 'algorithmist', name: 'Алгоритмист', icon: '⚙️' },
  vocab: [
    { id: 'v81', ru: 'алгоритм',            en: 'algorithm',     def: 'точная и конечная последовательность шагов для решения задачи' },
    { id: 'v82', ru: 'исполнитель',         en: 'executor',      def: 'объект, способный понять и выполнить алгоритм' },
    { id: 'v83', ru: 'дискретность',        en: 'discreteness',  def: 'алгоритм разбит на отдельные шаги' },
    { id: 'v84', ru: 'детерминированность', en: 'determinism',   def: 'каждый шаг однозначно определён' },
    { id: 'v85', ru: 'результативность',    en: 'finiteness',    def: 'алгоритм должен завершиться за конечное число шагов' },
    { id: 'v86', ru: 'массовость',          en: 'generality',    def: 'алгоритм применим к классу однотипных задач' },
    { id: 'v87', ru: 'шаг',                 en: 'step',          def: 'отдельное элементарное действие алгоритма' },
    { id: 'v88', ru: 'команда',             en: 'command',       def: 'инструкция для исполнителя' },
    { id: 'v89', ru: 'условие',             en: 'condition',     def: 'проверяемое логическое выражение' },
    { id: 'v8a', ru: 'цикл',                en: 'loop',          def: 'многократно повторяемое действие' },
    { id: 'v8b', ru: 'ветвление',           en: 'branching',     def: 'выбор пути выполнения по условию' },
    { id: 'v8c', ru: 'понятность',          en: 'clarity',       def: 'алгоритм понятен исполнителю' },
  ],
  phrases: [
    { ru: 'Алгоритм должен быть конечным.',  en: 'An algorithm must be finite.' },
    { ru: 'Каждый шаг должен быть понятен.', en: 'Each step must be clear.' },
    { ru: 'Запишите алгоритм по шагам.',     en: 'Write the algorithm step by step.' },
    { ru: 'Проверьте условие ветвления.',    en: 'Check the branching condition.' },
    { ru: 'Цикл повторяется несколько раз.', en: 'The loop repeats several times.' },
  ],
  missions: [
    {
      id: '8-1', num: 1, title: 'Свойства алгоритма', type: 'classification',
      xpReward: 60, passingScore: 70, implemented: false,
      briefing: 'Классифицируйте свойства алгоритма.',
      vocabSlice: [0, 6], activityData: null,
    },
    {
      id: '8-2', num: 2, title: 'Составление алгоритма', type: 'sequence',
      xpReward: 90, passingScore: 70, implemented: false,
      briefing: 'Упорядочьте шаги решения задачи.',
      vocabSlice: [6, 12], activityData: null,
    },
  ],
};

export default module08;