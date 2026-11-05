-- CRUX core schema (Phase 2).
-- Every table is owned per user and protected by row-level security:
-- a signed-in person can only read and write their own rows.

-- ── Profiles ──────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 40),
  focus_activities text[] not null default array['Bouldering', 'Strength', 'Yoga'],
  guide_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Daily check-ins (one per user per day) ────────────────
create table public.check_ins (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  mood smallint not null check (mood between 1 and 5),
  energy smallint not null check (energy between 1 and 5),
  stress smallint not null check (stress between 1 and 5),
  sleep_hours numeric(3, 1) not null check (sleep_hours between 0 and 24),
  pain text[] not null default '{}',
  note text check (char_length(note) <= 500),
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- ── Daily priorities (app caps these at three per day) ────
create table public.priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  text text not null check (char_length(text) between 1 and 80),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index priorities_user_date_idx on public.priorities (user_id, date);

-- ── Planned / completed workouts ──────────────────────────
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  type text not null check (char_length(type) <= 40),
  title text not null default '' check (char_length(title) <= 60),
  duration_min integer not null check (duration_min between 1 and 1440),
  intensity text not null check (intensity in ('easy', 'moderate', 'hard')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create index workouts_user_date_idx on public.workouts (user_id, date);

-- ── Row-level security ────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.check_ins enable row level security;
alter table public.priorities enable row level security;
alter table public.workouts enable row level security;

create policy "Own profile: read"   on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Own profile: insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "Own profile: update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Own check-ins" on public.check_ins for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own priorities" on public.priorities for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Own workouts" on public.workouts for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ── Keep updated_at fresh ─────────────────────────────────
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger check_ins_touch before update on public.check_ins for each row execute function public.touch_updated_at();

-- ── Create a profile automatically when someone signs up ──
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'given_name', split_part(coalesce(new.raw_user_meta_data ->> 'full_name', ''), ' ', 1), ''), 40)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ── User-controlled deletion: erase the account and all data ──
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  -- cascades remove profile, check-ins, priorities and workouts
  delete from auth.users where id = auth.uid();
end;
$$;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
