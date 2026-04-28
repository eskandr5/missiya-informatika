import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import {
  loginUser,
  logoutUser,
  registerUser,
  type RegisterUserParams,
} from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) {
          console.error('Failed to load Supabase session', error);
        }
        setSession(data.session);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setSession(data.session);
    return data;
  }, []);

  const register = useCallback(async (params: RegisterUserParams) => {
    const data = await registerUser(params);
    if (data.session) {
      setSession(data.session);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setSession(null);
  }, []);

  const user = useMemo<User | null>(() => session?.user ?? null, [session]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: Boolean(session?.user),
    login,
    register,
    logout,
  };
}
