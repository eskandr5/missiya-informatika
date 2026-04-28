import { supabase } from '../lib/supabase';

export interface RegisterUserParams {
  email: string;
  password: string;
  displayName?: string;
}

export async function registerUser({
  email,
  password,
  displayName,
}: RegisterUserParams) {
  const trimmedDisplayName = displayName?.trim();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...(trimmedDisplayName ? { display_name: trimmedDisplayName } : {}),
        preferred_language: 'ru',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
