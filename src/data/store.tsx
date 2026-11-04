import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { todayISO, uid } from '@/lib/date';
import type { CheckIn, CruxData, PlannedWorkout, Priority, Profile } from '@/lib/types';
import { demoData, emptyData } from './demo';

/**
 * Phase 1 storage: the browser's localStorage, on this device only.
 * Phase 2 replaces the persistence layer with Supabase (per-user rows protected by
 * row-level security) while keeping this same hook API, so screens don't change.
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

interface Store {
  data: CruxData;
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
  const [data, setData] = useState<CruxData>(load);
  const today = todayISO();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [data]);

  const saveCheckIn = useCallback<Store['saveCheckIn']>(
    (c) =>
      setData((d) => ({
        ...d,
        checkIns: { ...d.checkIns, [today]: { ...c, date: today, updatedAt: new Date().toISOString() } },
      })),
    [today],
  );

  const addPriority = useCallback(
    (text: string) =>
      setData((d) => {
        const todays = d.priorities.filter((p) => p.date === today);
        if (!text.trim() || todays.length >= MAX_PRIORITIES) return d;
        const p: Priority = { id: uid(), date: today, text: text.trim(), done: false };
        return { ...d, priorities: [...d.priorities, p] };
      }),
    [today],
  );

  const togglePriority = useCallback(
    (id: string) => setData((d) => ({ ...d, priorities: d.priorities.map((p) => (p.id === id ? { ...p, done: !p.done } : p)) })),
    [],
  );
  const removePriority = useCallback(
    (id: string) => setData((d) => ({ ...d, priorities: d.priorities.filter((p) => p.id !== id) })),
    [],
  );
  const addWorkout = useCallback(
    (w: Omit<PlannedWorkout, 'id' | 'completed'>) => setData((d) => ({ ...d, workouts: [...d.workouts, { ...w, id: uid(), completed: false }] })),
    [],
  );
  const toggleWorkout = useCallback(
    (id: string) => setData((d) => ({ ...d, workouts: d.workouts.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w)) })),
    [],
  );
  const removeWorkout = useCallback(
    (id: string) => setData((d) => ({ ...d, workouts: d.workouts.filter((w) => w.id !== id) })),
    [],
  );
  const updateProfile = useCallback(
    (p: Partial<Profile>) => setData((d) => ({ ...d, profile: { ...d.profile, ...p } })),
    [],
  );
  const loadDemo = useCallback(() => setData(demoData()), []);
  const resetAll = useCallback(() => {
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
    }),
    [data, today, saveCheckIn, addPriority, togglePriority, removePriority, addWorkout, toggleWorkout, removeWorkout, updateProfile, loadDemo, resetAll],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
