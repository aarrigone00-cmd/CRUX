import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/data/auth';
import { PosterWord, SpacedLetters } from '@/components/PosterWord';
import { VintagePhoto } from '@/components/VintagePhoto';
import { PHOTOS } from '@/lib/photos';
import { cx } from '@/components/ui';

type Mode = 'signin' | 'signup';

export function AuthPage() {
  const { signInWithPassword, signUp, signInWithGoogle, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    if (mode === 'signin') {
      const err = await signInWithPassword(email.trim(), password);
      if (err) setError(err);
    } else {
      const { error: err, needsConfirmation } = await signUp(email.trim(), password, name);
      if (err) setError(err);
      else if (needsConfirmation) setNotice(`Almost there — we sent a confirmation link to ${email.trim()}. Open it, then sign in.`);
    }
    setBusy(false);
  }

  async function google() {
    setError(null);
    const err = await signInWithGoogle();
    if (err) setError(err);
  }

  return (
    <div className="min-h-dvh p-3 sm:p-6 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-6">
      {/* Poster */}
      <section className="grain mb-3 border-[10px] border-poster-frame bg-poster-green p-[5%] text-poster-red [container-type:inline-size] lg:mb-0" aria-hidden>
        <div className="relative mx-auto w-[86%]">
          <div className="aspect-[5/4] overflow-hidden bg-ink-900 lg:aspect-[4/5]">
            <VintagePhoto photo={PHOTOS.smith89} id="auth-poster" />
          </div>
          <div className="relative -mt-[16cqw]">
            <PosterWord word="CRUX" className="block h-[34cqw] w-full" />
          </div>
        </div>
        <SpacedLetters text="Train · Fuel · Thrive" className="mx-auto mt-[3cqw] w-[94%] text-[max(0.8rem,3.6cqw)]" />
      </section>

      {/* Form */}
      <main className="flex items-center justify-center">
        <div className="card w-full max-w-md">
          <p className="eyebrow">A journal for women who climb</p>
          <h1 className="mt-1 text-5xl leading-none">{mode === 'signin' ? 'Welcome back' : 'Join CRUX'}</h1>

          <div role="tablist" aria-label="Account" className="mt-5 grid grid-cols-2 border border-ink-900">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setNotice(null);
                }}
                className={cx('min-h-11 font-poster text-sm tracking-[0.12em] uppercase', mode === m ? 'bg-ink-900 text-mustard-300' : 'text-ink-700 hover:bg-bone-200')}
              >
                {m === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            {mode === 'signup' && (
              <label className="block">
                <span className="eyebrow">First name</span>
                <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={40} />
              </label>
            )}
            <label className="block">
              <span className="eyebrow">Email</span>
              <input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="block">
              <span className="eyebrow">Password</span>
              <input
                className="input mt-1"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </label>

            {error && <p role="alert" className="border border-oxblood-400 bg-clay-50 p-3 text-oxblood-600">{error}</p>}
            {notice && <p role="status" className="border border-moss-300 bg-moss-50 p-3 text-moss-800">{notice}</p>}

            <button className="btn-primary w-full" disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-ink-400">
            <span className="h-px flex-1 bg-ink-900/15" />
            <span className="eyebrow">or</span>
            <span className="h-px flex-1 bg-ink-900/15" />
          </div>

          <button className="btn-secondary w-full" onClick={google}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
              <path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
              <path fill="currentColor" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" opacity=".75" />
              <path fill="currentColor" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" opacity=".55" />
              <path fill="currentColor" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1Z" opacity=".9" />
            </svg>
            Continue with Google
          </button>

          <button className="mt-4 flex w-full items-center justify-center gap-1 text-ink-600 underline-offset-4 hover:underline" onClick={continueAsGuest}>
            Try it without an account <ArrowRight size={14} aria-hidden />
          </button>
          <p className="mt-1 text-center text-sm text-ink-500">Guest data stays in this browser only.</p>
        </div>
      </main>
    </div>
  );
}
