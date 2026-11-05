-- CRUX CLIMB (Phase 3): climbing sessions, individual climbs, and climbing goals.
-- Grades are stored as an index on one canonical scale per discipline
-- (boulders: V-scale index; routes: YDS index) so the app can display V/Font or YDS/French.

alter table public.profiles
  add column boulder_scale text not null default 'V' check (boulder_scale in ('V', 'Font')),
  add column route_scale text not null default 'YDS' check (route_scale in ('YDS', 'French'));

create table public.climb_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  discipline text not null check (discipline in ('boulder', 'sport', 'top_rope', 'trad')),
  setting text not null check (setting in ('indoor', 'outdoor')),
  location text not null default '' check (char_length(location) <= 80),
  duration_min integer check (duration_min between 1 and 1440),
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);
create index climb_sessions_user_date_idx on public.climb_sessions (user_id, date);

create table public.climbs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id uuid not null references public.climb_sessions (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 80),
  grade_index smallint not null check (grade_index between 0 and 40),
  attempts smallint not null default 1 check (attempts between 1 and 999),
  outcome text not null check (outcome in ('flash', 'onsight', 'redpoint', 'project')),
  notes text not null default '' check (char_length(notes) <= 300),
  created_at timestamptz not null default now()
);
create index climbs_user_idx on public.climbs (user_id);
create index climbs_session_idx on public.climbs (session_id);

create table public.climb_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  discipline text not null check (discipline in ('boulder', 'route')),
  target_index smallint not null check (target_index between 0 and 40),
  target_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index climb_goals_user_idx on public.climb_goals (user_id);

alter table public.climb_sessions enable row level security;
alter table public.climbs enable row level security;
alter table public.climb_goals enable row level security;

create policy "Own climb sessions" on public.climb_sessions for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- A climb must belong to the user AND to one of the user's own sessions.
create policy "Own climbs" on public.climbs for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.climb_sessions s where s.id = session_id and s.user_id = (select auth.uid()))
  );

create policy "Own climb goals" on public.climb_goals for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
