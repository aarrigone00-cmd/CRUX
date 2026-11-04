import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Brain, CalendarHeart, CircleUserRound, House, Mountain, Salad, Sparkles } from 'lucide-react';
import { Wordmark } from './Logo';
import { cx } from './ui';

export const NAV = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/train', label: 'Train', icon: Mountain },
  { to: '/fuel', label: 'Fuel', icon: Salad },
  { to: '/cycle', label: 'Cycle', icon: CalendarHeart },
  { to: '/mind', label: 'Mind', icon: Brain },
] as const;

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-bone-300/60 bg-bone-50/70 px-5 py-7 backdrop-blur lg:flex">
        <Wordmark />
        <p className="display-italic mt-2 pl-[2.6rem] text-sm text-clay-600">Train. Fuel. Thrive.</p>
        <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <NavLink
              key={to}
              to={to}
              end={'end' in rest}
              className={({ isActive }) =>
                cx(
                  'flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors',
                  isActive ? 'bg-ink-900 text-bone-50 shadow-md' : 'text-ink-600 hover:bg-bone-200',
                )
              }
            >
              <Icon size={20} aria-hidden /> {label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/guide"
          className="mt-6 flex min-h-11 items-center gap-3 rounded-xl bg-clay-600 px-3 font-semibold text-white shadow-md hover:bg-clay-700"
        >
          <Sparkles size={20} aria-hidden /> CRUX GUIDE
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cx('mt-auto flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium', isActive ? 'bg-ink-900 text-bone-50' : 'text-ink-600 hover:bg-bone-200')
          }
        >
          <CircleUserRound size={20} aria-hidden /> Profile & privacy
        </NavLink>
      </aside>

      <div className="flex min-h-dvh flex-1 flex-col">
        {/* Mobile header */}
        <header className="safe-top sticky top-0 z-30 border-b border-bone-300/50 bg-bone-100/80 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
            <NavLink to="/" aria-label="CRUX home">
              <Wordmark />
            </NavLink>
            <div className="flex items-center gap-1">
              <NavLink
                to="/guide"
                className="flex min-h-10 items-center gap-1.5 rounded-full bg-ink-900 px-3.5 text-sm font-semibold text-bone-50"
              >
                <Sparkles size={16} aria-hidden /> Guide
              </NavLink>
              <NavLink to="/settings" aria-label="Profile and privacy" className="grid h-10 w-10 place-items-center rounded-full text-ink-600 hover:bg-bone-200">
                <CircleUserRound size={22} aria-hidden />
              </NavLink>
            </div>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-32 lg:max-w-5xl lg:px-8 lg:pt-8 lg:pb-12">
          <Outlet />
        </main>

        {/* Mobile bottom tab bar */}
        <nav aria-label="Main" className="safe-bottom fixed inset-x-0 bottom-0 z-30 px-3 pb-3 lg:hidden">
          <ul className="mx-auto grid max-w-md grid-cols-5 rounded-[1.75rem] bg-ink-900/95 p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-md">
            {NAV.map(({ to, label, icon: Icon, ...rest }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={'end' in rest}
                  className={({ isActive }) =>
                    cx('flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[1.4rem] text-[0.7rem] font-semibold tracking-wide transition-colors', isActive ? 'bg-bone-50/10 text-ochre-200' : 'text-bone-100/70')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="grid h-7 w-10 place-items-center">
                        <Icon size={21} aria-hidden strokeWidth={isActive ? 2.4 : 2} />
                      </span>
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
