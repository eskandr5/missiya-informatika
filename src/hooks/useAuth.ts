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

  const login = useCallback((email: string, password: string) => {
    return loginUser(email, password);
  }, []);

  const register = useCallback((params: RegisterUserParams) => {
    return registerUser(params);
  }, []);

  const logout = useCallback(() => {
    return logoutUser();
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
