import { useState, useCallback, useMemo, useEffect } from 'react';
import './styles/global.css';

import { useProgress }       from './hooks/useProgress';

import NavBar          from './components/ui/NavBar';
import LandingScreen   from './screens/LandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import ModuleScreen    from './screens/ModuleScreen';
import MissionScreen   from './screens/MissionScreen';
import ResultScreen    from './screens/ResultScreen';
import ProfileScreen   from './screens/ProfileScreen';

import type { Module, Mission, BadgeDef } from './types/content';

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
  mission: Mission;
  module: Module;
  passed: boolean;
  xpEarned: number;
  badge: BadgeDef | null;
}

export default function App() {
  const { progress, completeMission, reset } = useProgress();

  const [theme,         setTheme]         = useState<Theme>(loadTheme);
  const [view,          setView]          = useState<View>('landing');
  const [activeMod,     setActiveMod]     = useState<Module | null>(null);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [lastResult,    setLastResult]    = useState<LastResult | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const goHome    = () => { setView('dashboard'); setActiveMod(null); setActiveMission(null); };
  const goProfile = () => setView('profile');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // ── Called by MissionScreen once the activity reports a score ──
  const handleMissionFinish = useCallback((score: number) => {
    if (!activeMission || !activeMod) return;
    const passed = score >= activeMission.passingScore;
    let badgeAwarded: BadgeDef | null = null;

    if (passed) {
      const allModDone = activeMod.missions.every(m =>
        m.id === activeMission.id ? true : progress.completedMissions.includes(m.id),
      );
      if (allModDone) badgeAwarded = activeMod.badge;
      completeMission(activeMission.id, score, activeMission.xpReward, badgeAwarded);
    }

    setLastResult({
      score,
      mission: activeMission,
      module:  activeMod,
      passed,
      xpEarned: passed ? activeMission.xpReward : 0,
      badge: badgeAwarded,
    });
    setView('result');
  }, [activeMission, activeMod, progress.completedMissions, completeMission]);

  // ── Advance to the next implemented mission if it exists ──
  const handleNext = useCallback(() => {
    if (!lastResult) return;
    const mod  = lastResult.module;
    const idx  = mod.missions.findIndex(m => m.id === lastResult.mission.id);
    const next = mod.missions[idx + 1];
    if (next) {
      setActiveMission(next);
      setView('mission');
    } else {
      setView('module');
    }
  }, [lastResult]);

  const hasNext = useMemo(() => {
    if (!lastResult?.passed) return false;
    const mod  = lastResult.module;
    const idx  = mod.missions.findIndex(m => m.id === lastResult.mission.id);
    const next = mod.missions[idx + 1];
    return !!(next?.implemented);
  }, [lastResult]);

  return (
    <>
      {view !== 'landing' && (
        <NavBar
          xp={progress.xp}
          theme={theme}
          onHome={goHome}
          onProfile={goProfile}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'landing' && (
        <LandingScreen progress={progress} onStart={() => setView('dashboard')} />
      )}

      {view === 'dashboard' && (
        <DashboardScreen
          progress={progress}
          onSelectModule={mod => { setActiveMod(mod); setView('module'); }}
        />
      )}

      {view === 'module' && activeMod && (
        <ModuleScreen
          module={activeMod}
          progress={progress}
          onSelectMission={m => { setActiveMission(m); setView('mission'); }}
          onBack={goHome}
        />
      )}

      {view === 'mission' && activeMission && activeMod && (
        <MissionScreen
          mission={activeMission}
          module={activeMod}
          onFinish={handleMissionFinish}
          onBack={() => setView('module')}
        />
      )}

      {view === 'result' && lastResult && (
        <ResultScreen
          score={lastResult.score}
          mission={lastResult.mission}
          module={lastResult.module}
          passed={lastResult.passed}
          xpEarned={lastResult.xpEarned}
          badgeEarned={lastResult.badge}
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
          onReset={() => { reset(); goHome(); }}
        />
      )}
    </>
  );
}
