import { useState } from 'react';
import { Download, LogOut, Lock, Trash2, UserRound } from 'lucide-react';
import { useStore } from '@/data/store';
import { useAuth } from '@/data/auth';
import { ACTIVITY_TYPES } from '@/lib/types';
import { getGuideConsent, setGuideConsent } from '@/lib/guide';
import { Chip, SectionHeader } from '@/components/ui';
import { Mixed } from '@/components/Type';
import { PHOTOS, type Photo } from '@/lib/photos';

const CREDITS: Photo[] = Object.values(PHOTOS);

export function Settings() {
  const { data, updateProfile, resetAll, loadDemo, deleteAccount, sync } = useStore();
  const { userId, email, signOut } = useAuth();
  const [guideConsent, setConsent] = useState(getGuideConsent);
  const [confirming, setConfirming] = useState(false);
  const [confirmingAccount, setConfirmingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

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
      <header className="card"><p className="eyebrow">/Your account</p><h1 className="mt-2 text-5xl leading-tight"><Mixed text="Profile & privacy" pattern={0} /></h1></header>

      <section className="card space-y-4">
        <SectionHeader title="Profile" icon={<UserRound size={20} aria-hidden />} />
        <label className="block font-mono text-[0.7rem] tracking-[0.12em] text-ink-700 uppercase">
          What should we call you?
          <input className="input mt-1 font-sans text-base tracking-normal normal-case" value={data.profile.displayName} onChange={(e) => updateProfile({ displayName: e.target.value })} maxLength={40} placeholder="First name or nickname" />
        </label>
        <fieldset>
          <legend className="mb-2 font-mono text-[0.7rem] tracking-[0.12em] text-ink-700 uppercase">Activities you do most</legend>
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
          {userId ? (
            <>
              Your data is saved to your private CRUX account and syncs across devices. Only you can read it — every row is locked to your account.{' '}
              <span className="text-ink-500">Status: {sync === 'error' ? 'a change failed to save' : sync === 'saving' ? 'saving…' : 'saved'}.</span>
            </>
          ) : (
            <>
              You’re using CRUX as a guest: your data is stored <strong>only in this browser</strong>. Create an account to keep it safe and use it on other devices.
            </>
          )}
        </p>
        <label className="flex items-start gap-3 bg-bone-200/50 p-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-[var(--color-ink-900)]"
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
          <button className="btn border border-oxblood-500 text-oxblood-500 hover:bg-oxblood-500 hover:text-bone-50" onClick={() => setConfirming(true)}>
            <Trash2 size={16} aria-hidden /> Delete all my logged data
          </button>
        ) : (
          <div role="alertdialog" aria-labelledby="del-title" className=" border border-clay-200 bg-clay-50 p-4">
            <p id="del-title" className="font-semibold text-clay-700">Delete all your logged data?</p>
            <p className="text-sm text-clay-700">Check-ins, priorities and workouts will be removed{userId ? ' from your account' : ' from this browser'}. This can’t be undone.</p>
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

      <section className="card space-y-4">
        <SectionHeader eyebrow="Account" title={userId ? 'Signed in' : 'Guest mode'} />
        {userId ? (
          <>
            <p className="text-ink-700">Signed in as <strong>{email}</strong>.</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => signOut()}>
                <LogOut size={16} aria-hidden /> Sign out
              </button>
              {!confirmingAccount && (
                <button className="btn border border-oxblood-500 text-oxblood-500 hover:bg-oxblood-500 hover:text-bone-50" onClick={() => setConfirmingAccount(true)}>
                  <Trash2 size={16} aria-hidden /> Delete my account
                </button>
              )}
            </div>
            {confirmingAccount && (
              <div role="alertdialog" aria-labelledby="acct-title" className="border border-oxblood-400 bg-clay-50 p-4">
                <p id="acct-title" className="font-semibold text-oxblood-600">Permanently delete your CRUX account?</p>
                <p className="text-sm text-oxblood-600">Your login, profile and every check-in, priority and workout are erased from our servers. This can’t be undone.</p>
                {accountError && <p role="alert" className="mt-2 text-sm text-oxblood-600">{accountError}</p>}
                <div className="mt-3 flex gap-2">
                  <button
                    className="btn bg-oxblood-500 text-white hover:bg-oxblood-600"
                    onClick={async () => {
                      setAccountError(null);
                      try {
                        await deleteAccount();
                        setGuideConsent(false);
                        await signOut();
                      } catch (e) {
                        setAccountError(e instanceof Error ? e.message : 'Could not delete the account. Please try again.');
                      }
                    }}
                  >
                    Yes, delete my account
                  </button>
                  <button className="btn-ghost" onClick={() => setConfirmingAccount(false)}>Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-ink-700">You’re trying CRUX without an account. Your data lives in this browser only.</p>
            <button className="btn-primary" onClick={() => signOut()}>Sign in or create an account</button>
          </>
        )}
      </section>

      <section className="card">
        <SectionHeader eyebrow="Colophon" title="Image credits" />
        <ul className="space-y-2 text-sm text-ink-700">
          {CREDITS.map((p) => (
            <li key={p.page}>
              <a href={p.page} target="_blank" rel="noreferrer" className="underline underline-offset-2">{p.title}</a> — {p.author},{' '}
              {p.licenseUrl ? (
                <a href={p.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{p.license}</a>
              ) : (
                p.license
              )}
              , via Wikimedia Commons.
            </li>
          ))}
          <li>All other artwork — ridge, wall, holds, doodles and the ikat pattern — is original to CRUX.</li>
        </ul>
      </section>

      <p className="mx-auto w-fit bg-bone-50/90 px-4 py-1.5 text-center text-xs text-ink-600">CRUX v0.1 · Phase 1 preview · Train. Fuel. Thrive.</p>
    </div>
  );
}
