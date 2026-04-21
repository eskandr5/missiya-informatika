import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineBolt,
  HiOutlineBookOpen,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineLanguage,
  HiOutlineLockClosed,
  HiOutlineMagnifyingGlass,
  HiOutlineSpeakerWave,
} from 'react-icons/hi2';

import { MODULES } from '../data/modules';
import {
  ARCHIVE_COPY,
  ARCHIVE_MISSION_TYPE_LABELS,
} from '../data/archiveTerminology';
import {
  getCheckpointAfterModule,
  isCheckpointUnlocked,
  isMissionUnlocked,
} from '../utils/progression';
import { DL } from '../utils/helpers';
import { useRussianSpeech } from '../hooks/useRussianSpeech';
import PhraseRow from '../components/mission/PhraseRow';
import type { Module, ProgressionStage, VocabWord } from '../types/content';
import type { Progress } from '../types/progress';

interface Props {
  module: Module;
  progress: Progress;
  onSelectStage: (stage: ProgressionStage) => void;
  onBack: () => void;
}

type Tab = 'missions' | 'vocab' | 'phrases';
type VocabView = 'cards' | 'list';

const TAB_LABELS: Record<Tab, string> = {
  missions: 'Протоколы',
  vocab: 'Термины',
  phrases: 'Формулировки',
};

const TEXT = '#0C1628';
const TEXT2 = '#4A5568';
const MUTED = '#8C9CB4';
const EMERALD = '#059669';
const BLUE = '#2563EB';
const BORDER = 'rgba(12,22,40,0.07)';
const EASE = [0.22, 1, 0.36, 1] as const;

interface VocabularyListCardProps {
  word: VocabWord;
  index: number;
  isLearned: boolean;
  categoryLabel: string;
  onToggleLearned: () => void;
}

function VocabularyListCard({
  word,
  index,
  isLearned,
  categoryLabel,
  onToggleLearned,
}: VocabularyListCardProps) {
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(`vocab-list:${word.id}`, word.ru);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, ease: EASE }}
      style={{
        borderRadius: '1rem',
        padding: '1rem',
        background: '#fff',
        border: isLearned ? '1px solid rgba(5,150,105,0.15)' : `1px solid ${BORDER}`,
        boxShadow: '0 2px 8px rgba(12,22,40,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.65rem',
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: TEXT, letterSpacing: '-0.01em' }}>
            {word.ru}
          </p>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.8125rem', color: BLUE, fontWeight: 600 }}>
            {word.en}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            type="button"
            onClick={togglePlayback}
            disabled={!isSupported}
            style={{
              width: '1.75rem',
              height: '1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.65rem',
              border: 'none',
              background: '#EFF6FF',
              color: isPlaying ? EMERALD : BLUE,
              cursor: isSupported ? 'pointer' : 'not-allowed',
              opacity: isSupported ? 1 : 0.5,
            }}
            aria-label={`Прослушать: ${word.ru}`}
          >
            <HiOutlineSpeakerWave size={13} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleLearned}
            style={{
              width: '1.75rem',
              height: '1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.65rem',
              border: 'none',
              background: isLearned ? '#ECFDF5' : '#F1F5F9',
              color: isLearned ? EMERALD : '#CBD5E1',
              cursor: 'pointer',
            }}
            aria-pressed={isLearned}
            aria-label={isLearned ? `Снять отметку: ${word.ru}` : `Отметить как изученное: ${word.ru}`}
          >
            <HiOutlineCheckCircle size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: TEXT2, lineHeight: 1.6 }}>{word.def}</p>

      <div style={{ marginTop: '0.65rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '999px',
            padding: '0.18rem 0.5rem',
            background: isLearned ? '#ECFDF5' : '#F1F5F9',
            fontSize: '0.55rem',
            fontWeight: 800,
            color: isLearned ? EMERALD : MUTED,
            letterSpacing: '0.06em',
          }}
        >
          {isLearned ? '✓ ИЗУЧЕНО' : categoryLabel.toUpperCase()}
        </span>
      </div>
    </motion.article>
  );
}

