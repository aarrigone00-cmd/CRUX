import { useState } from 'react';
import { Download, Lock, Trash2, UserRound } from 'lucide-react';
import { useStore } from '@/data/store';
import { ACTIVITY_TYPES } from '@/lib/types';
import { getGuideConsent, setGuideConsent } from '@/lib/guide';
import { Chip, SectionHeader } from '@/components/ui';

export function Settings() {
  const { data, updateProfile, resetAll, loadDemo } = useStore();
  const [guideConsent, setConsent] = useState(getGuideConsent);
  const [confirming, setConfirming] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crux-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl font-semibold">Profile & privacy</h1>

      <section className="card space-y-4">
        <SectionHeader title="Profile" icon={<UserRound size={20} aria-hidden />} />
        <label className="block text-sm font-semibold text-charcoal-700">
          What should we call you?
          <input className="input mt-1" value={data.profile.displayName} onChange={(e) => updateProfile({ displayName: e.target.value })} maxLength={40} placeholder="First name or nickname" />
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-charcoal-700">Activities you do most</legend>
          <div className="flex flex-wrap gap-2">
            {ACTIVITY_TYPES.map((a) => {
              const on = data.profile.focusActivities.includes(a);
              return (
                <Chip key={a} selected={on} onClick={() => updateProfile({ focusActivities: on ? data.profile.focusActivities.filter((x) => x !== a) : [...data.profile.focusActivities, a] })}>
                  {a}
                </Chip>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section className="card space-y-4">
        <SectionHeader title="Your data" icon={<Lock size={20} aria-hidden />} />
        <p className="text-charcoal-700">
          Right now your data is stored <strong>only in this browser</strong> on this device. Nothing is sent to a server. Account sync with private, per-user storage arrives in the next phase.
        </p>
        <label className="flex items-start gap-3 rounded-2xl bg-cream-200/50 p-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-[var(--color-sage-700)]"
            checked={guideConsent}
            onChange={(e) => {
              setGuideConsent(e.target.checked);
              setConsent(e.target.checked);
            }}
          />
          <span>
            <span className="font-semibold">CRUX GUIDE consent</span>
            <span className="block text-sm text-charcoal-600">Allow messages you type in CRUX GUIDE to be sent to Google Gemini via CRUX’s server.</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={exportData}>
            <Download size={16} aria-hidden /> Export my data
          </button>
          <button className="btn-secondary" onClick={loadDemo}>Load demo data</button>
        </div>
        {!confirming ? (
          <button className="btn border border-rose-300 text-rose-700 hover:bg-rose-50" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden /> Delete all my data
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="del-title" className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p id="del-title" className="font-semibold text-rose-700">Delete everything stored by CRUX on this device?</p>
            <p className="text-sm text-rose-700">Check-ins, priorities, workouts and your profile will be removed. This can’t be undone.</p>
            <div className="mt-3 flex gap-2">
              <button
                className="btn bg-rose-600 text-white hover:bg-rose-700"
                onClick={() => {
                  resetAll();
                  setGuideConsent(false);
                  setConsent(false);
                  setConfirming(false);
                }}
              >
                Yes, delete
              </button>
              <button className="btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-charcoal-500">CRUX v0.1 · Phase 1 preview · Train. Fuel. Thrive.</p>
    </div>
  );
}
