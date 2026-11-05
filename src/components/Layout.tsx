import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowUpRight, Brain, CalendarHeart, CircleUserRound, House, Mountain, Salad } from 'lucide-react';
import { Ridge } from './Ridge';
import { cx } from './ui';
import { useStore } from '@/data/store';

/** Underlined keyword in the sidebar intro. */
function U({ children }: { children: string }) {
  return <span className="underline decoration-1 underline-offset-[3px]">{children}</span>;
}

export const NAV = [
  { to: '/', label: 'Home', icon: House, end: true, blurb: 'Today / Check-in' },
  { to: '/train', label: 'Train', icon: Mountain, blurb: 'Move / Climb / Prep' },
  { to: '/fuel', label: 'Fuel', icon: Salad, blurb: 'Meals / Snacks / Recovery' },
  { to: '/cycle', label: 'Cycle', icon: CalendarHeart, blurb: 'Calendar / Symptoms' },
  { to: '/mind', label: 'Mind', icon: Brain, blurb: 'Focus / Routines / Calm' },
] as const;

/** Issue number = day of the year, like a daily edition. */
function issue(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  return String(Math.floor((d.getTime() - start.getTime()) / 86_400_000)).padStart(3, '0');
}

export function Layout() {
  const { pathname } = useLocation();
  const { sync, syncError } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const no = issue();
  const month = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3">
        Skip to content
      </a>

      {/* ── Desktop sidebar: a magazine table of contents ── */}
      <aside className="grain sticky top-0 hidden h-dvh w-72 shrink-0 flex-col overflow-y-auto bg-ink-900 text-bone-100 lg:flex">
        <div className="px-7 pt-7">
          <p className="flex justify-between font-mono text-[0.65rem] tracking-[0.14em] text-bone-100/55 uppercase">
            <span>/Vol. 01</span>
            <span>No. {no}</span>
          </p>
          <NavLink to="/" aria-label="CRUX home" className="mt-3 block font-grotesk text-[4.6rem] leading-[0.85] font-medium tracking-[-0.04em] text-bone-50">
            CRUX
          </NavLink>
          <p className="mt-4 font-condensed text-[1.2rem] leading-[1.15] font-medium tracking-[0.01em] text-bone-100 uppercase">
            A journal for women who climb. Playing with <U>movement</U>, <U>fuel</U> and all kinds of <U>rest</U> is our thing.
          </p>
        </div>

        <nav aria-label="Main" className="mt-6 border-t border-bone-50/15 px-7 pt-5">
          <p className="mb-1 font-condensed text-sm font-medium tracking-[0.08em] text-bone-100/50 uppercase">Contents / Issue {no}</p>
          <ol>
            {NAV.map(({ to, label, blurb, ...rest }, i) => (
              <li key={to} className="border-b border-bone-50/10">
                <NavLink to={to} end={'end' in rest} className="group flex items-baseline gap-4 py-2.5">
                  {({ isActive }) => (
                    <>
                      <span className={cx('w-6 font-condensed text-base font-medium', isActive ? 'text-mustard-300' : 'text-bone-100/45')}>0{i + 1}</span>
                      <span className="flex-1">
                        <span className={cx('block font-condensed text-[1.7rem] leading-[1.05] font-semibold tracking-[0.01em] uppercase transition-colors', isActive ? 'text-mustard-300' : 'text-bone-50 group-hover:text-mustard-200')}>
                          {label}
                        </span>
                        <span className="block font-display text-[0.98rem] text-bone-100/60">{blurb}</span>
                      </span>
                      <span aria-hidden className={cx('h-2 w-2 self-center transition-colors', isActive ? 'bg-mustard-300' : 'bg-transparent')} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>

        <div className="px-7 pt-6">
          <NavLink to="/guide" className="group flex items-end justify-between bg-mustard-300 p-4 text-ink-900 transition-colors hover:bg-mustard-200">
            <span>
              <span className="block font-condensed text-[1.6rem] leading-none font-semibold uppercase">Ask the Guide</span>
              <span className="block font-display text-[0.98rem]">AI assistant / Beta</span>
            </span>
            <ArrowUpRight size={22} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </NavLink>
        </div>

        <figure className="sidebar-fig mt-6 px-7">
          <div className="aspect-[16/9] overflow-hidden border border-bone-50/15">
            <Ridge id="sidebar" align="xMaxYMax" className="h-full w-full" />
          </div>
          <figcaption className="mt-2 flex justify-between font-mono text-[0.6rem] tracking-[0.12em] text-bone-100/50 uppercase">
            <span>Fig. 01 — The crux</span>
            <span>Golden hour</span>
          </figcaption>
        </figure>

        <div className="mt-auto border-t border-bone-50/15 px-7 py-5">
          <NavLink to="/settings" className={({ isActive }) => cx('flex items-center gap-2 font-condensed text-lg font-medium tracking-[0.02em] uppercase', isActive ? 'text-mustard-300' : 'text-bone-100/80 hover:text-bone-50')}>
            <CircleUserRound size={16} aria-hidden /> Profile & privacy
          </NavLink>
          <p className="mt-1 font-display text-sm text-bone-100/45">{month} / Edition {no}</p>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        {/* ── Mobile masthead ── */}
        <header className="safe-top sticky top-0 z-30 border-b border-ink-900/15 bg-bone-50/95 backdrop-blur lg:hidden">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
            <NavLink to="/" aria-label="CRUX home" className="flex items-baseline gap-2.5">
              <span className="font-grotesk text-[1.9rem] leading-none font-medium tracking-[-0.04em] text-ink-900">CRUX</span>
              <span className="font-mono text-[0.6rem] tracking-[0.12em] text-ink-500 uppercase">No. {no}</span>
            </NavLink>
            <div className="flex items-center gap-1">
              <NavLink to="/guide" className="flex min-h-9 items-center bg-mustard-300 px-3 font-mono text-[0.7rem] font-medium tracking-[0.12em] text-ink-900 uppercase">
                Guide ↗
              </NavLink>
              <NavLink to="/settings" aria-label="Profile and privacy" className="grid h-10 w-10 place-items-center text-ink-700">
                <CircleUserRound size={21} aria-hidden />
              </NavLink>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-28 lg:max-w-5xl lg:px-10 lg:pt-10 lg:pb-14">
          {sync === 'error' && (
            <p role="alert" className="mb-4 border border-oxblood-400 bg-bone-50 p-3 text-oxblood-600">
              Couldn’t reach your account just now{syncError ? ` (${syncError})` : ''}. Your latest change may not be saved — check your connection and try again.
            </p>
          )}
          {sync === 'loading' && <p className="eyebrow mb-4 w-fit bg-bone-50 px-3 py-1.5">Loading your journal…</p>}
          <Outlet />
        </main>

        {/* ── Mobile tab bar ── */}
        <nav aria-label="Main" className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-ink-900/20 bg-bone-50/95 backdrop-blur lg:hidden">
          <ul className="mx-auto grid max-w-2xl grid-cols-5">
            {NAV.map(({ to, label, icon: Icon, ...rest }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={'end' in rest}
                  className={({ isActive }) =>
                    cx('flex min-h-15 flex-col items-center justify-center gap-1 font-mono text-[0.62rem] font-medium tracking-[0.12em] uppercase transition-colors', isActive ? 'bg-ink-900 text-mustard-300' : 'text-ink-600')
                  }
                >
                  <Icon size={19} aria-hidden strokeWidth={1.6} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
