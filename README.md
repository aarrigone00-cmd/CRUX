# CRUX

**Train. Fuel. Thrive.**

CRUX is an integrated wellness and athletic-performance app for active women. It brings menstrual health, ADHD-friendly planning, mood and energy, nutrition, rock climbing, strength, mobility and recovery into one calm, mobile-first experience.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Project setup, design system, navigation, Home dashboard | ✅ Done |
| 2 | Supabase auth, profiles, persistent data, row-level security | ✅ Done |
| 3 | CYCLE, MIND, MOVE, CLIMB, PREP, FUEL | ⏳ Next |
| 4 | CRUX GUIDE (Gemini via secure backend) | Interface built, backend pending |
| 5 | Testing, mobile polish, class demo | — |

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. To try it on your phone, connect to the same Wi‑Fi and open the "Network" URL Vite prints.

To check the production build:

```bash
npm run build
npm run preview
```

On the Home screen, tap **Load demo data** to see a populated week.

## Tech stack and architecture

- **React 19, TypeScript and Vite.** Fast development server and production build.
- **Tailwind CSS v4.** Design tokens live in `src/index.css`.
- **Visual identity.** Poster-editorial: Anton condensed caps for headings, labels and the masthead; Barlow Condensed for body text, with no italics; flat high-contrast colour-block spreads (tomato red, cobalt, mustard, deep green, cocoa, ink) over CRUX's own ikat background. The Home index keeps its riso cards (DM Mono copy, plus brush, script and Bodoni display words). Original artwork lives in `Ridge.tsx`, `ClimbingWall.tsx`, `Holds.tsx` and `Doodle.tsx`, and `scripts/generate-ikat.cjs` generates `public/textures/ikat.webp`.
- **React Router.** Five-tab bottom navigation on phones and a sidebar on desktop.
- **Progressive Web App.** Includes a manifest, icons and a service worker (`public/sw.js`), so CRUX can be installed to the home screen and the app shell still loads offline.
- **Supabase.** Provides Postgres, auth (email/password and Google) and row-level security. The schema lives in `supabase/migrations/`.
- **Google Gemini (Phase 4).** Reached only through a Supabase Edge Function.

### Why a PWA first, not a native app?

A PWA is one codebase that runs on iPhone, Android and laptop. It can be shared with a link, deploys on Netlify in seconds, and needs no app-store review, which suits a class demo and fast iteration. Native-only features come later: Apple HealthKit has no web API, and Android Health Connect is native-only too. When CRUX needs them, the same React and TypeScript code can be wrapped with **Capacitor**, so nothing is thrown away.

### Project layout

```
src/
  index.css            editorial design tokens (paper, ink, mustard, sky, cocoa, clay, oxblood)
  main.tsx             routes
  components/          Layout/navigation, UI primitives, charts, logo
  data/auth.tsx        sign-in / sign-up / Google / guest mode
  data/store.tsx       app state: Supabase when signed in, localStorage for guests
  data/remote.ts       Supabase queries (row ↔ app type mapping)
  lib/types.ts         data model, which mirrors the planned DB tables
  lib/suggestions.ts   rule-based recovery and fuel reminders
  lib/guide.ts         CRUX GUIDE client (talks only to our backend)
  pages/               Home, Train (Move/Climb/Prep), Fuel, Cycle, Mind, Guide, Settings
```

## Product principles built into the code

- **Cycle-neutral suggestions.** CRUX never infers hormone levels or performance from cycle dates. Suggestions come from how the user says they feel.
- **Pain-aware.** Reported pain areas steer suggestions away from loading those areas. Persistent pain points the user to a professional.
- **No invented nutrition numbers.** Values will come from verified databases such as USDA FoodData Central.
- **ADHD-friendly.** Daily priorities are capped at three, tap targets are big, and defaults remove decisions.
- **AI transparency.** CRUX GUIDE requires consent first, labels every AI-generated reply, and gives no diagnoses or medication advice.
- **Correlation is not causation.** Charts describe what was logged.

## Accounts and data (Phase 2)

- **Sign-in options:** email and password, Google, or *try without an account* (guest mode, where data stays in that browser).
- **Tables:** `profiles`, `check_ins`, `priorities` and `workouts`, all with row-level security, so each person can only read or write their own rows. A trigger creates a profile on sign-up.
- **Deletion:** *Profile & privacy* lets you delete all logged data, or call `delete_my_account()` to permanently remove your login and every row you own.
- **Supabase project:** `CRUX` (`aubvnnhzvjqfnomkpvxl`). The URL and publishable key in `src/lib/supabase.ts` are public by design. Never add the service-role key to the app.

### Dashboard settings to finish (Supabase → Authentication)

1. **URL Configuration:** set *Site URL* to your Netlify URL, and add it plus `http://localhost:5173` to *Redirect URLs*.
2. **Email confirmations:** Supabase's built-in mailer only delivers to your project team and is rate-limited. For a class demo, turn **off** *Confirm email* (Sign In / Providers → Email), or connect your own SMTP.
3. **Google:** create an OAuth client in Google Cloud with redirect URI `https://aubvnnhzvjqfnomkpvxl.supabase.co/auth/v1/callback`, then enable the Google provider in Supabase with its client ID and secret.

## CLIMB (Phase 3, first module)

Train → Climb is live:

- **Session log:** bouldering, sport, top rope or trad; indoor or outdoor; location, duration and notes.
- **Climbs inside a session:** each has a grade, a result (flash, onsight, redpoint/send, or project) and an attempt count.
- **Grades:** V-scale or Font for boulders, YDS or French for routes. Grades are stored as a canonical index, so switching systems converts everything. Conversions are approximate.
- **Numbers and charts:** hardest boulder and route, sessions this month, send rate, a 90-day grade pyramid, and hardest send per month over six months.
- **Goals:** a goal ticks itself off when you log a send at or above its target grade, and otherwise can be ticked by hand.
- **Storage:** tables `climb_sessions`, `climbs` and `climb_goals`, all with row-level security. A climb can only be attached to one of your own sessions.

## Secrets

- Never commit `.env` files. `.gitignore` already excludes them, and `.env.example` documents the variables.
- `GEMINI_API_KEY` is **server-side only**. It goes in Supabase Edge Function secrets and must never get a `VITE_` prefix.

## Deploying

`netlify.toml` builds with `npm run build`, publishes `dist/`, and adds the single-page-app redirect.

## Image credits

Vintage photographs are loaded from Wikimedia Commons, and each is credited in-app under **Profile & privacy → Image credits** (the full list lives in `src/lib/photos.ts`). They include:

- **Rock climbing:** Smith Rock, Oregon, 1987 and 1989 slide film, by Tequask (CC BY-SA 4.0); climbers in Saxon Switzerland (the Maiturm after 1945, and a hanging traverse c. 1965) by Richard Peter / Deutsche Fotothek (CC BY-SA 3.0 DE).
- **Green landscapes (Mind):** 1973 Kodachrome landscapes from the U.S. EPA's DOCUMERICA project (Skagit River by Doug Wilson, Little Moose Lake by Anne LaBastille, Hood River Valley by David Falconer). Public domain, via the National Archives.
- **Outdoor fashion and leisure:** Toni Frissell's 1939–1959 work, including Montego Bay (1946), swim fashion (1950), the lighthouse shoot (1951), a 1955 beach picnic, and colour work for *Vogue* (1967) and Long Island (1968). These are public domain, or have no known restrictions via the Library of Congress.

If a photo can't load, the app falls back to its original illustrated artwork (`VintagePhoto.tsx`). Everything else (ridge, wall, holds, doodles, the ikat pattern) is original and generated in code.
