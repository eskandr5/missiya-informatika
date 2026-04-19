import type { Module } from '../../types/content';

const module01: Module = {
  id: 1,
  title: 'Информатика как наука',
  subtitle: 'Основы и история',
  desc: 'Введение в информатику: информация, данные, цифровые технологии и история вычислительной техники.',
  icon: '⚡',  // Keep as symbol icon
  accent: '#3b82f6',
  xpReward: 150,
  badge: { id: 'explorer', name: 'Исследователь', icon: '◆' },
  vocab: [
    { id: 'v11', ru: 'информатика', en: 'informatics', def: 'наука об информации, методах её сбора, хранения и обработки' },
    { id: 'v12', ru: 'информация', en: 'information', def: 'сведения об объектах и явлениях окружающего мира' },
    { id: 'v13', ru: 'данные', en: 'data', def: 'информация в формализованном виде, пригодном для обработки' },
    { id: 'v14', ru: 'наука', en: 'science', def: 'систематизированное знание о мире и его закономерностях' },
    { id: 'v15', ru: 'технология', en: 'technology', def: 'совокупность методов и инструментов для решения задач' },
    { id: 'v16', ru: 'компьютер', en: 'computer', def: 'электронное устройство для хранения и обработки данных' },
    { id: 'v17', ru: 'система', en: 'system', def: 'совокупность взаимосвязанных и взаимодействующих элементов' },
    { id: 'v18', ru: 'цифровой', en: 'digital', def: 'представленный в виде дискретных числовых значений' },
    { id: 'v19', ru: 'развитие', en: 'development', def: 'процесс последовательного изменения и совершенствования' },
    { id: 'v1a', ru: 'обработка', en: 'processing', def: 'преобразование данных по определённому алгоритму' },
    { id: 'v1b', ru: 'хранение', en: 'storage', def: 'сохранение данных на носителе для последующего использования' },
    { id: 'v1c', ru: 'передача', en: 'transfer', def: 'перемещение данных от источника к получателю' },
  ],
  phrases: [
    { ru: 'Информатика — это наука.', en: 'Informatics is a science.' },
    { ru: 'Что такое информация?', en: 'What is information?' },
    { ru: 'Найдите правильный ответ.', en: 'Find the correct answer.' },
    { ru: 'Выберите понятие.', en: 'Choose the concept.' },
    { ru: 'Данные можно обрабатывать.', en: 'Data can be processed.' },
    { ru: 'Информация может храниться.', en: 'Information can be stored.' },
  ],
  missions: [
    {
      id: '1-1',
      num: 1,
      title: 'Добро пожаловать в миссию',
      type: 'matching',
      xpReward: 60,
      passingScore: 70,
      implemented: true,
      briefing: 'Добро пожаловать, стажёр! Ваша первая задача — освоить базовые понятия информатики. Изучите словарный запас и выполните задание: соедините термины с их определениями.',
      vocabSlice: [0, 6],
      activityData: {
        pairs: [
          { term: 'информатика', def: 'наука об информации, методах её сбора и обработки' },
          { term: 'данные', def: 'информация в формализованном виде для обработки' },
          { term: 'обработка', def: 'преобразование данных по определённому алгоритму' },
          { term: 'хранение', def: 'сохранение данных на носителе' },
          { term: 'передача', def: 'перемещение данных от источника к получателю' },
          { term: 'цифровой', def: 'связанный с числовым представлением данных' },
        ],
      },
    },
    {
      id: '1-2',
      num: 2,
      title: 'Узнай фразу на слух',
      type: 'listen_and_choose',
      xpReward: 90,
      passingScore: 70,
      implemented: true,
      briefing: 'Теперь в миссии нужно не читать, а слушать. Прослушайте короткие русские фразы и выберите их значение, чтобы аудио стало частью самого прохождения.',
      vocabSlice: [6, 12],
      activityData: {
        questions: [
          {
            id: 'lc-1',
            prompt: 'Какой перевод вы слышите?',
            audioText: 'Информатика — это наука.',
            choices: [
              'Informatics is a science.',
              'Information is stored here.',
              'Choose the concept.',
            ],
            correct: 0,
            revealText: 'Информатика — это наука.',
          },
          {
            id: 'lc-2',
            prompt: 'Выберите значение услышанного вопроса.',
            audioText: 'Что такое информация?',
            choices: [
              'What is science?',
              'What is information?',
              'Where is the computer?',
            ],
            correct: 1,
            revealText: 'Что такое информация?',
          },
          {
            id: 'lc-3',
            prompt: 'Что означает услышанная фраза?',
            audioText: 'Данные можно обрабатывать.',
            choices: [
              'Data can be processed.',
              'Data can be deleted.',
              'Data can be printed.',
            ],
            correct: 0,
            revealText: 'Данные можно обрабатывать.',
          },
          {
            id: 'lc-4',
            prompt: 'Определите смысл фразы по аудио.',
            audioText: 'Информация может храниться.',
            choices: [
              'Information can be shared.',
              'Information can be stored.',
              'Information can be measured.',
            ],
            correct: 1,
            revealText: 'Информация может храниться.',
          },
        ],
      },
    },
  ],
};

export default module01;
