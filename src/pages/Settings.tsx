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
      <header className="card"><p className="eyebrow">Your account</p><h1 className="display-italic text-4xl font-medium">Profile & privacy</h1></header>

      <section className="card space-y-4">
        <SectionHeader title="Profile" icon={<UserRound size={20} aria-hidden />} />
        <label className="block text-sm font-semibold text-ink-700">
          What should we call you?
          <input className="input mt-1" value={data.profile.displayName} onChange={(e) => updateProfile({ displayName: e.target.value })} maxLength={40} placeholder="First name or nickname" />
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink-700">Activities you do most</legend>
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
        <p className="text-ink-700">
          Right now your data is stored <strong>only in this browser</strong> on this device. Nothing is sent to a server. Account sync with private, per-user storage arrives in the next phase.
        </p>
        <label className="flex items-start gap-3 rounded-2xl bg-bone-200/50 p-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-[var(--color-moss-700)]"
            checked={guideConsent}
            onChange={(e) => {
              setGuideConsent(e.target.checked);
              setConsent(e.target.checked);
            }}
          />
          <span>
            <span className="font-semibold">CRUX GUIDE consent</span>
            <span className="block text-sm text-ink-600">Allow messages you type in CRUX GUIDE to be sent to Google Gemini via CRUX’s server.</span>
          </span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={exportData}>
            <Download size={16} aria-hidden /> Export my data
          </button>
          <button className="btn-secondary" onClick={loadDemo}>Load demo data</button>
        </div>
        {!confirming ? (
          <button className="btn border border-clay-300 text-clay-700 hover:bg-clay-50" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden /> Delete all my data
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="del-title" className="rounded-2xl border border-clay-200 bg-clay-50 p-4">
            <p id="del-title" className="font-semibold text-clay-700">Delete everything stored by CRUX on this device?</p>
            <p className="text-sm text-clay-700">Check-ins, priorities, workouts and your profile will be removed. This can’t be undone.</p>
            <div className="mt-3 flex gap-2">
              <button
                className="btn bg-clay-600 text-white hover:bg-clay-700"
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

      <p className="mx-auto w-fit rounded-full bg-bone-50/90 px-4 py-1.5 text-center text-xs text-ink-600">CRUX v0.1 · Phase 1 preview · Train. Fuel. Thrive.</p>
    </div>
  );
}
