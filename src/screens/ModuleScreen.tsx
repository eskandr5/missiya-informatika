import { useState } from 'react';
import {
  HiOutlineArrowLeft,
  HiOutlineBolt,
  HiOutlineCheck,
  HiOutlineLanguage,
  HiOutlineLockClosed,
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
import VocabCard from '../components/mission/VocabCard';
import PhraseRow from '../components/mission/PhraseRow';
import type { Module, ProgressionStage } from '../types/content';
import type { Progress } from '../types/progress';

interface Props {
  module: Module;
  progress: Progress;
  onSelectStage: (stage: ProgressionStage) => void;
  onBack: () => void;
}

type Tab = 'missions' | 'vocab' | 'phrases';

const TAB_LABELS: Record<Tab, string> = {
  missions: 'Протоколы',
  vocab: 'Термины',
  phrases: 'Формулировки',
};

export default function ModuleScreen({ module: mod, progress, onSelectStage, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('missions');
  const [showEn, setShowEn] = useState(false);

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

  return (
    <div className="app-page module-detail">
      <div className="module-detail__toolbar">
        <button type="button" onClick={onBack} className="btn btn-secondary module-detail__toolbar-btn">
          <HiOutlineArrowLeft aria-hidden="true" />
          <span>{ARCHIVE_COPY.dashboardTitle}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowEn(value => !value)}
          className={`btn ${showEn ? 'btn-primary' : 'btn-ghost'} module-detail__toolbar-btn`}
        >
          <HiOutlineLanguage aria-hidden="true" />
          <span>{showEn ? 'РУС + EN' : 'РУС'}</span>
        </button>
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
                      '◎'
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
          <div className="module-detail__library">
            <p className="module-detail__library-copy">
              {mod.vocab.length} терминов. Нажмите на карточку, чтобы открыть определение, а при
              необходимости включите английские подсказки.
            </p>
            <div className="grid grid--3 module-detail__library-grid">
              {mod.vocab.map((word, index) => (
                <VocabCard key={word.id} word={word} showEn={showEn} delay={DL[index] ?? ''} />
              ))}
            </div>
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
