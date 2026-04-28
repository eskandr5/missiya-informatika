import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useProgress } from './hooks/useProgress';
import { useAuth } from './hooks/useAuth';
import { MODULES } from './data/modules';
import { getCheckpointAfterModule } from './utils/progression';

import ModernNavBar from './components/ui/ModernNavBar';
import LandingScreen from './screens/LandingScreen';
import DashboardScreenNew from './screens/DashboardScreenNew';
import ModuleScreen from './screens/ModuleScreen';
import MissionScreen from './screens/MissionScreen';
import ResultScreen from './screens/ResultScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import type { BadgeDef, Module, ProgressionStage } from './types/content';

type View = 'landing' | 'dashboard' | 'module' | 'mission' | 'result' | 'profile' | 'login' | 'register';
type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'mss2_theme';
const PUBLIC_VIEWS = new Set<View>(['landing', 'login', 'register']);

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
  const auth = useAuth();
  const { progress, isLoading: isProgressLoading, completeMission, completeCheckpoint, reset } = useProgress({
    isAuthenticated: auth.isAuthenticated,
    isAuthLoading: auth.isLoading,
  });

  const initialAuthViewHandled = useRef(false);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [view, setView] = useState<View>('landing');
  const [activeMod, setActiveMod] = useState<Module | null>(null);
  const [activeStage, setActiveStage] = useState<ProgressionStage | null>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      initialAuthViewHandled.current = true;

      if (!PUBLIC_VIEWS.has(view)) {
        setActiveMod(null);
        setActiveStage(null);
        setLastResult(null);
        setView('landing');
      }

      return;
    }

    if (!initialAuthViewHandled.current) {
      initialAuthViewHandled.current = true;
      if (view === 'landing') {
        setView('dashboard');
      }
      return;
    }

    if (view === 'login' || view === 'register') {
      setView('dashboard');
    }
  }, [auth.isAuthenticated, auth.isLoading, view]);

  const openLanding = useCallback(() => {
    setView('landing');
    setActiveMod(null);
    setActiveStage(null);
    setLastResult(null);
  }, []);

  const goHome = useCallback(() => {
    if (!auth.isAuthenticated) {
      openLanding();
      return;
    }

    setView('dashboard');
    setActiveMod(null);
    setActiveStage(null);
  }, [auth.isAuthenticated, openLanding]);

  const requireAuth = useCallback((next: () => void) => {
    if (!auth.isAuthenticated) {
      setView('login');
      return;
    }

    next();
  }, [auth.isAuthenticated]);

  const navView = useMemo(() => {
    if (view === 'profile') return 'profile';
    if (view === 'module' || view === 'mission' || view === 'result') return 'modules';
    return 'dashboard';
  }, [view]);

  const handleLogin = async (email: string, password: string) => {
    await auth.login(email, password);
    setView('dashboard');
  };

  const handleRegister = async (params: {
    email: string;
    password: string;
    displayName?: string;
  }) => {
    const result = await auth.register(params);
    if (result.session) {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    auth.logout().then(() => {
      openLanding();
    }).catch(error => {
      console.error('Failed to sign out', error);
    });
  };

  const handleStageFinish = useCallback(async (score: number) => {
    if (!activeStage || !activeMod) return;

    if (!auth.isAuthenticated) {
      setView('login');
      return;
    }

    let passed = score >= activeStage.passingScore;
    let badgeAwarded: BadgeDef | null = null;
    let xpEarned = 0;

    if (activeStage.stageType === 'checkpoint') {
      if (auth.isAuthenticated || passed) {
        const result = await completeCheckpoint(activeStage.id, score, activeStage.xpReward);
        passed = result.attempt.passed;
        xpEarned = result.attempt.xpAwarded;
      }
    } else if (auth.isAuthenticated || passed) {
      const allModDone = activeMod.missions.every(mission =>
        mission.id === activeStage.id ? true : progress.completedMissions.includes(mission.id),
      );
      const localBadge = allModDone ? activeMod.badge : null;
      const result = await completeMission(activeStage.id, score, activeStage.xpReward, localBadge);
      passed = result.attempt.passed;
      xpEarned = result.attempt.xpAwarded;

      if (result.badgeUnlocked?.badgeId === activeMod.badge.id) {
        badgeAwarded = activeMod.badge;
      } else if (!auth.isAuthenticated && result.badgeUnlocked) {
        badgeAwarded = activeMod.badge;
      }
    }

    if (!auth.isAuthenticated && passed && activeStage.stageType !== 'checkpoint') {
      if (!badgeAwarded) {
        const allModDone = activeMod.missions.every(mission =>
          mission.id === activeStage.id ? true : progress.completedMissions.includes(mission.id),
        );
        if (allModDone) badgeAwarded = activeMod.badge;
      }
    }

    setLastResult({
      score,
      stage: activeStage,
      module: activeMod,
      passed,
      xpEarned,
      badge: badgeAwarded,
    });
    setView('result');
  }, [activeMod, activeStage, auth.isAuthenticated, completeCheckpoint, completeMission, progress.completedMissions]);

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

  const appIsLoading = auth.isLoading || (auth.isAuthenticated && isProgressLoading);

  if (appIsLoading) {
    return (
      <div className="app-container">
        <div
          className="app-main"
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--text-primary, #0c1628)',
            fontWeight: 800,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-main">
        <ModernNavBar
          progress={progress}
          currentView={navView}
          theme={theme}
          onNavigateDashboard={() => requireAuth(goHome)}
          onNavigateModules={() => {
            requireAuth(() => {
              if (activeMod) setView('module');
              else setView('dashboard');
            });
          }}
          onNavigateProfile={() => requireAuth(() => setView('profile'))}
          onThemeChange={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          isAuthenticated={auth.isAuthenticated}
          userEmail={auth.user?.email}
          onNavigateLogin={() => setView('login')}
          onLogout={handleLogout}
        />

        <div className="app-content">
          {view === 'landing' && (
            <LandingScreen
              progress={progress}
              onStart={() => requireAuth(goHome)}
              onLogin={() => setView('login')}
              onRegister={() => setView('register')}
            />
          )}

          {view === 'login' && (
            <LoginScreen
              isLoading={auth.isLoading}
              onLogin={handleLogin}
              onBack={openLanding}
              onRegister={() => setView('register')}
            />
          )}

          {view === 'register' && (
            <RegisterScreen
              isLoading={auth.isLoading}
              onRegister={handleRegister}
              onBack={openLanding}
              onLogin={() => setView('login')}
            />
          )}

          {view === 'dashboard' && (
            <DashboardScreenNew
              progress={progress}
              onSelectModule={module => {
                requireAuth(() => {
                  setActiveMod(module);
                  setView('module');
                });
              }}
            />
          )}

          {view === 'module' && activeMod && (
            <ModuleScreen
              module={activeMod}
              progress={progress}
              onSelectStage={stage => {
                requireAuth(() => {
                  setActiveStage(stage);
                  setView('mission');
                });
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
