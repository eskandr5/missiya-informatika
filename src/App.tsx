import { useCallback, useEffect, useMemo, useState } from 'react';

import { useProgress } from './hooks/useProgress';
import { MODULES } from './data/modules';
import { getCheckpointAfterModule } from './utils/progression';

import ModernNavBar from './components/ui/ModernNavBar';
import LandingScreen from './screens/LandingScreen';
import DashboardScreenNew from './screens/DashboardScreenNew';
import ModuleScreen from './screens/ModuleScreen';
import MissionScreen from './screens/MissionScreen';
import ResultScreen from './screens/ResultScreen';
import ProfileScreen from './screens/ProfileScreen';

import type { BadgeDef, Module, ProgressionStage } from './types/content';

type View = 'landing' | 'dashboard' | 'module' | 'mission' | 'result' | 'profile';
type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'mss2_theme';

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

interface LastResult {
  score: number;
  stage: ProgressionStage;
  module: Module;
  passed: boolean;
  xpEarned: number;
  badge: BadgeDef | null;
}

export default function App() {
  const { progress, completeMission, completeCheckpoint, reset } = useProgress();

  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [view, setView] = useState<View>('landing');
  const [activeMod, setActiveMod] = useState<Module | null>(null);
  const [activeStage, setActiveStage] = useState<ProgressionStage | null>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const goHome = () => {
    setView('dashboard');
    setActiveMod(null);
    setActiveStage(null);
  };

  const navView = useMemo(() => {
    if (view === 'profile') return 'profile';
    if (view === 'module' || view === 'mission' || view === 'result') return 'modules';
    return 'dashboard';
  }, [view]);

  const handleStageFinish = useCallback((score: number) => {
    if (!activeStage || !activeMod) return;

    const passed = score >= activeStage.passingScore;
    let badgeAwarded: BadgeDef | null = null;

    if (passed) {
      if (activeStage.stageType === 'checkpoint') {
        completeCheckpoint(activeStage.id, score, activeStage.xpReward);
      } else {
        const allModDone = activeMod.missions.every(mission =>
          mission.id === activeStage.id ? true : progress.completedMissions.includes(mission.id),
        );
        if (allModDone) badgeAwarded = activeMod.badge;
        completeMission(activeStage.id, score, activeStage.xpReward, badgeAwarded);
      }
    }

    setLastResult({
      score,
      stage: activeStage,
      module: activeMod,
      passed,
      xpEarned: passed ? activeStage.xpReward : 0,
      badge: badgeAwarded,
    });
    setView('result');
  }, [activeMod, activeStage, completeCheckpoint, completeMission, progress.completedMissions]);

  const handleNext = useCallback(() => {
    if (!lastResult) return;
    const { stage } = lastResult;

    if ('beforeModuleId' in stage) {
      const nextModule = MODULES.find(module => module.id === stage.beforeModuleId);
      if (nextModule) {
        setActiveMod(nextModule);
        setActiveStage(null);
        setView('module');
        return;
      }

      goHome();
      return;
    }

    const module = lastResult.module;
    const stageIndex = module.missions.findIndex(mission => mission.id === stage.id);
    const nextMission = module.missions[stageIndex + 1];

    if (nextMission?.implemented) {
      setActiveStage(nextMission);
      setView('mission');
      return;
    }

    const nextCheckpoint = getCheckpointAfterModule(module.id);
    if (nextCheckpoint?.implemented) {
      setActiveStage(nextCheckpoint);
      setView('mission');
      return;
    }

    setView('module');
  }, [lastResult]);

  const hasNext = useMemo(() => {
    if (!lastResult?.passed) return false;
    const { stage } = lastResult;

    if ('beforeModuleId' in stage) {
      return MODULES.some(module => module.id === stage.beforeModuleId);
    }

    const module = lastResult.module;
    const stageIndex = module.missions.findIndex(mission => mission.id === stage.id);
    const nextMission = module.missions[stageIndex + 1];

    if (nextMission?.implemented) return true;
    return !!getCheckpointAfterModule(module.id)?.implemented;
  }, [lastResult]);

  return (
    <div className="app-container">
      <div className="app-main">
        <ModernNavBar
          progress={progress}
          currentView={navView}
          theme={theme}
          onNavigateDashboard={goHome}
          onNavigateModules={() => {
            if (activeMod) setView('module');
            else setView('dashboard');
          }}
          onNavigateProfile={() => setView('profile')}
          onThemeChange={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        />

        <div className="app-content">
          {view === 'landing' && (
            <LandingScreen progress={progress} onStart={() => setView('dashboard')} />
          )}

          {view === 'dashboard' && (
            <DashboardScreenNew
              progress={progress}
              onSelectModule={module => {
                setActiveMod(module);
                setView('module');
              }}
            />
          )}

          {view === 'module' && activeMod && (
            <ModuleScreen
              module={activeMod}
              progress={progress}
              onSelectStage={stage => {
                setActiveStage(stage);
                setView('mission');
              }}
              onBack={goHome}
            />
          )}

          {view === 'mission' && activeStage && activeMod && (
            <MissionScreen
              stage={activeStage}
              module={activeMod}
              onFinish={handleStageFinish}
              onBack={() => setView('module')}
            />
          )}

          {view === 'result' && lastResult && (
            <ResultScreen
              score={lastResult.score}
              stage={lastResult.stage}
              module={lastResult.module}
              passed={lastResult.passed}
              xpEarned={lastResult.xpEarned}
              badgeEarned={lastResult.badge}
              progress={progress}
              onRetry={() => setView('mission')}
              onNext={hasNext ? handleNext : null}
              onModulePage={() => setView('module')}
              onDashboard={goHome}
            />
          )}

          {view === 'profile' && (
            <ProfileScreen
              progress={progress}
              onBack={goHome}
              onReset={() => {
                reset();
                goHome();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
