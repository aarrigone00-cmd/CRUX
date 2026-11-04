# CRUX

**Train. Fuel. Thrive.**

CRUX is an integrated wellness and athletic-performance app for active women. It brings menstrual health, ADHD-friendly planning, mood and energy, nutrition, rock climbing, strength, mobility and recovery into one calm, mobile-first experience.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Project setup, design system, navigation, Home dashboard | ✅ Done |
| 2 | Supabase auth, profiles, persistent data, row-level security | ⏳ Next |
| 3 | CYCLE, MIND, MOVE, CLIMB, PREP, FUEL | Previews only |
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
- **Supabase (Phase 2).** Provides Postgres, auth and row-level security.
- **Google Gemini (Phase 4).** Reached only through a Supabase Edge Function.

### Why a PWA first, not a native app?

A PWA is one codebase that runs on iPhone, Android and laptop. It can be shared with a link, deploys on Netlify in seconds, and needs no app-store review, which suits a class demo and fast iteration. Native-only features come later: Apple HealthKit has no web API, and Android Health Connect is native-only too. When CRUX needs them, the same React and TypeScript code can be wrapped with **Capacitor**, so nothing is thrown away.

### Project layout

```
src/
  index.css            editorial design tokens (paper, ink, mustard, sky, cocoa, clay, oxblood)
  main.tsx             routes
  components/          Layout/navigation, UI primitives, charts, logo
  data/store.tsx       app state (Phase 1: localStorage; Phase 2: Supabase)
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