export default function ModuleScreen({ module: mod, progress, onSelectStage, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('missions');
  const [showEn, setShowEn] = useState(false);
  const [vocabView, setVocabView] = useState<VocabView>('cards');
  const [vocabQuery, setVocabQuery] = useState('');
  const [learnedWords, setLearnedWords] = useState<Set<string>>(new Set());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const doneCount = mod.missions.filter(mission => progress.completedMissions.includes(mission.id)).length;
  const pct = Math.round((doneCount / mod.missions.length) * 100);
  const lockedCount = mod.missions.length - doneCount;
  const availableCount = mod.missions.filter(
    mission => mission.implemented && isMissionUnlocked(mission, mod, progress, MODULES),
  ).length;

  const checkpoint = getCheckpointAfterModule(mod.id);
  const checkpointDone = checkpoint ? progress.completedCheckpoints.includes(checkpoint.id) : false;
  const checkpointScore = checkpoint ? (progress.checkpointScores[checkpoint.id] ?? 0) : 0;
  const checkpointUnlocked = checkpoint ? isCheckpointUnlocked(checkpoint, progress, MODULES) : false;

  const normalizedQuery = vocabQuery.trim().toLowerCase();
  const filteredWords = mod.vocab.filter((word) => {
    if (!normalizedQuery) return true;
    return [word.ru, word.en, word.def].some(value => value.toLowerCase().includes(normalizedQuery));
  });

  const categoryLabel = mod.chapter ?? 'Базовые понятия';
  const currentWord = filteredWords[currentWordIndex] ?? null;
  const learnedCount = Array.from(learnedWords).filter(wordId => mod.vocab.some(word => word.id === wordId)).length;
  const learnedPct = mod.vocab.length > 0 ? Math.round((learnedCount / mod.vocab.length) * 100) : 0;
  const isCurrentLearned = currentWord ? learnedWords.has(currentWord.id) : false;
  const { isPlaying, isSupported, togglePlayback } = useRussianSpeech(
    `vocab-bank:${currentWord?.id ?? 'empty'}`,
    currentWord?.ru ?? '',
  );

  useEffect(() => {
    setVocabQuery('');
    setCurrentWordIndex(0);
    setIsFlipped(false);
    setLearnedWords(new Set());
  }, [mod.id]);

  useEffect(() => {
    if (filteredWords.length === 0) {
      setCurrentWordIndex(0);
      setIsFlipped(false);
      return;
    }

    if (currentWordIndex > filteredWords.length - 1) {
      setCurrentWordIndex(filteredWords.length - 1);
      setIsFlipped(false);
    }
  }, [currentWordIndex, filteredWords.length]);

  const toggleLearned = (wordId: string) => {
    setLearnedWords((current) => {
      const next = new Set(current);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  };

  const goNextWord = () => {
    if (filteredWords.length === 0) return;
    setDirection(1);
    setIsFlipped(false);
    window.setTimeout(() => {
      setCurrentWordIndex((current) => (current + 1) % filteredWords.length);
    }, 50);
  };

  const goPrevWord = () => {
    if (filteredWords.length === 0) return;
    setDirection(-1);
    setIsFlipped(false);
    window.setTimeout(() => {
      setCurrentWordIndex((current) => (current - 1 + filteredWords.length) % filteredWords.length);
    }, 50);
  };

  const jumpToWord = (index: number) => {
    setDirection(index > currentWordIndex ? 1 : -1);
    setIsFlipped(false);
    setCurrentWordIndex(index);
  };

  return (
    <div className="app-page module-detail">
      <div className="module-detail__toolbar">
        <button type="button" onClick={onBack} className="btn btn-secondary module-detail__toolbar-btn">
          <HiOutlineArrowLeft aria-hidden="true" />
          <span>{ARCHIVE_COPY.dashboardTitle}</span>
        </button>

        {tab === 'phrases' && (
          <button
            type="button"
            onClick={() => setShowEn(value => !value)}
            className={`btn ${showEn ? 'btn-primary' : 'btn-ghost'} module-detail__toolbar-btn`}
          >
            <HiOutlineLanguage aria-hidden="true" />
            <span>{showEn ? 'РУС + EN' : 'РУС'}</span>
          </button>
        )}
      </div>

      <section
        className="module-detail__hero"
        style={{ background: `linear-gradient(135deg, ${mod.accent} 0%, #1e3a8a 62%, #f59e0b 100%)` }}
      >
        <div className="module-detail__hero-main">
          <div className="module-detail__pill-row">
            <span className="module-detail__pill module-detail__pill--light">
              {ARCHIVE_COPY.moduleLabel} {mod.id}
            </span>
            {mod.chapter && (
              <span className="module-detail__pill module-detail__pill--soft">{mod.chapter}</span>
            )}
            {doneCount === mod.missions.length && (
              <span className="module-detail__pill module-detail__pill--success">
                <HiOutlineCheck aria-hidden="true" />
                Завершён
              </span>
            )}
          </div>

          <div className="module-detail__headline">
            <div className="module-detail__hero-icon" aria-hidden="true">
              {mod.icon}
            </div>

            <div>
              <h1 className="module-detail__title">{mod.title}</h1>
              <p className="module-detail__subtitle">{mod.subtitle}</p>
            </div>
          </div>

          <p className="module-detail__description">{mod.desc}</p>
          <p className="module-detail__status-line">
            СТАТУС_РАЗДЕЛА // ОСВОЕНО={pct}% · ОСТАЛОСЬ_ЗАДАНИЙ={lockedCount}
          </p>
        </div>

        <aside className="module-detail__hero-side">
          <div className="module-detail__hero-card">
            <p className="module-detail__hero-card-label">Прогресс раздела</p>
            <div className="module-detail__hero-card-value">{pct}%</div>
            <p className="module-detail__hero-card-copy">
              {doneCount} из {mod.missions.length} {ARCHIVE_COPY.missionLabelPlural} уже завершены.
            </p>
            <div className="module-card__progress-bar">
              <div className="module-card__progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {checkpoint && (
            <div className="module-detail__hero-card module-detail__hero-card--secondary">
              <p className="module-detail__hero-card-label">{ARCHIVE_COPY.checkpointLabel}</p>
              <div className="module-detail__hero-card-value">
                {checkpointDone ? `${checkpointScore}%` : checkpointUnlocked ? 'Открыт' : 'Закрыт'}
              </div>
              <p className="module-detail__hero-card-copy">
                {checkpointDone
                  ? 'Контрольная точка уже зафиксирована в вашем прогрессе.'
                  : checkpointUnlocked
                    ? 'Узел готов к прохождению после завершения основных миссий.'
                    : `Сначала завершите задания до контрольной точки после модуля ${checkpoint.afterModuleId}.`}
              </p>
            </div>
          )}
        </aside>
      </section>

      <div className="grid grid--4 module-detail__stats">
        <div className="stats-card">
          <div className="stats-card__icon">{mod.icon}</div>
          <div className="stats-card__value">{doneCount}</div>
          <div className="stats-card__label">Протоколов закрыто</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">⚡</div>
          <div className="stats-card__value">{availableCount}</div>
          <div className="stats-card__label">Доступно сейчас</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">🏁</div>
          <div className="stats-card__value">{mod.xpReward}</div>
          <div className="stats-card__label">XP за раздел</div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon">📘</div>
          <div className="stats-card__value">{mod.vocab.length}</div>
          <div className="stats-card__label">Терминов в подборке</div>
        </div>
      </div>

      {(mod.moduleIdentity || mod.openingStyle || mod.specialMechanic) && (
        <section className="module-detail__overview">
          <div className="module-detail__overview-grid">
            <div className="module-detail__overview-item">
              <p className="module-detail__overview-label">Тип модуля</p>
              <p className="module-detail__overview-value">{mod.moduleIdentity}</p>
            </div>

            <div className="module-detail__overview-item">
              <p className="module-detail__overview-label">Старт сценария</p>
              <p className="module-detail__overview-value">{mod.openingStyle}</p>
            </div>

            <div className="module-detail__overview-item">
              <p className="module-detail__overview-label">Механика</p>
              <p className="module-detail__overview-value">{mod.specialMechanic}</p>
            </div>

            <div className="module-detail__overview-item">
              <p className="module-detail__overview-label">Тон модуля</p>
              <p className="module-detail__overview-value">{mod.moduleFeel}</p>
            </div>
          </div>

          <div className="module-detail__pill-row">
            {mod.rewardType && (
              <span className="module-detail__pill module-detail__pill--success">
                Награда: {mod.rewardType}
              </span>
            )}
            {mod.videoMode && (
              <span className="module-detail__pill module-detail__pill--soft">
                Видео: {mod.videoMode}
              </span>
            )}
          </div>
        </section>
      )}

      <section className="module-detail__workspace">
        <div className="module-detail__tabs">
          {(['missions', 'vocab', 'phrases'] as Tab[]).map(tabName => (
            <button
              key={tabName}
              type="button"
              onClick={() => setTab(tabName)}
              className={`module-detail__tab${tab === tabName ? ' is-active' : ''}`}
            >
              {TAB_LABELS[tabName]}
            </button>
          ))}
        </div>

        {tab === 'missions' && (
          <div className="module-detail__list">
            {mod.missions.map((mission) => {
              const done = progress.completedMissions.includes(mission.id);
              const unlocked = isMissionUnlocked(mission, mod, progress, MODULES);
              const score = progress.missionScores[mission.id] ?? 0;

              return (
                <article
                  key={mission.id}
                  className={`module-detail__stage-card${
                    done ? ' is-complete' : unlocked ? ' is-open' : ' is-locked'
                  }`}
                >
                  <div className="module-detail__stage-main">
                    <div className="module-detail__stage-index" aria-hidden="true">
                      {done ? (
                        <HiOutlineCheck aria-hidden="true" />
                      ) : unlocked ? (
                        mission.num
                      ) : (
                        <HiOutlineLockClosed aria-hidden="true" />
                      )}
                    </div>

                    <div className="module-detail__stage-copy">
                      <h3 className="module-detail__stage-title">{mission.title}</h3>
                      <div className="module-detail__stage-meta">
                        <span className="module-detail__stage-label">
                          {ARCHIVE_MISSION_TYPE_LABELS[mission.type] ?? mission.type.replace(/_/g, ' ')}
                        </span>
                        <span className="module-detail__stage-xp">
                          <HiOutlineBolt aria-hidden="true" />
                          {mission.xpReward} XP
                        </span>
                        {!mission.implemented && (
                          <span className="module-detail__stage-label module-detail__stage-label--soft">
                            Скоро
                          </span>
                        )}
                        {done && (
                          <span className="module-detail__stage-score">Результат: {score}%</span>
                        )}
                      </div>
                    </div>

                    {unlocked && mission.implemented && (
                      <button
                        type="button"
                        onClick={() => onSelectStage(mission)}
                        className={`btn ${done ? 'btn-secondary' : 'btn-primary'} module-detail__stage-action`}
                      >
                        {done ? 'Повторить' : 'Открыть'}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}

            {checkpoint && (
              <article
                className={`module-detail__stage-card${
                  checkpointDone ? ' is-complete' : checkpointUnlocked ? ' is-open' : ' is-locked'
                }`}
              >
                <div className="module-detail__stage-main">
                  <div className="module-detail__stage-index" aria-hidden="true">
                    {checkpointDone ? (
                      <HiOutlineCheck aria-hidden="true" />
                    ) : checkpointUnlocked ? (
                      '◍'
                    ) : (
                      <HiOutlineLockClosed aria-hidden="true" />
                    )}
                  </div>

                  <div className="module-detail__stage-copy">
                    <h3 className="module-detail__stage-title">{checkpoint.title}</h3>
                    <div className="module-detail__stage-meta">
                      <span className="module-detail__stage-label module-detail__stage-label--warning">
                        {ARCHIVE_COPY.checkpointLabel}
                      </span>
                      <span className="module-detail__stage-label">
                        После модуля {checkpoint.afterModuleId}
                      </span>
                      <span className="module-detail__stage-xp">
                        <HiOutlineBolt aria-hidden="true" />
                        {checkpoint.xpReward} XP
                      </span>
                      {checkpointDone && (
                        <span className="module-detail__stage-score">Результат: {checkpointScore}%</span>
                      )}
                    </div>
                  </div>

                  {checkpointUnlocked && checkpoint.implemented && (
                    <button
                      type="button"
                      onClick={() => onSelectStage(checkpoint)}
                      className={`btn ${checkpointDone ? 'btn-secondary' : 'btn-primary'} module-detail__stage-action`}
                    >
                      {checkpointDone ? 'Повторить' : 'Открыть узел'}
                    </button>
                  )}
                </div>
              </article>
            )}
          </div>
        )}

        {tab === 'vocab' && (
          <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0.25rem 0 0' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ marginBottom: '2rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: MUTED, letterSpacing: '0.08em', margin: '0 0 0.3rem' }}>
                    СЛОВАРНЫЙ БАНК
                  </p>
                  <h2 style={{ fontSize: '1.625rem', fontWeight: 900, color: TEXT, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0 }}>
                    Термины и понятия
                  </h2>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.125rem',
                    borderRadius: '0.9rem',
                    padding: '0.25rem',
                    background: '#fff',
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {(['cards', 'list'] as VocabView[]).map((viewMode) => (
                    <button
                      key={viewMode}
                      type="button"
                      onClick={() => setVocabView(viewMode)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '0.7rem',
                        border: 'none',
                        background: vocabView === viewMode ? '#EFF6FF' : 'transparent',
                        color: vocabView === viewMode ? BLUE : MUTED,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {viewMode === 'cards' ? <HiOutlineArrowPath size={13} /> : <HiOutlineBookOpen size={13} />}
                      <span>{viewMode === 'cards' ? 'Карточки' : 'Список'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderRadius: '1rem',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: '#fff',
                  border: `1px solid ${BORDER}`,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: '14rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: TEXT }}>Изучено</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: EMERALD }}>
                      {learnedCount} / {mod.vocab.length}
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '999px', overflow: 'hidden', background: '#F1F5F9' }}>
                    <motion.div
                      animate={{ width: `${learnedPct}%` }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, #059669, #10B981)',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ECFDF5',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.9375rem', fontWeight: 900, color: EMERALD }}>
                    {learnedPct}%
                  </span>
                </div>
              </div>
            </motion.div>

            {vocabView === 'cards' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
              >
                {currentWord ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {filteredWords.map((word, index) => (
                          <button
                            key={word.id}
                            type="button"
                            onClick={() => jumpToWord(index)}
                            aria-label={`Открыть слово ${index + 1}`}
                            style={{
                              width: index === currentWordIndex ? '20px' : '7px',
                              height: '7px',
                              borderRadius: '999px',
                              border: 'none',
                              background: learnedWords.has(word.id) ? EMERALD : index === currentWordIndex ? BLUE : '#E2E8F0',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          />
                        ))}
                      </div>

                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: MUTED }}>
                        {currentWordIndex + 1} / {filteredWords.length}
                      </span>
                    </div>

                    <div
                      onClick={() => setIsFlipped(value => !value)}
                      style={{ cursor: 'pointer', marginBottom: '1.5rem', userSelect: 'none', perspective: '1200px' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${currentWord.id}-${isFlipped}`}
                          initial={{ opacity: 0, rotateY: direction > 0 ? 20 : -20, scale: 0.97 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          exit={{ opacity: 0, rotateY: direction > 0 ? -20 : 20, scale: 0.97 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <div
                            style={{
                              position: 'relative',
                              overflow: 'hidden',
                              borderRadius: '1.5rem',
                              background: isFlipped
                                ? 'linear-gradient(135deg, #070D1C 0%, #0E1F3A 100%)'
                                : '#fff',
                              border: isFlipped ? '1px solid rgba(37,99,235,0.2)' : `1px solid ${BORDER}`,
                              boxShadow: '0 12px 40px rgba(12,22,40,0.1)',
                              minHeight: '260px',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '3rem 2.5rem',
                              textAlign: 'center',
                            }}
                          >
                            {isFlipped && (
                              <div
                                aria-hidden="true"
                                style={{
                                  position: 'absolute',
                                  inset: 0,
                                  pointerEvents: 'none',
                                  background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%)',
                                }}
                              />
                            )}

                            <div style={{ position: 'relative' }}>
                              {!isFlipped ? (
                                <>
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.375rem',
                                      borderRadius: '999px',
                                      padding: '0.35rem 0.75rem',
                                      marginBottom: '1.5rem',
                                      background: '#F1F5F9',
                                    }}
                                  >
                                    <div aria-hidden="true" style={{ width: '0.375rem', height: '0.375rem', borderRadius: '999px', background: BLUE }} />
                                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: MUTED, letterSpacing: '0.08em' }}>
                                      {categoryLabel.toUpperCase()}
                                    </span>
                                  </div>

                                  <h3
                                    style={{
                                      margin: '0 0 0.75rem',
                                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                                      fontWeight: 900,
                                      color: TEXT,
                                      letterSpacing: '-0.04em',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {currentWord.ru}
                                  </h3>

                                  <p style={{ margin: 0, fontSize: '0.875rem', color: MUTED, fontWeight: 500 }}>
                                    Нажмите, чтобы увидеть перевод
                                  </p>
                                </>
                              ) : (
                                <>
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.375rem',
                                      borderRadius: '999px',
                                      padding: '0.35rem 0.75rem',
                                      marginBottom: '1.5rem',
                                      background: 'rgba(37,99,235,0.2)',
                                    }}
                                  >
                                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.08em' }}>
                                      ПЕРЕВОД И ОПРЕДЕЛЕНИЕ
                                    </span>
                                  </div>

                                  <h3
                                    style={{
                                      margin: '0 0 0.75rem',
                                      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                      fontWeight: 900,
                                      color: '#F8FAFC',
                                      letterSpacing: '-0.03em',
                                      lineHeight: 1.1,
                                    }}
                                  >
                                    {currentWord.en}
                                  </h3>

                                  <p style={{ margin: 0, fontSize: '0.9375rem', color: '#64748B', lineHeight: 1.65, maxWidth: '340px' }}>
                                    {currentWord.def}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={goPrevWord}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#F1F5F9',
                          border: `1px solid ${BORDER}`,
                          color: TEXT2,
                          cursor: 'pointer',
                        }}
                      >
                        <HiOutlineChevronLeft size={20} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFlipped(value => !value)}
                        style={{
                          flex: '1 1 12rem',
                          minHeight: '3rem',
                          borderRadius: '1rem',
                          border: `1px solid ${isFlipped ? 'rgba(37,99,235,0.2)' : BORDER}`,
                          background: isFlipped ? '#EFF6FF' : '#fff',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: isFlipped ? BLUE : TEXT2,
                          cursor: 'pointer',
                          padding: '0 1rem',
                        }}
                      >
                        {isFlipped ? '← Термин' : 'Перевод →'}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleLearned(currentWord.id)}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isCurrentLearned ? '#ECFDF5' : '#F1F5F9',
                          border: `1px solid ${isCurrentLearned ? 'rgba(5,150,105,0.2)' : BORDER}`,
                          color: isCurrentLearned ? EMERALD : '#CBD5E1',
                          cursor: 'pointer',
                        }}
                        aria-pressed={isCurrentLearned}
                      >
                        <HiOutlineCheckCircle size={18} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={togglePlayback}
                        disabled={!isSupported}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#EFF6FF',
                          border: '1px solid rgba(37,99,235,0.15)',
                          color: isPlaying ? EMERALD : BLUE,
                          cursor: isSupported ? 'pointer' : 'not-allowed',
                          opacity: isSupported ? 1 : 0.5,
                        }}
                      >
                        <HiOutlineSpeakerWave size={18} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={goNextWord}
                        style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '1rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#F1F5F9',
                          border: `1px solid ${BORDER}`,
                          color: TEXT2,
                          cursor: 'pointer',
                        }}
                      >
                        <HiOutlineChevronRight size={20} aria-hidden="true" />
                      </button>
                    </div>

                    <p style={{ textAlign: 'center', margin: '1.25rem 0 0', fontSize: '0.75rem', color: MUTED }}>
                      Нажмите на карточку, чтобы перевернуть · ✓ — отметить изученным
                    </p>
                  </>
                ) : (
                  <div
                    style={{
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      background: '#fff',
                      border: `1px solid ${BORDER}`,
                      color: TEXT2,
                    }}
                  >
                    По этому запросу ничего не найдено.
                  </div>
                )}
              </motion.div>
            )}

            {vocabView === 'list' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    borderRadius: '1rem',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    background: '#fff',
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <HiOutlineMagnifyingGlass size={16} style={{ color: MUTED, flexShrink: 0 }} />
                  <input
                    type="search"
                    value={vocabQuery}
                    onChange={(event) => setVocabQuery(event.target.value)}
                    placeholder="Найти термин..."
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '0.9375rem',
                      color: TEXT,
                      fontWeight: 500,
                    }}
                  />
                </div>

                {filteredWords.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    {filteredWords.map((word, index) => (
                      <VocabularyListCard
                        key={word.id}
                        word={word}
                        index={index}
                        isLearned={learnedWords.has(word.id)}
                        categoryLabel={categoryLabel}
                        onToggleLearned={() => toggleLearned(word.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      borderRadius: '1rem',
                      padding: '1rem 1.1rem',
                      background: '#fff',
                      border: `1px solid ${BORDER}`,
                      color: TEXT2,
                    }}
                  >
                    По этому запросу ничего не найдено.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {tab === 'phrases' && (
          <div className="module-detail__library">
            <p className="module-detail__library-copy">
              Короткие формулировки помогают быстро закрепить язык раздела. Русская версия остаётся
              основной, а английская включается как дополнительная опора.
            </p>
            <div className="module-detail__phrases">
              {mod.phrases.map((phrase, index) => (
                <PhraseRow key={index} phrase={phrase} showEn={showEn} delay={DL[index] ?? ''} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
