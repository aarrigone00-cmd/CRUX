import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const GUEST_KEY = 'crux:guest';

interface Auth {
  session: Session | null;
  userId: string | null;
  email: string | null;
  loading: boolean;
  /** Guest mode: no account, data stays in this browser only. */
  guest: boolean;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<string | null>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null);

const readGuest = () => {
  try {
    return localStorage.getItem(GUEST_KEY) === 'yes';
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guest, setGuest] = useState(readGuest);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const setGuestFlag = (v: boolean) => {
    try {
      if (v) localStorage.setItem(GUEST_KEY, 'yes');
      else localStorage.removeItem(GUEST_KEY);
    } catch {
      /* ignore */
    }
    setGuest(v);
  };

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) setGuestFlag(false);
    return error ? friendly(error.message) : null;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { given_name: name.trim() }, emailRedirectTo: window.location.origin },
    });
    if (error) return { error: friendly(error.message), needsConfirmation: false };
    setGuestFlag(false);
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    return error ? friendly(error.message) : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setGuestFlag(false);
  }, []);

  const value = useMemo<Auth>(
    () => ({
      session,
      userId: session?.user.id ?? null,
      email: session?.user.email ?? null,
      loading,
      guest: guest && !session,
      signInWithPassword,
      signUp,
      signInWithGoogle,
      continueAsGuest: () => setGuestFlag(true),
      signOut,
    }),
    [session, loading, guest, signInWithPassword, signUp, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

function friendly(msg: string): string {
  if (/invalid login/i.test(msg)) return 'That email and password don’t match. Try again or create an account.';
  if (/provider is not enabled|Unsupported provider/i.test(msg)) return 'Google sign-in isn’t switched on yet. Use email and password for now.';
  if (/already registered/i.test(msg)) return 'An account with that email already exists — sign in instead.';
  if (/password should be at least/i.test(msg)) return 'Use a password with at least 6 characters.';
  if (/email not confirmed/i.test(msg)) return 'Please confirm your email first — check your inbox for the link.';
  return msg;
}
