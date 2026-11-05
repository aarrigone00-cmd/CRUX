import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { todayISO, uid } from '@/lib/date';
import type { CheckIn, CruxData, PlannedWorkout, Priority, Profile } from '@/lib/types';
import { demoData, emptyData } from './demo';
import { useAuth } from './auth';
import { fetchAll, remote } from './remote';

/**
 * Storage:
 *  - Signed in → Supabase (per-user rows protected by row-level security). Changes are applied
 *    optimistically on screen and saved in the background; a failed save shows a banner.
 *  - Guest → this browser's localStorage only.
 * Screens use the same hook API either way.
 */
const STORAGE_KEY = 'crux:data:v1';

function load(): CruxData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CruxData;
      if (parsed?.version === 1) return { ...emptyData(), ...parsed };
    }
  } catch {
    /* storage unavailable or corrupt — start fresh */
  }
  return emptyData();
}

export type SyncState = 'local' | 'loading' | 'synced' | 'saving' | 'error';

interface Store {
  data: CruxData;
  sync: SyncState;
  syncError: string | null;
  deleteAccount: () => Promise<void>;
  today: string;
  todayCheckIn?: CheckIn;
  saveCheckIn: (c: Omit<CheckIn, 'date' | 'updatedAt'>) => void;
  addPriority: (text: string) => void;
  togglePriority: (id: string) => void;
  removePriority: (id: string) => void;
  addWorkout: (w: Omit<PlannedWorkout, 'id' | 'completed'>) => void;
  toggleWorkout: (id: string) => void;
  removeWorkout: (id: string) => void;
  updateProfile: (p: Partial<Profile>) => void;
  loadDemo: () => void;
  resetAll: () => void;
}

const StoreContext = createContext<Store | null>(null);

export const MAX_PRIORITIES = 3;

export function StoreProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [data, setData] = useState<CruxData>(load);
  const [sync, setSync] = useState<SyncState>('local');
  const [syncError, setSyncError] = useState<string | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const today = todayISO();

  // Guests: persist to this browser.
  useEffect(() => {
    if (userId) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [data, userId]);

  // Signed in: load everything from Supabase whenever the account changes.
  useEffect(() => {
    if (!userId) {
      setData(load());
      setSync('local');
      return;
    }
    let cancelled = false;
    setSync('loading');
    fetchAll(userId)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setSync('synced');
        setSyncError(null);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setSync('error');
        setSyncError(e instanceof Error ? e.message : 'Could not load your data.');
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  /** Run a save in the background when signed in. */
  const persist = useCallback(
    (op: (uid: string) => Promise<void>) => {
      if (!userId) return;
      setSync('saving');
      op(userId)
        .then(() => {
          setSync('synced');
          setSyncError(null);
        })
        .catch((e: unknown) => {
          setSync('error');
          setSyncError(e instanceof Error ? e.message : 'A change could not be saved.');
        });
    },
    [userId],
  );

  const saveCheckIn = useCallback<Store['saveCheckIn']>(
    (c) => {
      const entry: CheckIn = { ...c, date: today, updatedAt: new Date().toISOString() };
      setData((d) => ({ ...d, checkIns: { ...d.checkIns, [today]: entry } }));
      persist((u) => remote.upsertCheckIn(u, entry));
    },
    [today, persist],
  );

  const addPriority = useCallback(
    (text: string) => {
      const todays = dataRef.current.priorities.filter((p) => p.date === today);
      if (!text.trim() || todays.length >= MAX_PRIORITIES) return;
      const p: Priority = { id: uid(), date: today, text: text.trim(), done: false };
      setData((d) => ({ ...d, priorities: [...d.priorities, p] }));
      persist((u) => remote.upsertPriority(u, p));
    },
    [today, persist],
  );

  const togglePriority = useCallback(
    (id: string) => {
      const cur = dataRef.current.priorities.find((p) => p.id === id);
      if (!cur) return;
      const next = { ...cur, done: !cur.done };
      setData((d) => ({ ...d, priorities: d.priorities.map((p) => (p.id === id ? next : p)) }));
      persist((u) => remote.upsertPriority(u, next));
    },
    [persist],
  );

  const removePriority = useCallback(
    (id: string) => {
      setData((d) => ({ ...d, priorities: d.priorities.filter((p) => p.id !== id) }));
      persist(() => remote.deletePriority(id));
    },
    [persist],
  );

  const addWorkout = useCallback(
    (w: Omit<PlannedWorkout, 'id' | 'completed'>) => {
      const next: PlannedWorkout = { ...w, id: uid(), completed: false };
      setData((d) => ({ ...d, workouts: [...d.workouts, next] }));
      persist((u) => remote.upsertWorkout(u, next));
    },
    [persist],
  );

  const toggleWorkout = useCallback(
    (id: string) => {
      const cur = dataRef.current.workouts.find((w) => w.id === id);
      if (!cur) return;
      const next = { ...cur, completed: !cur.completed };
      setData((d) => ({ ...d, workouts: d.workouts.map((w) => (w.id === id ? next : w)) }));
      persist((u) => remote.upsertWorkout(u, next));
    },
    [persist],
  );

  const removeWorkout = useCallback(
    (id: string) => {
      setData((d) => ({ ...d, workouts: d.workouts.filter((w) => w.id !== id) }));
      persist(() => remote.deleteWorkout(id));
    },
    [persist],
  );

  // Profile edits (e.g. typing a name) are debounced before saving.
  const profileTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const updateProfile = useCallback(
    (p: Partial<Profile>) => {
      const next = { ...dataRef.current.profile, ...p };
      setData((d) => ({ ...d, profile: next }));
      clearTimeout(profileTimer.current);
      profileTimer.current = setTimeout(() => persist((u) => remote.updateProfile(u, next)), 600);
    },
    [persist],
  );

  const loadDemo = useCallback(() => {
    const demo = demoData();
    if (userId && dataRef.current.profile.displayName) demo.profile.displayName = dataRef.current.profile.displayName;
    setData(demo);
    persist((u) => remote.replaceAll(u, demo));
  }, [persist, userId]);

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData((d) => ({ ...emptyData(), profile: userId ? d.profile : emptyData().profile }));
    persist((u) => remote.clearAll(u));
  }, [persist, userId]);

  const deleteAccount = useCallback(async () => {
    await remote.deleteAccount();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyData());
  }, []);

  const value = useMemo<Store>(
    () => ({
      data,
      sync,
      syncError,
      today,
      todayCheckIn: data.checkIns[today],
      saveCheckIn,
      addPriority,
      togglePriority,
      removePriority,
      addWorkout,
      toggleWorkout,
      removeWorkout,
      updateProfile,
      loadDemo,
      resetAll,
      deleteAccount,
    }),
    [data, sync, syncError, today, saveCheckIn, addPriority, togglePriority, removePriority, addWorkout, toggleWorkout, removeWorkout, updateProfile, loadDemo, resetAll, deleteAccount],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
